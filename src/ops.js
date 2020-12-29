/**
 * 定义房间运维
 */

module.exports = class Operation {

  /**
   * 执行房间清理工作
   * @param {*} room
   */
  clear(room) {
    this.clearGlobalStructure();
    this.clearMemoryCreep();
  }

  /**
   * 清理global对象中的structure数据
   * 如果建筑不存在则删除
   */
  clearGlobalStructure() {
    const ids = _.keys(global.structures);
    for(const id of ids) {
      const structure = Game.getObjectById(id);
      if (!structure) {
        delete global.structures[id];
        log.info('Clearing non-existing structure data:', id);
      }
    }
  }

  clearMemoryCreep(room) {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          log.info('Clearing non-existing creep memory:', name);
      }
    }
  }

}
