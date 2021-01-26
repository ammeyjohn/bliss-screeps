/**
 * 定义storage的扩展
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 * storage可以优先从container收集，其次从source采集
 */
StructureStorage.prototype.checkEnergy = function() {
  const ratio = this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY);
  if (ratio < ENERGY_PERCENT ||
      this.data.hasTasks[TASK_HARVEST] == true && ratio < 1.0) {
    let container = this.getCheapContainer();
    if (container != null) {
      const priority =  $.tasks[TASK_TRANSPORT].priority / ratio;
      bulletin.publish(TASK_TRANSPORT, container.id, this.id, priority);
      this.data.hasTasks[TASK_TRANSPORT] = true;
      return;
    } else {
      // 如果没有找到合适的container，则从source采集
      let source = this.getCheapSource();
      if (source != null) {
        const priority =  $.tasks[TASK_HARVEST].priority / ratio;
        bulletin.publish(TASK_HARVEST, source.id, this.id, priority);
        this.data.hasTasks[TASK_HARVEST] = true;
        return;
      }
    }
  }

  if ( ratio == 1.0 ) {
    // 能量已满，取消任务
    if (this.data.hasTasks[TASK_TRANSPORT] == true) {
      bulletin.reqComplete(TASK_TRANSPORT, this.id);
      this.data.hasTasks[TASK_TRANSPORT] = false;
    }

    if (this.data.hasTasks[TASK_HARVEST] == true) {
      bulletin.reqComplete(TASK_HARVEST, this.id);
      this.data.hasTasks[TASK_HARVEST] = false;
    }
  }
}
