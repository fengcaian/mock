<template>
  <div>
    <el-form size="mini" :inline="true" :model="searchParams">
      <el-form-item label="名称：">
        <el-input class="search-input" size="mini" clearable v-model="searchParams.name" placeholder="系统"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="search-button" size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        border
        :data="dataList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%;">
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="goToView(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
    </el-table>
    <div style="margin-top: 16px">
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
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';

import keep from '@/app/web/framework/utils/mixin/keep';

export default {
  mixins: [keep],
  data() {
    return {
      searchParams: {
        name: '',
        currentPage: 1,
        pageSize: 10
      },
      loading: false,
      dataList: [
        {
          name: '取货流程',
          id: 1
        }
      ],
      total: 0,
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
      const params = {};
      Object.keys(this.searchParams).forEach((key) => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      request.get('/mock/flow/list', params)
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
    goToView() {
      this.$router.push('/mock/flow/view');
    },
  },
}
</script>

<style scoped>

</style>