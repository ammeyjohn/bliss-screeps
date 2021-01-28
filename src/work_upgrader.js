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

    if (!this.task.options.mode) {
      this.task.options.mode = 'harvest';
    }
    if(this.task.options.mode == 'harvest' && this.executor.store.getFreeCapacity() == 0) {
      this.task.options.mode = 'upgrade';
    }
    if(this.task.options.mode == 'upgrade' && this.executor.store[RESOURCE_ENERGY] == 0) {
      // 能量运送到目标后标记任务完成
      super.execNext();
    }

    if(this.task.options.mode == 'upgrade') {
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
