import { BookRequestItem, BookResItem } from "@/interface/book";
import { useState } from "react";
import { Book } from "epubjs";
import { getFileFormatType } from "@/helpers/epub";
import { dal } from "@/dal";
import { UploadFileBody } from "@/dal/type";
import { toast } from "sonner";

interface FileHandler {
  formatMetadata: (file: File) => Promise<[BookRequestItem, string]>;
}

const epubHandler: FileHandler = {
  async formatMetadata(file: File): Promise<[BookRequestItem, string]> {
    const book = new Book(file as unknown as string);
    const opened = (await book.opened) as Book & { cover: string };
    const { cover, packaging } = opened;
    const { metadata } = packaging;

    return [
      {
        title: metadata.title,
        subject: "",
        description: metadata.description,
        contributor: "",
        identifier: metadata.identifier,
        source: "",
        rights: "",
        language: metadata.language,
        format: getFileFormatType(file),
        page_count: 0,
        isbn: "",
        authors: metadata.creator,
        publisher: metadata.publisher,
        publish_at: new Date(metadata.pubdate),
      },
      cover,
    ];
  },
};

const pdfHandler: FileHandler = {
  async formatMetadata(file: File): Promise<[BookRequestItem, string]> {
    return [
      {
        title: file.name.replace(".pdf", ""),
        subject: "",
        description: "",
        contributor: "",
        identifier: "",
        source: "",
        rights: "",
        language: "",
        format: getFileFormatType(file),
        page_count: 0,
        isbn: "",
        authors: "",
        publisher: "",
        publish_at: new Date(file.lastModified),
      },
      "",
    ];
  },
};

const fileHandlers: Record<string, FileHandler> = {
  "application/epub+zip": epubHandler,
  "application/pdf": pdfHandler,
};

async function fileReaderAsync(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

export interface UseFileUploadOptions {
  onSuccess?: (book: BookResItem) => void;
  acceptTypes?: string[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const { onSuccess, acceptTypes = [".epub", ".pdf"] } = options;

  const processFiles = async (files: File[]) => {
    const body: UploadFileBody[] = [];

    for (const file of files) {
      const handler = fileHandlers[file.type];
      if (!handler) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const [metadata, cover] = await handler.formatMetadata(file);
      const buffer = await fileReaderAsync(file);

      body.push({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        buffer,
        metadata,
        cover,
      });
    }

    return body;
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setIsUploading(true);
      const body = await processFiles(files);
      await dal.uploadFile(body);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = acceptTypes.join(",");

    input.addEventListener(
      "change",
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
