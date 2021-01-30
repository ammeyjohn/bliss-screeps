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

    if (!this.task.options.mode) {
      this.task.options.mode = 'harvest';
    }
    if(this.task.options.mode == 'harvest' && this.executor.store.getFreeCapacity() == 0) {
      this.task.options.mode = 'build';
    }

    if(this.task.options.mode == 'build') {

      // creep能量全部用完或者目标建筑消失（建造完成）时完成任务
      if (this.target == null ||
          this.executor.store[RESOURCE_ENERGY] == 0) {
        super.execNext();
        return;
      }

      const site = this.target;
      const ret = this.executor.build(site);
      if (ret == ERR_NOT_IN_RANGE) {
        this.executor.moveTo(site, {visualizePathStyle: {stroke: '#ffffff'}});
      }
      else if (ret == OK) {
        if (this.task.options.withRepair > 0) {
          // 建造完成后是否继续维修
          this.task.options.mode = 'repair';
          // 保存site坐标
          this.task.options.pos = site.pos;
          // 延迟任务因target不存在而被删除
          this.task.options.invalidDelay = 10;
        }
      }
    }
    else if(this.task.options.mode == 'repair') {
      // 查找指定位置的对象
      let pos = this.task.options.pos;
      const found = this.executor.room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
      for (let obj of found) {
        if (obj.structureType === STRUCTURE_RAMPART ||
            obj.structureType === STRUCTURE_WALL) {
          this.targetId = obj.id;
          break;
        }
      }
      if (this.target) {
        // creep能量全部用完或者目标建筑满血时完成任务
        if (this.executor.store[RESOURCE_ENERGY] == 0 ||
            this.target.hits == this.target.hitsMax) {
          super.execNext();
          return;
        }

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
