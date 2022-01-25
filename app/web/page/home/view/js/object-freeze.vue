<template>
  <div>
    <h3>object.freeze</h3>
    <div class="row" v-for="item in list">{{item.name}}</div>
    <h :level="2">h2</h>
    <el-button type="primary" @click="test">测试jwexin</el-button>
    <img src="https://faterp.szlcsc.com/auth/user/page?keywords=&pageSize=30&currentPage=1&authLevel=-1&departmentCode=&userStatus="/>
  </div>
</template>

<script>
var list = [];
for (var i = 0; i < 1; i += 1) {
  var o = {
    name: 'test-data-' + i,
  };
  Object.freeze(o);
  list.push(o);
}
import h from './test';
export default {
  components: {
    h,
  },
  data() {
    return {
      list: list,
    };
  },
  created() {
    // wx.config({
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   appId: 'wx1c134ec968540817', // 必填，公众号的唯一标识
    //   timestamp: "1620453505", // 必填，生成签名的时间戳
    //   nonceStr: '234234', // 必填，生成签名的随机串
    //   signature: 'c8f9d6ac9cc79ee527853f510563fa8116f5797d',// 必填，签名
    //   jsApiList: ['navigateTo', 'postMessage'] // 必填，用的JS接口列表
    // });
  },
  methods: {
    test() {
      // wx.miniProgram.postMessage({ data:{openId: '此为授权获取到的openid' }});
      // wx.miniProgram.navigateTo({ url: '/pages/index/index' })
      // wx.miniProgram.navigateBack();
    },
  },
}
</script>

<style scoped>
  .row {
    width: 500px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
</style>