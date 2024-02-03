export type AuthorUuid = string;
export type PublishUuid = string;

export interface BookModel {
  uuid: string;
  title: string;
  author: AuthorUuid;
  publisher: PublishUuid;
  description: string;
  contributor: string;
  source: string;
  rights: string;

}

export function saveBookInfo(info: BookModel) {

}
