<template>
  <div>
    <div class="wrap">
      <el-upload
          class="upload"
          drag
          multiple
          action="/model/image/analyse"
          accept=".jpg,.jpeg"
          :with-credentials="true"
          :headers="headers"
          :data="{sss: 456}"
          :on-success="onSuccess"
          :on-error="onError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg,jpeg格式图片文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initStatus: true,
      headers: {},
    };
  },
  created() {
    const cookieObj = {};
    if (document.cookie) {
      const list = document.cookie.split(';');
      for (let c of list) {
        const l = c.split('=');
        cookieObj[l[0]] = l[1];
      }
    }
    this.headers['x-csrf-token'] = cookieObj['csrfToken'];
  },
  methods: {
    onSuccess(data) {
      let list = [];
      if (data.result) {
        console.log(data);
      }
      this.initStatus = false;
    },
    onError() {},
  },
}
</script>

<style scoped>
  .wrap {
    display: flex;
    justify-content: center;
  }
  .upload {
    margin: 200px;
  }
  .icon{
    font-size: 20px;
  }
</style>