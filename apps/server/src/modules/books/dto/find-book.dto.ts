export class QueryBookDto {
}


export class AddBookDto {

}

export type PaginatedResource<T> = {
  total: number;
  items: T[];
  // page: number;
  // size: number;
};
