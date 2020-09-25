<template>
  <div class="container">
    <navbar :fixed="true" background="white">
      <div class="navbar">
        <p>活动<span>今日还可申请5次</span></p>
      </div>
    </navbar>
    <div class="content flex">
      <swiper class="banners" :indicator-dots="true" indicator-color='white' indicator-active-color='#FF8E3B' previous-margin="0" next-margin="0">
        <block v-for="(item, index) in banners" :index="index" :key="index">
          <swiper-item class="banner">
            <img :src="item.img" alt="banner" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="items row">
        <div v-for="(data, j) in datas" :key="j" class="col flex">
          <div class="item" v-for="(item, index) in data" :key="index" @click="onItem(item)">
            <div class="icon">
              <img :src="item.goods.picUrl" alt="img" mode="aspectFill">
              <div v-if="item.statusCode > 6" class="end">
                <p>报名结束</p>
              </div>
            </div>
            <div class="pad">
              <h5 class="middle dark medium">{{item.title}}</h5>
              <div class="row just i-center margin-t">
                <p class="small light">
                价值：{{item.goods.price || 0}}元
                </p>
              </div>
              <div class="row just i-center margin-t">
                <p class="middle dark">
                名额 <span class="red blod">{{item.totalNum}}</span>
                </p>
                <ul v-if="item.cooperationType < 3" class="row tag">
                  <li class="small red">悬赏</li>
                  <li v-if="item.cooperationType === 2" class="small red">报价</li>
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

const ImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600427730668&di=07620f900465606f5579258a46d132ba&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0e2442a7d933c895ca486665d51373f0820200fd.jpg'
export default {
  data () {
    return {
      banners: [1, 2, 3].map(i => ({
        url: 'http://www.baidu.com',
        img: ImgUrl
      })),
      datas: [[], []],
      page: 1,
      loading: false
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
    this.loadData(this.page + 1)
  },
  methods: {
    loadData (page) {
      if (this.loading || (page > 1 && this.nomore)) {
        return Promise.resolve()
      }
      return request.get('/bl/activity/list', {page, size: 20}).then(({json: {data}}) => {
        const olds = page === 1 ? [] : _.head(_.flatten(_.zip(this.datas[0] || [], this.datas[1] || [])),
          (this.datas[0].length || 0) + (this.datas[1].length || 0)
        )
        const datas = olds.concat(data.data)
        this.datas = _.partition(datas, (i, j) => (j % 2 === 0))
        this.nomore = data.pager.totalPages > page
        this.page = page
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    onItem (item) {
      router(this).push('/pages/detail/main', {id: item.id})
    }
  }
}
</script>

<style scoped>
.navbar{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}
.navbar p{
  font-size: 44rpx;
  font-weight: 500;
}
.navbar p span{
  font-size: 28rpx;
  color: #C1C6CB;
  font-weight: normal;
  margin-left: 16rpx;
}

.banners{
  width: 750rpx;
  height: 400rpx;
}
.banner{
  width: 750rpx;
  height: 400rpx;
}
.banner img{
  width: 686rpx;
  height: 400rpx;
  border-radius: 16rpx;
  margin: 0 32rpx;
}
.items{
  padding: 0 20rpx;
  margin: 24rpx 0;
}
.items .col{
  margin: 0 12rpx;
}
.item{
  border-radius: 16rpx;
  overflow: hidden;
}
.item .icon{
  width: 100%;
  padding-top: 100%;
  position: relative;
}
.item .icon img{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.item .icon .end{
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
.item .icon .end p{
  color: white;
  font-size: 32rpx;
}
.item .info{
  padding: 16rpx 20rpx;
}
.item .info h5{
  font-size: 28rpx;
  font-weight: 400;
  line-height: 40rpx;
  max-height: 80rpx;
  color: #494C5E;
}
.item .info .row{
  margin-top: 8rpx;
}

.tag{
  display: flex;
  flex-direction: row;
}
.tag li{
  font-size: 16rpx;
  line-height: 28rpx;
  color: #FF8E3B;
  border-radius: 4rpx;
  border: 1rpx solid #FF8E3B;
  padding: 0 8rpx;
}
</style>
