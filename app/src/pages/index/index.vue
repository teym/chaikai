<template>
  <div class="container">
    <navbar>
      <div class="navbar"></div>
    </navbar>
    <div class="content">

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar'

export default {
  data () {
    return {
    }
  },

  components: {
    navbar
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  methods: {
  }
}
</script>

<style scoped>
.navbar{
  background-color: bisque;
  width: 100%;
  height: 100%;
}
.content{
  flex: 1;
  background-color: brown;
}
</style>
