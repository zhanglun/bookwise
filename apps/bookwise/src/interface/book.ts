export interface BookResItem {
  id: string;
  title: string;
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
  author: Author;
  publisher: Publisher;
}

export interface Author {
  id: string;
  name: string;
}
export interface Publisher {
  id: string;
  name: string;
}

export enum Format {
  Epub = "epub",
}