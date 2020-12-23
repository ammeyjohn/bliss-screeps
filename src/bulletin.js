const Task = require('./task');

/**
 * 定义公告板对象，用于保存和管理任务
 */

class Bulletin {
  constructor() {
    if (!Memory.tasks) {
      Memory.tasks = [];
    }
  }

  get tasks() {
    return Memory.tasks;
  }
  set tasks(value) {
    Memory.tasks = value;
  }

  get taskCount() {
    return Memory.tasks.length;
  }

  /**
   * 创建任务
   * @param {*} taskType
   * @param {*} sourceId
   * @param {*} targetId
   * @param {*} options
   */
  createTask(taskType, sourceId, targetId, options) {
    return new Task(taskType, sourceId, targetId, options);
  }

  /**
   * 发布任务
   * @param {*} taskType
   * @param {*} sourceId
   * @param {*} targetId
   * @param {*} options
   */
  publish(taskType, sourceId, targetId, options) {
    const task = new Task(taskType, sourceId, targetId, options);
    log.debug(`Task created: ${task.taskId}; Task count = ${this.taskCount}`);
    this.tasks.push(task);
    return task;
  }

  /**
   * 向公告板添加任务
   * @param {*} task
   */
  addTask(task) {
    this.tasks.push(task);
  }

  /**
   * 从公告板删除任务
   * @param {*} taskId
   */
  delTask(taskId) {
    _.remove(this.tasks, t => t.taskId === taskId);
  }

  /**
   * 请求任务，返回第一个有效的任务
   */
  reqTask() {
    if (this.taskCount == 0) {
      return null;
    }
    return _.find(this.tasks, t => !t.hasCompleted);
  }

  /**
   * 任务完成，清除任务
   * @param {*} task
   */
  complete(task) {
    let executor = Game.getObjectById(task.executorId);
    if (executor) {
      executor.curTask = null;
    }
    this.delTask(task.taskId);
    log.debug(`Task completed: ${task.taskId}; Task count = ${this.taskCount}`);
  }
}

$.bulletin = new Bulletin();
