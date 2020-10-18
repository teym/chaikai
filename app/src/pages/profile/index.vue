<template>
  <div class="container light_bg">
    <div class="content col white_bg pad2-l pad2-r">
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 手机号码：
        </p>
        <input class="flex middle dark input" type="text" v-model="user.telephone" placeholder="请输入手机号码" />
        <button open-type='getPhoneNumber' class="sbtn row center small" @getphonenumber="onPhone">填写手机号</button>
      </div>
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 真实姓名：
        </p>
        <input class="flex middle dark input" type="text" v-model="user.realName" placeholder="请输入真实的姓名" />
      </div>
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 微信号：
        </p>
        <input class="flex middle dark input" type="text" v-model="user.wechatNo" placeholder="请输入真实的微信号码" />
      </div>
      <div class="row pad-t pad-b i-center">
        <p class="text-right middle dark label">垂直领域：</p>
        <span class="small light">*最多选三项</span>
      </div>
      <div class="row">
        <p class="label"></p>
        <div class="col tags">
          <div class="row" v-for="(row, i) in tags" :key="i">
            <span
              v-for="(t, j) in row"
              :key="j"
              class="tag middle margin2-r margin2-b pad2-l pad2-r row center"
              :class="{red:!!active[t.id],red_bg:!!active[t.id],light:!active[t.id],light_bg:!active[t.id]}"
              @click="onSelect(t)"
            >{{t.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pad2-l pad-t">
      <p class="small light margin-t">*为核实认证渠道的信息真实性，请完善以上信息</p>
      <p class="small light margin-t">*平台将不定时，为您匹配线下品牌合作的邀请</p>
      <p class="small light margin-t">*平台将严格保护达人信息，合作过程中请勿透漏给第三方</p>
    </div>
    <div class="flex">
    </div>
    <div class="btn middle blod row center" @click="onSave">保存</div>
  </div>
</template>

<script>
import _ from 'underscore'
import {uiapi, request, router, api, isPhoneNumber} from '@/utils/index'
export default {
  data () {
    return {
      user: {
        telephone: '',
        realName: '',
        wechatNo: ''
      },
      code: '',
      tags: [],
      active: {}
    }
  },
  onShow () {
    this.loadCode()
    this.loadData()
  },
  methods: {
    loadCode () {
      api.rlogin().then(r => {
        this.code = r.code
      }).catch(e => {
      })
    },
    loadData () {
      request.get('/bl/account/area/const/list').then(({json: {data}}) => {
        this.tags = _.chunk(data, 3)
      })
      return request.get('/bl/account').then(({json: {data}}) => {
        this.user = data
        this.active = _.object(data.areas.map(i => ([i.id, i])))
        // this.channels = mapChannel(data.channels)
      }).catch(e => {
        uiapi.toast(e.info)
      })
    },
    onPhone (e) {
      if (e.mp.detail.encryptedData) {
        const l = uiapi.loading()
        request.post('/bl/account/wxInfo', {encryptInfo: e.mp.detail, code: this.code}).then(({json}) => {
          this.user.telephone = json.data.phoneNumber || this.user.telephone
          this.loadCode()
          l()
        }).catch(e => {
          l()
          uiapi.toast(e.info)
          this.loadCode()
        })
      }
    },
    onSelect (sel) {
      if (this.active[sel.id]) {
        this.active = _.omit(this.active, sel.id)
      } else {
        if (_.size(this.active) >= 3) {
          uiapi.toast('最多选三项')
          return
        }
        this.active = Object.assign(_.object([[sel.id, sel]]), this.active)
      }
    },
    onSave () {
      if (!isPhoneNumber(this.user.telephone)) {
        return uiapi.toast('请输入正确的手机号')
      }
      if (!this.user.realName) {
        return uiapi.toast('请输入真实姓名')
      }
      if (!this.user.wechatNo) {
        return uiapi.toast('请输入微信号')
      }
      // if (_.values(this.active).length <= 0) {
      //   return uiapi.toast('请选择垂直领域')
      // }
      const e = uiapi.loading()
      request.put('/bl/account', Object.assign({}, this.user, {areas: _.values(this.active)})).then((r) => {
        e()
        router(this).pop()
      }).catch(e => {
        e()
        uiapi.toast(e.info)
      })
    }
  }
}
</script>

<style scoped>
.label {
  width: 164rpx;
  margin-right: 24rpx;
}
.border {
  border-bottom: 1rpx solid #f5f5f5;
}
.tags .tag {
  min-width: 84rpx;
  height: 56rpx;
  border-radius: 28rpx;
}
.sbtn {
  height: 48rpx;
  border-radius: 24rpx;
  border: 1rpx solid #ff8e3b;
  padding: 0 24rpx;
  color: #ff8e3b;
}
.btn {
  height: 80rpx;
  border-radius: 40rpx;
  color: white;
  background-color: #ff8e3b;
  width: 640rpx;
  margin: 40rpx 55rpx;
}
</style>
