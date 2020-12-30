/**
 * 定义控制器扩展，控制负责管理内容
 * * 人口管理
 */
Object.defineProperty(StructureController.prototype, 'name', {
  get: function() {
    return this.room.name;
  }
});

/* 统计某个房间内各类Creep数量 */
const statCreepsInRoom = (room) => {
  let creeps_count = { };
  for (const role of global.roles) {
    creeps_count[role.type] = {
      role: role,
      count: 0
    };
  }
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creeps_count[creep.memory.role]) {
      creeps_count[creep.memory.role].count += 1;
    }
  }
  return creeps_count;
}

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
 * 房间人口管理
 */
StructureController.prototype.population = function() {
  // 获取房间中各种creep的数量
  let creeps_count = statCreepsInRoom(this.room);

  for (const r in creeps_count) {
    const cnt = creeps_count[r];
    // 如果某种creep数量小于指定的数量，则需要创建这种creep
    if (cnt.count < cnt.role.min_count) {
      if (this.room.energyAvailable < cnt.role.energy) {
        // 如果房间能量不够，那么本次不创建
        continue;
      }
      // 获取可用的spawn，即未在孵化的spawn
      const spawn = findAvailSpawn(this.room);
      if (!spawn) {
        // 如果无法获取到可用的spawn，那么本次不创建creep
        return;
      }
      spawn.spawnCreep(cnt.role.body, `${cnt.role.prefix}@${Game.time}`, { memory: { role: cnt.role.type }});
      log.info('Spawn creep: ', cnt.role.type);
    }
  }

  if (Game.time % 20 == 0) {
    let str = '';
    for (const r in creeps_count) {
      const cnt = creeps_count[r];
      str += `,${cnt.role.type}:${cnt.count}`
    }
    log.info(str);
    $.message['creeps'] = str;
  }
}

/**
 * 发布控制器能力收集任务
 */
StructureController.prototype.check = function() {
  let source = this.getCheapSource();
  bulletin.publish(TASK_UPGRADE, source.id, this.id, $.tasks[TASK_UPGRADE].priority);
}

/**
 * 检索房间内是否有入侵者
 */
StructureController.prototype.defence = function() {
  const hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
  for (const name in hostileCreeps) {
    // 检测到有入侵者，发布攻击任务
    const hostile = hostileCreeps[name];
    // 查找入侵者附件是否有防御塔
    const tower = hostile.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: function(obj) {
          return obj.structureType == STRUCTURE_TOWER
      }
    });
    if (tower) {
      bulletin.publish(TASK_ATTACK, tower.id, hostile.id, $.tasks[TASK_ATTACK].priority);
    }
  }
}
