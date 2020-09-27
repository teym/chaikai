<template>
  <div class="container light_bg">
    <div v-if="datas.length === 0" class="col center empty white_bg flex">
      <img src="/static/images/list_empty.png" alt="img">
      <p class="light middle">暂无悬赏明细</p>
    </div>
    <div v-else class="flex">
    <div v-for="(item, j) in datas" :key="j" class="col pad2 item margin-b white_bg">
      <div class="row just">
        <h5 class="middle medium dark">{{item.title}}</h5>
        <span class="middle medium dark">{{(item.raeType === 1 ? '+' : '-') + item.amount}}</span>
      </div>
      <p v-if="item.msg2" class="dark small">{{item.msg}}</p>
      <p class="light small">{{item.intro}}</p>
      <p class="light small">{{(item.raeType === 1 ? '发放时间：' : '提现时间：') + item.date}}</p>
    </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import moment from 'moment'
import {uiapi, request} from '@/utils/index'

export default {
  data () {
    return {
      datas: [],
      page: 0,
      loading: false,
      nomore: false
    }
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    this.loadData(1)
  },
  onPullDownRefresh () {
    this.loadData(1)
  },
  onReachBottom () {
    if (this.loading || (this.page > 1 && !this.nomore)) { return }
    this.loadData(this.page + 1)
  },
  methods: {
    loadData (page) {
      request.get('/bl/account/finance/record/list', {page, size: 10}).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat(data.data.map(i => Object.assign(i, {date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm')})))
        this.page = page
        this.loading = false
        this.nomore = data.pager.totalPages <= page
      }).catch(e => {
        uiapi.toast(e.info)
      })
    }
  }
}
</script>

<style scoped>
.item div{
  margin-top: 8rpx;
}
.item p{
  margin-top: 8rpx;
}
.empty img{
  width: 480rpx;
  height: 306rpx;
}
</style>
