<template>
  <div class="navbar">
    <div :style="{height: statusBarHeight}"></div>
    <div class="content" :style="{height: navbarHeight}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      statusBarHeight: 0,
      navbarHeight: 0
    }
  },
  created () {
    const {statusBarHeight, platform} = mpvue.getSystemInfoSync()
    console.log(statusBarHeight, platform)
    this.statusBarHeight = statusBarHeight + 'px'
    this.navbarHeight = (platform === 'Android' ? 48 : 44) + 'px'
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
</style>
