import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Username Decorator para extraer el nombre de usuario.
 */
export const Username = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { username } = request.user;
  return username;
});

/**
 * User Decorator para inyectar el user en los parametros de los controladores.
 */
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
