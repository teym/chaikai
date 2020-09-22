<template>
  <div class="navbar" :style="{height: totalHeight, background: background || 'transparent'}">
    <div :class="{fixed: fixed}" :style="{background: background || 'transparent'}">
      <div :style="{height: statusBarHeight}"></div>
      <div class="content" :style="{height: navbarHeight}">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['fixed', 'background'],
  data () {
    return {
      statusBarHeight: '',
      navbarHeight: '',
      totalHeight: ''
    }
  },
  created () {
    const {statusBarHeight, platform} = mpvue.getSystemInfoSync()
    const navbarHeight = (platform === 'Android' ? 48 : 44)
    this.statusBarHeight = statusBarHeight + 'px'
    this.navbarHeight = navbarHeight + 'px'
    this.totalHeight = (statusBarHeight + navbarHeight) + 'px'
  }
}
</script>

<style scoped>
.navbar{
  width: 100%;
}
.content{
  width: 100%;
}
.fixed{
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  z-index: 999;
}
</style>
