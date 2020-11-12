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
      <div v-if="data && !valide" class="stop">报名结束</div>
      <div class="info">
        <h4>{{data.title}}</h4>
        <div class="row just">
          <span>价值 {{data.goods.price}}元</span>
          <span>{{leftTime}}</span>
        </div>
        <div class="row count">
          <p>
            {{data.remainingNum}}
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
        <div class="hot" v-if="hot" @click="onHot(hot)">
          <img :src="hot.url" alt="hot" />
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
                >展开更多<img src="/static/images/detail_more.png" alt="more">
                </span>
                <span v-if="expand" @click="expand=false">收起<img src="/static/images/detail_less.png" alt="more"></span>
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
          <div class="rule" @click="onRule">
            <img src="/static/images/detail_tip.png" alt="tip" />
          </div>
          <div class="row just line">
            <h5>合作方式</h5>
            <div class="round-btn">{{['', '接受悬赏', '接受悬赏/达人报价', '免费置换'][data.cooperationType]}}</div>
          </div>
          <div v-if="data.cooperationType !== 3">
          <div class="row just line">
            <h5>合作要求</h5>
            <div class="round-btn">{{data.blReward}}/人</div>
          </div>
          <div class="row just line">
            <h6>合作篇幅</h6>
            <p>{{data.extension.articleType > 0 ? '单篇' : '无要求'}}</p>
          </div>
          <div class="row just line">
            <h6>内容形式</h6>
            <p>{{['无要求', '图文', '视频'][data.extension.contentType]}}</p>
          </div>
          <div class="row just line" v-if="data.extension.minWordNum > 0">
            <h6>最低字数</h6>
            <p>{{['无要求', '200字', '400字'][data.extension.minWordNum]}}</p>
          </div>
          <div class="row just line" v-if="data.extension.minPicNum > 0">
            <h6>最低图片数</h6>
            <p>{{['无要求', '6张', '9张'][data.extension.minPicNum]}}</p>
          </div>
          <div class="row just line" v-if="data.extension.minVideoLength > 0">
            <h6>最低视频时长</h6>
            <p>{{['无要求', '15秒', '30秒', '1分钟', '2分钟'][data.extension.minVideoLength]}}</p>
          </div>
          <div v-if="topics.length > 0" class="row just line">
            <h6>账号话题</h6>
            <div>
              <p v-for="(c, i) in topics" :key="i">{{c.platformName}}@{{c.nickname}}#{{c.topic}}</p>
            </div>
          </div>
          <div v-if="data.extension.discountInfo" class="row just line">
            <h6 @click="tip=true">优惠信息<img src="/static/images/detail_mark.png" class="tip_mark"/></h6>
            <p>
              {{data.extension.discountInfo}}
              <span @click="onCopy(data.extension.discountInfo)">复制</span>
            </p>
          </div>
          <div v-if="keywords.length > 0" class="row just line i-center">
            <h6>附带关键词</h6>
            <div class="row">
              <a v-for="(k, i) in keywords" :key="i" class="round-btn gray margin-l">{{k}}</a>
            </div>
          </div>
          <div v-if="data.extension.bloggerPublishTime" class="row just line">
            <h6>发布时间</h6>
            <p>
              {{data.extension.bloggerPublishTimeStr}}
            </p>
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
    </div>
    <bar background='#FFFFFF'>
      <div class="bar">
        <div class="btn" :class="{disabled: data.applied || !valide}" @click="onOk">{{data.applied ? '已申请' : (!valide ? '报名结束' :'立即申请')}}</div>
      </div>
    </bar>
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
import moment from 'moment'
import bar from '@/components/bar'
import {router, uiapi, api, request, mapChannel, diffTime, resetData} from '@/utils/index'

