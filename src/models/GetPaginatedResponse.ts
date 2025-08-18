export interface GetPaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
