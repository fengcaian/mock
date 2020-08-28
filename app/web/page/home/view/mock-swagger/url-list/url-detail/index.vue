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
            <el-button type="success" size="mini" v-if="urlObject.source === 'swagger'" @click="generateMockData">生成模拟数据</el-button>
            <el-button type="success" size="mini" @click="addUrlResponseByHand">手动添加</el-button>
            <el-button type="primary" size="mini" disabled @click="doRequest">发送请求</el-button>
        </el-form>
        <el-table
            border
            size="mini"
            :data="dataList"
            @selection-change="batchSelect"
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="类型" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.dataType === 'mock_data' ? 'mock数据' : '后端数据'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="详情" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="showDetail(scope.row)">{{JSON.stringify(scope.row.response)}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="生成时间" align="center" width="140"></el-table-column>
            <el-table-column label="备注" align="center" width="140">
                <template slot-scope="scope">
                    <el-input size="mini" class="width-110 pointer" readonly v-model="scope.row.remark">
                        <i class="el-icon-edit icon-button" slot="suffix" @click="editRemark(scope.row)"></i>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="是否设为优先数据" align="center" width="140">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.isPriority"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="true"
                        :inactive-value="false"
                        @change="setPriority(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
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
                    :current-page="searchParam.currentPage"
                    :page-sizes="[10, 15, 20, 50]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
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
        <dialog-url-response-add-by-hand
            v-if="isShowUrlResponseAddByHandDialog"
            :urlResponseAddByHandDialogVisible="isShowUrlResponseAddByHandDialog"
            :urlObject="urlObject"
            @addUrlResponseByHandDialogCb="addUrlResponseByHandDialogCb">
        </dialog-url-response-add-by-hand>
        <dialog-url-response-remark-edit
            v-if="isShowUrlResponseRemarkEditDialog"
            :urlResponseRemarkEditDialogVisible="isShowUrlResponseRemarkEditDialog"
            :_id="_id"
            :remark="remark"
            @urlResponseRemarkEditDialogCb="urlResponseRemarkEditDialogCb">
        </dialog-url-response-remark-edit>
    </div>
</template>

<script type="jsx">
import request from '@/app/web/framework/network/request';
import dialogUrlResponseDetail from '../components/dialog-url-response-detail';
import dialogEditUrlResponse from '../components/dialog-edit-url-response';
import dialogUrlResponseAddByHand from '../components/dialog-url-response-add-by-hand';
import dialogUrlResponseRemarkEdit from '../components/dialog-url-response-remark-edit';

export default {
  components: {
    dialogUrlResponseDetail,
    dialogEditUrlResponse,
    dialogUrlResponseAddByHand,
    dialogUrlResponseRemarkEdit,
  },
  data() {
    return {
      searchParam: {
        dataType: ['mock数据', '后端数据'],
        currentPage: 1,
        pageSize: 20,
        system: '',
        url: '',
        type: '',
        _id: '',
      },
      dataList: [],
      batchSelectArray: [],
      total: 0,
      _id: '',
      remark: '',
      urlResponseData: {},
      isShowUrlResponseDetailDialog: false,
      isShowUrlResponseEditDialog: false,
      isShowUrlResponseAddByHandDialog: false,
      isShowUrlResponseRemarkEditDialog: false,
      urlObject: {},
    };
  },
  created() {
    this.urlObject = this.$store.state.shareData;
    this.searchParam.system = this.urlObject.host;
    this.searchParam.url = this.urlObject.url;
    this.searchParam.type = this.urlObject.type;
    this.searchParam._id = this.$route.query._id;
    console.log(this.urlObject);
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
          this.total = res.result.totalRow;
        });
    },
    handleSizeChange(val) {
      this.searchParam.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.searchParam.currentPage = val;
      this.getDataList();
    },
    //批量选择
    batchSelect(val) {
      this.batchSelectArray = val;
    },
    generateMockData() {
      request.post('/mock/api/url/mock/data', { _id: this.$route.query._id, url: this.$store.state.shareData.url })
        .then((res) => {
          console.log(res);
          this.getDataList();
        });
    },
    addUrlResponseByHand() {
      this.isShowUrlResponseAddByHandDialog = true;
    },
    addUrlResponseByHandDialogCb(obj) {
      this.isShowUrlResponseAddByHandDialog = false;
      if (obj.isRefresh) {
        this.getDataList();
      }
    },
    doRequest() {
      const parameter = {};
      const parameterList = this.urlObject.parameters;
      parameterList.forEach(item => {
        parameter[item.key] = '';
      });
      let params = null;
      if (Object.keys(parameter) > 0) {
        params = parameter;
      }
      if (this.urlObject.type === 'post') {
        request.post(this.urlObject.url, params)
          .then((res) => {
            console.log(res);
          });
      } else if (this.urlObject.type === 'get') {
        request.get(this.urlObject.url, { params })
          .then((res) => {
            console.log(res);
          });
      }
    },
    showDetail(row) {
      this.urlResponseData = row;
      console.log(row);
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
    editRemark(row) {
      this._id = row._id;
      this.remark = row.remark;
      this.isShowUrlResponseRemarkEditDialog = true;
    },
    urlResponseRemarkEditDialogCb(obj) {
      if (obj.isRefresh) {
        this.getDataList();
      }
      this.isShowUrlResponseRemarkEditDialog = false;
    },
    setPriority(row) {
      request.post('/mock/api/url/response/set/priority', row)
        .then(() => {
          this.getDataList();
        });
    },
    deleteRow(row) {
      request.post('/mock/api/url/mock/data/delete/single', row)
        .then(() => {
          this.$message({
            message: '删除成功！',
            showClose: true,
            type: 'success',
          });
          this.getDataList();
        });
    },
    batchDel() {
      if (!this.batchSelectArray.length) {
        this.$message({
          message: '请选择！',
          showClose: true,
          type: 'warning',
        });
        return;
      }
      const ids = this.batchSelectArray.map(item => item._id).join(',');
      request.post('/mock/api/url/mock/data/delete/batch', { ids })
        .then(() => {
          this.$message({
            message: '批量删除成功！',
            showClose: true,
            type: 'success',
          });
          this.getDataList();
        });
    },
    back() {
      this.$router.push({ path: '/mock/url/list' });
    },
  },
}
</script>

<style scoped>
.width-percent-100 {
    width: 100%;
}
.width-110 {
    width: 110px;
}
.pointer {
    cursor: pointer;
}
</style>