<template>
  <div class="container light_bg">
    <div v-if="datas.length === 0" class="col center empty white_bg flex">
      <img src="/static/images/issue_empty.png" alt="img" />
      <p class="light middle">暂无问题订单</p>
    </div>
    <div v-else class="flex">
      <div v-for="(item, j) in datas" :key="j" class="col pad2 item margin-b white_bg">
        <div class="row">
          <img :src="item.img" alt="img" class="logo" />
          <h5 class="middle medium dark flex margin-l">{{item.title}}</h5>
        </div>
        <div class="col margin-t">
          <div class="row just i-center">
            <p class="middle light">
              测评投诉
              <span class="small light">{{item.date}}</span>
            </p>
            <div class="red middle row i-center">
              待修改
              <img src="/static/images/arrow_right.png" alt="right" class="right" />
            </div>
          </div>
          <div class="row just i-center">
            <p class="middle light">
              测评投诉
              <span class="small light">{{item.date}}</span>
            </p>
            <div class="light middle row i-center">
              已完结
              <img src="/static/images/arrow_right.png" alt="right" class="right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import {router, uiapi} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'

export default {
  data () {
    return {
      datas: [{
        img: ImgUrl,
        title: '毛戈平 故宫IP碧日良辰多用眼彩盘',
        date: '2020.03.01'
      }, {
        img: ImgUrl,
        title: '毛戈平 故宫IP碧日良辰多用眼彩盘',
        date: '2020.03.01'
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
.empty img {
  width: 480rpx;
  height: 306rpx;
}
.item .logo{
  width: 208rpx;
  height: 208rpx;
}
.item .right{
  width: 44rpx;
  height: 44rpx;
}
</style>
