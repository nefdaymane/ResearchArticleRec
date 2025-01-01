import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let exceptionResponse: ApiResponse<null>;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      exceptionResponse = exception.getResponse() as ApiResponse<null>;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionResponse = {
        success: false,
        message: 'Internal server error, please try again later',
        statusCode: status,
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.error(
      `Exception thrown at ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      ...exceptionResponse,
      path: request.url,
    });
  }
}
