# mock系统

基于 Egg + Vue + Webpack ＋ Element 单页面管理系统骨架

- Egg + Vue + Vuex + Vue-Router + Webpack
- Egg 只提供数据服务，页面由 Vue 前端渲染
- Auto Building, Hot Reload, Code Splitting, High Speed, Performance Optimization
- 统一 fetchApi 请求，内置国际化支持

开发环境的请求可以接入mock服务，在后端服务未启动的情况下，mock服务将会根据请求到的swagger中的接口进行数据模拟，模拟的数据存入mongoDB，
支持对模拟的数据进行自定义，用开关的方式控制开发环境中的接口是使用真实的后端数据还是mock系统模拟的数据

## 使用

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

应用访问: http://127.0.0.1:7001


### 发布模式

- 首先在本地或者ci构建好jsbundle文件

```bash
npm run build 
```

- 然后,启动应用

```bash
npm start 
```

详细打包部署请见： http://hubcarl.github.io/easywebpack/vue/dev/

## 命令行

可以通过 [easywebpack-cli](https://github.com/easy-team/easywebpack-cli) 初始化本项目

## License

[MIT](LICENSE)
