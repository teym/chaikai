<template>
  <el-dialog
    custom-class="custom-dialog"
    title="开票详情"
    :visible.sync="showDetail"
    modal
    lock-scroll
    :close-on-click-modal="false"
    :append-to-body="true"
    width="820px"
  >
    <div slot="title">
      <el-row>
        <el-col :span="4">留言</el-col>
        <el-col :span="12">{{ (list[active] || {}).name }}</el-col>
        <el-col :span="8" />
      </el-row>
    </div>
    <el-row class="layout">
      <el-col :span="4">
        <div v-for="(i, j) in list" :key="j" class="item" :class="{active:j === active}">
          <img :src="i.user.avatar" alt="avatar">
          <p>
            {{ i.user.name }}
            <br>
            <span>{{ i.lastcontent }}</span>
          </p>
        </div>
      </el-col>
      <el-col class="content" :span="12" />
      <el-col :span="8" class="detail" />
    </el-row>
  </el-dialog>
</template>

<script>
import {
  fetchList,
  fetchStat
//   fetchHistory,
//   createData,
//   createHistory,
//   updateData
} from './api'

export default {
  data() {
    return {
      list: [],
      active: 0,
      stat: 0,
      loading: false,
      showDetail: false
    }
  },
  created() {
    this.loadAll({ type: 1 })
    this.loadStat()
  },
  methods: {
    show() {
      this.showDetail = true
    },
    loadAll() {
      this.loading = true
      fetchList({ page: 1, size: 10 })
        .then((r) => {
          this.list = r.data.data
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    },
    loadStat() {
      fetchStat().then((r) => {
        this.stat = r.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  min-height: 400px;
  .el-col{
      height: 100%;
  }
  .content {
    border-right: 1px solid #f5f5f5;
    border-left: 1px solid #f5f5f5;
  }
}
</style>
