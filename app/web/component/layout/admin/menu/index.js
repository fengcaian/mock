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
        name: 'menu.synthesizeset',
        icon: 'el-icon-edit-outline',
        path: '/mock/synthesize/set'
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
        path: '/model/database/check/list'
      },
      {
        name: 'menu.check',
        icon: 'el-icon-edit-outline',
        path: '/model/database/check'
      },
    ],
  },
};

export default menu;