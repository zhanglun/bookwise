import {
  AuthorResItem,
  BookRequestItem,
  BookResItem,
  FileFormat,
} from "@/interface/book";

export interface UploadFileBody {
  name: string;
  size: number;
  type: string;
  lastModified: Date | number;
  buffer: string | ArrayBuffer | null;
  metadata: BookRequestItem;
  cover: string;
}

export type QueryBookFilter = {
  uuid?: string;
  title?: string;
  author?: string;
  publish_at?: Date & { gt?: Date; lt?: Date; gte?: Date; lte?: Date };
};
export interface DataSource {
  uploadFile: (files: UploadFileBody[]) => Promise<void>;
  getBooks: (filter: QueryBookFilter) => Promise<BookResItem[]>;
  getBookByUuid: (uuid: string) => Promise<BookResItem>;
  saveBookAndRelations: (model: BookRequestItem) => Promise<BookResItem>;
  removeBookCache: (uuid: string) => Promise<void>;
  getAuthors: () => Promise<AuthorResItem[]>;
  updateBook: (
    model: { uuid: string } & Partial<BookRequestItem>
  ) => Promise<void>;
}

export type AuthorQueryRecord = {
  name: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
};

export type PublisherQueryRecord = {
  name: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
};

export type AdditionalInfoQueryRecord = {
  book_uuid: string;
  id: number;
  read_progress: number;
  read_progress_updated_at: string;
  spine_index: string;
};

export type BookQueryRecord = {
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
  publish_at: Date;
  created_at: Date;
  updated_at: Date;
  authors: AuthorQueryRecord[];
  publishers: PublisherQueryRecord[];
  additional_infos: AdditionalInfoQueryRecord | null;
  bookAuthors?: (AuthorQueryRecord & {
    bookAuthors: AuthorQueryRecord;
    author: AuthorQueryRecord;
  })[];
  bookPublishers?: (PublisherQueryRecord & {
    bookPublishers: PublisherQueryRecord;
    publisher: PublisherQueryRecord;
  })[];
};
