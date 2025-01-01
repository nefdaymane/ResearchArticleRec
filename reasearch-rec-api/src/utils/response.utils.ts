import { ApiResponse } from '../common/interfaces/api-response.interface';

export function generateErrorResponse(message: string): ApiResponse<null> {
  return {
    success: false,
    message: message,
  };
}

export function generateSuccessResponse<T>(
  data: T,
  message: string,
): ApiResponse<T> {
  return {
    success: true,
    message: message,
    data: data,
  };
}
