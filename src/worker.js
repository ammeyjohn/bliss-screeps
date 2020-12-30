/**
 * 定义Worker对象，负责执行某项具体的工作
 */

module.exports = class Worker {
  constructor(task) {
    this.task = task;
  }

  get taskId() {
    return this.task.taskId;
  }

  get taskType() {
    return this.task.taskType;
  }

  get sourceId() {
    return this.task.sourceId;
  }

  get source() {
    return Game.getObjectById(this.sourceId);
  }

  get targetId() {
    return this.task.targetId;
  }

  get target() {
    return Game.getObjectById(this.targetId);
  }

  get executorId() {
    return this.task.executorId;
  }
  set executorId(value) {
    this.task.executorId = value;
  }

  get executor() {
    return Game.getObjectById(this.executorId);
  }

  get options() {
    return this.task.options;
  }

  get hasCompleted() {
    return this.task.hasCompleted;
  }
  set hasCompleted(value) {
    this.task.hasCompleted = value;
  }

  /**
   * 将执行者分配给当前任务
   * @param {*} executorId
   */
  dispatch(executorId) {
    this.executorId = executorId;
  }

  /**
   * 验证任务是否有效
   */
  isValid() {
    if (this.source == null) { return false; }
    if (this.target == null) { return false; }
    return true;
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    log.warning('Nothing execute.');
    return false;
  }
}
