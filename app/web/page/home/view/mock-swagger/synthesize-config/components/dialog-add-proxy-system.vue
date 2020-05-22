<template>
  <el-dialog
      title="新增配置"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" size="mini" label-position="left" :inline="false" :model="form" :rules="rules">
      <el-form-item label="Key" prop="key">
        <el-input class="width-p-100" v-model.trim="form.key"></el-input>
      </el-form-item>
      <el-form-item label="Value" prop="value">
        <el-input class="width-p-100" v-model.trim="form.value"></el-input>
      </el-form-item>
      <el-form-item label="Content">
        <el-input class="width-p-100" type="textarea" :rows="10" v-model.trim="form.content"></el-input>
      </el-form-item>
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
  props: ['addConfigDialogVisible'],
  data() {
    return {
      dialogShow: false,
      form: {
        key: '',
        value: '',
        content: '',
      },
      rules: {
        key: [
          { required: true, message: '请输入Key值', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请输入Value值', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.dialogShow = this.addConfigDialogVisible;
  },
  methods: {
    close() {
      this.$emit('addConfigDialogCb', { isRefresh: false });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request.post('/mock/api/synthesize/config/add', this.form)
            .then(() => {
              this.$message({
                message: '新增配置成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('addConfigDialogCb', { isRefresh: true });
            });
        }
      });
    },
  },
}
</script>

<style scoped>

</style>