<template>
  <div class="profile-container">
    <div class="header">
      <el-menu default-active="1" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">活动订单</el-menu-item>
        <el-menu-item index="2">服务订购</el-menu-item>
      </el-menu>
      <el-button
        size="mini"
        style="float:right"
        type="primary"
        @click="$router.push('/user/invoices')"
      >开票记录</el-button>
    </div>
    <div class="table">
      <div class="head">
        选择开票的订单
        <span>仅支持悬赏已发放的活动订单</span>
        <el-button type="primary" size="mini" @click="formVisible = true">申请开票</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" label="全选" />
        <el-table-column label="订单编号">
          <template slot-scope="{row}">
            <div class="info">
              <span>{{ row.orderId }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="listQuery.type === '1'" label="活动名称">
          <template slot-scope="{row}">
            <span>{{ row.activityName }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="listQuery.type === '1'" label="达人昵称">
          <template slot-scope="{row}">
            <span>{{ row.bloggerName }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="listQuery.type === '2'" label="订购类型">
          <template>
            <span>置换活动</span>
          </template>
        </el-table-column>
        <el-table-column v-if="listQuery.type === '2'" label="订购时间">
          <template slot-scope="{row}">
            <div class="info">
              <span>{{ row.orderTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="fetchData"
      />
    </div>
    <el-dialog
      custom-class="custom-dialog"
      title="填写开票信息"
      :visible.sync="formVisible"
      width="420px"
    >
      <div>
        <el-form label-width="100px">
          <el-form-item label="开票金额：">
            <span>{{ totalAmount }}</span>元
          </el-form-item>
          <el-form-item label="发票抬头：">
            <el-input v-model="form.rise" placeholder="发票抬头" />
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-input v-model="form.company" placeholder="公司名称" />
          </el-form-item>
          <el-form-item label="接收邮箱：">
            <el-input v-model="form.receiveMail" placeholder="接收邮箱" />
          </el-form-item>
        </el-form>
        <p>关联订单</p>
        <el-table :data="sel" border fit style="width: 100%;">
          <el-table-column label="订单编号">
            <template slot-scope="{row}">
              <div class="info">
                <span>{{ row.orderId }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="listQuery.type === '1'" label="活动名称">
            <template slot-scope="{row}">
              <span>{{ row.activityName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="listQuery.type === '1'" label="达人昵称">
            <template slot-scope="{row}">
              <span>{{ row.bloggerName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="listQuery.type === '2'" label="订购类型">
            <template>
              <span>置换活动</span>
            </template>
          </el-table-column>
          <el-table-column v-if="listQuery.type === '2'" label="订购时间">
            <template slot-scope="{row}">
              <div class="info">
                <span>{{ row.orderTime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="{row}">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button :loading="formLoading" type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchInvoice, createInvoice } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Profile',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        type: '1',
        page: 1,
        size: 10
      },
      sel: [],
      formVisible: false,
      form: {
        statusCode: 1,
        rise: '',
        company: '',
        receiveMail: ''
      },
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles', 'amount']),
    totalAmount() {
      return this.sel.map((i) => i.amount).reduce((a, b) => a + b, 0)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchInvoice(this.listQuery)
        .then((r) => {
          this.list = (r.data || {}).data || []
          this.total = ((r.data || {}).pager || {}).count || 0
          this.listLoading = false
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    handleSelectionChange(e) {
      this.sel = e
    },
    handleSelect(e) {
      this.listQuery.type = e
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSubmit() {
      this.formLoading = true
      createInvoice(
        Object.assign({}, this.form, { type: this.listQuery.type, totalAmount: this.totalAmount, orderIds: this.sel.map((i) => i.orderId) })
      )
        .then((r) => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.formLoading = false
          this.formVisible = false
          this.sel = []
          this.fetchData()
        })
        .catch((e) => {
          this.formLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .header {
    background-color: white;
    padding: 8px 16px;
    .el-menu {
      border-bottom: none;
      display: inline-block;
    }
    .el-button {
      margin: 16px 0;
    }
  }
  .table {
    background-color: white;
    border-radius: 4px;
    margin-top: 16px;
    .head {
      padding: 12px;
      font-size: 16px;
      line-height: 28px;
      font-weight: bold;
      span {
        color: #666;
        font-size: 12px;
        font-weight: normal;
      }
      .el-button {
        float: right;
      }
    }
  }
}
</style>
