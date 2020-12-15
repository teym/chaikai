<template>
  <div class="container light_bg">
    <div class="white_bg pad2 row">
      <div class="flex col c-center margin2-l margin2-r">
        <h5 class="big light blod">
          {{["","待审核","","待发货","待收货","待测评","已测评","已关闭","已逾期"][data.statusCode]}}
        </h5>
        <p
          class="small margin-t"
          :class="{red: data.statusCode == 6 || data.statusCode == 8,light: data.statusCode < 6}"
        >
          {{ msg }}
        </p>
      </div>
      <img
        class="state margin2"
        v-if="data.statusCode === 1"
        src="/static/images/issue_status_2.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 2"
        src="/static/images/issue_status_2.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 3"
        src="/static/images/issue_status_2.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 4"
        src="/static/images/issue_status_4.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 5"
        src="/static/images/issue_status_1.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 6"
        src="/static/images/issue_status_3.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 7"
        src="/static/images/issue_status_5.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 8"
        src="/static/images/issue_status_3.png"
        alt="status"
      />
    </div>
    <div
      v-if="data.statusCode > 5 && data.tickets && data.tickets.length > 0"
      class="margin-t white_bg pad2"
    >
      <h5 class="middle dark blod">订单问题</h5>
      <div
        class="row just channel margin-t"
        v-for="(item, i) in data.tickets"
        :key="i"
      >
        <div class="row i-center">
          <p class="light middle margin-l">测评投诉</p>
        </div>
        <div class="row i-center" @click="onIssue(item)">
          <p class="light small">
            {{["","待修改","待确认","小二审核中","待重评","已修改","已取消","已违规"][item.statusCode]}}
          </p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div
      v-if="data.fineList && data.fineList.length > 0"
      class="margin-t white_bg pad2"
    >
      <h5 class="middle dark blod">测评罚款</h5>
      <div
        class="row just channel margin-t"
        v-for="(item, i) in data.fineList"
        :key="i"
      >
        <div class="row i-center">
          <p class="light middle margin-l">
            {{ item.type === 1 ? "测评逾期" : "测评违规" }}
          </p>
        </div>
        <div class="row i-center" @click="onFine(item)">
          <p class="light small" :class="{ red: item.statusCode < 3 }">
            {{ ["", "待处理", "待支付", "已支付", "已撤销"][item.statusCode] }}
          </p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div
      v-if="data.statusCode > 5 && data.statusCode < 7"
      class="margin-t white_bg pad2"
    >
      <h5 class="middle dark blod">我的测评</h5>
      <div
        class="row just channel margin-t"
        v-for="(item, i) in evaluations"
        :key="i"
      >
        <div class="row i-center">
          <img :src="item.img" :alt="item.platformName" />
          <p class="light middle margin-l">
            {{ item.type === 1 ? "正式测评" : "追加测评" }}
          </p>
        </div>
        <div class="row i-center" @click="onWeb(item)">
          <p class="light small">{{ item.date }}</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <div class="row just i-center" @click="onReward">
        <div class="row i-center">
          <h5 class="middle dark blod">悬赏金额</h5>
          <span class="middle red margin-l">{{ data.blReward }}元</span>
        </div>
        <div class="row i-center">
          <p class="small light">
            {{ ["", "待发放", "已发放", "已取消"][data.rewardStatusCode] }}
          </p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">申请信息</h5>
      <div class="row margin-t">
        <p class="small light">合作方式：</p>
        <p class="small light flex">
          {{ ["", "接受悬赏", "达人报价", "免费置换"][data.coopSubType] }}
        </p>
      </div>
      <div class="row margin-t">
        <p class="small light">合作渠道：</p>
        <ul class="row channel">
          <li v-for="(i, j) in channels" :key="j" :style="{ 'z-index': 9 - j }">
            <img :src="i.img" :alt="i.name" />
          </li>
        </ul>
      </div>
      <div class="row">
        <p class="small light">申请理由：</p>
        <div class="flex">
          <p class="small light margin-b">{{ data.applyReason }}</p>
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">合作任务</h5>
      <div class="rule margin-t" @click="onRule">
        <img src="/static/images/detail_tip.png" alt="tip" />
      </div>
      <h5 class="middle dark blod margin-t" v-if="data.coopSubType !== 3">
        合作要求
      </h5>
      <div class="light_bg pad margin-t" v-if="data.coopSubType !== 3">
        <div
          v-if="data.activity.extension.articleType > 0"
          class="row just pad-t"
        >
          <p class="small normal light">合作篇幅</p>
          <div class="small medium light text-right flex">
            {{ data.activity.extension.articleType > 0 ? "单篇" : "无要求" }}
          </div>
        </div>
        <div
          v-if="data.activity.extension.contentType > 0"
          class="row just pad-t"
        >
          <p class="small normal light">内容形式</p>
          <div class="small medium light text-right flex">
            {{["无要求", "图文", "视频"][data.activity.extension.contentType]}}
          </div>
        </div>
        <div
          v-if="data.activity.extension.minWordNum > 0"
          class="row just pad-t"
        >
          <p class="small normal light">最低字数</p>
          <div class="small medium light text-right flex">
            {{["无要求", "200字", "400字"][data.activity.extension.minWordNum]}}
          </div>
        </div>
        <div
          v-if="data.activity.extension.minPicNum > 0"
          class="row just pad-t"
        >
          <p class="small normal light">最低图片数</p>
          <div class="small medium light text-right flex">
            {{ ["无要求", "6张", "9张"][data.activity.extension.minPicNum] }}
          </div>
        </div>
        <div
          v-if="data.activity.extension.minVideoLength > 0"
          class="row just pad-t"
        >
          <p class="small normal light">最低视频时长</p>
          <div class="small medium light text-right flex">
            {{["无要求", "15秒", "30秒", "1分钟", "2分钟"][data.activity.extension.minVideoLength]
            }}
          </div>
        </div>
        <div v-if="topics.length > 0" class="row just pad-t">
          <p class="small normal light">账号话题</p>
          <div class="small medium light text-right flex">
            <p v-for="(c, i) in topics" :key="i">
              {{ c.platformName }}@{{ c.nickname }}#{{ c.topic }}
            </p>
          </div>
        </div>
        <div v-if="data.activity.discountInfo" class="row just pad-t">
          <p class="small normal light" @click="tip = true">
            优惠信息<img
              src="/static/images/detail_mark.png"
              style="width: 24rpx; height: 24rpx"
            />
          </p>
          <div class="small medium light text-right flex">
            {{ data.activity.discountInfo }}
            <span>复制</span>
          </div>
        </div>
        <div v-if="keywords.length > 0" class="row just pad-t">
          <p class="small normal light">附带关键词</p>
          <div class="small medium light text-right flex">
            <p v-for="(k, i) in keywords" :key="i" class="small medium light">
              {{ k }}
            </p>
          </div>
        </div>
        <div v-if="otherReq.length > 0" class="row just pad-t">
          <p class="small normal light">其他要求</p>
          <div class="small medium light text-right flex">
            <p v-for="(o, i) in otherReq" :key="i">{{ o }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row i-center white_bg pad2 margin-t address"
      @click="onChoseAddress"
    >
      <img class="icon" src="/static/images/address_icon.png" alt="icon" />
      <div class="flex col just pad-l pad-r">
        <div class="row just pad-b">
          <p class="middle dark medium">收货人：{{ data.receiver.name }}</p>
          <p class="middle dark medium">{{ data.receiver.telephone }}</p>
        </div>
        <span class="small light"
          >{{ data.receiver.province }}{{ data.receiver.city}}{{ data.receiver.county }}{{ data.receiver.address }}</span
        >
      </div>
      <img
        v-if="data.statusCode < 4"
        class="right"
        src="/static/images/arrow_right.png"
        alt="icon"
      />
    </div>
    <div class="margin-t white_bg pad2">
      <div class="row info pad-b" @click="onActivity">
        <img class="img" :src="data.activity.goods.picUrl" alt="img" />
        <div class="col just flex margin-l">
          <h5 class="middle dark">{{ data.activity.title }}</h5>
          <span class="small light">已选规格：{{ data.goodsSku }}</span>
        </div>
      </div>
      <div class="margin-t">
        <p class="light small margin-t">
          订单编号：{{ data.id }}
          <span class="red" @click="onCopy(data.id)">复制</span>
        </p>
        <p class="light small margin-t">申请时间：{{ data.date }}</p>
        <p
          v-if="data.statusCode >= 4 && data.receiver.logisticsNo"
          class="light small margin-t"
        >
          发货时间：{{ data.recvDate }}
        </p>
        <p
          v-if="data.statusCode >= 4 && data.receiver.logisticsNo"
          class="light small margin-t"
        >
          物流公司：{{ data.receiver.logisticsPlatform }}
        </p>
        <p
          v-if="data.statusCode >= 4 && data.receiver.logisticsNo"
          class="light small margin-t"
        >
          物流单号：{{ data.receiver.logisticsNo }}
          <span class="red" @click="onCopy(data.receiver.logisticsNo)"
            >复制</span
          >
        </p>
      </div>
    </div>
    <div style="height: 80rpx" class="white_bg"></div>
    <bar background="#FFFFFF">
      <div class="bar row pad2 i-center white_bg">
        <div
          v-if="data.statusCode === 1 || data.statusCode === 3"
          class="btn gray small row center margin-l"
          @click="onCancel"
        >
          取消申请
        </div>
        <div
          v-if="data.statusCode > 3 && data.statusCode !== 7"
          class="btn gray small row center margin-l"
          @click="onShip"
        >
          查看物流
        </div>
        <div
          v-if="data.statusCode > 2 && data.statusCode !== 7"
          class="btn gray small row center margin-l"
          @click="onMessage"
        >
          留言
        </div>
        <div
          v-if="data.statusCode === 4"
          class="btn red small row center margin-l"
          @click="onRecv"
        >
          确认收货
        </div>
        <div
          v-if="data.statusCode === 5 || data.statusCode === 8"
          class="btn red small row center margin-l"
          @click="onCommit"
        >
          提交评测
        </div>
        <div
          v-if="data.statusCode === 6"
          class="btn red small row center margin-l"
          @click="onAdd"
        >
          追加测评
        </div>
      </div>
    </bar>
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
  diffTime,
  checkAddress,
  formatAddressConf
} from '@/utils/index'

