<template>
  <div class="container col light_bg">
    <div class="white_bg pad2 row">
      <div class="flex col c-center margin2-l margin2-r">
        <h5 class="big light blod">{{status[data.statusCode]}}</h5>
        <p class="small light margin-t" 
        :class="{red:data.statusCode === 1 || data.statusCode === 4 || data.statusCode === 7, light:data.statusCode != 1 && data.statusCode != 4 && data.statusCode != 7}">{{msg}}</p>
      </div>
      <img class="state margin2" v-if="data.statusCode === 1" src="/static/images/issue_status_2.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 2" src="/static/images/issue_status_1.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 3" src="/static/images/issue_status_2.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 4" src="/static/images/issue_status_6.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 5" src="/static/images/issue_status_3.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 6" src="/static/images/issue_status_3.png" alt="status" />
      <img class="state margin2" v-if="data.statusCode === 7" src="/static/images/issue_status_3.png" alt="status" />

    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">投诉详情</h5>
      <div class="row margin-t">
        <p class="small light">工单编号：</p>
        <p class="small light flex">{{data.id}}</p>
      </div>
      <div class="row margin-t">
        <p class="small light">投诉时间：</p>
        <p class="small light flex">{{data.date}}</p>
      </div>
      <div class="row margin-t">
        <p class="small light">投诉理由：</p>
        <div>
          <p v-for="(item, i) in data.items" :key="i" class="small light flex margin-b">{{i+1}}.{{item.content}}</p>
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2">
      <h5 class="middle dark blod">投诉测评</h5>
      <div v-for="(item, i) in data.ticketedEvaluations" :key="i" class="row just i-center margin-t">
        <div class="row i-center">
          <img class="icon" :src="item.img" :alt="item.platformName" />
          <p class="small light margin-l">正式测评</p>
        </div>
        <div class="row i-center" @click="onDetail(item)">
          <p class="small light">{{item.date}}</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t white_bg pad2" v-if="data.modifiedEvaluations && data.modifiedEvaluations.length > 0">
      <h5 class="middle dark blod">修改测评</h5>
      <div v-for="(item, i) in data.modifiedEvaluations" :key="i" class="row just i-center margin-t">
        <div class="row i-center">
          <img class="icon" :src="item.img" :alt="item.platformName" />
          <p class="small light margin-l">正式测评</p>
        </div>
        <div class="row i-center" @click="onDetail(item)">
          <p class="small light">{{item.date}}</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="flex"></div>
    <div class="btn row center" @click="onGo" v-if="data.statusCode === 1 || data.statusCode === 4">重新提交</div>
  </div>
</template>

<script>
// import _ from 'underscore'
import moment from 'moment'
import {router, uiapi, request, mapChannel, diffTime} from '@/utils/index'

export default {
  data () {
    return {
      data: {

      },
      msg: '',
      status: ['', '待修改', '待确认', '小二审核中', '待重评', '已修改', '已取消', '已违规']
    }
  },
  onShow () {
    const {id} = router(this).params()
    this.loadData(id)
  },
  onPullDownRefresh () {
    const {id} = router(this).params()
    uiapi.waitRefresh(this.loadData(id))
  },
  onReachBottom () {

  },
  methods: {
    loadData (id) {
      return request.get('/ticket/ao/detail/' + id, {}).then(({json: {data}}) => {
        data.date = moment(data.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
        data.ticketedEvaluations = mapChannel(data.ticketedEvaluations).map(i => Object.assign(i, {date: moment(i.gmtCreate).format('YYYY.MM.DD')}))
        data.modifiedEvaluations = mapChannel(data.modifiedEvaluations).map(i => Object.assign(i, {date: moment(i.gmtCreate).format('YYYY.MM.DD')}))
        this.data = data
        this.title = this.status[data.statusCode]
        this.msg = this.mapStatus(data.statusCode, data.deadline)
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    mapStatus (s, t) {
      const time = diffTime(t, '0分0秒')
      console.log('state', t, time);
      switch (s) {
        case 1:
          return `修改测评还剩${time}，超时将由小二介入`
        case 2:
          return `品牌确认修改还剩${time}，超时将自动确认`
        case 3:
          return '请等待小二审核'
        case 4:
          return `修改测评还剩${time}，超时将判违规，并扣除押金`
        case 5:
          return ''
        case 6:
          return ''
        case 7:
          return '处理超时/违规'
      }
    },
    onGo () {
      router(this).push('/pages/tester/main', {id: this.data.brActivityOrderId, issue: true, ticketId: this.data.id})
    },
    onDetail (item) {
      router(this).push('/pages/web/main', {url: item.url})
    }
  }
}
</script>

<style scoped>
.state {
  width: 188rpx;
  height: 146rpx;
}
.icon {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
.btn{
  margin: 54rpx;
  height: 80rpx;
  border-radius: 40rpx;
  color: white;
  background-color: #FF8E3B;
}
</style>
