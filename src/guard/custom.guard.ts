import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class CustomGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers('test')) {
      return true;
    }
    return false;
  }

}