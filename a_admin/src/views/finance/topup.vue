<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 100px"
      >
        <el-option :value="1" label="公司名称" />
        <el-option :value="2" label="订单编号" />
        <el-option :value="3" label="交易单号" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 160px"
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
        style="width: 120px; margin-left: 16px"
      >
        <el-option :value="-1" label="全部" />
        <el-option :value="0" label="待支付" />
        <el-option :value="2" label="已成功" />
        <el-option :value="5" label="已关闭" />
      </el-select>

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
      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleNew"
      >新增充值</el-button>
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
      <el-table-column label="交易单号">
        <template slot-scope="{ row }">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ ["", "支付宝", "银行卡"][row.recharge.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ ["", "在线支付", "线下打款"][row.recharge.payType] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
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
    <el-dialog width="60%" title="新增充值" :visible.sync="detailVisable">
      <div class="detail">
        <div class="row">
          <h4>交易单号:</h4>
          <div>
            <el-input v-model="detail.tradeNo" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>充值时间:</h4>
          <div>
            <el-date-picker
              v-model="detail.date"
              size="mini"
              type="datetime"
              placeholder="选择日期时间"
            />
          </div>
        </div>
        <div class="row">
          <h4>账户ID:</h4>
          <div>
            <el-input-number
              v-model="detail.brAccountId"
              size="mini"
              placeholder="请输入企业ID"
              :controls="false"
              @blur="handleCompany"
            />
            <p v-if="company">{{ company.company }}</p>
          </div>
        </div>
        <div class="row">
          <h4>充值金额:</h4>
          <div>
            <el-input-number v-model="detail.amount" :min="0" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>支付方式:</h4>
          <div>
            <el-select
              v-model="detail.recharge.type"
              size="mini"
              class="filter-item"
              style="width: 100px"
            >
              <el-option :value="1" label="支付宝" />
              <el-option :value="2" label="银联" />
            </el-select>
          </div>
        </div>
        <div class="row">
          <h4>支付类型:</h4>
          <div>
            <el-select
              v-model="detail.recharge.payType"
              size="mini"
              class="filter-item"
              style="width: 100px"
            >
              <el-option :value="1" label="线上支付" />
              <el-option :value="2" label="线下打款" />
            </el-select>
          </div>
        </div>
        <div class="row">
          <h4>备注:</h4>
          <div>
            <el-input v-model="detail.remark" size="mini" type="textarea" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="detailVisable = false">取消</el-button>
        <el-button type="primary" @click="handleSuccess">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTopupList, addTopup } from '@/api/finance'
import moment from 'moment'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchCompanyList } from '@/api/accounts'
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
      status: ['处理中', '等待支付', '成功', '失败', '已拒绝', '已关闭'],
      detailVisable: false,
      detail: {
        amount: 0,
        tradeNo: '',
        brAccountId: '',
        date: '',
        recharge: {
          description: '',
          type: 1,
          payType: 1
        },
        remark: '',
        raeType: 1,
        type: 102
      },
      company: null
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone'])
  },
  created() {
    this.getList()
  },
  methods: {
    handleNew() {
      this.detail = {
        amount: 0,
        tradeNo: '',
        brAccountId: '',
        date: '',
        recharge: {
          description: '',
          type: 1,
          payType: 1
        },
        remark: '',
        raeType: 1,
        type: 102
      }
      this.detailVisable = true
    },
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[['key', 'companyName', 'id', 'orderNo'][this.listQuery.searchType]] =
        obj.searchKey
      if (obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[0]).add(1, 'd').format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.timeRange = ''
      }
      if (parseInt(obj.statusCode) < 0) {
        obj.statusCode = undefined
      }
      fetchTopupList(clearQueryObject(obj, true)).then(({ data }) => {
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
    handleCompany() {
      this.company = null
      fetchCompanyList({
        accountId: this.detail.brAccountId,
        page: 1,
        size: 1
      }).then((r) => {
        this.company = r.data.data[0] || { company: '未查询到账户' }
      })
    },
    handleSuccess() {
      if (!this.detail.tradeNo) {
        return this.$message({ message: '请输入交易单号', type: 'error' })
      }
      if (!this.detail.date) {
        return this.$message({ message: '请输入充值时间', type: 'error' })
      }
      if (!this.detail.brAccountId) {
        return this.$message({ message: '请输入账户ID', type: 'error' })
      }
      if (!this.detail.amount) {
        return this.$message({ message: '请输入充值金额', type: 'error' })
      }
      if (!this.detail.remark) {
        return this.$message({ message: '请输入备注', type: 'error' })
      }
      if (!this.company.id) {
        return this.$message({ message: '请检查充值账户', type: 'error' })
      }
      addTopup(
        Object.assign(
          { payTime: moment(this.detail.date).format('YYYY-MM-DD HH:mm:ss') },
          this.detail
        )
      ).then(() => {
        this.$message({ message: '操作成功', type: 'success' })
        this.detailVisable = false
        this.getList()
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
