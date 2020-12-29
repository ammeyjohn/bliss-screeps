require('./constants');
require('./log');
require('./bulletin');
// 引用扩展
require('./proto.structure');
require('./proto.controller');
require('./proto.spawn');
require('./proto.extension');
require('./proto.wall');
require('./proto.road');
require('./proto.creep');

log.debug('Server restart.');


module.exports.loop = () => {

  const room = _.values(Game.rooms)[0];

  // 房间人口管理
  room.controller.population();

  // 遍历所有建筑，检查建筑状态，发现是否有需要处理的任务
  const structures = room.find(FIND_STRUCTURES, {
    filter: function(obj) {
      return obj.structureType == STRUCTURE_SPAWN ||
             obj.structureType == STRUCTURE_CONTROLLER ||
             obj.structureType == STRUCTURE_EXTENSION ||
             obj.structureType == STRUCTURE_WALL ||
             obj.structureType == STRUCTURE_ROAD
    }
  });
  for (const idx in structures) {
    const structure = structures[idx];
    if (structure.check) {
      structure.check();
    }
  }

  // 设施建造任务
  let sites = room.find(FIND_CONSTRUCTION_SITES);
  for(const idx in sites) {
    const site = sites[idx];
    let source = room.find(FIND_SOURCES)[3];
    $.bulletin.publish(TASK_BUILD, source.id, site.id, $.tasks[TASK_BUILD].priority);
  }

  // 推动creep执行任务
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    creep.execute();
  }

  // 每100ticks清理creeps缓存
  if (Game.time % 100 == 0) {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          log.info('Clearing non-existing creep memory:', name);
      }
    }

    // 清理公告板中已经完成的任务
    $.bulletin.clear();
  }
}

