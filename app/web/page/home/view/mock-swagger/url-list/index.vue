<template>
    <div class="wrap">
        <el-form size="mini" :inline="true" :model="searchParams">
            <el-form-item label="系统：">
                <el-input class="search-input" size="mini" clearable v-model="searchParams.system" placeholder="系统"></el-input>
            </el-form-item>
            <el-form-item label="url：">
                <el-input class="search-input" size="mini" clearable v-model="searchParams.url" placeholder="url"></el-input>
            </el-form-item>
            <el-form-item label="url名称：">
                <el-input class="search-input" size="mini" clearable v-model="searchParams.summary" placeholder="url"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="search-button" size="mini" type="primary" @click="search">查询</el-button>
                <el-button class="search-button" size="mini" type="primary" @click="addUrlByHand">手动新增url</el-button>
            </el-form-item>
        </el-form>
        <el-table
            border
            size="mini"
            :data="dataList"
            :row-style="rowStyle"
            v-loading="loading"
            element-loading-text="拼命加载中"
            @selection-change="batchSelect"
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="host" label="所属系统"></el-table-column>
            <el-table-column label="所属分组" width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.tags[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="url名称">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="lookUrlDetail(scope.row)">查看url详情</el-button>
                    <el-button type="text" size="mini" @click="goToDetail(scope.row)">{{scope.row.summary}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="url"></el-table-column>
            <el-table-column prop="type" label="类型" width="80"></el-table-column>
            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.requestTarget"
                        active-value="backend"
                        inactive-value="mock"
                        active-text="数据库"
                        inactive-text="模拟"
                        @change="requestTargetChanged(scope.row)">
                    </el-switch>
                    <router-link :to="{params: {id: scope.row.id}}" tag="span">
                        <el-button type="info" size="mini" icon="edit" @click="handleEdit(scope.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 16px">
            <div style="float:left">
                <el-button
                    type="danger"
                    icon="delete"
                    size="small"
                    :disabled="batchSelectArray.length === 0"
                    @click="batchDel"
                    slot="handler">
                    <span>批量删除</span>
                </el-button>
            </div>
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
        </div>
        <dialog-url-detail
            v-if="isShowUrlDetailDialog"
            :dialogVisible="isShowUrlDetailDialog"
            :urlData="row"
            @urlDetailDialogCb="urlDetailDialogCb">
        </dialog-url-detail>
        <dialog-url-edit
            v-if="isShowUrlEditDialog"
            :dialogVisible="isShowUrlEditDialog"
            :urlData="row"
            @urlEditDialogCb="urlEditDialogCb">
        </dialog-url-edit>
    </div>
</template>

<script type="jsx">
import request from '@/app/web/framework/network/request';
import * as constants from '@/app/web/framework/constants';

import keep from '@/app/web/framework/utils/mixin/keep';

import dialogUrlDetail from './components/dialog-url-detail';
import dialogUrlEdit from './components/dialog-url-edit';

export default {
  mixins: [keep],
  components: {
    dialogUrlDetail,
    dialogUrlEdit,
  },
  data() {
    return {
      searchParams: {
        system: '',
        url: '',
        summary: '',
        currentPage: 1,
        pageSize: 10
      },
      //请求时的loading效果
      loading: false,
      //批量选择数组
      batchSelectArray: [],
      dataList: [],
      total: 0,
      row: {},
      isShowUrlDetailDialog: false,
      isShowUrlEditDialog: false,
    };
  },
  computed: {},
  created() {
    this.search();
  },
  methods: {
    search() {
      this.searchParams.currentPage = 1;
      this.getList();
    },
    getList() {
      const params = {};
      Object.keys(this.searchParams).forEach((key) => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      request.get('/mock/api/url/list', params)
        .then(({ result }) => {
          this.dataList = result.dataList;
          this.total = result.totalRow;
        });
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange", val);
    },
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getList();
    },
    handleEdit(row) {
      this.row = row;
      this.isShowUrlEditDialog = true;
    },
    urlEditDialogCb(obj) {
      if (obj.isRefresh) {
        this.getList();
      }
      this.isShowUrlEditDialog = false;
    },
    handleDelete(index, row) {
      this.$confirm('将删除选择的url, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        request.post('/mock/api/url/delete', { _id: row._id })
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
    //批量选择
    batchSelect(val) {
      this.batchSelectArray = val;
    },
    //批量删除
    batchDel() {
      if (!this.batchSelectArray.length) {
        this.$message({
          message: '请选择！',
          type: 'warning',
        });
        return;
      }
      this.$confirm('将批量删除选择url, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        request.post('/mock/api/url/batch/delete', { _ids: this.batchSelectArray.map(item => item._id).join(',')})
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
    lookUrlDetail(row) {
      this.row = row;
      this.isShowUrlDetailDialog = true;
    },
    urlDetailDialogCb() {
      this.isShowUrlDetailDialog = false;
    },
    goToDetail(row) {
      this.$store.dispatch('SetShareData', row);
      this.$router.push(`/mock/url/detail?_id=${row._id}`);
    },
    requestTargetChanged(row) {
      request.post('/mock/api/url/request/target/switch', row)
        .then((res) => {
          this.$message({
            message: res.msg || '切换成功！',
            type: 'success',
          });
        });
    },
    addUrlByHand() {
      this.$router.push('/mock/url/add-url-by-hand');
    },
    rowStyle({ row }) {
      const o = constants.swaggerDefineHttpColor.find(item => item.code === row.type);
      if (o) {
        return { background: o.lightColor};
      }
      return { background: 'white'};
    },
  },
};
</script>
<style scope>
.wrap {
    padding: 10px;
}
</style>
