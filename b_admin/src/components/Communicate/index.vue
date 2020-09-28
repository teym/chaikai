<template>
  <el-dialog
    custom-class="custom-dialog"
    title=""
    :visible.sync="showDetail"
    modal
    lock-scroll
    :close-on-click-modal="false"
    :append-to-body="true"
    width="960px"
  >
    <div slot="title">
      <el-row>
        <el-col :span="4">留言</el-col>
        <el-col :span="12">{{ (list[active] || {}).name }}</el-col>
        <el-col :span="8" />
      </el-row>
    </div>
    <el-row class="layout">
      <el-col :span="4" class="list">
        <div v-for="(i, j) in list" :key="j" class="item" :class="{active:j === active}">
          <img :src="i.accountInfo.avatar" alt="avatar">
          <div class="col">
            <div class="row t">
              <h5>{{ i.accountInfo.name }}</h5>
              <span>10:00</span>
            </div>
            <div class="row b">
              <p>{{ i.lastRecord.content }}</p>
              <span>{{ i.brUnreadNum }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="content" :span="12">
        <div />
      </el-col>
      <el-col :span="8" class="detail">
        <div />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  fetchList
  // fetchStat
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
      page: 0,
      nomore: false,
      loading: false,
      showDetail: false
    }
  },
  created() {
    this.loadList(1)
    window.showCommunicate = (id) => {
      this.showDetail = true
    }
  },
  methods: {
    show() {
      this.showDetail = true
    },
    loadList(page) {
      this.loading = true
      fetchList({ page: page, size: 10, roomType: 1, type: 1 })
        .then((r) => {
          this.list = (r.data.data || []).reverse().concat(page === 1 ? [] : this.list)
          // console.log(this.list);
          this.nomore = r.data.pager.totalPages <= page
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  border-top: 1px solid #E9E9E9;

  .list{
    border-right: 1px solid #E9E9E9;
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #E9E9E9;
      padding: 8px 8px 8px 0;
      img{
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
      .col {
        margin-left: 8px;
        flex: 1;
      }
      .row{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }
      .t {
        h5{
          margin: 0;
          padding: 0;
          font-size: 18px;
          color: #333333;
          font-weight: 500;
        }
        span{
          font-size: 14px;
          color: #737373;
        }
      }
      .b{
        margin-top: 8px;
        p{
          margin: 0;
          padding: 0;
          font-size: 14px;
          color: #737373;
        }
        span{
          background-color: #FF4848;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          padding: 2px 4px;
          color: white;
        }
      }
    }
  }
  .el-col{
      height: 100%;
      min-height: 400px;
  }
  .content {
    border-right: 1px solid #E9E9E9;
  }
}
</style>
