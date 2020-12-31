/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */

const { log } = require("console");

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
Structure.prototype.check = function() {
  if (!this.store) { return; }

  // 能量未满，尝试发布任务
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    // container只能从source采集
    // storage可以从container收集或者从source采集
    // 其他建筑在storage满的情况下从storage收集，否则可以从source采集
    let source = null;
    if (this.structureType == STRUCTURE_CONTAINER) {
      source = this.getCheapSource();
    } else if (this.structureType == STRUCTURE_STORAGE) {
      source = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(obj) {
          return obj.structureType == STRUCTURE_CONTAINER &&
                 obj.store.getUsedCapacity() > 0;
        }
      });
      if (source == null) {
        source = this.getCheapSource();
      }
    } else {
      source = this.getCheapStorage();
      if (source == null) {
        source = this.getCheapSource();
      }
    }
    if (source == null) {
      log.debug('Cannot find source for ', this.id);
      return;
    }
    bulletin.publish(TASK_HARVEST, source.id, this.id, $.tasks[TASK_HARVEST].priority);
    this.data.hasHarvestTask = true;
  } else {
    if (this.data.hasTask) {
      // 如果能量已经满了，删除公告板中的同类任务
      bulletin.reqComplete(TASK_HARVEST, this.id);
      this.data.hasHarvestTask = false;
    }
  }
}

/**
 * 检查建筑的血量,rug
 */
Structure.prototype.repair = function() {

  if (this.structureType == STRUCTURE_WALL) {
    // 墙壁不需要修复
    return;
  }

  // 如果已经发布了维修任务且血量满了，则取消所有已发布任务
  if (this.data.hasRepairTask && this.hits == this.hitsMax) {
    // 如果修复完成，删除公告板中其他同类任务
    bulletin.reqComplete(TASK_REPAIR, this.id);
    this.data.hasRepairTask = false;
    return;
  }

  // 如果血量小于阈值则发布维修任务
  // 如果已经发布了维修任务，并且血量没有达到最大血量，那么继续维修
  const ratio = this.hits / this.hitsMax;
  if (ratio < HITS_PERCENT || this.data.hasRepairTask && this.hits < this.hitsMax) {
    // 维修任务的优先级，血量越低优先级越高。
    const priority = $.tasks[TASK_REPAIR].priority / ratio;
    let source = this.getCheapSource();
    bulletin.publish(TASK_REPAIR, source.id, this.id, priority);
    this.data.hasRepairTask = true;
  }
}
