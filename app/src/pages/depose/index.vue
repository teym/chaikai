<template>
  <div class="container light_bg">
    <div class="row pad2 head white_bg">
      <div class="margin2 flex">
        <h5 class="dark middle blod">{{state}}</h5>
        <p class="small light margin-t" :class="{red: info.statusCode >= 2}">{{msg}}</p>
      </div>
      <img :src="img" alt="img">
    </div>
    <div class="row just pad2 margin-t white_bg">
      <p class="middle dark">押金余额</p>
      <span class="red middle">{{data.remainingAmount}}元</span>
    </div>
    <div class="margin-t flex col">
      <h5 class="middle dark blod white_bg pad2-l pad2-t pad2-r">押金明细</h5>
      <div v-if="data.records && data.records.length > 0">
        <div v-for="(item, i) in data.records" :key="i" class="row just pad2 white_bg margin-b">
          <div>
            <h5 class="middle dark">{{item.intro}}</h5>
            <p class="small light">{{item.description}}</p>
          </div>
          <div>
            <h5 class="middle dark text-right">{{item.raeType === 1 ? '+' : '-'}}{{item.amount}}</h5>
            <p class="small light text-right">{{item.date}}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty col i-center white_bg flex">
        <img src="/static/images/depose_empty.png" alt="empty">
        <p class="middle light">{{info.statusCode >= 2 ? '申请成功，请尽快缴纳押金' : '请等待订单审核….'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import moment from 'moment'
import {router, request, uiapi} from '@/utils/index'

export default {
  props: ['status'],
  data () {
    return {
      msg: '',
      state: '已发放',
      img: '/static/images/issue_status_2.png',
      data: {},
      info: {}
    }
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    this.loadData()
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData())
  },
  onReachBottom () {

  },
  methods: {
    loadData () {
      const {id} = router(this).params()
      return request.get('/bl/activity/order/' + id).then(({json: {data}}) => {
        data.depositInfo.records = data.depositInfo.records.map(i => Object.assign(i, {date: moment(i.gmtCreate).format('YYYY.MM.DD HH:mm')}))
        this.info = data
        this.data = data.depositInfo
        this.mapState(data.depositInfo.statusCode)
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    mapState (status) {
      switch (status) {
        case 1:
          this.msg = this.info.statusCode >= 2 ? '申请成功，需在24小时内支付押金，超时将视作放弃活动名额' : '若申请成功，需在24小时内支付押金，超时将视作放弃活动名额'
          this.state = '未缴纳'
          this.img = '/static/images/issue_status_2.png'
          break
        case 2:
          this.msg = this.info.statusCode < 3 ? '若申请不成功，押金自动退还' : '发布测评后15天自动退还'
          this.state = '已冻结'
          this.img = '/static/images/depose_status_3.png'
          break
        case 3:
          this.msg = ''
          this.state = '已解冻'
          this.img = '/static/images/depose_status_4.png '
          break
        case 4:
          this.msg = '测评严重逾期/测评违规'
          this.state = '已扣除'
          this.img = '/static/images/depose_status_4.png '
      }
    }
  }
}
</script>

<style scoped>
.head img{
  width: 168rpx;
  height: 132rpx;
}
.empty img{
  width: 480rpx;
  height: 306rpx;
}
</style>
