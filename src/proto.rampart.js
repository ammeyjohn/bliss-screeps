/**
 * 定义rampart扩展
 */

/**
 * 获取建筑各种任务的优先级乘子
 */
StructureRampart.prototype.getPriorityMultiplier = function(taskType) {
  if (taskType == TASK_REPAIR) {
    // 保证rampart不会因为decay消失
    if (this.hits < 100) {
      return 9999.0;
    }
    return parseInt(this.hitsMax / this.hits) / WALL_MULTIPLE;
  }
  return 1.0;
}

/**
 * 添加任务
 * @param {*} taskType
 */
StructureRampart.prototype.addTask = function(taskType, sourceId) {
  const priority = this.getPriority(taskType);
  bulletin.publish(taskType, sourceId, this.id, priority, {
    forced: true
  });
  this.data.hasTasks[taskType] = true;
}

/**
 * 检查墙壁的血量是否满足要求
 */
StructureRampart.prototype.repair = function() {
  // 如果墙壁血量不足，需要发布任务修复
  if (this.hits < this.hitsMax) {
    let source = this.getCheapSource();
    this.addTask(TASK_REPAIR, source.id);
  } else {
    // 如果修复完成，删除公告板中其他同类任务
    this.completeTask(TASK_REPAIR);
  }
}
