global.$ = global;
global.settings = { };

global.roles = [
  {
    prefix: 'normal',        // 名称前缀
    type: 'normal',          // 角色类型
    min_count: 1,            // 最少数量
    energy: 200,             // 所需能量
    body: [WORK,CARRY,MOVE]  // 创建身体部件
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
  },
  'build': {
    max_count: 1,
    max_period: 100,
    priority: 50
  }
};
