const Worker = require('./worker');
const WorkHarvester = require('./work_harvester');

/**
 * 定义能量运输
 */
module.exports = class WorkTransporter extends WorkHarvester {

  constructor(task) {
    super(task);
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    if (this.source instanceof Source) {
      // 如果能量源为Source，那么执行采集过程
      super.execute();
    } else if (this.source.structureType == STRUCTURE_STORAGE ||
               this.source.structureType == STRUCTURE_CONTAINER ||
               this.source.structureType == STRUCTURE_LINK) {
      if(this.executor.store.getFreeCapacity() > 0 && this.source.store[RESOURCE_ENERGY] > 0) {
        if(this.executor.withdraw(this.source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.executor.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
      else {
        const ret = this.executor.transfer(this.target, RESOURCE_ENERGY);
        if (ret == ERR_NOT_IN_RANGE) {
          this.executor.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (ret == OK) {
          super.execNext();
        }
      }
    }

    if (this.executor.store.getFreeCapacity() == 0 ||
        this.target.store.getFreeCapacity() == 0) {
      super.execNext();
    }
  }
}
