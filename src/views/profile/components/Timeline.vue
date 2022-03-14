<template>
  <div>
    <div class="filter-container">
<!--      <el-select v-model="listQuery.adminId" class="filter-item" placeholder="巡查教师" filterable>-->
<!--        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">-->
<!--        </el-option>-->
<!--      </el-select>-->
            <el-input v-model="listQuery.studentId" placeholder="巡查学生" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
<!--      <el-input v-model="listQuery.companyName" placeholder="公司名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />-->
      <!--      <el-date-picker v-model="listQuery.releaseTime" placeholder="巡查时间" type="date" class="filter-item" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @keyup.enter.native="handleFilter" />-->
      <el-button class="filter-item" icon="el-icon-search" type="primary" size="max" circle @click="handleFilter" />
      <el-button style="margin-left: 10px;" class="filter-item" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" label="序号" width="65" align="center" :index="indexMethod" />
      <el-table-column label="巡查学生" align="center">
        <template slot-scope="{row}">
          <span>{{ getStudentName(row.studentId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡查时间" align="center" prop="patrolTime" :formatter="dateFormat" width="200">
      </el-table-column>
      <el-table-column label="巡查记录" :show-overflow-tooltip="true" align="center">
        <template slot-scope="{row}">
          <span>{{ row.record }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-tooltip content="编辑" placement="top" effect="dark">
            <el-button type="primary" icon="el-icon-edit" title="编辑" circle @click="handleUpdate(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <el-button v-if="row.status!='deleted'" @click="handleDelete(row.id)" type="danger" title="删除" icon="el-icon-delete" circle />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" status-icon :model="temp" label-position="left" label-width="100px" style="width: 550px; margin-left:50px;">
        <el-form-item label="巡查学生：" prop="studentIds">
          {{getStudentName(temp.studentId)}}
          <el-select v-if="textMap[dialogStatus] === '添加'" v-model="temp.studentIds" class="filter-item" filterable placeholder="请选择">
            <el-option v-for="item in studentList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-select v-model="temp.companyName" class="filter-item" filterable placeholder="请选择">
            <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
<!--          <el-input v-model.trim="temp.companyName" placeholder="请输入内容" clearable />-->
        </el-form-item>
        <el-form-item label="巡查时间：" prop="patrolTime">
          <el-date-picker
            v-model="temp.patrolTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
<!--          <el-date-picker v-model="temp.patrolTime" placeholder="请输入内容" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" class="filter-item" style="width:250px" @keyup.enter.native="handleFilter" />-->
        </el-form-item>
        <el-form-item label="巡查记录：" prop="record">
          <el-input v-model.trim="temp.record" type="textarea" placeholder="请输入内容" autosize clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <BackToTop />
  </div>
</template>

<script>
import { fetchPatrolNormalList, createPatrolNormal, updatePatrolNormal, deletePatrolNormal } from '@/api/patrolNormal'
import { fetchEnterpriseList } from '@/api/enterprise'
import { fetchStudentList } from '@/api/student'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'
import moment from 'moment' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PatrolAdmin',
  components: { Pagination, BackToTop },
  directives: { waves },
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'info',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   },
  // },
  data() {
    return {
      id: '',
      number: undefined,
      tableKey: 0,
      list: null,
      enterpriseList: '',
      studentList: '',
      total: 0,
      listLoading: false,
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        adminId: undefined,
        companyName: undefined,
        patrolTime: undefined
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        id: '',
        adminId: '',
        studentIds: '',
        // studentIds: JSON.stringify(this.temp.studentIds),
        record: '',
        companyName: '',
        patrolTime: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      pvData: [],
      // 规则
      rules: {
        adminId: [{ required: true, message: '请填写巡查人姓名', trigger: 'blur' }],
        studentIds: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
        companyName: [{ required: true, message: '请填写巡查公司名称', trigger: 'blur' }],
        patrolTime: [{ required: true, message: '请填写巡查时间', trigger: 'blur' }],
        record: [{ required: true, message: '请填写巡查记录', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getEnterprise()
    this.getStudentList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchPatrolNormalList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    getEnterprise(){
      fetchEnterpriseList(this.listQuery).then(response => {
        console.log(response)
        this.enterpriseList = response.data.records
      })
    },
    getStudentList(){
      fetchStudentList().then(response => {
        // console.log(response)
        this.studentList = response.data.records
      })
    },
    // 通过id查询教师数据
    getTeacherName(id) {
      if (!id) {
        return null;
      }
      for (let i = 0, len = this.teacherList.length; i < len; i++) {
        let item = this.teacherList[i];
        if (item.id == id) {
          return item.name;
        }
      }
      return null;
    },
    // 通过id查询学生数据
    getStudentName(id){
      if (!id) {
        return null;
      }
      for (let i = 0, len = this.studentList.length; i < len; i++) {
        let item = this.studentList[i];
        if (item.id == id) {
          return item.name;
        }
      }
      return null;
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        id: '',
        adminId: '',
        studentIds: '',
        record: '',
        companyName: '',
        patrolTime: ''
      }
    },
    indexMethod(index) {
      return index * 1 + 1
    },
    // 添加函数
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加触发的确认函数
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createPatrolNormal(this.temp).then((response) => {
            console.log(response)
            if (response.status === 200) {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '您已成功创建！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    // 编辑函数
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据函数
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatePatrolNormal(tempData).then((response) => {
            if (response.status === 200) {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              // 提示框
              this.$notify({
                title: '提示',
                message: '您已成功编辑！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    // 删除函数
    async handleDelete(id) {
      try {
        await this.$confirm('确认删除当前数据吗？')
        // 只有点击了确定 才能进入到下方
        await deletePatrolNormal(id).then(response => {
          if (response.status === 200) {
            // 调用删除接口
            this.$message.success('删除成功！')
            this.getList() // 重新加载数据
          }
        })
      } catch (error) {
        this.$message.info('已取消删除！')
      }
    },
    // 导出函数
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['巡查人', '巡查学生', '公司名称', '巡查时间', '巡查记录']
        const filterVal = ['adminId', 'studentId', 'companyName', 'patrolTime', 'record']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '巡查表'
        })
      })
    },
    // 格式化json数据
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    // 表格中格式化时间
    dateFormat(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return ''
      }
      ;
      return moment(date).format("yyyy-MM-DD HH:mm:ss")
    }
  }
}
</script>
