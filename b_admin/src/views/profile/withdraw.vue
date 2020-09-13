<template>
  <div class="profile-container">
    <div class="container">
      <el-form label-width="90px" style="width:320px">
        <el-form-item label="提现金额">
          <el-input v-model="form.amount" :placeholder="'账户余额' + amount" />
        </el-form-item>
        <el-form-item label="提现方式">
          <el-radio-group v-model="form.type">
            <el-radio-button label="1">银行卡</el-radio-button>
            <el-radio-button label="2">支付宝</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.type==='2'" label="支付宝帐号">
          <el-input v-model="form.alipayAccount" placeholder="请输入支付宝帐号" />
        </el-form-item>
        <el-form-item v-if="form.type==='2'" label="帐号名称">
          <el-input v-model="form.alipayAccountName" placeholder="请输入支付宝帐号名称" />
        </el-form-item>

        <el-form-item v-if="form.type==='1'" label="户名">
          <el-input v-model="form.bandAccountName" placeholder="请输入银行卡户名" />
        </el-form-item>
        <el-form-item v-if="form.type==='1'" label="卡号">
          <el-input v-model="form.bandCardNo" placeholder="请输入银行卡卡号" />
        </el-form-item>
        <el-form-item v-if="form.type==='1'" label="开户行">
          <el-input v-model="form.bandName" placeholder="请输入银行卡开户行" />
        </el-form-item>

        <el-form-item label>
          <el-button :loading="loading" type="primary" @click="handleSubmit">提现</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { withdraw } from '@/api/user'

export default {
  data() {
    return {
      loading: false,
      form: {
        amount: undefined,
        type: '1',
        listLoading: false,
        alipayAccount: '',
        alipayAccountName: '',
        bandAccountName: '',
        bandCardNo: '',
        bandName: ''
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'roles', 'amount'])
  },
  methods: {
    handleSubmit() {
      this.loading = true
      withdraw(Object.assign({}, this.form))
        .then((r) => {
          this.loading = false
          this.$message({ message: '提交成功', type: 'success' })
          setTimeout(() => {
            this.$router.push('/user/index')
          }, 500)
        })
        .catch((e) => {
          this.loading = false
          console.log(e)
        })
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
}
</style>
