<template>
  <div class="container white_bg pos_r">
    <img class="pos_a bg" src="/static/images/login_bg.png" alt="bg">
    <div class="col head i-center pad2">
      <img class="logo margin2-t" src="/static/images/logo.png" alt="logo">
      <h5 class="big dark blod">拆开</h5>
      <p class="small light margin2">拆开是一个集美妆、个护、美食、探店的测评合作平台，活动报名成功即可免费带产品回家，完成任务合作，还可获得悬赏哦～</p>
    </div>
    <div class="flex col i-center">
      <button :disabled="!checked" open-type='getUserInfo' class="btn row center middle blod" @getuserinfo="onLogin">微信授权登录</button>
      <span class="middle light margin2-t cancel" @click="onCancel">取消登录</span>
    </div>
    <div class="row center pad2 bar">
      <div class="row center" @click="checked = !checked">
        <img class="check-img" v-if="checked" src="/static/images/checked.png" alt="checked"  />
        <img class="check-img" v-else src="/static/images/check.png" alt="check" />
        <p class="small light">已同意</p>
      </div>
      <p class="small light"><span class="red" @click="onPro(1)">《服务协议》</span>及<span class="red" @click="onPro(2)">《隐私政策》</span></p>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import {api, signal, router, request} from '@/utils/index'

export default {
  props: {
    embed: {
      type: Boolean
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    onLogin (e) {
      const {back} = router(this).params()
      api.login().then(r => {
        signal.emit('logined', {back})
        router(this).pop()
      })
    },
    onPro (t) {
      router(this).push('/pages/web/main', {url: request.rawConf().web + (t === 1 ? '?id=QWxLV' : '?id=W5pLA')})
    },
    onCancel (e) {
      router(this).pop()
    }
  }
}
</script>

<style scoped>
.bg {
  width: 750rpx;
  height: 458rpx;
}
.logo {
  width: 160rpx;
  height: 160rpx;
}
.btn {
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #ff8e3b;
  margin-top: 80rpx;
  width: 640rpx;
  color: white;
  border: none;
}
button.btn::after {
  border: none !important;
}
button.btn[disabled] {
  background-color: #ff8e3baa;
  color: white;
}
.cancel {
  color: #999999;
}
.bar .light {
  color: #999999;
}
.bar img {
  width: 44rpx;
  height: 44rpx;
}
</style>
