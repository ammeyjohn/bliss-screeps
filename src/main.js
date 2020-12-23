require('./constants');
require('./log');
require('./bulletin');
// 引用扩展
require('./proto.controller');
require('./proto.spawn');
require('./proto.creep');

log.warning('Server restart.');


module.exports.loop = () => {

  const room = _.values(Game.rooms)[0];

  // 房间人口管理
  room.controller.population();

  // 遍历所有建筑，检查建筑状态，发现是否有需要处理的任务
  const structures = room.find(FIND_MY_STRUCTURES, {
    filter: function(obj) {
      return obj.structureType == STRUCTURE_SPAWN
    }
  });
  for (const idx in structures) {
    const structure = structures[idx];
    if (structure.check) {
      structure.check();
    }
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
  }
}

