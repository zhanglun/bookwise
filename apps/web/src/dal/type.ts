import { BookRequestItem, BookResItem } from "@/interface/book";

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
}
