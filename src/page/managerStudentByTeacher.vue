<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 头部区域 -->
      <el-input v-model="listQuery.numberId" class="filter-item" clearable placeholder="学号" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="学生姓名" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.classId" class="filter-item" clearable filterable placeholder="所属班级"
                 @keyup.enter.native="handleFilter"
      >
        <el-option v-for="item in classList" :key="item.key" :label="item.name" :value="item.id"/>
      </el-select>
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
        <el-button icon="el-icon-folder-add" type="warning">导入</el-button>
      </el-upload>
      <el-button v-waves class="filter-item" icon="el-icon-download" type="primary" @click="handleDownload">
        导出
      </el-button>
    </div>
    <!-- 表格内容区域 -->
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;"
              @filter-change="filterChange"
    >
      <!-- 展开行内容 -->
      <el-table-column align="center" type="expand" width="55">
        <template slot-scope="props">
          <el-row>
            <el-form class="demo-table-expand" label-position="center" span="12" style="margin-left:60px">
              <el-col :span="12">
                <div class="grid-content">
                  <el-form-item label="学号：">
                    <span>{{ props.row.numberId }}</span>
                  </el-form-item>
                  <el-form-item label="学生姓名：">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="性别：">
                    <span>{{ props.row.sex === 0 ? '男' : '女' }}</span>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <span>{{ props.row.state === 0 ? '未实习' : '已实习' }}</span>
                  </el-form-item>
                  <el-form-item label="所属班级：">
                    <span>{{ getClassName(props.row.classId) }}</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <el-form-item label="联系方式：">
                    <span>{{ props.row.phone }}</span>
                  </el-form-item>
                  <el-form-item label="监护人联系方式：">
                    <span>{{ props.row.parentPhone }}</span>
                  </el-form-item>
                  <el-form-item label="身份证号：">
                    <span>{{ props.row.idCard }}</span>
                  </el-form-item>
                  <el-form-item label="住址：">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                </div>
              </el-col>
            </el-form>
          </el-row>
        </template>
      </el-table-column>
      <!-- 内容区域 -->
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="学号">
        <template slot-scope="{row}">
          <span>{{ row.numberId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学生姓名">
        <template slot-scope="{row}">
          <el-popover placement="top" trigger="hover">
            <h3>基本信息</h3>
            <p>指导老师：{{ getTeacherName(row.adminId) }}</p>
            <p>手机号码：<span>{{ row.phone }}</span></p>
            <p>身份证号：<span>{{ row.idCard }}</span></p>
            <p>住址：<span>{{ row.address }}</span></p>
            <div slot="reference" class="name-wrapper">
              <span class="link-type">{{ row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属班级">
        <template slot-scope="{row}">
          <span>{{ getClassName(row.classId) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="指导老师" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ getTeacherName(row.adminId) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column :filter-method="filterTag" :filters="[{text: '未实习', value: '未实习'},{text: '已实习', value: '已实习'}]" class-name="status-col"
                       label="状态" prop="state"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.state === 0 ? 'danger' : 'success'">
            {{ row.state === 0 ? '未实习' : '已实习' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label=" 操作" width="230">
        <template slot-scope="{row,$index}">
          <el-tooltip content="查看实习履历" effect="dark" placement="top">
            <el-button v-if="row.state" circle icon="el-icon-document-copy" type="success"
                       @click="toOfficesRecords(row.id)"
            />
          </el-tooltip>
          <!--          <el-tooltip content="查看周打卡记录" placement="top" effect="dark">-->
          <!--            <el-button type="success" icon="el-icon-s-claim" @click="toClockRecords(row.id)" circle />-->
          <!--          </el-tooltip>-->
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click="handleUpdate(row)"/>
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button v-if="row.status!='deleted'" circle icon="el-icon-delete" title="删除"
                       type="danger" @click="handleDelete(row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getList"
    />
    <!-- 编辑和添加dialog -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="top" status-icon
               style="width: 550px;margin-left:50px;"
      >
        <el-row :gutter="100">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="学号：" prop="numberId">
                <el-input v-model="temp.numberId" clearable placeholder="学号"/>
              </el-form-item>
              <el-form-item label="学生姓名：" prop="name">
                <el-input v-model="temp.name" clearable placeholder="学生姓名"/>
              </el-form-item>
              <el-form-item label="性别：" prop="sex">
                <el-select v-model="temp.sex" placeholder="请选择">
                  <el-option :value="0" label="男"></el-option>
                  <el-option :value="1" label="女"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系方式：" prop="phone">
                <el-input v-model="temp.phone" clearable placeholder="联系方式"/>
              </el-form-item>
              <el-form-item label="所属班级：" prop="classId">
                <el-select v-model="temp.classId" class="filter-item" filterable placeholder="所属班级" width="100">
                  <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <!--              <el-form-item label="状态：" prop="state">-->
              <!--                <el-select v-model="temp.state" class="filter-item" placeholder="请选择">-->
              <!--                  <el-option :value="0" label="未实习"></el-option>-->
              <!--                  <el-option :value="1" label="已实习"></el-option>-->
              <!--                </el-select>-->
              <!--              </el-form-item>-->
              <!--              <el-form-item label="监护人联系方式:" prop="parentPhone">-->
              <!--                <el-input v-model="temp.parentPhone" placeholder="监护人联系方式" clearable />-->
              <!--              </el-form-item>-->
              <el-form-item label="指导老师:" label-width="500px" prop="adminId">
                <el-select v-model="temp.adminId" class="filter-item" filterable placeholder="请选择">
                  <el-option v-for="item in teachrList" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="身份证号:" label-width="500px" prop="idCard">
                <el-input v-model="temp.idCard" clearable placeholder="请输入内容"/>
              </el-form-item>
              <!--              <el-form-item label="个人住址:" prop="address">-->
              <!--                <el-input v-model="temp.address" type="textarea" autosize placeholder="住址" clearable />-->
              <!--              </el-form-item>-->
            </div>
          </el-col>
        </el-row>
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
import { fetchAdminManagerList } from '@/api/adminManger'
import { fetchStudentList, createStudent, updateStudent, deleteStudent } from '@/api/student'
import { fetchTeachersList } from '@/api/teacher'
// import { fetchOfficesList } from '@/api/offices'
import { fetchClassList } from '@/api/cls'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination' // 基于el分页的二次封装

const calendarTypeOptions = [
  { key: '未实习', display_name: '未实习' },
  { key: '实习中', display_name: '实习中' },
  { key: '已实习', display_name: '已实习' }
]

export default {
  name: 'Student',
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
    }
  },
  data() {
    return {
      id: '',
      tableKey: 0,
      list: null,
      // officesList: null,
      teachrList: '',
      total: 0,
      size: '',
      listLoading: false,
      dialog: false,
      loading: false,
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        numberId: '', // 学号
        name: '', // 姓名
        idCard: '', // 身份证信息
        state: undefined, // 学生状态
        parentPhone: '', // 监护人电话
        address: '', //地址
        classId: '', // 班级id
        adminId: '' // 教师id
      },
      // 存储班级列表数据
      classList: '',
      statusOptions: {
        notready: '未实习',
        ready: '已实习'
      },
      sexOptions: ['男', '女'],
      calendarTypeOptions,
      temp:
        {
          // id: '',
          numberId: '', // 学号
          name: '', // 姓名
          idCard: '', // 身份证号
          sex: '', // 性别
          // parentPhone: '', // 监护人电话
          phone: '', // 学生手机号码
          // address: '', // 住址
          // avatarUrl: '', // 头像url
          // state: '', // 学生状态
          classId: '', // 班级id
          adminId: '' // 教师id
        },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 表单验证规则
      rules: {
        numberId: [{ required: true, message: '请填写学号', trigger: 'blur' }], // 学号
        name: [{ required: true, message: '请填写姓名', trigger: 'blur' }], // 姓名
        idCard: [
          { required: true, message: '请填写身份证号', trigger: 'blur' },
          {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请填写正确的格式'
          }
        ], // 身份证号
        sex: [{ required: true, message: '请填写性别', trigger: 'blur' }], // 性别
        parentPhone: [{ required: true, message: '请填写监护人电话', trigger: 'blur' }], // 监护人电话
        phone: [{ required: true, message: '请填写联系方式', trigger: 'blur' }], // 学生联系方式
        address: [{ required: true, message: '请填写住址', trigger: 'blur' }], // 住址
        state: [{ required: true, message: '请填写状态', trigger: 'blur' }], // 学生状态
        classId: [{ required: true, message: '请填写所属班级', trigger: 'blur' }],// 班级id
        adminId: [{ required: true, message: '请填写指导老师', trigger: 'blur' }]
      },
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getClassList()
    this.getTeacherList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchAdminManagerList(this.$route.params.id).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 获取班级数据
    getClassList() {
      fetchClassList(this.listQuery).then(response => {
        this.classList = response.data.records
      })
    },
    // 获取教师数据
    getTeacherList() {
      fetchTeachersList(this.listQuery).then(response => {
        this.teachrList = response.data.records
      })
    },
    // 点击就职记录跳转到就职记录页面
    toOfficesRecords(id) {
      this.$router.push(`/offices/offices/${id}`)
    },
    // // 点击打卡跳转到打卡页面
    // toClockRecords(id){
    //   this.$router.push(`/clock/clock/${id}`)
    // },
    // 通过id查询班级数据
    getClassName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.classList.length; i < len; i++) {
        let item = this.classList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    // 通过id查询指导老师数据
    getTeacherName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.teachrList.length; i < len; i++) {
        let item = this.teachrList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    filterChange(filters) {
      console.log(filters)
    },
    // 状态列用标签搜索
    filterTag(value, row) {
      console.log(value)
      return row.state === value
    },
    // 搜索函数
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        id: undefined,
        numberId: '', // 学号
        name: '', // 姓名
        idCard: '', // 身份证号
        sex: '', // 性别
        parentPhone: '', // 监护人电话
        phone: '', // 学生手机号码
        address: '', // 住址
        avatarUrl: '', // 头像url
        state: '', // 学生状态
        classId: '', // 班级id
        adminId: '' // 指导老师
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
          createStudent(this.temp[0]).then((response) => {
            if (response.status === 200) {
              this.list.shift(this.temp)
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
          updateStudent(tempData).then((response) => {
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
        await deleteStudent(id).then(response => {
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
        const tHeader = ['学号', '学生姓名', '性别', '状态', '所属班级', '联系方式', '监护人联系方式', '身份证号', '住址']
        const filterVal = ['numberId', 'name', 'sex', 'state', 'classId', 'phone', 'parentPhone', 'idCard', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '学生表'
        })
      })
    },
    // 下载导入模板函数
    handleTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学号', '学生姓名', '性别', '状态', '所属班级', '联系方式', '监护人联系方式', '身份证号', '住址', '请不要对行号做任何修改,数据添加完成请删除本列(说明：状态列请按照<未实习>、<实习中>、<已实习>三种状态进行添加)']
        const filterVal = ['', '', '', '']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '学生管理导入模板'
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
              id: ws[i]['id'],
              numberId: ws[i]['学号'],
              name: ws[i]['学生姓名'],
              sex: ws[i]['性别'],
              state: ws[i]['状态'],
              classId: ws[i]['所属班级'],
              phone: ws[i]['联系方式'],
              parentPhone: ws[i]['监护人联系方式'],
              idCard: ws[i]['身份证号'],
              address: ws[i]['住址']
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
