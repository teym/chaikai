<template>
  <div class="dashboard-container">
    <el-row class="tools" :gutter="20">
      <el-col :span="12">
        <div class="block function">
          <h4>{{ name }}</h4>
          <div>
            手机号：{{ telephone }}
            <span>
              <el-button type="text" @click="showChangePhone=true">绑定手机</el-button>
              <el-button type="text" @click="showChangePassword=true">修改密码</el-button>
            </span>
          </div>
          <div>
            企业认证：{{ (["UNKNOW","未认证","审核中","已认证","已拒绝"])[user.statusCode] }}
            <span>
              <el-button
                size="mini"
                type="primary"
                round
                @click="handleAuth"
              >{{ (["","马上认证","查看认证","查看认证","重新认证"])[user.statusCode] }}</el-button>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block task">
          <h4>账户资产</h4>
          <el-row>
            <el-col :span="12">
              <span>{{ activity }}</span> 次
            </el-col>
            <el-col :span="12">
              <div @click="$router.push('/user/balance')">
                <span>{{ amount }}</span> 元
                <el-icon class="el-icon-arrow-right" />
              </div>
            </el-col>
            <el-col class="title" :span="12">
              置换活动
              <el-button size="mini" type="primary" round @click="$router.push('/user/buy')">增加次数</el-button>
            </el-col>
            <el-col class="title" :span="12">
              账户余额
              <el-button size="mini" type="primary" round @click="$router.push('/user/topup')">充值金额</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="绑定手机号" :visible.sync="showChangePhone" width="420px">
      <el-form :model="phoneForm" :rules="rules" label-position="right" label-width="92px">
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="phoneForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="(新)手机号" prop="username">
          <el-input v-model="phoneForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" props="code">
          <el-input v-model="phoneForm.code" autocomplete="off" style="width:60%" />
          <el-button
            style="float:right"
            plain
            type="info"
            @click="handleCode"
          >{{ count > 0 ? `${count}后再试` :'获取验证码' }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="phoneLoading" @click="handleChangePhone">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="showChangePassword" width="420px">
      <el-form :model="passwordForm" :rules="rules" label-position="right" label-width="92px">
        <el-form-item label="手机号" prop="username">
          <el-input v-model="passwordForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="passwordForm.code" autocomplete="off" style="width:60%" />
          <el-button
            style="float:right"
            plain
            type="info"
            @click="handleCode"
          >{{ count > 0 ? `${count}后再试` :'获取验证码' }}</el-button>
        </el-form-item>
        <el-form-item label="重置密码" prop="password">
          <el-input v-model="passwordForm.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validPhone, validCode } from '@/utils/validate'
import { getCode } from '@/api/user'

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('错误的手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!validCode(value)) {
        callback(new Error('验证码为4位数字'))
      } else {
        callback()
      }
    }
    return {
      showChangePhone: false,
      showChangePassword: false,
      phoneForm: {
        username: '',
        password: '',
        code: ''
      },
      phoneLoading: false,

      passwordForm: {
        username: '',
        code: '',
        password: ''
      },
      passwordLoading: false,

      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },

      count: 0
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone', 'amount', 'activity'])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    handleTimer() {
      this.timer = setTimeout(() => {
        this.count -= 1
        if (this.count > 0) {
          this.handleTimer()
        }
      }, 1000)
    },
    handleCode() {
      if (this.count > 0) return
      if (!validPhone(this.loginForm.username)) return
      this.count = 59
      this.handleTimer()

      getCode(this.loginForm.username, 101)
    },
    handleChangePhone() {
      this.phoneLoading = true
      setTimeout(() => {
        this.phoneLoading = false
        this.showChangePhone = false
      }, 1000)
    },
    handleChangePassword() {
      this.showChangePassword = true
      setTimeout(() => {
        this.passwordLoading = false
        this.showChangePassword = false
      }, 1000)
    },
    handleAuth() {
      this.$router.push('/user/create')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .tools {
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h4 {
        margin: 0 0 24px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px 0;
      }
    }
    .function {
      div {
        font-size: 16px;
        padding: 6px 16px 6px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 14px;
          padding: 2px 0;
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
        .el-button {
          margin-left: 8px;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
