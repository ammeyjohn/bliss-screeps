/**
 * 定义防御墙对象扩展
 */

/**
 * 获取建筑各种任务的优先级
 */
StructureWall.prototype.getPriority = function(taskType) {
  let priority = $.tasks[taskType].priority;
  switch(taskType) {
    case TASK_REPAIR:
      // 血量越少优先级越高
      priority /= (this.hits / this.hitsMax);
      break;
  }
  priority *= this.getPriorityMultiplier(taskType);
  return priority;
}

/**
 * 检查墙壁的血量是否满足要求
 */
StructureWall.prototype.repair = function() {
  // 如果墙壁血量不足，需要发布任务修复
  if (this.hits < this.hitsMax) {
    let source = this.getCheapSource();
    this.addTask(TASK_REPAIR, source.id);
  } else {
    // 如果修复完成，删除公告板中其他同类任务
    this.completeTask(TASK_REPAIR);
  }
}
