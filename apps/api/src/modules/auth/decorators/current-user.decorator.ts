import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserData {
  id: string;
  userId: string;
  email: string;
  employeeId: string | null;
  departmentId: string | null;
  roles: string[];
  permissions: string[];
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserData => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req || context.switchToHttp().getRequest();
    return req.user;
  },
);
