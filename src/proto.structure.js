/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */

/**
 * 获取建筑各种任务的优先级乘子
 */
Structure.prototype.getPriorityMultiplier = function(taskType) {
  return 1.0;
}

/**
 * 获取建筑各种任务的优先级
 */
Structure.prototype.getPriority = function(taskType) {
  let priority = $.tasks[taskType].priority;
  switch(taskType) {
    case TASK_HARVEST:
    case TASK_TRANSPORT:
      // 现有能量越少优先级越高
      let ratio = (this.store[RESOURCE_ENERGY]+1) / this.store.getCapacity(RESOURCE_ENERGY)
      priority /= ratio;
      break;
    case TASK_REPAIR:
      // 血量越少优先级越高
      priority /= (this.hits / this.hitsMax);
      break;
  }
  priority *= this.getPriorityMultiplier(taskType);
  return priority;
}

/**
 * 添加任务
 * @param {*} taskType
 */
Structure.prototype.addTask = function(taskType, sourceId) {
  const priority = this.getPriority(taskType);
  bulletin.publish(taskType, sourceId, this.id, priority);
  this.data.hasTasks[taskType] = true;
}

/**
 * 完成任务
 * @param {*} taskType
 */
Structure.prototype.completeTask = function(taskType) {
  if (this.data.hasTasks[taskType] == true) {
    bulletin.reqComplete(taskType, this.id);
    this.data.hasTasks[taskType] = false;
  }
}


/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
Structure.prototype.check = function() {
  if (this.structureType != STRUCTURE_LINK) {
    // 检查建筑物能量
    this.checkEnergy();
  }
}

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 * 排除controller、container和storage之外，其他建筑都是优先从storage获取能量，否则从source采集
 */
Structure.prototype.checkEnergy = function() {
  if (!this.store) { return; }
  if (this.structureType == STRUCTURE_LINK) {
    return;
  }

  const ratio = this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY);
  if (ratio < ENERGY_PERCENT ||
      (this.data.hasTasks[TASK_HARVEST] || this.data.hasTasks[TASK_TRANSPORT]) && ratio < 1.0) {
    let storage = this.getCheapStorage();
    if (storage != null) {
      this.addTask(TASK_TRANSPORT, storage.id);
      return;
    } else {
      // 如果没有找到合适的container，则从source采集
      let source = this.getCheapSource();
      if (source != null) {
        this.addTask(TASK_HARVEST, source.id);
        return;
      }
    }
  }

  if ( ratio == 1.0 ) {
    // 能量已满，取消任务
    this.completeTask(TASK_TRANSPORT);
    this.completeTask(TASK_HARVEST);
  }
}

/**
 * 检查建筑的血量
 */
Structure.prototype.repair = function() {

  if (this.structureType == STRUCTURE_WALL ||
      this.structureType == STRUCTURE_RAMPART) {
    // 墙壁不需要修复
    return;
  }

  // 如果已经发布了维修任务且血量满了，则取消所有已发布任务
  if (this.hits == this.hitsMax) {
    // 如果修复完成，删除公告板中其他同类任务
    this.completeTask(TASK_REPAIR);
    return;
  }

  // 如果血量小于阈值则发布维修任务
  // 如果已经发布了维修任务，并且血量没有达到最大血量，那么继续维修
  const ratio = this.hits / this.hitsMax;
  if (ratio < HITS_PERCENT || this.data.hasTasks[TASK_REPAIR] && this.hits < this.hitsMax) {
    // 维修任务的优先级，血量越低优先级越高。
    let source = this.getCheapSource();
    this.addTask(TASK_REPAIR, source.id);
  }
}
