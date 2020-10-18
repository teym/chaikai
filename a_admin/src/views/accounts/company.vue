<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 96px"
      >
        <el-option :value="1" label="手机号" />
        <el-option :value="2" label="账户ID" />
        <el-option :value="3" label="企业名称" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 200px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.companyStatus"
        size="mini"
        class="filter-item"
        style="width: 90px; margin-left: 16px"
      >
        <el-option
          v-for="(item, i) in status"
          :key="i"
          :value="i"
          :label="item"
        />
      </el-select>

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
      <el-table-column label="账号ID|企业名称">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
          <br>
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证情况" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.companyInfo.statusCode] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权品牌" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.brands.map((i) => i.name).join("|") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.financeInfo.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="置换活动" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.financeInfo.activityAmount }}次</span>
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
      width="80%"
      title="企业详情"
      :visible.sync="detailVisable"
      append-to-body
    >
      <detail :detail="detail" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchCompanyList } from '@/api/accounts'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import moment from 'moment'
// import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import detail from './components/company'

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
        searchType: 1,
        searchKey: '',
        companyStatus: 3,
        timeRange: []
      },
      status: ['全部', '未认证', '审核中', '已认证', '已拒绝'],
      detailVisable: false,
      detail: null
    }
  },
  // computed: {
  //   ...mapGetters(['name', 'avatar', 'telephone'])
  // },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[
        ['key', 'telephone', 'accountId', 'companyName'][
          this.listQuery.searchType
        ]
      ] = obj.searchKey
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.timeRange = null
      }
      fetchCompanyList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data.data.map((i) =>
          Object.assign(i, {
            date: moment(i.companyInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
            brands: (i.brands || []).map((i) =>
              Object.assign(i, {
                date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
              })
            )
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

    handleDetail(row) {
      this.detail = row
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
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 4px;
    h4 {
      width: 128px;
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
