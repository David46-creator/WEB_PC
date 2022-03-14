<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.studentId" class="filter-item" clearable placeholder="学生姓名" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.categoryId" class="filter-item" clearable placeholder="岗位" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker v-model.trim="listQuery.officeTime" class="filter-item" format="yyyy-MM-dd" placeholder="就职时间"
                      type="date" value-format="yyyy-MM-dd" @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves class="filter-item" icon="el-icon-download" type="primary" @click="handleDownload">
        导出
      </el-button>
    </div>
    <!-- 表格内容区域 -->
    <el-table :key="tableKey" :data="list" align="center" border fit highlight-current-row style="width: 100%;">
      <!-- 内容区域 -->
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="学生姓名">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位">
        <template slot-scope="{row}">
          <span>{{ row.categoryId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司">
        <template slot-scope="{row}">
          <span>{{ row.companyId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="就职时间">
        <template slot-scope="{row}">
          <span><i class="el-icon-time"/> {{ row.officeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="岗位对口状态">
        <template slot-scope="{row}">
          <el-tag :type="row.counterpart === '待分配'?'warning':row.counterpart === '对口'?'success':'不对口'">
            {{ row.counterpart | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label=" 操作" width="230">
        <template slot-scope="{row,$index}">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click="handleUpdate(row)"/>
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-popconfirm style="margin-left:7px" title="这是一段内容确定删除吗？" @confirm="handleDelete(row,$index)">
              <el-button v-if="row.status!='deleted'" slot="reference" circle icon="el-icon-delete" title="删除"
                         type="danger"
              />
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total>0" :limit.sync="listQuery.limit" :page.sync="listQuery.page" :total="total"
                @pagination="getList"
    />
    <!-- 编辑和添加dialog -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="120px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="学生姓名：" prop="studentId">
          <el-input v-model="temp.studentId" clearable placeholder="学生姓名"/>
        </el-form-item>
        <el-form-item label="岗位：" prop="categoryId">
          <el-input v-model="temp.categoryId" clearable placeholder="岗位"/>
        </el-form-item>
        <el-form-item label="公司：" prop="companyId">
          <el-input v-model="temp.companyId" clearable placeholder="公司"/>
        </el-form-item>
        <el-form-item label="就职时间：" prop="officeTime">
          <el-date-picker v-model="temp.officeTime" format="yyyy-MM-dd" placeholder="就职时间" type="date"
                          value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="岗位对口状态：" prop="counterpart">
          <el-select v-model="temp.counterpart" class="filter-item" placeholder="岗位对口状态">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
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
    <BackToTop/>
  </div>
</template>

<script>
import { fetchList, createInduction, updateInduction, deleteInduction } from '@/api/induction'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination' // 基于el分页的二次封装

const calendarTypeOptions = [
  { key: '待分配', display_name: '待分配' },
  { key: '对口', display_name: '对口' },
  { key: '不对口', display_name: '不对口' }
]

// 根据key值显示对应的实习状态
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Induction',
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
      size: '',
      dialog: false,
      loading: false,
      // 存储系列表数据
      listQuery: {
        page: 1,
        limit: 50,
        studentId: '', // 学生id
        categoryId: '', // 岗位id
        companyId: '', // 公司id
        officeTime: '', // 就职时间
        counterpart: '' // 岗位是否对口
      },
      statusOptions: ['待分配', '对口', '不对口'],
      calendarTypeOptions,
      temp: {
        id: '',
        studentId: '', // 学生id
        categoryId: '', // 岗位id
        companyId: '', // 公司id
        officeTime: '', // 就职时间
        counterpart: '' // 岗位是否对口 -1=还没操作，0=不对口，1=对口
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 表单验证规则
      rules: {
        studentId: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }], // 学生id
        categoryId: [{ required: true, message: '请填写岗位名称', trigger: 'blur' }], // 岗位id
        companyId: [{ required: true, message: '请填写公司名称', trigger: 'blur' }], // 公司id
        officeTime: [{ required: true, message: '请填写就职时间', trigger: 'blur' }], // 就职时间
        counterpart: [{ required: true, message: '请填写岗位对口状态', trigger: 'blur' }] // 岗位是否对口
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
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
        id: undefined,
        studentId: '', // 学生id
        categoryId: '', // 岗位id
        companyId: '', // 公司id
        officeTime: '', // 就职时间
        counterpart: '' // 岗位是否对口 -1=还没操作，0=不对口，1=对口
      }
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
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createInduction(this.temp).then(() => {
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
          updateInduction(tempData).then(() => {
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
      deleteInduction(row).then(response => {
        // console.log(response)
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
        const tHeader = ['学生', '岗位', '公司', '就职时间', '岗位对口状态']
        const filterVal = ['studentId', 'categoryId', 'companyId', 'officeTime', 'counterpart']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '就职表'
        })
      })
    },
    // ----------以下为导入Excel数据功能--------------
    // 文件选择回调
    onChange(file, fileList) {
      // console.log(fileList)
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
              // studentId: '', //学生id
              // categoryId: '', //岗位id
              // companyId: '', //公司id
              // officeTime: '', //就职时间
              // counterpart: '' //岗位是否对口 -1=还没操作，0=不对口，1=对口
              id: ws[i]['id'],
              studentId: ws[i]['学生'],
              categoryId: ws[i]['岗位'],
              companyId: ws[i]['公司'],
              officeTime: ws[i]['就职时间'],
              counterpart: ws[i]['岗位对口状态']
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
