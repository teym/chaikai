<template>
  <div class="bar" :style="{background: background || 'transparent'}">
    <div :class="{fixed: fixed}" :style="{background: background || 'transparent'}">
      <div class="content">
        <slot />
      </div>
      <div :style="{height: statusBarHeight}"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['fixed', 'background'],
  data () {
    return {
      barHeight: '0px'
    }
  },
  created () {
    // const {safeArea} = mpvue.getSystemInfoSync()
    // this.barHeight = (safeArea.bottom - safeArea.height - safeArea.top) + 'px'
  }
}
</script>

<style scoped>
.bar{
  width: 100%;
}
.content{
  width: 100%;
}
.fixed{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  z-index: 999;
}
</style>
