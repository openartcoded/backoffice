export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface SortCriteria {
  direction: Direction;
  property: string;
}

export enum Direction {
  ASC, DESC
}

interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
}

export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: Sort;
  pageable: Pageable;
}
