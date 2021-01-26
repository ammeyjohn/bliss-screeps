/**
 * 定义rampart扩展
 */

/**
 * 获取建筑各种任务的优先级乘子
 */
Structure.prototype.getPriorityMultiplier = function(taskType) {
  if (taskType == TASK_REPAIR) {
    // 保证rampart不会因为decay消失
    if (this.hits < 100) {
      return 9999.0;
    }
    return 2.0;
  }
  return 1.0;
}
