<template>
  <div class="container white_bg">
    <div class="flex">
    <div v-for="(item, i) in channels" :key="i" class="item pad2-l pad2-t pad2-r">
      <div class="row i-center">
        <img :src="item.img" :alt="item.platformName">
        <p class="dark middle blod margin-l">{{item.platformName}}</p>
      </div>
      <div class="light_bg pad margin-t">
        <input class="middle dark" type="text" v-model="item.url" :placeholder="'请输入'+item.platformName+'测评链接'">
      </div>
    </div>
    </div>
    <div class="btn middle blod row center" @click="onOK">提交测评</div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import moment from 'moment'
import {uiapi, router, request, mapChannel} from '@/utils/index'

export default {
  data () {
    return {
      datas: [],
      channels: [],
      loading: false
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
      request.get('/bl/activity/order/' + id).then(({json: {data}}) => {
        this.channels = mapChannel(data.channels || []).map(i => Object.assign(i, {url: ''}))
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onOK () {
      const {id, append} = router(this).params()
      request.post('/bl/activity/order/evaluation', {brActivityOrderId: id, type: append ? 2 : 1, list: this.channels}).then(r => {
        uiapi.toast('已提交')
        router(this).pop()
      }).catch(e => {
        uiapi.toast(e.info)
      })
    }
  }
}
</script>

<style scoped>
.item img{
  width: 60rpx;
  height: 60rpx;
}
.btn{
  margin: 54rpx;
  height: 80rpx;
  border-radius: 40rpx;
  color: white;
  background-color: #FF8E3B;
}
</style>
