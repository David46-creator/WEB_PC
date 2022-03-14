<template>
  <div class="app-container">
    {{ this.$route.params.id }}
    <div class="filter-container">
    </div>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="就职信息">
        <el-card class="box-card" shadow="hover">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="就职岗位：">
              <h5>{{ getPostName(officesList.categoryId) | emptyValueFilter }}</h5>
            </el-collapse-item>
            <el-collapse-item name="2" title="就职企业：">
              <h5>{{ getEnterpriseName(officesList.companyId) | emptyValueFilter }}</h5>
            </el-collapse-item>
            <el-collapse-item name="3" title="就职时间：">
              <h5>{{ officesList.officeTime  | formatTimer }}</h5>
            </el-collapse-item>
            <el-collapse-item name="4" title="岗位是否对口：">
              <el-button v-if="officesList.counterpart === -1" circle icon="el-icon-minus" style="cursor: default"
                         type="info"
              ></el-button>
              <el-button v-else-if="officesList.counterpart === 0" circle icon="el-icon-check" style="cursor: default"
                         type="success"
              ></el-button>
              <el-button v-else circle icon="el-icon-close" style="cursor: default" type="danger"></el-button>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="调岗记录">
        <el-table :key="tableKey" :data="list" align="center" border fit highlight-current-row style="width: 100%;">
          <el-table-column :index="indexMethod" :label="'序号'" align="center" type="index" width="65">
          </el-table-column>
          <el-table-column align="center" label="调岗企业">
            <template slot-scope="{row}">
              <span>{{ getEnterpriseName(row.companyId) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="调岗职位">
            <template slot-scope="{row}">
              <span>{{ getPostName(row.categoryId) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="调岗原因" prop="officeTime">
            <template slot-scope="{row}">
              <span>{{ row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="面试申请记录">
        <el-timeline reverse>
          <el-timeline-item v-for="(item, index) in interviewList" :key="index"
                            :timestamp="item.interviewTime | formatTimer" placement="top"
          >
            <el-card>
              <p>面试企业：{{ getEnterpriseName(getRecruitsName(item.advertiseId)) }}</p>
              <p>面试岗位：{{ getPostName(getRecruitsEnterpriseName(item.advertiseId)) }}</p>
              <p>面试状态：{{ item.state == 0 ? '准备面试' : item.state == 1 ? '面试通过' : item.state == 2 ? '面试失败' : '待操作' }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
      <el-tab-pane label="打卡记录">
        <div class="filter-container">
          <el-input class="filter-item" clearable placeholder="打卡地址" style="width: 400px;"
                    @keyup.enter.native="handleFilter"
          />
          <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
          <!--          <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
          <!--            导出-->
          <!--          </el-button>-->
        </div>
        <el-table :key="tableKey" :data="clockList" border fit highlight-current-row style="width: 100%;">
          <el-table-column :index="indexMethod" :label="'序号'" align="center" type="index" width="65"></el-table-column>
          <el-table-column align="center" label="打卡地址">
            <template slot-scope="{row}">
              <span>{{ row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="周小结">
            <template slot-scope="{row}">
              <span>{{ row.note }}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter="dateFormat" align="center" label="打卡时间" prop="attendanceTime" sortable>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  fetchOfficesList,
  fetchOfficesHistoryList,
  fetchInterviewsList,
  createOffices,
  updateOffices,
  deleteOffices
} from '@/api/offices'
import { fetchClockList } from '@/api/clock'
import { fetchRecruitsList } from '@/api/recruits'
import { fetchPostList } from '@/api/post'
import { fetchStudentList } from '@/api/student'
import { fetchEnterpriseList } from '@/api/enterprise'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  name: 'Clock',
  components: { Pagination, BackToTop },
  directives: { waves, permission },
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
    // 判空过滤器
    emptyValueFilter(value) {
      return value === null ? '无' : value
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
      tabPosition: 'right',
      number: undefined,
      tableKey: 0,
      reverse: true,
      list: null,
      // 手风琴菜单默认展开第一项
      activeNames: ['1', '2', '3', '4'],
      total: 0,
      // 存储学生数据
      studentList: '',
      // 存储岗位数据
      postList: '',
      // 存储企业数据
      enterpriseList: '',
      // 就职信息数据
      officesList: '',
      // 面试申请记录数据
      interviewList: '',
      // 存储招聘信息数据
      recruitsList: '',
      // 存储打卡信息数据
      clockList: null,
      listLoading: false,
      // 存储系列表数据
      listQuery: {
        // page: 1,
        // limit: 50,
        // studentId: '', // 学生id
        categoryId: '', // 就职岗位
        companyId: '',// 就职公司
        officeTime: '' // 就职时间
      },
      showReviewer: false,
      temp: {
        id: '',
        studentId: '', // 学生id
        note: '', // 周小结
        attendanceTime: '',// 打卡时间
        address: '' // 打卡地址
      },
      dialogSelectFormVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      pvData: [],
      // 规则
      rules: {
        studentId: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
        note: [{ required: true, message: '请填写周小结', trigger: 'blur' }],
        address: [{ required: true, message: '请填写打卡地址', trigger: 'blur' }],
        attendanceTime: [{ required: true, message: '请填写打卡时间', trigger: 'blur' }]// 打卡时间
      }
    }
  },
  created() {
    this.getList()
    this.getOfficesList()
    this.getInterviewList()
    this.getStudentList()
    this.getClockList()
    this.getPostList()
    this.getEnterpriseList()
    this.getRecruitsList()
  },
  methods: {
    // 调用接口获取调岗记录数据
    getList() {
      fetchOfficesHistoryList(this.$route.params.id).then(response => {
        // console.log(response)
        this.list = response.data.records
      })
    },
    // 调用接口获取就职信息数据
    getOfficesList() {
      fetchOfficesList(this.$route.params.id).then(response => {
        // console.log(response)
        this.officesList = response.data
      })
    },
    // 调用接口获取面试信息数据
    getInterviewList() {
      fetchInterviewsList(this.$route.params.id).then(response => {
        // console.log(response)
        this.interviewList = response.data.records
      })
    },
    // 调用接口获取打卡信息数据
    getClockList() {
      fetchClockList(this.$route.params.id).then(response => {
        this.clockList = response.data.records
      })
    },
    // 调用接口获取学生数据
    getStudentList() {
      fetchStudentList(this.listQuery).then(response => {
        // console.log(response)
        this.studentList = response.data.records
      })
    },
    // 调用接口获取企业数据
    getEnterpriseList() {
      fetchEnterpriseList(this.listQuery).then(response => {
        // console.log(response)
        this.enterpriseList = response.data.records
      })
    },
    // 调用接口获取岗位数据
    getPostList() {
      fetchPostList(this.listQuery).then(response => {
        this.postList = response.data.records
      })
    },
    // 调用接口获取招聘信息数据
    getRecruitsList() {
      fetchRecruitsList(this.listQuery).then(response => {
        this.recruitsList = response.data.records
      })
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    // 通过id查询岗位数据
    getPostName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.postList.length; i < len; i++) {
        let item = this.postList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询企业数据
    getEnterpriseName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.enterpriseList.length; i < len; i++) {
        let item = this.enterpriseList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询招聘企业数据
    getRecruitsName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.recruitsList.length; i < len; i++) {
        let item = this.recruitsList[i]
        if (item.id == id) {
          return item.companyId
        }
      }
      return null
    },
    // 通过id查询招聘企业数据
    getRecruitsEnterpriseName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.recruitsList.length; i < len; i++) {
        let item = this.recruitsList[i]
        if (item.id == id) {
          return item.categoryId
        }
      }
      return null
    },
    // 规定序号排序方式
    indexMethod(index) {
      return index * 1 + 1
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        studentId: '', // 学生id
        note: '', // 周小结
        address: '', // 打卡地址
        attendanceTime: ''// 打卡时间
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
          createOffices(this.temp).then((response) => {
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
    // 查看函数
    handleSelect(row) {
      this.dialogSelectFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      this.dialogSelectFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
          updateOffices(tempData).then((response) => {
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
        await deleteOffices(id).then(response => {
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
    // // 导出函数
    // handleDownload() {
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['周小结', '打卡地址','打卡时间']
    //     const filterVal = ['note', 'address', 'attendanceTime']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename:  this.getStudentName(this.$route.params.id) + '的周打卡记录'
    //     })
    //   })
    // },
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
</style>
