<template>
  <div class="profile-container">
    <div class="container">
      <div class="info">
        <el-menu default-active="1" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">置换活动</el-menu-item>
          <el-menu-item index="2" disabled>管家服务</el-menu-item>
          <el-menu-item index="3" disabled>托管服务</el-menu-item>
        </el-menu>
        <el-button
          size="mini"
          style="float:right"
          type="primary"
          @click="$router.push('/user/history')"
        >订购记录</el-button>
      </div>
      <div class="block">
        <el-form label-width="80px">
          <el-form-item label="购买次数">
            <el-input-number v-model="num" :min="1" :max="99" />
            <span class="price">399元每次</span>
          </el-form-item>
          <el-form-item label="订购金额">
            <span class="total">{{ 399 * num }}</span>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-radio-group v-model="pay">
              <el-radio-button label="1">账户余额</el-radio-button>
              <el-radio-button label="2">支付宝</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-top:50px">
            <el-button type="primary">提交订单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      active: '1',
      num: 1,
      pay: '1',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {},
  methods: {
    handleSelect(e) {
      this.active = e
    },
    handleSubmit() {
      this.$router.push('/user/auth')
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .container {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    .info {
      border-bottom: 1px solid #f5f5f5;
      padding-bottom: 10px;
      .el-menu {
        border-bottom: none;
        display: inline-block;
      }
      .el-button {
        margin: 16px 0;
      }
    }
    .block {
      max-width: 450px;
      margin: 10px 0 400px 0;
      padding-top: 10px;
    }
    .price {
      color: #666;
      margin-left: 8px;
    }
    .total {
      color: #4244ff;
      font-size: 20px;
    }
  }
}
</style>
