
global.TASK_CREATED = 'created';
global.TASK_WAITING = 'wait';
global.TASK_ASSIGNED = 'assigned';
global.TASK_WORKING = 'work';
global.TASK_COMPLETE = 'complete';
global.TASK_INVALID = 'invalid';

/**
 * 定义任务对象
 */
module.exports = class Task {
  /**
   *
   * @param {string} type       任务类型名称
   * @param {object} publisher  任务发布人
   * @param {object} target     任务目标对象
   * @param {object} options    任务配置项，默认为null
   * @param {object} data       任务附加数据，默认为null
   * @param {number} priority   任务优先级，默认100
   */
  constructor(type, publisher, target, priority, options = null, data = null) {
    this.taskId = `${type}@${target.id}_${Game.time}`;
    this.taskType = type;
    this.publisher = publisher;
    this.target = target;
    this.priority = priority;
    this.options = options;
    this.data = data;
    this.taskTime = Game.time;      // 任务创建时间
    this.taskState = TASK_CREATED;  // 任务状态
    this.creepName = null;          // 任务分配到的creep
  }
}
