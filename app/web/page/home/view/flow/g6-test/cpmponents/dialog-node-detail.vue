<template>
  <el-dialog
    title="节点详情"
    width="500px"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogShow"
    :before-close="cancel">
    <el-form size="mini" :model="form">
      <el-form-item label="节点名称：">
        <span>1111</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="cancel">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['nodeDetailDialogVisible'],
  data() {
    return {
      dialogShow: false,
      form: {},
    };
  },
  created() {
    this.dialogShow = this.nodeDetailDialogVisible;
  },
  methods: {
    cancel() {
      this.$emit('dialogNodeDetailCb');
    },
  },
}
</script>

<style scoped>

</style>