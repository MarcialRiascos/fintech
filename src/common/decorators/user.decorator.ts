import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // 👇 Fuerza el tipo `any` para evitar el error
    const user = (request as any).user;

    return data ? user?.[data] : user;
  },
);