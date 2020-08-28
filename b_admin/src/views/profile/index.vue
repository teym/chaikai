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
        <el-button type="primary" size="mini">新增授权</el-button>
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
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO" align="left">
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left">
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权时间" align="left">
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Actions"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
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
  }
}
</style>
