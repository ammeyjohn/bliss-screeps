# bliss-screeps
A screeps game world.

# TODO
- [x] 实现link的能量传输
- [ ] Link创建完成后配置能量传输模式
- [ ] 使用tower来辅助修复wall、rampart
- [ ] upgrade、build、repair都可以从storage获取能量
- [ ] 增加hauler（运输者），只包含CARRY和MOVE
- [ ] 优化creep任务执行逻辑，如果creep已经包含一部分能量，则不需要采集直接去目标处
- [ ] 维护道路，如果道路消失需要自动重新创建
- [ ] 维护建筑，如果建筑消失需要自动重新创建
- [ ] 自动建路，统计creep走过每个tile的次数，次数最多的tile建路
- [ ] 可以通过设置不同颜色的flag，实现自动铺路
- [ ] 任务优先级改为建筑优先级，建筑优先级可以根据离开source/container/storage的距离来推算
- [ ] 新建工具方法
- [ ] 调整storage的位置
- [ ] 开发命令模块，可以直接在console中输入命令
- [ ] 优化信息收集模块
- [ ] 优化不同种类任务数量和任务优先级
- [ ] 压缩task对象的属性名称和属性值，减少memory的占用量
- [ ] 优化creep寻路机制，将路线预先保存在内存中，减少cpu消耗
