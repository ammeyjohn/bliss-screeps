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
  }

  get queue() {
    return Memory.bulletin.queue;
  }
  set queue(value) {
    Memory.bulletin.queue = value;
  }

  get assigned_queue() {
    return Memory.bulletin.assigned_queue;
  }
  set assigned_queue(value) {
    Memory.bulletin.assigned_queue = assigned_queue;
  }

  /**
   * 获取公告板任务数量
   */
  get taskCount() {
    return this.queue.length;
  }

  /**
   * 检查某个建筑是否能够发布指定类型的任务
   * @param {*} publisherId
   * @param {*} taskType
   */
  canPublish(publisherId, taskType) {
    let count = _.filter(this.queue, t => t.publisher.id == publisherId && t.taskType == taskType).length;
    count += _.filter(this.assigned_queue, t => t.publisher.id == publisherId && t.taskType == taskType).length;
    return count < global.tasks[taskType].max_count;
  }

  /**
   * 向公告板发布任务
   * @param {string} type 任务类型
   * @param {object} publisher 任务来源
   * @param {object} target 任务目标
   * @param {object} options  任务配置项，默认为null
   * @param {object} data     任务附加数据，默认为null
   * @param {number} priority 任务优先级，默认100。 优先级数字越小，优先级越高
   */
  publish(type, publisher, target, priority = 100, options = null, data = null) {
    if (!this.canPublish(publisher.id, type)) {
      return null;
    }
    // 验证target是否有效
    if (!Game.getObjectById(target.id)) {
      return null;
    }

    let task = new Task(type, publisher, target, priority, options, data);
    this.queue.push(task);

    // 按照priority和tick升序排列
    this.queue = _.sortBy(this.queue, ['priority', 'tick']);
    global.log.debug(`Tasks queue count: ${this.taskCount}`);
    return task;
  }

  assignTo(operName) {
    if (this.taskCount == 0) {
      return null;
    }
    let task = this.queue.pop();
    task.creepName = operName;
    this.assigned_queue.push(task);
    return task;
  }

  /**
   * 任务完成
   * @param {*} ids
   */
  complete(...ids) {

    // 删除未分配任务
    this.queue = _.remove(this.queue, t => _.find(ids, i => i == t.taskId));

    for (const id of ids) {
      // 删除已分配任务
      let idx = _.findIndex(this.assigned_queue, t => t.taskId == id);
      if (idx > -1) {
        const task = this.assigned_queue[idx];
        this.assigned_queue.splice(idx, 1);

        console.log(JSON.stringify(task));

        // 通知creep任务已经完成
        const creep = Game.creeps[task.creepName];
        if (creep) {
          console.log(task.creepName);
          creep.complete();
        }
      }
    }
  }
}
