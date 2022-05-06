/**
 * 全局检验入参
 */

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationException } from './../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      throw new ValidationException(errors);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
