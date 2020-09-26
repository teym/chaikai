<template>
  <div class="container light_bg">
    <div v-if="datas.length === 0" class="col center empty white_bg flex">
      <img src="/static/images/list_empty.png" alt="img">
      <p class="light middle">暂无悬赏明细</p>
    </div>
    <div v-else class="flex">
    <div v-for="(item, j) in datas" :key="j" class="col pad2 item margin-b white_bg">
      <div class="row just">
        <h5 class="middle medium dark">{{item.title}}</h5>
        <span class="middle medium dark">{{item.amount}}</span>
      </div>
      <p v-if="item.desc" class="dark small">{{item.desc}}</p>
      <div class="row just">
        <span class="light small">订单号：{{item.id}}</span>
        <span class="light small">{{item.date}}</span>
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
      datas: [{
        title: '悬赏发放',
        amount: '+100',
        desc: '毛戈平 故宫IP碧日良辰多用眼彩盘',
        id: '17898764567',
        date: '2020.03.01 12:10'
      },
      {
        title: '悬赏发放',
        amount: '+100',
        id: '17898764567',
        date: '2020.03.01 12:10'
      }]
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
.item div{
  margin-top: 8rpx;
}
.item p{
  margin-top: 8rpx;
}
.empty img{
  width: 480rpx;
  height: 306rpx;
}
</style>
