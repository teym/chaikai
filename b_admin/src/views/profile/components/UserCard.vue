<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="block">
          <h5>有限公司</h5>
          <div>手机号：186***1989</div>
          <div>企业认证：未认证 <span>立即认证</span></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block">
          <h5>账户资产</h5>
          <div>2次 置换活动</div>
          <div>100 账户余额</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 40px 45px 20px 50px;
  .block {
    background-color: lightgray;
    border-radius: 4px;
  }
}
</style>
