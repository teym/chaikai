<template>
  <div class="container col">
    <div class="flex col">
      <home ref="home" v-if="tab === 0"/>
      <messages ref="messages" v-if="tab === 1"/>
      <mine ref="mine" v-if="tab === 2"/>
    </div>
    <bar background="#FFFFFF">
    <div class="tab row i-center">
      <div class="tab1 item row center">
        <div class="col i-center" :class="{active:tab === 0}" @click="onHome">
          <img v-if="tab === 0" src="/static/tabs/home-active.png" alt="home">
          <img v-else src="/static/tabs/home.png" alt="home">
          <p>活动</p>
        </div>
      </div>
      <div class="tab2 item row center">
        <div class="col i-center" :class="{active:tab === 1}" @click="onMessages">
          <img v-if="tab === 1" src="/static/tabs/messages-active.png" alt="home">
          <img v-else src="/static/tabs/messages.png" alt="home">
          <p>消息</p>
        </div>
      </div>
      <div class="tab3 item row center">
        <div class="col i-center" :class="{active:tab === 2}" @click="onMine">
          <img v-if="tab === 2" src="/static/tabs/mine-active.png" alt="home">
          <img v-else src="/static/tabs/mine.png" alt="home">
          <p>我的</p>
        </div>
      </div>
    </div>
    </bar>
  </div>
</template>

<script>
import bar from '@/components/bar'
import home from './home'
import messages from './messages'
import mine from './mine'
import {router, api, signal} from '@/utils/index'

export default {
  data () {
    return {
      tab: 0
    }
  },

  components: {
    bar,
    home,
    messages,
    mine
  },
  created () {
    this.onUser = ({back}) => {
      if (back === 'messages') {
        this.onMessages()
      } else if (back === 'mine') {
        this.onMine()
      }
    }
    signal.add('logined', this.onUser)
  },
  onShareAppMessage () {
    return {
      title: '通告来啦~',
      path: '/pages/index/main',
      imageUrl: 'https://apart-static.oss-cn-hangzhou.aliyuncs.com/others/20201108233304.jpg'
    }
  },
  onShow () {
    const tab = this.currentTab()
    if (tab && tab.onShow) {
      tab.onShow()
    }
  },
  onPullDownRefresh () {
    const tab = this.currentTab()
    if (tab && tab.onPullDownRefresh) {
      tab.onPullDownRefresh()
    }
  },
  onReachBottom () {
    const tab = this.currentTab()
    if (tab && tab.onReachBottom) {
      tab.onReachBottom()
    }
  },
  methods: {
    currentTab () {
      return [this.$refs.home, this.$refs.messages, this.$refs.mine][this.tab]
    },
    onHome () {
      this.tab = 0
      setTimeout(() => {
        this.$refs.home && this.$refs.home.onShow && this.$refs.home.onShow()
      }, 0)
    },
    onMessages () {
      if (api.isLogin()) {
        this.tab = 1
        setTimeout(() => {
          this.$refs.messages && this.$refs.messages.onShow && this.$refs.messages.onShow()
        }, 0)
      } else {
        router(this).push('/pages/login/main', {back: 'messages'})
      }
    },
    onMine () {
      if (api.isLogin()) {
        this.tab = 2
        setTimeout(() => {
          this.$refs.mine && this.$refs.mine.onShow && this.$refs.mine.onShow()
        }, 0)
      } else {
        router(this).push('/pages/login/main', {back: 'mine'})
      }
    }
  }
}
</script>

<style scoped>
.tab {
  height: 88rpx;
}
.tab .tab1 {
  flex: 1;
}
.tab .tab2 {
  flex: 2;
}
.tab .tab3 {
  flex: 1;
}
.tab .item img {
  width: 48rpx;
  height: 48rpx;
}
.tab .item p {
  font-size: 24rpx;
  color: #999;
}
.tab .item .active p {
  color: #ff8e3b;
}
</style>
