require('./constants');
require('./log');

module.exports.loop = () => {



  // 清理creeps缓存
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        global.log.info('Clearing non-existing creep memory:', name);
    }
  }
}

