/**
 * 定义工具方法
 */
class Utils {

  /**
   * 从指定位置中获取指定类型的建筑
   */
  static getStructureByTypeAt(room, pos, type) {
    const found = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
    return found.find(obj => obj.structureType == type);
  }

}
$.utils = Utils;
