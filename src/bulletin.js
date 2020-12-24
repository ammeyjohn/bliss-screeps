const Task = require('./task');
const WorkHarvester = require('./work_harvester');
const WorkUpgrader = require('./work_upgrader');

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
   * 确定是否可以发布针对特定目标的指定类型任务
   * @param {*} taskType
   * @param {*} targetId
   */
  canPublish(taskType, targetId) {
    let count = _.filter(this.tasks, t => t.hasCompleted == false &&
                                     t.targetId == targetId &&
                                     t.taskType == taskType).length;
    return count < $.tasks[taskType].max_count;
  }

  /**
   * 发布任务
   * @param {*} taskType
   * @param {*} sourceId
   * @param {*} targetId
   * @param {*} options
   */
  publish(taskType, sourceId, targetId, options) {
    if (!this.canPublish(taskType, targetId)) {
      log.debug(`The count of task ${taskType} for ${targetId} has excceeded.`);
      return;
    }
    const task = new Task(taskType, sourceId, targetId, options);
    log.info(`Task ${taskType} for ${targetId} has published. (${this.taskCount})`);
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
    this.tasks = _.remove(this.tasks, t => t.taskId === taskId);
  }

  /**
   * 根据任务类型创建Worker
   * @param {*} task
   */
  createWorker(task) {
    let worker = null;
    switch (task.taskType) {
      case TASK_HARVEST: worker = new WorkHarvester(task); break;
      case TASK_UPGRADE: worker = new WorkUpgrader(task); break;
      default:
        log.error('Invalid task type ', task.taskType);
        break;
    }
    return worker;
  }

  /**
   * 根据编号获取任务
   * @param {*} taskId
   */
  getTask(taskId) {
    if (this.taskCount == 0) {
      return null;
    }
    let task = _.find(this.tasks, t => t.taskId == taskId);
    if (task) {
      let worker = this.createWorker(task);
      if (!worker) {
        task.hasCompleted = true;
      }
      return worker;
    }
    return null;
  }

  /**
   * 请求任务，返回第一个有效的任务
   */
  reqTask() {
    if (this.taskCount == 0) {
      return null;
    }
    let task = _.find(this.tasks, t => t.executorId == null && !t.hasCompleted);
    if (task) {
      let worker = this.createWorker(task);
      if (!worker) {
        task.hasCompleted = true;
      }
      return worker;
    }
    return null
  }

  /**
   * 任务完成，清除任务
   * @param {*} task
   */
  complete(task) {
    this.delTask(task.taskId);
    log.debug(`Task completed: ${task.taskId};`);
  }

  /**
   * 请求完成针对特定目标的指定类型任务
   * @param {*} taskType
   * @param {*} targetId
   */
  reqComplete(taskType, targetId) {
    for (let task of this.tasks) {
      if (task.taskType !== taskType || task.targetId !== targetId) {
        continue;
      }
      let executor = Game.getObjectById(task.executorId);
      if (executor) {
        executor.unassign(task);
      }
      task.hasCompleted = true;
      log.debug(`Task completed: ${task.taskId};`);
    }
  }

  /**
   * 清理所有已经完成的任务
   */
  clear() {
    this.tasks = _.remove(this.tasks, t => t.hasCompleted);
    log.info('Task cleared.')
  }
}

$.bulletin = new Bulletin();
