<template>
  <div class="container">
    <div class="light_bg flex pos-r">
      <div
        class="pad2-l pad2-r pad-t pad-b address margin-t white_bg"
        @click="chooseAddress"
      >
        <div v-if="!address" class="empty row pad2-t pad2-b i-center">
          <img src="/static/images/address_add.png" alt="add" />
          <p class="margin-l middle dark">手动添加收货地址</p>
        </div>
        <div v-else class="row i-center">
          <img src="/static/images/address_icon.png" alt="icon" />
          <div class="flex col just pad-l pad-r">
            <div class="row just pad-b">
              <p class="middle dark medium">收货人：{{ address.name }}</p>
              <p class="middle dark medium">{{ address.telephone }}</p>
            </div>
            <span class="small light"
              >{{ address.province }}{{ address.city }}{{ address.county
              }}{{ address.address }}</span
            >
          </div>
          <img src="/static/images/arrow_right.png" alt="icon" />
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t row info">
        <img :src="data.picUrl" alt="img" />
        <div class="col just margin-l flex">
          <h5 class="middle dark medium">{{ data.title }}</h5>
          <span class="small light">已选规格：{{ sku.name }}</span>
        </div>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b margin-t white_bg task">
        <h5 class="middle dark blod">合作任务</h5>
        <div class="rule margin-t" @click="onRule">
          <img src="/static/images/detail_tip.png" alt="tip" />
        </div>
        <div class="pad-b" v-if="data.cooperationType < 3">
          <h5 class="middle dark blod">合作要求</h5>
          <div class="light_bg margin-t pad-l pad-r pad-b">
            <div v-if="data.extension.articleType > 0" class="row just pad-t">
              <p class="small normal light">合作篇幅</p>
              <div class="small blod light text-right flex">
                {{ data.extension.articleType > 0 ? "单篇" : "无要求" }}
              </div>
            </div>
            <div v-if="data.extension.contentType > 0" class="row just pad-t">
              <p class="small normal light">内容形式</p>
              <div class="small blod light text-right flex">
                {{ ["无要求", "图文", "视频"][data.extension.contentType] }}
              </div>
            </div>
            <div v-if="data.extension.minWordNum > 0" class="row just pad-t">
              <p class="small normal light">最低字数</p>
              <div class="small blod light text-right flex">
                {{ ["无要求", "200字", "400字"][data.extension.minWordNum] }}
              </div>
            </div>
            <div v-if="data.extension.minPicNum > 0" class="row just pad-t">
              <p class="small normal light">最低图片数</p>
              <div class="small blod light text-right flex">
                {{ ["无要求", "6张", "9张"][data.extension.minPicNum] }}
              </div>
            </div>
            <div
              v-if="data.extension.minVideoLength > 0"
              class="row just pad-t"
            >
              <p class="small normal light">最低视频时长</p>
              <div class="small blod light text-right flex">
                {{
                  ["无要求", "15秒", "30秒", "1分钟", "2分钟"][
                    data.extension.minVideoLength
                  ]
                }}
              </div>
            </div>
            <div v-if="topics.length > 0" class="row just pad-t">
              <p class="small normal light">账号话题</p>
              <div class="small blod light text-right flex">
                <p v-for="(c, i) in topics" :key="i">
                  {{ c.platformName }}@{{ c.nickname }}#{{ c.topic }}
                </p>
              </div>
            </div>
            <div v-if="data.extension.discountInfo" class="row just pad-t">
              <p class="small normal light" @click="tip = true">
                优惠信息<img
                  src="/static/images/detail_mark.png"
                  style="width: 24rpx; height: 24rpx"
                />
              </p>
              <div class="small blod light text-right flex">
                {{ data.extension.discountInfo }}
                <span
                  class="red normal"
                  @click="onCopy(data.extension.discountInfo)"
                  >复制</span
                >
              </div>
            </div>
            <div v-if="keywords.length > 0" class="row just pad-t">
              <p class="small normal light">附带关键词</p>
              <div class="small medium light text-right flex">
                <p
                  v-for="(k, i) in keywords"
                  :key="i"
                  class="small medium light"
                >
                  {{ k }}
                </p>
              </div>
            </div>
            <div
              v-if="data.extension.bloggerPublishTime"
              class="row just pad-t"
            >
              <p class="small normal light">发布时间</p>
              <div class="small blod light text-right flex">
                {{ data.extension.bloggerPublishTimeStr }}
              </div>
            </div>
            <div v-if="otherReq.length > 0" class="row just pad-t">
              <p class="small normal light">其他要求</p>
              <div class="small blod light text-right flex">
                <p v-for="(o, i) in otherReq" :key="i">{{ o }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t">
        <h5 class="middle dark blod">
          合作渠道
          <span class="small light normal margin-l"
            >承诺同步的渠道越多，通过率越高</span
          >
        </h5>
        <ul class="channels margin-t">
          <li
            v-for="(i, j) in channels"
            :key="j"
            class="row just margin-t"
            @click="onActive(i)"
          >
            <div class="row i-center">
              <img class="margin-r" :src="i.img" :alt="i.platformName" />
              <p class="middle dark">{{ i.platformName }}</p>
            </div>
            <img
              class="check-img"
              v-if="active[i.platformId]"
              src="/static/images/checked.png"
              alt="checked"
            />
            <img
              class="check-img"
              v-else
              src="/static/images/check.png"
              alt="check"
            />
          </li>
        </ul>
      </div>
      <div
        class="pad2-l pad2-r pad-t pad-b margin-t white_bg row just i-center"
      >
        <h5 class="middle dark blod">选择合作方式</h5>
        <ul class="row">
          <li
            @click="onType(3)"
            v-if="data.cooperationType >= 3"
            :class="{
              red: type === 3,
              red_bg: type === 3,
              light: type !== 3,
              light_bg: type !== 3,
            }"
            class="small row center pad-l pad-r round-btn"
          >
            免费置换
          </li>
          <li
            @click="onType(1)"
            v-if="data.cooperationType < 3"
            :class="{
              red: type === 1,
              red_bg: type === 1,
              light: type !== 1,
              light_bg: type !== 1,
            }"
            class="small row center pad-l pad-r round-btn"
          >
            接受悬赏
          </li>
          <li
            @click="onType(2)"
            v-if="data.cooperationType === 2 || data.cooperationType === 4"
            :class="{
              red: type === 2,
              red_bg: type === 2,
              light: type !== 2,
              light_bg: type !== 2,
            }"
            class="small row center pad-l pad-r round-btn margin-l"
          >
            达人报价
          </li>
        </ul>
      </div>
      <div
        v-if="type === 2"
        class="pad2-l pad2-r pad-t pad-b white_bg margin-t price"
      >
        <div class="row i-center">
          <h5 class="middle dark blod">报价金额</h5>
          <div class="flex row i-center small dark inputline" :class="{error:inputerror}">
            <input v-model="bid" type="text" placeholder="请输入报价金额" />悬赏
          </div>
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad2-b white_bg margin-t">
        <h5 class="middle dark blod">填写申请理由</h5>
        <div class="pad-l pad-t pad-r input light_bg margin-t textinput">
          <textarea
            v-model="text"
            maxlength="200"
            class="middle dark normal"
            placeholder="表达更多合作意向，能提高通过率喔~"
          ></textarea>
          <p class="small light normal text-right">{{ textLen }}/200</p>
        </div>
      </div>
    </div>
    <bar background="#FFFFFF">
      <div class="row just i-center bar">
        <p class="small light" v-if="type !== 3">
          可获得
          <span class="red big blod">{{ blReward }}</span
          >悬赏
        </p>
        <p class="small light" v-else>
          免费置换无悬赏
        </p>
        <div class="btn row center" @click="onOk">提交申请</div>
      </div>
    </bar>
    <div v-if="tip" class="pop">
      <div class="pop-content bottom">
        <h6>合作要求特殊说明：</h6>
        <p>
          小红书：因添加优惠信息后，内容屏蔽风险较高，内容正文和评论中暂不支持添加优惠信息
        </p>
      </div>
      <div class="place" @click="tip = false"></div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'
