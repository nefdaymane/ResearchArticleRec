export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data?: T;
  articles?: T;
  totalCount?: number;
}
