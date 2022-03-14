<template>
  <div class="app-container">
    {{ this.$route.params.id }}
    <el-table :data="list" align="center" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column :formatter="dateFormat" align="center" label="操作时间" prop="createTime" sortable>
        <!--      <template slot-scope="{row}">-->
        <!--        <span>{{ row.createTime }}</span>-->
        <!--      </template>-->
      </el-table-column>
      <el-table-column align="center" label="具体操作">
        <el-table-column align="center" label="操作模块">
          <template slot-scope="{row}">
            <span>{{ row.operModul }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作类型">
          <template slot-scope="{row}">
            <span>{{ row.operType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作描述">
          <template slot-scope="{row}">
            <span>{{ row.operDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="请求ip">
          <template slot-scope="{row}">
            <span>{{ row.operIp }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getData"
    />
  </div>
</template>

<script>
import { fetchOperateRecordHistoryList } from '@/api/teacher'
import Pagination from '@/components/Pagination'
import BackToTop from '@/components/BackToTop'
import moment from 'moment'

export default {
  name: 'OperateHistoryByTeacher',
  components: { Pagination, BackToTop },
  data() {
    return {
      total: 0,
      list: null,
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50
      }

    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchOperateRecordHistoryList(this.$route.params.id, this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 表格中格式化时间
    dateFormat(row, column) {
      let date = row[column.property]
      if (date == undefined) {
        return ''
      }

      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>
