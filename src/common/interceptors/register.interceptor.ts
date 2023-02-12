import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import _ from 'lodash';
import { map, Observable } from 'rxjs';

@Injectable()
export class RegisterInterceptor<T> implements NestInterceptor<T, Partial<T>> {
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<Partial<T>> {
    return next.handle().pipe(map((data: T) => {
      return _.pick(data, ['walletAddress', 'phoneNumber']);
    }));
  }
}
