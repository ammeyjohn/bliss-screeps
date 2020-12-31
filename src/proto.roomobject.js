

Object.defineProperty(RoomObject.prototype, 'data', {
  get: function() {
    let _data = $.structures[this.id];
    if (!_data) {
      _data = {};
      $.structures[this.id] = _data;
    }
    return _data;
  }
});

/**
 * 获取到达当前建筑代价最小的能量点
 */
RoomObject.prototype.getCheapSource = function() {
  if (!this.data.closestSource) {
    let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    this.data.closestSource = {
      id: source.id,
      type: SOURCE
    }
  }
  if (this.data.closestSource) {
    return Game.getObjectById(this.data.closestSource.id);
  }
  return null;
}

/**
 * 获取到达当前建筑代价最小的能量存储点
 */
RoomObject.prototype.getCheapStorage = function() {
  if (this.data.closestSource) {
    if (this.data.closestSource.type != SOURCE) {
      // 检查最近的能源存储是否为空
      const storage = Game.getObjectById(this.data.closestSource.id);
      if (storage && storage.store.getUsedCapacity() == 0) {
        this.data.closestSource = null;
      }
    }
  }
  if (!this.data.closestSource) {
    let storage = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: function(obj) {
        return (obj.structureType == STRUCTURE_STORAGE ||
                obj.structureType == STRUCTURE_CONTAINER) &&
                obj.store.getUsedCapacity() > 0;
      }
    });
    if (storage != null) {
      this.data.closestSource = {
        id: source.id,
        type: source.structureType
      }
    }
  }
  return Game.getObjectById(this.data.closestSource.id);
}

/**
* 获取当前房间中的指定类型建筑
*/
RoomObject.prototype.getStructureByType = function(structureType) {
  const structures = this.room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: structureType }
  });
  return structures.length > 0 ? structures[0] : null;
}
