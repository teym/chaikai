<template>
  <div class="container light_bg">
    <div class="white_bg pad2 row">
      <div class="flex col c-center margin2-l margin2-r">
        <h5 class="big light blod">待确认</h5>
        <p class="small light margin-t red">品牌确认修改还剩3天0时0分，超时将自动确认</p>
      </div>
      <img class="state margin2" src="/static/images/issue_status_1.png" alt="status" />
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">投诉详情</h5>
      <div class="row margin-t">
        <p class="small light">工单编号：</p>
        <p class="small light flex">328849095</p>
      </div>
      <div class="row margin-t">
        <p class="small light">投诉时间：</p>
        <p class="small light flex">2020-08-26 12:34:34</p>
      </div>
      <div class="row margin-t">
        <p class="small light">投诉理由：</p>
        <div>
          <p class="small light flex margin-b">1.未按申请理由发布测评</p>
          <p class="small light flex margin-b">2.没有拆包使用</p>
          <p class="small light flex margin-b">3.产品使用方法错误</p>
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">投诉测评</h5>
      <div v-for="(item, i) in channels" :key="i" class="row just i-center margin-t">
        <div class="row i-center">
          <img class="icon" :src="item.img" :alt="item.name" />
          <p class="small light margin-l">正式测评</p>
        </div>
        <div class="row i-center">
          <p class="small light">2020.08.04</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">修改测评</h5>
      <div v-for="(item, i) in channels" :key="i" class="row just i-center margin-t">
        <div class="row i-center">
          <img class="icon" :src="item.img" :alt="item.name" />
          <p class="small light margin-l">正式测评</p>
        </div>
        <div class="row i-center">
          <p class="small light">2020.08.04</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import {router, uiapi} from '@/utils/index'

export default {
  data () {
    return {
      data: {

      },
      channels: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}]
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
  }
}
</script>

<style scoped>
.state {
  width: 188rpx;
  height: 146rpx;
}
.icon {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
</style>
