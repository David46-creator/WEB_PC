<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toStudentPage">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="student2" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            未实习学生总数
          </div>
          <count-to :start-val="0" :end-val="list.students" :duration="3500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toTeacherPage">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="teacher" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            在职教师总数
          </div>
          <count-to :start-val="0" :end-val="list.admins" :duration="3500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toEnterprisePage">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="enterprise" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            企业总数
          </div>
          <count-to :start-val="0" :end-val="list.companys" :duration="3500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toPostPage">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="post" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            发布岗位总数
          </div>
          <count-to :start-val="0" :end-val="list.recruits" :duration="3500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import CountTo from 'vue-count-to'
import { fetchDashboardList } from '@/api/dashboard'

export default {
  data(){
    return {
      list:'',
    }
  },
  components: {
    CountTo
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      fetchDashboardList().then(response => {
        this.list = response.data.data[0]
      })
    },
    toStudentPage(){
      this.$router.push('/department/student/')
    },
    toTeacherPage(){
      this.$router.push('/department/teacher/')
    },
    toEnterprisePage(){
      this.$router.push('/enterprise/enterprise/')
    },
    toPostPage(){
      this.$router.push('/post/post/')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
