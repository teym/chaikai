<template>
  <div class="profile-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="订购时间">
        <template slot-scope="{ row }">
          <div class="info">
            <span>{{ row.date }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订购服务">
        <template>
          <span>置换活动</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <span>{{
            ["", "待支付", "成功", "失败", "已拒绝", "已关闭", "处理中"][
              row.statusCode
            ]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="handleDetail(row)"
            >详情</el-button
          >
          <el-button
            v-if="row.statusCode === 1"
            type="text"
            size="mini"
            @click="handlePay(row)"
            >去支付</el-button
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
    <el-dialog
      custom-class="custom-dialog"
      title="订购详情"
      :visible.sync="formVisible"
      width="620px"
    >
      <div class="detail">
        <el-row>
          <el-col :span="4">提交时间</el-col>
          <el-col :span="8">{{ detail.date }}</el-col>
          <el-col :span="4">订购单号</el-col>
          <el-col :span="8">{{ detail.orderNo }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订购服务</el-col>
          <el-col :span="8">置换活动</el-col>
          <el-col :span="4">订购状态</el-col>
          <el-col :span="8">{{
            ["", "待支付", "成功", "失败", "已拒绝", "已关闭", "处理中"][
              detail.statusCode
            ]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订购详情</el-col>
          <el-col :span="20">
            订购次数: {{ Math.ceil(detail.amount / 399) }}
            <br />
            <br />
            支付金额: {{ detail.amount }}
            <br />
            <br />
            支付方式: {{ detail.recharge ? "支付宝" : "余额" }}
            {{ detail.tradeNo ? " 支付单号" + detail.tradeNo : "" }}
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" />
    </el-dialog>
    <div id="tmp" v-html="tmp" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchHistory, buyAlipay } from "@/api/user";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from 'moment'

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
        type: 101,
      },
      detail: {},
      formVisible: false,
      tmp: "",
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"]),
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
            date: moment(i.gmtCreate).format("YYYY-MM-DD HH:mm"),
          })
        );
        this.total = ((r.data || {}).pager || {}).count || 0;
        this.listLoading = false;
      });
    },
    handleDetail(row) {
      this.detail = row;
      this.formVisible = true;
    },
    handlePay(row) {
      this.listLoading = true;
      buyAlipay({ amount: row.amount, payScene: "BR_SERVER_ORDER", recordId: row.id })
        .then((r) => {
          this.listLoading = false;
          this.tmp = r.data.body.replace("<form ", '<form target="_blank"');
          this.$nextTick().then((r) => {
            window.document.getElementById("bestPayForm").submit();
          });
          this.$confirm("是否已完成支付？").then((r) => {
            if (r === "confirm") {
              this.$store.dispatch("user/getInfo");
              this.$router.push("/user/index");
            }
          });
        })
        .catch((e) => {
          console.log(e);
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .el-table {
    background-color: white;
    border-radius: 4px;
    margin-top: 16px;
  }
  .detail {
    border-left: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    .el-row {
      border-top: 1px solid #f5f5f5;
      .el-col {
        border-right: 1px solid #f5f5f5;
        height: 100%;
        padding: 16px;
      }
    }
  }
}
</style>
