<template>
  <div class="dashboard-container">
    <notice />
    <el-row class="tools" :gutter="20">
      <el-col :span="12">
        <div class="block function">
          <h3>快捷功能</h3>
          <el-row>
            <el-col :span="12">
              <img src="@/assets/images/dash_create.png">
              创建商品
            </el-col>
            <el-col :span="12">
              <img src="@/assets/images/dash_activity.png"> 发布活动
            </el-col>
            <el-col :span="12">
              <img src="@/assets/images/dash_auth.png">认证授权
            </el-col>
            <el-col :span="12">
              <img src="@/assets/images/dash_invoice.png">申请开票
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block task">
          <h3>待办事项</h3>
          <el-row>
            <el-col :span="12">
              <span>2</span> 待确认 <el-icon class="el-icon-arrow-right" />
            </el-col>
            <el-col :span="12">
              <span>2</span> 待发货<el-icon class="el-icon-arrow-right" />
            </el-col>
            <el-col class="title" :span="12">订单问题</el-col>
            <el-col class="title" :span="12">活动订单</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notice from './components/notice'

export default {
  name: 'Dashboard',
  components: { notice },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  .tools {
    margin: 20px 0;
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h3 {
        margin: 0 0 12px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px;
      }
    }
    .function {
      .el-col {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
      }
    }
    .task {
      .el-col {
        font-size: 16px;
        color: #333;
        span {
          font-size: 26px;
          line-height: 40px;
          color: #2873fc;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
}
</style>
