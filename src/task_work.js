const Task = require('./task');
const TaskHarvest = require('./task_harvest');

/**
 * 定义任务操作对象
 */
module.exports = class TaskWork {

  constructor(source, target, priority, options) {
    this.task = new Task(source, target, priority, options);
    if (!Memory.tasks) {
      Memory.tasks = {};
    }
    Memory.tasks[this.task.taskId] = this.task;
  }

  static fromTask(task) {
    this.task = task;
    let work = null;
    switch(this.task.taskType) {
      case TASK_HARVEST: work = new TaskHarvest(); break;
    }
    if (work) {
      work.task = task;
    }
    return work;
  }

  static createTask() {

  }

  /**
   * 设置任务的执行人
   * @param {object} executor
   */
  setExecutor(executor) {
    let exec = Game.getObjectById(executor.id);
    if (!exec) {
      global.log.warning(`Invalid executor id ${executor.id}`)
      return;
    }
    if (exec.canAssign(this.task)) {
      this.task.executor = executor;
      exec.workTask = this.task;
    }
  }

  /**
   * 标志任务已经完成
   */
  complete() {
    this.task.hasCompleted = true;
    let exec = Game.getObjectById(this.task.executor.id);
    if (exec) {
      exec.workTask = null;
    }
  }

  /**
   * 验证任务是否有效
   */
  isValid() {
    // 是否超过有效期
    if (Game.time - this.task.taskTime > global.tasks[this.task.taskType].max_period) {
      return false;
    }
    global.bulletin.warning('Abstract task.');
    return false;
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    global.bulletin.warning('Abstract task.');
    return false;
  }
}
