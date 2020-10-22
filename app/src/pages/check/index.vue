<template>
  <div class="container">
    <div class="light_bg flex pos-r">
      <div class="pad2-l pad2-r pad-t pad-b address margin-t white_bg" @click="chooseAddress">
        <div v-if="!address" class="empty row pad2-t pad2-b i-center">
          <img src="/static/images/address_add.png" alt="add" />
          <p class="margin-l middle dark">手动添加收货地址</p>
        </div>
        <div v-else class="row i-center">
          <img src="/static/images/address_icon.png" alt="icon" />
          <div class="flex col just pad-l pad-r">
            <div class="row just pad-b">
              <p class="middle dark medium">收货人：{{address.name}}</p>
              <p class="middle dark medium">{{address.telephone}}</p>
            </div>
            <span
              class="small light"
            >{{address.province}}{{address.city}}{{address.county}}{{address.address}}</span>
          </div>
          <img src="/static/images/arrow_right.png" alt="icon" />
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t row info">
        <img :src="data.picUrl" alt="img" />
        <div class="col just margin-l flex">
          <h5 class="middle dark medium">{{data.title}}</h5>
          <span class="small light">已选规格：{{sku.name}}</span>
        </div>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b margin-t white_bg row just i-center">
        <h5 class="middle dark medium">选择合作方式：</h5>
        <ul class="row">
          <li
            @click="type = 3"
            v-if="data.cooperationType === 3"
            :class="{red: type === 3, red_bg: type === 3, light: type !== 3, light_bg: type !== 3}"
            class="small row center pad-l pad-r round-btn"
          >免费置换</li>
          <li
            @click="type = 1"
            v-if="data.cooperationType !== 3"
            :class="{red: type === 1, red_bg: type === 1, light: type !== 1, light_bg: type !== 1}"
            class="small row center pad-l pad-r round-btn"
          >接受悬赏</li>
          <li
            @click="type = 2"
            v-if="data.cooperationType === 2"
            :class="{red: type === 2, red_bg: type === 2, light: type !== 2, light_bg: type !== 2}"
            class="small row center pad-l pad-r round-btn margin-l"
          >达人报价</li>
        </ul>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b margin-t white_bg task">
        <h5 class="middle dark blod">合作任务</h5>
        <div class="rule margin-t">
          <img src="/static/images/detail_tip.png" alt="tip" />
        </div>
        <div class="pad-b">
          <h5 class="middle dark blod">合作要求</h5>
          <div class="light_bg margin-t pad-l pad-r pad-b">
            <div class="row just pad-t">
              <p class="small normal light">合作篇幅</p>
              <div
                class="small blod light text-right flex"
              >{{data.extension.articleType > 0 ? '单篇' : '无要求'}}</div>
            </div>
            <div class="row just pad-t">
              <p class="small normal light">内容形式</p>
              <div
                class="small medium light text-right flex"
              >{{['无要求', '图文', '视频'][data.extension.contentType]}}</div>
            </div>
            <div class="row just pad-t">
              <p class="small normal light">最低字数</p>
              <div
                class="small medium light text-right flex"
              >{{['无要求', '200字', '400字'][data.extension.minWordNum]}}</div>
            </div>
            <div class="row just pad-t">
              <p class="small normal light">最低图片数</p>
              <div
                class="small medium light text-right flex"
              >{{['无要求', '6张', '9张'][data.extension.minPicNum]}}</div>
            </div>
            <div class="row just pad-t">
              <p class="small normal light">最低视频时长</p>
              <div
                class="small medium light text-right flex"
              >{{['无要求', '15秒', '30秒', '1分钟', '2分钟'][data.extension.minVideoLength]}}</div>
            </div>
            <div v-if="topics.length > 0" class="row just pad-t">
              <p class="small normal light" @click="tip=true">账号话题Ⓢ</p>
              <div class="small medium light text-right flex">
                <p v-for="(c, i) in topics" :key="i">{{c.platformName}}@{{c.nickname}}#{{c.topic}}</p>
              </div>
            </div>
            <div v-if="data.extension.discountInfo" class="row just pad-t">
              <p class="small normal light" @click="tip=true">优惠信息Ⓢ</p>
              <div class="small medium light text-right flex">
                {{data.extension.discountInfo}}
                <span class="red" @click="onCopy(data.extension.discountInfo)">复制</span>
              </div>
            </div>
            <div v-if="keywords.length > 0" class="row just pad-t">
              <p class="small normal light">附带关键词</p>
              <div class="small medium light text-right flex">
                <p v-for="(k, i) in keywords" :key="i" class="small medium light">{{k}}</p>
              </div>
            </div>
            <div v-if="data.extension.bloggerPublishTime" class="row just pad-t">
              <p class="small normal light">发布时间</p>
              <div class="small medium light text-right flex">
                {{data.extension.bloggerPublishTimeStr}}
              </div>
            </div>
            <div v-if="otherReq.length > 0" class="row just pad-t">
              <p class="small normal light">其他要求</p>
              <div class="small medium light text-right flex">
                <p v-for="(o, i) in otherReq" :key="i">{{o}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t">
        <h5 class="middle dark blod">
          合作渠道
          <span class="small light normal margin-l">承诺同步的渠道越多，通过率越高</span>
        </h5>
        <ul class="channels margin-t">
          <li v-for="(i, j) in channels" :key="j" class="row just margin-t" @click="onActive(i)">
            <div class="row i-center">
              <img class="margin-r" :src="i.img" :alt="i.platformName" />
              <p class="middle dark">{{i.platformName}}</p>
            </div>
            <img class="check-img" v-if="active[i.platformId]" src="/static/images/checked.png" alt="checked" />
            <img class="check-img" v-else src="/static/images/check.png" alt="check" />
          </li>
        </ul>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t price">
        <div v-if="type === 2">
          <h5 class="middle dark blod">报价金额</h5>
          <ul class="row margin-t">
            <li
              class="small row center pad-l pad-r round-btn margin-r"
              :class="{red: bid===1,red_bg:bid===1, dark: bid!==1,light_bg:bid!==1}"
              @click="bid=1"
            >2倍悬赏</li>
            <li
              class="small row center pad-l pad-r round-btn margin-r"
              :class="{red: bid===2,red_bg:bid===2, dark: bid!==2,light_bg:bid!==2}"
              @click="bid=2"
            >4倍悬赏</li>
            <li
              class="small row center pad-l pad-r round-btn margin-r"
              :class="{red: bid===3,red_bg:bid===3, dark: bid!==3,light_bg:bid!==3}"
              @click="bid=3"
            >6倍悬赏</li>
          </ul>
        </div>
        <div class="row just i-center margin-t">
          <h5 class="middle dark blod">押金支付方式</h5>
          <p class="small light normal margin-l">审核不通过自动退回</p>
        </div>
        <div class="row just i-center pay margin-t" @click="pay=1">
          <h6 class="middle normal dark row i-center">
            立即缴纳
            <span class="first margin-l">优先推荐</span>
          </h6>
          <img class="check-img" v-if="pay !== 1" src="/static/images/check.png" alt="check" />
          <img class="check-img" v-else src="/static/images/checked.png" alt="checked" />
        </div>
        <div class="row just i-center margin-t" @click="pay=2">
          <h6 class="middle normal dark row">报名成功后支付</h6>
          <img class="check-img" v-if="pay !== 2" src="/static/images/check.png" alt="check" />
          <img class="check-img" v-else src="/static/images/checked.png" alt="checked" />
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t">
        <h5 class="middle dark blod">填写申请理由</h5>
        <div class="pad-l pad-t pad-r input light_bg margin-t">
          <textarea v-model="text" class="middle dark normal" placeholder="表达更多合作意向，能提高通过率喔~"></textarea>
          <p class="small light normal text-right">12/200</p>
        </div>

        <div class="row just i-center bar">
          <p class="small light">
            可获得
            <span class="red big blod">{{reward}}</span>悬赏
          </p>
          <div class="btn row center" @click="onOk">提交申请</div>
        </div>
      </div>
    </div>
    <div v-if="tip" class="pop">
      <div class="pop-content bottom">
        <h6>合作要求特殊说明：</h6>
        <p>小红书：因添加优惠信息后，内容屏蔽风险较高，内容正文和评论中暂不支持添加优惠信息</p>
      </div>
      <div class="place" @click="tip=false"></div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'
import {router, api, uiapi, request, mapChannel, resetData} from '@/utils/index'

function defaultData () {
  return {
    data: {
      extension: {}
    },
    sku: {},
    channels: [],
    topics: [],
    keywords: [],
    otherReq: [],
    address: null,
    type: 1,
    price: null,
    pay: 1,
    bid: 1,
    loading: false,
    active: {},
    pop: false,
    text: ''
  }
}

export default {
  data () {
    return defaultData()
  },
  computed: {
    reward () {
      return this.data ? this.data.reward * (this.type === 2 ? parseInt(this.bid) * 2 : 1) : 0
    }
  },
  mounted () {
    this.reset()
    this.loadData()
  },
  onPullDownRefresh () {
    this.loadData()
  },
  methods: {
    reset () {
      resetData(this, defaultData())
    },
    loadData () {
      const {id, select} = router(this).params()
      // console.log('check', id, select)
      Promise.all([request.get('/bl/activity/' + id), request.get('/bl/account')]).then((rts) => {
        const data = rts[0].json.data
        const user = rts[1].json.data
        data.extension.bloggerPublishTimeStr = moment(data.extension.bloggerPublishTime).format('截止M月D日前')
        this.data = data
        const sets = _.object(user.channels.map(i => [i.platformId, i.statusCode === 3]))
        this.channels = mapChannel(data.extension.channels).map(i => Object.assign(i, {available: !!sets[i.platformId]}))
        this.active = _.object(_.map(_.filter(this.channels, i => i.available), i => ([i.platformId, i])))
        // console.log(sets, this.channels, this.active)
        this.topics = _.filter(this.channels, i => i.topic)
        this.keywords = data.extension.keywords ? data.extension.keywords.split(' ') : []
        this.otherReq = data.extension.otherReq ? data.extension.otherReq.split('+').map(i => ({'1': '产品和达人同框露脸', '2': '使用前后效果对比', '3': '提供评测原图使用权'}[i])) : []
        this.sku = data.goods.skuUnionList.find(i => i.skuIdUnion === select) || {}
        this.type = data.cooperationType === 3 ? 3 : 1
      })
      request.get('/bl/activity/' + id).then(({json: {data}}) => {
        data.extension.bloggerPublishTimeStr = moment(data.extension.bloggerPublishTime).format('截止M月D日前')
        this.data = data
        this.channels = mapChannel(data.extension.channels)
        this.topics = _.filter(this.channels, i => i.topic)
        this.keywords = data.extension.keywords ? data.extension.keywords.split(' ') : []
        this.otherReq = data.extension.otherReq ? data.extension.otherReq.split('+').map(i => ({'1': '产品和达人同框露脸', '2': '使用前后效果对比', '3': '提供评测原图使用权'}[i])) : []
        this.sku = data.goods.skuUnionList.find(i => i.skuIdUnion === select) || {}
        this.type = data.cooperationType === 3 ? 3 : 1
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    chooseAddress () {
      uiapi.chooseAddress().then(a => {
        console.log('address', a)
        this.address = a
      }).catch(e => {

      })
    },
    onActive (item) {
      if (this.active[item.platformId]) {
        this.active = _.omit(this.active, item.platformId)
      } else {
        this.active = Object.assign({}, this.active, _.object([[item.platformId, item]]))
      }
    },
    checkAddress (conf, address) {
      if (conf.length === 0) {
        return true
      }
      const isSame = (b) => {
        const p1 = address.province.replace('省', '').replace('市', '').replace('自治区', '').replace('特别行政区', '')
        const p2 = b.province.replace('省', '').replace('市', '').replace('自治区', '').replace('特别行政区', '')
        const c1 = address.city.replace('市', '').replace('区', '')
        const c2 = (b.city || '').replace('市', '').replace('区', '')
        return p1 === p2 && (!c2 || c1 === c2)
      }
      const type = conf[0].type
      // console.log(conf, address, type)
      if (type === 1) {
        return !_.some(conf, isSame)
      }
      return _.some(conf, isSame)
    },
    formatAddressConf (conf) {
      const type = conf[0].type
      return (type === 1 ? '不' : '') + '可收货地区如下：' + conf.map(i => (i.province + (i.city || ''))).join('、')
    },
    onOk () {
      if (!this.address) {
        uiapi.toast('请填写收货地址')
        return
      }
      if (_.size(this.active) <= 0) {
        uiapi.toast('请选择合作渠道')
        return
      }
      if (!this.text) {
        uiapi.toast('申请理由也很重要哦~')
        return
      }
      if (!this.checkAddress(this.data.extension.receiveAreas || [], this.address)) {
        uiapi.alert({ title: '温馨提示', content: this.formatAddressConf(this.data.extension.receiveAreas || []) }).then(r => {
          // router(this).push('/pages/address/main')
          this.chooseAddress()
        }).catch(e => {

        })
        return
      }
      const {id} = router(this).params()
      const l = uiapi.loading()
      const idsum = _.reduce(_.keys(this.active).map(i => parseInt(i)), (i, j) => i + j, 0)
      request.post('/bl/activity/order/apply', {
        activity: {id},
        applyReason: this.text,
        coopSubType: this.type,
        receiver: this.address,
        platformIdSum: idsum,
        reward: this.reward,
        skuUnion: this.sku
      }).then(r => {
        return this.pay === 1 ? request.post('/wxpay/mini', {amount: 0.3 /* this.reward */, brActivityId: id, payScene: 'BL_PAY_DEPOSIT'}).then(({json: {data}}) => {
          return api.pay(data)
        })
          .catch(e => {
            uiapi.toast(e.info)
          }) : Promise.resolve()
      })
        .then(r => {
          l()
          if (this.pay !== 1) {
            uiapi.toast('申请已提交')
          }
          router(this).replace('/pages/orders/main')
        }).catch(e => {
          uiapi.toast(e.info)
          l()
        })
      // const t = Math.random()
      // if (t < 0.4) {
      //   this.pop = true
      // } else {
      //   if (t < 0.7) {
      //     uiapi.alert({ title: '温馨提示', content: '可收货地区如下：广东省、湖北省、舟山市、宁波市、嘉兴市' }).then(r => {
      //       router(this).push('/pages/address/main')
      //     }).catch(e => {

      //     })
      //   } else {
      //     uiapi.toast('申请已提交')
      //   }
      // }
    }
  }
}
</script>

<style scoped>
.address img {
  width: 44rpx;
  height: 44rpx;
}
.info img {
  width: 208rpx;
  height: 208rpx;
}
.round-btn {
  height: 48rpx;
  border-radius: 24rpx;
}
.channels div img {
  width: 44rpx;
  height: 44rpx;
}
.task .rule img {
  width: 702rpx;
  height: 128rpx;
}
.check-img {
  width: 44rpx;
  height: 44rpx;
}
.first {
  background-color: #ff6144;
  border-radius: 8px 8px 8px 0px;
  font-size: 18rpx;
  color: white;
  padding: 4rpx 8rpx;
}
.bar {
  margin-top: 180rpx;
}
.bar .btn {
  font-size: 24rpx;
  color: white;
  font-weight: 500;
  background-color: #ff8e3b;
  height: 72rpx;
  border-radius: 36rpx;
  padding: 0 56rpx;
}
/* .block{
  background-color: white;
}
h5 {
  font-size: 28rpx;
  font-weight: 500;
  color: #494c5e;
}

.address p{
  font-size: 28rpx;
  color: #494C5E;
  margin-left: 16rpx;
}
.info {
  padding: 24rpx;
  background-color: white;
}

.info div{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
  margin-left: 16rpx;
}
.info div h5{
  font-weight: 400;
}
.info div span{
  font-size: 24rpx;
  color: #7B7F8E;
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
.pop{
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  z-index: 50;
}
.pop .place{
  flex: 1;
}
.pop-content{
  position: relative;
  border-radius: 20rpx 20rpx 0 0;
  background-color: white;
  padding: 40rpx 24rpx;
}
.pop-content .close{
  position: absolute;
  right: 16rpx;
  top: 32rpx;
  width: 48rpx;
  height: 48rpx;
}
.pop-content h5{
  font-size: 32rpx;
  color: #494C5E;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16rpx;
} */
</style>
