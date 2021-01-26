

Object.defineProperty(RoomObject.prototype, 'data', {
  get: function() {
    let _data = $.structures[this.id];
    if (!_data) {
      _data = {
        hasTasks: {}
      };
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
    let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
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
 * 获取到达当前建筑代价最小的container
 */
RoomObject.prototype.getCheapContainer = function() {
  if (this.data.closestContainer) {
    if (this.data.closestContainer.type != SOURCE) {
      // 检查最近的能源存储是否为空
      const container = Game.getObjectById(this.data.closestContainer.id);
      if (container && container.store.getUsedCapacity() == 0) {
        this.data.closestContainer = null;
      }
    }
  }
  if (!this.data.closestContainer) {
    const container = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: function(obj) {
        return obj.structureType == STRUCTURE_CONTAINER &&
               // 需要给container留下一次decay的能量
               obj.store.getUsedCapacity() > CONTAINER_DECAY;
      }
    });
    if (container != null) {
      this.data.closestContainer = {
        id: container.id,
        type: container.structureType
      }
      return Game.getObjectById(this.data.closestContainer.id);
    }
  }

  return null;
}

/**
 * 获取到达当前建筑代价最小的能量存储点
 */
RoomObject.prototype.getCheapStorage = function() {
  if (this.data.closestStorage) {
    if (this.data.closestStorage.type != SOURCE) {
      // 检查最近的能源存储是否为空
      const storage = Game.getObjectById(this.data.closestStorage.id);
      if (storage && storage.store.getUsedCapacity() == 0) {
        this.data.closestStorage = null;
      }
    }
  }
  if (!this.data.closestStorage) {
    let storage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: function(obj) { return obj.structureType == STRUCTURE_STORAGE }
    });
    if (storage != null) {
      this.data.closestStorage = {
        id: storage.id,
        type: storage.structureType
      }
      return Game.getObjectById(this.data.closestStorage.id);
    }
  }

  return null;
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

