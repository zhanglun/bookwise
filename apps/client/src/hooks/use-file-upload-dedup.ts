import { useState, useRef, useCallback } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { toast } from 'sonner';
import { BookMetadata, FileFormat } from '@/interface/book';
import { dal } from '@/dal';

export function getFileFormatType(file: File): (typeof FileFormat)[keyof typeof FileFormat] {
  const mimeType = file.type;
  const formatTypes: {
    [type: string]: (typeof FileFormat)[keyof typeof FileFormat];
  } = {
    'application/pdf': FileFormat.PDF,
    'application/epub+zip': FileFormat.EPUB,
  };

  for (const key in formatTypes) {
    if (mimeType.startsWith(key)) {
      return formatTypes[key];
    }
  }

  return FileFormat.UNKNOWN;
}

async function fileReaderAsync(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  });
}

export interface UploadFileBody {
  name: string;
  size: number;
  type: string;
  lastModified: Date | number;
  buffer: Uint8Array;
  metadata: BookMetadata;
  cover: Uint8Array | null;
}

export interface UseFileUploadOptions {
  onSuccess?: () => void;
  acceptTypes?: string[];
}

// 生成书籍的唯一标识
function generateBookKey(metadata: BookMetadata): string {
  const title = (metadata.title || '').trim().toLowerCase();
  const author = (metadata.authors?.[0] || '').trim().toLowerCase();
  const format = metadata.format || '';
  return `${title}::${author}::${format}`;
}

export function useFileUploadWithDedup(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentBookName, setCurrentBookName] = useState('');
  const existingBooksRef = useRef<Set<string>>(new Set());
  const { onSuccess, acceptTypes = ['.epub', '.pdf'] } = options;

  // 初始化已存在的书籍列表
  const initExistingBooks = useCallback(async () => {
    try {
      const books = await dal.getBooks({});
      existingBooksRef.current = new Set(
        books.map((book) => {
          const title = (book.title || '').trim().toLowerCase();
          const author = (book.authors?.[0]?.name || '').trim().toLowerCase();
          const format = book.format || '';
          return `${title}::${author}::${format}`;
        })
      );
    } catch (error) {
      console.error('Failed to load existing books:', error);
    }
  }, []);

  const processFiles = async (files: File[]): Promise<UploadFileBody[]> => {
    const body: UploadFileBody[] = [];
    const duplicates: string[] = [];
    
    // 确保已加载现有书籍
    if (existingBooksRef.current.size === 0) {
      await initExistingBooks();
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentBookName(file.name);
      setProgress({ current: i + 1, total: files.length });

      try {
        const book = await makeBook(file as unknown as string);
        const metadata = book.metadata;
        
        // 生成书籍 key 用于去重
        const bookKey = generateBookKey({
          title: metadata.title || file.name,
          authors: [metadata.author?.name],
          format: getFileFormatType(file),
        } as BookMetadata);

        // 检查是否已存在
        if (existingBooksRef.current.has(bookKey)) {
          duplicates.push(metadata.title || file.name);
          continue;
        }

        const cover = await book.getCover();
        const coverBuffer = cover ? new Uint8Array(await cover.arrayBuffer()) : null;
        const buffer = await fileReaderAsync(file);

        const uploadBody: UploadFileBody = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          buffer: new Uint8Array(buffer),
          metadata: {
            title: metadata.title || file.name,
            subject: '',
            description: metadata.description,
            contributor: '',
            identifier: metadata.identifier,
            source: '',
            rights: '',
            language: metadata.language,
            format: getFileFormatType(file),
            page_count: 0,
            isbn: '',
            cover,
            authors: [metadata.author?.name],
            publishers: [metadata.publisher?.name],
            publish_at: new Date(metadata.published || Date.now()),
          },
          cover: coverBuffer,
        };

        body.push(uploadBody);
        
        // 添加到已存在集合，防止本次上传重复
        existingBooksRef.current.add(bookKey);
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        toast.error(`处理文件失败: ${file.name}`);
      }
    }

    return { body, duplicates };
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      setProgress({ current: 0, total: files.length });
      
      const { body, duplicates } = await processFiles(files);

      if (body.length === 0) {
        if (duplicates.length > 0) {
          toast.info(`以下 ${duplicates.length} 本书已存在，已跳过：\n${duplicates.join('\n')}`);
        }
        setIsUploading(false);
        return;
      }

      // 保存书籍
      const successBooks: string[] = [];
      const failedBooks: string[] = [];

      for (let i = 0; i < body.length; i++) {
        const book = body[i];
        setCurrentBookName(book.metadata.title || book.name);
        setProgress({ current: i + 1, total: body.length });
        
        try {
          await dal.saveBookAndRelations(book.metadata, book.buffer, book.cover);
          successBooks.push(book.metadata.title || book.name);
        } catch (error) {
          console.error(`Failed to save book ${book.name}:`, error);
          failedBooks.push(book.metadata.title || book.name);
        }
      }

      // 显示结果提示
      if (successBooks.length > 0) {
        const message = `成功上传 ${successBooks.length} 本书：\n${successBooks.join('\n')}`;
        if (failedBooks.length > 0) {
          toast.success(message + `\n\n失败 ${failedBooks.length} 本：\n${failedBooks.join('\n')}`);
        } else if (duplicates.length > 0) {
          toast.success(message + `\n\n已跳过 ${duplicates.length} 本重复书籍`);
        } else {
          toast.success(message);
        }
      }

      if (failedBooks.length > 0 && successBooks.length === 0) {
        toast.error(`上传失败：\n${failedBooks.join('\n')}`);
      }

      onSuccess?.();
    } catch (error) {
      toast.error(`上传过程出错: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
      setProgress({ current: 0, total: 0 });
      setCurrentBookName('');
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = acceptTypes.join(',');

    input.addEventListener(
      'change',
      async (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          await uploadFiles(Array.from(files));
        }
      },
      false
    );

    input.click();
  };

  return {
    isUploading,
    progress,
    currentBookName,
    openFileDialog,
    uploadFiles,
  };
}
