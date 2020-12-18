/**
 * 定义Creep扩展
 */
Object.defineProperty(Creep.prototype, 'workTask', {
  get: function() {
    return this.memory.workTask;
  },
  set: function(value) {
    this.memory.workTask = value;
  }
});

/**
 * 是否可以为当前creep指派任务
 */
StructureController.prototype.canAssign = (task) => {
  if (this.workTask != null) {
    return false;
  }
  return true;
}
