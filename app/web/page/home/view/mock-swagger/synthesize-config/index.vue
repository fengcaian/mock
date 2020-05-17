<template>
  <div>
    <div v-for="item in dataList" :key="item.key">
      <el-row>
        <el-col :span="12">
          <h4>{{item.name}}</h4>
        </el-col>
        <el-col :span="12">
          <el-button type="success" size="mini" @click="publish">发布</el-button>
        </el-col>
      </el-row>
      <el-table
        stroke
        border
        :data="item.list">
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    publish() {},
    edit() {},
  },
}
</script>

<style scoped>

</style>