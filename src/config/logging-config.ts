import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFile } from 'winston/lib/winston/transports';
import { WinstonModuleOptions } from 'nest-winston';

export const loggingConfig: WinstonModuleOptions = {
  levels: {
    critical_error: 0,
    error: 1,
    special_warning: 2,
    another_log_level: 3,
    info: 4,
  },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),

    // ошибки
    new DailyRotateFile({
      filename: 'log_error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '3d', // хранит только последние три дня
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // все запросы
    new DailyRotateFile({
      filename: 'requests-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '3d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};

// стандартный конфиг:
// {
//   levels: {
//     critical_error: 0,
//     error: 1,
//     special_warning: 2,
//     another_log_level: 3,
//     info: 4,
//   },
//   transports: [
//     new winston.transports.Console({ format: winston.format.simple() }),
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//   ],
// }
