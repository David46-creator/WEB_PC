<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.adminId" class="filter-item" filterable placeholder="巡查教师">
        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <!--      <el-input v-model="listQuery.adminId" placeholder="巡查教师" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />-->
      <el-select v-model="listQuery.companyName" class="filter-item" filterable placeholder="巡查企业名称">
        <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <!--      <el-input v-model="listQuery.companyName" placeholder="企业名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />-->
      <!--      <el-date-picker v-model="listQuery.releaseTime" placeholder="巡查时间" type="date" class="filter-item" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @keyup.enter.native="handleFilter" />-->
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <!--      <el-button style="margin-left: 10px;" class="filter-item" icon="el-icon-edit" @click="handleCreate">-->
      <!--        添加-->
      <!--      </el-button>-->
      <!--      <el-upload class="filter-item" style="margin-left: 10px;margin-right: 10px" action="https://jsonplaceholder.typicode.com/posts/" :on-change="onChange" :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx">-->
      <!--        <el-button type="warning" icon="el-icon-folder-add">导入</el-button>-->
      <!--      </el-upload>-->
      <el-button v-waves class="filter-item" icon="el-icon-download" type="primary" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="巡查教师">
        <template slot-scope="{row}">
          <span>{{ getTeacherName(row.adminId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="巡查学生">
        <template slot-scope="{row}">
          <span>{{ getStudentName(row.studentId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司名称">
        <template slot-scope="{row}">
          <span>{{ row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="dateFormat" align="center" label="巡查时间" prop="patrolTime" width="200">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :show-tooltip-when-overflow="true" align="center" label="巡查记录">
        <template slot-scope="{row}">
          <span>{{ row.record }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
        <template slot-scope="{row,$index}">
          <el-tooltip content="查看" effect="dark" placement="top">
            <el-button circle icon="el-icon-zoom-in" type="primary" @click="handleSelect(row)"/>
          </el-tooltip>
          <el-tooltip content="查看巡查记录" effect="dark" placement="top">
            <el-button circle icon="el-icon-document-remove" type="warning" @click="toPatrolNormalPage(row.adminId)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getList"
    />
    <!-- 查看窗口区域-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogSelectFormVisible" title="查看">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="巡查教师：">
          <span>{{ getTeacherName(temp.adminId) }}</span>
        </el-form-item>
        <el-form-item label="巡查学生：">
          <span>{{ getStudentName(temp.studentId) }}</span>
        </el-form-item>
        <el-form-item label="公司名称：">
          <span>{{ temp.companyName }}</span>
        </el-form-item>
        <el-form-item label="巡查时间：">
          <span>{{ temp.patrolTime | formatTimer }}</span>
        </el-form-item>
        <el-form-item label="巡查记录：">
          <span>{{ temp.record }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <BackToTop/>
  </div>
</template>

<script>
import { fetchpatrolAdminList } from '@/api/patrolAdmin'
import { fetchEnterpriseList } from '@/api/enterprise'
import { fetchTeachersList } from '@/api/teacher'
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    // 时间过滤器
    formatTimer: function(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      // return value === '' ? y + "-" + MM + "-" + d + " " + h + ":" + m : '无';
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m
    }
  },
  data() {
    return {
      id: '',
      number: undefined,
      tableKey: 0,
      list: null,
      teacherList: '',
      studentList: '',
      enterpriseList: '',
      total: 0,
      listLoading: false,
      dialogSelectFormVisible: false,
      // 存储系列表数据
      listQuery: {
        page: 1,
        limit: 50,
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
        studentId: '',
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
        studentId: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
        companyName: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
        patrolTime: [{ required: true, message: '请填写巡查时间', trigger: 'blur' }],
        record: [{ required: true, message: '请填写巡查记录', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getEnterpriseList()
    this.getTeacherList()
    this.getStudentList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchpatrolAdminList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    getEnterpriseList() {
      fetchEnterpriseList(this.listQuery).then(response => {
        // console.log(response)
        this.enterpriseList = response.data.records
        this.total = response.data.total
      })
    },
    getTeacherList() {
      fetchTeachersList(this.listQuery).then(response => {
        // console.log(response)
        this.teacherList = response.data.records
      })
    },
    getStudentList() {
      fetchStudentList().then(response => {
        // console.log(response)
        this.studentList = response.data.records
      })
    },
    // 点击跳转到该教师下所有巡查记录页
    toPatrolNormalPage(id) {
      this.$router.push(`/patrolNormal/patrolNormal/${id}`)
    },
    // 通过id查询教师数据
    getTeacherName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.teacherList.length; i < len; i++) {
        let item = this.teacherList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询学生数据
    getStudentName(id) {
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
    // 查看函数
    handleSelect(row) {
      this.dialogSelectFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      this.dialogSelectFormVisible = true
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        id: undefined,
        adminId: '',
        studentId: '',
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
          createPatrolAdmin(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '您已成功创建！',
              type: 'success',
              duration: 2000
            })
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
          updatePatrolAdmin(tempData).then(() => {
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
          })
        }
      })
    },
    // 删除函数
    handleDelete(row, index) {
      deletePatrolAdmin(row).then(response => {
        console.log(response)
        this.$notify({
          title: '提示',
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        this.list.splice(index, 1)
      })
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
    // ----------以下为导入Excel数据功能--------------
    // 文件选择回调
    onChange(file, fileList) {
      console.log(fileList)
      this.fileData = file // 保存当前选择文件
      this.readExcel() // 调用读取数据的方法
    },
    // 读取数据
    readExcel(e) {
      // console.log(e)
      const that = this
      const files = that.fileData
      // console.log(files)
      if (!files) {
        // 如果没有文件
        return false
      } else if (!/.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          // console.log(data)
          const workbook = this.XLSX.read(data, {
            type: 'binary'
          })
          // console.log(workbook.SheetNames)
          if (workbook.SheetNames.length >= 1) {
            this.$message({
              message: '导入数据表格成功',
              showClose: true,
              type: 'success'
            })
          }
          const wsname = workbook.SheetNames[0] // 取第一张表
          const ws = this.XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
          // console.log(ws)
          that.outputs = [] // 清空接收数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = {
              // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
              id: ws[i]['id'],
              adminId: ws[i]['巡查人'],
              studentId: ws[i]['巡查学生'],
              companyName: ws[i]['公司名称'],
              patrolTime: ws[i]['巡查时间'],
              record: ws[i]['巡查记录']
            }
            that.list.unshift(sheetData)
          }
          this.$refs.upload.value = ''
        } catch (e) {
          return false
        }
      }
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(files.raw)
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
      let date = row[column.property]
      if (date == undefined) {
        return ''
      }

      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style>
.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
}

/*设置显示隐藏部分内容，按50%显示*/
</style>
