<template>
  <div class="container">
    <div class="white_bg col flex pad2">
      <div class="row i-center channel">
        <img :src="channel.img" alt="img">
        <p class="middle dark blod margin-l">{{channel.name}}</p>
      </div>
      <div class="light_bg row pad margin2-t">
        <input class="flex middle dark" type="text" v-model="url" placeholder="请输入主页链接">
      </div>
      <div class="light_bg row center margin2-t shot">
        <p class="middle light">点击上传主页截图</p>
      </div>
      <p class="red small text-right margin2-t">查看示例</p>
      <h5 class="middle dark medium margin2-t">微博入驻要求</h5>
      <p class="small light margin-t">1.粉丝数≥10000</p>
      <p class="small light margin-t">2.根据达人账号综合资质，评估入驻资格，如：粉丝量、内容质量、互动真实无水分</p>
      <p class="small light margin-t">3.两个工作日内反馈申请结果</p>
      <div v-if="reason" class="light_bg pad2 reason margin2-t">
        <h6 class="middle medium">拒绝理由：</h6>
        <p class="small margin-t">{{reason}}</p>
      </div>
      <div class="flex"></div>
      <div class="btn middle blod row center" :class="{bg:vaild, red_bg:!vaild}" @click="onGo">提交审核</div>
    </div>
    <div class="pos_a" v-if="tip">
      <img src="/static/images/act_done.png" alt="done">
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import {router, uiapi} from '@/utils/index'

export default {
  data () {
    return {
      channel: {name: 'b', img: '/static/images/channel_bi.png'},
      url: '',
      image: '',
      vaild: false,
      reason: '您提交的主页链接已被达人【好新鲜的小治】所认证，请重新提交主页链接，若有疑问请联系客服微信ckgift2020'
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
    onGo () {

    }
  }
}
</script>

<style scoped>
.channel img{
  width: 64rpx;
  height: 64rpx;
}
.shot{
  height: 300rpx;
}
.btn{
  margin: 60rpx;
  height: 80rpx;
  color: white;
  border-radius: 40rpx;
}
.reason{
  min-height: 200rpx;
  color: #F25643;
}
.bg{
  background-color: #FF8E3B;
}
</style>
