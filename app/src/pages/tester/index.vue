<template>
  <div class="container white_bg">
    <div class="flex" v-if="!append">
    <div v-for="(item, i) in datas" :key="i" class="item pad2-l pad2-t pad2-r">
      <div class="row i-center">
        <img :src="item.img" :alt="item.platformName">
        <p class="dark middle blod margin-l">{{item.platformName}}</p>
      </div>
      <div class="light_bg pad margin-t">
        <input class="middle dark" type="text" v-model="item.url" :placeholder="'请输入'+item.platformName+'测评链接'">
      </div>
    </div>
    </div>
    <div class="flex pad2" v-else>
      <div class="row margin2-t" v-for="(item, i) in datas" :key="i">
        <div class="row i-center pop-menu middle light" @click="item.pop = true">
          {{item.platformName}}
          <div class="tag" :class="{pop: item.pop}">
            <span>{{item.pop ? '▲' : '▼'}}</span>
            <div v-if="item.pop" class="mask" @click.stop="item.pop = false"></div>
          <div class="pop-menu-content" v-if="item.pop">
            <div class="tga"></div>
            <div class="col menu-items">
              <p class="small margin" v-for="(p, j) in channels" :key='j' @click.stop="Object.assign(item, p, {pop:false})">{{p.platformName}}</p>
            </div>
          </div>
          </div>
        </div>
        <div class="flex row light_bg pad i-center">
          <input class="middle dark flex" type="text" v-model="item.url" :placeholder="'请输入追加的测评链接'">
          <span class="red small" @click="onDel(i)">删除</span>
        </div>
      </div>
      <div class="row margin2-t">
        <div class="pop-menu"></div>
        <div class="add-btn row center small" @click="onAdd">+添加</div>
      </div>
    </div>
    <div class="btn middle blod row center" @click="onOK">提交测评</div>
  </div>
</template>

<script>
// import _ from 'underscore'
// import moment from 'moment'
import {uiapi, router, request, mapChannel, matchURL} from '@/utils/index'

export default {
  data () {
    return {
      append: false,
      datas: [],
      channels: [],
      loading: false
    }
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
    checkLinks (list) {
      return Promise.all(list.map(i => {
        return new Promise((resolve, reject) => {
          const e = new Error()
          e.info = '请输入正确的' + i.platformName + '测评链接'
          if (!i.url) {
            return reject(e)
          }
          return i.match.find(m => m.test(i.url)) ? resolve() : reject(e)
        })
      }))
    },
    loadData () {
      const {id, append, issue, ticketId} = router(this).params()
      this.append = !!append;

      (issue ? request.get('/ticket/ao/detail/' + ticketId, {}).then(({json: {data}}) => {
        return data.ticketedEvaluations || []
      }) : request.get('/bl/activity/order/' + id).then(({json: {data}}) => {
        return data.channels
      })).then(c => {
        this.channels = mapChannel(append ? null : c).map(i => Object.assign(i, {url: ''}))
        if (append) {
          this.datas = [Object.assign({}, this.channels[0], {pop: false})]
        } else {
          this.datas = [].concat(this.channels)
        }
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onAdd () {
      this.datas.splice(this.datas.length, 0, Object.assign({}, this.channels[0], {pop: false}))
    },
    onDel (i) {
      this.datas.splice(i, 1)
    },
    onOK () {
      const datas = this.datas.map(i => Object.assign(i, {url: matchURL(i.url)}))
      for (let index = 0; index < datas.length; index++) {
        const element = datas[index]
        if (!element.url) {
          return uiapi.toast('请输入' + element.platformName + '测评链接')
        }
      }
      if (datas.length <= 0) {
        uiapi.toast('请输入测评链接')
        return
      }
      const {id, append, issue, ticketId} = router(this).params()
      const l = uiapi.loading()
      this.checkLinks(datas).then(
        () => request.post('/bl/activity/order/evaluation', {brActivityOrderId: id, type: append ? 2 : 1, scene: issue ? 2 : 1, list: datas, ticketId: ticketId || ''})
      ).then(r => {
        l()
        uiapi.toast('已提交')
        router(this).pop()
      }).catch(e => {
        l()
        uiapi.toast(e.info)
      })
    }
  }
}
</script>

<style scoped>
.item img {
  width: 60rpx;
  height: 60rpx;
}
.pop-menu {
  width: 120rpx;
}
.pop-menu .tag {
  position: relative;
  margin-left: 8rpx;
}
.pop-menu .tag span {
  font-size: 20rpx;
  color: #999999;
}
.pop-menu .tag.pop span {
  color: #ff8e3b;
}
.pop-menu .mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.pop-menu .pop-menu-content {
  position: absolute;
  z-index: 2;
  top: 50rpx;
  left: -40rpx;
  width: 220rpx;
  box-shadow: 0px 0px 6px 0px rgba(167, 167, 167, 0.29);
  background-color: white;
}
.pop-menu .pop-menu-content .tga {
  position: absolute;
  left: 40rpx;
  top: -10rpx;
  width: 10rpx;
  height: 10rpx;
  transform: rotate(45deg);
  background-color: white;
  z-index: 1;
}
.pop-menu .pop-menu-content .menu-items {
  z-index: 2;
}
.add-btn {
  border: 1px dashed #999999;
  height: 48rpx;
  padding: 0 28rpx;
  border-radius: 12rpx;
  color: #999999;
}
.btn {
  margin: 54rpx;
  height: 80rpx;
  border-radius: 40rpx;
  color: white;
  background-color: #ff8e3b;
}
</style>
