const Task = require('./task');
const WorkHarvester = require('./work_harvester');
const WorkUpgrader = require('./work_upgrader');
const WorkBuilder = require('./work_builder');
const WorkRepairer = require('./work_repairer');
const WorkTransporter = require('./work_transporter');

/**
 * 定义公告板对象，用于保存和管理任务
 */

class Bulletin {
  constructor() {
    if (!Memory.tasks) {
      Memory.tasks = [];
    }
  }

  get tasks() {
    return Memory.tasks;
  }
  set tasks(value) {
    Memory.tasks = value;
  }

  get taskCount() {
    return Memory.tasks.length;
  }

  /**
   * 确定是否可以发布针对特定目标的指定类型任务
   * @param {*} taskType
   * @param {*} targetId
   */
  canPublish(taskType, targetId) {
    let count = _.filter(this.tasks, t => t.hasCompleted == false &&
                                     t.taskType == taskType).length;
    return count < $.tasks[taskType].max_count;
  }

  /**
   * 发布任务
   * @param {*} taskType
   * @param {*} sourceId
   * @param {*} targetId
   * @param {*} priority  任务优先级，默认为100，数值越高优先级越高
   * @param {*} options
   */
  publish(taskType, sourceId, targetId, priority = DEFAULT_PRIORITY, options = {}) {
    // 如果任务强制添加，则不检查任务是否可添加
    if (options.forced || !this.canPublish(taskType, targetId)) {
      log.debug(`The count of task ${taskType} for ${targetId} has excceeded.`);
      return;
    }
    const task = new Task(taskType, sourceId, targetId, priority, options);
    this.addTask(task);
    log.info(`Task published: ${taskType} for ${targetId}. (${this.taskCount})`, options.forced?'forced=true':null);
    return task;
  }

  /**
   * 向公告板添加任务
   * @param {*} task
   */
  addTask(item) {
    let idx = 0;
    for (let i = 0; i < this.taskCount; i++) {
      const task = this.tasks[i];
      // 优先级大的排在前面
      if (item.priority > task.priority) {
        idx = i;
        break;
      } else if (item.priority == task.priority) {
        // 优先级相同的按照创建时间排列，时间小的排在前面
        for (let j = i; j < this.taskCount; j++) {
          const task1 = this.tasks[j];
          if (item.priority != task1.priority) {
            idx = j;
            break;
          }
          if (item.createTime < task1.createTime) {
            idx = j;
            break;
          }
        }
        break;
      }
    }
    this.tasks.splice(idx, 0, item);
  }

  /**
   * 从公告板删除任务
   * @param {*} taskId
   */
  delTask(taskId) {
    this.tasks = _.remove(this.tasks, t => t.taskId === taskId);
  }

  /**
   * 根据任务类型创建Worker
   * @param {*} task
   */
  createWorker(task) {
    let worker = null;
    switch (task.taskType) {
      case TASK_HARVEST: worker = new WorkHarvester(task); break;
      case TASK_UPGRADE: worker = new WorkUpgrader(task); break;
      case TASK_BUILD: worker = new WorkBuilder(task); break;
      case TASK_REPAIR: worker = new WorkRepairer(task); break;
      case TASK_TRANSPORT: worker = new WorkTransporter(task); break;
      // case TASK_ATTACK: worker = new WorkAttacker(task); break;
      default:
        log.error('Invalid task type ', task.taskType);
        break;
    }
    return worker;
  }

  /**
   * 是否存在指定编号的任务
   * @param {*} taskId
   */
  hasTask(taskId) {
    return Array.indexOf(this.tasks, t => t.taskId == taskId) > -1;
  }

  /**
   * 根据编号获取任务
   * @param {*} taskId
   */
  getTask(taskId) {
    if (this.taskCount == 0) {
      return null;
    }
    let task = _.find(this.tasks, t => t.taskId == taskId);
    if (task) {
      let worker = this.createWorker(task);
      if (!worker) {
        task.hasCompleted = true;
      }
      return worker;
    }
    return null;
  }

  /**
   * 分配任务
   */
  dispatch() {
    for (let task of this.tasks) {
      if (task.executorId != null || task.hasCompleted) {
        continue;
      }

      const source = Game.getObjectById(task.sourceId);
      if (source == null) {
        task.hasCompleted = true;
        continue;
      }

      // 获取最近的空闲creep
      const creep = source.pos.findClosestByPath(FIND_MY_CREEPS, {
        filter: function(obj) {
          // 未分配任务，且可以接收当前任务
          return !obj.assigned && obj.canAssign(task);
        }
      });
      if (creep == null) {
        // 如果无法分配到creep执行任务，请求控制器创建
        source.room.controller.incubate();
        continue;
      }

      if (creep != null) {
        // 将任务分配给creep
        creep.assign(task);
        task.executorId = creep.id;

        log.info(`Task assigned: ${task.taskId} ==> ${creep.name}`);

        $.profile['assigned_task_count'] += 1;
        $.profile['assigned_task_time'] += (Game.time - task.createTime);
      }

    }
  }

  /**
   * 任务完成，清除任务
   * @param {*} task
   */
  complete(taskId) {
    const idx = this.tasks.findIndex(t => t.taskId == taskId);
    if (idx > -1) {
      const task = this.tasks[idx];
      this.tasks.splice(idx, 1);
      log.info(`Task completed: ${task.taskId};`);

      $.profile['completed_task_count'] += 1;
      $.profile['completed_task_time'] += (Game.time - task.createTime);
    }
  }

  /**
   * 请求完成针对特定目标的指定类型任务
   * @param {*} taskType
   * @param {*} targetId
   */
  reqComplete(taskType, targetId) {
    for (let task of this.tasks) {
      if (task.taskType !== taskType || task.targetId !== targetId) {
        continue;
      }
      let executor = Game.getObjectById(task.executorId);
      if (executor) {
        executor.unassign(task);
      }
      task.hasCompleted = true;
      log.info(`Task completed: ${task.taskId};`);
    }
  }

  /**
   * 清理所有已经完成的任务
   */
  clear() {
    let idx = this.taskCount - 1;
    while(idx >= 0) {
      let task = this.tasks[idx];
      if (task.hasCompleted) {
        // 删除已经完成的任务
        this.tasks.splice(idx, 1);
        idx -= 1;
        continue;
      }
      if (task.executorId != null) {
        const executor = Game.getObjectById(task.executorId);
        if (executor == null) {
          task.executorId = null;
        }
      }

      idx -= 1;
    }
    log.info('Clearing completed and invalid tasks.', this.tasks.length);
  }
}

$.bulletin = new Bulletin();
