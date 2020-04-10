<template>
    <el-dialog
        title="编辑接口返回值"
        width="500px"
        :visible.sync="dialogShow"
        :before-close="close">
        <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 15}" v-model="response"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="close">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">保 存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';

export default {
  props: ['editUrlResponseDialogVisible', 'urlResponseData'],
  data() {
    return {
      dialogShow: false,
      responseForm: {
        response: null,
      },
      response: '',
    };
  },
  created() {
    this.dialogShow = this.editUrlResponseDialogVisible;
    this.responseForm = JSON.parse(JSON.stringify(this.urlResponseData));
    this.response = JSON.stringify(this.responseForm.response, null, 2);
  },
  methods: {
    confirm() {
      try {
        this.responseForm.response = JSON.parse(this.response);
      } catch (e) {
        this.$message({
          message: 'JSON格式不正确，请修改为正确的JSON格式！',
          type: 'warning',
        });
        return;
      }
      request.post('/mock/api/url/response/edit', this.responseForm)
        .then(() => {
          this.$message({
            message: '保存成功！',
            showClose: true,
            type: 'success',
          });
          this.$emit('editUrlResponseDialogCb', { isRefresh: true });
        });
    },
    close() {
      this.$emit('editUrlResponseDialogCb', { isRefresh: false });
    },
  },
}
</script>

<style scoped>

</style>