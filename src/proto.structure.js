/**
 * 定义所有建筑类的扩展，用于放置基础方法
 */


Object.defineProperty(Structure.prototype, 'data', {
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
Structure.prototype.getCheapSource = function() {
  if (!this.data.nearSource) {
    const source = this.pos.findClosestByPath(FIND_SOURCES);
    this.data.nearSource = source;
  }
  return this.data.nearSource;
}

