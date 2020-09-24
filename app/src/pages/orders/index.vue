<template>
  <div class="container light_bg">
    <div>
      <div class="tabs row white_bg pad2-l pad2-r">
        <div v-for="(tab, i) in status" :key="i" class="col i-center tab" :class="{active: i === active}" @click="active=i">
          <p class="margin2-t">{{tab}}</p>
          <div class="margin2-t"></div>
        </div>
      </div>
      <div v-if="datas.length === 0" class="col center empty white_bg flex">
        <img src="/static/images/issue_empty.png" alt="img" />
        <p class="light middle">你还没有订单呢～</p>
      </div>
      <div v-else class="flex">
        <div v-for="(item, j) in datas" :key="j" class="row pad2 item margin-b white_bg" @click="onOrder">
          <img class="logo" :src="item.img" alt="logo">
          <div class="flex col just margin-l">
            <p class="middle dark">{{item.title}}</p>
            <div class="row just i-center">
              <p class="small light">{{item.date}}</p>
              <span class="red small">待审核</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import {router, uiapi} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'

export default {
  data () {
    return {
      active: 0,
      status: ['全部', '待缴押金', '待发货', '待收货', '待测评', '已完成'],
      datas: [{
        title: '悬赏发放',
        img: ImgUrl,
        date: '2020.03.01 12:10'
      },
      {
        title: '悬赏发放',
        img: ImgUrl,
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
    loadData () {
      uiapi.toast('fail')
    },
    onOrder () {
      router(this).push('/pages/order/main')
    }
  }
}
</script>

<style scoped>
.tabs{
  justify-content: space-between;
}
.tabs .tab p{
  font-size: 26rpx;
  line-height: 32rpx;
  color: #7B7F8E;
}
.tabs .tab.active p{
  color: #FF8E3B;
  font-size: 28rpx;
}
.tabs .tab div{
  height: 2rpx;
  width: 50rpx;
  background-color: white;
}
.tabs .tab.active div{
  background-color: #FF8E3B;
}
.item .logo{
  width: 208rpx;
  height: 208rpx;
}
.empty img {
  width: 480rpx;
  height: 306rpx;
}
</style>
