import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ResetPasswordGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user || !user.isPasswordReset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    return user;
  }
}