/**
 * 定义过程对象
 */
module.exports = class Procedure {
  constructor(name) {
    const setting = $.procedures[name];
    this.initialize(setting);
  }

  /**
   * 初始化过程
   */
  initialize() {

  }

  /**
   * 执行过程
   */
  execute() {

  }

  /**
   * 清理过程
   */
  dispose() {

  }

  /**
   * 获取指定类型的建筑
   * @param {*} structureType
   */
  findStructuresByType(structureType) {
    return this.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: structureType }
    });
  }
}
