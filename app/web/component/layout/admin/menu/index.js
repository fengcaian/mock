const menu = {
  home: {
    name: 'menu.home',
    path: '/',
    icon: 'el-icon-menu',
  },
  content: {
    name: 'menu.articlemanage',
    icon: 'el-icon-document',
    children: {
      list: {
        name: 'menu.articlequery',
        icon: 'el-icon-edit-outline',
        path: '/article/list'
      },
      add: {
        name: 'menu.articleadd',
        icon: 'el-icon-edit-outline',
        path: '/article/add'
      }
    }
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