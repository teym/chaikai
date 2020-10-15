<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.companyName"
        placeholder="请输入公司名称"
        style="width: 160px;"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="width: 120px;margin-left: 16px"
      >
        <el-option v-for="(item, i) in status" :key="i" :value="i" :label="item" />
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
      <el-table-column label="开票编号">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
    <el-dialog width="60%" title="开票详情" :visible.sync="detailVisable">
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>开票编号:</h4>
          <p>{{ detail.id }}</p>
        </div>
        <div class="row">
          <h4>开票状态:</h4>
          <p>{{ status[detail.statusCode] }}</p>
        </div>
        <div class="row">
          <h4>开票时间:</h4>
          <p>{{ detail.date }}</p>
        </div>
        <div class="row">
          <h4>开票金额:</h4>
          <p>{{ detail.totalAmount }}</p>
        </div>
        <div class="row">
          <h4>发票抬头:</h4>
          <p>{{ detail.rise }}</p>
        </div>
        <div class="row">
          <h4>公司名称:</h4>
          <p>{{ detail.company }}</p>
        </div>
        <div class="row">
          <h4>接收邮箱:</h4>
          <p>{{ detail.receiveMail }}</p>
        </div>
        <h3>明细</h3>
        <el-table :data="orders.datas" :loading="orders.loading" border fit>
          <el-table-column label="订单编号" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.orderId }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 1" label="活动名称" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.activityName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 1" label="达人昵称" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.bloggerName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 2" label="订购类型" align="center">
            <template>
              <span>置换活动</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 2" label="订购时间" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="orders.total > 0"
          :total="orders.total"
          :page.sync="orders.page"
          :limit.sync="orders.size"
          @pagination="loadDetails"
        />
      </div>
      <div slot="footer">
        <el-button @click="handleClose">拒绝开票</el-button>
        <el-button type="primary" @click="handleSuccess">开票成功</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchInvoiceList,
  fetchInvoiceOrderList,
  updateInvoice
} from '@/api/finance'
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
      status: ['全部', '待开票', '已拒绝', '已开票'],
      detailVisable: false,
      detail: null,
      orders: {
        page: 1,
        size: 5,
        total: 0,
        datas: [],
        loading: false
      }
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
      fetchInvoiceList(clearQueryObject(obj, true)).then(({ data }) => {
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
      this.$prompt('请输入拒绝理由').then((r) => {
        updateInvoice({
          id: this.detail.id,
          rejectReason: r.value,
          statusCode: 2
        }).then(() => {
          this.detailVisable = false
          this.detail.statusCode = 2
          this.detail.rejectReason = r.value
          this.$message({ message: '操作成功', type: 'success' })
        })
      })
    },
    handleSuccess() {
      updateInvoice({
        id: this.detail.id,
        statusCode: 3
      }).then(() => {
        this.detail.statusCode = 3
        this.detailVisable = false
        this.$message({ message: '操作成功', type: 'success' })
      })
    },
    handleDetail(row) {
      this.detail = row
      this.orders = {
        page: 1,
        size: 5,
        total: 0,
        nomore: false,
        datas: [],
        loading: false
      }
      this.detailVisable = true
      this.loadDetails(row)
    },
    loadDetails() {
      this.orders.loading = true
      fetchInvoiceOrderList({
        page: this.orders.page,
        size: this.orders.size,
        type: this.detail.type,
        invoiceId: this.detail.id
      })
        .then(({ data }) => {
          this.orders.datas = data.data.map((i) =>
            Object.assign(i, {
              date: moment(i.orderTime).format('YYYY-MM-DD HH:mm:ss')
            })
          )
          this.orders.total = data.pager.count
          this.orders.loading = false
        })
        .catch((e) => {
          this.orders.loading = false
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
