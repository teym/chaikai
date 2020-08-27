<template>
  <div class="login-container">
    <login-frame>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            账号登录
            <span>成就每一个品牌</span>
          </h3>
        </div>

        <el-form-item class="username" prop="username">
          <span class="prefix">
            <svg-icon icon-class="user" /> +86
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="手机号"
            name="username"
            type="text"
          />
        </el-form-item>

        <el-form-item class="password" prop="password">
          <span class="prefix">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            @keyup.enter.native="handleLogin"
          />
          <span @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div class="bar">
          <el-checkbox v-model="checked">15天内自动登录</el-checkbox>
          <router-link :to="{path:'/resetpass'}">忘记密码</router-link>
        </div>

        <el-button
          type="primary"
          :loading="loading"
          style="width:100%;margin-bottom:20px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>

        <div class="bar">
          <router-link :to="{path:'/regist'}">注册账号</router-link>
        </div>
      </el-form>
    </login-frame>
  </div>
</template>

<script>
import LoginFrame from './components/frame'
import { validPhone } from '@/utils/validate'

export default {
  name: 'Login',
  components: { LoginFrame },
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
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      checked: true,
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$gray: #333;
$light_gray: #999;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 40px;
      color: #333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    padding: 40px;
    margin: 0 auto;
    overflow: hidden;

    .el-form-item {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #333;
      .prefix {
        padding-left: 14px;
      }
    }
    .el-form-item:focus-within {
      border: 1px solid #4a2dfd;
    }
    .username {
      .el-input {
        width: 70%;
      }
      .prefix {
        border-right: 1px solid #666;
        padding-right: 8px;
        color: #333;
      }
    }
    .password {
      .el-input {
        width: 80%;
      }
    }
    .bar{
      margin-top: -8px;
      margin-bottom: 32px;
      a{
        float: right;
        font-size: 14px;
        color: #333;
      }
    }
    .el-button {
      background-color: #4f21fe;
      color: white;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #333;
      font-weight: bold;
      span {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
