<template>
  <div class="container light_bg">
    <div class="white_bg pad2 row">
      <div class="flex col c-center margin2-l margin2-r">
        <h5 class="big light blod">
          {{ ["", "待处理", "待支付", "已支付", "已撤销"][data.statusCode] }}
        </h5>
        <p class="middle light margin-t" :class="{ red: data.statusCode < 3 }">
          {{ msg }}
        </p>
      </div>
      <img
        class="state margin2"
        v-if="data.statusCode === 1 || data.statusCode === 2"
        src="/static/images/issue_status_2.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 3"
        src="/static/images/depose_status_4.png"
        alt="status"
      />
      <img
        class="state margin2"
        v-if="data.statusCode === 4"
        src="/static/images/fine_status_4.png"
        alt="status"
      />
    </div>
    <div class="margin-t col white_bg">
      <div class="row pad2 i-center">
        <h5 class="middle dark blod">罚款详情</h5>
        <p class="small light row center margin-l">总罚款不超过产品总价值</p>
      </div>
      <div class="col pad2-l pad2-r pad-b">
        <p class="light small margin-b">罚款金额：{{ data.amount }}元</p>
        <p class="light small margin-b">
          罚款类型：{{ data.type === 1 ? "测评逾期" : "测评违规" }}
        </p>
        <p class="light small margin-b">罚款编号：{{ data.id }}</p>
        <p class="light small margin-b">创建时间：{{ data.date }}</p>
        <div class="row just i-center margin-b" @click="onOrder">
          <p class="light small">订单信息：{{ data.activity.title }}</p>
          <img class="right" src="/static/images/arrow_right.png" alt="right" />
        </div>
      </div>
    </div>
    <div class="margin-t flex col">
      <div class="row white_bg pad2-t pad2-l i-center">
        <h5 class="middle dark blod">罚款明细</h5>
      </div>
      <div v-if="datas.length > 0">
        <div v-for="(item, i) in datas" :key="i" class="row pad2 white_bg item">
          <div class="flex col">
            <h5 class="middle dark">{{ item.description }}</h5>
            <p class="small light">{{ item.date }}</p>
          </div>
          <div class="row center">
            <p class="middle light">{{ item.amount }}元</p>
          </div>
        </div>
      </div>
    </div>
    <bar v-if="data.statusCode < 3">
      <div class="bar">
        <div class="btn" @click="onOk">
          {{ data.statusCode === 1 ? "去处理" : "去支付" }}
        </div>
      </div>
    </bar>
  </div>
</template>

<script>
// import _ from 'underscore'
import moment from 'moment'
import bar from '@/components/bar'
import { router, request, uiapi, api } from '@/utils/index'

export default {
  props: ['id'],
  components: {
    bar
  },
  data () {
    return {
      data: {
        activity: {}
      },
      datas: {},
      loading: false
    }
  },
  computed: {
    msg: function () {
      switch (this.data.statusCode) {
        case 1:
          return '测评已逾期，期间将持续产生罚款'
        case 2:
          return '测评已逾期，期间将持续产生罚款'
        case 3:
          return '继续保持良好的合作行为'
        case 4:
          return this.data.statusRemark
      }
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
  onReachBottom () {},
  methods: {
    loadData () {
      this.loading = true
      const { id } = router(this).params()
      return Promise.all([
        request
          .get('/bl/activity/order/fine/list', { id, page: 1, size: 1 })
          .then(({ json: { data } }) => {
            this.data = data.data[0] || {}
            this.data.date = moment(this.data.gmtCreate).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }),
        request
          .get('/bl/activity/order/fine/record/list', { fineId: id })
          .then(({ json: { data } }) => {
            this.datas = data.map((i) =>
              Object.assign(i, {
                date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
              })
            )
          })
      ])
        .then((r) => {
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          uiapi.toast(e.info)
        })
    },
    onOrder () {
      router(this).push('/pages/order/main', {
        id: this.data.brActivityOrderId
      })
    },
    onOk () {
      if (this.data.statusCode === 1) {
        this.onOrder()
      } else {
        this.payFine()
      }
    },
    payFine () {
      const { id } = router(this).params()
      if (this.loading) {
        return
      }
      this.loading = true
      return request
        .post('/wxpay/mini', {
          amount: request.isTest() ? 0.01 : this.data.amount,
          brActivityId: this.data.brActivityId,
          brActivityOrderId: this.data.brActivityOrderId,
          fineId: id,
          payScene: 'BL_FINE'
        })
        .then(({ json: { data } }) => {
          this.loading = false
          return api.pay(data)
        })
        .then((r) => {
          uiapi.toast('支付成功')
          return this.loadData()
        })
        .catch((e) => {
          this.loading = false
          uiapi.toast(e.info || '支付失败')
        })
    }
  }
}
</script>

<style scoped>
.state {
  width: 188rpx;
  height: 146rpx;
}
.red {
  color: #ff6144;
}
.right {
  width: 32rpx;
  height: 32rpx;
}
.item {
  border-bottom: 1rpx solid #f5f5f5;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 750rpx;
  height: 96rpx;
}
.bar .btn {
  margin: 8rpx 58rpx;
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #ff8e3b;
  color: white;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
