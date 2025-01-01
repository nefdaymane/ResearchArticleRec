export interface ApiError {
  success: boolean; // Indicates the operation status
  message: string; // Describes the error
  statusCode: number; // HTTP status code
  timestamp: string; // Timestamp of the error
  path?: string; // The path where the error occurred
}

export interface AxiosErrorWithResponse extends Error {
  response?: {
    data: ApiError;
    status: number;
    statusText: string;
  };
}
