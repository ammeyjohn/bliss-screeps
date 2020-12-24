const Worker = require('./worker');

/**
 * 定义设施建造
 */
module.exports = class WorkBuilder extends Worker {

  constructor(task) {
    super(task);
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {

    if(this.executor.store[RESOURCE_ENERGY] == 0) {
      this.executor.mode = 'harvest';
    }
    if(this.executor.store.getFreeCapacity() == 0) {
      this.executor.mode = 'build';
    }

    if(this.executor.mode == 'build') {
      const ret = this.executor.build(this.target);
      if (ret == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'}});
      } else if (ret == ERR_INVALID_TARGET) {
        // 能力运送到目标后标记任务完成
        bulletin.complete(this.task);
        this.executor.unassign(this.task);
      }
    }
    else {
      if(this.executor.harvest(this.source) == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }

}
