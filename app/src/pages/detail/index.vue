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
            <img :src="item" alt="banner" mode="aspectFill" />
          </swiper-item>
        </block>
      </swiper>
      <div v-if="data.statusCode > 5" class="stop">报名结束</div>
      <div class="info">
        <h4>{{data.title}}</h4>
        <div class="row just">
          <span>价值 {{data.goods.price}}元</span>
          <span>报名剩余{{leftTime}}</span>
        </div>
        <div class="row count">
          <p>
            {{data.totalNum - data.applyNum}}
            <span>剩余名额</span>
          </p>
          <p>
            {{data.applyNum}}
            <span>申请</span>
          </p>
        </div>
        <div class="row just channel">
          <span>报名渠道</span>
          <ul>
            <li v-for="(i, j) in channels" :key="j" :style="{'z-index': 9 - j}">
              <img :src="i.img" :alt="i.platformName" />
            </li>
          </ul>
        </div>
        <div class="hot">
          <img src="/static/images/detail_hot.png" alt="hot" />
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
          <div class="brand row">
            <img :src="data.goods.brandInfo.logo" alt="logo" />
            <div class="flex">
              <h5>{{data.goods.brandInfo.name}}</h5>
              <p :class="{collapse:!expand}">
                {{data.goods.brandInfo.story}}
                <span
                  class="float"
                  v-if="!expand"
                  @click="expand=true"
                >展开更多︾</span>
                <span v-if="expand" @click="expand=false">收起︽</span>
              </p>
            </div>
          </div>
          <div class="guide">
            <h5>测评指引</h5>
            <ul>
              <li v-for="(line, i) in data.guidelines" :key="i">{{line}}</li>
            </ul>
          </div>
          <div
            v-if="data.extension.receiveAreaLimit && data.extension.receiveAreas.length > 0"
            class="ship"
          >
            <h5>
              收货地限制
              <span>{{data.extension.receiveAreas[0].type === 1 ? '不' : '仅'}}支持以下地区收货</span>
            </h5>
            <p>{{receiveAreas}}</p>
          </div>
          <div class="text">
            <div class="row center">
              <img src="/static/images/detail_dot_l.png" alt="dot_l" />
              <p>产品详情</p>
              <img src="/static/images/detail_dot_r.png" alt="dot_l" />
            </div>
            <div v-html="data.goods.detail"></div>
          </div>
        </div>
        <div class="block task" v-if="tab===2">
          <div class="rule">
            <img src="/static/images/detail_tip.png" alt="tip" />
          </div>
          <div class="row just line">
            <h5>合作方式</h5>
            <div class="round-btn">{{['', '接受悬赏', '接受悬赏/博主报价', '免费置换'][data.cooperationType]}}</div>
          </div>
          <div class="row just line">
            <h5>合作要求</h5>
            <div class="round-btn">{{data.reward}}/人</div>
          </div>
          <div class="row just line">
            <h6>合作篇幅</h6>
            <p>{{data.extension.articleType > 0 ? '单篇' : '无要求'}}</p>
          </div>
          <div class="row just line">
            <h6>内容形式</h6>
            <p>{{['无要求', '图文', '视频'][data.extension.contentType]}}</p>
          </div>
          <div class="row just line">
            <h6>最低字数</h6>
            <p>{{['无要求', '200字', '400字'][data.extension.minWordNum]}}</p>
          </div>
          <div class="row just line">
            <h6>最低图片数</h6>
            <p>{{['无要求', '6张', '9张'][data.extension.minPicNum]}}</p>
          </div>
          <div class="row just line">
            <h6>最低视频时长</h6>
            <p>{{['无要求', '15秒', '30秒', '1分钟', '2分钟'][data.extension.minVideoLength]}}</p>
          </div>
          <div v-if="topics.length > 0" class="row just line">
            <h6 @click="tip=true">账号话题Ⓢ</h6>
            <div>
              <p v-for="(c, i) in topics" :key="i">{{c.platformName}}@{{c.nickname}}#{{c.topic}}</p>
            </div>
          </div>
          <div v-if="data.discountInfo" class="row just line">
            <h6 @click="tip=true">优惠信息Ⓢ</h6>
            <p>
              {{data.discountInfo}}
              <span>复制</span>
            </p>
          </div>
          <div v-if="keywords.length > 0" class="row just line i-center">
            <h6>附带关键词</h6>
            <div class="row">
              <p v-for="(k, i) in keywords" :key="i" class="round-btn gray margin-l">{{k}}</p>
            </div>
          </div>
          <div v-if="otherReq.length > 0" class="row just line i-center">
            <h6>其他要求</h6>
            <div>
              <p v-for="(o, i) in otherReq" :key="i">{{o}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bar">
      <div class="btn" @click="onOk">立即申请</div>
    </div>
    <div v-if="tip" class="pop">
      <div class="pop-content bottom">
        <h6>合作要求特殊说明：</h6>
        <p>小红书：因添加优惠信息后，内容屏蔽风险较高，内容正文和评论中暂不支持添加优惠信息</p>
      </div>
      <div class="place" @click="tip=false"></div>
    </div>
    <div v-if="pop" class="pop">
      <div class="place"></div>
      <div class="pop-content top">
        <h5>选择商品规格</h5>
        <div v-for="(sku, i) in data.goods.skuGroupList" :key="i" class="sku">
          <h6>{{sku.name}}</h6>
          <ul>
            <li
              v-for="(item, j) in sku.skuList"
              :key="j"
              :class="{sel:active[sku.id] && active[sku.id].id === item.id}"
              @click="onSelect(sku, item)"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="btn" @click="onGo">立即申请</div>
        <img @click="pop=false" class="close" src="/static/images/pop-close.png" alt="close" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import {router, uiapi, api, request, mapChannel, diffTime} from '@/utils/index'

export default {
  data () {
    return {
      data: {
        goods: {
          brandInfo: {}
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
      userChannels: new Set()
    }
  },
  computed: {
    leftTime () {
      return this.data ? diffTime(this.data.regEndTime) : ''
    },
    receiveAreas () {
      return (((this.data || {}).extension || {}).receiveAreas || []).map(i => ((i.province || '') + (i.city || ''))).join(',')
    }
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    this.loadData()
  },
  onPullDownRefresh () {
    this.loadData()
  },
  onReachBottom () {

  },
  methods: {
    loadData () {
      const {id} = router(this).params()
      request.get('/bl/activity/' + id).then(({json: {data}}) => {
        this.data = data
        this.banners = [data.picUrl]
        this.channels = mapChannel(data.extension.channels)
        this.topics = _.filter(this.channels, i => i.topic)
        this.keywords = data.extension.keywords ? data.extension.keywords.split(' ') : []
        this.otherReq = data.extension.otherReq ? data.extension.otherReq.split('+').map(i => ({'1': '产品和达人同框露脸', '2': '使用前后效果对比', '3': '提供评测原图使用权'}[i])) : []
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onSelect (sku, item) {
      this.active = Object.assign({}, this.active, _.object([[sku.id, item]]))
    },
    onOk () {
      if (!api.isLogin()) {
        router(this).push('/pages/login/main')
        return
      }
      if (this.data.applied) {
        uiapi.toast('你已申请过该活动')
        return
      }
      const {id} = router(this).params()
      const l = uiapi.loading()
      request.get('/bl/activity/qualification', {activityId: id}).then(({json: {data}}) => {
        // this.channelMatch = !!data.channels
        // this.todayNum = data.todayApplyNumRemaining
        l()
        this.pop = true
      }).catch(e => {
        l()
        uiapi.toast(e.info)
      })

      // if (!this.channelMatch) {
      //   const s = this.channels.map(i => i.platformName).join('/')
      //   uiapi.alert({ title: '温馨提示', content: this.channelError }).then(r => {
      //     router(this).push('/pages/auth/main')
      //   }).catch(e => {

      //   })
      //   return
      // }
      // if (this.channelMatch <= 0) {
      //   uiapi.toast('今日申请次数已用完')
      //   return
      // }
      // this.pop = true
    },
    onGo () {
      if (_.size(this.active) > 0 && _.size(this.active) === _.size(this.data.goods.skuGroupList)) {
        router(this).push('/pages/check/main', {id: this.data.id, select: _.map(this.active, (v) => (v.originId)).sort().join(',')})
      } else {
        uiapi.toast('请选择商品规格')
      }
    }
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
.stop {
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
.info .hot img {
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
.desc .brand p span {
  color: #ff8e3b;
  font-size: 24rpx;
  line-height: 40rpx;
  background-color: white;
}
.desc .brand p .float {
  position: absolute;
  right: 0;
  bottom: 0;
}
.desc .guide {
  padding: 0 24rpx;
  margin: 24rpx 0;
}
.desc .guide ul {
  background-color: #f5f5f5;
  border-radius: 12rpx;
  margin-top: 24rpx;
}
.desc .guide li {
  color: #7b7f8e;
  font-size: 24rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #ebebeb;
}
.desc .ship {
  padding: 0 24rpx;
}
.desc .ship h5 span {
  font-size: 24rpx;
  color: #c1c6cb;
  font-weight: normal;
  margin-left: 16rpx;
}
.desc .ship p {
  margin: 24rpx 0;
  font-size: 24rpx;
  color: #7b7f8e;
  line-height: 40rpx;
}
.desc .text .row {
  justify-content: center;
  margin-bottom: 16rpx;
}
.desc .text .row img {
  width: 56rpx;
  height: 32rpx;
}
.desc .text .row p {
  font-size: 28rpx;
  color: #494c5e;
  font-weight: 500;
  margin: 0 12rpx;
}
.task {
  padding: 0 24rpx;
}
.task .rule {
  padding: 24rpx 0 0 0;
}
.task .rule img {
  width: 702rpx;
  height: 128rpx;
}
.task .round-btn {
  font-size: 24rpx;
  color: #ff8e3b;
  font-weight: 500;
  background-color: #ff8e3b2e;
  height: 48rpx;
  border-radius: 24rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task .line {
  margin-top: 12rpx;
  align-items: flex-start;
}
.task .line h6 {
  font-size: 24rpx;
  color: #494c5e;
}
.task .line p {
  font-size: 24rpx;
  color: #494c5e;
  font-weight: 400;
  flex: 1;
  text-align: right;
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
  width: 750rpx;
  height: 96rpx;
  z-index: 10;
}
.btn {
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #ff8e3b;
  color: white;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bar .btn {
  margin: 8rpx 58rpx;
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
</style>
