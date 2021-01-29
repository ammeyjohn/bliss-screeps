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
    $.message = { };
    $.message['RCL'] = room.controller.level;
    $.message['GCL'] = Game.gcl;
    let counter = { };
    for (const key in $.profile.tasks) {
      const task = $.profile.tasks[key];
      task['avg_assign_time'] = task['assigned_task_time'] / task['assigned_task_count'];
      task['avg_complete_time'] = task['completed_task_time'] / task['completed_task_count'];
      counter[key] = {
        'avg_assign_time': task['avg_assign_time'],
        'avg_complete_time': task['avg_complete_time']
      }
    }
    $.message['counter'] = counter;
    $.message['creeps'] = this.statCreepsInRoom();
    if (Game.time % 100 == 0) {
      let json = JSON.stringify($.message, null, 2);
      $.log.info(json);
    }
    if (Game.time % 5000 == 0) {
      let json = JSON.stringify($.message);
      Game.notify(json, 0);
    }
  }

  /* 统计某个房间内各类Creep数量 */
  statCreepsInRoom(room) {
    let creeps_count = { };
    for (const role of global.roles) {
      creeps_count[role.type] = { count: 0 };
    }
    creeps_count.total_count = _.size(Game.creeps);
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creeps_count[creep.memory.type]) {
        creeps_count[creep.memory.type].count += 1;
      }
      if (creep.memory.role) {
        if (!creeps_count[creep.memory.role]) {
          creeps_count[creep.memory.role] = 0;
        }
        creeps_count[creep.memory.role] += 1;
      }
    }
    return creeps_count;
  }
}

global.ops = new Operation();
