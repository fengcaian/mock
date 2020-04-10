<template>
  <div class='aside'>
      <el-menu
            router
            background-color='#222d32'
            text-color='#fff'
            default-active='1-4-1' class='menu' :collapse='collapse'>
          <template v-for='(menu_v,menu_k) in menu'>
            <el-submenu v-if='menu_v.children' :index='menu_k' :key='menu_k'>
              <template slot='title'>
                <i :class='menu_v.icon'></i>
                <span slot='title'>{{getMenu(menu_v.name)}}</span>
              </template>
              <el-menu-item v-for='(menuChildren_v,menuChildren_k) in menu_v.children' :key='menuChildren_k'
                            :index='menuChildren_v.path'>
                <i class='is-children'></i>
                <span slot='title'>{{ getMenu(menuChildren_v.name) }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index='menu_v.path' :key='menu_k'>
              <i :class='menu_v.icon'></i>
              <span slot='title'>{{getMenu(menu_v.name)}}</span>
            </el-menu-item>
          </template>
      </el-menu>  
  </div>
</template>
<style>
.aside {
  position: fixed;
  margin-top: 50px;
  min-height: calc(100vh - 50px);
  z-index: 10;
  background-color: #222d32;
  height: 100%;
}
</style>
<script type='text/babel'>
import menu from './index.js';
import { menuInfo } from '@/app/web/framework/constants';

export default {
  props: ['collapse'],
  data(){
    return { menu };
  },
  methods: {
    getMenu(prop) {
      if (prop.indexOf('.') !== -1) {
        const l = prop.split('.');
        return recursive(l, menuInfo);
      } else {
        return menuInfo[prop] || prop;
      }
      function recursive(list, obj) {
        let result = ''
        if (list.length === 1) {
          result = obj[list[0]] || list[0];
        } else {
          const key = list.shift();
          result = recursive(list, obj[key]);
        }
        return result;
      }
    },
  },
}
</script>    

<style>
.aside {
  position: fixed;
  margin-top: 50px;
  min-height: calc(100vh - 50px);
  z-index: 10;
  background-color: #222d32;
  height: 100%;
}
</style>