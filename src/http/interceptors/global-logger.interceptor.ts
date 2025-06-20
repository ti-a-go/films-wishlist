import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { RequestWithUser } from '../../auth/auth.guard';
import { LogEntity } from '../../log/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(LogEntity)
    private readonly userLogRepository: Repository<LogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const log = {};

    const request = httpContext.getRequest<Request | RequestWithUser>();
    const { method, url } = request;
    log['method'] = method;
    log['url'] = url;

    const timestamp = Date.now();
    log['timestamp'] = timestamp;

    return next.handle().pipe(
      map((data) => {
        if (data?.wishlist?.wishes?.length > 0) {
          const filmIds = data.wishlist.wishes.map((wish) => {
            if (wish.film) {
              return wish.film.id;
            }
          });
          log['filmIds'] = filmIds;
        }

        log['status'] = context.switchToHttp().getResponse().statusCode;

        this.userLogRepository.save(log);
        console.log(JSON.stringify(log));

        return { data };
      }),
    );
  }
}
