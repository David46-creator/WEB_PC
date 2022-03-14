<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        class="filter-item"
        clearable
        placeholder="专业名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.deptId" class="filter-item" clearable placeholder="所属院系" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate()">
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        icon="el-icon-download"
        type="primary"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column :index="indexMethod" align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="专业名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属院系">
        <template slot-scope="{row}">
          <span>{{ getCategoryName(row.deptId) }}</span>
          <!--          <span class="link-type">{{ row.deptId }}</span>-->
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
    <!--    分页组件-->
    <pagination
      v-show="total>0"
      :limit.sync="listQuery.size"
      :page.sync="listQuery.current"
      :total="total"
      @pagination="getList"
    />
    <!--    添加和编辑窗口-->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="100px"
        status-icon
        style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="专业名称" prop="name">
          <el-input v-model="temp.name" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="所属院系" prop="deptId">
          <el-select v-model="temp.deptId" filterable placeholder="请选择">
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <BackToTop/>
  </div>
</template>

<script>
import { fetchMajorList, createMajor, updateMajor, deleteMajor } from '@/api/major'
import { fetchDeptList } from '@/api/department'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
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
  name: 'Major',
  components: { Pagination, BackToTop },
  directives: { waves },
  computed: {
    computedSiteType() {
      return function(siteType) {
        return this.deptList[siteType]['name']
      }
    }
  },
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
      // 已选中的id值
      selectedDeptId: '',
      // 下拉框的数据列表
      deptList: {},
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        name: '',
        deptId: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        id: '',
        name: '',
        deptId: ''
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
        name: [{ required: true, message: '请填写专业名称', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择所属院系', trigger: 'blur' }]
      },
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getDeptList()
  },
  methods: {
    // 接口函数获取专业列表数据
    getList() {
      fetchMajorList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
        // console.log(this.list)
      })
    },
    // 获取院系数据
    getDeptList() {
      fetchDeptList(this.listQuery).then(response => {
        // console.log(response)
        this.deptList = response.data.records
      })
    },
    // 通过id查询数据
    getCategoryName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.deptList.length; i < len; i++) {
        let item = this.deptList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        name: '',
        deptId: ''
      }
    },
    // 规定序号排序方式
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
          createMajor(this.temp).then(() => {
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
          updateMajor(tempData).then(() => {
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
        // 只有点击了确定 才能进入到下方
        await deleteMajor(id) // 调用删除接口
        this.getList() // 重新加载数据
        this.$message.success('删除成功！')
      } catch (error) {
        this.$message.error('已取消删除！')
      }
    },
    // 导出函数
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['专业名称', '所属院系']
        const filterVal = ['name', 'homeDept']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '专业表'
        })
        this.downloadLoading = false
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
    }
    // 下载导入模板函数
    // handleTemplate() {
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['专业编号', '专业名称', '所属院系', '备注', '请不要对左边数据做任何修改（数据添加完成请删除本列）']
    //     const filterVal = ['', '', '', '']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '专业管理导入模板'
    //     })
    //   })
    // },
    // ----------以下为导入Excel数据功能--------------
    // 文件选择回调
    // onChange(file, fileList) {
    //   console.log(fileList)
    //   this.fileData = file // 保存当前选择文件
    //   this.readExcel() // 调用读取数据的方法
    // },
    // // 读取数据
    // readExcel(e) {
    //   // this.downloadLoading = true
    //   // console.log(e)
    //   const that = this
    //   const files = that.fileData
    //   // console.log(files)
    //   if (!files) {
    //     // 如果没有文件
    //     return false
    //   } else if (!/.(xls|xlsx)$/.test(files.name.toLowerCase())) {
    //     this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
    //     return false
    //   }
    //   const fileReader = new FileReader()
    //   fileReader.onload = ev => {
    //     try {
    //       const data = ev.target.result
    //       // console.log(data)
    //       const workbook = this.XLSX.read(data, {
    //         type: 'binary'
    //       })
    //       // console.log(workbook.SheetNames)
    //       if (workbook.SheetNames.length >= 1) {
    //         this.$message({
    //           message: '导入数据表格成功',
    //           showClose: true,
    //           type: 'success'
    //         })
    //       }
    //       const wsname = workbook.SheetNames[0] // 取第一张表
    //       const ws = this.XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
    //       // console.log(ws)
    //       that.outputs = [] // 清空接收数据
    //       for (var i = 0; i < ws.length; i++) {
    //         var sheetData = {
    //           // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
    //           id: ws[i]['id'],
    //           number: ws[i]['专业编号'],
    //           majorName: ws[i]['专业名称'],
    //           homeDept: ws[i]['所属院系'],
    //           remarks: ws[i]['备注']
    //         }
    //         that.list.unshift(sheetData)
    //       }
    //       this.$refs.upload.value = ''
    //       // this.downloadLoading = false
    //     } catch (e) {
    //       return false
    //     }
    //   }
    //   // 如果为原生 input 则应是 files[0]
    //   fileReader.readAsBinaryString(files.raw)
    // },
  }
}
</script>
