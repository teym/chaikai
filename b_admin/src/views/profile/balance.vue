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
        <el-table-column label="发生时间" width="260">
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
                "106": "其它",
                "107": "其它",
              }[row.type + ""]
            }}</span>
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
        <el-table-column label="详情描述">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              v-if="row.type === 104 || row.type === 105"
              @click="onDetail(row)"
              >订单详情</el-button
            >
            <el-button
              size="mini"
              v-if="row.type === 103"
              @click="onDetail(row)"
              >提现详情</el-button
            >
            <el-button
              size="mini"
              v-if="row.type === 102"
              @click="onDetail(row)"
              >充值详情</el-button
            >
            <el-button
              size="mini"
              v-if="row.type === 101"
              @click="onDetail(row)"
              >订购详情</el-button
            >
            <span
              v-if="row.type === 106 || row.type === 107"
              @click="onDetail(row)"
              >{{ row.remark || "--" }}</span
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
    <el-dialog :title="detailTitle" :visible.sync="detailVisable" width="420px">
      <div v-if="detail && detail.type === 101" class="detail">
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
          <p>
            {{
              ["处理中", "待支付", "订购成功", "订购失败", "已拒绝", "已关闭"][
                detail.statusCode
              ]
            }}
          </p>
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
      <div v-if="detail && detail.type === 102" class="detail">
        <div class="row">
          <h4>充值时间:</h4>
          <p>
            {{ detail.date }}
          </p>
        </div>
        <div class="row">
          <h4>订单编号:</h4>
          <p>{{ detail.orderNo }}</p>
        </div>
        <div class="row">
          <h4>交易单号:</h4>
          <p>{{ detail.tradeNo }}</p>
        </div>
        <div class="row">
          <h4>充值金额:</h4>
          <p>{{ detail.amount }}</p>
        </div>
        <div class="row">
          <h4>状态:</h4>
          <p>
            {{
              ["处理中", "等待支付", "成功", "失败", "已拒绝", "已关闭"][
                detail.statusCode
              ]
            }}
          </p>
        </div>
        <div class="row">
          <h4>支付方式:</h4>
          <p>{{ detail.recharge.type === 1 ? "支付宝" : "银联" }}</p>
        </div>
        <div class="row">
          <h4>支付类型:</h4>
          <p>{{ detail.recharge.payType === 1 ? "线上支付" : "线下打款" }}</p>
        </div>
        <div class="row">
          <h4>备注:</h4>
          <p>{{ detail.remark }}</p>
        </div>
      </div>

      <div v-if="detail && detail.type === 103" class="detail">
        <div class="row">
          <h4>提现状态:</h4>
          <p>
            {{
              ["处理中", "等待支付", "成功", "失败", "已拒绝", "已关闭"][
                detail.statusCode
              ]
            }}<span
              v-if="detail.statusCode === 4"
              style="color: #999; margin-left: 8px"
              >{{ detail.rejectReason }}</span
            >
          </p>
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
          <h4>提现金额:</h4>
          <p>{{ detail.amount }}</p>
        </div>
        <div class="row">
          <h4>企业ID:</h4>
          <p>{{ (detail.company || {}).id }}</p>
        </div>
        <div class="row">
          <h4>企业名称:</h4>
          <p>{{ (detail.company || {}).name }}</p>
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
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchHistory } from "@/api/user";
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
      detail: null,
      detailTitle: "",
      detailVisable: false,
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
    onDetail(row) {
      if (row.type > 105) {
        return;
      }
      if (row.type === 104 || row.type === 105) {
        return window.showCommunicate(row.brActivityOrderId);
      } else {
        this.detailTitle = {
          101: "服务订购",
          102: "账户充值",
          103: "账户提现",
          104: "悬赏订单",
          105: "悬赏退回",
        }[row.type];
        this.detail = row;
        this.detailVisable = true;
      }
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
