<template>
  <div class="bar" :style="{background: background || 'transparent'}">
    <div class="control-pad">
      <div :style="{height: contentHeight}"></div>
    </div>
    <div class="fixed control-pad" :style="{background: background || 'transparent'}">
      <div id='bar_content_ctx' class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['background'],
  data () {
    return {
      contentHeight: '0px'
    }
  },
  mounted () {
    wx.createSelectorQuery().select('#bar_content_ctx').boundingClientRect((rect) => {
      this.contentHeight = rect.height + 'px'
    }).exec()
  }
}
</script>

<style scoped>
.bar {
  width: 100%;
}
.control-pad{
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.content {
  width: 100%;
}
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  z-index: 999;
}
</style>
