<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.companyName"
        placeholder="请输入公司名称"
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
      <el-table-column label="提现单号">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
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
          <el-button size="mini" @click="handleDetail(row)">订单详情</el-button>
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
    <el-dialog width="60%" title="开票详情" :visible.sync="detailVisable">
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>提现状态:</h4>
          <p>{{ status[detail.statusCode] }}</p>
        </div>
        <div class="row">
          <h4>申请时间:</h4>
          <p>{{ detail.date }}</p>
        </div>
        <div class="row">
          <h4>提现单号:</h4>
          <p>{{ detail.orderNo }}</p>
        </div>
        <div class="row">
          <h4>企业ID:</h4>
          <p>{{ detail.company.id }}</p>
        </div>
        <div class="row">
          <h4>企业名称:</h4>
          <p>{{ detail.company.name }}</p>
        </div>
        <div class="row">
          <h4>退款方式:</h4>
          <p>{{ ["", "支付宝", "银行卡"][detail.withdraw.type] }}</p>
        </div>
        <div v-if="detail.withdraw.type === 1" class="row">
          <h4>账号名称:</h4>
          <p>{{ detail.withdraw.alipayAccountName }}</p>
        </div>
        <div v-if="detail.withdraw.type === 1" class="row">
          <h4>支付宝账号:</h4>
          <p>{{ detail.withdraw.alipayAccount }}</p>
        </div>
        <div v-if="detail.withdraw.type === 2" class="row">
          <h4>账号名称:</h4>
          <p>{{ detail.withdraw.bandAccountName }}</p>
        </div>
        <div v-if="detail.withdraw.type === 2" class="row">
          <h4>银行名称:</h4>
          <p>{{ detail.withdraw.bandName }}</p>
        </div>
        <div v-if="detail.withdraw.type === 2" class="row">
          <h4>银行卡号:</h4>
          <p>{{ detail.withdraw.bandCardNo }}</p>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="handleClose">拒绝提现</el-button>
        <el-button type="primary" @click="handleSuccess">提现成功</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchBWithdrawList, updateBWithdraw } from '@/api/finance'
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
        companyName: '',
        statusCode: 0
      },
      status: ['处理中', '等待支付', '成功', '失败', '已拒绝', '已关闭'],
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
      if (parseInt(obj.statusCode) < 0) {
        obj.statusCode = undefined
      }
      fetchBWithdrawList(clearQueryObject(obj)).then(({ data }) => {
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

    handleClose() {
      this.$prompt('请输入拒绝理由', {
        inputPlaceholder: '拒绝理由,最多200字',
        inputValidator: (s) => {
          return s && s.length <= 200
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm' && !instance.inputValue) {
            this.$message({ message: '请输入拒绝理由', type: 'error' })
          } else {
            done()
          }
        }
      }).then((r) => {
        updateBWithdraw({
          id: this.detail.id,
          rejectReason: r.value,
          statusCode: 4
        }).then(() => {
          this.detailVisable = false
          this.detail.statusCode = 2
          this.detail.rejectReason = r.value
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
    },
    handleSuccess() {
      updateBWithdraw({
        id: this.detail.id,
        statusCode: 2
      }).then(() => {
        this.detail.statusCode = 2
        this.detailVisable = false
        this.$message({ message: '操作成功', type: 'success' })
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
