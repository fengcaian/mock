<template>
  <div style="height:100%">
     <header class="header">
      <div class="top-left-bar" :class="{ 'top-left-bar-hidden': collapse, 'top-left-bar-show': !collapse }">
          <span>{{ collapse ? site.name : site.description }}</span>
      </div>
      <span class="header-btn" @click="sidebarToggle"><i class="el-icon-menu"></i></span>
      <div class="right">
        <span class="header-btn">
          <a v-bind:href="getMenu('lang.href')"><i class="el-icon-message"></i></a>
        </span>
        <el-dropdown>
          <span class="header-btn">
              {{getMenu('lang.text')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="switchLang('en')">英文</el-dropdown-item>
            <el-dropdown-item @click.native="switchLang('cn')">中文</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="header-btn">
          <el-badge :value="2" class="badge">
              <i class="el-icon-message"></i>
          </el-badge>
        </span>
        <span class="header-btn">
          <i class="el-icon-bell"></i>
        </span>
        <el-dropdown>
          <span class="header-btn">
              Mock<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{getMenu('header.profile')}}</el-dropdown-item>
            <el-dropdown-item @click.native="logout">{{getMenu('header.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <LeftMenu :collapse="collapse"></LeftMenu>
  </div>
</template>
<style></style>
<script type="jsx">
import request from '../../../../framework/network/request';
import { menuInfo } from '@/app/web/framework/constants';
import "./header.css";
import LeftMenu from "../menu/index.vue";
export default {
  components: {
    LeftMenu
  },
  data() {
    return {
      collapse: false,
      site: {
        name: "Mock",
        description: "mock"
      }
    };
  },
  computed: {},
  mounted: function() {
    if (!this.collapse) {
      document.body.classList.remove("sidebar-hidden");
    } else {
      document.body.classList.add("sidebar-hidden");
    }
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
        if (list.length === 1) {
          return obj[list[0]] || list[0];
        } else {
          const key = list.shift();
          recursive(list, obj[key]);
        }
      }
    },
    sidebarToggle(e) {
      e.preventDefault();
      if (this.collapse) {
        document.body.classList.remove("sidebar-hidden");
        this.collapse = false;
      } else {
        document.body.classList.add("sidebar-hidden");
        this.collapse = true;
      }
    },
    logout() {
      window.location.replace("/login");
    },
    switchLang(lang) {
      window.location.href = `/mock?locale=${lang}`;
    },
    refreshSwagger() {
      request.post('/mock/api/url/swagger')
        .then(({ data }) => {
            console.log(data);
        });
    },
  },
};
</script>
