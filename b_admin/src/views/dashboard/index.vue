<template>
  <div class="dashboard-container" v-if="xiaoer && telephone === 'no'">
    <p style="text-align: center">请选择需要代理的企业</p>
  </div>
  <div v-else class="dashboard-container">
    <notice />
    <el-row class="tools" :gutter="20">
      <el-col :span="12">
        <div class="block function">
          <h3>快捷功能</h3>
          <el-row>
            <el-col :span="12">
              <div class="quic" @click="handelCreate">
                <img src="@/assets/images/dash_create.png" />
                创建商品
              </div>
            </el-col>
            <el-col :span="12">
              <div class="quic" @click="handleActivity">
                <img src="@/assets/images/dash_activity.png" /> 发布活动
              </div>
            </el-col>
            <el-col :span="12">
              <div class="quic" @click="handleAuth">
                <img src="@/assets/images/dash_auth.png" />认证授权
              </div>
            </el-col>
            <el-col :span="12">
              <div class="quic" @click="handleInvoice">
                <img src="@/assets/images/dash_invoice.png" />申请开票
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block task">
          <h3>待办事项</h3>
          <el-row>
            <el-col :span="12">
              <router-link to="/issue/index">
                <span>{{ stat.ticketToBeConfirmed }}</span> 待确认
                <el-icon class="el-icon-arrow-right" />
              </router-link>
            </el-col>
            <el-col :span="12">
              <router-link to="/activity/index">
                <span>{{ stat.orderToBeDelivered }}</span> 待发货
                <el-icon class="el-icon-arrow-right" />
              </router-link>
            </el-col>
            <el-col class="title" :span="12">订单问题</el-col>
            <el-col class="title" :span="12">活动订单</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchDash } from "@/api/user";
import notice from "./components/notice";

export default {
  name: "Dashboard",
  components: { notice },
  data() {
    return {
      stat: {
        orderToBeDelivered: 0,
        ticketToBeConfirmed: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["roles", "statusCode", "brandCount", "xiaoer", "telephone"]),
  },
  mounted() {
    fetchDash().then(({ data }) => {
      this.stat = data || {
        orderToBeDelivered: 0,
        ticketToBeConfirmed: 0,
      };
    });
  },
  methods: {
    handelCreate() {
      if (this.checkStat()) {
        this.$router.push("/goods/create");
      }
    },
    checkStat() {
      if (this.statusCode !== 3) {
        this.$alert("无法创建商品，为保障品牌合作规范，请先完成企业认证").then(
          (r) => {
            if (r === "confirm") {
              this.$router.push("/user/create");
            }
          }
        );
        return false;
      } else if (this.brandCount === 0) {
        this.$alert("无法创建商品，为保障品牌合作规范，请先完成品牌授权").then(
          (r) => {
            if (r === "confirm") {
              this.$router.push("/user/auth");
            }
          }
        );
        return false;
      }
      return true;
    },
    handleActivity() {
      if (this.checkStat()) {
        this.$router.push("/activity/create");
      }
    },
    handleAuth() {
      this.$router.push("/user/create");
    },
    handleInvoice() {
      this.$router.push("/user/invoice");
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  .tools {
    margin: 20px 0;
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h3 {
        margin: 0 0 12px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px;
      }
    }
    .function {
      .el-col div {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
      }
    }
    .task {
      .el-col {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        span {
          font-size: 26px;
          line-height: 40px;
          color: #4244ff;
          font-weight: bold;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
}
</style>
