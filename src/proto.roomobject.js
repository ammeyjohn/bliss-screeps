

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
  if (!this.data.nearSourceId) {
    let source = this.pos.findClosestByPath(FIND_SOURCES);
    if (source == null) {
      source = this.pos.findClosestByRange(FIND_SOURCES);
    }
    this.data.nearSourceId = source.id;
  }
  return Game.getObjectById(this.data.nearSourceId);
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
