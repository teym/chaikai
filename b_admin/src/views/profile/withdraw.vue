<template>
  <div class="profile-container">
    <div class="container">
      <el-form label-width="90px" style="width:320px">
        <el-form-item label="提现金额">
          <el-input v-model="num" :placeholder="'账户余额' + amount" />
        </el-form-item>
        <el-form-item label="提现方式">
          <el-radio-group v-model="pay">
            <el-radio-button label="1">银行卡</el-radio-button>
            <el-radio-button label="2">支付宝</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="pay==='2'" label="支付宝帐号">
          <el-input v-model="account" placeholder="请输入支付宝帐号" />
        </el-form-item>
        <el-form-item v-if="pay==='2'" label="帐号名称">
          <el-input v-model="name" placeholder="请输入支付宝帐号名称" />
        </el-form-item>

        <el-form-item v-if="pay==='1'" label="户名">
          <el-input v-model="title" placeholder="请输入银行卡户名" />
        </el-form-item>
        <el-form-item v-if="pay==='1'" label="卡号">
          <el-input v-model="card" placeholder="请输入银行卡卡号" />
        </el-form-item>
        <el-form-item v-if="pay==='1'" label="开户行">
          <el-input v-model="bank" placeholder="请输入银行卡开户行" />
        </el-form-item>

        <el-form-item label>
          <el-button type="primary">提现</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      num: undefined,
      pay: '1',
      listLoading: false,
      account: '',
      name: '',
      title: '',
      card: '',
      bank: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'roles', 'amount'])
  },
  methods: {}
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
}
</style>
