<template>
  <div class="container">
    <img class="bg pos_a" src="/static/images/mine_bg.png" alt="bg">
    <div class="content col flex">
    <navbar :fixed="true">
      <div class="navbar row i-center">
        <div class="flex i-center pad2-l" @click="onBack"><img src="/static/images/arrow_left_white.png" alt="back"></div>
        <div class="big medium flex row center">综合评分</div>
        <div class="flex"></div>
      </div>
    </navbar>
    <div class="col info center">
      <h1>{{scope}}</h1>
      <span class="middle">综合评分</span>
    </div>
    <div class="flex white_bg round pad2-l pad2-r">
      <h5 class="middle blod dark">我的评价标签</h5>
      <p v-if="tags.length === 0" class="margin2-b margin-t light small">暂未收到评价标签</p>
      <ul v-else class="tags row margin2-b">
        <li v-for="(t, i) in tags" :key="i" class="light_bg light small pad2-l pad2-r margin2-r margin-t row center">{{t}}</li>
      </ul>

      <h5 class="middle blod dark margin2-t">规则说明</h5>
      <div class="list">
        <p class="small light margin-t">1. 每次合作结束后15天内，品牌方可对本次合作进行评价;</p>
        <p class="small light margin-t">2. 账号初始评分为满分10分，综合评分越高，申请活动成功率更高；</p>
        <p class="small light margin-t">3. 发布测评后，测评内容应至少保留30天，以免获得【内容未保留】等评价标签；</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import {router} from '@/utils/index'
export default {
  data () {
    return {
      tags: [],
      scope: 0
    }
  },

  components: {
    navbar
  },

  methods: {
    onBack () {
      router(this).pop()
    }
  },

  created () {
    // let app = getApp()
  },
  mounted () {
    const {scope, tags} = router(this).params()
    this.scope = scope
    this.tags = tags.split(',').filter(i => (i !== '' && i !== ' '))
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
.round{
  padding-top: 70rpx;
  border-radius: 40rpx 40rpx 0 0;
}
.tags {
  flex-wrap: wrap;
}
.tags li{
  height: 48rpx;
  border-radius: 24rpx;
}
</style>
