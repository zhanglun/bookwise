import { Mark } from "@/helpers/marker/types";

export interface AdditionalInfos {
  book_id: number;
  id: number;
  read_progress: number;
  read_progress_updated_at: string;
  spine_index: string;
}

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
  authors: AuthorResItem[];
  publishers: PublisherResItem[];
  additional_infos: AdditionalInfos;
}

// export interface BookRequestItem {
//   title: string;
//   subject: string;
//   description: string;
//   contributor: string;
//   source: string;
//   rights: string;
//   language: string;
//   format: Format;
//   page_size: number;
//   isbn: string;
//   path: string;
//   publish_at: Date;
//   created_at: Date;
//   updated_at: Date;
//   authors: AuthorResItem[];
//   publishers: PublisherResItem[];
//   additional_infos: AdditionalInfos;
// }

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

export interface NoteResItem extends Mark {}
