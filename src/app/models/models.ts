export interface SelectOption {
    label: string;
    value: string | number | string[] | number[];
}

export const enum SortOrderType {
  ASC = 'Ascending',
  DESC = 'Descending',
}

export interface SortBy {
  key: string;
  activeIndex: number;
  sortOrder: SortOrderType;
  type?: string;
}
export const DEFAULT_PAGE_SIZE = 10;

export interface PageState {
  data: any[];
  availableData: any[];
  displayedColumns: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sortOrder: SortBy;
  searchFields: string[];
  uniqueProperty: keyof any;
}
