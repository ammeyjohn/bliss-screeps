const Task = require('./task');

/**
 * 定义公告板对象
 */
module.exports = class Bulletin {
  constructor() {
    if (!Memory.bulletin) {
      Memory.bulletin = {
        queue: [],
        assigned_queue: []
      }
    }
    this._queue = Memory.bulletin.queue;
    this._assigned_queue = Memory.bulletin.assigned_queue;
  }

  /**
   * 获取公告板任务数量
   */
  get taskCount() {
    return this._queue.length;
  }

  /**
   * 向公告板发布任务
   * @param {string} name 任务名称
   * @param {string} type 任务类型
   * @param {object} publisher 任务来源
   * @param {object} target 任务目标
   * @param {object} options  任务配置项，默认为null
   * @param {object} data     任务附加数据，默认为null
   * @param {number} priority 任务优先级，默认100。 优先级数字越小，优先级越高
   */
  publish(name, type, publisher, target, priority = 100, options = null, data = null) {
    let task = new Task(name, type, publisher, target, priority, options, data);
    task.taskState = TASK_WAITING;
    this._queue.push(task);
    global.log.debug(`Tasks queue count: ${this.taskCount}`);

    // 按照priority和tick升序排列
    this._queue = _.sortBy(this._queue, ['priority', 'tick']);
    Memory.bulletin.queue = this._queue;
    return task;
  }

  /**
   * 获取一个任务
   */
  getTask() {
    if (this.taskCount == 0) {
      return null;
    }
    const task = this._queue.pop();
    this._assigned_queue.push(task);
    return task;
  }

  /**
   * 根据任务类型获取任务列表
   * @param {string} type
   */
  getTaskByType(type) {
    const idx = _.findIndex(this._queue, t => { t.taskType === type });
    const task = this._queue[idx];
    this._queue.splice(idx, 1)
    this._assigned_queue.push(task);
    return task;
  }
}
