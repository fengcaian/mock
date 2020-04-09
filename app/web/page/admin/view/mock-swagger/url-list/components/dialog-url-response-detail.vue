<template>
    <el-dialog
        title="接口返回值详情"
        width="500px"
        :visible.sync="dialogShow"
        :before-close="close">
        <pre v-high-light class="wrap">
          <code class="json" spellcheck="false">{{response}}</code>
        </pre>
    </el-dialog>
</template>

<script>
export default {
  props: ['urlResponseDetailDialogVisible', 'urlResponseData'],
  data() {
    return {
      dialogShow: false,
      response: null,
    };
  },
  created() {
    console.log(this.urlResponseData.response);
    this.dialogShow = this.urlResponseDetailDialogVisible;
    this.response = this.urlResponseData.response;
  },
  methods: {
    close() {
      this.$emit('urlResponseDetailDialogCb');
    },
  },
}
</script>

<style scoped>
  .wrap {
    max-height: 500px;
    z-index: 1000;
  }
</style>