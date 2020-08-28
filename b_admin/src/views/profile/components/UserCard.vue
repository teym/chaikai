<template>
  <div class="dashboard-container">
    <el-row class="tools" :gutter="20">
      <el-col :span="12">
        <div class="block function">
          <h4>{{ name }}</h4>
          <div>
            手机号：15127635621
            <span>
              <el-button type="text" @click="showChangePhone=true">绑定手机</el-button>
              <el-button type="text" @click="showChangePassword=true">修改密码</el-button>
            </span>
          </div>
          <div>
            企业认证：未认证
            <span>
              <el-button size="mini" type="primary">马上认证</el-button>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block task">
          <h4>账户资产</h4>
          <el-row>
            <el-col :span="12">
              <span>2</span> 次
            </el-col>
            <el-col :span="12">
              <span>2</span> 元
              <el-icon class="el-icon-arrow-right" />
            </el-col>
            <el-col class="title" :span="12">
              置换活动
              <el-button size="mini" type="primary" round>增加次数</el-button>
            </el-col>
            <el-col class="title" :span="12">
              账户余额
              <el-button size="mini" type="primary" round>充值金额</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="绑定手机号" :visible.sync="showChangePhone" width="30%" label-width="100px">
      <el-form :model="phoneForm" :rules="rules">
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="phoneForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="(新)手机号" prop="username">
          <el-input v-model="phoneForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" props="code">
          <el-input v-model="phoneForm.code" autocomplete="off" />
          <el-button plain type="info" @click="handleCode">{{ count > 0 ? `${count}后再试` :'获取验证码' }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="phoneLoading" @click="handleChangePhone">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="showChangePassword" width="480">
      <el-form :model="passwordForm" :rules="rules">
        <el-form-item label="手机号" label-width="80" prop="username">
          <el-input v-model="passwordForm.phone" autocomplete="off" />
        </el-form-item>
        <div class="sms">
          <el-form-item label="验证码" label-width="80" prop="code">
            <el-input v-model="passwordForm.code" autocomplete="off" />
          </el-form-item>
          <el-button plain type="info" @click="handleCode">{{ count > 0 ? `${count}后再试` :'获取验证码' }}</el-button>
        </div>
        <el-form-item label="重置密码" label-width="80" prop="password">
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
        phone: '',
        password: '',
        code: ''
      },
      phoneLoading: false,

      passwordForm: {
        phone: '',
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
    ...mapGetters(['name', 'avatar'])
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
        margin: 0 0 12px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px 0;
      }
    }
    .function {
      div {
        font-size: 18px;
        padding: 8px 16px 8px 0;
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
  .sms {
    .el-form-item {
      display: inline-block;
      width: 60%;
    }
    .el-button {
      float: right;
      height: 40px;
      width: 36%;
    }
  }
}
</style>
