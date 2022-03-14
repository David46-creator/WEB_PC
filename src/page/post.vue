<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="岗位名称" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.majorId" class="filter-item" clearable placeholder="所属专业" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" icon="el-icon-download" type="primary"
                 @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%;"
    >
      <el-table-column :index="indexMethod" align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="岗位名称">
        <template slot-scope="{row}">
          <span class="link-type" @click="toPostManagerByStudent(row.id)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属专业">
        <template slot-scope="{row}">
          <span>{{ getCategoryName(row.majorId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位就业学生人数">
        <template slot-scope="{row}">
          <span>{{ getCategoryStudentsName(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
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
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getList"
    />
    <!--    添加和编辑弹出框-->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorId">
          <el-select v-model="temp.majorId" filterable placeholder="请选择">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="temp.remarks" :rows="3" autocomplete clearable maxlength="150" placeholder="请输入内容"
                    show-word-limit style="padding:0 80px 13px 0" type="textarea" 请输入内容
          />
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
import { fetchPostStudentChosenList, fetchPostList, createPost, updatePost, deletePost } from '@/api/post'
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

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Post',
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
      post: '',
      tableKey: 0,
      list: null,
      total: 0,
      // 存储选择该岗位的学生人数
      categoryStudentsList: '',
      // 存储岗位所属专业
      majorList: '',
      listLoading: false,
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        name: '',
        majorId: '',
        remarks: ''
        // sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        name: '',
        majorId: '',
        remarks: ''
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
        name: [{ required: true, message: '请填写岗位名称', trigger: 'blur' }],
        majorId: [{ required: true, message: '请填写所属专业', trigger: 'blur' }],
        remarks: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      },
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getMajorList()
    this.getChosenCategoryList()
  },
  methods: {
    // 调用接口获取岗位列表
    getList() {
      fetchPostList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 调用接口获取岗位所属专业列表
    getMajorList() {
      fetchMajorList(this.listQuery).then(response => {
        // console.log(response)
        this.majorList = response.data.records
      })
    },
    // 调用接口获取选择该岗位学生列表
    getChosenCategoryList() {
      fetchPostStudentChosenList().then(response => {
        console.log(response)
        this.categoryStudentsList = response.data
      })
    },
    // 点击岗位名称跳转到选择该岗位的所有学生页面
    toPostManagerByStudent(id) {
      this.$router.push(`/managerStudentByPost/managerStudentByPost/${id}`)
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
        majorId: '',
        remarks: ''
      }
    },
    // 通过id查询岗位所属专业数据
    getCategoryName(id) {
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
    // 通过id查询岗位数据
    getCategoryStudentsName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.categoryStudentsList.length; i < len; i++) {
        let item = this.categoryStudentsList[i]
        if (item.jobCategoryId == id) {
          return item.selectNumber
        }
      }
      return null
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
          createPost(this.temp).then((response) => {
            this.list.shift(this.temp)
            this.dialogFormVisible = false
            if (response.status === 200) {
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
          updatePost(tempData).then((response) => {
            if (response.status === 200) {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              // 提示框
              this.$notify({
                title: '提示',
                message: '您已成功编辑！',
                type: 'info',
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
        await deletePost(id).then(response => {
          // 调用删除接口
          if (response.status === 200) {
            this.$message.success('删除成功')
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
        const tHeader = ['岗位名称', '所属专业', '备注']
        const filterVal = ['name', 'majorId', 'remarks']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '岗位表'
        })
      })
    },
    handleScroll(e) {
      let scrollNum = this.$refs.scrollBox
      // deltaY属性在向下滚动时返回正值，向上滚动时返回负值，否则为0
      scrollNum.scrollLeft = scrollNum.scrollLeft + e.deltaY
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
