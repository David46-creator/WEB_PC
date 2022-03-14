<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="box-center" >
      <pan-thumb :image="user.avatarUrl === undefined ? defaultImage : user.avatarUrl">
        <div>你好</div>
        <div class="user-name">{{ user.name }}</div>
      </pan-thumb>
      <el-button type="primary" icon="el-icon-upload" size="small" style="margin-bottom: 20px;" @click="imagecropperShow=true">
        修改头像
      </el-button>
    </div>
    <div class="box-center" style="margin-bottom: 20px">
      <div class="box-center">
        <div class="user-role text-center text-muted" v-if="user.role.length === 3">系统角色：系部长</div>
        <div class="user-role text-center text-muted" v-else-if="user.role.length === 2">系统角色：部长</div>
        <div class="user-role text-center text-muted" v-else>系统角色：指导老师</div>
      </div>
    </div>
<!--    <el-upload-->
<!--      class="avatar-uploader"-->
<!--      :headers="headers"-->
<!--      action="http://106.13.30.129:8080/upload/img"-->
<!--      :show-file-list="false"-->
<!--      :on-success="handleAvatarSuccess"-->
<!--      :before-upload="beforeAvatarUpload">-->
<!--      <img v-if="temp.companyLogoUrl" :src="temp.companyLogoUrl" class="avatar">-->
<!--      <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--      <div slot="tip" class="el-upload__tip">只能上传jpeg文件，且不超过2MB</div>-->
<!--    </el-upload>-->
    <image-cropper
      v-show="imagecropperShow"
      url="http://47.107.59.34:8080/upload/img"
      :headers="user.headers"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
<!--    <div class="user-profile">-->
<!--      <div class="box-center">-->
<!--        <pan-thumb :image="user.avatarUrl" :height="'100px'" :width="'100px'" :hoverable="false">-->
<!--          <div>你好</div>-->
<!--          <div class="user-name">{{ user.name }}</div>-->
<!--        </pan-thumb>-->
<!--      </div>-->
<!--      <div class="box-center">-->
<!--&lt;!&ndash;        <div class="user-name text-center">{{ user.name }}</div>&ndash;&gt;-->
<!--        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="user-bio">-->
<!--      <div class="user-education user-bio-section">-->
<!--        <div class="user-bio-section-header">-->
<!--          <svg-icon icon-class="education" /><span>Education</span>-->
<!--        </div>-->
<!--        <div class="user-bio-section-body">-->
<!--          <div class="text-muted">-->
<!--            JS in Computer Science from the University of Technology-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div class="user-skills user-bio-section" style="text-align:left;line-height: 30px">
        <div class="user-bio-section-body">
          <div class="progress-item">
            <h5 class="user-profile" style="margin: 0;padding: 0">用户名：</h5>
            <div>{{user.name}}</div>
          </div>
          <div class="progress-item">
            <h5 class="user-profile" style="margin: 0;padding: 0">联系方式：</h5>
            <div>{{user.phone}}</div>
          </div>
          <div class="progress-item">
            <h5 class="user-profile" style="margin: 0;padding: 0">身份证：</h5>
            <div>{{user.idCard}}</div>
          </div>
        </div>
      </div>
<!--    </div>-->
  </el-card>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import { getToken } from '@/utils/auth'
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb,ImageCropper },
  data(){
    return {
      // 错误、默认图片
      defaultImage: 'https://pic2.zhimg.com/80/v2-6afa72220d29f045c15217aa6b275808_720w.jpg?source=1940ef5c',
      imagecropperShow: false,
      imagecropperKey: 0
    }

  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          idCard: '',
          phone: '',
          headers: getToken(),
          avatarUrl: '',
          role: '',
        }
      }
    }
  },
  methods:{
    cropSuccess(res) {
      console.log(res)
      this.imagecropperShow = false
      // this.user.avatarUrl = resData.data
      this.imagecropperKey = this.imagecropperKey + 1
      this.user.avatarUrl = res.data
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.user-profile {
.user-name {
  font-weight: bold;
}
.box-center {
  padding-top: 10px;
}
.user-role {
  padding-top: 10px;
  font-weight: 400;
  font-size: 14px;
}
.box-social {
  padding-top: 30px;
.el-table {
  border-top: 1px solid #dfe6ec;
}
}
.user-follow {
  padding-top: 20px;
}
}
.user-bio {
  margin-top: 20px;
  color: #606266;
span {
  padding-left: 4px;
}
.user-bio-section {
  font-size: 14px;
  padding: 15px 0;
.user-bio-section-header {
  border-bottom: 1px solid #dfe6ec;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}
}
}
</style>
