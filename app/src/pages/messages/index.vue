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
      <div v-for="(item, j) in datas" :key="j" class="row pad2 item" @click="onGo">
        <img :src="item.img" alt="img">
        <div class="col just flex margin-l">
          <h5 class="middle dark blod">{{item.name}}</h5>
          <p class="small light">{{item.content}}</p>
        </div>
        <div class="col just margin-l right">
          <p class="small light date">{{item.time}}</p>
          <span v-if="item.count > 0" class="round row center">{{item.count}}</span>
          <div v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import navbar from '@/components/navbar'
import {router} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      datas: [{
        img: ImgUrl,
        name: '小奥汀品牌方',
        content: '亲亲，至于测评合作的要求喔～',
        time: '下午02:30',
        count: 1
      }, {
        img: ImgUrl,
        name: '小奥汀品牌方',
        content: '亲亲，至于测评合作的要求喔～',
        time: '下午02:30',
        count: 0
      }],
      page: 1,
      loading: false
    }
  },

  components: {
    navbar
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
    onGo () {
      router(this).push('/pages/message/main')
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