export default {
  components: {
    bar
  },
  data () {
    return {
      data: {
        activity: {
          goods: {},
          extension: {}
        },
        depositInfo: {},
        receiver: {}
      },
      channels: [],
      evaluations: [],
      topics: [],
      keywords: [],
      otherReq: [],
      msg: ''
    }
  },
  onShow () {
    this.loadData()
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData())
  },
  onReachBottom () {},
  methods: {
    loadData () {
      const { id } = router(this).params()
      return request
        .get('/bl/activity/order/' + id)
        .then(({ json: { data } }) => {
          data.date = moment(data.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
          data.recvDate = moment(
            (data.receiver || {}).expectedReceiveTime
          ).format('YYYY-MM-DD HH:mm:ss')
          data.tickets = data.tickets || []
          if (!data.depositInfo) {
            data.depositInfo = { statusCode: 1, amount: 0 }
          }
          this.data = data
          this.channels = mapChannel(data.channels || [])
          this.evaluations = mapChannel(data.evaluationItems || []).map((i) =>
            Object.assign(i, { date: moment(i.gmtCreate).format('YYYY.MM.DD') })
          )
          this.topics = _.filter(data.channels, (i) => i.topic)
          this.keywords = data.activity.extension.keywords
            ? data.activity.extension.keywords.split(' ')
            : []
          this.otherReq = data.activity.extension.otherReq
            ? data.activity.extension.otherReq
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
          this.msg = this.mapMsg(data)
        })
        .catch((e) => {
          uiapi.toast(e.info)
        })
    },
    mapMsg (data) {
      let s = diffTime(data.deadline, '0分0秒')
      switch (data.statusCode) {
        case 1:
          return `还剩${s}结束审核`
        case 2:
          return `押金支付还剩${s}，超时将视为自动放弃名额`
        case 3:
          return `发货剩余时间${s}`
        case 4:
          return `确认收货剩余时间${s}`
        case 5:
          return `测评时间剩余时间${s}`
        case 6:
          return ''
        case 7:
          return data.statusDesc || '' // `已逾期${s}，将按天扣除押金`
        case 8:
          s = diffTime(new Date(), '0分0秒', data.deadline)
          return `已逾期${s}`
      }
      return ''
    },
    onRule () {
      router(this).push('/pages/web/main', {
        url: 'https://mp.weixin.qq.com/s/yPXWeSNE_vZx5WCiqOjqtQ'
      })
    },
    onReward () {
      const s = diffTime(this.data.deadline, '')
      console.log('reward', s)
      router(this).push('/pages/reward/main', {
        status: this.data.rewardStatusCode,
        orderStatus: this.data.statusCode,
        issueStatus: this.data.ticketStatusCode,
        deadline: s
      })
    },
    onDepose () {
      router(this).push('/pages/depose/main', { id: this.data.id })
    },
    onUpdate (addr) {
      request
        .put(
          '/bl/activity/order/receiver',
          Object.assign({ brActivityOrderId: this.data.id }, addr)
        )
        .catch((e) => {
          uiapi.toast(e.info)
        })
    },
    onChoseAddress () {
      if (this.data.statusCode >= 4) {
        return
      }
      uiapi
        .chooseAddress()
        .then((a) => {
          if (
            !checkAddress(this.data.activity.extension.receiveAreas || [], a)
          ) {
            uiapi
              .alert({
                title: '温馨提示',
                content: formatAddressConf(
                  this.data.activity.extension.receiveAreas || []
                )
              })
              .then((r) => {
                this.onChoseAddress()
              })
              .catch((e) => {})
          } else {
            this.data.receiver = a
            this.onUpdate(a)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onShip () {
      router(this).push('/pages/ship/main', {
        id: this.data.receiver.logisticsNo
      })
    },
    onMessage () {
      router(this).push('/pages/message/main', { id: this.data.id })
    },
    onWeb (item) {
      router(this).push('/pages/copy/main', { url: item.url })
    },
    onActivity () {
      router(this).push('/pages/detail/main', { id: this.data.activity.id })
    },
    onRecv () {
      uiapi
        .alert({
          title: '确认收货',
          content: '确认收货后，请及时在规定时间范围内完成测评并上传'
        })
        .then((r) => {
          const l = uiapi.loading()
          request
            .put(`/bl/activity/order/${this.data.id}/received`, {})
            .then((r) => {
              this.loadData()
              l()
              uiapi.toast('已确认收货')
            })
            .catch((e) => {
              l()
              uiapi.toast(e.info)
            })
        })
        .catch((e) => {})
    },
    onCommit () {
      router(this).push('/pages/tester/main', { id: this.data.id })
    },
    onAdd () {
      router(this).push('/pages/tester/main', {
        id: this.data.id,
        append: true
      })
    },
    onCancel () {
      uiapi
        .alert({ title: '取消申请', content: '取消申请活动' })
        .then((r) => {
          const l = uiapi.loading()
          request
            .post(`/bl/activity/order/${this.data.id}/cancel`, {})
            .then((r) => {
              l()
              uiapi.toast('已取消')
              router(this).pop()
            })
            .catch((e) => {
              l()
              uiapi.toast(e.info)
            })
        })
        .catch((e) => {})
    },
    onIssue (item) {
      router(this).push('/pages/issue/main', { id: item.id })
    },
    onFine (item) {
      router(this).push('/pages/fine/main', { id: item.id })
    },
    onCopy (txt) {
      console.log('copy', txt)
      api.copy('' + txt).then(() => uiapi.toast('复制成功'))
    },
    onPay () {
      const l = uiapi.loading()
      request
        .post('/wxpay/mini', {
          amount: this.data.depositInfo.amount || this.data.goods.price,
          brActivityId: this.data.activity.id,
          brActivityOrderId: this.data.id,
          payScene:
            this.data.statusCode >= 2
              ? 'BL_PAY_DEPOSIT_AFTER'
              : 'BL_PAY_DEPOSIT'
        })
        .then(({ json: { data } }) => {
          return api.pay(data)
        })
        .then((r) => {
          setTimeout(() => {
            l()
          }, 1000)
          setTimeout(() => {
            this.loadData()
          }, 200)
        })
        .catch((e) => {
          l()
          uiapi.toast(e.info)
        })
    }
  }
}
</script>

<style scoped>
.state {
  width: 188rpx;
  height: 146rpx;
}
.channel {
  margin-left: 8rpx;
}
.channel li {
  margin: 0 -8rpx;
}
.channel img {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
.rule img {
  width: 702rpx;
  height: 128rpx;
}
.address .icon {
  width: 44rpx;
  height: 44rpx;
}
.info {
  border-bottom: 1rpx solid #f5f5f5;
}
.info .img {
  width: 208rpx;
  height: 208rpx;
}
.bar {
  justify-content: flex-end;
}
.bar .btn {
  height: 56rpx;
  border-radius: 28rpx;
  padding: 0 32rpx;
}
.bar .btn.red {
  color: #ff8e3b;
  border: 1rpx solid #ff8e3b;
}
.bar .btn.gray {
  color: #c1c6cb;
  border: 1rpx solid #c1c6cb;
}
</style>
