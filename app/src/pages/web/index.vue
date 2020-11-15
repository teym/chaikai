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
    this.src = 'http://192.168.50.244:8082/template.html?id=5BxR5'
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
