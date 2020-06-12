class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用

    // 从数据库加载需要代理的系统到内存缓存
    const proxySystem = await this.app.model.SynthesizeConfig.find();
    this.app.proxySystemList = proxySystem || [];
    console.log(666);
    console.log(this.app.proxySystemList);
  }

  async serverDidReady() { // serverDidReady
    console.log('egg server is closed');
  }
}
module.exports = AppBootHook;