$.TASK_HARVEST = 'harvest';       // 采集任务
$.TASK_UPGRADE = 'upgrade';       // 升级控制器
$.TASK_BUILD   = 'build';         // 升级控制器
$.TASK_REPAIR  = 'repair';        // 修复任务
$.TASK_ATTACK  = 'attack';        // 攻击任务
$.TASK_TRANSPORT  = 'transport';  // 运送任务

/**
 * 定义任务对象
 */
module.exports = class Task {
  /**
   *
   * @param {string} type       任务类型名称
   * @param {string} sourceId   任务源对象编号
   * @param {string} targetId   任务目标对象编号
   * @param {number} priority   任务优先级
   * @param {object} options    任务配置项
   */
  constructor(type, sourceId, targetId, priority, options) {
    const randstr = Math.random().toString(36).slice(-8)
    this.taskId = `${type}@${targetId}_${randstr}`;
    this.taskType = type;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.priority = priority;
    this.options = options;
    this.createTime = Game.time;    // 任务创建时间
    this.executorId = null;         // 任务分配到的执行者编号
    this.hasCompleted = false;      // 表示任务是否已经完成
  }
}
