import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, UserStatus } from '../../../common/enums/user-role';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Ensure user exists
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if the user is active
    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Check if a user has a required role
    const hasRequiredRole = requiredRoles.some(role => user.role === role);

    return hasRequiredRole;
  }
}