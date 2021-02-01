/**
 * 定义房管所对象，用于管理房间内的建筑
 */
class HouseManager {
  constructor() {
    if (!Memory.tiles) {
      Memory.tiles = {};
    }
  }

  /**
   * 记录是否走过某个tile
   * @param {*} pos
   */
  walkthrough(pos) {
    const key = `${pos.x},${pos.y}`;
    if (!Memory.tiles[key]) {
      Memory.tiles[key] = {
        count: 0,
        pos: pos
      };
    }
    Memory.tiles[key].count += 1;
  }

  /**
   * 根据途径统计数据修建路
   */
  constructRoad() {
    if (!Memory.tiles) {
      return;
    }

    for(const key in Memory.tiles) {
      const val = Memory.tiles[key];
      if (val.count >= WALLTHROUGHT_COUNT) {
        const room = Game.rooms[val.pos.roomName];
        const ret = room.createConstructionSite(val.pos.x, val.pos.y, STRUCTURE_ROAD);
        if (ret != ERR_FULL && ret != ERR_RCL_NOT_ENOUGH) {
          // 当条件达到时还是需要修建路的，需要加入列表
          continue;
        }
      }
    }
    Memory.tiles = {};
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
$.houseManager = new HouseManager();
