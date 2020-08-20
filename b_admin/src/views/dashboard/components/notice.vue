<template>
  <div v-loading="loading" class="notice-container">
    <p>公告规则</p>
    <el-row>
      <el-col v-for="(item, i) in list" :key="i" :span="12">{{ item.title }}</el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Notice',
  data() {
    return {
      loading: false,
      list: []
    }
  },
  //   computed: {
  //     ...mapGetters([
  //       'roles'
  //     ])
  //   },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    this.loading = true
    setTimeout(() => {
      this.loading = false
      this.list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        title: 'test title' + i,
        url: 'https://www.baidu.com'
      }))
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
</style>
