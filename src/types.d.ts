declare const DEBUG: DEBUG;
declare const INFO: INFO;
declare const WARNING: WARNING;
declare const ERROR: ERROR;
declare const FATAL: FATAL;

interface Log {
  notify(message: string): void;
  throw(e: Error): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warning(...args: any[]): void;
  error(...args: any[]): void;
  fatal(...args: any[]): void;
  printObject(obj: any): void;
}

declare const TASK_CREATED: TASK_CREATED;
declare const TASK_WAITING: TASK_WAITING;
declare const TASK_ASSIGNED: TASK_ASSIGNED;
declare const TASK_WORKING: TASK_WORKING;
declare const TASK_COMPLETE: TASK_COMPLETE;
declare const TASK_INVALID: TASK_INVALID;

interface Task {
  taskId: string;
  taskName: string;
  taskType: string;
  publisher: {
    id: string;
  };
  target: {
    id: string;
  };
  options: {

  };
  data: {

  };
  taskTime: number;
  taskState: number;
  creepName: string;
}

interface Bulletin {
  taskCount: number;
  publish(name: string,
          type: string,
          publisher: { id: string; },
          target: { id: string; },
          priority: number,
          options: object,
          data: object): Task;
  getTask(): Task;
  getTaskByType(type: string): Task;
}

interface global {
  log: Log;
  bulletin: Bulletin;
  settings: {
    log: {
      level: string
    }
  }
}
