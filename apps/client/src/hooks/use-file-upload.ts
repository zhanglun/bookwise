import { useState } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { toast } from 'sonner';
import { BookMetadata, FileFormat } from '@/interface/book';

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

// interface FileHandler {
//   formatMetadata: (file: File) => Promise<[BookMetadata, string]>;
// }

// const epubHandler: FileHandler = {
//   async formatMetadata(file: File): Promise<[BookMetadata, string]> {
//     const book = new Book(file as unknown as string);
//     const opened = (await book.opened) as Book & { cover: string };
//     const { cover, packaging } = opened;
//     const { metadata } = packaging;

//     return [
//       {
//         title: metadata.title,
//         subject: '',
//         description: metadata.description,
//         contributor: '',
//         identifier: metadata.identifier,
//         source: '',
//         rights: '',
//         language: metadata.language,
//         format: getFileFormatType(file),
//         page_count: 0,
//         isbn: '',
//         cover,
//         authors: metadata.creator,
//         publishers: metadata.publisher,
//         publish_at: new Date(metadata.pubdate),
//       },
//       cover,
//     ];
//   },
// };

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
  onSuccess?: (books: UploadFileBody[]) => void;
  acceptTypes?: string[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const { onSuccess, acceptTypes = ['.epub', '.pdf'] } = options;

  const processFiles = async (files: File[]) => {
    const body: UploadFileBody[] = [];

    for (const file of files) {
      const book = await makeBook(file as unknown as string);
      const metadata = book.metadata;
      console.log('🚀 ~ processFiles ~ metadata:', metadata);
      const cover = await book.getCover();
      const coverBuffer = cover ? new Uint8Array(await cover.arrayBuffer()) : null;

      const buffer = await fileReaderAsync(file);

      body.push({
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
      });
    }

    return body;
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setIsUploading(true);
      const body = await processFiles(files);

      onSuccess && onSuccess(body);
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
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
    openFileDialog,
    uploadFiles,
  };
}
