<template>
  <div class="container">
    <navbar :fixed="true" background="white">
      <div class="navbar">
        <p>
          活动
          <span>今日还可申请{{todayNum}}次</span>
        </p>
      </div>
    </navbar>
    <div class="content flex">
      <swiper
        class="banners"
        :indicator-dots="true"
        indicator-color="white"
        indicator-active-color="#FF8E3B"
        previous-margin="0"
        next-margin="0"
      >
        <block v-for="(item, index) in banners" :index="index" :key="index">
          <swiper-item class="banner" @click="onBanner(item)">
            <img :src="item.url" alt="banner" mode="aspectFill" />
          </swiper-item>
        </block>
      </swiper>
      <div class="items row">
        <div v-for="(data, j) in datas" :key="j" class="col flex">
          <div class="item" v-for="(item, index) in data" :key="index" @click="onItem(item)">
            <div class="icon">
              <img :src="item.goods.picUrl" alt="img" mode="aspectFill" />
              <div v-if="item.statusCode > 6" class="end">
                <p>报名结束</p>
              </div>
            </div>
            <div class="pad">
              <h5 class="middle dark medium title">{{item.title}}</h5>
              <div class="row just i-center margin-t">
                <p class="small light">价值：{{item.goods.price || 0}}元</p>
              </div>
              <div class="row just i-center margin-t">
                <p class="middle dark">
                  名额
                  <span class="red blod">{{item.totalNum}}</span>
                </p>
                <ul v-if="item.cooperationType < 3" class="row tag">
                  <li class="small red">悬赏</li>
                  <li v-if="item.cooperationType === 2" class="small red margin-l">报价</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import navbar from '@/components/navbar'
import {router, request} from '@/utils/index'

export default {
  data () {
    return {
      banners: [],
      datas: [[], []],
      page: 1,
      loading: false,
      todayNum: 0
    }
  },

  components: {
    navbar
  },
  mounted () {
    this.loadData(1)
  },
  created () {
    // let app = getApp()
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
      if (page === 1) {
        request.get('/banner/list', {page: 1, size: 20, type: 1, valid: true}).then(({json: {data}}) => {
          this.banners = data
        }).catch(e => {
          console.log(e)
        })
        request.get('/bl/activity/qualification', {}).then(({json: {data}}) => {
          this.todayNum = data.todayApplyNumRemaining
        }).catch(e => {
          console.log(e)
        })
      }
      return request.get('/bl/activity/list', {page, size: 20}).then(({json: {data}}) => {
        const olds = page === 1 ? [] : _.head(_.flatten(_.zip(this.datas[0] || [], this.datas[1] || [])),
          (this.datas[0].length || 0) + (this.datas[1].length || 0)
        )
        const datas = olds.concat(data.data)
        this.datas = _.partition(datas, (i, j) => (j % 2 === 0))
        this.nomore = data.pager.totalPages <= page
        this.page = page
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    onItem (item) {
      router(this).push('/pages/detail/main', {id: item.id})
    },
    onBanner (item) {
      if (item.linkType === 1) {
        const [page, query] = item.link.split('?')
        const params = query ? _.object(query.split('&').map(i => i.split('=').map(j => decodeURIComponent(j)))) : {}
        console.log('banner', page, params)
        router(this).push(page, params)
      } else {
        router(this).push('/pages/web/main', {url: item.link})
        console.log('banner', '/pages/web/main', {url: item.link})
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}
.navbar p {
  font-size: 44rpx;
  font-weight: 500;
}
.navbar p span {
  font-size: 28rpx;
  color: #c1c6cb;
  font-weight: normal;
  margin-left: 16rpx;
}

.banners {
  width: 750rpx;
  height: 400rpx;
}
.banner {
  width: 750rpx;
  height: 400rpx;
}
.banner img {
  width: 686rpx;
  height: 400rpx;
  border-radius: 16rpx;
  margin: 0 32rpx;
}
.items {
  padding: 0 20rpx;
  margin: 24rpx 0;
}
.items .col {
  margin: 0 12rpx;
}
.item {
  border-radius: 16rpx;
  overflow: hidden;
}
.item .icon {
  width: 100%;
  padding-top: 100%;
  position: relative;
}
.item .icon img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item .icon .end {
  width: 180rpx;
  height: 180rpx;
  border-radius: 90rpx;
  background-color: #00000066;
  align-items: center;
  justify-content: center;
  display: flex;
  position: absolute;
  left: 25%;
  top: 25%;
}
.item .icon .end p {
  color: white;
  font-size: 32rpx;
}

.item .title {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 40rpx;
  color: #494c5e;
  width: 100%;
  word-break: break-all;
}

.tag {
  display: flex;
  flex-direction: row;
}
.tag li {
  font-size: 16rpx;
  color: #ff8e3b;
  border-radius: 8rpx;
  border: 1rpx solid #ff8e3b;
  padding: 4rpx 8rpx;
}
</style>
