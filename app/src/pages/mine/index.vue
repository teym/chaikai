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
          <ul class="row channel i-center">
            <li v-for="(i, j) in channels" :key="j" :style="{'z-index': 9 - j}">
              <img :src="i.img" :alt="i.platformName" />
            </li>
          </ul>
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
        <div class="flex col center pad-t pad-b">
          <img src="/static/images/mine_icons_1.png " alt="1">
          <p class="small light margin-t">待缴押金</p>
        </div>
        <div class="flex col center pad-t pad-b">
          <img src="/static/images/mine_icons_2.png " alt="2">
          <p class="small light margin-t">待发货</p>
        </div>
        <div class="flex col center pad-t pad-b">
          <img src="/static/images/mine_icons_3.png " alt="3">
          <p class="small light margin-t">待收货</p>
        </div>
        <div class="flex col center pad-t pad-b">
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
          <span class="big red blod">500.00</span>
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
      <div class="row just margin2-t margin2-b">
        <p class="middle light">联系客服</p>
        <div class="row i-center">
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import {router, api, signal, request, mapChannel, uiapi} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'

export default {
  components: {
    navbar
  },
  data () {
    return {
      user: {
        nickname: 'mpvue',
        avatar: ImgUrl,
        score: 0,
        areas: []
      },
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
    },
    onScope () {
      this.onRouter('scope', {scope: this.user.score, tags: this.user.scoreInfo.items.map(i => (`${i.msg} ${i.number}`)).join(',')})
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
</style>
