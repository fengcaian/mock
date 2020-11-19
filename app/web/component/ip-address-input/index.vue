<template>
  <div id="ipAddress" :style="{display: inline ? 'inline-block' : 'block'}">
    <el-input class="width-70" ref="input1" v-model="form.value1" @keyup.enter.native="nextInputFocus(1)" @input.native="input($event, 1)"></el-input>
    <el-divider direction="vertical"></el-divider>
    <el-input class="width-70" ref="input2" v-model="form.value2" @keyup.enter.native="nextInputFocus(2)" @input.native="input($event, 2)"></el-input>
    <el-divider direction="vertical"></el-divider>
    <el-input class="width-70" ref="input3" v-model="form.value3" @keyup.enter.native="nextInputFocus(3)" @input.native="input($event, 3)"></el-input>
    <el-divider direction="vertical"></el-divider>
    <el-input class="width-70" ref="input4" v-model="form.value4" @input.native="input($event, 4)"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: { // ip地址，如：192.168.1.1
      type: String,
      required: true,
      default: '',
    },
    inline: { // 是否是行内元素
      type: Boolean,
      default: false,
    },
    tag: { // 身份标识，识别当前组件身份的属性
      type: String|Number,
      default: '',
    },
  },
  computed: {
    ipAddress() {
      return `${this.form.value1}.${this.form.value2}.${this.form.value3}.${this.form.value4}`;
    },
  },
  watch: {
    ipAddress(val) {
      this.emit(val);
    }
  },
  data() {
    return {
      form: {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
      },
    };
  },
  created() {
    if (this.value) {
      const list = this.value.split('.');
      this.form.value1 = list[0];
      this.form.value2 = list[1];
      this.form.value3 = list[2];
      this.form.value4 = list[3];
    }
  },
  methods: {
    nextInputFocus(col) {
      this.$refs[`input${col + 1}`].focus();
    },
    input(e, col) {
      this.form[`value${col}`] = this.form[`value${col}`].replace('.', '');
      if (e.data === '.' && col !== 4) {
        this.$refs[`input${col + 1}`].focus();
      }
    },
    emit(val) {
      this.$emit('ipAddressInputCb', val, this.tag);
    },
  },
}
</script>

<style scoped>
  .width-70{
    width: 70px;
  }
</style>
<style>
  #ipAddress .el-input__inner{
    text-align: center;
  }
</style>