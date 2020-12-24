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
    if(this.executor.store.getFreeCapacity() > 0) {
      if(this.executor.harvest(this.source) == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
    else {
      const ret = this.executor.upgradeController(this.target);
      if (ret == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'}});
      } else if (ret == OK) {
        // 能力运送到目标后标记任务完成
        bulletin.complete(this.task);
        this.executor.unassign(this.task);
      }
    }
  }

}
