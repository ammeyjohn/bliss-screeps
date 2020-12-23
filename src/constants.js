global.$ = global;
global.settings = { };

global.roles = [
  {
    prefix: 'harvester',        // 名称前缀
    type: 'harvester',          // 角色类型
    min_count: 5,               // 最少数量
    energy: 200,                // 所需能量
    body: [WORK,CARRY,MOVE]     // 创建身体部件
  }, {
    prefix: 'upgrader',
    type: 'upgrader',
    min_count: 2,
    energy: 200,
    body: [WORK,CARRY,MOVE]
  }
];

global.tasks = {
  'harvest': {
    max_count: 1,
    max_period: 100,
    priority: 50
  },
  'upgrade': {
    max_count: 1,
    max_period: 100,
    priority: 50
  }
};
