import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new HttpException(
          `Credênciais invalidas ou não fornecidas!`,
          HttpStatus.UNAUTHORIZED,
        );
      }

      // const tokenDados: any = decode(token);

      // const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      // if (currentTimestampInSeconds >= tokenDados.exp) {
      //   throw new HttpException(
      //     `Credênciais invalidas ou não fornecidas!`,
      //     HttpStatus.UNAUTHORIZED,
      //   );
      // }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Credênciais invalidas ou não fornecidas!`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
