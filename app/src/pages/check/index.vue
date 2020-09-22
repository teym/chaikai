<template>
  <div class="container">
    <div class="light_bg flex pos-r">
      <div class="pad2-l pad2-r pad-t pad-b address margin-t white_bg">
        <div v-if="!address" class="empty row i-center">
          <img src="/static/images/address_add.png" alt="add">
          <p class="margin-l middle dark">手动添加收货地址</p>
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t row info">
        <img :src="data.img" alt="img">
        <div class="col just margin-l flex">
          <h5 class="middle dark medium">{{data.title}}</h5>
          <span class="small light">已选规格：{{data.sku}}</span>
        </div>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b margin-t white_bg row just i-center">
        <h5 class="middle dark medium">选择合作方式：</h5>
        <ul class="row">
          <li class="small row center red red_bg pad-l pad-r round-btn">接受悬赏</li>
        </ul>
      </div>

      <div class="pad2-l pad2-r pad-t pad-b margin-t white_bg task">
        <h5 class="middle dark blod">合作任务</h5>
        <div class="rule margin-t">
          <img src="/static/images/detail_tip.png" alt="tip">
        </div>
        <div class="pad-b">
            <h5 class="middle dark blod">合作要求</h5>
            <div class="light_bg margin-t pad-l pad-r pad-b">
              <div class="row just margin-t">
                <p class="small normal light">合作要求</p>
                <div class="small medium light text-right flex">200/人</div>
              </div>
              <div class="row just margin-t">
                <p class="small normal light">合作篇幅</p>
                <p class="small medium light text-right flex">单篇</p>
              </div>
              <div class="row just margin-t">
                <p class="small normal light">优惠信息</p>
                <p class="small medium light text-right flex">覆置内容₴tDx71ykFZr7₴咑幵淘tao寳或掂击炼接 https://m.tb.cn/</p>
              </div>
            </div>
        </div>
      </div>

        <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t">
          <h5 class="middle dark blod">合作渠道<span class="small light normal margin-l">承诺同步的渠道越多，通过率越高</span></h5>
          <ul class="channels margin-t">
            <li v-for="(i, j) in channels" :key="j" class="row just margin-t">
              <div class="row i-center"><img class="margin-r" :src="i.img" :alt="i.name" />{{i.name}}</div>
              <img class="check-img" v-if="active[i.id]" src="/static/images/check.png" alt="check">
              <img class="check-img" v-else src="/static/images/checked.png" alt="checked">
            </li>
          </ul>
        </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t price">
        <h5 class="middle dark blod">报价金额</h5>
        <ul class="row margin-t">
          <li class="small row center red red_bg pad-l pad-r round-btn">2倍悬赏</li>
          <li class="small row center red red_bg pad-l pad-r round-btn">4倍悬赏</li>
          <li class="small row center red red_bg pad-l pad-r round-btn">6倍悬赏</li>
        </ul>
        <div class="row just i-center margin-t">
          <h5 class="middle dark blod">押金支付方式</h5>
          <p class="small light normal margin-l">审核不通过自动退回</p>
        </div>
        <div class="row just i-center pay margin-t">
          <h6 class="middle normal dark row i-center">立即缴纳 <span class="first">优先推荐</span></h6>
          <img class="check-img" v-if="pay === 1" src="/static/images/check.png" alt="check">
          <img class="check-img" v-else src="/static/images/checked.png" alt="checked">
        </div>
        <div class="row just i-center margin-t">
          <h6 class="middle normal dark row">报名成功后支付</h6>
          <img class="check-img" v-if="pay === 2" src="/static/images/check.png" alt="check">
          <img class="check-img" v-else src="/static/images/checked.png" alt="checked">
        </div>
      </div>
      <div class="pad2-l pad2-r pad-t pad-b white_bg margin-t">
        <h5 class="middle dark blod">填写申请理由</h5>
        <div class="pad-l pad-t pad-r input light_bg">
          <textarea class="middle dark normal" placeholder="表达更多合作意向，能提高通过率喔~"></textarea>
          <p class="small light normal right">12/200</p>
        </div>

        <div class="row just">
          <p>可获得<span>200</span>悬赏</p>
          <div class="btn">提交申请</div>
        </div>
      </div>
    </div>
        <div v-if="tip" class="pop">
      <div class="pop-content bottom">
        <h6>合作要求特殊说明：</h6>
        <p>小红书：因添加优惠信息后，内容屏蔽风险较高，内容正文和评论中暂不支持添加优惠信息</p>
      </div>
      <div class="place" @click="tip=false"></div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import {router, uiapi} from '@/utils/index'

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      data: {
        img: ImgUrl,
        title: '小奥汀芝心腮红 猫和老鼠联名奶酪腮红盘正品裸妆自然橘色粉色9g',
        sku: 'abcd'
      },
      address: null,
      type: 1,
      price: null,
      pay: 1,
      channels: [{name: 'b', img: '/static/images/channel_bi.png'}, {name: 'w', img: '/static/images/channel_wb.png'}],
      loading: false,
      active: {},
      pop: false,
      text: ''
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
    onSelect (sku, item) {
      this.active = Object.assign({}, this.active, _.object([[sku.id, item]]))
    },
    onOk () {
      const t = Math.random()
      if (t < 0.4) {
        this.pop = true
      } else {
        if (t < 0.7) {
          uiapi.alert({ title: '温馨提示', content: '抱歉，您无法申请该活动，需认证以下渠道：抖音/微博/小红书' }).then(r => {
            router(this).push('/pages/auth/main')
          }).catch(e => {

          })
        } else {
          uiapi.toast('今日申请次数已用完')
        }
      }
    },
    onGo () {
      if (_.size(this.active) === _.size(this.data.skus)) {
        router(this).push('/pages/check/main')
      } else {
        uiapi.toast('请选择商品规格')
      }
    }
  }
}
</script>

