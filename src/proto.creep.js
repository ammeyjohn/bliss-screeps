/**
 * 定义Creep扩展
 */
Object.defineProperty(Creep.prototype, 'workTask', {
  get: function() {
    return this.memory.workTask;
  },
  set: function(value) {
    this.memory.workTask = value;
  }
})

Creep.prototype.task_harvest = function(task) {
  if(this.store.getFreeCapacity() > 0) {
    var sources = this.room.find(FIND_SOURCES);
    if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  }
  else {
    let target = Game.getObjectById(task.target.id);
    if (target) {
      if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
  }
}

Creep.prototype.work = function() {
  if (this.spawning) { return; }
  if (!this.workTask) {
    const task = global.bulletin.assignTo(this.name);
    this.workTask = task;
  }

  if (this.workTask) {
    switch(this.workTask.taskType) {
      case TASK_HARVEST:
        this.task_harvest(this.workTask);
        break;
    }
  }
}

Creep.prototype.complete = function() {
  this.workTask = null;
}
