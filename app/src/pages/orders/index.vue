<template>
  <div class="container light_bg">
    <div class="col flex">
      <div class="tabs row white_bg pad2-l pad2-r">
        <div v-for="(tab, i) in status" :key="i" class="col i-center tab" :class="{active: i === active}" @click="onActive(i)">
          <p class="margin2-t">{{tab}}</p>
          <div class="margin2-t"></div>
        </div>
      </div>
      <div v-if="datas.length === 0" class="col center empty white_bg flex">
        <img src="/static/images/issue_empty.png" alt="img" />
        <p class="light middle">你还没有订单呢～</p>
      </div>
      <div v-else class="flex">
        <div v-for="(item, j) in datas" :key="j" class="row pad2 item margin-b white_bg" @click="onOrder(item)">
          <img class="logo" :src="item.activity.picUrl" alt="logo">
          <div class="flex col just margin-l">
            <p class="middle dark">{{item.activity.title}}</p>
            <div class="row just i-center">
              <p class="small light">{{item.date}}</p>
              <span class="red small">{{['', '待审核', '待缴押金', '待发货', '待收货', '待测评', '已测评', '已关闭'][item.statusCode]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import moment from 'moment'
import {router, uiapi, request} from '@/utils/index'

export default {
  data () {
    return {
      active: 0,
      status: ['全部', '待缴押金', '待发货', '待收货', '待测评', '已测评'],
      datas: [],
      loading: false,
      page: 1,
      nomore: false
    }
  },
  mounted () {
    const status = parseInt(router(this).params().status)
    if (status > 0) {
      this.active = status - 1
    }
    this.loadData(1)
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData(1))
  },
  onReachBottom () {
    if (!(this.loading || this.nomore)) {
      this.loadData(this.page + 1)
    }
  },
  methods: {
    onActive (i) {
      this.active = i
      this.datas = []
      this.loadData(1)
    },
    loadData (page) {
      return request.get('/bl/activity/order/list', Object.assign({page: page, size: 10}, this.active > 0 ? {statusCode: this.active + 1} : {})).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat((data.data || []).map(i => Object.assign({date: moment(i.gmtCreate).format('YYYY.MM.DD')}, i)))
        this.nomore = data.pager.totalPages <= page
        this.page = page
        this.loading = false
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onOrder (item) {
      router(this).push('/pages/order/main', {id: item.id})
    }
  }
}
</script>

<style scoped>
.tabs{
  justify-content: space-between;
}
.tabs .tab p{
  font-size: 26rpx;
  line-height: 32rpx;
  color: #7B7F8E;
}
.tabs .tab.active p{
  color: #FF8E3B;
  font-size: 28rpx;
}
.tabs .tab div{
  height: 2rpx;
  width: 50rpx;
  background-color: white;
}
.tabs .tab.active div{
  background-color: #FF8E3B;
}
.item .logo{
  width: 208rpx;
  height: 208rpx;
}
.empty img {
  width: 480rpx;
  height: 306rpx;
}
</style>
