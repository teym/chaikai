<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        style="width: 90px"
        class="filter-item"
      >
        <el-option :value="1" label="账号ID" />
        <el-option :value="2" label="用户昵称" />
        <!-- <el-option :value="3" label="渠道链接" /> -->
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 160px; margin-left: 16px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.platformId"
        size="mini"
        class="filter-item"
        style="width: 90px; margin-left: 16px"
      >
        <el-option :value="0" label="全部" />
        <el-option :value="-1" label="未认证" />
        <el-option
          v-for="(item, i) in channels"
          :key="i"
          :value="item.id"
          :label="item.name"
        />
      </el-select>

      <el-date-picker
        v-model="listQuery.timeRange"
        size="mini"
        class="filter-item"
        style="width: 220px; margin-left: 16px"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select
        v-model="listQuery.sort"
        size="mini"
        class="filter-item"
        style="width: 150px; margin-left: 16px"
      >
        <el-option :value="1" label="渠道粉丝从高到低" />
        <el-option :value="2" label="渠道粉丝从低到高" />
        <el-option :value="3" label="渠道粉丝区间" />
      </el-select>
      <el-input-number
        v-if="listQuery.sort === 3"
        v-model="listQuery.min"
        size="mini"
        class="filter-item"
        style="width: 60px"
        placeholder="min"
        :controls="false"
      />
      <el-input-number
        v-if="listQuery.sort === 3"
        v-model="listQuery.min"
        size="mini"
        class="filter-item"
        style="width: 60px"
        placeholder="max"
        :controls="false"
      />

      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleFilter"
      >筛选</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="用户ID" width="90">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证渠道/粉丝数" align="center">
        <template slot-scope="{ row }">
          <div v-if="row.channels && row.channels.length > 0">
            <span v-for="(i, j) in row.channels" :key="j">
              {{ i.platformName }}/{{ i.fansCount }}
              <br>
            </span>
          </div>
          <span v-else>未认证</span>
        </template>
      </el-table-column>

      <el-table-column label="钱包收入" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.financeInfo.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      width="50%"
      title="达人详情"
      :visible.sync="detailVisable"
      append-to-body
    >
      <detail :detail="detail" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchBloggerList, fetchBlogger } from '@/api/accounts'
import { clearQueryObject } from '@/utils/index'
import { Channels } from '@/utils/constant'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
// import { mapGetters } from "vuex";
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import detail from './components/blogger'

export default {
  name: 'ComplexTable',
  components: { Pagination, detail },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        sort: 1,
        min: 0,
        max: 0,
        searchType: 1,
        searchKey: '',
        platformId: 0,
        timeRange: []
      },
      channels: Channels,
      detailVisable: false,
      detail: null
    }
  },
  // computed: {
  //   ...mapGetters(["name", "avatar", "telephone"]),
  // },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign(
        {},
        this.listQuery,
        this.listQuery.sort === 3 ? { min: 0, max: 0 } : {}
      )
      obj[['', 'accountId', 'nickname'][this.listQuery.searchType]] =
        obj.searchKey
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[1]).add(1, 'd').format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.timeRange = null
      }
      // if (obj.platformId < 0) {
      //   obj.platformId = 0;
      // }
      fetchBloggerList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data.data.map((i) =>
          Object.assign(i, {
            date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
          })
        )
        this.total = data.pager.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    loadDetail(item) {
      fetchBlogger(item.id).then((r) => {
        r.data.financeInfo = item.financeInfo
        r.data.channels = item.channels
        r.data.date = item.date
        this.detail = r.data
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(item) {
      this.detail = null
      this.loadDetail(item)
      this.detailVisable = true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    background-color: white;
    padding: 16px 16px 6px 16px;
    border-radius: 4px;
    span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .el-table {
    margin: 20px 0;
    border-radius: 4px;
  }
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 90px;
      height: 90px;
      border-radius: 4px;
      margin-right: 8px;
    }
    font-size: 14px;
    color: #666;
    vertical-align: middle;
    margin: 0;
    padding: 0;
  }
}
</style>
