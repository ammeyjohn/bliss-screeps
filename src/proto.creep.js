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

/**
 * 清除已经分配的任务
 */
Creep.prototype.unassign = function(task) {
  if (this.memory.taskId ===  task.taskId) {
    this.memory.taskId = null;
    log.info(`Task ${task.taskType} has unassigned from ${this.name}.`);
  }
}

/**
 * 从公告板请求任务，并执行
 */
Creep.prototype.execute = function() {
  // 孵化中不执行任务
  if (this.spawning) { return; }
  if (!this.memory.taskId) {
    // 向公告板请求任务
    let worker = $.bulletin.reqTask();
    if (worker) {
      worker.dispatch(this.id);
      this.memory.taskId = worker.taskId;
      log.info(`Task ${worker.taskType} has assigned to ${this.name}.`);
    }
  }

  const worker = this.curTask;
  if (worker != null) {
    // 如果已经申请到任务，则执行任务
    worker.execute();
  }
}
