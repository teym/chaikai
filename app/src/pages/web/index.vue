<template>
  <div class="container" >
    <web-view v-if="src" :src="src" @load="onLoad"></web-view>
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
    console.log('load', url)
    this.src = url
  },
  methods: {
    onLoad (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
</style>
