/**
 * 定义Creep扩展
 */
Object.defineProperty(Creep.prototype, 'curTask', {
  get: function() {
    return this.memory.task;
  },
  set: function(value) {
    this.memory.task = value;
  }
});

/**
 * 从公告板请求任务，并执行
 */
Creep.prototype.execute = function() {
  if (this.curTask == null) {
    // 向公告板请求任务
    let task = $.bulletin.reqTask();
    if (task) {
      task.executorId = this.id;
      this.curTask = task;
    }
  }

  if (this.curTask != null) {
    const task = this.curTask;
    // 如果已经申请到任务，则执行任务
    let _source = Game.getObjectById(task.sourceId);
    let _target = Game.getObjectById(task.targetId);
    if(this.store.getFreeCapacity() > 0) {
      if(this.harvest(_source) == ERR_NOT_IN_RANGE) {
        this.moveTo(_source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
    else {
      if (this.transfer(_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(_target, {visualizePathStyle: {stroke: '#ffffff'}});
        // 能力运送到目标后标记任务完成
        bulletin.complete(task);
      }
    }
  }
}
