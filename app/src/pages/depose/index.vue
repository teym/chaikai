<template>
  <div class="container light_bg">
    <div class="row pad2 head white_bg">
      <div class="margin2 flex">
        <h5 class="dark middle blod">{{state}}</h5>
        <p class="small light margin-t">{{msg}}</p>
      </div>
      <img :src="img" alt="img">
    </div>
    <div class="row just pad2 margin-t">
      <p class="middle dark">押金余额</p>
      <span class="red middle">{{data.amount}}元</span>
    </div>
    <div class="pad2 marign-t flex">
      <h5 class="middle dark blod">押金明细</h5>
      <div v-if="list.length === 0" class="empty col i-center">
        <img src="static/images/depose_empty.png" alt="empty">
        <p class="middle light">请等待订单审核….</p>
      </div>
      <div v-else>
        <div v-for="(item, i) in list" :key="i" class="row just pad2">
          <div>
            <h5 class="middle dark">押金缴纳</h5>
            <p class="small light">交易单号：17898764567</p>
          </div>
          <div>
            <h5 class="middle dark">+199.00</h5>
            <p class="small light">2020.03.01 12:10</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import {router} from '@/utils/index'

export default {
  props: ['status'],
  data () {
    return {
      msg: '',
      state: '已发放',
      img: '/static/images/issue_status_2.png',
      data: {},
      list: []
    }
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    const {status} = router(this).params()
    switch (status) {
      case '1':
        this.msg = '提交测评后，15天自动发放'
        this.state = '待发放'
        this.img = '/static/images/reward_status_3.png'
        break
      case '2':
        this.msg = ''
        this.state = '已发放'
        this.img = '/static/images/act_done.png'
        break
      case '3':
        this.msg = '测评逾期/测评违规/不符合悬赏规范/未达成合作'
        this.state = '已取消'
        this.img = '/static/images/reward_status_3.png'
        break
    }
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
    loadData() {
      onst {status, id} = router(this).params()

    }
  }
}
</script>

<style scoped>
.head img{
  width: 168rpx;
  height: 132rpx;
}
</style>
