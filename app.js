class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    console.log(1111111);
  }

  async serverDidReady() {
    console.log(222222222);
  }
}

module.exports = AppBootHook;
