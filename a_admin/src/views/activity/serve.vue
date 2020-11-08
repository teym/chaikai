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
        <el-option :value="2" label="公司名称" />
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
        style="width: 120px; margin-left: 16px"
      >
        <el-option :value="0" label="全部" />
        <el-option :value="2" label="订购成功" />
        <el-option :value="1" label="待支付" />
        <el-option :value="5" label="已关闭" />
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
      <el-table-column label="订购单号">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订购类型" align="center">
        <template>
          <span>置换活动</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
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
    <el-dialog width="60%" title="订购详情" :visible.sync="detailVisable">
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>提交时间:</h4>
          <p>{{ detail.date }}</p>
        </div>
        <div class="row">
          <h4>订购单号:</h4>
          <p>{{ detail.id }}</p>
        </div>
        <div class="row">
          <h4>订购服务:</h4>
          <p>置换活动</p>
        </div>
        <div class="row">
          <h4>订购状态:</h4>
          <p>{{ status[detail.statusCode] }}</p>
        </div>
        <div v-if="detail.serverOrder" class="row">
          <h4>订购详情:</h4>
          <div>
            <p>订购次数 {{ detail.serverOrder.amount }}次</p>
            <p>支付金额 {{ detail.amount }}</p>
            <p>
              支付方式 {{ ["", "支付宝", "余额"][detail.serverOrder.type] }}
            </p>
            <p>支付单号 {{ detail.orderNo }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchServeList, exportServeList, closeOrder } from '@/api/check'
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
        depositStatusCode: 0,
        rewardStatusCode: 0,
        timeRange: [ps, ns]
      },
      status: ['处理中', '待支付', '订购成功', '订购失败', '已拒绝', '已关闭'],
      detailVisable: false,
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
      obj[['', 'orderNo', 'companyName'][obj.searchType]] = obj.searchKey
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[1])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = null
      }
      fetchServeList(clearQueryObject(obj, true)).then(({ data }) => {
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
    handleExport() {
      const obj = Object.assign({}, this.listQuery)
      obj[['', 'orderNo', 'companyName'][obj.searchType]] = obj.searchKey
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[1])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = null
      }
      window.location.href = exportServeList(clearQueryObject(obj, true))
    },
    handleClose(row) {
      this.$prompt('请输入拒绝理由', {
        inputPlaceholder: '拒绝理由,最多200字',
        inputValidator: (s) => {
          return s && s.length <= 200
        }
      }).then((r) => {
        closeOrder({
          id: row.id,
          rejectReason: r.value
        }).then(() => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
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
