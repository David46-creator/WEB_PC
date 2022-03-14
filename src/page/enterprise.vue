<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="企业名称" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.address" class="filter-item" clearable placeholder="企业地址" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <!--      <el-input v-model="listQuery.phone" placeholder="联系人电话" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />-->
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
    <el-table :key=" tableKey" ref="scrollBox" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%"
    >
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <!--      <el-table-column prop="companyLogoUrl" label="企业LOGO" align="center" width="200px">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <el-image :src="row.companyLogoUrl" alt="企业LOGO" fit="contain" @click="showpreviewPic(row.companyLogoUrl)" style="width:150px;height:100px;cursor: zoom-in" lazy>-->
      <!--            <div slot="error" class="image-slot">-->
      <!--              <el-image :src="defaultImage" style="width:150px;height:100px;cursor: zoom-in" fit="contain" lazy/>-->
      <!--            </div>-->
      <!--          </el-image>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="企业名称" prop="name">
        <template slot-scope="{row}">
          <span class="link-type" @click="toRecruitsByEnterpriseName(row.id)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业对接老师" prop="name">
        <template slot-scope="{row}">
          <span class="link-type">{{ getTeacherName(row.adminId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业联系人" prop="contactName">
        <template slot-scope="{row}">
          <span>{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" prop="phone">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业地址" prop="address">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column :row="6" :show-overflow-tooltip="true" align="center" label="企业描述" prop="describe">
        <template slot-scope="{row}">
          <span>{{ row.depict }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="{row,$index}">
          <el-tooltip content="查看" effect="dark" placement="left">
            <el-button circle icon="el-icon-zoom-in" type="primary" @click="handleSelect(row)"/>
          </el-tooltip>
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click="handleUpdate(row)"/>
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button v-if="row.status!='deleted'" circle icon="el-icon-delete" type="danger"
                       @click="handleDelete(row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync="listQuery.current" :total="total"
                @pagination="getList"
    />
    <!-- 查看窗口区域-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogSelectFormVisible" fullscreen title="查看">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="企业名称：">
          <el-input v-model="temp.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="企业对接老师：">
          <el-input v-model="temp.adminId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="企业联系人：">
          <el-input v-model="temp.contactName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="联系人电话：">
          <el-input v-model="temp.phone" :disabled="true"/>
        </el-form-item>
        <el-form-item label="企业LOGO：">
          <el-image :src="temp.companyLogoUrl" lazy
                    style="width:150px;height:100px;cursor: zoom-in" @click="showpreviewPic(temp.companyLogoUrl)"
          >
            <div slot="error" class="image-slot">
              <el-image :src="defaultImage" fit="contain" style="width:150px;height:100px;cursor: zoom-in"/>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="企业地址：">
          <el-input v-model="temp.address" :disabled="true"/>
        </el-form-item>
        <el-form-item label="企业描述：">
          <el-input v-model="temp.depict" :disabled="true" autosize type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!--    编辑和添加窗口区域-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" close-on-click-modal
               close-on-press-escape
    >
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="110px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="temp.name" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="企业对接老师" prop="name">
          <el-select v-model="temp.adminId" filterable placeholder="请选择">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
<!--          <el-input v-model="temp.adminId" clearable placeholder="请输入内容"/>-->
        </el-form-item>
        <el-form-item label="企业联系人" prop="contactName">
          <el-input v-model="temp.contactName" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="联系人电话" prop="phone">
          <el-input v-model="temp.phone" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="企业LOGO">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            action="http://47.107.59.34:8080/upload/img"
            class="avatar-uploader"
          >
            <img v-if="temp.companyLogoUrl" :src="temp.companyLogoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpeg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input v-model="temp.address" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="企业描述" prop="depict">
          <el-input v-model="temp.depict" autocomplete autosize clearable placeholder="请输入内容" show-word-limit
                    style="padding:0 80px 13px 0" type="textarea"
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
    <!-- 图片预览   放在表格外面，这是个弹出狂-->
    <el-dialog :modal="true" :visible.sync="lookdialogVisible" close-on-click-modal close-on-press-escape style="cursor: zoom-out"
               title="预览" width="25%"
    >
      <img :src="previewpic" width="100%"/>
    </el-dialog>
    <!-- 图片预览 -->
    <BackToTop/>
  </div>
</template>

<script>
import { fetchEnterpriseList, createEnterprise, updateEnterprise, deleteEnterprise } from '@/api/enterprise'
import { fetchTeachersList } from '@/api/teacher'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission'

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
  name: 'Enterprise',
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
      cb(new Error('手机号格式不合法！请重新输入！'))
    }
    return {
      id: '',
      tableKey: 0,
      // 设置图片上传的请求头
      headers: {
        'satoken': getToken()
      },
      list: null,
      teacherList: '',
      // 点击图片显示大图
      showImgList: [],
      defaultImage: 'https://images.pexels.com/photos/8834489/pexels-photo-8834489.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      total: 0,
      listLoading: false,
      dialogVisible: false,
      // 预览图片显示框
      lookdialogVisible: false,
      previewpic: '',
      // 存储系列表数据
      listQuery: {
        current: 1,
        size: 50,
        name: '',
        contactName: '',
        phone: '',
        adminId: '',
        // landline: undefined,
        companyLogoUrl: '',
        address: '',
        position: '',
        depict: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      dialogSelectFormVisible: false,
      showReviewer: false,
      temp: {
        name: undefined,
        contactName: undefined,
        phone: undefined,
        adminId: '',
        companyLogoUrl: undefined,
        address: undefined,
        position: undefined,
        depict: undefined
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
        name: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
        contactName: [{ required: true, message: '企业联系人不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '企业联系人电话不可为空', trigger: 'blur' }, {
          validator: checkMobile,
          trigger: 'blur'
        }],
        adminId: [{ required: true, message: '企业对接老师不能为空', trigger: 'blur' }],
        companyLogoUrl: [{ required: true, message: '企业Logo不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '企业地址不能为空', trigger: 'blur' }],
        position: [{ required: true, message: '企业经纬度不能为空', trigger: 'blur' }],
        depict: [{ required: true, message: '企业描述不能为空', trigger: 'blur' }]
      },
      // 加载动画
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getTeacherList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchEnterpriseList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 获取老师列表数据
    getTeacherList(){
      fetchTeachersList(this.listQuery).then(response => {
        console.log(response)
        this.teacherList = response.data.records
      })
    },
    // 通过id查询数据
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
    // 搜索函数
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 企业logo预览大图
    showpreviewPic(url) {
      this.previewpic = url
      this.lookdialogVisible = true
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        name: '',
        contactName: '',
        phone: '',
        companyLogoUrl: '',
        address: '',
        position: '',
        depict: ''
      }
    },
    // 跳转到该企业招聘详情
    toRecruitsByEnterpriseName(id) {
      this.$router.push(`/managerRecruitsByEnterprise/managerRecruitsByEnterprise/${id}`)
    },
    handleScroll(e) {
      let scrollNum = this.$refs.scrollBox
      // deltaY属性在向下滚动时返回正值，向上滚动时返回负值，否则为0
      scrollNum.scrollLeft = scrollNum.scrollLeft + e.deltaY
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
          createEnterprise(this.temp).then((response) => {
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
    // 查看函数
    handleSelect(row) {
      this.dialogSelectFormVisible = true
      if (this.temp.avatarUrl === '') {
        this.temp.avatarUrl = this.defaultImage
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogSelectFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑函数
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.companyLogoUrl === '') {
        this.temp.companyLogoUrl = this.defaultImage
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
          updateEnterprise(tempData).then((response) => {
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
        await deleteEnterprise(id) // 调用删除接口
        this.getList() // 重新加载数据
        this.$message.success('删除成功！')
      } catch (error) {
        this.$message.info('已取消删除！')
      }
    },
    // 导出函数
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['企业名称', '企业联系人', '联系人电话', '企业LOGO', '企业地址', '企业经纬度', '企业描述']
        const filterVal = ['name', 'contactName', 'phone', 'companyLogoUrl', 'address', 'position', 'depict']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '企业表'
        })
        this.downloadLoading = false
      })
    },
    handleAvatarSuccess(res, file) {
      this.temp.companyLogoUrl = res.data
      this.showImgList = res.data
    },
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
.el-tooltip__popper {
  max-width: 50%;
}

/*设置显示隐藏部分内容，按50%显示*/

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
