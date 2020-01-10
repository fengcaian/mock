<template>
  <div>
    <el-table
      border
      :data="dataList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%;">
      <el-table-column prop="systemName" label="系统名称" align="center" width="200"></el-table-column>
      <el-table-column label="url" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showSystemIpMap(scope.row)">{{scope.row.systemUrl}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header">
          操作
          <el-button type="success" size="mini" icon="el-icon-plus" @click="addSystem"></el-button>
        </template>
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.isEnabled"
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="关闭"
              @change="isEnabledChanged(scope.row)">
          </el-switch>
          <el-button type="info" size="mini" icon="edit" @click="modifySystem(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" icon="delete" @click="loadAPI(scope.row)">加载swagger接口</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float:right">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.currentPage"
          :page-sizes="[10, 15, 20, 50]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <dialog-add-system
      v-if="isShowAddSystemDialog"
      :addSystemDialogVisible="isShowAddSystemDialog"
      @addSystemDialogCb="addSystemDialogCb">
    </dialog-add-system>
    <dialog-modify-system
      v-if="isShowModifySystemDialog"
      :modifySystemDialogVisible="isShowModifySystemDialog"
      :system="systemObj"
      @modifySystemDialogCb="modifySystemDialogCb">
    </dialog-modify-system>
    <dialog-system-ip-map
      v-if="isShowSystemIpMapDialog"
      :systemIpMapDialogVisible="isShowSystemIpMapDialog"
      :system="systemObj"
      @systemIpMapDialogCb="systemIpMapDialogCb">
    </dialog-system-ip-map>
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';
import dialogAddSystem from './components/dialog-add-system';
import dialogModifySystem from './components/dialog-modify-system';
import dialogSystemIpMap from './components/dialog-system-ip-map';

export default {
  components: {
    dialogAddSystem,
    dialogModifySystem,
    dialogSystemIpMap,
  },
  data() {
    return {
      searchParams: {
        currentPage: 1,
        pageSize: 10
      },
      dataList: [],
      total: 0,
      loading: false,
      isShowAddSystemDialog: false,
      isShowModifySystemDialog: false,
      isShowSystemIpMapDialog: false,
      systemObj: null,
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.searchParams.currentPage = 1;
      this.getList();
    },
    getList() {
      request.get('/mock/api/system/list', this.searchParams)
        .then(({ result }) => {
          this.dataList = result.dataList;
          this.total = result.totalRow;
        });
    },
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getList();
    },
    addSystem() {
      this.isShowAddSystemDialog = true;
    },
    addSystemDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowAddSystemDialog = false;
    },
    modifySystem(row) {
      this.systemObj = row;
      this.isShowModifySystemDialog = true;
    },
    modifySystemDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowModifySystemDialog = false;
    },
    isEnabledChanged(row) {
      request.post('/mock/api/system/enable', row)
        .then((res) => {
          this.$message({
            message: res.msg || '切换成功！',
            type: 'success',
          });
        });
    },
    handleDelete(row) {
      this.$confirm('将删除该system, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        request.post('/mock/api/system/delete', { _id: row._id })
          .then(() => {
            this.$message({
              message: '批量删除成功！',
              type: 'success',
            });
            this.getList();
          });
        this.loading = false;
      });
    },
    loadAPI(row) {
      this.$confirm('该系统下存在的所有接口将被加载替换，确认加载？', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => request.post('/mock/api/url/swagger', row), () => {})
        .then(() => {
          this.$message({
            message: '已加载该系统swagger接口！',
            type: 'success',
          });
        }, (e) => {
          this.$message({
            message: e || '该系统swagger服务可能未启动，更新失败！',
            type: 'warning',
          });
        });
    },
    showSystemIpMap(row) {
      this.systemObj = row;
      this.isShowSystemIpMapDialog = true;
    },
    systemIpMapDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowSystemIpMapDialog = false;
    },
  },
}
</script>

<style scoped>

</style>