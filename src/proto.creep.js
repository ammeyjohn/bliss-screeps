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

Object.defineProperty(Creep.prototype, 'assigned', {
  get: function() {
    return this.memory.taskId != null;
  }
});

/**
 * 确定某种任务是否可以分配给当前creep
 */
Creep.prototype.canAssign = function(task) {
  if (this.spawning) { return false; }
  if (this.memory.role) { return false; } // 不给指定角色的creep分配任务
  if (this.memory.taskId != null) { return false; }
  if (task.taskType == TASK_ATTACK) {
    // 需要攻击组件
    return this.getActiveBodyparts(ATTACK) > 0;
  }

  return true;
}

/**
 * 向当前creep分配任务
 * @param {*} task
 */
Creep.prototype.assign = function(task) {
  this.memory.taskId = task.taskId;
}

/**
 * 清除已经分配的任务
 */
Creep.prototype.unassign = function() {
  this.memory.taskId = null;
  log.info(`Task unassigned: ${this.name}`);
}

/**
 * 任务无效时主动放弃任务
 */
Creep.prototype.abandon = function() {
  this.memory.taskId = null;
  log.info(`Task abandoned: ${this.name}`);
}

/**
 * 从公告板请求任务，并执行
 */
Creep.prototype.execute = function() {
  // 孵化中不执行任务
  if (this.spawning) { return; }
  if (this.memory.role) { return; } // 指定角色的creep由对应的role.*驱动
  if (this.memory.taskId == null) { return; }

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
