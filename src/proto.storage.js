/**
 * 定义storage的扩展
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 * storage可以从container收集或者source采集
 */
StructureStorage.prototype.check = function() {
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    let storage = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function(obj) {
        return obj.structureType == STRUCTURE_CONTAINER &&
               obj.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    if (storage == null) {
      // 没有合适的container，那么从source采集
      this.checkEnergy(TASK_HARVEST);
      return;
    }
    // 否则从container收集
    bulletin.publish(TASK_TRANSPORT, storage.id, this.id, $.tasks[TASK_TRANSPORT].priority);
    this.data.hasTransportTask = true;
  } else {
    if (this.data.hasTransportTask) {
      // 如果能量已经满了，删除公告板中的同类任务
      bulletin.reqComplete(TASK_TRANSPORT, this.id);
      this.data.hasTransportTask = false;
    }
  }
}
