<template>
    <el-dialog
        title="url详情"
        :visible.sync="dialogShow"
        width="500px"
        :before-close="close">
        <span>{{urlJSON}}</span>
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
        this.urlJSON = JSON.stringify(this.urlData);
    },
    methods: {
        close() {
            this.$emit('urlDetailDialogCb');
        },
    },
}
</script>

<style scoped>

</style>