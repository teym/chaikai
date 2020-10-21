<template>
  <div class="container">
    <img class="bg pos_a" src="/static/images/mine_bg.png" alt="bg">
    <div class="content col flex">
    <navbar :fixed="true">
      <div class="navbar row i-center">
        <div class="flex i-center pad2-l" @click="onBack"><img src="/static/images/arrow_left_white.png" alt="back"></div>
        <div class="big medium flex row center">钱包收入</div>
        <div class="flex"></div>
      </div>
    </navbar>
    <div class="col info center pos_r">
      <h1>{{amount}}</h1>
      <span class="middle">悬赏</span>
      <div class="float small pos_a row center" @click="onList">明细</div>
    </div>
    <div class="flex white_bg round pad2-l pad2-r">
      <h5 class="middle blod dark margin2-t">如何获得悬赏</h5>
      <div class="list">
        <p class="small light margin-t">报名参加活动，合作模式选择【接受悬赏】【达人报价】，达人完成合作任务后，可获得一定的悬赏</p>
      </div>
      <h5 class="middle blod dark margin2-t">规则说明</h5>
      <div class="list">
        <p class="small light margin-t">1.一悬赏提现相当于1元人民币；</p>
        <p class="small light margin-t">2.所有已发放的悬赏均可提现，每月可提现一次；</p>
        <p class="small light margin-t">3.当日提交的提现申请，将在24小时内，提现至微信钱包；</p>
        <p class="small light margin-t">4.因合作过程有歧义导致发放悬赏金额有误，可联系客服解决；</p>
        <p class="small light margin-t">5.因系统故障导致提现和发放悬赏有误，拆开平台有权追回差额；</p>
        <p class="small light margin-t">6.已发放的悬赏无法赠与或交易，用户应妥善保管账户</p>
      </div>
    </div>
    <div class="btn row center middle medium" @click="onGo">去提现</div>
    <done v-if="tip" message="您的提现申请已提交，请耐心等待～" />
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import {router, uiapi, request} from '@/utils/index'
import done from '@/components/done'

export default {
  data () {
    return {
      tip: false,
      amount: 0
    }
  },

  components: {
    navbar,
    done
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      request.get('/bl/account/finance').then(({json: {data}}) => {
        this.amount = data.totalAmount
      }).catch(e => {
        console.log(e)
      })
    },
    onBack () {
      router(this).pop()
    },
    onList () {
      router(this).push('/pages/list/main')
    },
    onGo () {
      uiapi.alert({ title: '提现确认', content: `确认提现当前悬赏月：${this.amount}元，确认将消耗一次提现次数` }).then(r => {
        const l = uiapi.loading()
        request.post('/bl/account/finance/withdraw', {amount: this.amount}).then(r => {
          uiapi.toast('提现成功')
          this.loadData()
          setTimeout(() => {
            l()
          }, 500)
        }).catch(e => {
          l()
          uiapi.toast(e.info)
        })
      }).catch(e => {

      })
    }
  },

  created () {
    // let app = getApp()
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
.navbar img{
  width: 44rpx;
  height: 44rpx;
}
.navbar div{
  color: white;
}
.content{
  z-index: 1;
}
.info {
  padding: 8rpx 0 24rpx 0;
}
.info h1{
  font-size: 96rpx;
  font-weight: 500;
  line-height: 120rpx;
  color: white;
}
.info span{
  color: white;
  opacity: 0.8;
}
.float{
  right: 0;
  top: 54rpx;
  height: 40rpx;
  border-radius: 20rpx 0 0 20rpx;
  padding: 0 10rpx 0 20rpx;
  background-color: #FFFFFF50;
  color: white;
}
.round{
  padding-top: 70rpx;
  border-radius: 40rpx 40rpx 0 0;
}
.tags li{
  height: 48rpx;
  border-radius: 24rpx;
}
.btn{
  margin: 54rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #FF8E3B;
  color: white;
}
</style>