function defaultData () {
  return {
    data: {
      goods: {
        brandInfo: {},
        price: 0
      },
      extension: {},
      totalNum: 0,
      applyNum: 0
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
    hot: null,
    userChannels: new Set()
  }
}

export default {
  components: {
    bar
  },
  data () {
    return defaultData()
  },
  computed: {
    valide () {
      return this.data && (this.data.statusCode < 6 && this.data.remainingNum > 0 && moment(this.data.regEndTime).isAfter(new Date()))
    },
    leftTime () {
      return this.valide ? '报名剩余' + diffTime(this.data.regEndTime, '') : '报名已结束'
    },
    receiveAreas () {
      return (((this.data || {}).extension || {}).receiveAreas || []).map(i => ((i.province || '') + (i.city || ''))).join(',')
    }
  },
  mounted () {
    this.reset()
    this.loadData()
  },
  onShow () {
    this.reset()
    this.loadData()
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData())
  },
  onShareAppMessage () {
    return {
      title: this.data.title,
      path: `/pages/detail/main?id=${this.data.id}`,
      imageUrl: this.data.picUrl
    }
  },
  methods: {
    reset () {
      resetData(this, defaultData())
    },
    param () {
      const {id, scene} = router(this).params()
      if (id) {
        return {id}
      }
      return {id: scene}
    },
    loadData () {
      const {id} = this.param()
      request.get('/banner/list', {page: 1, size: 1, type: 2, valid: true, brActivityId: id}).then(({json: {data}}) => {
        this.hot = data[0]
      }).catch(e => {
        console.log(e)
      })
      return request.get('/bl/activity', {id}).then(({json: {data}}) => {
        if (!data.goods.brandInfo) {
          data.goods.brandInfo = {}
        }
        data.statusCode = (moment(data.regEndTime).isAfter(new Date()) && data.remainingNum > 0) ? data.statusCode : 6
        data.extension.bloggerPublishTimeStr = moment(data.extension.bloggerPublishTime).format('截止M月D日前')
        this.data = data
        this.banners = data.goods.banners || [data.picUrl]
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
      if (!this.valide || this.data.applied) {
        return
      }
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
        l()
        this.pop = true
      }).catch(e => {
        l()
        if (e.code === 200009) {
          uiapi.alert({ title: '温馨提示', content: e.info, confirmText: '去认证', confirmColor: '#ff8e3b' }).then(r => {
            router(this).push('/pages/channel/main')
          })
        } else {
          uiapi.toast(e.info)
        }
      })
    },
    onGo () {
      if (_.size(this.active) > 0 && _.size(this.active) === _.size(this.data.goods.skuGroupList)) {
        router(this).push('/pages/check/main', {id: this.data.id, select: _.map(this.active, (v) => (v.originId)).sort().join(',')})
      } else {
        uiapi.toast('请选择商品规格')
      }
    },
    onRule () {
      router(this).push('/pages/web/main', {url: 'https://mp.weixin.qq.com/s/yPXWeSNE_vZx5WCiqOjqtQ'})
    },
    onHot (item) {
      if (!item) {
        return
      }
      if (item.linkType === 1) {
        const [page, query] = item.link.split('?')
        const params = query ? _.object(query.split('&').map(i => i.split('=').map(j => decodeURIComponent(j)))) : {}
        router(this).push(page, params)
      } else {
        router(this).push('/pages/web/main', {url: item.link})
      }
    },
    onCopy (str) {
      api.copy(str).then(r => {
        uiapi.toast('复制成功')
      })
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
  border-radius: 22rpx;
  background-color: white;
  margin: 0 -8rpx;
  border: 6rpx solid white;
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
  overflow: hidden;
}
.desc .brand p span {
  color: #ff8e3b;
  font-size: 24rpx;
  line-height: 40rpx;
  background-color: white;
}
.desc .brand p span img{
  width: 20rpx;
  height: 20rpx;
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
  border-bottom: 1rpx dashed #ebebeb;
}
.desc .guide li:nth-last-of-type(1) {
  border-bottom: none;
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
  font-weight: 400;
  background-color: rgba(255, 142, 59, 0.2);
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
.task .line h6 img{
  width: 24rpx;
  height: 24rpx;
}
.task .line p {
  font-size: 24rpx;
  line-height: 40rpx;
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
  background-color: #ECEDEF;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 750rpx;
  height: 96rpx;
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
.btn.disabled {
  background-color: #ff8e3b99;
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
