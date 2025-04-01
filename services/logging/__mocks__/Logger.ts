import { Logger, LogItem } from "../Logger";
import { LoggingStream } from "../LoggingStream";

export class MockLogger implements Logger {
  public last_debug_log: LogItem = "";
  public last_info_log: LogItem = "";
  public last_warn_log: LogItem = "";
  public last_error_log: LogItem = "";

  setDestination(logger_stream: LoggingStream) {}
  debug(log_item: LogItem) {
    this.last_debug_log = log_item;
  }
  info(log_item: LogItem) {
    this.last_info_log = log_item;
  }
  warn(log_item: LogItem) {
    this.last_warn_log = log_item;
  }
  error(log_item: LogItem) {
    this.last_error_log = log_item;
  }
  reset() {
    this.last_debug_log = "";
    this.last_info_log = "";
    this.last_warn_log = "";
    this.last_error_log = "";
  }
}
