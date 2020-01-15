<template>
  <div class="width-percent-100">
    <el-row class="top" type="flex" justify="space-around">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-back" type="info" @click="back">返回列表</el-button>
      </el-col>
      <el-col :span="12" class="tar">
        <el-button size="mini" icon="el-icon-check" type="primary" :loading="loading" @click="save">保存</el-button>
      </el-col>
    </el-row>
    <el-form ref="form" label-width="135px" size="mini" :model="urlForm" :rules="rules">
      <h4>基本信息</h4>
      <template>
        <el-row>
          <el-col :span="12">
            <el-form-item label="url名称:" prop="summary">
              <el-input class="width-200" v-model="urlForm.summary"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="url:" prop="url">
              <el-input class="width-200" v-model="urlForm.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-select v-model="urlForm.type" placeholder="请选择">
                <el-option v-for="item in urlType" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="host:" prop="host">
              <el-input class="width-200" v-model="urlForm.host"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务器IP：">
              <ip-address-input :value="urlForm.hostIp" :inline="true" @ipAddressInputCb="ipAddressInputCb"></ip-address-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';
import * as constants from '@/app/web/framework/constants';

import ipAddressInput from '@/app/web/component/ip-address-input';

export default {
  components: {
    ipAddressInput,
  },
  data() {
    return {
      loading: false,
      urlForm: {
        summary: '',
        url: '',
        type: '',
        host: '',
        hostIp: '',
      },
      rules: {
        summary: [
          { required: true, message: '请输入url名称!', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入url!', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择类型!', trigger: 'change' },
        ],
        host: [
          { required: true, message: '请输入host!', trigger: 'blur' },
        ],
      },
      urlType: constants.httpMethods,
    };
  },
  methods: {
    ipAddressInputCb(v) {
      this.urlForm.hostIp = v;
    },
    back() {
      this.$router.push({ path: '/url/list' });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          request.post('/mock/api/url/add/by/hand', this.urlForm)
            .then(() => {
              this.$message({
                message: '新增url成功！',
                showClose: true,
                type: 'success',
              });
              this.back();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
}
</script>

<style scoped>
  .top {
    margin: 20px 0;
  }
  .tar {
    text-align: right;
  }
  .width-percent-100 {
    width: 100%;
  }
  .width-200 {
    width: 200px;
  }
</style>