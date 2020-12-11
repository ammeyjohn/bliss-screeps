/**
 * 定义Spawn扩展
 */



/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
StructureSpawn.prototype.checkEnergy = function() {
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    global.bulletin.publish(TASK_HARVEST, { id: this.id, type: this.structureType }, { id: this.id }, global.tasks[TASK_HARVEST].priority);
  }
}

StructureSpawn.prototype.check = function() {
  this.checkEnergy();
}
