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
    ],
  },
};

export default menu;