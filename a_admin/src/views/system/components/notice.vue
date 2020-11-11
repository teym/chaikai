<template>
  <div v-loading="loading" class="notice-container">
    <h3>公告规则</h3>
    <el-row>
      <el-col v-for="(item, i) in list" :key="i" :span="12">
        <div>
          {{ item.title }}
          <span>最新</span>
        </div>
      </el-col>
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
.notice-container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  h3 {
    margin: 0 0 8px 0;
    padding: 0;
    color: #222;
  }
  .el-row {
    .el-col {
      padding: 8px;
      color: #333;
      font-size: 16px;
      div {
        width: 80%;

        span {
          background-color: #4244ff;
          padding: 2px 10px;
          border-radius: 2px;
          color: white;
          font-size: 12px;
          float: right;
        }
      }
    }
  }
}
</style>
