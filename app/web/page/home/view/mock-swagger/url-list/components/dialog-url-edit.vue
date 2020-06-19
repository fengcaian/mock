<template>
  <el-dialog
      title="编辑url"
      width="600px"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" label-width="140px" size="mini" :model="form">
      <el-form-item label="url名称:" prop="summary">
        <el-input class="width-200" v-model="form.summary"></el-input>
      </el-form-item>
      <el-form-item label="url:">
        <el-input class="width-200" v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="类型:">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option v-for="item in urlType" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="host:">
        <el-input class="width-200" v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="ip地址:">
        <ip-address-input :value="form.hostIp" :inline="true" @ipAddressInputCb="ipAddressInputCb"></ip-address-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';
import ipAddressInput from '@/app/web/component/ip-address-input';
import * as constants from '@/app/web/framework/constants';

export default {
  props: ['dialogVisible', 'urlData'],
  components: {
    ipAddressInput,
  },
  data() {
    return {
      dialogShow: false,
      form: {
        _id: '',
        summary: '',
        type: '',
        url: '',
        host: '',
        hostIp: '',
      },
      urlType: constants.httpMethods,
    };
  },
  created() {
    this.form = {
      _id: this.urlData._id,
      type: this.urlData.type,
      summary: this.urlData.summary,
      host: this.urlData.host,
      url: this.urlData.url,
      hostIp: this.urlData.hostIp
    };
    this.dialogShow = this.dialogVisible;
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request.post('/mock/api/url/update', this.form)
            .then(() => {
              this.$message({
                message: '更新系统成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('urlEditDialogCb', { isRefresh: true });
            });
        }
      })
    },
    ipAddressInputCb(v) {
      this.form.hostIp = v;
    },
    close() {
      this.$emit('urlEditDialogCb', { isRefresh: false });
    },
  },
}
</script>

<style scoped>
.width-200 {
  width: 200px;
}
</style>
