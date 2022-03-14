<template>
  <div class="app-container">
    <el-input v-model="msg" placeholder="请输入内容" type="text" width="100px"></el-input>
    <el-button @click="handleBtnSend">点击发送消息</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="全部">
        <el-table
          :data="msgList"
          style="width: 100%"
        >
          <el-table-column
            label="申请人"
            prop="date"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="申请类型"
            prop="name"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="申请时间"
            prop="name"
            width="100%"
          >
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
            <template slot-scope="{row,$index}">
              <el-button round size="small" type="warning">审核</el-button>
              <el-link type="success">审核通过</el-link>
              <el-link type="danger">审核不通过</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="调岗申请">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="申请人"
            prop="date"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="申请时间"
            prop="name"
            width="100%"
          >
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
            <template slot-scope="{row,$index}">
              <el-button round size="small" type="warning">审核</el-button>
              <el-link type="success">审核通过</el-link>
              <el-link type="danger">审核不通过</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="基本信息">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="申请人"
            prop="date"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="申请时间"
            prop="name"
            width="100%"
          >
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
            <template slot-scope="{row,$index}">
              <el-button round size="small" type="warning">审核</el-button>
              <el-link type="success">审核通过</el-link>
              <el-link type="danger">审核不通过</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="面试申请">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="申请人"
            prop="date"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="申请时间"
            prop="name"
            width="100%"
          >
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="230">
            <template slot-scope="{row,$index}">
              <el-button round size="small" type="warning">审核</el-button>
              <el-link type="success">审核通过</el-link>
              <el-link type="danger">审核不通过</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

const ws = new WebSocket('ws://47.107.59.34:8081/message?token=' + getToken())

export default {
  data() {
    return {
      token: getToken(),
      msg: '',
      msgList: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  mounted() {
    // const msg = this.msg
    ws.addEventListener('open', this.handleWsOpen.bind(this), false)
    ws.addEventListener('close', this.handleWsClose.bind(this), false)
    ws.addEventListener('error', this.handleWsError.bind(this), false)
    ws.addEventListener('message', this.handleWsMessage.bind(this), false)
  },
  methods: {
    // 发送消息按钮
    handleBtnSend() {
      const msg = this.msg
      ws.send(JSON.stringify({
        msg: this.msg
      }))
    },
    handleWsOpen(e) {
      console.log('WEBSOCKET 打开', e)
    },
    handleWsClose(e) {
      console.log('WEBSOCKET 关闭', e)
    },
    handleWsError(e) {
      console.log('WEBSOCKET 异常', e)
    },
    handleWsMessage(e) {
      console.log(e.data)
      // var msg = JSON.stringify(e.data)
      console.log('WEBSOCKET 消息', e)
    }
  }
}

</script>

<style>

</style>
