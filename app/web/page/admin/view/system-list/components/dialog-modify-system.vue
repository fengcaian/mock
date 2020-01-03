<template>
  <el-dialog
    title="编辑系统"
    width="600px"
    :visible.sync="dialogShow"
    :before-close="close">
    <el-form ref="form" label-width="105px" size="mini" :model="form" :rules="rules">
      <el-form-item label="系统名称" prop="systemName">
        <el-input class="width-200" v-model="form.systemName"></el-input>
      </el-form-item>
      <el-form-item label="url" prop="systemUrl">
        <el-input class="width-200" v-model="form.systemUrl"></el-input>
      </el-form-item>
      <el-form-item label="api" prop="systemApi">
        <el-input class="width-350" v-model="form.systemApi">
          <template slot="append">默认为/v2/api-docs</template>
        </el-input>
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
      <el-form-item label="是否应用到url">
        <el-radio-group v-model="form.isUpdateUrlIp">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <div class="red">说明：该选项选中是则会将改动的ip更新到已加载的该系统所有url中</div>
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
  props: ['modifySystemDialogVisible', 'system'],
  components: {
    IpAddressInput,
  },
  data() {
    return {
      dialogShow: false,
      form: {
        _id: '',
        systemName: '',
        systemUrl: '',
        systemApi: '',
        isEnabled: false,
        ipAddress: '',
        isUpdateUrlIp: false,
      },
      rules: {
        systemName: [
          { required: true, message: '请填写系统名称', trigger: 'blur' },
        ],
        systemUrl: [
          { required: true, message: '请填写系统url', trigger: 'blur' },
        ],
        systemApi: [
          { required: true, message: '请填写系统api', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.form._id = this.system._id;
    this.form.systemName = this.system.systemName;
    this.form.systemUrl = this.system.systemUrl;
    this.form.systemApi = this.system.systemApi;
    this.form.isEnabled = this.system.isEnabled;
    this.form.ipAddress = this.system.ipAddressList.length ? this.system.ipAddressList[0].value : '';
    this.dialogShow = this.modifySystemDialogVisible;
  },
  methods: {
    ipAddressInputCb(v) {
      this.form.ipAddress = v;
    },
    confirm() {
      if (!this.form.ipAddress) {
        this.$message({
          message: '请填写IP地址！',
          showClose: true,
          type: 'warning',
        });
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            _id: this.form._id,
            systemName: this.form.systemName,
            systemUrl: this.form.systemUrl,
            systemApi: this.form.systemApi,
            isEnabled: false,
            isUpdateUrlIp: this.form.isUpdateUrlIp,
            ipAddressList: [{ label: 'IP地址1', value: this.form.ipAddress }],
          };
          request.post('/mock/api/system/update', params)
            .then(() => {
              this.$message({
                message: '更新系统成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('modifySystemDialogCb', { isRefresh: true });
            });
        }
      });
    },
    close() {
      this.$emit('modifySystemDialogCb', { isRefresh: false });
    },
  },
}
</script>

<style scoped>
  .width-200 {
    width: 200px;
  }
  .width-350 {
    width: 350px;
  }
  .red {
    color: red;
  }
</style>