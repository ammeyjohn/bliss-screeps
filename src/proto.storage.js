/**
 * 定义storage的扩展
 */

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 * storage可以从container收集或者source采集
 */
StructureStorage.prototype.check = function() {
  let storage = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: function(obj) {
      return obj.structureType == STRUCTURE_CONTAINER &&
             obj.store.getUsedCapacity() > 0;
    }
  });
}
