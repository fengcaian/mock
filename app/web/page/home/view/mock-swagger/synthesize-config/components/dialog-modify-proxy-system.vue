<template>
  <el-dialog
      title="修改配置"
      width="700px"
      :close-on-click-modal="false"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" size="mini" label-width="120px" :model="form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统URL" prop="system" :rules="[
            { required: true, message: '请输入系统URL', trigger: 'blur' },
          ]">
            <el-input class="width-200" v-model="form.system"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实端口">
            <el-input class="width-100" v-model="form.realPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="mini" @click="close">取 消</el-button>
      <el-button type="primary" size="mini" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';

export default {
  props: ['modifyProxySystemDialogVisible', 'config'],
  data() {
    return {
      dialogShow: false,
      form: {
        system: '',
        realPort: '',
      },
    };
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.config));
    this.dialogShow = this.modifyProxySystemDialogVisible;
  },
  methods: {
    close() {
      this.$emit('modifyProxySystemDialogCb', { isRefresh: false });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request.post('/mock/api/synthesize/config/modify', this.form)
            .then(() => {
              this.$message({
                message: '修改配置成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('modifyProxySystemDialogCb', { isRefresh: true });
            });
        }
      });
    },
  },
}
</script>

<style scoped>
  .width-100 {
    width: 100px;
  }
  .width-200 {
    width: 200px;
  }
</style>