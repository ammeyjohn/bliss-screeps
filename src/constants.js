const Log = require('./log');
const Bulletin = require('./bulletin');

global.TASK_SPAWN = 'spawn';

global.bulletin = new Bulletin();
global.log = new Log();
global.settings = {
  log: {
    level: DEBUG
  }
};

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
  }, {
    prefix: 'builder',
    type: 'builder',
    min_count: 5,
    energy: 200,
    body: [WORK,CARRY,MOVE]
  }
];
