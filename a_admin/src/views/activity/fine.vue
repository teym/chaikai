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
        <el-option :value="5" label="罚款ID" />
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
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="width: 100px; margin-left: 16px"
      >
        <el-option v-for="(i, j) in status" :key="j" :value="j" :label="i" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        size="mini"
        class="filter-item"
        style="width: 100px; margin-left: 16px"
      >
        <el-option v-for="(i, j) in types" :key="j" :value="j" :label="i" />
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
      <el-table-column label="罚款编号">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号">
        <template slot-scope="{ row }">
          <span>{{ row.brActivityOrderId }}</span>
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
      <el-table-column label="罚款类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ types[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.blAccount.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="罚款金额" align="center">
        <template slot-scope="{ row }">
          <span>
            {{ row.amount }}
            <br>
            {{ row.description || "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付单号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.payTradeNo || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span><br>
          <span style="color: #999">{{ row.statusDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sysRemark }}</span>
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
            v-if="row.statusCode === 1 || row.statusCode === 2"
            size="mini"
            type="primary"
            @click="handleClose(row)"
          >撤销罚款</el-button>
          <el-button size="mini" @click="handleRemark(row)">备注</el-button>
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
import {
  fetchOrderList,
  exportOrderList,
  closeOrder,
  remarkOrder
} from '@/api/fine'
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
        type: 0,
        timeRange: [ps, ns]
      },
      status: ['全部', '待处理', '待支付', '已支付', '已撤销'],
      types: ['全部', '逾期罚款', '违规罚款'],
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
        ['', 'orderId', 'id', 'activityTitle', 'companyName', 'bloggerName'][
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
      this.$prompt(
        '撤销后，达人无需支付罚款\n撤销理由，将更新至罚款状态的提示语中',
        '撤销罚款',
        {
          inputPlaceholder: '撤销理由,最多200字',
          inputType: 'textarea',
          inputValidator: (s) => {
            return s && s.length <= 200
          },
          inputErrorMessage: '已超出最长输入长度200个字',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm' && !instance.inputValue) {
              this.$message({ message: '请输入撤销理由', type: 'error' })
            } else {
              done()
            }
          }
        }
      ).then((r) => {
        closeOrder({
          id: row.id,
          statusCode: 4,
          statusDesc: r.value
        }).then(() => {
          row.statusCode = 4
          row.statusDesc = r.value
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
    },
    handleRemark(row) {
      this.$prompt('备注信息仅供内部查看', '填写备注', {
        inputPlaceholder: '备注,最多200字',
        inputType: 'textarea',
        inputValue: row.sysRemark,
        inputValidator: (s) => {
          return s && s.length <= 200
        },
        inputErrorMessage: '已超出最长输入长度200个字',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm' && !instance.inputValue) {
            this.$message({ message: '请输入备注', type: 'error' })
          } else {
            done()
          }
        }
      }).then((r) => {
        remarkOrder({
          id: row.id,
          sysRemark: r.value
        }).then(() => {
          row.sysRemark = r.value
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
    },
    handleDetail(row) {
      window.showCommunicate(row.brActivityOrderId)
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
