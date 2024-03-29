const menu = {
  home: {
    name: 'menu.home',
    path: '/',
    icon: 'el-icon-menu',
  },
  mockSwagger: {
    name: 'menu.mockSwagger',
    icon: 'el-icon-document',
    children: [
      {
        name: 'menu.urlquery',
        icon: 'el-icon-edit-outline',
        path: '/mock/url/list'
      },
      {
        name: 'menu.systemquery',
        icon: 'el-icon-edit-outline',
        path: '/mock/system/list'
      },
      {
        name: 'menu.synthesizeConfig',
        icon: 'el-icon-edit-outline',
        path: '/mock/synthesize/config'
      }
    ],
  },
  modelDatabaseCheck: {
    name: 'menu.modelDatabaseCheck',
    icon: 'el-icon-document',
    children: [
      {
        name: 'menu.checkList',
        icon: 'el-icon-edit-outline',
        path: '/mock/model/database/check/list'
      },
      {
        name: 'menu.check',
        icon: 'el-icon-edit-outline',
        path: '/mock/model/database/check'
      },
      {
        name: 'menu.imageExif',
        icon: 'el-icon-edit-outline',
        path: '/mock/model/database/imageExif'
      },
    ],
  },
  flowManage: {
    name: 'menu.flowmanage',
    icon: 'el-icon-document',
    children: [
      {
        name: 'menu.flowList',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/list',
      },
      {
        name: 'menu.mxGraph',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/mx-graph',
      },
      {
        name: 'menu.g6',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/g6',
      },
      {
        name: 'menu.g6Test',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/g6-test',
      },
      {
        name: 'menu.g6List',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/g6-list',
      },
      {
        name: 'menu.x6Editor',
        icon: 'el-icon-edit-outline',
        path: '/mock/flow/x6-editor',
      }
    ],
  },
  js: {
    name: 'menu.js',
    icon: 'el-icon-document',
    children: [
      {
        name: 'menu.object-freeze',
        icon: 'el-icon-edit-outline',
        path: '/mock/js/object-freeze'
      },
    ],
  }
};

export default menu;