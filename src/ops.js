/**
 * 定义房间运维
 */

class Operation {

  /**
   * 执行房间清理工作
   * @param {*} room
   */
  clear(room) {
    this.clearBulletin();
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

  /**
   * 清理所有已经死亡的creep数据
   */
  clearMemoryCreep() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          log.info('Clearing non-existing creep memory:', name);
      }
    }
  }

  /**
   * 清理公告板数据
   */
  clearBulletin() {
    $.bulletin.clear();
  }

  /**
   * 邮件发送整体情况
   */
  notifyProfile() {
    if (Game.time % 5000) {
      let json = JSON.stringify(global.message);
      Game.notify(json, 0);
    }
  }
}

global.ops = new Operation();
