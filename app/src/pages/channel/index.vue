<template>
  <div class="container">
    <div v-if="bind.length > 0">
      <div class="light_bg pad2">
        <h5 class="middle dark blod">已入驻渠道</h5>
      </div>
      <ul class="white_bg channel">
        <li v-for="(item, i) in bind" :key="i" class="row i-center pad2">
          <img :src="item.img" :alt="item.name">
          <p class="dark middle margin-l">{{item.name}}</p>
          <span class="light small margin-l">粉丝数：{{item.fans}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
          <div class="flex"></div>
          <span class="light small" @click="onUnbind(item.name)">解绑</span>
        </li>
      </ul>
    </div>
    <div v-if="bind.length > 0">
      <div class="light_bg pad2">
        <h5 class="middle dark blod">未入驻渠道</h5>
      </div>
      <ul class="white_bg channel">
        <li v-for="(item, i) in bind" :key="i" class="row i-center pad2" @click="onGo(item.name)">
          <img :src="item.img" :alt="item.name">
          <p class="dark middle margin-l">{{item.name}}</p>
          <div class="flex"></div>
          <span class="light small">审核中</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import {router, uiapi} from '@/utils/index'

export default {
  data () {
    return {
      bind: [{name: 'b', img: '/static/images/channel_bi.png', fans: 5000}, {name: 'w', img: '/static/images/channel_wb.png', fans: 5000}],
      unbind: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}]
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
    onGo (name) {
      router(this).push('/pages/auth/main')
    },
    onUnbind () {
      const t = Math.random()
      if (t < 0.5) {
        uiapi.alert({ title: '无法解绑渠道', content: '您存在合作中的订单，请合作完成后再进行解绑' }).then(r => {

        }).catch(e => {

        })
      } else {
        uiapi.toast('解绑成功')
      }
    }
  }
}
</script>

<style scoped>
.channel img{
  width: 56rpx;
  height: 56rpx;
}
.channel .right{
  width: 32rpx;
  height: 32rpx;
}
.channel .light{
  color: #C1C6CB;
}
.channel li{
  border-bottom: 1rpx solid #F5F5F5;
}
</style>
