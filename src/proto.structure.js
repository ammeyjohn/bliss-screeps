/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */



/**
 * 检查建筑的血量,rug
 */
Structure.prototype.repair = function() {
  // 如果已经发布了维修任务且血量满了，则取消所有已发布任务
  if (this.data.hasRepairTask && this.hits == this.hitsMax) {
    // 如果修复完成，删除公告板中其他同类任务
    bulletin.reqComplete(TASK_REPAIR, this.id);
    this.data.hasRepairTask = false;
    return;
  }

  // 如果血量小于阈值则发布维修任务
  // 如果已经发布了维修任务，并且血量没有达到最大血量，那么继续维修
  const ratio = this.hits / this.hitsMax;
  if (ratio < HITS_PERCENT || this.data.hasRepairTask && this.hits < this.hitsMax) {
    // 维修任务的优先级，血量越低优先级越高。
    const priority = $.tasks[TASK_REPAIR].priority / ratio;
    let source = this.getCheapSource();
    bulletin.publish(TASK_REPAIR, source.id, this.id, priority);
    this.data.hasRepairTask = true;
  }
}
