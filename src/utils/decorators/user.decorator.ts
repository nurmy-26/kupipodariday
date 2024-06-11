import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

// декоратор для получения user из request
export const AuthUser = createParamDecorator( // createParamDecorator - для создания декоратора
  // data - данные, которые передаешь в декоратор при вызове (unknown так как в data ничего не будет)
  // ctx - контекст, нужен для получения доступа к объекту req, res или next (как было в Express) и всем их свойствам
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest(); // получаем доступ к req

    return request.user;
  }
)

// если возвращать только id (а не объект user)
// export const AuthUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): number => {
//     const request = ctx.switchToHttp().getRequest();

//     return request.user.id;
//   }
// )