<template>
  <el-dialog
      title="手动添加response"
      width="500px"
      :visible.sync="dialogShow"
      :before-close="close">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="接口返回值:" prop="response">
        <el-input type="textarea" :rows="20" :autosize="{ minRows: 10 }" v-model="form.response"></el-input>
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

export default {
  props: ['urlResponseAddByHandDialogVisible', 'urlObject'],
  data() {
    return {
      dialogShow: false,
      form: {
        response: '',
      },
      rules: {
        response: [
          { required: true, message: '请填写', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              try {
                JSON.parse(value);
                callback();
              } catch (e) {
                callback(new Error('JSON格式不正确，请修改为正确的JSON格式！'));
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.dialogShow = this.urlResponseAddByHandDialogVisible;
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            system: this.urlObject.host,
            url: this.urlObject.url,
            type: this.urlObject.type,
            dataType: 'mock_data',
            response: JSON.parse(this.form.response),
          };
          request.post('/mock/api/url/response/add', params)
            .then(() => {
              this.$message({
                message: '新增成功！',
                showClose: true,
                type: 'success',
              });
              this.$emit('addUrlResponseByHandDialogCb', { isRefresh: true });
            });
        }
      });
    },
    close() {
      this.$emit('addUrlResponseByHandDialogCb', { isRefresh: false });
    },
  },
}
</script>

<style scoped>

</style>