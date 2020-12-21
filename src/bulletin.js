const Task = require('./task');
const TaskWork = require('./task_work');

/**
 * 定义公告板对象
 */
module.exports = class Bulletin {
  constructor() {
    if (!Memory.bulletin) {
      Memory.bulletin = {
        queue: []
      }
    }
  }

  get queue() {
    return Memory.bulletin.queue;
  }
  set queue(value) {
    Memory.bulletin.queue = value;
  }

  /**
   * 获取公告板任务数量
   */
  get taskCount() {
    return this.queue.length;
  }

  /**
   * 检查某个建筑是否能够发布指定类型的任务
   * @param {*} target
   * @param {*} taskType
   */
  canPublish(target, taskType) {
    let count = _.filter(this.queue, t => t.target.id == target.id && t.taskType == taskType).length;
    return count < global.tasks[taskType].max_count;
  }

  /**
   * 向公告板发布任务
   * @param {string} type 任务类型
   * @param {object} source 任务源
   * @param {object} target 任务目标
   * @param {number} priority 任务优先级，默认100。 优先级数字越小，优先级越高
   * @param {object} options  任务配置项，默认为null
   * @param {object} data     任务附加数据，默认为null
   */
  publish(type, source, target, priority = 100, options = null, data = null) {
    // 验证是否可以发布任务
    if (!this.canPublish(target, type)) {
      return null;
    }

    let task = null;
    switch(type) {
      case TASK_HARVEST: task = new TaskHarvest(source, target, priority, options, data); break;
      default:
        global.bulletin.warning(`Invalid task type ${type}.`);
        return null;
    }
    this.queue.push(task);

    // 按照priority和tick升序排列
    this.queue = _.sortBy(this.queue, ['priority', 'tick']);
    global.log.debug(`Tasks queue count: ${this.taskCount}`);
    return task;
  }

  getAvailCreeps(taskType, count) {
    let creeps = [];
    for(let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.canAssign()) {
        creeps.push({ id: creep.id });
        if (creeps.length >= count) {
          break;
        }
      }
    }
    return creeps;
  }

  /**
   * 执行所有任务
   */
  execute() {

    // 清理无效的任务
    this.queue = _.remove(this.queue, function(task) {
      const work = TaskWork.fromTask(task);
      const ret = !work.isValid();
      if (ret) {
        global.log.info(`Task ${task.taskId} invalid.`);
      }
      return ret;
    });

    // 为任务分配执行者
    // for (let task in this.queue) {
    //   let lackCount = task.options.max_count - task.executes.length;
    //   if (lackCount > 0) {
    //     let creeps = this.getAvailCreeps(task.taskType, lackCount);
    //     if (creeps.length > 0) {
    //       task.setExecutors(...creeps);
    //     }
    //   }
    // }

  }
}
