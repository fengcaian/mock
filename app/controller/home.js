const Controller = require('egg').Controller;

class HomeController extends Controller {
  // async index() {
  //   this.ctx.body = 'Hello world';
  // }
  async server() {
    const { ctx } = this;
    // render 实现是服务端渲染 vue 组件
    await ctx.render('home/home.js', { message: 'egg vue server side render' });
  }

  async client(ctx) {
    const url = ctx.url.replace(/\/mock/, '');
    // renderClient 前端渲染，Node层只做 layout.html和资源依赖组装，渲染交给前端渲染。与服务端渲染的差别你可以通过查看运行后页面源代码即可明白两者之间的差异
    await ctx.renderClient('home/index.js', { ctx, url });
  }

  async frontRouterForward(ctx) {
    const url = ctx.url.replace(/\/mock/, '');
    await ctx.renderClient('home/index.js', { ctx, url });
  }

  async index() {
    const { ctx } = this;
    await ctx.render('home/home.js', Model.getPage(1, 10));
  }
}

module.exports = HomeController;