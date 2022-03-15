<template>
  <div class="app-container">
<!--    {{this.$route.params.id}}-->
    <h2><span class="link-type">{{ getTeacherName(this.$route.params.id) }}</span> 管理的班级</h2>
    <!--筛选与操作区域-->
    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="班级名称" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.majorId" class="filter-item" clearable placeholder="所属专业" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" icon="el-icon-upload" plain type="success" @click="handleTemplate">下载导入模板
      </el-button>
      <el-upload :auto-upload="false" :on-change="onChange"
                 :show-file-list="false" accept=".xls, .xlsx" action="https://jsonplaceholder.typicode.com/posts/"
                 class="filter-item" style="margin-left: 10px;margin-right: 10px"
      >
        <el-button :loading="downloadLoading" icon="el-icon-folder-add" type="warning">导入</el-button>
      </el-upload>
      <el-button v-waves :loading="downloadLoading" class="filter-item" icon="el-icon-download" type="primary"
                 @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <!--    数据内容区域-->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%;"
    >
      <el-table-column :index="indexMethod" align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="班级名称">
        <template slot-scope="{row}">
          <span class="link-type" @click="toStudentMangerByClass(row.id)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属专业">
        <template slot-scope="{row}">
          <span>{{ getMajorName(row.majorId) }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="带教教师">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ getAdminName(row.id) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" label="班级级数">
        <template slot-scope="{row}">
          <span>{{ row.year }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="待业中">
        <template slot-scope="{row}">
          <span>{{ getUnemployedName(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="未实习">
        <template slot-scope="{row}">
          <span>{{ getNoInternshipName(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已实习">
        <template slot-scope="{row}">
          <span>{{ getInternshipName(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
        <template slot-scope="{row,$index}">
          <el-tooltip content="编辑" effect="dark" placement="left">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click="handleUpdate(row)"/>
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="right">
            <el-button v-if="row.status!='deleted'" circle icon="el-icon-delete" title="删除"
                       type="danger" @click="handleDelete(row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页区域-->
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getList"
    />
    <!--    弹窗区域-->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorId">
          <el-select v-model="temp.majorId" filterable placeholder="请选择" @visible-change="getMajorList">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级级数" prop="year">
          <el-input v-model.number="temp.year" clearable placeholder="请输入内容"/>
        </el-form-item>
        <!--        <el-form-item label="班级学制" prop="years">-->
        <!--          <el-input v-model.number="temp.years" placeholder="请输入内容"  clearable />-->
        <!--        </el-form-item>-->
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
    <!--    返回顶部区域-->
    <BackToTop/>
  </div>
</template>

<script>
import { fetchClassByTeacherIdList } from '@/api/teacher'
import {  createClass, updateClass, deleteClass } from '@/api/cls'
import { fetchClassInfoListById, fetchClassInstructorListById } from '@/api/cls'
import { fetchTeachersList } from '@/api/teacher'
import { fetchMajorList } from '@/api/major'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'managerClassByTeacher',
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
    }
  },
  data() {
    return {
      id: '',
      tableKey: 0,
      list: null,
      total: 0,
      // 存储所有专业的列表
      majorList: '',
      // 根据id查询班级具体学生状态
      classInfoList: '',
      teacherList: '',
      allTeacherList: '',
      listLoading: false,
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        name: '',
        year: '',
        // years:'',
        majorId: undefined
      },
      infoQuery: {
        classId: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        name: '',
        year: '',
        // years:'',
        majorId: ''
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
        name: [{ required: true, message: '请填写班级名称', trigger: 'blur' }, {
          min: 5,
          max: 30,
          message: '班级名称的长度在必须在5到30个字符之间',
          trigger: 'blur'
        }],
        majorId: [{ required: true, message: '请填写所属专业', trigger: 'blur' }],
        year: [{ required: true, message: '请填写班级级数', trigger: 'blur' },
          { type: 'number', message: '班级级数不接收中文和英文，请输入数字', trigger: 'blur' }
          // { pattern: '/^(1949|19[5-9]\\d|20\\d{2}|2100)$/', message: '请输入正确的格式', trigger: 'change'}
        ]
        // years: [{ required: true, message: '请填写班级学制', trigger: 'change' },
        //   {type: 'integer', message: '班级学制不接收中文和英文，请输入数字', trigger: 'change'}
        // ],
      },
      // 加载动画
      downloadLoading: false
    }
  },
  computed: {
    // 通过id查询专业名称
    computedType() {
      return function(siteType) {
        return this.majorList[siteType]['name']
      }
    }
  },
  created() {
    this.getList()
    this.getMajorList()
    this.getClassInfoList()
    this.getClassInstructorList()
    this.getTeacherList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchClassByTeacherIdList(this.$route.params.id).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 获取专业数据
    getMajorList() {
      fetchMajorList(this.listQuery).then(response => {
        // console.log(response)
        this.majorList = response.data.records
      })
    },
    // 获取班级学生就业数据
    getClassInfoList() {
      fetchClassInfoListById().then(response => {
        // console.log(response.data.data)
        // console.log(this.classInfoList)
        this.classInfoList = response.data.data
      })
    },
    // 获取班级学生指导老师数据
    getClassInstructorList() {
      fetchClassInstructorListById().then(response => {
        console.log(response)
        this.teacherList = response.data.data
      })
    },
    getTeacherList(){
      fetchTeachersList(this.listQuery).then(response => {
        this.allTeacherList = response.data.records
      })
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        name: '',
        year: '',
        // years: '',
        majorId: ''
      }
    },
    // 通过id查询带教教师数据
    getAdminName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.teacherList.length; i < len; i++) {
        let item = this.teacherList[i]
        if (item.classId == id) {
          return item.adminName
        }
      }
      return null
    },
    // 通过id查询该班级所管理的教师数据
    getTeacherName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.allTeacherList.length; i < len; i++) {
        let item = this.allTeacherList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询专业数据
    getMajorName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.majorList.length; i < len; i++) {
        let item = this.majorList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询实习学生人数
    getInternshipName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.classInfoList.length; i < len; i++) {
        let item = this.classInfoList[i]
        if (item.classId == id) {
          return item.internship
        }
      }
      return null
    },
    // 通过id查询未实习学生人数
    getNoInternshipName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.classInfoList.length; i < len; i++) {
        let item = this.classInfoList[i]
        if (item.classId == id) {
          return item.noInternship
        }
      }
      return null
    },
    // 通过id查询待业学生人数
    getUnemployedName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.classInfoList.length; i < len; i++) {
        let item = this.classInfoList[i]
        if (item.classId == id) {
          return item.unemployed
        }
      }
      return null
    },
    // 点击班级名称跳转到该班级下所拥有的学生
    toStudentMangerByClass(id) {
      this.$router.push(`/managerStudentByClass/managerStudentByClass/${id}`)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 规定序号排序方式
    indexMethod(index) {
      return index * 1 + 1
    },
    // 添加院系触发的确认函数
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createClass(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '您已成功创建！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    // 编辑院系函数
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
          updateClass(tempData).then(() => {
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
          })
        }
      })
    },
    // 删除函数
    async handleDelete(id) {
      try {
        await this.$confirm('确认删除当前数据吗？')
        await deleteClass(id).then(response => {
          this.$message.success('删除成功！')
          this.getList() // 重新加载数据
        })
      } catch (error) {
        this.$message.info('已取消删除！')
      }
    },
    // 导出函数
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['班级名称', '所属专业', '班级级数']
        const filterVal = ['name', 'majorId', 'year']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '班级表'
        })
        this.downloadLoading = false
      })
    },
    // 下载导入模板函数
    handleTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['班级名称', '所属专业', '班级级数', '班级学制', '请不要对左边数据做任何修改（数据添加完成请删除本列）']
        const filterVal = ['', '', '', '', '']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '班级导入模板'
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
      const that = this
      const files = that.fileData
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
              name: ws[i]['班级名称'],
              majorId: ws[i]['所属专业'],
              year: ws[i]['班级级数']
              // years: ws[i]['班级学制'],
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
    }
  }
}
</script>

