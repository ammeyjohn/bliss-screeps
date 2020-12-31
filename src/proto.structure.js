/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
Structure.prototype.check = function() {
  if (!this.store) { return; }

  // 能量未满，尝试发布任务
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    // 获取最近的source
    let source = this.getCheapSource();
    bulletin.publish(TASK_HARVEST, source.id, this.id, $.tasks[TASK_HARVEST].priority);
    this.data.hasTask = true;
  } else {
    if (this.data.hasTask) {
      // 如果能量已经满了，删除公告板中的同类任务
      bulletin.reqComplete(TASK_HARVEST, this.id);
      this.data.hasTask = false;
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
