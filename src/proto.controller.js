/**
 * 定义控制器扩展，控制负责管理内容
 * * 人口管理
 */
Object.defineProperty(StructureController.prototype, 'name', {
  get: function() {
    return this.room.name;
  }
});

/**
 * 从房间查找可用的Spawn
 * 未在孵化的spawn
*/
const findAvailSpawn = (room) => {
  const spawns = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN }
  });
  for (const spawn of spawns) {
    if (!spawn.spawning) {
      return spawn;
    }
  }
  return null;
}

/**
 * 孵化creep
 */
StructureController.prototype.incubate = function() {
  for(const role of $.roles) {
    if (role.energy > this.room.energyAvailable) {
      continue;
    }
    const spawn = findAvailSpawn(this.room);
    if (!spawn) {
      // 如果无法获取到可用的spawn，那么本次不创建creep
      return;
    }
    spawn.spawnCreep(role.body, `${role.prefix}@${Game.time}`);
    log.info('Spawn creep: ', role.type);

    if (Game.time % 100 == 0) {
      const count = ops.statCreepsInRoom(this.room);
      log.info(JSON.stringify(count));
      $.message['creeps'] = count;
    }

    return;
  }
}

/**
 * 发布控制器能力收集任务
 */
StructureController.prototype.check = function() {
  let source = this.getCheapSource();
  bulletin.publish(TASK_UPGRADE, source.id, this.id, $.tasks[TASK_UPGRADE].priority);
}
