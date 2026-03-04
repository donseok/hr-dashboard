import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RlsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req || context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // EXECUTIVE and ADMIN can access all data
    if (user.roles?.includes('EXECUTIVE') || user.roles?.includes('ADMIN') || user.roles?.includes('HR_SPECIALIST')) {
      return true;
    }

    // MANAGER can only access their department data
    // Actual filtering is done at the service/repository level using user.departmentId
    return true;
  }
}
