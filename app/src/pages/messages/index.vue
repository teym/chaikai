<template>
  <div class="container white_bg">
    <navbar :fixed="true" background="white">
      <div class="navbar row i-center pad2-l">
        <p>消息</p>
      </div>
    </navbar>
    <div v-if="logined" class="content flex col">
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
    <login v-else :embed="true" @logined="onLogined"/>
  </div>
</template>

<script>
// import _ from 'underscore'
import navbar from '@/components/navbar'
import {router, api, signal, uiapi, request, formatMsgTime, isImgMsg} from '@/utils/index'
import login from '../login/index'

export default {
  data () {
    return {
      datas: [],
      page: 1,
      loading: false,
      nomore: false,
      logined: false
    }
  },

  components: {
    navbar,
    login
  },
  mounted () {
    if (api.isLogin()) {
      this.loadData(1)
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
  onPullDownRefresh () {
    if (api.isLogin()) {
      uiapi.waitRefresh(this.loadData(1))
    } else {
      uiapi.waitRefresh(Promise.resolve({}))
    }
  },
  onReachBottom () {
    if (this.loading || this.nomore) {
      return
    }
    this.loadData(this.page + 1)
  },
  methods: {
    onLogined () {
      this.logined = api.isLogin()
      if (this.logined) {
        this.loadData(1)
      }
    },
    loadData (page) {
      return request.get('/chat/bl/room/list', {page, size: 10, type: 1}).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat(data.data.map(i => Object.assign(i, {date: formatMsgTime(i.lastTime), content: isImgMsg(i.lastRecord.content) ? '[图片]' : i.lastRecord.content})))
        this.loading = false
        this.page = page
        this.nomore = data.pager.totalPages <= page
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onGo (item) {
      item.bloggerUnreadNum = 0
      router(this).push('/pages/message/main', {id: item.originId, room: item.id})
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 100%;
}
.navbar p {
  font-size: 44rpx;
  font-weight: 500;
}
.item img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #f5f5f5;
}
.item div {
  padding: 4rpx 0;
}
.item .right {
  align-items: flex-end;
}
.item .date {
  color: #7b7f8e;
}
.item .round {
  background-color: #f25643;
  height: 32rpx;
  font-size: 24rpx;
  color: white;
  border-radius: 16rpx;
  min-width: 32rpx;
}
.empty img {
  width: 480rpx;
  height: 306rpx;
}
</style>
