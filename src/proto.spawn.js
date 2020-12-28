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
    bulletin.publish(TASK_HARVEST, source.id, this.id, $.tasks[TASK_HARVEST].priority);
    this.memory.hasTask = true;
  } else {
    if (this.memory.hasTask) {
      // 如果能量已经满了，删除公告板中的同类任务
      bulletin.reqComplete(TASK_HARVEST, this.id);
      this.memory.hasTask = false;
    }
  }
}
