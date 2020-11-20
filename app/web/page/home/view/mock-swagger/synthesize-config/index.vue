<template>
  <div class="wrap">
    <el-row>
      <el-col :span="12">
        <h3>需要代理的系统配置（在没有swagger时使用）</h3>
      </el-col>
      <el-col :span="12" class="tar">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addConfig">新增配置</el-button>
        <el-button type="success" size="mini" @click="publish">发布</el-button>
      </el-col>
    </el-row>
    <el-table
        stroke
        border
        :data="proxySystemList">
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="system" label="系统URL" align="center"></el-table-column>
      <el-table-column prop="realPort" label="真实端口" align="center"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-add-proxy-system
      v-if="isShowAddProxySystemDialog"
      :addProxySystemDialogVisible="isShowAddProxySystemDialog"
      @addProxySystemDialogCb="addProxySystemDialogCb">
    </dialog-add-proxy-system>
    <dialog-modify-proxy-system
      v-if="isShowModifyProxySystemDialog"
      :modifyProxySystemDialogVisible="isShowModifyProxySystemDialog"
      :config="config"
      @modifyProxySystemDialogCb="modifyProxySystemDialogCb">
    </dialog-modify-proxy-system>
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';

import dialogAddProxySystem from './components/dialog-add-proxy-system';
import dialogModifyProxySystem from './components/dialog-modify-proxy-system';

export default {
  components: {
    dialogAddProxySystem,
    dialogModifyProxySystem,
  },
  data() {
    return {
      isShowAddProxySystemDialog: false,
      isShowModifyProxySystemDialog: false,
      proxySystemList: [],
      config: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      request.get('/mock/api/synthesize/config/list')
        .then(({ result }) => {
          this.proxySystemList = result || [];
        })
    },
    addConfig() {
      this.isShowAddProxySystemDialog = true;
    },
    addProxySystemDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowAddProxySystemDialog = false;
    },
    publish() {},
    edit(row) {
      this.config = row;
      this.isShowModifyProxySystemDialog = true;
    },
    modifyProxySystemDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowModifyProxySystemDialog = false;
    },
  },
}
</script>

<style scoped>
  .wrap {
    padding: 10px;
  }
  .tar {
    text-align: right;
  }
</style>