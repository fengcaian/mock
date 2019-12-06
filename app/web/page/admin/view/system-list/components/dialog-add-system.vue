<template>
  <el-dialog
    title="添加系统"
    width="600px"
    :visible.sync="dialogShow"
    :before-close="close">
    <el-form ref="form" label-width="120px" size="mini" :model="form" :rules="rules">
      <el-form-item label="系统名称" prop="systemName">
        <el-input class="width-200" v-model="form.systemName"></el-input>
      </el-form-item>
      <el-form-item label="url" prop="systemUrl">
        <el-input class="width-200" v-model="form.systemUrl"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="form.isEnabled">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="ip地址">
        <ip-address-input :value="form.ipAddress" :inline="true" @ipAddressInputCb="ipAddressInputCb"></ip-address-input>
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
  props: ['addSystemDialogVisible'],
  components: {
    IpAddressInput,
  },
  data() {
    return {
      dialogShow: false,
      form: {
        systemName: '',
        systemUrl: '',
        isEnabled: false,
        ipAddress: '',
      },
      rules: {
        systemName: [
          { required: true, message: '请填写系统名称', trigger: 'blur' },
        ],
        systemUrl: [
          { required: true, message: '请填写系统url', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.dialogShow = this.addSystemDialogVisible;
  },
  methods: {
    ipAddressInputCb(v) {
      this.form.ipAddress = v;
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            systemName: this.form.systemName,
            systemUrl: this.form.systemUrl,
            isEnabled: false,
            ipAddressList: [{ label: 'IP地址1', value: this.form.ipAddress }],
          };
          request.post('/mock/api/system/add', params)
            .then(() => {
              this.$message({
                message: '新增系统成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('addSystemDialogCb', { isRefresh: true });
            });
        }
      })
    },
    close() {
      this.$emit('addSystemDialogCb', { isRefresh: false });
    },
  },
}
</script>

<style scoped>
  .width-200 {
    width: 200px;
  }
</style>