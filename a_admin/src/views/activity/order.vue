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
        v-model="listQuery.coopType"
        size="mini"
        class="filter-item"
        style="width: 160px; margin-left: 16px"
      >
        <el-option v-for="(i, j) in coopTypes" :key="j" :value="j" :label="i" />
      </el-select>
      <el-select
        v-model="listQuery.rewardStatusCode"
        size="mini"
        class="filter-item"
        style="width: 120px; margin-left: 16px"
      >
        <el-option
          v-for="(i, j) in rewardStatus"
          :key="j"
          :value="j"
          :label="i"
        />
      </el-select>
      <el-select
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="width: 120px; margin-left: 16px"
      >
        <el-option
          v-for="i in status"
          :key="i.key"
          :value="i.key"
          :label="i.name"
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
      <el-table-column label="订单编号">
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
      <el-table-column label="合作方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ coopTypes[row.coopSubType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="悬赏|状态" align="center">
        <template slot-scope="{ row }">
          <span>
            {{ row.reward }}
            <br>
            {{
              (row.rewardStatusCode || 0) > 0
                ? rewardStatus[row.rewardStatusCode]
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{
            (status.find((i) => i.key === row.statusCode) || {}).name
          }}</span><br>
          <span style="color:#999">{{ row.statusDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">订单详情</el-button>
          <el-button
            v-if="row.statusCode === 4 || row.statusCode === 5 || row.statusCode === 8"
            size="mini"
            type="primary"
            @click="handleClose(row)"
          >关闭</el-button>
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
import { fetchOrderList, exportOrderList, closeOrder } from '@/api/check'
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
        statusCode: 0,
        coopType: 0,
        rewardStatusCode: 0,
        timeRange: [ps, ns]
      },
      status: [
        { name: '全部', key: 0 },
        { name: '待审核', key: 1 },
        { name: '待发货', key: 3 },
        { name: '待收货', key: 4 },
        { name: '待测评', key: 5 },
        { name: '已逾期', key: 8 },
        { name: '已测评', key: 6 },
        { name: '已关闭', key: 7 }
      ],
      coopTypes: ['全部', '接受悬赏', '达人报价', '免费置换'],
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
        obj.endTime = moment(this.listQuery.timeRange[1])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = null
      }
      fetchOrderList(clearQueryObject(obj, true)).then(({ data }) => {
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
    handleExport() {
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
        obj.endTime = moment(this.listQuery.timeRange[1])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = null
      }

      window.location.href = exportOrderList(clearQueryObject(obj, true))
    },
    handleClose(row) {
      this.$prompt('悬赏将立即退回品牌方账户，关闭理由将同步到订单状态的提示语中', '关闭订单', {
        inputPlaceholder: '关闭理由,最多20字',
        inputValidator: (s) => {
          return s && s.length <= 20
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm' && !instance.inputValue) {
            this.$message({ message: '请输入关闭理由', type: 'error' })
          } else {
            done()
          }
        }
      }).then((r) => {
        closeOrder({
          id: row.id,
          reason: r.value
        }).then(() => {
          row.statusCode = 7
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
    },
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
