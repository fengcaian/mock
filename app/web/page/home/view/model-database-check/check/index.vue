<template>
  <div>
    <div class="wrap">
      <el-upload
          class="upload"
          v-if="initStatus"
          drag
          multiple
          action="/model/file/analyse"
          accept=".xlsx,.xls,.csv"
          :with-credentials="true"
          :headers="headers"
          :data="{sss: 456}"
          :on-success="onSuccess"
          :on-error="onError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx/csv文件，且不超过500kb</div>
      </el-upload>
      <el-table
          v-else
          border
          size="mini"
          :data="dataList"
          :span-method="objectSpanMethod"
          :cell-style="cellStyleMethod">
        <el-table-column label="模型" align="center">
          <el-table-column width="55" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="modelField" label="字段名" align="center"></el-table-column>
          <el-table-column prop="modelType" label="类型" align="center"></el-table-column>
          <el-table-column prop="modelLength" label="长度" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="数据库" align="center">
          <el-table-column prop="databaseField" label="字段名" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.databaseField}}</span>
              <svg-icon v-if="scope.row.databaseField && scope.row.databaseField !== scope.row.modelField" class="icon" icon-class="wrong"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column prop="databaseType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.databaseType}}</span>
              <svg-icon v-if="scope.row.databaseType && scope.row.databaseType !== scope.row.modelType" class="icon" icon-class="wrong"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column prop="databaseLength" label="长度" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.databaseLength}}</span>
              <svg-icon v-if="scope.row.databaseLength && scope.row.databaseLength !== scope.row.modelLength" class="icon" icon-class="wrong"></svg-icon>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <drawer title="核查详情" :size="350">
        <div>this is a drawer</div>
      </drawer>
    </div>
  </div>
</template>

<script>
import drawer from '@/app/web/component/drawer';

export default {
  components: {
    drawer,
  },
  data() {
    return {
      dataList: [{
        modelField: '',
        modelType: '',
        modelLength: '',
        databaseField: '',
        databaseType: '',
        databaseLength: '',
      }],
      databaseData: [
        {
          databaseField: 'name',
          databaseType: 'varchar',
          databaseLength: '100',
        },
        {
          databaseField: 'code',
          databaseType: 'char',
          databaseLength: '10',
        },
        {
          databaseField: 'address',
          databaseType: 'varchar',
          databaseLength: '100',
        },
        {
          databaseField: 'email',
          databaseType: 'varchar',
          databaseLength: '255',
        },
      ],
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onSuccess(data) {
      console.log(data);
      let list = [];
      if (data.result) {
        let temp = Object.create(null);
        let db = Object.create(null);
        let index;
        Object.keys(data.result).forEach((key) => {
          data.result[key].forEach((item) => {
            if (item.length > 2) {
              temp = {
                modelField: item[0],
                modelType: item[1],
                modelLength: item[2],
              };
              db = {
                databaseField: '',
                databaseType: '',
                databaseLength: '',
              };
              index = this.databaseData.findIndex((item) => item.databaseField === temp.modelField);
              if (index !== -1) {
                const d = this.databaseData.splice(index, 1);
                db = d[0];
                if (temp.modelField === db.databaseField && temp.modelType === db.databaseType && temp.modelLength === db.databaseLength) {
                  temp.isEqual = true;
                } else {
                  temp.isEqual = false;
                }
              }
              list.push(Object.assign(temp, db));
            }
          });
        });
        if (this.databaseData.length) {
          this.databaseData.map(item => (Object.assign({ modelField: '', modelType: '', modelLength: '' }, item)));
          list = list.concat(this.databaseData);
        }
      }
      this.dataList = list;
      this.initStatus = false;
    },
    onError() {},
    objectSpanMethod({ columnIndex }) {
      if (this.initStatus) {
        if (columnIndex === 0) {
          return [1, 6];
        }
        return [0, 0];
      }
      return [1, 1];
    },
    cellStyleMethod({ row, column, rowIndex, columnIndex }) {
      let backgroundColor = '';
      if (!row[column.property] && columnIndex) {
        backgroundColor = 'yellow';
      }
      return {
        'background-color': backgroundColor,
      };
    },
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