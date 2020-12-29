/**
 * 定义防御墙对象扩展
 */

/**
 * 检查墙壁的血量是否满足要求
 */
StructureWall.prototype.check = function() {
  // 如果墙壁血量不足，需要发布任务修复
  if (this.hits < WALL_LEVEL_HITS) {
    let source = this.getCheapSource();
    bulletin.publish(TASK_REPAIR, source.id, this.id, $.tasks[TASK_REPAIR].priority);
  } else {
    // 如果修复完成，删除公告板中其他同类任务
    bulletin.reqComplete(TASK_REPAIR, this.id);
  }
}
