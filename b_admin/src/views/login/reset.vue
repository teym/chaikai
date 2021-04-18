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
            找回密码
            <router-link :to="{ path: '/login' }">返回登录</router-link>
          </h3>
        </div>

        <el-form-item class="username" prop="username">
          <span class="prefix"> <svg-icon icon-class="user" />+86 </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入手机号"
            name="username"
            type="text"
          />
        </el-form-item>

        <div class="sms">
          <el-form-item prop="code">
            <span class="prefix">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="code"
              v-model="loginForm.code"
              placeholder="请输入验证码"
              name="code"
              type="text"
            />
          </el-form-item>
          <el-button plain type="info" @click="handleCode">{{
            count > 0 ? `${count}后再试` : "获取验证码"
          }}</el-button>
        </div>

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
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-button
          type="primary"
          :loading="loading"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form>
    </login-frame>
  </div>
</template>

<script>
import LoginFrame from "./components/frame";
import { validPhone, validCode } from "@/utils/validate";
import { reset, getCode } from "@/api/user";

export default {
  name: "Login",
  components: { LoginFrame },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("错误的手机号码"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else if (value.length > 21) {
        callback(new Error("密码不能大于21位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!validCode(value)) {
        callback(new Error("验证码为6位数字"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        code: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      checked: true,
      passwordType: "password",
      loading: false,
      count: 0,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleTimer() {
      this.timer = setTimeout(() => {
        this.count -= 1;
        if (this.count > 0) {
          this.handleTimer();
        }
      }, 1000);
    },
    handleCode() {
      if (this.count > 0) return;
      if (!validPhone(this.loginForm.username)) return;
      this.count = 59;
      this.handleTimer();

      getCode(this.loginForm.username, 106).catch((e) => {
        clearTimeout(this.timer);
        this.count = 0;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          reset({
            telephone: this.loginForm.username,
            password: this.loginForm.password,
            code: this.loginForm.code,
          })
            .then((res) => {
              this.$notify({ message: "重置成功，请重新登陆" });
              this.$router.push({
                path: "/login",
              });
              this.loading = false;
            })
            .catch((e) => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
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
      .el-input {
        width: 80%;
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
    .el-form-item:focus-within {
      border: 1px solid #4a2dfd;
    }
    .username {
      .el-input {
        width: 70% !important;
      }
      .prefix {
        border-right: 1px solid #666;
        padding-right: 8px;
        color: #333;
      }
    }
    .bar {
      margin-top: -8px;
      margin-bottom: 32px;
      a {
        font-size: 14px;
        text-decoration: underline;
        color: #4a2dfd;
      }
      .right {
        float: right;
        font-size: 14px;
        color: #333;
        text-decoration: none;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #333;
      font-weight: bold;
      a {
        font-size: 14px;
        color: #1413ff;
        text-decoration: underline;
      }
    }
  }
}
</style>
