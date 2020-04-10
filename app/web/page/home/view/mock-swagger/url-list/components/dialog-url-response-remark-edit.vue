<template>
  <el-dialog
      title="编辑备注"
      width="400px"
      :visible.sync="dialogShow"
      :before-close="cancel">
    <el-form size="mini" :model="form">
      <el-form-item label="备注">
        <el-input size="mini" type="textarea" :autosize="{minRows: 4, maxRows: 7}" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="info" size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';

export default {
  props: ['_id', 'remark', 'urlResponseRemarkEditDialogVisible'],
  data() {
    return {
      form: {
        remark: '',
      },
      dialogShow: false,
    };
  },
  created() {
    this.form._id = this._id;
    this.form.remark = this.remark;
    this.dialogShow = this.urlResponseRemarkEditDialogVisible;
  },
  methods: {
    save() {
      if (this.form.remark) {
        request.post('/mock/api/url/response/remark/edit', this.form)
          .then(() => {
            this.$message({
              message: '编辑成功！',
              showClose: true,
              type: 'success',
            });
            this.$emit('urlResponseRemarkEditDialogCb', { isRefresh: true});
          });
      } else {
        this.cancel();
      }
    },
    cancel() {
      this.$emit('urlResponseRemarkEditDialogCb', { isRefresh: false});
    },
  },
};
</script>

<style scoped>

</style>