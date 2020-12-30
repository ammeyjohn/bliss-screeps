/**
 * 定义防御塔扩展
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
StructureTower.prototype.check = function() {
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
 * 防御塔进行防御
 */
StructureTower.prototype.defence = function() {
  if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
    return;
  }
  let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target == null) {
    target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
  }
  if (target != null) {
    this.attack(target)
  }
}

