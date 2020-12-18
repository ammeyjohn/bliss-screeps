const Task = require('./task');

/**
 * 定义harvest任务，实现creep从source或者Mineral收集资源
 */
module.exports = class TaskHarvest extends Task {
  constructor(source, target, priority, options) {
    super(TASK_HARVEST, source, target, priority, options);
  }

  /**
   * 验证harvest任务是否有效
   * 当目标对象存在且能量未满时任务有效，否则任务无效。
   */
  isValid() {

    // 验证源对象是否还存在
    let _source = Game.getObjectById(this.source.id);
    if (!_source) { return false; }

    // 验证源对象是否还有能量
    if (_source instanceof Source) {
      // 能力源
      return _source.energy > 0;
    }

    // 验证目标对象是否还存在
    let _target = Game.getObjectById(this.target.id);
    if (!_target) { return false; }

    return !this.hasCompleted;
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    if (this.executors.length == 0) {
      return false;
    }

    let _source = Game.getObjectById(this.source.id);
    let _target = Game.getObjectById(this.target.id);
    for (let id in this.executors) {
      let executor = Game.getObjectById(id);
      if (executor) {
        if(executor.store.getFreeCapacity() > 0) {
          if(executor.harvest(_source) == ERR_NOT_IN_RANGE) {
            executor.moveTo(_source, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
        }
        else {
          if (executor.transfer(_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            executor.moveTo(_target, {visualizePathStyle: {stroke: '#ffffff'}});
            // 能力运送到目标后标记任务完成
            this.complete();
          }
        }
      }
    }
  }
}
