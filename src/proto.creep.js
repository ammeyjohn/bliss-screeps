/**
 * 定义Creep扩展
 */
Object.defineProperty(Creep.prototype, 'curTask', {
  get: function() {
    if (this.worker == null) {
      this.worker = bulletin.getTask(this.memory.taskId);
    }
    return this.worker;
  }
});

Object.defineProperty(Creep.prototype, 'mode', {
  get: function() {
    return this.memory.mode;
  },
  set: function(mode) {
    this.memory.mode = mode;
  }
});

/**
 * 清除已经分配的任务
 */
Creep.prototype.unassign = function() {
  // log.info(`Task ${this.curTask.taskType} has unassigned from ${this.name}.`);
  this.memory.taskId = null;
}

/**
 * 任务无效时主动放弃任务
 */
Creep.prototype.abandon = function() {
  this.memory.taskId = null;
  log.info(`${this.name} abandoned task.`);
}

/**
 * 从公告板请求任务，并执行
 */
Creep.prototype.execute = function() {
  // 孵化中不执行任务
  if (this.spawning) { return; }
  if (!this.memory.taskId) {
    // 向公告板请求任务
    this.worker = $.bulletin.reqTask();
    if (this.worker) {
      this.worker.dispatch(this.id);
      this.memory.taskId = this.worker.taskId;
      log.info(`Task ${this.worker.taskType} has assigned to ${this.name}.`);
    }
  }

  if (this.memory.taskId == null) {
    return;
  }

  const worker = this.curTask;
  if (worker == null) {
    // 如果无法获取任务对象，主动放弃任务
    this.abandon();
    return;
  }

  if (!worker.isValid()) {
    // 如果任务已经无效，主动放弃任务，并设置任务完成状态
    this.abandon();
    worker.hasCompleted = true;
    return;
  }

  // 执行任务
  worker.execute();
}
