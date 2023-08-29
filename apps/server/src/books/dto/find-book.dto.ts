export class QueryBookDto {
}


export type PaginatedResource<T> = {
  total: number;
  items: T[];
  // page: number;
  // size: number;
};
