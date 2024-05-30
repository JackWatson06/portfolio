import type { Logger, LogItem } from "./Logger";
import { LogLevels } from "./LogLevels";
import { LoggingStream } from "./LoggingStream";

import { pino, type Logger as PinoLogger, type LoggerOptions } from "pino";

export class PortfolioLogger implements Logger {
  private pino: PinoLogger;

  private pino_options: LoggerOptions;

  constructor(name: string, lowest_level: LogLevels = LogLevels.INFO) {
    this.pino_options = {
      name,
      level: lowest_level,
    };

    this.pino = pino(this.pino_options);
  }

  public setDestination(logger_stream: LoggingStream) {
    this.pino = pino(this.pino_options, logger_stream);
  }

  public debug(log_item: LogItem) {
    this.pino.debug(log_item);
  }

  public info(log_item: LogItem) {
    this.pino.info(log_item);
  }

  public warn(log_item: LogItem) {
    this.pino.warn(log_item);
  }

  public error(log_item: LogItem) {
    this.pino.error(log_item);
  }
}
