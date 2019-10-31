<template>
    <div>
        <div class="search">
            <el-row class="clear">
                <label> 标题:</label><el-input class="search-input" clearable v-model="searchParams.title" placeholder="关键字"></el-input>
                <label> 分类:</label><el-select  v-model="searchParams.categoryId" placeholder="分类">
                <el-option v-for="item in categories"
                           :key="item.id"
                           :label="item.name"
                           :value="item.categoryId">
                </el-option>
            </el-select>
                <label> 状态:</label><el-select  v-model="searchParams.status" placeholder="状态">
                <el-option v-for="item in status"
                           :key="item.id"
                           :label="item.name"
                           :value="item.status">
                </el-option>
            </el-select>
                <el-button class="search-button" type="primary" @click="search">查询</el-button>
                <el-button class="add-button" type="success" @click="write()">写文章</el-button>
            </el-row>
        </div>
        <el-table
            :data="dataList"
            v-loading="loading"
            element-loading-text="拼命加载中"
            border
            @selection-change="batchSelect"
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="hits" label="所属系统"></el-table-column>
            <el-table-column prop="hits" label="所属分组">
                <template slot-scope="scope">
                    <span>{{scope.row.tags[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="url名称">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="lookUrlDetail(scope.row)">查看url详情</el-button>
                    <el-button type="text" size="mini" @click="goToDetail(scope.row)">{{scope.row.summary}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="url"></el-table-column>
            <el-table-column prop="type" label="类型" width="80"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="success" size="small" icon="delete" @click="generateRandomData(scope.row)">生成随机数据</el-button>
                    <router-link :to="{params: {id: scope.row.id}}" tag="span">
                        <el-button type="info" size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="small" icon="delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 16px">
            <div style="float:left">
                <el-button
                        type="danger"
                        icon="delete"
                        size="small"
                        :disabled="batchSelectArray.length === 0"
                        @click="batchDel"
                        slot="handler">
                    <span>批量删除</span>
                </el-button>
            </div>
            <div style="float:right">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchParams.currentPage"
                        :page-sizes="[10, 15, 20, 50]"
                        :page-size="searchParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <dialog-url-detail
            v-if="isShowUrlDetailDialog"
            :dialogVisible="isShowUrlDetailDialog"
            :urlData="row"
            @urlDetailDialogCb="urlDetailDialogCb">
        </dialog-url-detail>
    </div>
</template>
<style>

</style>
<script type="jsx">
import request from '../../../../framework/network/request';
import * as API from '../../../../framework/network/api';

import dialogUrlDetail from './components/dialog-url-detail';
export default {
    components: {
        dialogUrlDetail,
    },
    data() {
        return {
            searchParams: {
                title: undefined,
                categoryId: undefined,
                statusId: undefined,
                currentPage: 1,
                pageSize: 10
            },
            //请求时的loading效果
            loading: false,
            //批量选择数组
            batchSelectArray: [],
            dataList: [],
            total: 0,
            row: {},
            isShowUrlDetailDialog: false,
        };
    },
    computed: {
        status() {
            return [
                { status: undefined, name: "--请选择--" },
                { status: 1, name: "已发布" },
                { status: 2, name: "草稿" }
            ];
        },
        categories() {
            return [
                { categoryId: 0, name: "--请选择--" },
                { categoryId: 1, name: "Nodejs" },
                { categoryId: 2, name: "Webpack" },
                { categoryId: 3, name: "Egg" }
            ];
        },
        articleList() {
            return this.$store.state.articleList;
        }
    },
    created() {
        this.search();
    },
    methods: {
        search() {
            this.searchParams.currentPage = 1;
            this.getList();
        },
        getList() {
            request.get('/mock/api/url/list', this.searchParams)
                .then(({ result }) => {
                    this.dataList = result.dataList;
                    this.total = result.totalRow;
                });
        },
        write() {
            this.$router.push("/article/add");
        },
        handleSelectionChange(val) {
            console.log("handleSelectionChange", val);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.searchParams.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.searchParams.currentPage = val;
            this.getList();
        },
        handleEdit(index, row) {
            this.$message(`你点击了编辑操作 index:${index}, id:${row.id}`);
        },
        handleDelete(index, row) {
            this.$confirm('将删除选择的url, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                request.post('/mock/api/url/delete', { _id: row._id })
                    .then(() => {
                        this.$message({
                            message: '批量删除成功！',
                            type: 'success',
                        });
                        this.getList();
                    });
                this.loading = false;
            });
        },
        //批量选择
        batchSelect(val) {
            this.batchSelectArray = val;
        },
        //批量删除
        batchDel() {
            this.$confirm('将批量删除选择url, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                request.post('/mock/api/url/batch/delete')
                    .then(() => {
                        this.$message({
                            message: '批量删除成功！',
                            type: 'success',
                        });
                        this.getList();
                    });
                this.loading = false;
            });
        },
        generateRandomData(row) {
            console.log(row);
            request.post('/mock/api/url/mock/data', row)
                .then((res) => {
                    console.log(res);
                });
        },
        lookUrlDetail(row) {
            this.row = row;
            this.isShowUrlDetailDialog = true;
        },
        urlDetailDialogCb() {
            this.isShowUrlDetailDialog = false;
        },
        goToDetail(row) {
          console.log(row);
          this.$router.push(`/url/detail?id=${row._id}`);
        },
    },
};
</script>