/**
 * 验证自定义异常类
 */
import { ValidationError } from 'class-validator';
import { ApiErrorCode, ApiErrorMap } from './api.code.enum';
import { ApiException } from './api.exception';

export class ValidationException extends ApiException {
  public errors: ValidationError[];
  public errorMessage: string = ApiErrorMap[ApiErrorCode.PARAM_ERROR];

  constructor(errors: ValidationError[]) {
    super(ApiErrorCode.PARAM_ERROR);
    this.errors = errors;
  }

  getErrorMessage(): string {
    const detatils = [];
    this.errors.forEach((error) => {
      const { constraints } = error;
      for (const value of Object.values(constraints)) {
        detatils.push(value);
      }
    });
    return this.errorMessage + '：' + detatils.join('、');
  }
}
