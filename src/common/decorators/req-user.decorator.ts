import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from 'typings/request';

export const ReqUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request: RequestUser = context.switchToHttp().getRequest<RequestUser>();

    return request.user;
  },
);
