import { CoverQueryRecord } from '@/dal/type';

export interface AdditionalInfos {
  book_uuid: string;
  id: number;
  read_progress: number;
  read_progress_updated_at: string;
  spine_index: string;
}

export interface BookCacheItem {
  book_uuid: string;
  book_title: string;
  is_active: number;
}

export interface BookResItem {
  uuid: string;
  title: string;
  identifier: string;
  subject: string;
  description: string;
  contributor: string;
  source: string;
  rights: string;
  language_id: string;
  format: (typeof FileFormat)[keyof typeof FileFormat];
  page_size: number;
  isbn: string;
  path: string;
  cover: CoverQueryRecord;
  publish_at: string;
  created_at: string;
  updated_at: string;
  authors: AuthorResItem[];
  publishers: PublisherResItem[];
  additional_infos: AdditionalInfos | null;
}

export interface BookMetadata {
  title: string;
  identifier: string;
  subject: string;
  description: string;
  contributor: string;
  source: string;
  rights: string;
  language: string;
  format: (typeof FileFormat)[keyof typeof FileFormat];
  page_count: number;
  isbn: string;
  cover: string;
  authors: string | string[];
  publishers: string | string[];
  publish_at: Date | string;
}

export interface BookUploadRequestItem {
  book: BookMetadata;
  files: File;
  cover: string;
}

export interface AuthorResItem {
  uuid: string;
  name: string;
}
export interface PublisherResItem {
  uuid: string;
  name: string;
  _count: {
    books: number;
  };
}

export interface LanguageResItem {
  uuid: string;
  code: string;
  name: string;
  _count: {
    books: number;
  };
}

export const FileFormat = {
  EPUB: 'EPUB',
  PDF: 'PDF',
  MOBI: 'MOBI',
  TEXT: 'TEXT',
  UNKNOWN: 'UNKNOWN',
} as const;