<style scoped>
.address img{
  width: 44rpx;
  height: 44rpx;
}
.info img{
  width: 208rpx;
  height: 208rpx;
}
.round-btn{
  height: 48rpx;
  border-radius: 24rpx;
}
.channels div img{
  width: 44rpx;
  height: 44rpx;
}
.task .rule img{
  width: 702rpx;
  height: 128rpx;
}
.check-img{
  width: 44rpx;
  height: 44rpx;
}
.first{
  background-color: #FF6144;
  border-radius: 8px 8px 8px 0px;
  font-size: 18rpx;
  color: white;
  padding: 4rpx 8rpx;
}
/* .block{
  background-color: white;
}
h5 {
  font-size: 28rpx;
  font-weight: 500;
  color: #494c5e;
}

.address p{
  font-size: 28rpx;
  color: #494C5E;
  margin-left: 16rpx;
}
.info {
  padding: 24rpx;
  background-color: white;
}

.info div{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
  margin-left: 16rpx;
}
.info div h5{
  font-weight: 400;
}
.info div span{
  font-size: 24rpx;
  color: #7B7F8E;
}

.task{
  padding: 0 24rpx;
}
.task .rule{
  padding: 24rpx 0 0 0;
}
.task .rule img{
  width: 702rpx;
  height: 128rpx;
}
.task .round-btn{
  font-size: 24rpx;
  color: #FF8E3B;
  font-weight: 500;
  background-color: #FF8E3B2E;
  height: 48rpx;
  border-radius: 24rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pop{
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  z-index: 50;
}
.pop .place{
  flex: 1;
}
.pop-content{
  position: relative;
  border-radius: 20rpx 20rpx 0 0;
  background-color: white;
  padding: 40rpx 24rpx;
}
.pop-content .close{
  position: absolute;
  right: 16rpx;
  top: 32rpx;
  width: 48rpx;
  height: 48rpx;
}
.pop-content h5{
  font-size: 32rpx;
  color: #494C5E;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16rpx;
} */
</style>
