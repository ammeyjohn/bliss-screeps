require('./constants');
require('./log');
// require('./proto.controller')
require('./proto.creep');
require('./proto.spawn');

module.exports.loop = () => {

  const room = _.values(Game.rooms)[0];

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

  const creeps = _.filter(Game.creeps, c => c.room.id == room.id);
  for (const creep of creeps) {
    if (creep.work) {
      creep.work();
    }
  }

  // 清理creeps缓存
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        global.log.info('Clearing non-existing creep memory:', name);
    }
  }
}

