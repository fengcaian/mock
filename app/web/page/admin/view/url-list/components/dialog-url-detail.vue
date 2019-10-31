<template>
    <el-dialog
        title="url详情"
        :visible.sync="dialogShow"
        width="500px"
        :before-close="close">
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
            urlJSON: '',
        };
    },
    created() {
        this.dialogShow = this.dialogVisible;
        this.urlJSON = JSON.stringify(this.urlData, null, 2);
    },
    methods: {
        close() {
            this.$emit('urlDetailDialogCb');
        },
    },
}
</script>

<style scoped>
.dialog-height{
    max-height: 650px;
}
</style>