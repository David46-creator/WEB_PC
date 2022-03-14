<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 头部区域 -->
      <el-input v-model="listQuery.categoryId" class="filter-item" clearable placeholder="岗位名称" style="width: 200px;"
                @keyup.enter.native="handleFilter"
      />
      <!--      <el-date-picker v-model.trim="listQuery.releaseTime" placeholder="发布时间" type="date" class="filter-item" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @keyup.enter.native="handleFilter" />-->
      <el-button circle class="filter-item" icon="el-icon-search" size="max" type="primary" @click="handleFilter"/>
      <el-button class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">
        添加
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
    </div>
    <!-- 表格内容区域 -->
    <el-table :key="tableKey" ref="scrollBox" v-loading="listLoading" :data="list" border fit height="500"
              highlight-current-row style="width: 100%;"
    >
      <template slot="empty">
        <div class="noCart">
          <el-empty description="什么也没有~~~">
            <el-link :underline="false" href="https://news.qq.com/" target="_blank">随便逛逛... <i
              class="el-icon-potato-strips"
            ></i></el-link>
          </el-empty>
        </div>
      </template>
      <el-table-column align="center" fixed label="序号" type="index" width="65"/>
      <el-table-column align="center" label="岗位名称" width="200">
        <template slot-scope="{row}">
          <span class="link-type">{{ getCategoryName(row.categoryId) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="发布人" width="150" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ getTeacherName(row.adminId) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="发布人联系方式" width="150" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{row.phone}}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="企业名称" width="200">
        <template slot-scope="{row}">
          <span>{{ getEnterpriseName(row.companyId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布状态" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.state == 0 ? 'success': row.state == 1 ? 'warning' :'danger'">
            {{ row.state == 0 ? '招聘中' : row.state == 1 ? '招聘暂停' : '招聘结束' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位薪资">
        <template slot-scope="{row}">
          <span>{{ row.salary }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="dateFormat" align="center" label="发布时间" prop="releaseTime" width="200">
        <!--        <template slot-scope="{row}">-->
        <!--          <span><i class="el-icon-time" /> {{ row.releaseTime }}</span>-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column :formatter="dateFormat" align="center" label="有效时间" prop="validityTime" width="200">
        <!--        <template slot-scope="{row}">-->
        <!--          <span><i class="el-icon-time" /> {{ row.validityTime }}</span>-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="招聘描述" width="300">
        <template slot-scope="{row}">
          <span>{{ row.depict }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="180">
        <template slot-scope="{row,$index}">
          <el-tooltip content="查看" effect="dark" placement="left">
            <el-button circle icon="el-icon-zoom-in" title="查看" type="primary" @click="handleSelect(row)"/>
          </el-tooltip>
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button circle icon="el-icon-edit" title="编辑" type="primary" @click=" handleUpdate(row)"/>
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button circle icon="el-icon-delete" title="删除" type="danger" @click="handleDelete(row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :limit.sync="listQuery.limit" :page.sync="listQuery.page" :total="total"
                @pagination="getList"
    />
    <!--    查看窗口-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogSelectFormVisible" fullscreen title="查看">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="140px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="岗位名称：">
          <el-input v-model="temp.categoryId" :disabled="true"/>
        </el-form-item>
        <!--        <el-form-item label="发布人：">-->
        <!--          <el-input v-model="temp.adminId" :disabled="true" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="发布人联系方式：">-->
        <!--          <el-input v-model="temp.phone" :disabled="true" />-->
        <!--        </el-form-item>-->
        <el-form-item label="企业名称：">
          <el-input v-model="temp.companyId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="发布状态：">
          <el-input v-model="temp.state == 0 ? '招聘中': temp.state == 1 ? '招聘暂停' : '招聘结束'" :disabled="true"/>
        </el-form-item>
        <el-form-item label="岗位薪资：">
          <el-input v-model.number="temp.salary" :disabled="true"/>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-input v-model="temp.releaseTime" :disabled="true"/>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-input v-model="temp.validityTime" :disabled="true"/>
        </el-form-item>
        <el-form-item label="招聘描述：">
          <el-input v-model="temp.depict" :disabled="true" autosize style="padding:0 60px 13px 0" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!--    编辑和添加窗口-->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="140px" status-icon
               style="width: 550px; margin-left:50px;"
      >
        <el-form-item label="岗位名称：" prop="categoryId">
          <el-select v-model="temp.categoryId" filterable placeholder="请选择">
            <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="发布人：" prop="adminId">-->
        <!--          <el-select v-model="temp.adminId" placeholder="请选择" filterable>-->
        <!--            <el-option v-for="item in teachersList" :key="item.id" :label="item.name" :value="item.id">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="发布人联系方式：" prop="phone">-->
        <!--          <el-input v-model="temp.phone" placeholder="请输入内容" clearable />-->
        <!--        </el-form-item>-->
        <el-form-item label="企业名称：" prop="companyId">
          <el-select v-model="temp.companyId" filterable placeholder="请选择">
            <el-option v-for="item in EnterpriseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态：" prop="state">
          <el-select v-model="temp.state" placeholder="请选择">
            <el-option :value="0" label="招聘中"></el-option>
            <el-option :value="1" label="招聘暂停"></el-option>
            <el-option :value="2" label="招聘结束"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位薪资：" prop="salary">
          <el-input v-model.number="temp.salary" clearable placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="发布时间：" prop="releaseTime">
          <el-date-picker
            v-model="temp.releaseTime"
            :picker-options="pickerOptions"
            align="right" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效时间：" prop="validityTime">
          <el-date-picker
            v-model="temp.validityTime"
            :picker-options="pickerOptions"
            align="right" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="招聘描述：" prop="depict">
          <el-input v-model="temp.depict" :rows="6" autocomplete clearable maxlength="900" placeholder="请输入内容"
                    show-word-limit style="padding:0 60px 13px 0" type="textarea"
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
// 接口数据
import { fetchRecruitsByEnterpriseIdList, createRecruits, updateRecruits, deleteRecruits } from '@/api/recruits'
import { fetchEnterpriseList } from '@/api/enterprise'
import { fetchTeachersList } from '@/api/teacher'

// 日期转换插件
import moment from 'moment'

import waves from '@/directive/waves' // 波浪指令
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop' // 返回顶部
import Pagination from '@/components/Pagination'
import { deletePost, fetchPostList } from '@/api/post'
import { deleteMajor } from '@/api/major' // 基于el分页的二次封装

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
  name: 'Recruits',
  components: { Pagination, BackToTop },
  directives: { waves },
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
    return {
      number: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      // 已选中的企业id值
      selectedEnterpriseId: '',
      // 所有企业的数据列表
      EnterpriseList: '',
      // 存储岗位数据列表
      postList: '',
      // 存储教师数据列表
      teachersList: '',
      // 存储系列表数据
      listQuery: {
        page: 1,
        limit: 50,
        adminId: '', // 发布人
        state: '', // 招聘状态
        phone: '', // 发布人联系方式
        companyId: '', // 公司
        categoryId: '', // 岗位
        depict: '', // 招聘描述
        salary: '', // 薪资
        releaseTime: '', // 发布时间
        validityTime: '' // 有效时间
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      // 查看数据表单显示
      dialogSelectFormVisible: false,
      showReviewer: false,
      temp: {
        categoryId: '', // 岗位名称
        adminId: '', // 发布人
        state: '', // 招聘状态
        phone: '', // 发布人联系方式
        companyId: '', // 企业名称
        salary: '', // 岗位薪资
        releaseTime: '', // 发布时间
        validityTime: '', // 有效时间
        depict: '' // 招聘描述
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      pvData: [],
      // 日期时间选择器
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // 表单规则
      rules: {
        categoryId: [{ required: true, message: '请填写岗位名称', trigger: 'blur' }], // 岗位名称
        adminId: [{ required: true, message: '请填写发布人', trigger: 'blur' }], // 发布人
        state: [{ required: true, message: '请填写发布状态', trigger: 'blur' }], // 发布状态
        phone: [{ required: true, message: '请填写发布人联系方式', trigger: 'blur' }, {
          validator: checkMobile,
          trigger: 'blur'
        }], // 发布人联系方式
        companyId: [{ required: true, message: '请填写企业名称', trigger: 'blur' }], // 企业名称
        salary: [
          { required: true, message: '请填写岗位薪资', trigger: 'blur' },
          { type: 'number', message: '岗位薪资必须为数字值', trigger: 'blur' }
        ], // 岗位薪资
        releaseTime: [{ required: true, message: '请填写发布时间', trigger: 'blur' }], // 发布时间
        validityTime: [{ required: true, message: '请填写有效时间', trigger: 'blur' }], // 有效时间
        depict: [{ required: true, message: '请填写招聘描述', trigger: 'blur' }] // 招聘描述
      }
    }
  },
  created() {
    this.getList()
    this.getPostList()
    this.getTeachersList()
    this.getEnterpriseList()
  },
  methods: {
    // 接口函数获取数据
    getList() {
      fetchRecruitsByEnterpriseIdList(this.$route.params.id).then(response => {
        // console.log(response)
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 获取岗位数据
    getPostList() {
      fetchPostList(this.listQuery).then(response => {
        // console.log(response)
        this.postList = response.data.records
      })
    },
    // 获取教师数据
    getTeachersList() {
      fetchTeachersList(this.listQuery).then(response => {
        // console.log(response)
        this.teachersList = response.data.records
      })
    },
    // 获取企业数据
    getEnterpriseList() {
      fetchEnterpriseList(this.listQuery).then(response => {
        this.EnterpriseList = response.data.records
      })
    },
    // 通过id查询岗位数据
    getCategoryName(id) {
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
    // 通过id查询教师数据
    getTeacherName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.teachersList.length; i < len; i++) {
        let item = this.teachersList[i]
        if (item.id == id) {
          return item.name
        }
      }
      return null
    },
    getEnterpriseName(id) {
      if (!id) {
        return null
      }
      for (let i = 0, len = this.EnterpriseList.length; i < len; i++) {
        let item = this.EnterpriseList[i]
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
        categoryId: null, // 岗位名称
        adminId: '', // 发布人
        state: null, // 招聘状态
        phone: '', // 发布人联系方式
        companyId: null, // 企业名称
        salary: '', // 岗位薪资
        releaseTime: '', // 发布时间
        validityTime: '', // 有效时间
        depict: '' // 招聘描述
      }
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
          createRecruits(this.temp).then((response) => {
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
          updateRecruits(tempData).then((response) => {
            if (response.status === 200) {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              if (response.status === 200) {
                // 提示框
                this.$notify({
                  title: '提示',
                  message: '您已成功编辑！',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              }
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
        await deleteRecruits(id).then(response => {
          // 调用删除接口
          if (response.status === 200) {
            this.$message.success('删除成功')
            this.getList() // 重新加载数据
          }
        })
      } catch (error) {
        this.$message.info('取消删除！')
      }
    },
    // 表格中格式化时间
    dateFormat(row, column) {
      let date = row[column.property]
      if (date == undefined) {
        return ''
      }

      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
    // dateFormat: function(row,column){
    //   var date = row[column.property];
    //   if(date == undefined){return ''};
    //   return moment(date).format("yyyy-MM-dd HH:mm:ss")
    // }
    // // 导出函数
    // handleDownload() {
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['岗位名称', '发布人', '发布人联系方式', '企业名称', '岗位薪资', '发布时间', '有效时间', '招聘描述']
    //     const filterVal = ['category', 'admin', 'phone', 'company', 'salary', 'releaseTime', 'validityTime','depict']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '招聘表'
    //     })
    //   })
    // },
    // // 格式化json数据
    // formatJson(filterVal) {
    //   return this.list.map(v =>
    //     filterVal.map(j => {
    //       if (j === 'timestamp') {
    //         return parseTime(v[j])
    //       } else {
    //         return v[j]
    //       }
    //     })
    //   )
    // }
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
