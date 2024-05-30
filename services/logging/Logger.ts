import { LoggingStream } from "./LoggingStream";
import { LogLevels } from "./LogLevels";

export type LogItem = string | object;

type LoggerFunctions = {
  [Property in LogLevels]: (log_item: LogItem) => void;
};

export interface Logger extends LoggerFunctions {
  setDestination(logger_stream: LoggingStream): void;
}
