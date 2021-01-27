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

    if (!this.executor.mode) {
      this.executor.mode = 'harvest';
    }
    if(this.executor.mode == 'harvest' && this.executor.store.getFreeCapacity() == 0) {
      this.executor.mode = 'build';
    }
    if((this.executor.mode == 'build' && this.target == null) ||        // 建筑物已经建造完成
       (this.executor.mode == 'build' || this.executor.mode == 'repair') &&     // creep能量用完
        this.executor.store[RESOURCE_ENERGY] == 0) {
      // 能量运送到目标后标记任务完成
      bulletin.complete(this.task.taskId);
      this.executor.unassign(this.task);
    }

    if(this.executor.mode == 'build') {
      const site = this.target;
      const ret = this.executor.build(site);
      if (ret == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(site, {visualizePathStyle: {stroke: '#ffffff'}});
      }
      else if (ret == OK) {
        if (this.task.options.withRepair > 0) {
          // 建造完成后是否继续维修
          this.executor.mode = 'repair';
          // 保存site坐标
          this.task.options.pos = site.pos;
          // 延迟任务因target不存在而被删除
          this.task.options.invalidDelay = 10;
        }
      }
    }
    else if(this.executor.mode == 'repair') {
      // 查找指定位置的对象
      let pos = this.task.options.pos;
      const found = this.executor.room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
      console.log(JSON.stringify(pos), JSON.stringify(found))
      for (let obj of found) {
        if (obj.structureType === STRUCTURE_RAMPART ||
            obj.structureType === STRUCTURE_WALL) {
          this.targetId = obj.id;
          break;
        }
      }
      if (this.target) {
        this.executor.repair(this.target);
      }
    }
    else {
      if(this.executor.harvest(this.source) == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }

}
