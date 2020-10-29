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
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="开票编号" width="260">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="260">
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票状态">
          <template slot-scope="{ row }">
            <span>{{
              ["", "待开票", "已拒绝", "已开票"][row.statusCode]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票金额">
          <template slot-scope="{ row }">
            <span>{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="handleDetail(row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
        <div slot="empty" class="empty" style="padding: 48px 0">
          <img src="@/assets/images/goods_empty.png" alt="empty" />
          <p style="margin: 0; color: #999">暂无记录</p>
        </div>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="fetchData"
      />
    </div>
    <el-dialog
      custom-class="custom-dialog"
      title="开票详情"
      :visible.sync="showDetail"
      width="720px"
    >
      <div class="info">
        <p>开票编号：{{ detail.id }}</p>
        <p>
          开票状态：{{ ["", "待开票", "已拒绝", "已开票"][detail.statusCode] }}
          <span>{{ detail.rejectReason }}</span>
        </p>
        <p>开票时间：{{ detail.date }}</p>
        <p>开票金额：{{ detail.totalAmount }}元</p>
        <p>发票抬头：{{ detail.company }}</p>
        <p>税号：{{ detail.rise }}</p>
        <p>接收邮箱：{{ detail.receiveMail }}</p>
        <h5>关联订单</h5>
        <el-table
          :key="1"
          v-loading="detailLoading"
          :data="orders"
          border
          style="width: 100%"
        >
          <el-table-column label="开票编号">
            <template slot-scope="{ row }">
              <span>{{ row.orderId }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 1" label="活动名称">
            <template slot-scope="{ row }">
              <span>{{ row.activityName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 1" label="达人昵称">
            <template slot-scope="{ row }">
              <span>{{ row.bloggerName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 2" label="订购类型">
            <template>
              <span>置换活动</span>
            </template>
          </el-table-column>
          <el-table-column v-if="detail.type === 2" label="订购时间">
            <template slot-scope="{ row }">
              <div class="info">
                <span>{{ row.date }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="{ row }">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>
          <div slot="empty" class="empty" style="padding: 48px 0">
            <img src="@/assets/images/goods_empty.png" alt="empty" />
            <p style="margin: 0; color: #999">暂无记录</p>
          </div>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">取消</el-button>
        <el-button type="primary" @click="showDetail = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchInvoices, fetchLinkInvoice } from "@/api/user";
import moment from "moment";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Profile",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
      },
      detail: {},
      orders: [],
      detailLoading: false,
      showDetail: false,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles", "amount"]),
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      fetchInvoices(this.listQuery).then((r) => {
        this.list = ((r.data || {}).data || []).map((i) =>
          Object.assign(i, {
            date: moment(i.gmtCreate).format("YYYY-MM-DD HH:mm:ss"),
          })
        );
        this.total = ((r.data || {}).pager || {}).count || 0;
        this.listLoading = false;
      });
    },
    handleDetail(row) {
      this.detail = row;
      this.orders = [];
      this.detailLoading = true;
      fetchLinkInvoice({ invoiceId: row.id, type: row.type, page: 1, size: 50 })
        .then((r) => {
          this.orders = r.data.data.map((i) =>
            Object.assign(i, {
              date: moment(i.orderTime).format("YYYY-MM-DD HH:mm:ss"),
            })
          );
          this.detailLoading = false;
        })
        .catch((e) => {
          this.detailLoading = false;
        });
      this.showDetail = true;
    },
    handleSelectionChange(sel) {
      console.log(sel);
    },
    handleInvoice(e) {},
  },
};
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
