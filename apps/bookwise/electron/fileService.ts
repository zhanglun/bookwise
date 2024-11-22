import { app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";
import type { FileTypeResult } from "file-type";
import AdmZip from "adm-zip";

interface FileData {
  name: string;
  metadata: {
    title: string;
    [key: string]: any;
  };
  cover?: string;
  buffer: ArrayBuffer;
  type: string;
}

function parseCover(
  cover: string,
  buffer: Buffer,
  fileType: string
): [buf: Buffer | null, str: string | null] {
  if (fileType === "application/pdf") {
    return [null, null]; // PDF files don't have cover images in this implementation
  }

  try {
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    const coverEntry = zipEntries.find((entry) => {
      const { entryName } = entry;
      const coverPathWithoutSlash = cover?.replace(/^\//, "") || "";
      return entryName.endsWith(coverPathWithoutSlash);
    });

    if (!coverEntry) {
      return [null, null];
    }

    const coverBuffer = coverEntry.getData();
    return [coverBuffer, coverBuffer.toString("base64")];
  } catch (error) {
    console.error("Error parsing cover:", error);
    return [null, null];
  }
}

function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function uploadFile(data: FileData) {
  const { name, metadata, cover, buffer, type } = data;
  const libPath = path.join(app.getPath("documents"), "BookWise Library 2");

  // Ensure library directory exists
  ensureDirectory(libPath);

  // Create book directory with sanitized title
  const sanitizedTitle = metadata.title.replace(/[<>:"/\\|?*]/g, "_");
  const bookDir = path.join(libPath, sanitizedTitle);
  ensureDirectory(bookDir);

  // Save the book file
  const fileDest = path.join(bookDir, name);
  const fileBuffer = Buffer.from(buffer);
  fs.writeFileSync(fileDest, fileBuffer);

  // Process cover image if available
  if (type === "application/epub+zip" && cover) {
    const [coverBuffer] = parseCover(cover, fileBuffer, type);
    if (coverBuffer) {
      fs.writeFileSync(path.join(bookDir, "cover.jpg"), coverBuffer);
    }
  }

  // Return book model with file path
  const bookModel = {
    ...metadata,
    path: fileDest,
    format: type === "application/pdf" ? "PDF" : "EPUB",
  };

  return {
    model: bookModel,
  };
}

export async function loadBookBlob(
  path: string
): Promise<FileTypeResult & { buffer: Buffer }> {
  const fileBuffer = fs.readFileSync(path);
  const fileMime = await fileTypeFromBuffer(fileBuffer);

  return { ...fileMime, buffer: fileBuffer } as FileTypeResult & {
    buffer: Buffer;
  };
}
