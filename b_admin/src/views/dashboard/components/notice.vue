<template>
  <div v-loading="loading" class="notice-container">
    <h3>公告规则</h3>
    <el-row>
      <el-col v-for="(item, i) in list" :key="i" :span="12">
        <div>
          <a :href="item.link" target="_blank">{{ item.content }}</a>
          <img v-if="item.tag && item.tag==='最热'" src="@/assets/images/notice_huo.png" alt="huo">
          <img v-if="item.tag && item.tag==='最新'" src="@/assets/images/notice_xin.png" alt="huo">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { fetchNotiList } from '@/api/other'

export default {
  name: 'Notice',
  data() {
    return {
      loading: false,
      list: []
    }
  },
  created() {
    this.loading = true
    fetchNotiList()
      .then((r) => {
        this.list = r.data
        this.loading = false
      })
      .catch((e) => {
        this.loading = false
      })
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
      line-height: 24px;
      div {
        width: 80%;
        img{
          float: right;
          height: 24px;
        }
      }
    }
  }
}
</style>
