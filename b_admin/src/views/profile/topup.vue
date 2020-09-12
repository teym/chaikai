<template>
  <div class="profile-container">
    <div class="container">
      <el-form label-width="90px">
        <el-form-item label="充值金额">
          <el-input v-if="type === '0'" v-model="num" style="width:180px" />
          <el-radio-group v-else v-model="type" @change="onChange">
            <el-radio-button label="1000" />
            <el-radio-button label="3000" />
            <el-radio-button label="5000" />
            <el-radio-button label="0">自定义</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio :checked="true">支付宝</el-radio>
        </el-form-item>
        <el-form-item label="应付金额">
          <span class="price">{{ num }}<span>元</span></span>
        </el-form-item>

        <el-form-item label>
          <el-button type="primary">去支付</el-button>
        </el-form-item>
      </el-form>
      <div class="info">
        <p>
          线下转账：
          <span>*转账时请备注【{$公司名称}{$账户ID}】</span>
        </p>
        <p style="color:#FFFFFF">
          线下转账：
          <span>*转账成功后将截图发送给对接您的小二</span>
        </p>
        <p class="alipay">
          支付宝：123012@80.com</p>
        <p class="bank">
          户名:杭州多推科技有限公司
          <br>开户行:招商银行杭州转塘小微企业
          <br>账号:12397012380913801
        </p>
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
      num: 3000,
      type: '3000',
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {},
  methods: {
    onChange(e) {
      if (e !== '0') {
        this.num = parseInt(e)
      }
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
  }
  .price{
    font-size: 20px;
    color: #4244FF;
    span{
      font-size: 12px;
      color: #666;
    }
  }
  .info {
    border-top: 1px solid #f5f5f5;
    padding: 16px;
    p {
      font-size: 14px;
      color: #333;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      span {
        color: #ff4848;
      }
    }
    .alipay{
      margin-top: 12px;
    }
    .bank{
      margin-top: 12px;
    }
  }
}
</style>
