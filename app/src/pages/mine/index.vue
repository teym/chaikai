<template>
  <div class="container">
    <img class="bg pos_a" src="/static/images/mine_bg.png" alt="bg">
    <div class="content col flex">
    <navbar :fixed="true">
      <div class="navbar row i-center pad2-l">
        <span class="dark blod">我的</span>
      </div>
    </navbar>
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
          <img class="right margin-l" src="/static/images/arrow_right.png" alt="right">
        </div>
        <div class="row i-center" @click="onScope">
          <p class="small">评分 <span class="blod">{{user.scope || 0}}</span></p>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
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
          <img src="/static/images/mine_icons_1.png " alt="1">
          <p class="small light margin-t">待缴押金</p>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(3)">
          <img src="/static/images/mine_icons_2.png " alt="2">
          <p class="small light margin-t">待发货</p>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(4)">
          <img src="/static/images/mine_icons_3.png " alt="3">
          <p class="small light margin-t">待收货</p>
        </div>
        <div class="flex col center pad-t pad-b" @click="onOrder(5)">
          <img src="/static/images/mine_icons_4.png " alt="4">
          <p class="small light margin-t">待测评</p>
        </div>
      </div>
      <div class="row just margin2-t margin2-b" @click="onRouter('issues')">
        <p class="middle light">订单问题</p>
        <div class="row i-center">
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <div class="row just margin2-t margin2-b" @click="onRouter('wallet')">
        <p class="middle light">钱包收入</p>
        <div class="row i-center">
          <span class="big red blod">{{amount}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <div class="row just margin2-t margin2-b">
        <p class="middle light">常见问题</p>
        <div class="row i-center">
          <span class="small light">学习平台规则</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
      <button open-type="contact" session-from="weapp" class="btn-row row just margin2-t margin2-b">
        <p class="middle light">联系客服</p>
        <div class="row i-center">
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </button>
    </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import {router, api, signal, request, mapChannel, uiapi} from '@/utils/index'

export default {
  components: {
    navbar
  },
  data () {
    return {
      user: {
        nickname: 'mpvue',
        avatar: '',
        score: 0,
        areas: []
      },
      amount: 0,
      channels: []
    }
  },
  computed: {
    tags () {
      return this.user.areas.map(i => i.name).join('|')
    }
  },
  onShow () {
    if (!api.isLogin()) {
      router(this).push('/pages/login/main')
    } else {
      this.loadData()
    }
  },
  created () {
    // let app = getApp()
    this.onUser = () => {
      this.loadData()
    }
    signal.add('logined', this.onUser)
  },
  beforeDestroy () {
    signal.remove('logined', this.onUser)
  },
  methods: {
    loadData () {
      request.get('/bl/account').then(({json: {data}}) => {
        this.user = data
        this.channels = mapChannel(data.channels).filter(i => i.statusCode === 3)
      }).catch(e => {
        uiapi.toast(e.info)
      })
      request.get('/bl/account/finance').then(({json: {data}}) => {
        this.amount = data.totalAmount
      }).catch(e => {
        console.log(e)
      })
    },
    onScope () {
      this.onRouter('scope', {scope: this.user.score, tags: this.user.scoreInfo.items.map(i => (`${i.msg} ${i.number}`)).join(',')})
    },
    onOrder (status) {
      router(this).push('/pages/orders/main', {status})
    },
    onRouter (p, d) {
      router(this).push('/pages/' + p + '/main', d)
    }
  }
}
</script>

<style scoped>
.bg{
  width: 750rpx;
  height: 400rpx;
  z-index: 0;
}
.navbar{
  width: 100%;
  height: 100%;
}
.navbar span{
  color: white;
  font-size: 44rpx;
}
.content{
  z-index: 1;
}
.info .logo{
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  border: 2rpx solid white;
}
.info h5{
  color: white;
}
.info p{
  color: white;
}
.channel li{
  height: 44rpx;
}
.channel li img {
  width: 44rpx;
  height: 44rpx;
  margin: 0 -8rpx;
}
.end{
  align-items: flex-end;
}
.right{
  width: 32rpx;
  height: 32rpx;
}
.round{
  margin-top: 52rpx;
  padding-top: 70rpx;
  border-radius: 40rpx 40rpx 0 0;
}
.icons{
  margin-bottom: 48rpx;
}
.icons img{
  width: 64rpx;
  height: 64rpx;
}
button.btn-row{
  border: 0;
  background-color: white;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
button.btn-row::after{
  border: none;
}
</style>
