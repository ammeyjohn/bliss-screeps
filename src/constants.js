global.$ = global;
global.settings = { };
global.structures = { };
global.message = { };
global.profile = {
  assigned_task_count: 0,
  assigned_task_time: 0,
  completed_task_count: 0,
  completed_task_time: 0
};

global.DEFAULT_PRIORITY = 100;
global.WALL_LEVEL_HITS = 100000;
global.HITS_PERCENT = 0.2;

global.roles = [
  {
    prefix: 'stronger',      // 名称前缀
    type: 'stronger',        // 角色类型
    energy: 400,             // 所需能量
    body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE]  // 创建身体部件
  },
  {
    prefix: 'normal',        // 名称前缀
    type: 'normal',          // 角色类型
    energy: 200,             // 所需能量
    body: [WORK,CARRY,MOVE]  // 创建身体部件
  }
];

global.tasks = {
  'harvest': {
    max_count: 5,
    priority: 200
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
  'transport': {
    max_count: 5,
    priority: 150
  }
};
