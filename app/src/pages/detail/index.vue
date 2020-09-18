<template>
  <div class="container">
    <div class="content">
      <swiper class="banners" :indicator-dots="true" indicator-color='white' indicator-active-color='#FF8E3B' previous-margin="0" next-margin="0">
        <block v-for="(item, index) in banners" :index="index" :key="index">
          <swiper-item class="banner">
            <img :src="item.img" alt="banner" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="info">
      <h5>小奥汀芝心腮红 猫和老鼠联名奶酪腮红盘正品裸妆自然橘色粉色9g</h5>
      <div class="row just">
        <span>价值 340元</span>
        <span>报名剩余7天12小时32分</span>
      </div>
      <div class="row count">
        <p>20<span>剩余名额</span></p>
        <p>200<span>申请</span></p>
      </div>
      <div class="row just channel">
        <span>报名渠道</span>
        <ul>
          <li v-for="(i, j) in channels" :key="j">
            <img :src="i.img" :alt="i.name">
          </li>
        </ul>
      </div>
      </div>
      <div class="detail">
        <div class="tab">
          <div>产品详情</div>
          <div>合作任务</div>
        </div>
        <div v-if="tab===1"></div>
        <div v-if="tab===2"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      banners: [1, 2, 3].map(i => ({
        url: 'http://www.baidu.com',
        img: ImgUrl
      })),
      datas: {},
      channels: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}],
      loading: false,
      tab: 1
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
.content{
  flex: 1;
}
.banners{
  width: 750rpx;
  height: 750rpx;
}
.banner{
  width: 750rpx;
  height: 750rpx;
}
.banner img{
  width: 750rpx;
  height: 750rpx;
}
.info{
  padding: 24rpx
}
.info h5{
  font-size: 32rpx;
  line-height: 44rpx;
  color: #494C5E;
  font-weight: 400;
}
.info .row{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.info .just{
  justify-content: space-between;
}
.info .row span{
  font-size: 24rpx;
  color: #7B7F8E;
}
.info .count p{
  color: #FF8E3B;
  font-size: 44rpx;
  font-weight: 400;
}
.info .count p span{
  color: #FF8E3B;
  font-weight: normal;
}
.info .channel span{
  font-size: 28rpx;
  color: #494C5E;
}
.info .channel ul{
  display: flex;
  flex-direction: row;
}
.info .channel ul img{
  width: 44rpx;
  height: 44rpx;
}
</style>
