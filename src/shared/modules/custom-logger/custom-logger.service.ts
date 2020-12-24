import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { LoggingLevels } from './constants';
import * as clc from 'cli-color';
// import { Logger } from 'typeorm'

@Injectable()
export class CustomLoggerService implements LoggerService {
  private static winston: winston.Logger;

  public static initWinston() {
    CustomLoggerService.winston = winston.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.label({ label: 'Nest' }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ message, meta, label, timestamp }) => {
          const context = meta && meta.context || '';
          const trace = meta && meta.trace || '';

          const contextPrefix = `[${clc.green(label)}] ${clc.green('-')} ${timestamp}`;
          const formattedContext = `[${clc.yellow(context)}]`;

          return `${contextPrefix} ${formattedContext} ${message} ${trace}`;
        })
      )
    });

    return;
  }

  constructor() {
    CustomLoggerService.initWinston();
  }

  logThroughWinston(
    level: LoggingLevels,
    message: string,
    meta?: {
      trace?: string,
      context?: string,
    }
  ) {
    return CustomLoggerService.winston.log({
      level,
      message,
      meta
    });
  }

  log(message: string, context:string) {
    return this.logThroughWinston(LoggingLevels.Info, message, { context });
  }
  error(message: string, trace: string, context: string) {
    return this.logThroughWinston(LoggingLevels.Error, message, { trace, context });
  }
  warn(message: string, context: string) {
    return this.logThroughWinston(LoggingLevels.Warn, message, { context });
  }
  info(message: string, context: string) {
    return this.logThroughWinston(LoggingLevels.Info, message, { context });
  }
  debug(message: string, context: string) {
    return this.logThroughWinston(LoggingLevels.Debug, message, { context });
  }
}