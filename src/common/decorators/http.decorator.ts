import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { RoleEnum } from '../enums';
import { RolesGuard } from '../guards';
import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';

import { Roles } from './roles.decorator';

export function Auth(role: string = RoleEnum.USER): MethodDecorator {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(role, RoleEnum.ADMIN),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
