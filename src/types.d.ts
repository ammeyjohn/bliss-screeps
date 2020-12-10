declare const DEBUG: number;
declare const INFO: number;
declare const WARNING: number;
declare const ERROR: number;
declare const FATAL: number;

interface Log {
  notify(message: string): void;
  throw(e: error): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warning(...args: any[]): void;
  error(...args: any[]): void;
  fatal(...args: any[]): void;
  printObject(obj: any): void;
}

declare global {
  log: Log;
  settings: {
    log: {
      level: string
    }
  }
}
