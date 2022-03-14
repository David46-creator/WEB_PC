<template>
  <el-form :rules="rules" :model="user" ref="dataForm">
    <el-form-item label="用户名：" prop="name">
      <el-input v-model.trim="user.name" clearable />
    </el-form-item>
    <el-form-item label="修改密码：" prop="password">
      <el-input type="password" show-password v-model.trim="user.password" clearable />
    </el-form-item>
    <el-form-item label="联系方式：" prop="phone">
      <el-input v-model.trim="user.phone" clearable />
    </el-form-item>
    <el-form-item label="身份证号：" prop="idCard">
      <el-input v-model.trim="user.idCard" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateProfile } from '@/api/profile'

export default {
  data(){
    return {
      rules: {
        name: [{ required: true, message: '请填写用户名', trigger: 'change' }],
        phone: [{ required: true, message: '请填写联系方式', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        idCard: [{ required: true, message: '请填写身份证号', trigger: 'change' },
          { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '身份证格式不正确'}
        ],
      },
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          phone: '',
          idCard:''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateProfile(this.user).then(response => {
            console.log(response)
            this.$message({
              message: '用户信息已成功更改',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    }
  }
}
</script>
