export interface BaseModel {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationOptions<Filter> {
  page?: number;
  pageSize?: number;
  search?: string;
  searchField?: string | number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
