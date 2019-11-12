# mock系统

基于 Egg + Vue + Webpack ＋ Element 单页面管理系统骨架

- Egg + Vue + Vuex + Vue-Router + Webpack
- Egg 只提供数据服务，页面由 Vue 前端渲染
- Auto Building, Hot Reload, Code Splitting, High Speed, Performance Optimization
- 统一 fetchApi 请求，内置国际化支持

开发环境的请求可以接入mock服务，在后端服务未启动的情况下，mock服务将会根据请求到的swagger中的接口进行数据模拟，模拟的数据存入mongoDB，
支持对模拟的数据进行自定义，用开关的方式控制开发环境中的接口是使用真实的后端数据还是mock系统模拟的数据

#mongodb安装
进入mongoDB下载页面：[mongodb下载地址](https://www.mongodb.com/download-center/community)，安装后配置环境变量，在*系统变量*的Path里面添加mongodb的安装路径，如：
<code>C:\Program Files\MongoDB\Server\4.0\bin</code>，配置完成后打开cmd终端可以使用<code>mongod -help</code>测试是否配置成功。然后启动mongodb数据库，在d盘
新建一个mock文件夹(也可以建个别的名称的文件夹，不过得需要将config.default.js里面的mongoose的url后面的mock改为新建的文件夹名称)，然后使用：<code>mongod --dbpath D:\mock</code>
来启动mongodb，然后再启动一个cmd终端，使用<code>mongod</code>进入mongodb数据来操作了，也可以下载Robo 3T这个终端来操作mongodb数据库

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
