/**
 * 定义Spawn扩展
 */



/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
StructureSpawn.prototype.check = function() {
  // 能量未满，尝试发布任务
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    // 获取最近的source
    let source = this.room.find(FIND_SOURCES)[0];
    global.bulletin.publish(TASK_HARVEST, { id: source.id }, { id: this.id }, global.tasks[TASK_HARVEST].priority);
  }
}
