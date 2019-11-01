<template>
    <div class="width-percent-100">
        <el-row type="flex" justify="space-around">
            <el-col :span="24">
                <el-button size="mini" icon="el-icon-back" type="info" @click="back"></el-button>
            </el-col>
        </el-row>
        <el-form size="mini" :inline="true" :model="searchParam">
            <el-form-item label="类型：">
                <el-checkbox-group v-model="searchParam.dataType" @change="checkboxChanged">
                    <el-checkbox label="mock数据"></el-checkbox>
                    <el-checkbox label="后端数据"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" style="width: 100%">
            <el-table-column label="类型" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.mock === 'mock' ? 'mock数据' : '后端数据'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
    </div>
</template>

<script type="jsx">
import request from '@/app/web/framework/network/request';

export default {
  data() {
    return {
      searchParam: {
        dataType: ['mock数据', '后端数据'],
        currentPage: 1,
        pageSize: 20,
        urlId: '',
      },
      dataList: [],
      id: '',
    };
  },
  created() {
    this.searchParam.urlId = this.$route.query.id;
    this.getDataList();
  },
  methods: {
    checkboxChanged() {},
    getDataList() {
      const params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (key !== 'dataType') {
          params[key] = this.searchParams[key];
        } else {
          params[key] = this.searchParams[key].join('');
        }
      });
      request.get('/mock/api/url/response/list', params)
        .then((res) => {
          console.log(res);
        });
    },
    back() {
      this.$router.push({ path: '/url/list' });
    },
  },
}
</script>

<style scoped>
.width-percent-100 {
    width: 100%;
}
</style>