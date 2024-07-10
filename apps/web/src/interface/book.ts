import { Mark } from "@/helpers/marker/types";

export interface AdditionalInfos {
  book_id: number;
  id: number;
  read_progress: number;
  read_progress_updated_at: string;
  spine_index: string;
}

export interface BookResItem {
  id: number;
  title: string;
  subject: string;
  description: string;
  contributor: string;
  source: string;
  rights: string;
  language_id: string;
  format: typeof FileFormat[keyof typeof FileFormat];
  page_size: number;
  isbn: string;
  path: string;
  publish_at: Date;
  created_at: Date;
  updated_at: Date;
  authors: AuthorResItem[];
  publishers: PublisherResItem[];
  additional_infos: AdditionalInfos;
}

export interface BookRequestItem {
  title: string;
  subject: string;
  description: string;
  contributor: string;
  source: string;
  rights: string;
  language: string;
  format: typeof FileFormat[keyof typeof FileFormat];
  page_count: number;
  isbn: string;
  authors: string | string[];
  publisher: string | string[];
  publish_at: Date;
}

export interface BokUploadRequestItem {
  book: BookRequestItem;
  files: File;
  cover: string;
}

export interface AuthorResItem {
  id: number;
  name: string;
}
export interface PublisherResItem {
  id: number;
  name: string;
  _count: {
    books: number,
  }
}

export interface LanguageResItem {
  id: number;
  code: string;
  _count: {
    books: number,
  }
}

export const FileFormat = {
  EPUB: "EPUB",
  PDF: "PDF",
  MOBI: "MOBI",
  UNKNOWN: "UNKNOWN",
} as const;

export interface NoteResItem extends Mark {}
