<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 100px"
      >
        <el-option :value="1" label="用户昵称" />
        <el-option :value="2" label="用户ID" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 160px;"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.timeRange"
        size="mini"
        class="filter-item"
        style="margin-left: 16px"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="width: 120px;margin-left: 16px"
      >
        <el-option :value="-1" label="全部" />
        <el-option :value="0" label="处理中" />
        <el-option :value="2" label="提现成功" />
        <el-option :value="4" label="已拒绝" />
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleFilter"
      >筛选</el-button>
      <!-- <el-button
        class="filter-item"
        style="float:right"
        type="primary"
        size="mini"
        @click="detailVisable = true"
      >新增充值</el-button> -->
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
      <el-table-column label="交易单号">
        <template slot-scope="{ row }">
          <span>{{ row.intro.substr(5) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.blAccountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.blAccount.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现方式" align="center">
        <template>
          <span>微信钱包</span>
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
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
  </div>
</template>

<script>
import { fetchCWithdrawList, addTopup } from '@/api/finance'
import moment from 'moment'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import preview from "./preview";

export default {
  name: 'ComplexTable',
  components: { Pagination },
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
        type: 102,
        searchType: 1,
        searchKey: '',
        statusCode: 0,
        timeRange: []
      },
      status: ['处理中', '等待支付', '成功', '失败', '已拒绝', '已关闭']
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[['key', 'blAccountName', 'blAccountId'][this.listQuery.searchType]] =
        obj.searchKey
      if (obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.timeRange = ''
      }
      if (parseInt(obj.statusCode) < 0) {
        obj.statusCode = undefined
      }
      fetchCWithdrawList(clearQueryObject(obj, true)).then(({ data }) => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCompany() {},
    handleSuccess() {
      addTopup(
        Object.assign(
          { payTime: moment(this.detail.date).format('YYYY-MM-DD HH:mm:ss') },
          this.detail
        )
      ).then(() => {
        this.$message({ message: '操作成功', type: 'success' })
        this.detailVisable = false
      })
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
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
    h4 {
      width: 80px;
      margin: 0;
      padding: 0;
      line-height: 28px;
    }
    h6 {
      width: 80px;
      margin: 0;
      padding: 0;
      line-height: 28px;
    }
    p {
      margin: 0;
      padding: 0;
      line-height: 28px;
    }
    .el-radio {
      margin-top: 6px;
    }
    .el-input {
      width: 280px;
    }
    div {
      flex: 1;
    }
  }
}
</style>
