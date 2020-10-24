<template>
  <div class="container white_bg">
    <div class="pad2-l pad2-r tip pos_f row i-center">
      <img src="/static/images/messge_tip.png" alt="tip">
      <p class="dark small margin-l">提示：警惕站外沟通交易，平台提供合作保障</p>
      <img src="/static/images/arrow_right.png" alt="right">
    </div>
    <div class="content flex">
      <div v-for="(item, j) in datas" :key="j" class="col pad2 item" :class="{self: item.my}">
        <p class="date">{{item.date}}</p>
        <div class="row margin-t">
          <img class="logo" :src="item.accountInfo.avatar" alt="img">
          <div class="col just flex margin-l margin-r">
            <h5 class="small light">{{item.accountInfo.name}}</h5>
            <div class="light_bg text margin-t" :class="{media: item.isimg}">
              <img v-if="item.isimg" :src="item.content" alt="" @click="onPreview(item.content)">
              <p v-else class="margin2 small light">{{item.content}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bar :fixed="true" background="white">
      <div class="bar row pad2-l pad2-r">
      <img class="margin-r" src="/static/images/message_order.png" alt="order" @click="onOrder">
      <img class="margin-r" src="/static/images/message_img.png" alt="img" @click="onImg">
      <textarea auto-height class="input light_bg dark middle" placeholder-style="color:#C1C6CB;font-size:28rpx" v-model="text" placeholder="合作期间可以发送图文消息..."/>
      <div class="margin-l btn row center middle" :class="{red_bg: !!text, red_i_bg: !text}" @click="onSend">发送</div>
      </div>
    </bar>
  </div>
</template>

<script>
// import _ from 'underscore'
import bar from '@/components/bar'
import {router, uiapi, request, formatMsgTime, isImgMsg, imgMsgUrl, makeImgMsg, resetData} from '@/utils/index'

function defaultData () {
  return {
    datas: [],
    text: '',
    page: 1,
    loading: false
  }
}

export default {
  data () {
    return defaultData()
  },

  components: {
    bar
  },
  mounted () {
    this.reset()
    this.loadData(1)
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData(1))
  },
  methods: {
    reset () {
      resetData(this, defaultData())
    },
    loadData (page) {
      const {id} = router(this).params()
      return request.get('/chat/bl/room/record/list', {page, size: 10, originId: id, roomType: 1}).then(({json: {data}}) => {
        this.datas = data.data.reverse().map(i => Object.assign(i, {accountInfo: i.accountInfo || {}, date: formatMsgTime(i.gmtCreate), isimg: isImgMsg(i.content), content: isImgMsg(i.content) ? imgMsgUrl(i.content) : i.content})).concat(page === 1 ? [] : this.datas)
        this.page = page
        this.loading = false
        this.nomore = data.pager.totalPages <= page
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onOrder () {
      const {id} = router(this).params()
      router(this).push('/pages/order/main', {id})
    },
    onImg () {
      uiapi.chooseImage().then(r => {
        this.sendMsg(request.upload('/oss/upload', r).then(({json: {data}}) => {
          return makeImgMsg(data)
        }))
      })
    },
    onPreview (img) {
      uiapi.previewImgs([img]).catch(e => uiapi.toast(e))
    },
    sendMsg (content, success) {
      const {id, room} = router(this).params()
      this.sending = true
      const l = uiapi.loading()
      return content.then(s => {
        return request.post('/chat/bl/record', {originId: id, roomId: room, roomType: 1, type: 1, content: s})
      })
        .then(({json: {data}}) => {
          data.date = formatMsgTime(new Date())
          data.isimg = isImgMsg(data.content)
          data.my = true
          data.content = data.isimg ? imgMsgUrl(data.content) : data.content
          this.datas.splice(this.datas.length, 0, data)
          this.sending = false
          l()
          if (success) success()
        }).catch(e => {
          this.sending = false
          l()
          uiapi.toast(e.info)
        })
    },
    onSend () {
      if (this.text) {
        this.sendMsg(Promise.resolve(this.text), () => { this.text = '' })
      }
    }
  }
}
</script>

<style scoped>
.tip{
  width: 750rpx;
  height: 72rpx;
  left: 0;
  top: 0;
  background-color: #FFDDC4;
}
.tip img{
  width: 32rpx;
  height: 32rpx;
}
.content{
  padding-bottom: 88rpx;
  padding-top: 72rpx;
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
  background-color: white;
}
.item .text img{
  width: 236rpx;
  height: 236rpx;
  border-radius: 0 20rpx 20rpx 20rpx;
}
.item.self .text img{
  border-radius: 20rpx 0 20rpx 20rpx;
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
.item.self .text.media{
  background-color: white;
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
  color: white;
  border-radius: 32rpx;
}
.bar .red_bg{
  background-color: #FF8E3B;
}
.bar .red_i_bg{
  background-color: #FF8E3BB0;
}
</style>
