const Worker = require('./worker');

/**
 * 定义控制器升级
 */
module.exports = class WorkUpgrader extends Worker {

  constructor(task) {
    super(task);
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {

    if (!this.executor.mode) {
      this.executor.mode = 'harvest';
    }
    if(this.executor.mode == 'harvest' && this.executor.store.getFreeCapacity() == 0) {
      this.executor.mode = 'upgrade';
    }
    if(this.executor.mode == 'upgrade' && this.executor.store[RESOURCE_ENERGY] == 0) {
      // 能量运送到目标后标记任务完成
      bulletin.complete(this.task);
      this.executor.unassign(this.task);
    }

    if(this.executor.mode == 'upgrade') {
      const ret = this.executor.upgradeController(this.target);
      if (ret == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else {
      if(this.executor.harvest(this.source) == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}
