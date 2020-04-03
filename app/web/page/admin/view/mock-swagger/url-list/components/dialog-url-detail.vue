<template>
  <el-dialog
    title="url详情"
    width="1000px"
    :visible.sync="dialogShow"
    :before-close="close">
    <el-row>
      <div class="head" :style="{background: httpMethodColor.lightColor, border: `1px solid ${httpMethodColor.color}`}">
        <div class="type" :style="{background: httpMethodColor.color}">{{urlObject.type}}</div>
        <div class="url">{{urlObject.url}}</div>
        <div class="desc">{{urlObject.summary}}</div>
      </div>
    </el-row>
    <el-row class="title">
      <el-col :span="12" class="left">Parameters</el-col>
      <el-col :span="12" class="right">
        <el-button size="mini" @click="execute">execute</el-button>
      </el-col>
    </el-row>
    <div class="request" :style="{background: httpMethodColor.lightColor, border: `1px solid ${httpMethodColor.color}`}">
      <el-row class="tbody" type="flex" justify="center">
        <el-col class="th" :span="14">Name</el-col>
        <el-col class="th" :span="10">Description</el-col>
      </el-row>
      <el-form ref="form" label-width="160px" :model="form">
        <el-row v-for="parameter in parameterList" :key="parameter.name">
          <el-col :span="14">
            <el-form-item  :label="parameter.name" :prop="parameter.name" :rules="[
              { required: parameter.required, message: '请输入有效值', trigger: 'blur' }
            ]">
              <el-input class="width-200" size="mini" v-model="form[parameter.name]"></el-input>
              <span>{{parameter.type}}{{parameter.format ? `（${parameter.format}）` : ''}}</span>
              <span class="red" v-if="parameter.required">*required</span>
            </el-form-item>
          </el-col>
          <el-col class="th" :span="10">{{parameter.description}}</el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="title">
      <el-col :span="24" class="left">Responses</el-col>
    </el-row>
    <div class="request" :style="{background: httpMethodColor.lightColor, border: `1px solid ${httpMethodColor.color}`}">
      <tabs :tabs="tabs" :activeTabStyle="activeTabStyle" :tabScrollStyle="tabScrollStyle" @tabClick="tabClick"></tabs>
      <el-row class="tbody" type="flex" justify="center">
        <el-col class="th" :span="14">Code</el-col>
        <el-col class="th" :span="10">Description</el-col>
      </el-row>
      <div v-if="isModelTabActive">
        <el-row v-for="response in responseList" :key="response.code">
          <el-col :span="4">{{response.code}}</el-col>
          <el-col :span="20">
            <div>
              <pre style="background: initial" class="dialog-height" v-high-light>
                <code class="json" spellcheck="false">{{response}}</code>
              </pre>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else></div>
    </div>
        <!--<pre class="dialog-height" v-high-light>-->
          <!--<code class="json" spellcheck="false">{{urlData}}</code>-->
        <!--</pre>-->
  </el-dialog>
</template>

<script>
import request from '@/app/web/framework/network/request';
import * as constants from '@/app/web/framework/constants';
import tabs from '@/app/web/component/tabs';
export default {
  props: ['dialogVisible', 'urlData'],
  components: {
    tabs,
  },
  data() {
    return {
      dialogShow: false,
      form: {},
      parameterList: [],
      responseList: [],
      urlJSON: '',
      urlObject: {},
      tabs: [
        {
          label: 'Model',
          name: 'model',
        },
        {
          label: 'Example Value',
          name: 'example-value',
        }
      ],
      isModelTabActive: true,
    };
  },
  computed: {
    httpMethodColor() {
      if (constants.swaggerDefineHttpColor && typeof this.urlData.type === 'string') {
        return constants.swaggerDefineHttpColor.find(item => item.code === this.urlData.type);
      }
      return '';
    },
    activeTabStyle() {
      if (constants.swaggerDefineHttpColor && typeof this.urlData.type === 'string') {
        return {
          color: constants.swaggerDefineHttpColor.find(item => item.code === this.urlData.type).color,
        };
      }
      return {
        color: '',
      };
    },
    tabScrollStyle() {
      if (constants.swaggerDefineHttpColor && typeof this.urlObject.type === 'string') {
        return {
          background: constants.swaggerDefineHttpColor.find(item => item.code === this.urlObject.type).lightColor,
        };
      }
      return {
        background: '',
      }
    }
  },
  created() {
    this.dialogShow = this.dialogVisible;
    this.urlJSON = JSON.stringify(this.urlData, null, 2);
    this.urlObject = JSON.parse(this.urlJSON);
    this.parameterList = this.urlObject.parameters;
    Object.keys(this.urlObject.responses).forEach(key => {
      const res = this.urlObject.responses[key];
      res.code = key;
      this.responseList.push(res);
    });
  },
  methods: {
    getColorBoolean(color) {

    },
    tabClick(tab) {
      console.log(tab);
      if (tab.name === 'example-value') {
        request.get('/mock/api/url/response/by/params', { _id: this.urlObject._id })
          .then((res) => {
            console.log(res);
          });
      }
    },
    execute() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request.post(this.urlObject.url, this.form)
            .then(() => {
              this.$message({
                message: '执行成功',
                showClose: true,
                type: 'success',
              });
            });
        }
      });
    },
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
    background: #EFF7FF;
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
  .tabs {
    background: #E8F6F0;
  }
  .tab {
    border-radius: 4px;
  }
  .left {
    line-height: 28px;
  }
  .right {
    text-align: right;
  }
</style>
<style>
  #url-detail-response-tabs .el-tabs__header is-top{
    background: #E8F6F0;
  }
</style>