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
  notifyProfile(room) {
    $.message['RCL'] = room.controller.level;
    $.message['GCL'] = Game.gcl;
    $.message['avg_assign'] = $.profile.assigned_task_time / $.profile.assigned_task_count;
    $.message['avg_complete'] = $.profile.completed_task_time / $.profile.completed_task_count;
    if (Game.time % 10 == 0) {
      let json = JSON.stringify($.message);
      $.log.info(json);
    }
    if (Game.time % 5000 == 0) {
      let json = JSON.stringify($.message);
      Game.notify(json, 0);
    }
  }
}

global.ops = new Operation();
