let TIME = 0;

exports.Game = {
  creeps: [],
  rooms: [],
  spawns: {},

  get time() {
    return TIME+=1;
  }
};

exports.Memory = {
  creeps: []
};
