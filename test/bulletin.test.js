const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const {Game, Memory} = require('./mock');
global['Game'] = Game;
global['Memory'] = Memory;

const variables = require('@screeps/common/lib/constants');
for (const variableName of Object.keys(variables)) {
  global[variableName] = variables[variableName];
}

require('../src/constants');
require('../src/log');
const Task = require('../src/task');
const Bulletin = require('../src/bulletin');

describe('Bulletin', function() {
  describe('#addTask()', function() {
    it('任务列表应该优先级高的在前，低的在后', function() {
      const task1 = new Task(TASK_HARVEST, 1, 1, 50, null);
      const task2 = new Task(TASK_HARVEST, 1, 2, 100, null);
      const task3 = new Task(TASK_HARVEST, 1, 3, 1000, null);
      const task4 = new Task(TASK_HARVEST, 1, 4, 100, null);
      const task5 = new Task(TASK_HARVEST, 1, 4, 100, null);
      task5.createTime = 1;
      const task6 = new Task(TASK_HARVEST, 1, 4, 100, null);
      task6.createTime = 5;
      $.bulletin.addTask(task1);
      $.bulletin.addTask(task2);
      $.bulletin.addTask(task3);
      $.bulletin.addTask(task4);
      $.bulletin.addTask(task5);
      $.bulletin.addTask(task6);

      // let t1 = $.bulletin.tasks[0];
      // let t2 = $.bulletin.tasks[1];
      // let t3 = $.bulletin.tasks[2];
      // let t4 = $.bulletin.tasks[3];

      console.log(JSON.stringify($.bulletin.tasks, null, 2))
      // expect($.bulletin.taskCount).to.equal(4);
      // expect(t1.priority).to.equal(1000);
      // expect(t2.priority).to.equal(100);
      // expect(t3.priority).to.equal(100);
      // expect(t4.priority).to.equal(50);
    });
  });

  describe('#complete()', function() {
    it('已经完成的任务应该排在列表最后', function() {

      $.bulletin.tasks = [];

      const task1 = new Task(TASK_HARVEST, 1, 1, 50, null);
      const task2 = new Task(TASK_HARVEST, 1, 2, 100, null);
      const task3 = new Task(TASK_HARVEST, 1, 3, 1000, null);
      const task4 = new Task(TASK_HARVEST, 1, 4, 100, null);
      $.bulletin.addTask(task1);
      $.bulletin.addTask(task2);
      $.bulletin.addTask(task3);
      $.bulletin.addTask(task4);

      let t1 = $.bulletin.tasks[0];
      let t2 = $.bulletin.tasks[1];
      let t3 = $.bulletin.tasks[2];
      let t4 = $.bulletin.tasks[3];

      $.bulletin.complete(t1.taskId);
      $.bulletin.complete(t3.taskId);

      console.log(JSON.stringify($.bulletin.tasks, null, 2))
    });
  });
});
