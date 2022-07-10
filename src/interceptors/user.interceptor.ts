import { CallHandler, createParamDecorator, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { User } from "../entities/user";

export interface EnhancedRequest extends Request {
  user?: User
}

export const UserCtx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<EnhancedRequest>();
    return request.user;
  },
);

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest<EnhancedRequest>();
    // @ts-ignore
    const userUUID = request.headers["user-uuid"] || "";
    return this.userService.findOrCreate(userUUID)
      .then( user => {
        request.user = user;
        return next.handle();
      })
      .catch(() => {
        return next.handle();
      });
  }
}