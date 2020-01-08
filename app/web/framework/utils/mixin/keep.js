import _ from 'lodash';

window.keepData = {};

export default {
  beforeCreate() {
    // 还原数据
    const keepKey = this.$route.path + (this.$options.data().keepPath || '');
    if (window.keepData[keepKey]) {
      this.$options.data = window.keepData[keepKey];
    }
  },
  mounted() {
    this.$data.keepKey = this.$route.path + (this.$options.keepPath || '');
  },
  beforeDestroy() {
    if (this.$data.keepKey) {
      window.keepData[this.$data.keepKey] = _.cloneDeep(this.$data);
    }
  },
  methods: {
    delKeepData() {
      delete window.keepData[this.$data.keepKey];
      delete this.$data.keepKey;
    },
  },
}