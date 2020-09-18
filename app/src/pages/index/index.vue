<template>
  <div class="container">
    <navbar :fixed="true">
      <div class="navbar">
        <p>活动<span>今日还可申请5次</span></p>
      </div>
    </navbar>
    <div class="content">
      <swiper class="banners" :indicator-dots="true" indicator-color='white' indicator-active-color='#FF8E3B' previous-margin="0" next-margin="0">
        <block v-for="(item, index) in banners" :index="index" :key="index">
          <swiper-item class="banner">
            <img :src="item.img" alt="banner" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="items">
        <div v-for="(data, j) in datas" :key="j" class="col">
          <div class="item" v-for="(item, index) in data" :key="index" @click="onItem(item)">
            <div class="icon">
              <img :src="item.img" alt="img" mode="aspectFill">
              <div class="end">
                <p>报名结束</p>
              </div>
            </div>
            <div class="info">
              <h5>{{item.title}}</h5>
              <div class="row">
                <p class="light">
                价值：{{item.price || 0}}元
                </p>
              </div>
              <div class="row">
                <p class="strong">
                名额 <span>{{item.count}}</span>
                </p>
                <ul>
                  <li>悬赏</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import navbar from '@/components/navbar'
import {router} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      banners: [1, 2, 3].map(i => ({
        url: 'http://www.baidu.com',
        img: ImgUrl
      })),
      datas: [[], []],
      page: 1,
      loading: false
    }
  },

  components: {
    navbar
  },
  created () {
    // let app = getApp()
    const datas = _.head(_.flatten(_.zip(this.datas[0] || [], this.datas[1] || [])),
      (this.datas[0].length || 0) + (this.datas[1].length || 0)
    ).concat([1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, j) => ({title: (Math.random() > 0.5 ? '毛戈平故宫' : '毛戈平故宫\nlkajdskajsd') + i, img: ImgUrl})))
    this.datas = _.partition(datas, (i, j) => (j % 2 === 0))
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
    onItem () {
      router(this).push('/pages/detail/main', {id: 0})
    }
  }
}
</script>

<style scoped>
.navbar{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}
.navbar p{
  font-size: 44rpx;
  font-weight: 500;
}
.navbar p span{
  font-size: 28rpx;
  color: #C1C6CB;
  font-weight: normal;
  margin-left: 16rpx;
}
.content{
  flex: 1;
}
.banners{
  width: 750rpx;
  height: 400rpx;
}
.banner{
  width: 750rpx;
  height: 400rpx;
}
.banner img{
  width: 686rpx;
  height: 400rpx;
  border-radius: 16rpx;
  margin: 0 32rpx;
}
.items{
  display: flex;
  flex-direction: row;
  padding: 0 20rpx;
  margin: 24rpx 0;
}
.items .col{
  flex: 1;
  margin: 0 12rpx;
}
.item{
  border-radius: 16rpx;
  overflow: hidden;
}
.item .icon{
  width: 100%;
  padding-top: 100%;
  position: relative;
}
.item .icon img{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item .icon .end{
  width: 180rpx;
  height: 180rpx;
  border-radius: 90rpx;
  background-color: #00000066;
  align-items: center;
  justify-content: center;
  display: flex;
  position: absolute;
  left: 25%;
  top: 25%;
}
.item .icon .end p{
  color: white;
  font-size: 32rpx;
}
.item .info{
  padding: 16rpx 20rpx;
}
.item .info h5{
  font-size: 28rpx;
  font-weight: 400;
  line-height: 40rpx;
  max-height: 80rpx;
  color: #494C5E;
}
.item .info .row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8rpx;
  align-items: center;
}
.item .info .row .light{
  color: #7B7F8E;
  font-size: 24rpx;
  line-height: 34rpx;
}
.item .info .row .strong{
  color: #494C5E;
  font-size: 28rpx;
}
.item .info ul{
  display: flex;
  flex-direction: row;
}
.item .info ul li{
  font-size: 16rpx;
  line-height: 28rpx;
  color: #FF8E3B;
  border-radius: 4rpx;
  border: 1rpx solid #FF8E3B;
  padding: 0 8rpx;
}
</style>
