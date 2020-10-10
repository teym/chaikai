<template>
  <div class="login-container">
    <p>sso</p>
    <p>{{ code }}</p>
  </div>
</template>

<script>
// import LoginFrame from './components/frame'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      code: ''
    }
  },
  mounted() {
    this.code = this.$route.query.code
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
