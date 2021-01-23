/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
Structure.prototype.check = function() {
  switch(this.structureType) {
    case STRUCTURE_CONTAINER:
      // container只能从source采集
      this.checkEnergy(TASK_HARVEST);
      break;
    default:
      // storage可以从container收集或者从source采集
      // 其他建筑在storage满的情况下从storage收集，否则可以从source采集
      this.checkEnergy(TASK_TRANSPORT);
      break;
  }
}

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
Structure.prototype.checkEnergy = function(taskType) {
  if (!this.store) { return; }

  // 能量未满，尝试发布任务
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    let ratio = this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY);
    if (taskType == TASK_HARVEST) {
      let source = this.getCheapSource();
      if (source == null) {
        log.debug('Cannot find source for ', this.id);
        return;
      }
      let priority = $.tasks[TASK_HARVEST].priority / ratio;
      bulletin.publish(TASK_HARVEST, source.id, this.id, priority);
      this.data.hasHarvestTask = true;
    } else if (taskType == TASK_TRANSPORT) {
      let storage = this.getCheapStorage();
      if (storage == null) {
        log.debug('Cannot find storage for ', this.id);
        return;
      }
      let priority = $.tasks[TASK_HARVEST].priority / ratio;
      bulletin.publish(TASK_TRANSPORT, storage.id, this.id, priority);
      this.data.hasHarvestTask = true;
    }
  } else {
    if (this.data.hasHarvestTask || this.data.hasTransportTask) {
      // 如果能量已经满了，删除公告板中的同类任务
      bulletin.reqComplete(TASK_HARVEST, this.id);
      bulletin.reqComplete(TASK_TRANSPORT, this.id);
      this.data.hasHarvestTask = false;
      this.data.hasTransportTask = false;
    }
  }
}

/**
 * 检查建筑的血量
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
    this.data.hasTasks[TASK_REPAIR] = false;
    return;
  }

  // 如果血量小于阈值则发布维修任务
  // 如果已经发布了维修任务，并且血量没有达到最大血量，那么继续维修
  const ratio = this.hits / this.hitsMax;
  if (ratio < HITS_PERCENT || this.data.hasTasks[TASK_REPAIR] && this.hits < this.hitsMax) {
    // 维修任务的优先级，血量越低优先级越高。
    const priority = $.tasks[TASK_REPAIR].priority / ratio;
    let source = this.getCheapSource();
    bulletin.publish(TASK_REPAIR, source.id, this.id, priority);
    this.data.hasTasks[TASK_REPAIR] = true;
  }
}
