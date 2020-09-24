<template>
  <div class="container light_bg">
    <div class="white_bg pad2 row">
      <div class="flex col c-center margin2-l margin2-r">
        <h5 class="big light blod">待缴押金</h5>
        <p class="small light margin-t red">押金支付还剩6时34分，超时将视为自动放弃名额</p>
      </div>
      <img class="state margin2" src="/static/images/issue_status_1.png" alt="status" />
    </div>
    <div class="margin-t white_bg pad2">
      <div class="row just i-center">
        <div class="row i-center">
          <h5 class="middle dark blod">悬赏金额</h5>
          <span class="middle red margin-l">200元</span>
        </div>
        <div class="row i-center">
          <p class="small light">待发放</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
      <div class="row just i-center margin-t">
        <div class="row i-center">
          <h5 class="middle dark blod">押金金额</h5>
          <span class="middle red margin-l">200元</span>
        </div>
        <div class="row i-center">
          <p class="small light">未缴纳</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">申请信息</h5>
      <div class="row margin-t">
        <p class="small light">合作方式：</p>
        <p class="small light flex">博主报价</p>
      </div>
      <div class="row margin-t">
        <p class="small light">合作渠道：</p>
        <ul class="row channel">
          <li v-for="(i, j) in channels" :key="j" :style="{'z-index': 9 - j}">
            <img :src="i.img" :alt="i.name" />
          </li>
        </ul>
      </div>
      <div class="row">
        <p class="small light">申请理由：</p>
        <div class="flex">
          <p class="small light margin-b">之前一直关注品牌，是毛戈平资深粉丝，多平台发布，希望有机会合作</p>
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">合作任务</h5>
      <div class="rule margin-t">
        <img src="/static/images/detail_tip.png" alt="tip" />
      </div>
      <h5 class="middle dark blod margin-t">合作要求</h5>
      <div class="light_bg pad margin-t">
        <div class="row just">
          <p class="light small">合作篇幅</p>
          <p class="text-right flex small dark margin2-l">单篇</p>
        </div>
        <div class="row just margin-t">
          <p class="light small">内容形式</p>
          <p class="text-right flex small dark margin2-l">图文</p>
        </div>
        <div class="row just margin-t">
          <p class="light small">账号话题</p>
          <p class="text-right flex small dark margin2-l">抖音#性价比最高的国货品牌#@毛戈平官方小红书#空瓶好用物#</p>
        </div>
      </div>
    </div>
    <div class="row i-center white_bg pad2 margin-t address">
      <img class="icon" src="/static/images/address_icon.png" alt="icon" />
      <div class="flex col just pad-l pad-r">
        <div class="row just pad-b">
          <p class="middle dark medium">收货人：王丹</p>
          <p class="middle dark medium">18203971874</p>
        </div>
        <span class="small light">浙江省杭州市西湖区蒋村街道杭州互联网创新创….</span>
      </div>
      <img class="right" src="/static/images/arrow_right.png" alt="icon" />
    </div>
    <div class="margin-t white_bg pad2">
      <div class="row info pad-b">
        <img class="img" :src="data.img" alt="img">
        <div class="col just flex margin-l">
          <h5 class="middle dark">{{data.title}}</h5>
          <span class="small light">已选规格：蔓越奶酪；5g</span>
        </div>
      </div>
      <div class="margin-t">
        <p class="light small margin-t">订单编号：201910167788886666 <span class="red">复制</span></p>
        <p class="light small margin-t">申请时间：2020-08-24 23:36:34</p>
      </div>
    </div>
    <div class="bar row pad2 i-center white_bg">
      <div class="btn gray small row center margin-l">修改物流信息</div>
      <div class="btn red small row center margin-l">支付押金</div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import {router, uiapi} from '@/utils/index'
const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'

export default {
  data () {
    return {
      data: {
        title: '小奥汀芝心腮红 猫和老鼠联名奶酪腮红盘正品裸妆自然橘色粉色9g',
        img: ImgUrl
      },
      channels: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}]
    }
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
  }
}
</script>

<style scoped>
.state {
  width: 188rpx;
  height: 146rpx;
}
.channel {
  margin-left: 8rpx;
}
.channel li {
  margin: 0 -8rpx;
}
.channel img {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
.rule img {
  width: 702rpx;
  height: 128rpx;
}
.address .icon {
  width: 44rpx;
  height: 44rpx;
}
.info {
  border-bottom: 1rpx solid #F5F5F5;
}
.info .img{
  width: 208rpx;
  height: 208rpx;
}
.bar{
  justify-content: flex-end;
}
.bar .btn{
  height: 56rpx;
  border-radius: 28rpx;
  padding: 0 32rpx;
}
.bar .btn.red{
  color: #FF8E3B;
  border: 1rpx solid #FF8E3B;
}
.bar .btn.gray{
  color: #C1C6CB;
  border: 1rpx solid #C1C6CB;
}
</style>
