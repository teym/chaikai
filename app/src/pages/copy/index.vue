<template>
  <div class="container white_bg">
    <div class="col head i-center pad2">
      <div class="logo margin2-t">
        <img src="/static/images/c_logo.png" alt="logo" />
      </div>
      <h5 class="big dark blod">拆开</h5>
      <p class="small light margin2-t">
        抱歉! 由于受微信小程序的访问限制<br>请复制以下链接在浏览器中进行打开
      </p>
    </div>
    <div class="link light_bg pad margin-t margin2-l margin2-r dark small">
      {{ url }}
    </div>
    <div class="flex col i-center">
      <div
        class="btn row center middle blod white"
        @click="onCopy"
      >
        复制链接
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'underscore'
import { api, uiapi, router } from '@/utils/index'

export default {
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    this.url = router(this).params().url || ''
  },
  methods: {
    onCopy () {
      api.copy(this.url).then(() => {
        uiapi.toast('链接复制成功')
      })
    }
  }
}
</script>

<style scoped>
.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  overflow: hidden;
}
.logo img{
  width: 160rpx;
  height: 160rpx;
}
.link{
  border-radius: 8rpx;
}
.btn {
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #ff8e3b;
  margin-top: 80rpx;
  width: 640rpx;
}
</style>
