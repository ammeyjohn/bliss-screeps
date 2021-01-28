/**
 * 定义Link采集过程
 * source/container -> linkA .... linkB -> storage
 */

const Procedure = require('./procedure');
const Task = require('./task');
const WorkHarvester = require('./work_harvester');
const WorkTransporter = require('./work_transporter');

module.exports =
  class LinkHarvestProcedure extends Procedure {
    constructor(name) {
      super(name);
    }

    /**
     * 初始化过程
     */
    initialize(setting) {
      this.workers = [];
      this.setting = setting;

      // 创建能量采集任务
      for (let src of setting.sources) {
        const harvest_task = new Task(TASK_HARVEST, src.sourceid, src.linkid, 0,
          { creepname: src.creepname });
        this.workers.push(new WorkHarvester(harvest_task));
      }

      // 创建能量运输任务
      const transport_task = new Task(TASK_TRANSPORT, setting.sink_linkid, setting.storageid, 0,
        { creepname: setting.creepname });
      this.workers.push(new WorkTransporter(transport_task));
    }

    /**
     * 执行过程
     */
    execute() {

      const sinklink = Game.getObjectById(this.setting.sink_linkid);
      if (sinklink == null) {
        return;
      }

      // 执行采集或者传输任务
      for (let worker of this.workers) {
        const name = worker.options.creepname;
        const creep = Game.creeps[name];
        if (!creep) {
          // 如果指定的creep不存在，则创建
          const spawn = _.values(Game.spawns)[0];
          spawn.spawnCreep(this.setting.creep.body, name, { memory: {role: 'LinkHarvestProcedure'} });
          continue;
        }
        worker.dispatch(creep.id);
        worker.execute();
      }

      // 执行能量传输，如果sink能量不满则传输
      for (const src of this.setting.sources) {
        if (sinklink.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          const srclink = Game.getObjectById(src.linkid);
          srclink.transferEnergy(sinklink);
        }
      }
    }
}
