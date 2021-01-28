const Worker = require('./worker');

/**
 * 定义设施维修任务
 */
module.exports = class WorkRepairer extends Worker {

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
      this.task.options.mode = 'repair';
    }
    if(this.task.options.mode == 'repair' && this.executor.store[RESOURCE_ENERGY] == 0) {
      super.execNext();
    }

    if(this.task.options.mode == 'repair') {
      const ret = this.executor.repair(this.target);
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
