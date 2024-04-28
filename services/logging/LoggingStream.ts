
import { EventEmitter } from "stream";

export interface LoggingStream extends EventEmitter{
  write(msg: string): void;
}   
