<template>
  <div class="container" >
    <web-view v-if="src" :src="src" @load="onLoad" @message="onMessage"></web-view>
  </div>
</template>

<script>
import {router} from '@/utils/index'

export default {
  data () {
    return {
      src: ''
    }
  },
  mounted () {
    const {url} = router(this).params()
    this.src = url
    console.log('web load', url)
  },
  onShareAppMessage () {
    return {
      title: '拆开',
      path: `/pages/web/main?url=${encodeURIComponent(this.src)}`
    }
  },
  methods: {
    onLoad (e) {
      console.log(e)
    },
    onMessage (m) {
      console.log(m)
    }
  }
}
</script>

<style scoped>
</style>
