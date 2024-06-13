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

    let entity: string;
    const regex = /entity of type "(.*?)"/;
    const match = exception.message.match(regex);
    if (match && match[1]) {
      entity = match[1];
    } else {
      entity = 'Unknown';
    }

    const status = HttpStatus.NOT_FOUND

    response.status(status).json({
      message: `${ERR_MESSAGE.ENTITY_NOT_FOUND}: ${entity}. ${ERR_MESSAGE.NOT_FOUND_HINT}`,
      error: 'Not Found',
      statusCode: status,
    });
  }
}