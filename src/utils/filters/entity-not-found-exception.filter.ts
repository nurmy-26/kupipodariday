import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { Response } from "express";
import { HttpStatus } from '@nestjs/common';
import { ERR_MESSAGE } from "../constants/error-messages";

@Catch(EntityNotFoundError) // для ошибок TypeORM если не найдена запрашиваемая сущность
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.NOT_FOUND; // 404

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      testMessage: exception.message, // todo - удалить когда всё будет готово (для инфо об ошибке)
      message: ERR_MESSAGE.INVALID_AUTH,
    });
  }
}
