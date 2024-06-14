import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

// декоратор для получения user из request
export const AuthUser = createParamDecorator(
  // createParamDecorator - для создания декоратора
  // data - данные, которые передаешь в декоратор при вызове (unknown так как в data ничего не будет)
  // ctx - контекст, нужен для получения доступа к объекту req, res или next (как было в Express) и всем их свойствам
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest(); // получаем доступ к req

    return request.user;
  },
);

// todo - заменить user.id везде на userId
// будет возвращать только id пользователя, а не весь объект user
export const AuthUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();

    return request.user.id;
  },
);
