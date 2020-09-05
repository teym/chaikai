<template>
  <div class="profile-container">
    <div v-if="user">
      <user-card :user="user" />
    </div>
    <div class="auth-table">
      <head>
        <h5>
          品牌授权
          <span>
            <el-icon class="el-icon-question" />如何设置活动
          </span>
        </h5>
        <el-button type="primary" size="mini" @click="handleAddAuth">新增授权</el-button>
      </head>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="品牌名称" align="left">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO" align="left">
          <template slot-scope="{row}">
            <img class="logo" :src="row.logo" alt="logo">
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left">
          <template slot-scope="{row}">
            <span>{{ (["UNKNOW","未认证","审核中","已认证","已拒绝"])[row.statusCode] }}</span>
            <span v-if="row.statusCode === 4" class="reason">
              <br>
              {{ row.rejectReason }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="授权时间" align="left">
          <template slot-scope="{row}">
            <span>{{ new Date(row.gmtCreate) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="row.statusCode === 4" type="text" size="mini">重新提交</el-button>
            <el-button v-if="row.statusCode === 4" type="text" size="mini">删除</el-button>
            <el-button v-else type="text" size="mini" @click="handleAuthDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchPv } from '@/api/goods'
import { fetchStat } from '@/api/user'
// import { parseTime } from '@/utils/index'
import UserCard from './components/UserCard'

export default {
  name: 'Profile',
  components: { UserCard },
  data() {
    return {
      user: {},
      tableKey: 0,
      list: null,
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.fetchPvList()
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchStat().then((r) => {
        this.user = r.data
      })
    },
    fetchPvList() {
      this.listLoading = true
      fetchPv({ page: 1, size: 50 })
        .then((r) => {
          this.list = r.data.data
          this.listLoading = false
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    handleAuthDetail(row) {
      this.$router.push({ path: '/user/auth', query: { id: row.id }})
    },
    handleAddAuth() {
      this.$router.push('/user/auth')
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .auth-table {
    background-color: white;
    border-radius: 4px;
    margin-top: 16px;
    head {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 16px;
      h5 {
        margin: 0;
        padding: 0;
        span {
          font-size: 12px;
          color: #737373;
          margin-left: 8px;
        }
      }
    }
    .logo {
      width: 36px;
      height: 36px;
      border-radius: 18px;
    }
    .reason {
      color: #666;
      font-size: 14px;
    }
  }
}
</style>
