<template>
  <div class="app-container">
    <!--筛选与操作区域-->
    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="教师名称" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input class="filter-item" clearable placeholder="职工号" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="selectedRoleId" class="filter-item" filterable placeholder="角色名称">
        <el-option v-for="item in rolesList" :key="item.id" :label="item.depict" :value="item.id">
        </el-option>
      </el-select>
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
    <!--    数据内容区域-->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%;"
    >
      <el-table-column :index="indexMethod" align="center" label="序号" type="index" width="65"/>
      <el-table-column align="center" label="教师头像">
        <template slot-scope="{row}">
          <el-image :src="row.avatarUrl" fit="contain" lazy
                    style="width:150px;height:100px;cursor: zoom-in" @click="showpreviewPic(row.avatarUrl)"
          >
            <div slot="error" class="image-slot">
              <el-image :src="defaultImage" fit="contain" lazy style="width:150px;height:100px;cursor: zoom-in"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职工号">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教师名称">
        <template slot-scope="{row}">
          <el-popover placement="top" trigger="hover">
            <h3>基本信息</h3>
            <p>手机号码：<span class="link-type">{{ row.phone }}</span></p>
            <p>身份证号：<span class="link-type">{{ row.idCard }}</span></p>
            <div slot="reference" class="name-wrapper">
              <span class="link-type" @click="toManagerStudent(row.id)">{{ row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教师角色">
        <template slot-scope="{row}">
          <span class="link-type">待修改</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
        <template slot-scope="{row,$index}">
          <el-tooltip content="操作日志" effect="dark" placement="top">
            <el-button circle icon="el-icon-document" title="操作日志" type="warning" @click="toOperateHistory(row.id)"/>
          </el-tooltip>
          <el-tooltip content="查看管理的班级" effect="dark" placement="top">
            <el-button circle icon="el-icon-s-custom" title="查看管理的班级" @click="toManagerClass(row.id)"/>
          </el-tooltip>
          <el-tooltip content="编辑" effect="dark" placement="left">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click="handleUpdate(row)"/>
          </el-tooltip>
          <!--          <el-tooltip content="删除" placement="right" effect="dark">-->
          <!--            <el-button v-if="row.status!='deleted'" @click="handleDelete(row.id)" type="danger" title="删除" icon="el-icon-delete" circle />-->
          <!--          </el-tooltip>-->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="分配角色" prop="username">
          <el-select v-model="selectedRoleId" filterable placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.depict" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师名称" prop="name">
          <el-input v-model="temp.name" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="教师头像" prop="avatarUrl">
          <el-upload
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            action="http://47.107.59.34:8080/upload/img"
            class="avatar-uploader"
          >
            <img v-if="temp.avatarUrl" :src="temp.avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpeg、jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="教师手机号" prop="phone">
          <el-input v-model="temp.phone" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model.number="temp.idCard" clearable placeholder="请输入内容"/>
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
    <!-- 图片预览   放在表格外面，这是个弹出框-->
    <el-dialog :modal="true" :visible.sync="lookdialogVisible" close-on-click-modal close-on-press-escape style="cursor: zoom-out"
               title="预览" width="25%"
    >
      <img :src="previewpic" width="100%"/>
    </el-dialog>
    <!--    返回顶部区域-->
    <BackToTop/>
  </div>
</template>

<script>
import { fetchTeachersList, createTeachers, updateTeachers, deleteTeachers } from '@/api/teacher'
import { getRoles } from '@/api/role'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

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
  name: 'Class',
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
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    // 验证身份证的规则
    var checkIdcard = (rule, value, cb) => {
      const regIdcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (regIdcard.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      tableKey: 0,
      // 设置图片上传的请求头
      headers: {
        'satoken': getToken()
      },
      // 存储列表数据
      list: null,
      total: 0,
      listLoading: false,
      // 点击图片显示大图
      showImgList: [],
      // 预览图片显示框
      lookdialogVisible: false,
      previewpic: '',
      // 所有角色的数据列表
      rolesList: {},
      // 已选中的角色id值
      selectedRoleId: null,
      // 错误、默认图片
      defaultImage: 'https://pic2.zhimg.com/80/v2-6afa72220d29f045c15217aa6b275808_720w.jpg?source=1940ef5c',
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        username: '',
        name: '',
        idCard: '',
        avatarUrl: '',
        phone: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        username: '',
        name: '',
        idCard: '',
        avatarUrl: '',
        phone: ''
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
        username: [{ required: true, message: '请填写用户名', trigger: 'change' }],
        name: [{ required: true, message: '请填写教师名称', trigger: 'change' }],
        idCard: [{ required: true, message: '请填写身份证', trigger: 'change' }, { validator: checkIdcard, trigger: 'blur' }],
        avatarUrl: [{ required: true, message: '请上传头像', trigger: 'change' }],
        phone: [{ required: true, message: '请填写手机号码', trigger: 'change' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getRolesList()
    this.getList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchTeachersList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 获取所有角色列表
    getRolesList() {
      getRoles(this.listQuery).then(response => {
        console.log(response)
        this.rolesList = response.data.records
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
        username: '',
        name: '',
        idCard: '',
        avatarUrl: '',
        phone: ''
      }
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      this.temp.avatarUrl = res.data
      this.showImgList = res.data
    },
    // 图片上传失败的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 点击教师跳转到当前教师管理的班级页面
    toManagerClass(id) {
      this.$router.push(`/managerClassByTeacher/managerClassByTeacher/${id}`)
    },
    // 点击教师跳转到当前教师管理的学生页面
    toManagerStudent(id) {
      this.$router.push(`/managerStudentByTeacher/managerStudentByTeacher/${id}`)
    },
    // 点击操作日志跳转到当前教师的操作历史页面
    toOperateHistory(id) {
      this.$router.push(`/operateHistoryByTeacher/operateHistoryByTeacher/${id}`)
    },
    // 教师头像预览大图
    showpreviewPic(url) {
      this.previewpic = url
      this.lookdialogVisible = true
    },
    // 规定序号排序方式
    indexMethod(index) {
      return index * 1 + 1
    },
    handleCreate() {
      this.resetTemp()
      this.temp.avatarUrl = this.defaultImage
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加教师触发的确认函数
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createTeachers(this.temp).then(() => {
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
    // 编辑教师函数
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      if (this.temp.avatarUrl === null) {
        this.temp.avatarUrl = this.defaultImage
      }
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
          updateTeachers(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList()
          })
          // 提示框
          this.$notify({
            title: '提示',
            message: '您已成功编辑！',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 删除函数
    async handleDelete(id) {
      try {
        await this.$confirm('确认删除当前数据吗？')
        // 只有点击了确定 才能进入到下方
        await deleteTeachers(id).then(response => {
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
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['教师名称', '教师头像', '教师手机号', '身份证']
        const filterVal = ['name', 'avatarUrl', 'phone', 'idCard']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '教师表'
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
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
