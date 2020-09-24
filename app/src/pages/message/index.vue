<template>
  <div class="container white_bg">
    <div class="pad2-l pad2-r red_bg tip row i-center">
      <img src="/static/images/messge_tip.png" alt="tip">
      <p class="dark small margin-l">提示：警惕站外沟通交易，平台提供合作保障</p>
      <img src="/static/images/arrow_right.png" alt="right">
    </div>
    <div class="content flex">
      <div v-for="(item, j) in datas" :key="j" class="col pad2 item" :class="{self: item.self}">
        <p class="date">{{item.time}}</p>
        <div class="row margin-t">
          <img class="logo" :src="item.img" alt="img">
          <div class="col just flex margin-l margin-r">
            <h5 class="small light">{{item.name}}</h5>
            <div class="light_bg text margin-t" :class="{media: item.isimg}">
              <img v-if="item.isimg" :src="item.content" alt="">
              <p v-else class="margin2 small light">{{item.content}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bar :fixed="true" background="white">
      <div class="bar row pad2-l pad2-r">
      <img class="margin-r" src="/static/images/message_order.png" alt="order">
      <img class="margin-r" src="/static/images/message_img.png" alt="img" @click="onImg">
      <textarea auto-height class="input light_bg dark middle" v-model="text"/>
      <div class="red_bg margin-l btn row center middle" @click="onSend">发送</div>
      </div>
    </bar>
  </div>
</template>

<script>
// import _ from 'underscore'
import bar from '@/components/bar'
import {router, uiapi} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      datas: [{
        img: ImgUrl,
        name: '小奥汀品牌方',
        content: '亲亲，至于测评合作的要求喔～, 亲亲，至于测评合作的要求喔～',
        time: '下午02:30'
      }, {
        img: ImgUrl,
        name: '小奥汀品牌方',
        content: '亲亲，至于测评合作的要求喔～',
        time: '下午02:30',
        self: true
      },
      {
        img: ImgUrl,
        name: '小奥汀品牌方',
        content: ImgUrl,
        time: '下午02:30',
        isimg: true
      }],
      text: '',
      page: 1,
      loading: false
    }
  },

  components: {
    bar
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
    onOrder () {
      router(this).push('/pages/order/main')
    },
    onImg () {
      uiapi.chooseImage().then(r => {
        console.log(r)
      }).catch(e => {
        console.log(e)
      })
    },
    onSend () {
    }
  }
}
</script>

<style scoped>
.tip{
  width: 750rpx;
  height: 72rpx;
}
.tip img{
  width: 32rpx;
  height: 32rpx;
}
.item .date{
  color: #7B7F8E;
  background-color: #C7CACA;
  color: white;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
  align-self: center;
  font-size: 20rpx;
}
.item .logo{
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
}
.item .col{
  align-items: flex-start;
}
.item .text{
  border-radius: 0 20rpx 20rpx 20rpx;
  max-width: 470rpx;
}
.item .text.media{
  padding: 0;
  border-radius: 8rpx;
  overflow: hidden;
}
.item .text img{
  width: 236rpx;
  height: 236rpx;
}
.item.self .row{
  flex-direction: row-reverse;
}
.item.self .col{
  align-items: flex-end;
}
.item.self .text{
  background-color: #FF8E3B;
  border-radius: 20rpx 0 20rpx 20rpx;
}
.item.self .text p{
  color: white;
}
.bar{
  width: 100%;
  min-height: 64rpx;
  padding-top: 12rpx;
  padding-bottom: 12rpx;
}
.bar img{
  width: 64rpx;
  height: 64rpx;
}
.bar .input{
  width: 374rpx;
  height: auto;
  min-height: 32rpx;
  border-radius: 8rpx;
  padding: 16rpx;
}
.bar .btn {
  width: 128rpx;
  height: 64rpx;
  background-color: #FF8E3B;
  color: white;
  border-radius: 32rpx;
}
</style>
