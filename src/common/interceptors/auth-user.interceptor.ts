import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler):  Observable<any> {
    return next.handle();
  }
}
