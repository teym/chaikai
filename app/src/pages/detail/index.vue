<template>
  <div class="container">
    <div class="content">
      <swiper
        class="banners"
        :indicator-dots="true"
        indicator-color="white"
        indicator-active-color="#FF8E3B"
        previous-margin="0"
        next-margin="0"
      >
        <block v-for="(item, index) in banners" :index="index" :key="index">
          <swiper-item class="banner">
            <img :src="item.img" alt="banner" mode="aspectFill" />
          </swiper-item>
        </block>
      </swiper>
      <div class="stop">报名结束</div>
      <div class="info">
        <h4>小奥汀芝心腮红 猫和老鼠联名奶酪腮红盘正品裸妆自然橘色粉色9g</h4>
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
            <li v-for="(i, j) in channels" :key="j" :style="{'z-index': 99 - j}">
              <img :src="i.img" :alt="i.name" />
            </li>
          </ul>
        </div>
        <div class="hot">
          <img src="/static/images/detail_hot.png" alt="hot">
        </div>
      </div>
      <div class="detail">
        <div class="tab">
          <div :class="{active:tab === 1}">
            <p @click="tab = 1">产品详情</p>
            <span></span>
          </div>
          <div :class="{active:tab === 2}">
            <p @click="tab = 2">合作任务</p>
            <span></span>
          </div>
        </div>
        <div class="block desc" v-if="tab===1">
          <div class="brand">
            <img :src="data.brand.logo" alt="logo" />
            <div>
              <h5>{{data.brand.title}}</h5>
              <p :class="{collapse:!expand}">{{data.brand.desc}}
                <span class="float" v-if="!expand" @click="expand=true">展开更多︾</span>
                <span v-if="expand" @click="expand=false">收起︽</span></p>
            </div>
          </div>
          <div class="guide">
            <h5>测评指引</h5>
            <ul>
              <li v-for="(line, i) in data.guideLine" :key="i">{{line}}</li>
            </ul>
          </div>
          <div class="ship">
            <h5>
              收货地限制
              <span>不支持以下地区收货</span>
            </h5>
            <p>香港特别行政区、澳门特别行政区、新疆维吾尔自治区、西藏自治区、台湾省、湖北省</p>
          </div>
          <div class="text">
            <div class="row center">
              <img src="/static/images/detail_dot_l.png" alt="dot_l" />
              <p>产品详情</p>
              <img src="/static/images/detail_dot_r.png" alt="dot_l" />
            </div>
            <div v-html="data.desc"></div>
          </div>
        </div>
        <div class="block task" v-if="tab===2">
          <div class="rule">
            <img src="/static/images/detail_tip.png" alt="tip">
          </div>
          <div class="row just line">
            <h5>合作方式</h5>
            <div class="round-btn">接受悬赏</div>
          </div>
          <div class="row just line">
            <h5>合作要求</h5>
            <div class="round-btn">200/人</div>
          </div>
          <div class="row just line">
            <h6>合作篇幅</h6>
            <p>单篇</p>
          </div>
          <div class="row just line">
            <h6>优惠信息</h6>
            <p>覆置内容₴tDx71ykFZr7₴咑幵淘tao寳或掂击炼接 https://m.tb.cn/<span>复制</span></p>
          </div>
          <div class="row just line">
            <h6>附带关键词</h6>
            <div class="round-btn gray">一周新品</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bar">
      <div>立即申请</div>
    </div>
    <div class="pop">
      <div class="pop-content">
        <h5>选择商品规格</h5>
        <div class="sku">
          <h6>name</h6>
          <ul>
            li
          </ul>
        </div>
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
      data: {
        brand: {
          title: 'abcd',
          desc: 'aksjdlkajdlaskjd\nkajslkajfkhdfksjf\nkjsdfksdjfs\nsjdfksdj',
          logo: ImgUrl
        },
        skus: [{name: '颜色', list: ['abcd', 'def', 'asfdasf']}, {name: '大小', list: ['abcd', 'def', 'asfdasf']}],
        guideLine: ['asdasasda', 'asdadads'],
        desc: '<img style="width:100%;height:auto" src="' + ImgUrl + '">'
      },
      channels: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}],
      loading: false,
      tab: 1,
      expand: false
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
.content {
  flex: 1;
  padding-bottom: 88rpx;
  background-color: #f5f5f5;
  position: relative;
}
.stop{
  position: absolute;
  width: 280rpx;
  height: 280rpx;
  border-radius: 140rpx;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 235rpx;
  top: 235rpx;
  color: white;
  font-size: 44rpx;
  font-weight: 500;
}
.banners {
  width: 750rpx;
  height: 750rpx;
}
.banner {
  width: 750rpx;
  height: 750rpx;
}
.banner img {
  width: 750rpx;
  height: 750rpx;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.just {
  justify-content: space-between;
}
.info {
  padding: 24rpx;
  background-color: white;
}
h4 {
  font-size: 32rpx;
  line-height: 44rpx;
  color: #494c5e;
  font-weight: 400;
}
h5 {
  font-size: 28rpx;
  font-weight: 500;
  color: #494c5e;
}
.info .row {
  margin: 16rpx 0 0 0;
}
.info .row span {
  font-size: 24rpx;
  color: #7b7f8e;
}
.info .count p {
  color: #ff8e3b;
  font-size: 44rpx;
  font-weight: 400;
  margin-right: 32rpx;
}
.info .count p span {
  color: #ff8e3b;
  font-weight: normal;
}
.info .channel span {
  font-size: 28rpx;
  color: #494c5e;
}
.info .channel ul {
  display: flex;
  flex-direction: row;
}
.info .channel ul img {
  width: 44rpx;
  height: 44rpx;
  margin: 0 -8rpx;
}
.info .hot {
  padding: 24rpx 0 0 0;
}
.info .hot img{
  width: 702rpx;
  height: 128rpx;
}
.detail {
  margin: 24rpx 0 0 0;
  background-color: white;
  padding-bottom: 48rpx;
}
.detail .tab {
  display: flex;
  flex-direction: row;
  border-bottom: 1rpx solid #f5f5f5;
}
.detail .tab div {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.detail .tab div p {
  font-size: 28rpx;
  color: #494c5e;
  margin: 24rpx 0;
}
.detail .tab div span {
  width: 64rpx;
  color: white;
  height: 4rpx;
}
.detail .tab .active p {
  color: #ff8e3b !important;
}
.detail .tab .active span {
  background-color: #ff8e3b !important;
}
.desc .brand {
  display: flex;
  flex-direction: row;
  margin: 24rpx;
}
.desc .brand img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background-color: #f5f5f5;
}
.desc .brand div {
  margin-left: 16rpx;
}

.desc .brand p {
  font-size: 24rpx;
  line-height: 40rpx;
  color: #7b7f8e;
  position: relative;
}
.desc .brand .collapse {
  max-height: 80rpx;
}
.desc .brand p span{
  color: #FF8E3B;
  font-size: 24rpx;
  line-height: 40rpx;
  background-color: white;
}
.desc .brand p .float{
  position: absolute;
  right: 0;
  bottom: 0;
}
.desc .guide{
  padding: 0 24rpx;
  margin: 24rpx 0;
}
.desc .guide ul {
  background-color: #F5F5F5;
  border-radius: 12rpx;
  margin-top: 24rpx;
}
.desc .guide li{
  color: #7B7F8E;
  font-size: 24rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #EBEBEB;
}
.desc .ship{
  padding: 0 24rpx;
}
.desc .ship h5 span{
  font-size: 24rpx;
  color: #C1C6CB;
  font-weight: normal;
  margin-left: 16rpx;
}
.desc .ship p{
  margin: 24rpx 0;
  font-size: 24rpx;
  color: #7B7F8E;
  line-height: 40rpx;
}
.desc .text .row{
  justify-content: center;
  margin-bottom: 16rpx;
}
.desc .text .row img{
  width: 56rpx;
  height: 32rpx;
}
.desc .text .row p{
  font-size: 28rpx;
  color: #494C5E;
  font-weight: 500;
  margin: 0 12rpx;
}
.task{
  padding: 0 24rpx;
}
.task .rule{
  padding: 24rpx 0 0 0;
}
.task .rule img{
  width: 702rpx;
  height: 128rpx;
}
.task .round-btn{
  font-size: 24rpx;
  color: #FF8E3B;
  font-weight: 500;
  background-color: #FF8E3B2E;
  height: 48rpx;
  border-radius: 24rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task .line{
  margin-top: 12rpx;
  align-items: flex-start;
}
.task .line h6{
  font-size: 24rpx;
  color: #494C5E;
}
.task .line p{
  font-size: 24rpx;
  color: #494C5E;
  font-weight: 400;
  flex: 1;
  text-align: right;
}
.task .line p span{
  color:#FF8E3B;
}
.task .line .gray{
  color: #7B7F8E;
  background-color: #C1C6CB;
}

.bar{
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  left: 0;
  bottom: 0;
  width: 750rpx;
  height: 88rpx;
}
.bar div{
  height: 80rpx;
  margin: 4rpx 58rpx;
  flex: 1;
  border-radius: 40rpx;
  background-color: #FF8E3B;
  color: white;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
