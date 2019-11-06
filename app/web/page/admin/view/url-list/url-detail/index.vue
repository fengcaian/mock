<template>
    <div class="width-percent-100">
        <el-row type="flex" justify="space-around">
            <el-col :span="24">
                <el-button size="mini" icon="el-icon-back" type="info" @click="back">返回列表</el-button>
            </el-col>
        </el-row>
        <el-form size="mini" :inline="true" :model="searchParam">
            <el-form-item label="类型：">
                <el-checkbox-group v-model="searchParam.dataType" @change="checkboxChanged">
                    <el-checkbox label="mock数据"></el-checkbox>
                    <el-checkbox label="后端数据"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-button type="success" size="mini" @click="generateRandomData">生成随机数据</el-button>
        </el-form>
        <el-table :data="dataList" style="width: 100%">
            <el-table-column label="类型" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.mock === 'mock_data' ? 'mock数据' : '后端数据'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="详情" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="showDetail(scope.row)">{{JSON.stringify(scope.row)}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <dialog-url-response-detail
            v-if="isShowUrlResponseDetailDialog"
            :urlResponseDetailDialogVisible="isShowUrlResponseDetailDialog"
            :urlResponseData="urlResponseData"
            @urlResponseDetailDialogCb="urlResponseDetailDialogCb">
        </dialog-url-response-detail>
        <dialog-edit-url-response
            v-if="isShowUrlResponseEditDialog"
            :editUrlResponseDialogVisible="isShowUrlResponseEditDialog"
            :urlResponseData="urlResponseData"
            @editUrlResponseDialogCb="editUrlResponseDialogCb">
        </dialog-edit-url-response>
    </div>
</template>

<script type="jsx">
import request from '@/app/web/framework/network/request';
import dialogUrlResponseDetail from '../components/dialog-url-response-detail';
import dialogEditUrlResponse from '../components/dialog-edit-url-response';

export default {
  components: {
    dialogUrlResponseDetail,
    dialogEditUrlResponse,
  },
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
      urlResponseData: {},
      isShowUrlResponseDetailDialog: false,
      isShowUrlResponseEditDialog: false,
    };
  },
  created() {
    this.searchParam.urlId = this.$route.query.id;
    this.getDataList();
  },
  methods: {
    checkboxChanged() {
        this.getDataList();
    },
    getDataList() {
      const params = {};
      Object.keys(this.searchParam).forEach(key => {
        if (key !== 'dataType') {
          params[key] = this.searchParam[key];
        } else {
          params[key] = this.searchParam[key].join(',');
        }
      });
      request.get('/mock/api/url/response/list', params)
        .then((res) => {
          this.dataList = res.result.dataList;
        });
    },
    generateRandomData() {
      request.post('/mock/api/url/mock/data', { _id: this.$route.query.id })
        .then((res) => {
          console.log(res);
          this.getDataList();
        });
    },
    showDetail(row) {
      this.urlResponseData = row;
      this.isShowUrlResponseDetailDialog = true;
    },
    urlResponseDetailDialogCb() {
      this.isShowUrlResponseDetailDialog = false;
    },
    edit(row) {
      this.urlResponseData = row;
      this.isShowUrlResponseEditDialog = true;
    },
    editUrlResponseDialogCb(obj) {
      this.isShowUrlResponseEditDialog = false;
      if (obj.isRefresh) {
        this.getDataList();
      }
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