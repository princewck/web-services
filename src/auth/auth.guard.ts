import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express-serve-static-core";
import { jwtConstants } from "./constants";

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { };

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ message: '鉴权失败' })
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException({ message: '鉴权失败' })
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}