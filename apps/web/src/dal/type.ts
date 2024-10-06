import { BookRequestItem, BookResItem } from "@/interface/book";

export interface UploadFileBody {
  file: string;
  metadata: BookRequestItem;
  cover: string;
}

export type QueryBookFilter = {
  id?: number;
  title?: string;
  author?: string;
  publishedAt?: Date | { gt?: Date; lt?: Date; gte?: Date; lte?: Date };
};
export interface DataSource {
  uploadFile: (body: UploadFileBody) => Promise<void>;
  getBooks: (filter: QueryBookFilter) => Promise<BookResItem[]>;
  getBookByUuid: (uuid: string) => Promise<BookResItem>;
}
