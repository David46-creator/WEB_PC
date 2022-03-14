<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="反馈人" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">
        添加
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

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%;"
    >
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="反馈人" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈内容" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈图片" width="350px">
        <template slot-scope="{row}">
          <el-image :src="row.feedbackPictureUrl" alt="反馈图片" fit="cover" lazy/>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
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
    <pagination v-show="total>0" :limit.sync="listQuery.limit" :page.sync="listQuery.page" :total="total"
                @pagination="getList"
    />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="反馈人" prop="name">
          <el-input v-model.number="temp.name" clearable/>
        </el-form-item>
        <el-form-item label="反馈内容" prop="content">
          <el-input v-model="temp.content" clearable/>
        </el-form-item>
        <el-form-item label="反馈图片" prop="feedbackPictureUrl">
          <el-upload :on-preview="handlePictureCardPreview" :on-remove="handleUploadRemove" :on-success="handleUploadSuccess"
                     action="" list-type="picture-card"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img :src="dialogImageUrl" width="100%">
          </el-dialog>
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
import { fetchList, createFeedbacks, updateFeedbacks, deleteFeedbacks } from '@/api/feedbacks'
import waves from '@/directive/waves' // 波浪指令
import BackToTop from '@/components/BackToTop' // 返回顶部
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  name: 'Feedbacks',
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
      listLoading: false,
      // 存储系列表数据
      listQuery: {
        page: 1,
        limit: 50,
        name: '', // 反馈人,
        content: '', // 反馈内容
        feedbackPictureUrl: undefined // 反馈图片url
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        id: '',
        name: '', // 反馈人,
        content: '', // 反馈内容
        feedbackPictureUrl: undefined // 反馈图片url
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
        name: [{ required: true, message: '请填写反馈人', trigger: 'blur' }], // 反馈人,
        content: [{ required: true, message: '请填写反馈内容', trigger: 'blur' }], // 反馈内容
        feedbackPictureUrl: [{ required: true, message: '请填写反馈图片', trigger: 'blur' }] // 反馈图片url
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchList(this.listQuery).then(response => {
        // console.log(response)
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
        name: '', // 反馈人,
        content: '', // 反馈内容
        feedbackPictureUrl: '' // 反馈图片url
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createFeedbacks(this.temp).then(() => {
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
          updateFeedbacks(tempData).then(() => {
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
      deleteFeedbacks(row).then(response => {
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
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['反馈人', '反馈内容', '反馈图片']
        const filterVal = ['name', 'content', 'feedbackPictureUrl']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '反馈表'
        })
        this.downloadLoading = false
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
      // this.downloadLoading = true
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
              post: ws[i]['岗位名称'],
              homeMajor: ws[i]['所属专业'],
              remarks: ws[i]['备注']
            }
            that.list.unshift(sheetData)
          }
          this.$refs.upload.value = ''
          // this.downloadLoading = false
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
    handleUploadRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response)
    }
  }
}
</script>
