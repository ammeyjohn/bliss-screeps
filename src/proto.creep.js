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
 * 执行控制器升级任务
 * @param {*} task
 */
const doUpgrade = (creep, task) => {
  let _source = Game.getObjectById(task.sourceId);
  let _target = Game.getObjectById(task.targetId);
  if(creep.store.getFreeCapacity() > 0) {
    if(creep.harvest(_source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(_source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  }
  else {
    const ret = creep.upgradeController(_target);
    if (ret == ERR_NOT_IN_RANGE) {
      creep.moveTo(_target, {visualizePathStyle: {stroke: '#ffffff'}});
    } else if (ret == OK) {
      // 能力运送到目标后标记任务完成
      bulletin.complete(task);
      creep.memory.taskId = null;
    }
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
