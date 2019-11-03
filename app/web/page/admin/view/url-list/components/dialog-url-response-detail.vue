<template>
    <el-dialog
        title="接口返回值详情"
        width="500px"
        :visible.sync="dialogShow"
        :before-close="close">
        <pre class="dialog-height" v-high-light>
          <code class="json" spellcheck="false">{{[urlResponseData]}}</code>
        </pre>
    </el-dialog>
</template>

<script>
export default {
  props: ['urlResponseDetailDialogVisible', 'urlResponseData'],
  data() {
    return {
      dialogShow: false,
    };
  },
  created() {
    console.log(this.urlResponseData);
    this.dialogShow = this.urlResponseDetailDialogVisible;
  },
  methods: {
    close() {
      this.$emit('urlResponseDetailDialogCb');
    },
  },
}
</script>

<style scoped>

</style>