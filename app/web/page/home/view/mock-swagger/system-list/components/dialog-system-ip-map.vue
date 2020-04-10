<template>
  <el-dialog
      title="系统地址-IP地址映射"
      width="600px"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" size="mini" label-width="90px" :model="form">
      <el-form-item label="地址：">
        <label>{{system.systemUrl}}</label>
      </el-form-item>
      <el-form-item id="ipAddressForm" v-for="(item, index) in form.ipList" :key="item.code" :label="`${item.label}：`">
        <ip-address-input :value="item.value" :inline="true" :tag="index" @ipAddressInputCb="ipAddressInputCb"></ip-address-input>
        <el-button type="danger" size="mini" icon="el-icon-minus" @click="deleteIpAddress(index)">移除</el-button>
      </el-form-item>
    </el-form>
    <el-button type="success" size="mini" icon="el-icon-plus" @click="appendIpAddress">追加一行IP地址</el-button>
    <span slot="footer">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';

import ipAddressInput from '@/app/web/component/ip-address-input';

export default {
  props: ['system', 'systemIpMapDialogVisible'],
  components: {
    ipAddressInput,
  },
  data() {
    return {
      dialogShow: false,
      form: {
        ipList: [
          {
            code: Math.random(),
            label: 'IP地址1',
            value: '',
          }
        ],
      },
    };
  },
  created() {
    if (this.system.ipAddressList.length) {
      this.form.ipList = JSON.parse(JSON.stringify(this.system.ipAddressList));
    }
    this.dialogShow = this.systemIpMapDialogVisible;
  },
  methods: {
    appendIpAddress() {
      this.form.ipList.push({
        code: Math.random(),
        label: `IP地址${this.form.ipList.length + 1}`,
        value: '',
      });
    },
    deleteIpAddress(i) {
      this.form.ipList.splice(i ,1);
      if (this.form.ipList.length === 0) {
        this.appendIpAddress();
      }
    },
    ipAddressInputCb(v, tag) {
      this.form.ipList[tag].value = v;
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            _id: this.system._id,
            ipAddressList: this.form.ipList.map(item => ({label: item.label, value: item.value})),
          };
          request.post('/mock/api/system/add/ipaddress', params)
            .then(() => {
              this.$message({
                message: '更新系统IP地址成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('systemIpMapDialogCb', { isRefresh: true });
            });
        }
      });
    },
    close() {
      this.$emit('systemIpMapDialogCb', { isRefresh: true });
    },
  },
}
</script>

<style scoped>
  .width-70{
    width: 70px;
  }
</style>
<style>
  #ipAddressForm .el-input__inner{
    text-align: center;
  }
</style>