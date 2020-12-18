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
    this.executors = [];            // 任务分配到的creep
    this.hasCompleted = false;      // 表示任务是否已经完成
  }

  /**
   * 设置任务的执行人
   * @param {array} executors
   */
  setExecutors(...executors) {
    if (this.executors.length >= this.options.exec_count) {
      global.bulletin.warning(`Task executors count overflow. ${this.taskId}`)
      return;
    }
    for (let exec of executors) {
      let executor = Game.getObjectById(exec.id);
      if (!executor.canAssign(this)) {
        continue;
      }
      this.executors.push(exec);
      executor.workTask = this;
    }
  }

  /**
   * 标志任务已经完成
   */
  complete() {
    this.hasCompleted = true;
    for (let exec of executors) {
      let executor = Game.getObjectById(exec.id);
      executor.workTask = null;
    }
  }

  /**
   * 验证任务是否有效
   */
  isValid() {
    global.bulletin.warning('Abstract task.');
    return false;
  }

  /**
   * 执行任务。任务执行成功返回true，否则返回false。
   */
  execute() {
    global.bulletin.warning('Abstract task.');
    return false;
  }
}
