<template>
  <div class="container">
    <div class="white_bg col flex pad2">
      <div class="row i-center channel">
        <img :src="channel.img" alt="img">
        <p class="middle dark blod margin-l">{{channel.platformName}}</p>
      </div>
      <div class="light_bg row pad margin2-t">
        <input :disabled="channel.statusCode === '1' || channel.statusCode === '3'" class="flex middle dark" type="text" v-model="channel.homeLink" placeholder="请输入主页链接">
      </div>
      <div class="light_bg row center margin2-t shot" @click="onChoseImg">
        <p v-if="!channel.homePic" class="middle light">点击上传主页截图</p>
        <img v-else :src="channel.homePic" alt="img">
      </div>
      <p class="red small text-right margin2-t" @click="onGuide">查看示例</p>
      <h5 class="middle dark medium margin2-t">{{channel.platformName}}入驻要求</h5>
      <p class="small light margin-t">1.粉丝数≥{{channel.platformId === '2' ? 5000 : 10000}}</p>
      <p class="small light margin-t">2.根据达人账号综合资质，评估入驻资格，如：粉丝量、内容质量、互动真实无水分</p>
      <p class="small light margin-t">3.两个工作日内反馈申请结果</p>
      <div v-if="channel.statusCode === '2'" class="light_bg pad2 reason margin2-t">
        <h6 class="middle medium">拒绝理由：</h6>
        <p class="small margin-t">{{channel.rejectReason}}</p>
      </div>
      <div class="flex"></div>
      <div v-if="channel.statusCode !== '3'" class="btn middle blod row center" :class="{bg:channel.statusCode !== '1', ibg:channel.statusCode === '1'}" @click="onGo">{{ channel.statusCode === '1' ? "审核中" : "提交审核"}}</div>
    </div>
    <done v-if="tip" message="小二会尽快给您反馈结果，请耐心等待～"/>
  </div>
</template>

<script>
import _ from 'underscore'
import {router, uiapi, request, matchURL} from '@/utils/index'
import done from '@/components/done'

export default {
  data () {
    return {
      channel: {
        homeLink: '',
        homePic: '',
        rejectReason: ''
      },
      tip: false
    }
  },
  components: {
    done
  },
  created () {
    // let app = getApp()
  },
  mounted () {
    this.channel = _.mapObject(router(this).params(), (v) => { const r = decodeURIComponent(v); return (r === 'null' || r === ' undefined') ? '' : r })
  },
  onShow () {

  },
  methods: {
    onChoseImg () {
      if (this.channel.statusCode === '1' || this.channel.statusCode === '3') {
        return
      }
      uiapi.chooseImage().then(r => {
        const l = uiapi.loading()
        request.upload('/oss/upload', r).then(({json: {data}}) => {
          l()
          this.channel.homePic = data
        }).catch(e => {
          l()
          uiapi.toast(e.info)
        })
      })
    },
    onGuide () {
      router(this).push('/pages/web/main', {url: 'https://static.ckgift.cn/th/OVxLJ'})
    },
    onGo () {
      if (this.channel.statusCode === '1' || this.channel.statusCode === '3') {
        return
      }
      const link = matchURL(this.channel.homeLink)
      if (!link) {
        return uiapi.toast('提交输入正确的主页链接')
      }
      this.channel.homeLink = link
      const l = uiapi.loading()
      request.post('/bl/account/channel', Object.assign({}, this.channel)).then(r => {
        l()
        uiapi.toast('提交成功')
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
.channel img {
  width: 64rpx;
  height: 64rpx;
}
.shot {
  height: 300rpx;
}
.shot img {
  width: 100%;
  height: 100%;
}
.btn {
  margin: 60rpx;
  height: 80rpx;
  color: white;
  border-radius: 40rpx;
}
.reason {
  min-height: 200rpx;
  color: #f25643;
}
.bg {
  background-color: #ff8e3b;
}
.ibg {
  background-color: #ff8e3ba0;
}
</style>
