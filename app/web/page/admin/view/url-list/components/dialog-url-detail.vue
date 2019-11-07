<template>
  <el-dialog
    title="url详情"
    width="1000px"
    :visible.sync="dialogShow"
    :before-close="close">
    <el-row>
      <div class="head" :class="{ 'green': urlObject.type === 'post', 'blue': urlObject.type === 'get' }">
        <div class="type" :class="{ 'green-square': urlObject.type === 'post', 'blue-square': urlObject.type === 'get' }">{{urlObject.type}}</div>
        <div class="url">{{urlObject.url}}</div>
        <div class="desc">{{urlObject.summary}}</div>
      </div>
    </el-row>
    <el-row class="title">Parameters</el-row>
    <div class="request" :class="{ 'green': urlObject.type === 'post', 'blue': urlObject.type === 'get' }">
      <el-row class="tbody" type="flex" justify="center">
        <el-col class="th" :span="14">Name</el-col>
        <el-col class="th" :span="10">Description</el-col>
      </el-row>
      <el-form ref="form" label-width="140px" :model="form">
        <el-row v-for="parameter in parameterList">
          <el-col :span="14">
            <el-form-item  :label="parameter.name">
              <el-input class="width-200" size="mini" v-model="form[parameter.name]"></el-input>
              <span>{{parameter.type}}{{parameter.format ? `（${parameter.format}）` : ''}}</span>
              <span class="red" v-if="parameter.required">*required</span>
            </el-form-item>
          </el-col>
          <el-col class="th" :span="10">{{parameter.description}}</el-col>
        </el-row>
      </el-form>
    </div>
        <pre class="dialog-height" v-high-light>
          <code class="json" spellcheck="false">{{urlData}}</code>
        </pre>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'urlData'],
  data() {
    return {
      dialogShow: false,
      form: {},
      parameterList: [],
      urlJSON: '',
      urlObject: {},
    };
  },
  created() {
    this.dialogShow = this.dialogVisible;
    this.urlJSON = JSON.stringify(this.urlData, null, 2);
    this.urlObject = JSON.parse(this.urlJSON);
    this.parameterList = this.urlObject.parameters;
    this.parameterList.forEach(item => {
      this.form[item.key] = '';
    });
  },
  methods: {
    close() {
      this.$emit('urlDetailDialogCb');
    },
  },
}
</script>

<style scoped>
  .dialog-height {
      max-height: 650px;
  }
  .head {
    height: 43px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .green {
    background: #E8F6F0;
    border: 1px solid #49CC90;
  }
  .blue {
    background: rgba(97,175,254,.1);
    border: 1px solid #61AFFE;
  }
  .green-square {
    background: #49CC90;
  }
  .blue-square {
    background: #61AFFE;
  }
  .type {
    display: inline-block;
    width: 80px;
    height: 33px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    margin-left: 6px;
    color: #FFFFFF;
  }
  .url {
    margin-left: 12px;
  }
  .desc {
    margin-left: 12px;
  }
  .title {
    margin: 15px 0;
  }
  .th {
    text-align: center;
    padding-bottom: 10px;
  }
  .tbody {
    margin: 15px;
    border-bottom: 1px solid grey;
  }
  .width-200 {
    width: 200px;
  }
  .red {
    color: #FA5555;
  }
  .request {
    border-radius: 4px;
  }
</style>