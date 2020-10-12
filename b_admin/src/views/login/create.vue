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
            账号注册
            <span>成就每一个品牌</span>
          </h3>
        </div>

        <el-form-item prop="name">
          <span class="prefix">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="name"
            v-model="loginForm.name"
            placeholder="请输入公司名称"
            name="name"
            type="text"
          />
        </el-form-item>

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
        <div class="bar">
          <el-checkbox v-model="checked">已阅读并同意</el-checkbox>
          <a>《品牌入住协议》</a>
          <router-link class="right" :to="{ path: '/login' }"
            >有账号，去登陆</router-link
          >
        </div>

        <el-button
          type="primary"
          :loading="loading"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >注册</el-button
        >
      </el-form>
    </login-frame>
  </div>
</template>

<script>
import LoginFrame from "./components/frame";
import { validPhone, validCode } from "@/utils/validate";
import { getCode } from "@/api/user";

export default {
  name: "Login",
  components: { LoginFrame },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value.length > 0) {
        callback(new Error("公司名不能为空"));
      } else {
        callback();
      }
    };
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
        name: "",
        username: "",
        code: "",
        password: "",
      },
      loginRules: {
        name: [{ required: true, trigger: "blur", validator: validateName }],
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      checked: false,
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined,
      count: 0,
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
  mounted() {
    if (this.loginForm.name === "") {
      this.$refs.name.focus();
    } else if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    clearTimeout(this.timer);
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

      getCode(this.loginForm.username, 101);
      // .catch((e) => {
      //   this.$notify({ message: "发送失败，请稍后再试" });
      // });
    },
    handleLogin() {
      if (!this.checked) {
        this.$message({
          message: "请先阅读并同意《品牌入住协议》",
          type: "error",
        });
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/regist", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
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
      span {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
