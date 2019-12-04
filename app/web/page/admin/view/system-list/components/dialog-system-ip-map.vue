<template>
  <el-dialog
      title="系统地址-IP地址映射"
      width="600px"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" size="mini" :model="form">
      <el-form-item label="地址：">
        <label>https://ddd.com</label>
      </el-form-item>
      <el-form-item id="ipAddressForm" v-for="(item, index) in form.ipList" :key="item.code" :label="`${item.label}：`">
        <el-input class="width-80" :ref="`input-${index}-1`" v-model="item.value1"></el-input>
        <el-divider direction="vertical"></el-divider>
        <el-input class="width-80" :ref="`input-${index}-2`" v-model="item.value2" @keyup.enter.native="nextInputFocus(index, '2')"></el-input>
        <el-divider direction="vertical"></el-divider>
        <el-input class="width-80" :ref="`input-${index}-3`" v-model="item.value3" @keyup.enter.native="nextInputFocus(index, '3')"></el-input>
        <el-divider direction="vertical"></el-divider>
        <el-input class="width-80" :ref="`input-${index}-4`" v-model="item.value4" @keyup.enter.native="nextInputFocus(index, '4')"></el-input>
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

export default {
  props: ['systemIpMapDialogVisible'],
  data() {
    return {
      dialogShow: false,
      form: {
        ipList: [
          {
            code: Math.random(),
            label: 'IP地址1',
            value1: '',
            value2: '',
            value3: '',
            value4: '',
          }
        ],
      },
    };
  },
  created() {
    this.dialogShow = this.systemIpMapDialogVisible;
  },
  mounted() {
    if (this.$refs['input-0-1']) {
      this.$refs['input-0-1'].focus();
    }
  },
  methods: {
    appendIpAddress() {
      this.form.ipList.push({
        code: Math.random(),
        label: `IP地址${this.form.ipList.length + 1}`,
        value1: '',
        value2: '',
        value3: '',
        value4: '',
      });
    },
    deleteIpAddress(i) {
      this.form.ipList.splice(i ,1);
    },
    nextInputFocus(row, col) {
      this.$refs[`input-${row}-${col}`].focus();
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request.post('/mock/api/system/add/ipaddress', this.form)
            .then(() => {
              this.$message({
                message: '更新系统IP地址成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('systemIpMapDialogCb');
            });
        }
      });
    },
    close() {
      this.$emit('systemIpMapDialogCb');
    },
  },
}
</script>

<style scoped>
  .width-80{
    width: 80px;
  }
</style>
<style>
  #ipAddressForm .el-input__inner{
    text-align: center;
  }
</style>