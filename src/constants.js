global.$ = global;
global.settings = { };
global.structures = { };
global.message = { };

global.DEFAULT_PRIORITY = 100;
global.WALL_LEVEL_HITS = 30000;
global.HITS_PERCENT = 0.2;

global.roles = [
  {
    prefix: 'normal',        // 名称前缀
    type: 'normal',          // 角色类型
    min_count: 13,           // 最少数量
    energy: 200,             // 所需能量
    body: [WORK,CARRY,MOVE]  // 创建身体部件
  }
];

global.tasks = {
  'harvest': {
    max_count: 5,
    priority: 125
  },
  'upgrade': {
    max_count: 2,
    max_period: 100,
    priority: 50
  },
  'build': {
    max_count: 5,
    max_period: 100,
    priority: 75
  },
  'repair': {
    max_count: 3,
    max_period: 100,
    priority: 100
  },
};
