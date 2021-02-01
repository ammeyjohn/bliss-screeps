global.$ = global;
global.settings = { };
global.structures = { };
global.message = { };
global.profile = {
  tasks: { }
};

global.SOURCE = 'source';
global.DEFAULT_PRIORITY = 100;
global.WALL_MULTIPLE = 10;
global.HITS_PERCENT = 0.2;
global.ENERGY_PERCENT = 0.3;
global.WALLTHROUGHT_COUNT = 10;

global.roles = [
  {
    prefix: 'stronger',      // 名称前缀
    type: 'stronger',        // 角色类型
    energy: 400,             // 所需能量
    body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE]  // 创建身体部件
  },
  // {
  //   prefix: 'normal',        // 名称前缀
  //   type: 'normal',          // 角色类型
  //   energy: 200,             // 所需能量
  //   body: [WORK,CARRY,MOVE]  // 创建身体部件
  // }
];

global.tasks = {
  'harvest': {
    max_count: 5,
    priority: 200
  },
  'upgrade': {
    max_count: 2,
    priority: 50
  },
  'build': {
    max_count: 5,
    priority: 75
  },
  'repair': {
    max_count: 3,
    priority: 100
  },
  'transport': {
    max_count: 5,
    priority: 150
  }
};
for (const key in $.tasks) {
  $.profile.tasks[key] = {
    assigned_task_count: 0,
    assigned_task_time: 0,
    completed_task_count: 0,
    completed_task_time: 0,
    avg_assign_time: 0.0,
    avg_complete_time: 0.0
  }
}

global.procedures = {
  'link_transfer': {
    creep: {
      type: 'link_transfer', // 名称前缀
      energy: 400,             // 所需能量
      body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],  // 创建身体部件
      role: 'harvester'
    },
    sink_linkid: '',
    storageid: '',
    creepname: '',
    sources: [{
      linkid: '',
      sourceid: '',
      creepname: ''
    }]
  }
};
