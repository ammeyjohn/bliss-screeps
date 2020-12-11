/**
 * 定义Spawn扩展
 */



/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
StructureSpawn.prototype.checkEnergy = function() {
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    // 能量未满，尝试发布任务
    const task = global.bulletin.publish(TASK_HARVEST, { id: this.id, type: this.structureType }, { id: this.id }, global.tasks[TASK_HARVEST].priority);
    if (task) {
      this.memory.taskIds.push(task.taskId);
      this.memory.pubTask = true;
    }
  } else {
    if (this.memory.pubTask) {
      // 能量已经满了，删除任务
      global.bulletin.complete(...this.memory.taskIds);
      this.memory.taskIds = [];
      this.memory.pubTask = false;
    }
  }
}

StructureSpawn.prototype.check = function() {
  if (!this.memory.taskIds) {
    this.memory.taskIds = [];
    this.memory.pubTask = false;
  }
  this.checkEnergy();
}
