/**
 * 定义container扩展
 */

/**
 * 检查container的能量，如果能量少于阈值则发布采集任务
 */
StructureContainer.prototype.checkEnergy = function() {
  let ratio = this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY);
  if (ratio < ENERGY_PERCENT ||
      // 如果已经在采集资源，则采集满
      (this.data.hasTasks[TASK_HARVEST] && this.store[RESOURCE_ENERGY] < this.store.getCapacity(RESOURCE_ENERGY))) {
    let priority = $.tasks[TASK_HARVEST].priority / ratio;
    let source = this.getCheapSource();
    bulletin.publish(TASK_HARVEST, source.id, this.id, priority);
    this.data.hasTasks[TASK_HARVEST] = true;
  }

  // 如果已经采满，则完成任务
  if (this.data.hasTasks[TASK_HARVEST] &&
     this.store[RESOURCE_ENERGY] == this.store.getCapacity(RESOURCE_ENERGY)) {
    bulletin.reqComplete(TASK_HARVEST, this.id);
    this.data.hasTasks[TASK_HARVEST] = false;
  }
}
