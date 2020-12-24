/**
 * 定义Extension扩展
 */


/**
 * 判断指定建筑是否是建筑工地
 * @param {*} id
 */
const isConstructionSite = (id, room) => {
  const sites = room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: function(site) {
      return site.id === id
    }
  });
  return sites.length > 0;
}

/**
 * 检查能量是否已经充足，未充足则发布采集任务
 */
StructureExtension.prototype.check = function() {
  // 如果是建筑工地，需要先建造
  if (isConstructionSite(this.id, this.room)) {
    return;
  }

  // 能量未满，尝试发布任务
  if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    // 获取最近的source
    let source = this.room.find(FIND_SOURCES)[0];
    bulletin.publish(TASK_HARVEST, source.id, this.id);
  } else {
    // 如果能量已经满了，删除公告板中的同类任务
    bulletin.reqComplete(TASK_HARVEST, this.id);
  }
}
