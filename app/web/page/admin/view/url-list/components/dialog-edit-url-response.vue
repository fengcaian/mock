<template>
    <el-dialog
        title="编辑接口返回值"
        width="500px"
        :visible.sync="dialogShow"
        :before-close="close">
        <el-input type="textarea" :rows="20" :autosize="{ minRows: 4 }" v-model="responseJSON"></el-input>
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
      response: {},
      responseJSON: '',
      notExistProps: ['_id', 'url', 'urlId', 'dataType', '__v'],
    };
  },
  created() {
    this.dialogShow = this.editUrlResponseDialogVisible;
    const resData = JSON.parse(JSON.stringify(this.urlResponseData));
    Object.keys(resData).forEach(key => {
      if (this.notExistProps.indexOf(key) === -1) {
        this.response[key] = resData[key];
      }
    });
    this.responseJSON = JSON.stringify(this.response, null, 2);
  },
  methods: {
    confirm() {
      const params = JSON.parse(this.responseJSON);
      params._id = this.urlResponseData._id;
      request.post('/mock/api/url/response/edit', params)
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