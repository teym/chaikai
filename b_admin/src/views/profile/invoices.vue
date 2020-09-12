<template>
  <div class="profile-container">
    <div class="table">
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
        <el-table-column label="开票编号" width="260">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="260">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票状态">
          <template slot-scope="{row}">
            <span>{{ ["","待提交","待排期","已拒绝","未开始","报名中","报名结束"][row.statusCode] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票金额">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleDetail(row)">详情</el-button>
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
    <el-dialog custom-class="custom-dialog" title="开票详情" :visible.sync="showDetail" width="420px">
      <div class="info">
        <p>开票编号：343424</p>
        <p>
          开票状态：已拒绝
          <span>开票信息有误，请修改后提交</span>
        </p>
        <p>开票时间：2020-09-22 12:22</p>
        <p>开票金额：2000元</p>
        <p>发票抬头：9898NJKKK</p>
        <p>公司名称：杭州多维科技有限公司</p>
        <p>接收邮箱：yuu@qq.com</p>
        <h5>关联订单</h5>
        <el-table :key="1" v-loading="detailLoading" :data="orders" border style="width: 100%;">
          <el-table-column label="订单编号">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动名称">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="达人昵称">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddNumber">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchInvoices, fetchInvoice } from '@/api/user'
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
        page: 1,
        size: 10
      },
      detail: {},
      orders: [],
      detailLoading: false,
      showDetail: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles', 'amount'])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchInvoices(this.listQuery).then((r) => {
        this.list = (r.data || {}).data || []
        this.total = ((r.data || {}).pager || {}).count || 0
        this.listLoading = false
      })
    },
    handleDetail(row) {
      this.detail = row
      this.orders = []
      this.detailLoading = true
      fetchInvoice({ id: row.id })
        .then((r) => {
          this.orders = r.data.data
          this.detailLoading = false
        })
        .catch((e) => {
          this.detailLoading = false
        })
      this.showDetail = true
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
