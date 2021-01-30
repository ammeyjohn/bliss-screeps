/**
 * 定义房管所对象，用于管理房间内的建筑
 */
module.exports = class HouseManager {
  constructor() {

  }

  /**
   * 保存房间内各种建筑的坐标
   * 目前只保存会自动decay的建筑，包括wall、rampart和road
   */
  designSaver(room) {
    const structures = room.find(FIND_STRUCTURES, {
      filter: function(obj) {
        return obj.structureType == STRUCTURE_ROAD ||
               obj.structureType == STRUCTURE_WALL ||
              (obj.structureType == STRUCTURE_RAMPART && obj.my)
      }
    });
    Memory.designDrawings = _.map(structures, function(obj) {
        return _.pick(obj, [ 'structureType', 'pos' ]);
    });
  }

  /**
   * 当建筑因为某些原因消失后重建
   * @param {*} room
   */
  restoreHouse(room) {
    if (!Memory.designDrawings) {
      return;
    }

    for(const draw of Memory.designDrawings) {
      const structure = utils.getStructureByTypeAt(room, draw.pos, draw.structureType);
      if (!structure) {
        // 如果建筑不存在则重建
        const ret = room.createConstructionSite(draw.pos.x, draw.pos.y, draw.structureType);
        if (ret == OK) {
          log.warning(draw.structureType, 'restore at:', draw.pos.x, draw.pos.y);
        }
      }
    }
  }
}
