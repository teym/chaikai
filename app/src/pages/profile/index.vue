<template>
  <div class="container light_bg">
    <div class="content col white_bg pad2-l pad2-r">
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 手机号码：
        </p>
        <input class="flex middle dark input" type="text" v-model="phone" placeholder="请输入手机号码" />
      </div>
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 真实姓名：
        </p>
        <input class="flex middle dark input" type="text" v-model="name" placeholder="请输入真实的姓名" />
      </div>
      <div class="row pad-t pad-b i-center border">
        <p class="text-right middle dark label">
          <span class="red">*</span> 微信号：
        </p>
        <input class="flex middle dark input" type="text" v-model="wechat" placeholder="请输入真实的微信号码" />
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
              @click="onSelect(t.id)"
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
  </div>
</template>

<script>
import _ from 'underscore'
import {uiapi} from '@/utils/index'
export default {
  data () {
    return {
      phone: '',
      name: '',
      wechat: '',
      tags: [[{name: '护肤', id: 1}, {name: '彩妆', id: 2}, {name: '时尚搭配', id: 3}], [{name: '母婴', id: 4}, {name: '美食', id: 5}, {name: 'Vlog', id: 6}], [{name: '旅游', id: 7}, {name: '技能', id: 8}, {name: '生活', id: 9}], [{name: '二次元', id: 10}, {name: '萌宠', id: 11}, {name: '宝妈', id: 12}], [{name: '健身', id: 13}, {name: '娱乐', id: 14}, {name: '创意', id: 15}]],
      active: {}
    }
  },

  methods: {
    onSelect (sel) {
      if (this.active[sel]) {
        this.active = _.omit(this.active, sel)
      } else {
        if (_.size(this.active) >= 3) {
          uiapi.toast('最多选三项')
          return
        }
        this.active = Object.assign(_.object([[sel, true]]), this.active)
      }
    }
  },

  created () {
    // let app = getApp()
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
</style>
