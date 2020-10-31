<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 100px"
      >
        <el-option :value="1" label="订单ID" />
        <el-option :value="2" label="活动名称" />
        <el-option :value="3" label="公司名称" />
        <el-option :value="4" label="用户昵称" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 160px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.ticketStatusCode"
        size="mini"
        class="filter-item"
        style="width: 120px; margin-left: 16px"
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
      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleExport"
      >导出</el-button>
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
      <el-table-column label="问题编号" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.ticket.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.blogger.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.activity.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.activity.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投诉理由" align="center" style="width: 360">
        <template slot-scope="{ row }">
          <span v-for="(i, j) in row.ticket.items" :key="j">
            {{ i.content }}
            <br>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="投诉时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ status[row.ticketStatusCode] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">{{
            row.statusCode !== 3 ? "查看" : "去处理"
          }}</el-button>
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
    <el-dialog width="60%" title="押金" :visible.sync="depositVisable">
      <div v-if="detail" class="detail">
        <h3>押金信息</h3>
        <div class="row">
          <h4>押金金额:</h4>
          <p>{{ detail.amount }}</p>
        </div>
        <div class="row">
          <h4>押金余额:</h4>
          <p>{{ detail.remainingAmount }}</p>
        </div>
        <div class="row">
          <h4>押金状态:</h4>
          <p>{{ depositStatus[detail.statusCode] }}</p>
        </div>
        <div class="row">
          <h4>状态描述:</h4>
          <p />
        </div>
        <h3>明细</h3>
        <el-table :data="detail.records" border fit>
          <el-table-column label="类型" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.intro }}</span>
            </template>
          </el-table-column>
          <el-table-column label="详情" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.intro }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产生时间" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.gmtCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="罚款金额" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.raeType === 1 ? "+" : "-" }}{{ row.amount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchIssueList } from '@/api/check'
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
    const n = moment()
    const ns = n.format('YYYY-MM-DD')
    const p = n.subtract(3, 'M')
    const ps = p.format('YYYY-MM-DD')
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
        ticketStatusCode: 0,
        coopType: 0,
        depositStatusCode: 0,
        rewardStatusCode: 0,
        timeRange: [ps, ns]
      },
      status: [
        '全部',
        '待修改',
        '待确认',
        '小二审核中',
        '待重评',
        '已修改',
        '已取消',
        '已违规'
      ],
      coopTypes: ['全部', '接受悬赏', '接受悬赏/达人报价', '免费置换'],
      depositStatus: ['全部', '未缴押金', '已冻结', '已解冻', '已扣除'],
      rewardStatus: ['全部', '待发放', '已发放', '已取消'],
      depositVisable: false,
      detail: null
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
      obj[
        ['', 'orderId', 'activityTitle', 'companyName', 'bloggerName'][
          obj.searchType
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
      fetchIssueList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = (data.data || []).map((i) =>
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
    handleExport() {},
    handleDetail(row) {
      window.showCommunicate(row.id)
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
  }
}
</style>
