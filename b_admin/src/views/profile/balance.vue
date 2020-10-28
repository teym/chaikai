<template>
  <div class="profile-container">
    <div class="header">
      账户金额
      <span>
        {{ amount }}
        <span>元</span>
      </span>
      <el-button @click="$router.push('/user/withdraw')">提现</el-button>
      <el-button type="primary" @click="$router.push('/user/topup')"
        >充值</el-button
      >
    </div>
    <div class="table">
      <div class="head">
        余额明细
        <el-button
          type="primary"
          size="mini"
          @click="$router.push('/user/invoice')"
          >开发票</el-button
        >
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
        <el-table-column label="订购时间" width="260">
          <template slot-scope="{ row }">
            <div class="info">
              <span>{{ row.date }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="{ row }">
            <span>{{
              {
                "101": "服务订购",
                "102": "账户充值",
                "103": "账户提现",
                "104": "悬赏订单",
                "105": "悬赏退回",
              }[row.type + ""]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情描述">
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额变动">
          <template slot-scope="{ row }">
            <span>{{ (row.raeType === 2 ? "-" : "") + row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上次余额">
          <template slot-scope="{ row }">
            <span>{{ row.lastBalance }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button
              v-if="row.statusCode === 1 || row.statusCode === 3"
              type="text"
              size="mini"
              @click="handleDetail(row)"
            >详情</el-button>
            <el-button
              v-if="row.statusCode === 1 || row.statusCode === 3"
              type="text"
              size="mini"
              @click="handlePay(row)"
            >去支付</el-button>
          </template>
        </el-table-column> -->
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
    <!-- <el-dialog
      custom-class="custom-dialog"
      title="增加活动名额"
      :visible.sync="formVisible"
      width="420px"
    >
      <el-form label-width="60px">
        <el-form-item label="活动名额">
          <span>{{ detail.totalNum }}</span>
        </el-form-item>
        <el-form-item label="剩余名额">
          <span>{{ detail.remainingNum }}</span>
        </el-form-item>
        <el-form-item label="增加名额">
          <el-input v-model="append" placeholder="#话题" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button :loading="formLoading" type="primary" @click="handleAddNumber">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchHistory } from "@/api/user";
import moment from 'moment';
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
      fetchHistory(this.listQuery).then((r) => {
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
      this.$router.push({ path: "/user/auth", query: { id: row.id } });
    },
    handlePay() {
      this.$router.push("/user/auth");
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .header {
    background-color: white;
    margin-bottom: 20px;
    padding: 16px 0 16px 16px;
    font-size: 18px;
    line-height: 36px;
    font-weight: bold;
    vertical-align: middle;
    span {
      font-size: 26px;
      line-height: 36px;
      color: #4244ff;
      margin-left: 40px;
      span {
        font-size: 14px;
        line-height: 36px;
        color: #666;
        margin-left: 4px;
      }
    }
    .el-button {
      float: right;
      margin-right: 16px;
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
      .el-button {
        float: right;
      }
    }
  }
}
</style>
