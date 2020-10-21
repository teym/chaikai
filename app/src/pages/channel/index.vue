<template>
  <div class="container">
    <div v-if="bind.length > 0">
      <div class="light_bg pad2">
        <h5 class="middle dark blod">已入驻渠道</h5>
      </div>
      <ul class="white_bg channel">
        <li v-for="(item, i) in bind" :key="i" class="row i-center pad2">
          <img :src="item.img" :alt="item.platformName">
          <p class="dark middle margin-l">{{item.platformName}}</p>
          <span class="light small margin-l">粉丝数：{{item.fansCount || 0}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
          <div class="flex"></div>
          <span class="light small" @click="onUnbind(item)">解绑</span>
        </li>
      </ul>
    </div>
    <div v-if="unbind.length > 0">
      <div class="light_bg pad2">
        <h5 class="middle dark blod">未入驻渠道</h5>
      </div>
      <ul class="white_bg channel">
        <li v-for="(item, i) in unbind" :key="i" class="row i-center pad2" @click="onGo(item)">
          <img :src="item.img" :alt="item.platformName">
          <p class="dark middle margin-l">{{item.platformName}}</p>
          <div class="flex"></div>
          <span class="light small">{{['','审核中', '已拒绝', '已通过'][item.statusCode]}}</span>
          <img class="right" src="/static/images/arrow_right.png" alt="right">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import {router, uiapi, request, mapChannel} from '@/utils/index'

export default {
  data () {
    return {
      data: {},
      bind: [],
      unbind: []
    }
  },
  onShow () {
    this.loadData()
  },
  onPullDownRefresh () {
    this.loadData()
  },
  methods: {
    loadData () {
      return request.get('/bl/account').then(({json: {data}}) => {
        this.data = data
        const channels = _.partition(mapChannel(data.channels), (i) => (i.statusCode === 3))
        this.bind = channels[0]
        this.unbind = channels[1]
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onGo (item) {
      if (!this.data.telephone) {
        uiapi.alert({ title: '温馨提示', content: '为核实认证渠道的信息真实性，请先完善个人信息', confirmText: '去完善', confirmColor: '#ff8e3b' }).then(r => {
          router(this).replace('/pages/profile/main')
        })
      } else {
        router(this).push('/pages/auth/main', item)
      }
    },
    onUnbind (item) {
      const l = uiapi.loading()
      request.post('/bl/account/channel/unbind', item).then(r => {
        l()
        uiapi.toast('解绑成功')
        this.loadData()
      }).catch(e => {
        l()
        console.log(e)
        if (e.code === 1) {
          uiapi.alert({ title: '无法解绑渠道', content: '您存在合作中的订单，请合作完成后再进行解绑' })
            .then(r => {})
            .catch(e => {})
        } else {
          uiapi.toast(e.info)
        }
      })
    }
  }
}
</script>

<style scoped>
.channel img {
  width: 56rpx;
  height: 56rpx;
}
.channel .right {
  width: 32rpx;
  height: 32rpx;
}
.channel .light {
  color: #c1c6cb;
}
.channel li {
  border-bottom: 1rpx solid #f5f5f5;
}
</style>