import bar from '@/components/bar'
import {
  router,
  api,
  uiapi,
  request,
  mapChannel,
  resetData,
  checkAddress,
  formatAddressConf
} from '@/utils/index'

function defaultData () {
  return {
    user: {
      channels: []
    },
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
    bid: '',
    loading: false,
    active: {},
    tip: false,
    text: '',
    inputerror: false
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
    textLen () {
      return Math.min(200, this.text.length)
    },
    blReward () {
      return this.data
        ? this.type === 2
          ? parseInt(this.bid) || 0
          : this.data.blReward
        : 0
    },
    reward () {
      return this.data
        ? this.type === 2
          ? parseInt(this.bid) || 0
          : this.data.blReward
        : 0
    },
    maxReward () {
      const max = _.max(_.filter(this.user.channels, i => !!this.active[i.platformId]), (i) => parseInt(i.fansCount) || 0)
      if (max) {
        const table = {
          1: {
            list: [
              [20000, 500],
              [50000, 1000],
              [100000, 5000],
              [1000000, 10000],
              [5000000, 50000]
            ],
            max: 150000
          },
          2: {
            list: [
              [10000, 3000],
              [50000, 10000],
              [100000, 30000],
              [1000000, 50000],
              [5000000, 100000]
            ],
            max: 200000
          },
          4: {
            list: [
              [20000, 500],
              [30000, 1000],
              [40000, 2000],
              [50000, 4000],
              [350000, 20000]
            ],
            max: 100000
          },
          8: {
            list: [
              [20000, 2000],
              [50000, 8000],
              [100000, 10000],
              [1000000, 20000],
              [5000000, 50000]
            ],
            max: 150000
          },
          16: {
            list: [
              [20000, 2000],
              [50000, 8000],
              [100000, 10000],
              [1000000, 20000],
              [5000000, 50000]
            ],
            max: 150000
          }
        }
        const s = table[parseInt(max.platformId)]
        const count = parseInt(max.fansCount)
        if (s) {
          for (let index = 0; index < s.list.length; index++) {
            const element = s.list[index]
            if (count < element[0]) {
              return element[1]
            }
          }
          return s.max
        }
      }
      return 0
    }
  },
  mounted () {
    this.reset()
    this.loadData()
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData())
  },
  methods: {
    reset () {
      resetData(this, defaultData())
    },
    loadData () {
      const { id, select } = router(this).params()
      // console.log('check', id, select)
      return Promise.all([
        request.get('/bl/activity', { id }),
        request.get('/bl/account')
      ]).then((rts) => {
        const data = rts[0].json.data
        const user = rts[1].json.data
        data.extension.bloggerPublishTimeStr = moment(
          data.extension.bloggerPublishTime
        ).format('截止M月D日前')
        this.user = user
        this.data = data
        const sets = _.object(
          user.channels.map((i) => [i.platformId, i.statusCode === 3])
        )
        this.channels = mapChannel(data.extension.channels)
          .map((i) => Object.assign(i, { available: !!sets[i.platformId] }))
          .filter((i) => i.available)
        this.active = _.object(
          _.map(
            _.filter(this.channels, (i) => i.available),
            (i) => [i.platformId, i]
          )
        )
        // console.log(sets, this.channels, this.active)
        this.topics = _.filter(this.channels, (i) => i.topic)
        this.keywords = data.extension.keywords
          ? data.extension.keywords.split(' ')
          : []
        this.otherReq = data.extension.otherReq
          ? data.extension.otherReq
            .split('+')
            .map(
              (i) =>
                ({
                  1: '产品和达人同框露脸',
                  2: '使用前后效果对比',
                  3: '提供评测原图使用权'
                }[i])
            )
          : []
        this.sku =
          data.goods.skuUnionList.find((i) => i.skuIdUnion === select) || {}
        this.type = data.cooperationType < 3 ? 1 : 3
      })
    },
    chooseAddress () {
      uiapi
        .chooseAddress()
        .then((a) => {
          console.log('address', a)
          this.address = a
        })
        .catch((e) => {})
    },
    onActive (item) {
      if (!item.available) {
        return uiapi.toast('你还未认证该渠道')
      }
      if (this.active[item.platformId]) {
        this.active = _.omit(this.active, item.platformId)
      } else {
        this.active = Object.assign(
          {},
          this.active,
          _.object([[item.platformId, item]])
        )
      }
    },
    onType (t) {
      this.type = t
    },
    onRule () {
      router(this).push('/pages/web/main', {
        url: request.rawConf().web + '?id=rxbeb'
      })
    },
    onGuide () {
      router(this).push('/pages/web/main', {
        url: request.rawConf().web + '?id=zwz06'
      })
    },
    createOrder (check) {
      const { id } = router(this).params()
      const idsum = _.reduce(
        _.keys(this.active).map((i) => parseInt(i)),
        (i, j) => i + j,
        0
      )

      return request.post('/bl/activity/order/apply', {
        activity: { id },
        applyReason: this.text,
        coopSubType: this.type,
        receiver: this.address,
        platformIdSum: idsum,
        reward: this.reward,
        blReward: this.blReward,
        skuUnion: this.sku,
        depositInfo: {
          type: this.pay
        },
        checkApplied: !!check
      })
    },
    payOrder () {
      const { id } = router(this).params()
      return request
        .post('/wxpay/mini', {
          amount: request.isTest() ? 0.01 : this.data.goods.price,
          brActivityId: id,
          payScene: 'BL_PAY_DEPOSIT'
        })
        .then(({ json: { data } }) => {
          return api.pay(data)
        })
    },
    onOk () {
      this.inputerror = false
      if (!this.address) {
        uiapi.toast('请填写收货地址')
        return
      }
      if (_.size(this.active) <= 0) {
        uiapi.toast('请选择合作渠道')
        return
      }
      if (!/^[1-9][0-9.]*$/.test(this.bid)) {
        uiapi.toast('请输入正确的报价金额')
        return
      }
      if (!/^[1-9][0-9]*$/.test(this.bid)) {
        uiapi.toast('报价金额只支持整数')
        return
      }
      if (this.type === 2 && (this.reward <= 0 || this.reward > this.maxReward)) {
        this.inputerror = true
        uiapi.toast(`请输入1~${this.maxReward}的报价金额`)
        return
      }
      if (!this.text) {
        uiapi.toast('申请理由也很重要哦~')
        return
      }
      if (!checkAddress(this.data.extension.receiveAreas || [], this.address)) {
        uiapi
          .alert({
            title: '温馨提示',
            content: formatAddressConf(this.data.extension.receiveAreas || [])
          })
          .then((r) => {
            // router(this).push('/pages/address/main')
            this.chooseAddress()
          })
          .catch((e) => {})
        return
      }

      const l = uiapi.loading()
      this.createOrder().then((r) => {
        l()
        uiapi.toast('申请已提交')
        router(this).replace('/pages/orders/main')
      }).catch((e) => {
        l()
        uiapi.toast(e.info)
      })
    },
    onCopy (str) {
      api.copy(str).then((r) => {
        uiapi.toast('复制成功')
      })
    }
  }
}
</script>

<style scoped>
.address img {
  width: 44rpx;
  height: 44rpx;
}
.right {
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
.inputline {
  justify-content: flex-end;
}
.inputline input {
  border: 1px solid #c1c6cb;
  border-radius: 8rpx;
  padding: 0 16rpx;
  margin-right: 8rpx;
  width: 168rpx;
}
.inputline.error input {
  border: 1px solid #ff6144;
}
.textinput {
  border-radius: 8rpx;
  margin-bottom: 100rpx;
  padding-bottom: 8rpx;
}
.textinput textarea {
  width: 670rpx;
}
.bar {
  /* margin-top: 180rpx; */
  padding: 8rpx 24rpx;
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
</style>
