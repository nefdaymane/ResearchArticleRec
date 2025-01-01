import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    const response: ApiResponse<null> = {
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    super(response, statusCode);
  }
}
