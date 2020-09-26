<template>
  <div class="container white_bg">
    <div class="col i-center content">
    <img :src="img" alt="img">
    <h5 class="dark middle blod margin-t">{{state}}</h5>
    <p class="small light margin-t">{{msg}}</p>
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
      state: '',
      img: '/static/images/act_done.png'
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
  }
}
</script>

<style scoped>
.content {
  padding-top: 160rpx;
}
img{
  width: 220rpx;
  height: 220rpx;
}
</style>
