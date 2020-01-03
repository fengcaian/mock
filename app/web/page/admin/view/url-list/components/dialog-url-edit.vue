<template>
  <el-dialog
      title="编辑url"
      width="600px"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" label-width="140px" size="mini" :model="form">
      <el-form-item label="url:">{{form.url}}</el-form-item>
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
import IpAddressInput from '@/app/web/component/layout/IpAddressInput';

export default {
  props: ['dialogVisible', 'urlData'],
  components: {
    IpAddressInput,
  },
  data() {
    return {
      dialogShow: false,
      form: {
        _id: '',
        url: '',
        hostIp: '',
      },
    };
  },
  created() {
    this.form._id = this.urlData._id;
    this.form.url = this.urlData.url;
    this.form.hostIp = this.urlData.hostIp;
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

</style>