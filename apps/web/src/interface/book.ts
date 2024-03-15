import { Mark } from "@/helpers/marker/types";

export interface BookResItem {
  id: string;
  title: string;
  cover: string;
  subject: string;
  description: string;
  contributor: string;
  source: string;
  rights: string;
  language_id: string;
  format: Format;
  page_size: number;
  isbn: string;
  path: string;
  publish_at: Date;
  created_at: Date;
  updated_at: Date;
  author: AuthorResItem;
  publisher: PublisherResItem;
}

export interface AuthorResItem {
  id: string;
  name: string;
}
export interface PublisherResItem {
  id: string;
  name: string;
}

export enum Format {
  Epub = "epub",
}


export interface NoteResItem extends Mark {
}
