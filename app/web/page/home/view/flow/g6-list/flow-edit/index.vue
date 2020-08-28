<template>
  <div>
    <editor v-if="g6Data.nodes" @saveG6GraphData="saveG6GraphData" :data="g6Data"></editor>
  </div>
</template>

<script>
import request from '@/app/web/framework/network/request';
import editor from './../../../.././../../component/my-editor';

export default {
  components: {
    editor,
  },
  data() {
    return {
      g6Data: {}
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      request.get('/mock/api/flow/g6/get', {
        _id: this.$route.query.id
      })
        .then((res) => {
          this.g6Data = {
            combos: res.result.combos,
            groups: res.result.groups,
            nodes: res.result.nodes,
            edges: res.result.edges,
          };
        });
    },
    saveG6GraphData(data) {
      console.log(data);
      request.post('/mock/api/flow/g6/save', data)
        .then((res) => {
          this.$message({
            message: res.msg || '保存成功！',
            type: 'success',
          });
        });
    },
  },
}
</script>

<style scoped>
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>