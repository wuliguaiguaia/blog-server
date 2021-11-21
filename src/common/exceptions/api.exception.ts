/**
 * 自定义API异常
 */
import { ApiErrorCode, ApiErrorMap } from './api.code.enum';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  public errorCode: ApiErrorCode;
  public errorMessage: string;

  constructor(
    errorCode: ApiErrorCode,
    errorMessage = '',
    status: HttpStatus = HttpStatus.OK,
  ) {
    super(errorMessage, status);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage || ApiErrorMap[this.errorCode];
  }

  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
