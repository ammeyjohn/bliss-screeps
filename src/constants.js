const Log = require('./log');

global.log = new Log();
global.settings = {
  log: {
    level: INFO
  }
};
