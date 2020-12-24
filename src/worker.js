/**
 * 定义Worker对象，负责执行某项具体的工作
 */

module.exports = class Worker {
  constructor(task) {
    this.task = task;
    this._source = null;
    this._target = null;
    this._executor = null;
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
    if (this._source == null) {
      this._source = Game.getObjectById(this.sourceId);
    }
    return this._source;
  }

  get targetId() {
    return this.task.targetId;
  }

  get target() {
    if (this._target == null) {
      this._target = Game.getObjectById(this.targetId);
    }
    return this._target;
  }

  get executorId() {
    return this.task.executorId;
  }
  set executorId(value) {
    this.task.executorId = value;
  }

  get executor() {
    if (this._executor == null) {
      this._executor = Game.getObjectById(this.executorId);
    }
    return this._executor;
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
    const s = Game.getObjectById(this.sourceId);
    if (s == null) { return false; }

    const t = Game.getObjectById(this.targetId);
    if (t == null) { return false; }
    return true;
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    log.warning('Abstract task.');
    return false;
  }
}
