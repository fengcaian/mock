const menu = {
  home: {
    name: 'menu.home',
    path: '/',
    icon: 'el-icon-menu',
  },
  url: {
    name: 'menu.urlmanage',
    icon: 'el-icon-document',
    children: {
      list: {
        name: 'menu.urlquery',
        icon: 'el-icon-edit-outline',
        path: '/url/list'
      },
    },
  },
  system: {
    name: 'menu.systemmanage',
    icon: 'el-icon-document',
    children: {
      list: {
        name: 'menu.systemquery',
        icon: 'el-icon-edit-outline',
        path: '/system/list'
      },
    },
  },
};

export default menu;