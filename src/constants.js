global.$ = global;
global.settings = { };

global.roles = [
  {
    prefix: 'harvester',
    type: 'harvester',
    min_count: 5,
    energy: 200,
    body: [WORK,CARRY,MOVE]
  }, {
    prefix: 'upgrader',
    type: 'upgrader',
    min_count: 2,
    energy: 200,
    body: [WORK,CARRY,MOVE]
  }
];
