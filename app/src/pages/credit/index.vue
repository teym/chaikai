<template>
  <div class="container light_bg">
    <div class="col center head white_bg">
      <img v-if="credit === 20" src="/static/images/credit_good.png" alt="img">
      <img v-else src="/static/images/reward_status_3.png" alt="img">
      <p class="small light margin-t" :class="{red: credit !== 20}">{{ credit === 20 ? '信用良好' : '信用风险'}}</p>
    </div>
    <div class="margin-t flex col">
      <div class="row white_bg pad2 i-center">
        <h5 class="middle dark blod flex">押金明细</h5>
        <p class="small light row center" @click="onRule"><img src="/static/images/detail_mark.png" class="tip_mark"/>信用规则</p>
      </div>
      <div v-if="datas.length > 0">
        <div v-for="(item, i) in datas" :key="i" class="row pad2 white_bg item" @click="onItem(item)">
          <div class="flex col">
            <h5 class="middle dark">{{item.type === 1 ? '测评逾期' : '测评违规'}}</h5>
            <p class="small light">{{item.activity.title}}</p>
          </div>
          <div class="row center">
            <p class="middle light" :class="{red: item.statusCode < 3}">{{['','待处理','待支付','已支付','已撤销'][item.statusCode]}}</p>
            <img
              class="right"
              src="/static/images/arrow_right.png"
              alt="right"
            />
          </div>
        </div>
      </div>
      <div v-else class="empty col i-center white_bg flex">
        <img src="/static/images/depose_empty.png" alt="empty">
        <p class="middle light">太棒了，保持良好的信用，将获得更多合作喔</p>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import moment from 'moment'
import {router, request, uiapi} from '@/utils/index'

export default {
  props: ['credit'],
  data () {
    return {
      credit: 20,
      datas: {},
      page: 1,
      loading: false,
      nomore: false
    }
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    const {credit} = router(this).params()
    this.credit = parseInt(credit) || 20
    this.loadData(1)
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData(1))
  },
  onReachBottom () {
    if (this.loading || this.nomore) {
      return
    }
    this.loadData(this.page + 1)
  },
  methods: {
    loadData (page) {
      this.loading = true
      return request.get('/bl/activity/order/fine/list', {page: page, size: 10}).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat(data.data)
        this.nomore = data.pager.totalPages <= page
        this.page = page
        this.loading = false
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onItem (item) {
      router(this).push('/pages/fine/main', {id: item.id})
    },
    onRule () {
      console.log('rule')
    }
  }
}
</script>

<style scoped>
.tip_mark{
  width: 26rpx;
  height: 26rpx;
}
.head{
  padding: 48rpx 0;
}
.head img{
  width: 220rpx;
  height: 220rpx;
}
.empty img{
  width: 480rpx;
  height: 306rpx;
}
.item{
  border-bottom: 1rpx solid #F5F5F5;
}
.red {
  color: #FF6144;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
</style>
