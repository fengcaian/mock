<template>
  <div>
    <el-table
      border
      :data="dataList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%;">
      <el-table-column prop="systemName" label="系统名称" align="center" width="200"></el-table-column>
      <el-table-column prop="systemUrl" label="url" align="center"></el-table-column>
      <el-table-column label="操作" width="350" align="center">
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
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';
import dialogAddSystem from './components/dialog-add-system';
import dialogModifySystem from './components/dialog-modify-system';

export default {
  components: {
    dialogAddSystem,
    dialogModifySystem,
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
      console.log(`每页 ${val} 条`);
      this.searchParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
  },
}
</script>

<style scoped>

</style>