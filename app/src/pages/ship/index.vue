<template>
  <div class="container container-full">
    <div v-if="ship" class="ship">
      <div class="ship_head">
        <img :src="ship.logo" class="ship_img" />
        <div class="ship_info">
          <p class="ship_title">{{ship.name}}</p>
          <p class="ship_value">{{ship.no || ''}}<span class="copy" @click="onCopy(ship.no || '')">复制</span></p>
        </div>
      </div>
      <div class="flow">
        <div v-for="(i, j) in ship.list" :key="j" class="flow_row">
          <div class="flow_dot">
            <div
              :class="{flow_line_f: j===0, flow_line_l:j >= ship.list.length - 1, flow_line: j < ship.list.length }"
            ></div>
            <div :class="{flow_point: true,flow_point_f: j=== 0}"></div>
          </div>
          <div class="flow_info">
            <p :class="{flow_title: true, flow_text_a: j <= 0}">{{i.content}}</p>
            <p :class="{flow_sub: true, flow_text_a: j <= 0}">{{i.time}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, router, uiapi, api } from '@/utils/index'

export default {
  data () {
    return {
      ship: null
    }
  },
  mounted () {
    this.loadData()
  },
  onPullDownRefresh () {
    uiapi.waitRefresh(this.loadData())
  },
  methods: {
    loadData () {
      const {id} = router(this).params()
      return request
        .get('/common/logistics', { no: id })
        .then(({ json: {data} }) => {
          this.ship = data
        })
        .catch(e => {
          uiapi.toast(e.info)
        })
    },
    onCopy (txt) {
      api.copy(txt).then(() => uiapi.toast('复制成功'))
    }
  }
}
</script>

<style scoped>
.empty {
  padding-top: 288rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty img {
  width: 480rpx;
  height: 372rpx;
}
.empty p {
  font-size: 26rpx;
  color: #999999;
}
.ship {
  margin-bottom: 16rpx;
}
.ship_head {
  display: flex;
  flex-direction: row;
  padding: 24rpx;
  background-color: white;
}
.ship_img {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: lightgray;
}
.ship_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rpx 16rpx;
}
.ship_title {
  font-size: 32rpx;
  color: #333333;
}
.ship_value {
  font-size: 28rpx;
  color: #9b9b9b;
}
.copy {
  color: #ff8e3b;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border: 1rpx solid #ff8e3b;
  border-radius: 4rpx;
  margin: 0 8rpx;
  background-color: white;
}
.flow {
  display: flex;
  flex-direction: column;
  background-color: white;
}
.flow_row {
  display: flex;
  flex-direction: row;
}
.flow_dot {
  width: 40rpx;
  display: flex;
  flex-direction: column;
  padding: 0 16rpx;
  align-items: flex-end;
  position: relative;
}
.flow_line_f {
  margin-top: 44rpx;
}
.flow_line {
  width: 4rpx;
  background-color: #f5f5f5;
  flex: 1;
}
.flow_line_l {
  width: 4rpx;
  background-color: #f5f5f5;
  height: 44rpx !important;
  flex: initial;
}
.flow_point_f {
  width: 24rpx;
  height: 24rpx;
  border-radius: 12rpx;
  background-color: #ff8e3b !important;
  position: absolute;
  top: 40rpx;
  right: 6rpx;
}
.flow_point {
  width: 16rpx;
  height: 16rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  position: absolute;
  top: 44rpx;
  right: 10rpx;
}
.flow_info {
  display: flex;
  flex-direction: column;
  padding: 32rpx 24rpx 32rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  width: 670rpx;
}
.flow_text_a {
  color: #ff8e3b !important;
}
.flow_title {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #9b9b9b;
}
.flow_sub {
  margin-top: 24rpx;
  font-size: 24rpx;
  color: #9b9b9b;
}
</style>
