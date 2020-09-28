<template>
  <div class="container light_bg">
    <div v-if="datas.length === 0" class="col center empty white_bg flex">
      <img src="/static/images/issue_empty.png" alt="img" />
      <p class="light middle">暂无问题订单</p>
    </div>
    <div v-else class="flex">
      <div v-for="(item, j) in datas" :key="j" class="col pad2 item margin-b white_bg">
        <div class="row">
          <img :src="item.activity.picUrl" alt="img" class="logo" />
          <h5 class="middle medium dark flex margin-l">{{item.activity.title}}</h5>
        </div>
        <div class="col margin-t">
          <div class="row just i-center" v-for="(t, i) in item.tickets" :key="i">
            <p class="middle light">
              测评投诉
              <span class="small light">{{item.date}}</span>
            </p>
            <div class="red middle row i-center" 
            @click="onDetail(item, t)"
            :class="{red:t.statusCode===1||t.statusCode ===4|| t.statusCode === 7,light:t.statusCode!=1&&t.statusCode !=4 && t.statusCode != 7}">
              {{['','待修改','待确认','小二审核中','待重评','已修改','已取消','已违规'][t.statusCode]}}
              <img src="/static/images/arrow_right.png" alt="right" class="right" />
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
    if (this.loading || this.nomore) {
      return
    }
    this.loadData(this.page + 1)
  },
  methods: {
    loadData (page) {
      request.get('/bl/activity/order/ticket/list', {page, size: 10}).then(({json: {data}}) => {
        this.datas = (page === 1 ? [] : this.datas).concat(data.data.map(i => Object.assign(i, {date: moment(i.gmtCreate).format('YYYY.MM.DD')})))
        this.loading = false
        this.nomore = data.pager.totalPages <= page
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onDetail (item, t) {
      router(this).push('/pages/issue/main', {id: t.id})
    }
  }
}
</script>

<style scoped>
.empty img {
  width: 480rpx;
  height: 306rpx;
}
.item .logo{
  width: 208rpx;
  height: 208rpx;
}
.item .right{
  width: 44rpx;
  height: 44rpx;
}
</style>
