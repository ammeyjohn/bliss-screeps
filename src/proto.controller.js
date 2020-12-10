/**
 * 定义控制器扩展
 */


Object.defineProperty(StructureController.prototype, 'name', {
  get: function() {
    return this.room.name;
  }
});

/* 统计某个房间内各类Creep数量 */
const statCreepsInRoom = (room) => {
  let creeps_count = { };
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (!creeps_count[creep.memory.role]) {
      creeps_count[creep.memory.role] = {
        role: creep.memory.role,
        count: 0
      };
    }
    creeps_count[creep.memory.role].count += 1;
  }
  return creeps_count;
}

/**
 * 检查房间人口数量
 */
const checkPopulation = (room) => {
  let creeps_count = statCreepsInRoom(room);
  for (const role of global.roles) {
    const creep_count = creeps_count[role.type];
    if (!creep_count) {
      for (let i = 0; i < role.min_count; i++) {
        global.bulletin.publish(`${this.structureType}@${this.name}`, TASK_SPAWN, { id: this.id }, null, 100, null, role);
      }
    } else {
      if (creep_count.count < role.min_count) {
        for (let i = 0; i < role.min_count - creep_count.count; i++) {
          global.bulletin.publish(`${this.structureType}@${this.name}`, TASK_SPAWN, { id: this.id }, null, 100, null, role);
        }
      }
    }
  }
}

StructureController.prototype.check = function() {
  checkPopulation(this.room);
}
