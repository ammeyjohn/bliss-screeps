require('./constants');
require('./log');
require('./bulletin');
require('./ops');
// 引用扩展
require('./proto.roomobject');
require('./proto.structure');
require('./proto.controller');
require('./proto.container');
require('./proto.storage');
require('./proto.tower');
require('./proto.wall');
require('./proto.creep');

log.debug('Server restart.');

module.exports.loop = () => {

  const room = _.values(Game.rooms)[0];

  // 房间人口管理
  // room.controller.population();

  // 所有炮塔进行防御
  const towers = room.find(FIND_STRUCTURES, {
    filter: function(obj) {
      return obj.structureType == STRUCTURE_TOWER;
    }
  });
  for (const idx in towers) {
    const tower = towers[idx];
    tower.defence();
  }

  // 推动creep执行任务
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    creep.execute();
  }

  // 遍历所有建筑，检查建筑状态，发现是否有需要处理的任务
  const structures = room.find(FIND_STRUCTURES, {
    filter: function(obj) {
      return obj.structureType == STRUCTURE_SPAWN ||
             obj.structureType == STRUCTURE_CONTAINER ||
             obj.structureType == STRUCTURE_STORAGE ||
             obj.structureType == STRUCTURE_CONTROLLER ||
             obj.structureType == STRUCTURE_EXTENSION ||
             obj.structureType == STRUCTURE_WALL ||
             obj.structureType == STRUCTURE_ROAD ||
             obj.structureType == STRUCTURE_TOWER;
    }
  });
  for (const idx in structures) {
    const structure = structures[idx];
    if (structure.repair) { structure.repair(); }
    if (structure.check) { structure.check(); }
  }

  // 设施建造任务
  let sites = room.find(FIND_CONSTRUCTION_SITES);
  for(const idx in sites) {
    const site = sites[idx];
    let source = site.getCheapSource(site);
    $.bulletin.publish(TASK_BUILD, source.id, site.id, $.tasks[TASK_BUILD].priority);
  }

  // 为creep分配任务
  $.bulletin.dispatch();

  // 房间清理
  if (Game.time % 100 == 0) {
    ops.clear();
  }

  // 定时发送汇总邮件
  ops.notifyProfile(room);
}

