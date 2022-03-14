<template>
  <div class="app-container">
    <!--    {{this.$route.params.id}}-->
    <div class="filter-container">
      <el-input class="filter-item" clearable placeholder="打卡地址" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button v-waves class="filter-item" icon="el-icon-download" type="primary" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column :index="indexMethod" :label="'序号'" align="center" type="index" width="65"></el-table-column>
      <el-table-column align="center" label="学生姓名">
        <template slot-scope="{row}">
          <span>{{ getStudentsName(row.studentId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="打卡地址">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="周小结">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="dateFormat" :show-overflow-tooltip="true" align="center" label="打卡时间" prop="attendanceTime"
                       sortable
      >
        <!--        <template slot-scope="{row}">-->
        <!--          <span>{{ row.attendanceTime }}</span>-->
        <!--        </template>-->
      </el-table-column>
      <!--      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="{row,$index}">-->
      <!--          <el-tooltip content="查看" placement="top" effect="dark">-->
      <!--            <el-button type="primary" icon="el-icon-zoom-in" circle @click="handleSelect(row)" />-->
      <!--          </el-tooltip>-->
      <!--&lt;!&ndash;          <el-tooltip content="编辑" placement="top" effect="dark">&ndash;&gt;-->
      <!--&lt;!&ndash;            <el-button type="primary" icon="el-icon-edit" title="编辑" circle @click="handleUpdate(row)" />&ndash;&gt;-->
      <!--&lt;!&ndash;          </el-tooltip>&ndash;&gt;-->
      <!--          <el-tooltip content="删除" placement="right" effect="dark">-->
      <!--            <el-button v-permission="['superAdministrator']" v-if="row.status!='deleted'" @click="handleDelete(row.id)" type="danger" title="删除" icon="el-icon-delete" circle />-->
      <!--          </el-tooltip>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <BackToTop/>
  </div>
</template>

<script>
import { fetchClockList } from '@/api/clock'
import { fetchStudentList } from '@/api/student'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // 波浪指令
import BackToTop from '@/components/BackToTop' // 返回顶部
import moment from 'moment'

export default {
  name: 'Clock',
  components: { BackToTop },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      studentList: {},
      // 存储系列表数据
      listQuery: {
        page: 1,
        limit: 50,
        studentId: '', // 学生id
        note: '', // 周小结
        attendanceTime: '',// 打卡时间
        address: '' // 打卡地址
      }
    }
  },
  created() {
    this.getList()
    this.getStudentsList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchClockList(this.$route.params.id).then(response => {
        // console.log(response)
        this.list = response.data.records
      })
    },
    // 获取学生列表数据
    getStudentsList() {
      fetchStudentList(this.listQuery).then(response => {
        this.studentList = response.data.records
      })
    },
    // 通过id查询学生列表数据
    getStudentsName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.studentList.length; i < len; i++) {
        let item = this.studentList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 规定序号排序方式
    indexMethod(index) {
      return index * 1 + 1
    },
    // 导出函数
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['周小结', '打卡地址', '打卡时间']
        const filterVal = ['note', 'address', 'attendanceTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '周打卡表'
        })
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
