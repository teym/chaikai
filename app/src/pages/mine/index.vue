<template>
<div class="container">
  <img v-if="logined" class="bg pos_a" src="/static/images/mine_bg.png" alt="bg">
  <navbar :fixed="true">
    <div class="navbar row i-center pad2-l">
      <span :class="{white:logined,black:!logined}" class="blod">我的</span>
    </div>
  </navbar>
  <div v-if="logined" class="content col flex">
    <div class="row just info pad2-l pad2-r margin-t">
      <div class="row" @click="onRouter('profile')">
        <img class="logo" :src="user.avatar" alt="logo">
        <div class="col just margin-l">
          <h5 class="big blod">{{user.nickname}}</h5>
          <p class="small">{{tags}}</p>
        </div>
      </div>
      <div class="col just end">
        <div class="row i-center" @click="onRouter('channel')">
          <ul class="row channel i-center" v-if="channels.length > 0">
            <li v-for="(i, j) in channels" :key="j" :style="{'z-index': 9 - j}">
              <img :src="i.img" :alt="i.platformName" />
            </li>
          </ul>
          <p v-else class="small text-right">去认证</p>
          <img class="right" src="/static/images/arrow_right_white.png" alt="right">
        </div>
        <div class="row i-center" @click="onScore">
          <p class="small">评分 <span class="blod">{{user.score}}</span></p>
          <img class="right" src="/static/images/arrow_right_white.png" alt="right">
        </div>
      </div>
    </div>
    <div class="flex white_bg round pad2-l pad2-r">
      <div class="row just">
        <h5 class="big blod dark">活动订单</h5>
        <div class="row i-center" @click="onRouter('orders')">
          <p class="small light">查看全部</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <div class="row icons pad-t pad-l pad-r margin2-b">
        <div class="flex col center pad-t pad-b" @click="onOrder(2)">
          <div class="pos_r col center">
            <img src="/static/images/mine_icons_1.png " alt="1">
            <p class="small light margin-t">待缴押金</p>
            <span class="dot flot" v-if="stat.depositToBePaid > 0">{{stat.depositToBePaid}}</span>
          </div>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(3)">
          <div class="pos_r col center">
            <img src="/static/images/mine_icons_2.png " alt="2">
            <p class="small light margin-t">待发货</p>
            <span class="dot flot" v-if="stat.toBeDelivered > 0">{{stat.toBeDelivered}}</span>
          </div>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(4)">
          <div class="pos_r col center">
            <img src="/static/images/mine_icons_3.png " alt="3">
            <p class="small light margin-t">待收货</p>
            <span class="dot flot" v-if="stat.toBeReceived > 0">{{stat.toBeReceived}}</span>
          </div>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(5)">
          <div class="pos_r col center">
            <img src="/static/images/mine_icons_4.png " alt="4">
            <p class="small light margin-t">待测评</p>
            <span class="dot flot" v-if="stat.toBeEvaluated > 0">{{stat.toBeEvaluated}}</span>
          </div>
        </div>
      </div>
      <div class="row just line" @click="onRouter('issues')">
        <p class="middle light">订单问题</p>
        <div class="row i-center">
          <span class="dot fill" v-if="stat.hasTicket > 0">{{stat.hasTicket}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <div class="row just line" @click="onRouter('wallet')">
        <p class="middle light">钱包收入</p>
        <div class="row i-center">
          <span class="big red blod">{{amount}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <div class="row just line" @click="onQa()">
        <p class="middle light">常见问题</p>
        <div class="row i-center">
          <span class="small light">学习平台规则</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <button class="btn-row row just line" open-type="contact" :session-from="session" >
        <p class="middle light">联系客服</p>
        <div class="row i-center">
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </button>
    </div>
  </div>
  <login v-else :embed="true" @logined="onLogined"/>
</div>
</template>

<script>
import navbar from '@/components/navbar'
import login from '../login/index'
import {router, api, signal, request, mapChannel, uiapi} from '@/utils/index'

export default {
  components: {
    navbar,
    login
  },
  data () {
    return {
      user: {
        nickname: 'mpvue',
        avatar: '',
        score: 10,
        areas: []
      },
      stat: {
        depositToBePaid: 0,
        toBeDelivered: 0,
        toBeReceived: 0,
        toBeEvaluated: 0,
        hasTicket: 0
      },
      session: '',
      amount: 0,
      channels: [],
      logined: false
    }
  },
  computed: {
    tags () {
      return this.user.areas.map(i => i.name).join('|')
    }
  },
  onShow () {
    if (api.isLogin()) {
      this.loadData()
    }
  },
  onPullDownRefresh () {
    if (api.isLogin()) {
      uiapi.waitRefresh(this.loadData())
    } else {
      uiapi.waitRefresh(Promise.resolve({}))
    }
  },
  created () {
    this.logined = api.isLogin()
    this.onUser = () => {
      this.onLogined()
    }
    signal.add('logined', this.onUser)
  },
  beforeDestroy () {
    signal.remove('logined', this.onUser)
  },
  methods: {
    onLogined () {
      this.logined = api.isLogin()
      if (this.logined) {
        this.loadData()
      }
    },
    loadData () {
      return Promise.all([request.get('/bl/account').then(({json: {data}}) => {
        this.user = data
        this.channels = mapChannel(data.channels).filter(i => i.statusCode === 3)
        this.session = JSON.stringify({tel: data.telephone,
          name: data.nickname,
          weixin: data.wechatNo,
          contact: data.realName})

        const meiqiaPlugin = wx.requirePlugin('meiqia')
        meiqiaPlugin.setClientInfo({
          user_info: {
            tel: data.telephone,
            name: data.nickname,
            weixin: data.wechatNo,
            contact: data.realName
          },
          ent_id: '249463',
          app_id: 'wx48bf43cf5cf1886d',
          open_id: data.wechatOpenId,
          success: function () {
            console.log('meiqia success')
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }).catch(e => {
        uiapi.toast(e.info)
      }),
      request.get('/bl/account/finance').then(({json: {data}}) => {
        this.amount = data.totalAmount
      }).catch(e => {
        console.log(e)
      }),
      request.get('/bl/activity/order/stat').then(({json: {data}}) => {
        this.stat = data
      })])
    },
    onScore () {
      this.onRouter('scope', {scope: this.user.score, tags: this.user.scoreInfo.items.map(i => (`${i.msg} ${i.number}`)).join(',')})
    },
    onOrder (status) {
      router(this).push('/pages/orders/main', {status})
    },
    onRouter (p, d) {
      router(this).push('/pages/' + p + '/main', d)
    },
    onQa () {
      router(this).push('/pages/web/main', {url: 'https://docs.qq.com/doc/DU1JsSWdVRk9CS1lO?pub=1&dver=2.1.0'})
    }
  }
}
</script>

<style scoped>
.bg {
  width: 750rpx;
  height: 400rpx;
  z-index: 0;
}
.navbar {
  width: 100%;
  height: 100%;
}
.navbar span {
  font-size: 44rpx;
}
.content {
  z-index: 1;
}
.info .logo {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  border: 2rpx solid white;
}
.info h5 {
  color: white;
}
.info p {
  color: white;
}
.channel {
  margin-right: 8rpx;
}
.channel li {
  height: 44rpx;
}
.channel li img {
  width: 44rpx;
  height: 44rpx;
  margin: 0 -8rpx;
}
.end {
  align-items: flex-end;
}
.line {
  margin: 44rpx 0;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
.round {
  margin-top: 52rpx;
  padding-top: 70rpx;
  border-radius: 40rpx 40rpx 0 0;
}
.icons {
  margin-bottom: 48rpx;
}
.icons img {
  width: 64rpx;
  height: 64rpx;
}
.dot {
  background-color: white;
  color: #ff6144;
  border: 1rpx solid #ff6144;
  line-height: 32rpx;
  font-size: 28rpx;
  min-width: 32rpx;
  text-align: center;
  border-radius: 16rpx;
  box-sizing: border-box;
}
.dot.flot {
  position: absolute;
  right: -4rpx;
  top: -8rpx;
}
.dot.fill {
  background-color: #ff6144;
  color: white;
  border: none;
}
button.btn-row {
  border: 0;
  background-color: white;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
button.btn-row::after {
  border: none;
}
</style>
