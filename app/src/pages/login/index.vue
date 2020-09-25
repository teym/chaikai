<template>
  <div class="container white_bg pos_r">
    <img class="pos_a bg" src="/static/images/login_bg.png" alt="bg">
    <div class="col head i-center pad2">
      <img class="logo margin2-t" src="/static/images/logo.png" alt="logo">
      <h5 class="big dark blod">拆开</h5>
      <p class="small light margin2">拆开是一个集美妆、个护、美食、探店的测评合作平台，活动报名成功即可免费带产品回家，完成任务合作，还可获得悬赏哦～</p>
    </div>
    <div class="flex col i-center">
      <button open-type='getUserInfo' class="btn row center middle blod" @getuserinfo="onLogin">微信授权登录</button>
      <span class="middle light margin2-t cancel">取消登录</span>
    </div>
    <div class="row center pad2 bar">
      <p class="small light">登录代表已同意<span class="red">《拆开服务协议及免责声明》</span></p>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import {api, signal, router} from '@/utils/index'

export default {
  data () {
    return {
    }
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
    onLogin (e) {
      api.login().then(r => {
        signal.emit('logined')
        router(this).pop()
      })
    }
  }
}
</script>

<style scoped>
.bg{
  width: 750rpx;
  height: 458rpx;
}
.logo {
  width: 160rpx;
  height: 160rpx;
}
.btn{
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #FF8E3B;
  margin-top: 80rpx;
  width: 640rpx;
  color: white;
}
.cancel{
  color: #999999;
}
.bar .light{
  color: #999999;
}
</style>
