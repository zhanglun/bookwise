import { useState } from 'react';
import { Book } from 'epubjs';
import JSZip from 'jszip';
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

interface FileHandler {
  formatMetadata: (file: File) => Promise<[BookMetadata, string]>;
}

const epubHandler: FileHandler = {
  async formatMetadata(file: File): Promise<[BookMetadata, string]> {
    const book = new Book(file as unknown as string);
    const opened = (await book.opened) as Book & { cover: string };
    const { cover, packaging } = opened;
    const { metadata } = packaging;

    return [
      {
        title: metadata.title,
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
        authors: metadata.creator,
        publishers: metadata.publisher,
        publish_at: new Date(metadata.pubdate),
      },
      cover,
    ];
  },
};

const pdfHandler: FileHandler = {
  async formatMetadata(file: File): Promise<[BookMetadata, string]> {
    return [
      {
        title: file.name.replace('.pdf', ''),
        subject: '',
        description: '',
        contributor: '',
        identifier: '',
        source: '',
        rights: '',
        language: '',
        format: getFileFormatType(file),
        page_count: 0,
        isbn: '',
        authors: '',
        cover: '',
        publishers: '',
        publish_at: new Date(file.lastModified),
      },
      '',
    ];
  },
};

const fileHandlers: Record<string, FileHandler> = {
  'application/epub+zip': epubHandler,
  'application/pdf': pdfHandler,
};

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
  cover: string;
}
export interface UseFileUploadOptions {
  onSuccess?: (books: UploadFileBody[]) => void;
  acceptTypes?: string[];
}

async function parseCover(cover: string, blob: Blob): Promise<string | null> {
  const zip = new JSZip();
  const result = await zip.loadAsync(blob);
  const { files }: { files: { [key: string]: JSZip.JSZipObject } } = result;

  for (const filename in files) {
    if (cover.lastIndexOf(filename) !== -1) {
      const unit8 = await files[filename].async('base64');
      return unit8;
    }
  }

  return null;

  // const a = Object.keys(files).reduce(
  //   (acu, z) => {
  //     console.log('z.entry', z.entryName);
  //     if (z.entryName.lastIndexOf(cover) != -1) {
  //       acu = z.getData();
  //     }

  //     return acu;
  //   },
  //   null as unknown as Buffer
  // );

  // return [a, a.toString('base64')];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const { onSuccess, acceptTypes = ['.epub', '.pdf'] } = options;

  const processFiles = async (files: File[]) => {
    const body: UploadFileBody[] = [];

    for (const file of files) {
      const handler = fileHandlers[file.type];
      if (!handler) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const [metadata, cover] = await handler.formatMetadata(file);
      const buffer = await fileReaderAsync(file);
      const coverBase64 = await parseCover(cover, buffer as any);

      body.push({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        buffer: new Uint8Array(buffer),
        metadata,
        cover: coverBase64 as string,
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
