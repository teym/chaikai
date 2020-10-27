<template>
  <div class="container">
    <el-radio-group v-model="select">
      <el-radio-button :label="1">预览</el-radio-button>
      <el-radio-button :label="2">商品</el-radio-button>
    </el-radio-group>
    <div style="height: 12px" />
    <div v-if="select === 1" class="content">
      <el-carousel class="banners banners1x1" :indicator-position="'none'">
        <el-carousel-item v-for="(i, j) in banners" :key="j" :index="j">
          <img
            style="width: 375px; height: 375px; object-fit: cover"
            :src="i"
            alt="banner"
          >
        </el-carousel-item>
      </el-carousel>
      <div v-if="data.statusCode > 5" class="stop">报名结束</div>
      <div class="info">
        <h4>{{ data.title }}</h4>
        <div class="row just">
          <span>价值 {{ data.goods.price }}元</span>
          <span>报名剩余{{ leftTime }}</span>
        </div>
        <div class="row count">
          <p>
            {{ data.totalNum - data.applyNum }}
            <span>剩余名额</span>
          </p>
          <p>
            {{ data.applyNum }}
            <span>申请</span>
          </p>
        </div>
        <div class="row just channel">
          <span>报名渠道</span>
          <ul>
            <li
              v-for="(i, j) in channels"
              :key="j"
              :style="{ 'z-index': 9 - j }"
            >
              <img :src="i.img" :alt="i.platformName">
            </li>
          </ul>
        </div>
      </div>
      <div class="detail">
        <div class="tab">
          <div :class="{ active: tab === 1 }">
            <p @click="tab = 1">产品详情</p>
            <span />
          </div>
          <div :class="{ active: tab === 2 }">
            <p @click="tab = 2">合作任务</p>
            <span />
          </div>
        </div>
        <div v-if="tab === 1" class="block desc">
          <div class="brand row">
            <img :src="(data.goods.brandInfo || {}).logo" alt="logo">
            <div class="flex">
              <h5>{{ (data.goods.brandInfo || {}).name }}</h5>
              <p>
                {{ (data.goods.brandInfo || {}).story }}
              </p>
            </div>
          </div>
          <div class="guide">
            <h5>测评指引</h5>
            <ul>
              <li v-for="(line, i) in data.guidelines" :key="i">{{ line }}</li>
            </ul>
          </div>
          <div
            v-if="
              data.extension.receiveAreaLimit &&
                data.extension.receiveAreas.length > 0
            "
            class="ship"
          >
            <h5>
              收货地限制
              <span>{{
                data.extension.receiveAreas[0].type === 1 ? "不" : "仅"
              }}支持以下地区收货</span>
            </h5>
            <p>{{ receiveAreas }}</p>
          </div>
          <div class="text">
            <div class="row center">
              <p>产品详情</p>
            </div>
            <div v-html="data.goods.detail" />
          </div>
        </div>
        <div v-if="tab === 2" class="block task">
          <div class="rule">
            <img src="@/assets/images/detail_tip.png" alt="tip">
          </div>
          <div class="row just line">
            <h5>合作方式</h5>
            <div class="round-btn">
              {{
                ["", "接受悬赏", "接受悬赏/达人报价", "免费置换"][
                  data.cooperationType
                ]
              }}
            </div>
          </div>
          <div class="row just line">
            <h5>合作要求</h5>
            <div class="round-btn">{{ data.blReward }}/人</div>
          </div>
          <div class="row just line">
            <h6>合作篇幅</h6>
            <p>{{ data.extension.articleType > 0 ? "单篇" : "无要求" }}</p>
          </div>
          <div class="row just line">
            <h6>内容形式</h6>
            <p>{{ ["无要求", "图文", "视频"][data.extension.contentType] }}</p>
          </div>
          <div class="row just line">
            <h6>最低字数</h6>
            <p>{{ ["无要求", "200字", "400字"][data.extension.minWordNum] }}</p>
          </div>
          <div class="row just line">
            <h6>最低图片数</h6>
            <p>{{ ["无要求", "6张", "9张"][data.extension.minPicNum] }}</p>
          </div>
          <div class="row just line">
            <h6>最低视频时长</h6>
            <p>
              {{
                ["无要求", "15秒", "30秒", "1分钟", "2分钟"][
                  data.extension.minVideoLength
                ]
              }}
            </p>
          </div>
          <div v-if="topics.length > 0" class="row just line">
            <h6 @click="tip = true">账号话题Ⓢ</h6>
            <div>
              <p v-for="(c, i) in topics" :key="i">
                {{ c.platformName }}@{{ c.nickname }}#{{ c.topic }}
              </p>
            </div>
          </div>
          <div v-if="data.discountInfo" class="row just line">
            <h6 @click="tip = true">优惠信息Ⓢ</h6>
            <p>
              {{ data.discountInfo }}
              <span>复制</span>
            </p>
          </div>
          <div v-if="keywords.length > 0" class="row just line i-center">
            <h6>附带关键词</h6>
            <div class="row">
              <p
                v-for="(k, i) in keywords"
                :key="i"
                class="round-btn gray margin-l"
              >
                {{ k }}
              </p>
            </div>
          </div>
          <div v-if="otherReq.length > 0" class="row just line i-center">
            <h6>其他要求</h6>
            <div>
              <p v-for="(o, i) in otherReq" :key="i">{{ o }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="select === 2" class="content goods">
      <div class="row">
        <h6>商品ID：</h6>
        <p>{{ data.goods.id }}</p>
      </div>
      <div class="row">
        <h6>商品品牌：</h6>
        <p>{{ data.goods.brandInfo.name }}</p>
      </div>
      <div class="row">
        <h6>商品名称：</h6>
        <p>{{ data.goods.title }}</p>
      </div>
      <div class="row">
        <h6>商品链接：</h6>
        <p>{{ data.goods.link }}</p>
      </div>
      <div class="row">
        <h6>商品价值：</h6>
        <p>{{ data.goods.price }}</p>
      </div>
      <div class="row">
        <h6>商品规格：</h6>
        <div style="flex: 1">
          <p v-for="i in data.goods.skuUnionList" :key="i.id">{{ i.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'

function diffTime(date) {
  const sec = date ? moment(date).diff(moment(), 'seconds') : 0
  const d = Math.floor(sec / (24 * 60 * 60))
  const h = Math.floor((sec - d * 24 * 60 * 60) / (60 * 60))
  const m = Math.floor((sec - d * 24 * 60 * 60 - h * 60 * 60) / 60)
  return `${d > 0 ? d + '天' : ''}${d > 0 || h > 0 ? h + '小时' : ''}${m}分`
}

const CHS = {
  1: { img: require('@/assets/images/channel_wb.png') },
  2: { img: require('@/assets/images/channel_bi.png') },
  4: { img: require('@/assets/images/channel_xhs.png') },
  8: { img: require('@/assets/images/channel_dy.png') },
  16: { img: require('@/assets/images/channel_ks.png') }
}
export function mapChannel(channels) {
  return channels.map((i) => Object.assign({}, i, CHS[i.platformId]))
}

export default {
  props: { item: { type: Object }},
  data() {
    return {
      data: {
        goods: {
          brandInfo: {},
          detail: ''
        },
        extension: {}
      },
      banners: [],
      channels: [],
      topics: [],
      keywords: [],
      otherReq: [],
      loading: false,
      tab: 1,
      expand: false,
      active: {},
      pop: false,
      tip: false,
      userChannels: new Set(),
      select: 1
    }
  },
  computed: {
    leftTime() {
      return this.data ? diffTime(this.data.regEndTime) : ''
    },
    receiveAreas() {
      return (((this.data || {}).extension || {}).receiveAreas || [])
        .map((i) => (i.province || '') + (i.city || ''))
        .join(',')
    }
  },
  mounted() {
    const data = Object.assign({}, this.item)
    data.extension = data.extension || {}
    this.data = data
    this.banners = data.goods.banners
    this.channels = mapChannel(data.extension.channels || [])
    this.topics = _.filter(this.channels, (i) => i.topic)
    this.keywords = data.extension.keywords
      ? data.extension.keywords.split(' ')
      : []
    this.otherReq = data.extension.otherReq
      ? data.extension.otherReq.split('+').map(
        (i) =>
          ({
            1: '产品和达人同框露脸',
            2: '使用前后效果对比',
            3: '提供评测原图使用权'
          }[i])
      )
      : []
    console.log(data.goods.detail)
  },
  methods: {
    onOk() {}
  }
}
</script>

<style scoped>
ul {
  padding-inline-start: 0;
}
.container {
  width: 100%;
  position: relative;
}
.just {
  justify-content: space-between;
}

.content {
  flex: 1;
  padding-bottom: 44px;
  background-color: #f5f5f5;
  position: relative;
}
.stop {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 117px;
  top: 117px;
  color: white;
  font-size: 22px;
  font-weight: 500;
}
.banners {
  width: 375px;
  height: 375px;
}
.banner {
  width: 375px;
  height: 375px;
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
  padding: 12px;
  background-color: white;
}
h4 {
  font-size: 16px;
  line-height: 22px;
  color: #494c5e;
  font-weight: 400;
  margin: 0;
  padding: 0;
}
h5 {
  font-size: 14px;
  font-weight: 500;
  color: #494c5e;
  margin: 0;
  padding: 0;
}
.info .row {
  margin: 8px 0 0 0;
}
.info .row span {
  font-size: 12px;
  color: #7b7f8e;
}
.info .count p {
  color: #ff8e3b;
  font-size: 22px;
  font-weight: 400;
  margin-right: 16px;
  margin: 0;
  padding: 0;
}
.info .count p span {
  color: #ff8e3b;
  font-weight: normal;
}
.info .channel span {
  font-size: 14px;
  color: #494c5e;
}
.info .channel ul {
  display: flex;
  flex-direction: row;
  list-style: none;
}
.info .channel ul img {
  width: 22px;
  height: 22px;
  margin: 0 -4px;
}
.info .hot {
  padding: 12px 0 0 0;
}
.info .hot img {
  width: 351px;
  height: 64px;
}
.detail {
  margin: 12px 0 0 0;
  background-color: white;
  padding-bottom: 24px;
}
.detail .tab {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #f5f5f5;
}
.detail .tab div {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.detail .tab div p {
  font-size: 14px;
  color: #494c5e;
  margin: 12px 0;
}
.detail .tab div span {
  width: 32px;
  color: white;
  height: 2px;
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
  margin: 12px;
}
.desc .brand img {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f5f5f5;
}
.desc .brand div {
  margin-left: 8px;
}

.desc .brand p {
  font-size: 12px;
  line-height: 20px;
  color: #7b7f8e;
  position: relative;
  margin: 0;
  padding: 0;
}
.desc .brand .collapse {
  max-height: 40px;
}
.desc .brand p span {
  color: #ff8e3b;
  font-size: 12px;
  line-height: 20px;
  background-color: white;
}
.desc .brand p .float {
  position: absolute;
  right: 0;
  bottom: 0;
}
.desc .guide {
  padding: 0 12px;
  margin: 12px 0;
}
.desc .guide ul {
  background-color: #f5f5f5;
  border-radius: 6px;
  margin-top: 12px;
  list-style: none;
}
.desc .guide li {
  color: #7b7f8e;
  font-size: 12px;
  padding: 10px;
  border-bottom: 1px solid #ebebeb;
}
.desc .guide li:last-of-type {
  border-bottom: none;
}
.desc .ship {
  padding: 0 12px;
}
.desc .ship h5 span {
  font-size: 12px;
  color: #c1c6cb;
  font-weight: normal;
  margin-left: 8px;
}
.desc .ship p {
  margin: 12px 0;
  font-size: 12px;
  color: #7b7f8e;
  line-height: 20px;
}
.desc .text .row {
  justify-content: center;
  margin-bottom: 8px;
}
.desc .text .row img {
  width: 28px;
  height: 16px;
}
.desc .text .row p {
  font-size: 14px;
  color: #494c5e;
  font-weight: 500;
  margin: 0 6px;
}
.task {
  padding: 0 12px;
}
.task .rule {
  padding: 12px 0 0 0;
}
.task .rule img {
  width: 351px;
  height: 64px;
}
.task .round-btn {
  font-size: 12px;
  color: #ff8e3b;
  font-weight: 500;
  background-color: #ff8e3b2e;
  height: 24px;
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task .line {
  margin-top: 6px;
  align-items: flex-start;
}
.task .line h6 {
  font-size: 12px;
  color: #494c5e;
  margin: 0;
  padding: 0;
}
.task .line p {
  font-size: 12px;
  color: #494c5e;
  font-weight: 400;
  flex: 1;
  text-align: right;
  margin: 0;
}
.task .line p span {
  color: #ff8e3b;
}
.task .line .gray {
  color: #7b7f8e;
  background-color: #c1c6cb;
}

.bar {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  left: 0;
  bottom: 0;
  width: 375px;
  height: 48px;
  z-index: 10;
}
.btn {
  height: 40px;
  border-radius: 20px;
  background-color: #ff8e3b;
  color: white;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bar .btn {
  margin: 4px 29px;
  flex: 1;
}
.pop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  z-index: 50;
}
.pop .place {
  flex: 1;
}
.pop-content {
  position: relative;
  background-color: white;
  padding: 40rpx 24rpx;
}
.pop-content.top {
  border-radius: 20rpx 20rpx 0 0;
}
.pop-content.bottom {
  border-radius: 0 0 20rpx 20rpx;
}
.pop-content .close {
  position: absolute;
  right: 16rpx;
  top: 32rpx;
  width: 48rpx;
  height: 48rpx;
}
.pop-content h5 {
  font-size: 32rpx;
  color: #494c5e;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16rpx;
}
.pop-content .sku {
  margin-top: 16rpx;
}
.pop-content h6 {
  font-size: 28rpx;
  color: #494c5e;
  font-weight: 400;
}
.pop-content p {
  font-size: 24rpx;
  line-height: 40rpx;
  color: #7b7f8e;
}
.pop-content .sku ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.pop-content .sku li {
  background-color: #f2f2f2;
  font-size: 24rpx;
  color: #494c5e;
  font-weight: normal;
  margin: 8rpx 16rpx 0 0;
  height: 48rpx;
  border-radius: 24rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pop-content .sku li.sel {
  background-color: #ff8e3b44;
  color: #ff8e3b;
}
.pop-content .btn {
  margin: 200rpx 32rpx 24rpx 32rpx;
}

.goods {
  padding: 12px;
}
.goods .row {
  align-items: flex-start;
  margin-bottom: 12px;
}
.goods .row h6 {
  width: 64px;
  margin: 0;
  padding: 0;
}
.goods .row p {
  flex: 1;
  margin: 0;
  padding: 0;
}
</style>
<style>
.banners1x1 .el-carousel__container {
  height: 375px;
}
</style>
