<template>
  <div class="container white_bg">
    <navbar :fixed="true" background="white">
      <div class="navbar row i-center pad2-l">
        <p>消息</p>
      </div>
    </navbar>
    <div class="content flex col">
      <div v-if="datas.length === 0" class="flex col center empty">
        <img src="/static/images/message_empty.png" alt="msg">
        <p class="middle light">你还没有消息哦～</p>
      </div>
      <div v-for="(item, j) in datas" :key="j" class="row pad2 item" @click="onGo(item)">
        <img :src="item.accountInfo.logo" alt="img">
        <div class="col just flex margin-l">
          <h5 class="middle dark blod">{{item.accountInfo.name}}</h5>
          <p class="small light">{{item.content}}</p>
        </div>
        <div class="col just margin-l right">
          <p class="small light date">{{item.date}}</p>
          <span v-if="item.bloggerUnreadNum > 0" class="round row center">{{item.bloggerUnreadNum}}</span>
          <div v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import navbar from '@/components/navbar'
import {router, api, signal, uiapi, request, formatMsgTime, isImgMsg} from '@/utils/index'

export default {
  data () {
    return {
      datas: [],
      page: 1,
      loading: false,
      nomore: false
    }
  },

  components: {
    navbar
  },
  onShow () {
    if (!api.isLogin()) {
      router(this).push('/pages/login/main')
    }
  },
  created () {
    // let app = getApp()
    this.onUser = () => {
      this.loadData(1)
    }
    signal.add('logined', this.onUser)
    if (api.isLogin()) {
      this.loadData(1)
    }
  },
  beforeDestroy () {
    signal.remove('logined', this.onUser)
  },
  onPullDownRefresh () {
    this.loadData(1)
  },
  onReachBottom () {
    if (this.loading || this.nomore) {
      return
    }
    this.loadData(this.page + 1)
  },
  methods: {
    loadData (page) {
      request.get('/chat/bl/room/list', {page, size: 10, type: 1}).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat(data.data.map(i => Object.assign(i, {date: formatMsgTime(i.lastTime), content: isImgMsg(i.lastRecord.content) ? '[图片]' : i.lastRecord.content})))
        this.loading = false
        this.page = page
        this.nomore = data.pager.totalPages <= page
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onGo (item) {
      router(this).push('/pages/message/main', {id: item.originId, room: item.id})
    }
  }
}
</script>

<style scoped>
.navbar{
  width: 100%;
  height: 100%;
}
.navbar p{
  font-size: 44rpx;
  font-weight: 500;
}
.item img{
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #F5F5F5;
}
.item div{
  padding: 4rpx 0;
}
.item .right{
  align-items: flex-end;
}
.item .date{
  color: #7B7F8E;
}
.item .round{
  background-color: #F25643;
  height: 32rpx;
  font-size: 24rpx;
  color: white;
  border-radius: 16rpx;
  min-width: 32rpx;
}
.empty img{
  width: 480rpx;
  height: 306rpx;
}
</style>
