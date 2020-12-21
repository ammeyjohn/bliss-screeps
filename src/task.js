const DEFAULT_OPTIONS = {
  exec_count: 1
}

/**
 * 定义任务对象
 */
module.exports = class Task {
  /**
   *
   * @param {string} type       任务类型名称
   * @param {object} source     任务源对象
   * @param {object} target     任务目标对象
   * @param {object} options    任务配置项，默认为null
   * @param {object} data       任务附加数据，默认为null
   * @param {number} priority   任务优先级，默认100
   */
  constructor(type, source, target, priority, options, data) {
    this.taskId = `${type}@${target.id}_${Game.time}`;
    this.taskType = type;
    this.source = source;
    this.target = target;
    this.priority = priority;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.data = data;
    this.taskTime = Game.time;      // 任务创建时间
    this.executor = null;           // 任务分配到的creep
    this.hasCompleted = false;      // 表示任务是否已经完成
  }
}
