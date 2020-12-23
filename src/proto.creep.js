/**
 * 定义Creep扩展
 */
Object.defineProperty(Creep.prototype, 'curTask', {
  get: function() {
    return bulletin.getTask(this.memory.taskId);
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
    let task = $.bulletin.reqTask();
    if (task) {
      task.executorId = this.id;
      this.memory.taskId = task.taskId;
      log.info(`Task ${task.taskType} has assigned to ${this.name}.`);
    }
  }

  const task = this.curTask;
  if (task != null) {
    // 如果已经申请到任务，则执行任务
    let _source = Game.getObjectById(task.sourceId);
    let _target = Game.getObjectById(task.targetId);
    if(this.store.getFreeCapacity() > 0) {
      if(this.harvest(_source) == ERR_NOT_IN_RANGE) {
        this.moveTo(_source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
    else {
      const ret = this.transfer(_target, RESOURCE_ENERGY)
      if (ret == ERR_NOT_IN_RANGE) {
        this.moveTo(_target, {visualizePathStyle: {stroke: '#ffffff'}});
      } else if (ret == OK) {
        // 能力运送到目标后标记任务完成
        bulletin.complete(task);
        this.memory.taskId = null;
      }
    }
  }
}
