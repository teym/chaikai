<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-show="listQuery.statusCode === '1'" class="row row2">
        <div class="place" />
        <div class="right">
          <span
            >活动名额: {{ stat["0"] }} 已通过: {{ stat["9"] }} 剩余名额:
            {{ stat["10"] }}</span
          >
          <el-button type="primary" size="medium" @click="handleAccept()"
            >一键通过</el-button
          >
        </div>
      </div>
    </div>

    <el-table
      :key="this.listQuery.statusCode"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      ref="table"
    >
      <el-table-column label="达人" :index="1" width="260">
        <template slot-scope="{ row }">
          <div class="info">
            <img :src="row.blogger.avatar" alt="pic" />
            <div>
              <p>
                {{ row.blogger.nickname }}
                <span>评分：{{ row.blogger.score }}</span>
              </p>
              <p>
                <span
                  v-for="(i, j) in row.blogger.areas"
                  :key="j"
                  class="pill"
                  >{{ i.name }}</span
                >
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请信息" :index="2">
        <template slot-scope="{ row }">
          <span>
            规格：{{ row.goodsSku }}
            <br />
            申请理由：{{ row.applyReason }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="3"
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="申请渠道"
        width="120"
      >
        <template slot-scope="{ row }">
          <a
            v-for="c in row.channels"
            :key="c.platformId"
            class="channel"
            :href="c.homeLink"
            target="_blank"
          >
            <img :src="channelIcons['' + c.platformId].icon" />
            <span>{{ channelIcons[c.platformId + ""].name }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        :index="4"
        v-if="listQuery.statusCode === '6'"
        label="评测内容"
        width="160"
      >
        <template slot-scope="{ row }">
          <div class="pingce" v-for="(c, i) in row.evaluationItems" :key="i">
            <a target="_blank" :href="c.url">
              <img :src="channelIcons[c.platformId + ''].icon" alt="" /> </a
            ><a :href="c.url">
              <span>{{ c.type === 1 ? "正式" : "追加" }}</span>
              <span>互动量{{ c.activeAmount }}</span>
              <el-icon class="el-icon-arrow-right"></el-icon>
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :index="5"
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="粉丝/万"
        width="90"
      >
        <template slot-scope="{ row }">
          <div v-for="c in row.channels" :key="c.platformId" class="channel">
            <span>{{ ((parseFloat(c.fansCount) || 0) / 10000).toFixed(2) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :index="6"
        v-if="
          listQuery.statusCode === '1' ||
          listQuery.statusCode === '2' ||
          listQuery.statusCode === '6' ||
          listQuery.statusCode === '7'
        "
        label="合作方式"
        width="120"
      >
        <template slot-scope="{ row }">
          <span
            >{{ ["", "接受悬赏", "达人报价", "免费置换"][row.coopSubType]
            }}{{ row.coopSubType !== 3 ? "¥" + row.reward : "" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        :index="7"
        v-if="
          listQuery.statusCode === '3' ||
          listQuery.statusCode === '4' ||
          listQuery.statusCode === '5'
        "
        label="收货信息"
      >
        <template slot-scope="{ row }">
          <span>
            收货人：{{ (row.receiver || {}).name }}
            <br />
            手机号码：{{ (row.receiver || {}).telephone }}
            <br />
            收货地址：{{
              ((row.receiver || {}).province || "") +
              ((row.receiver || {}).city || "") +
              ((row.receiver || {}).county || "") +
              ((row.receiver || {}).address || "")
            }}
            <br />
            物流信息：{{
              ((row.receiver || {}).logisticsPlatform || "") +
              ((row.receiver || {}).logisticsNo || "")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="8"
        v-if="listQuery.statusCode === '3'"
        label="发货时间"
      >
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="9"
        v-if="listQuery.statusCode === '4'"
        label="确认收货"
      >
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="10"
        v-if="listQuery.statusCode === '5'"
        label="评测时间"
      >
        <template slot-scope="{ row }">
          <span>测评发布时间还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="11"
        v-if="listQuery.statusCode === '6' || listQuery.statusCode === '7'"
        label="悬赏"
      >
        <template slot-scope="{ row }">
          <span>
            <strong>{{
              {
                "1": "待发放",
                "2": "已发放",
                "3": "已取消",
              }[row.rewardStatusCode + ""]
            }}</strong>
            <br />
            {{
              row.rewardStatusCode === 1
                ? "还剩" + row.deadlineText + "自动发放"
                : row.rewardStatusCode === 3
                ? "测评违规/不符合悬赏规范，已退回至品牌方"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="12"
        v-if="listQuery.statusCode !== '1'"
        label="押金状态"
      >
        <template slot-scope="{ row }">
          <span>
            <strong>{{
              ["", "未缴押金", "已冻结", "已解冻", "已扣除"][
                (row.depositInfo || {}).statusCode || 1
              ]
            }}</strong>
            <br />
            {{
              listQuery.statusCode === "2"
                ? "押金支付还剩" + row.deadlineText + ",超时将视作放弃名额"
                : listQuery.statusCode === "3"
                ? "发布测评后15天自动退还"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="13"
        v-if="listQuery.statusCode !== '2' && listQuery.statusCode !== '7'"
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <div>
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              @click="handleAction(row, 'REJECT')"
              >拒绝</el-button
            >
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              type="primary"
              @click="handleAction(row, 'PASS')"
              >通过</el-button
            >
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              type="primary"
              :icon="row.candidate ? 'el-icon-checked' : 'el-icon-plus'"
              @click="handleAction(row, 'CANDIDATE')"
              >{{ row.candidate ? "已" : "" }}候选</el-button
            >
            <el-button
              v-if="
                listQuery.statusCode === '3' ||
                listQuery.statusCode === '4' ||
                listQuery.statusCode === '5' ||
                listQuery.statusCode === '6'
              "
              size="mini"
              type="primary"
              @click="handleDetail(row)"
              >订单详情</el-button
            >
            <el-button
              v-if="
                row.rewardStatusCode !== 2 &&
                listQuery.statusCode === '6' &&
                row.ticketStatusCode !== 5 &&
                row.ticketStatusCode !== 7
              "
              size="mini"
              :type="row.ticketStatusCode > 0 ? '' : 'primary'"
              @click="handleComplain(row)"
              >{{ row.ticketStatusCode > 0 ? "投诉处理中" : "投诉" }}
            </el-button>
            <el-button
              v-if="
                listQuery.statusCode === '6' &&
                row.rewardStatusCode === 2 &&
                !row.scoreInfo
              "
              size="mini"
              type="primary"
              @click="handleCommend(row)"
              >评价</el-button
            >
            <el-button
              v-if="
                listQuery.statusCode === '4' || listQuery.statusCode === '5'
              "
              size="mini"
              type="primary"
              @click="handleShip(row)"
              >查看物流</el-button
            >
          </div>
          <div
            v-if="listQuery.statusCode === '1' && row.candidate"
            style="margin: 8px 32px 0 32px"
          >
            <el-input
              v-model="row.brRemark"
              size="mini"
              @change="handleRemark(row)"
            />
          </div>
        </template>
      </el-table-column>
      <div slot="empty" class="empty" style="padding: 48px 0">
        <img src="@/assets/images/goods_empty.png" alt="empty" />
        <p style="margin: 0; color: #999">暂无订单</p>
      </div>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
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
import {
  fetchOdList,
  fetchOdStat,
  fetchData,
  updateAction,
  passAll,
} from "@/api/activities";
import { ActivityOrderStatus, Channels, ChannelIcons } from "@/utils/constant";
import { clearQueryObject, formatDeadLine } from "@/utils/index";
import { mapGetters } from "vuex";
import moment from "moment";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      statusList: ActivityOrderStatus,
      channels: [],
      channelIcons: ChannelIcons,
      skus: [],
      tableKey: 0,
      list: null,
      total: 0,
      stat: {},
      listLoading: true,
      listQuery: {
        brActivityId: 0,
        page: 1,
        size: 10,
        candidate: true,
        sort: "RECOMMEND",
        statusCode: "1",
        platformId: "",
        goodsSkuUnionId: "",
        searchType: "1",
        searchKey: "",
      },
      activeIndex: "",
      detail: {},
      append: 0,
      formVisible: false,
      formLoading: false,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "telephone", "statusCode", "brandCount"]),
  },
  created() {
    this.listQuery.brActivityId = this.$route.query && this.$route.query.id;
    this.getTabs();
    this.getList();
  },
  methods: {
    getTabs() {
      Promise.all([
        fetchOdStat({ brActivityId: this.listQuery.brActivityId }),
        fetchData(this.listQuery.brActivityId),
      ])
        .then((r) => {
          this.stat = {
            0: r[1].data.totalNum,
            1: r[0].data.pending,
            2: r[0].data.notPayDeposit,
            3: r[0].data.toBeDelivered,
            4: r[0].data.toBeReceived,
            5: r[0].data.toBeEvaluated,
            6: r[0].data.evaluated,
            7: r[0].data.closed,
            8: r[1].data.candidate || 0,
            9: r[1].data.totalNum - (r[1].data.remainingNum || 0),
            10: r[1].data.remainingNum || 0,
          };
          this.channels = r[1].data.extension.channelLimit
            ? r[1].data.extension.channels.map((i) =>
                Object.assign({}, i, ChannelIcons[i.platformId + ""])
              )
            : Channels.map((i) =>
                Object.assign(
                  { platformName: i.name, platformId: i.id },
                  i,
                  ChannelIcons[i.id + ""]
                )
              );
          this.skus = r[1].data.goods.skuUnionList;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getList() {
      this.listLoading = true;
      const obj = Object.assign({}, this.listQuery);
      if (obj.searchType === "1") {
        obj.orderId = obj.searchKey;
      } else {
        obj.bloggerName = obj.searchKey;
      }
      fetchOdList(clearQueryObject(obj))
        .then((response) => {
          this.list = response.data.data.map((i) =>
            Object.assign(
              { brRemark: "", deadlineText: formatDeadLine(i.deadline) },
              i
            )
          );
          this.total = response.data.pager.count;

          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    handleSelect(e) {
      this.listQuery.statusCode = e;
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleAction(row, act, tip) {
      if (act === "PASS" && !tip) {
        this.$confirm(
          "确认通过" +
            row.blogger.nickname +
            "的活动申请，并消耗账户余额" +
            row.reward +
            "元",
          {
            title: "提示",
          }
        )
          .then((r) => {
            if (r === "confirm") {
              this.handleAction(row, act, true);
            }
          })
          .catch((e) => {});
        return;
      }
      if (act === "CANDIDATE") {
        row.brRemark = "";
        row.candidate = !row.candidate;
      }
      // this.listLoading = true;
      updateAction({
        orderId: row.id,
        action: act,
        candidate: row.candidate,
        remark: row.brRemark,
      })
        .then((r) => {
          // this.listLoading = false;
          this.getTabs();
          if (act !== "CANDIDATE") {
            this.getList();
          }
        })
        .catch((e) => {
          // this.listLoading = false;
        });
    },
    handleRemark(row) {
      // this.listLoading = true;
      updateAction({
        orderId: row.id,
        action: "CANDIDATE",
        candidate: row.candidate,
        remark: row.brRemark,
      })
        .then((r) => {
          this.getTabs();
          // this.getList();
        })
        .catch((e) => {
          // this.listLoading = false;
        });
    },
    handleAccept() {
      if (this.list.length > 0) {
        const count = Math.min(this.list.length, this.stat['10']);
        this.$confirm(
          `将消耗${count}个活动名额和账户余额${count * this.list[0].reward}元`,
          {
            title: "一键通过",
          }
        ).then((r) => {
          if (r === "confirm") {
            this.listLoading = true;
            passAll({ orderIds: this.list.map((i) => i.id) })
              .then((r) => {
                this.getTabs();
                this.getList();
              })
              .catch((e) => {
                this.listLoading = false;
              });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  background-color: white;
  border-radius: 4px;
  margin-bottom: 20px;
  padding-bottom: 0;
  .row {
    padding: 8px 16px;
    .title {
      font-size: 20px;
      color: #333;
      font-weight: bold;
      margin-right: 12px;
    }
    .input-with-select {
      float: right;
      width: 320px;
    }
    .el-menu {
      display: inline-block;
      border: none;
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        .pill {
          background-color: #4244ff;
          font-size: 12px;
          color: white;
          line-height: 18px;
          border-radius: 9px;
          min-width: 18px;
          padding: 0 4px;
          margin-left: 8px;
        }
      }
    }
  }
  .row2 {
    border-top: 1px solid #f5f5f5;
    .el-select {
      margin-right: 8px;
    }
    .place {
      height: 36px;
      width: 10px;
      display: inline-block;
    }
    .right {
      float: right;
      span {
        display: inline-block;
        font-size: 16px;
        color: #333;
        line-height: 28px;
        margin: 0 16px;
      }
    }
  }
}
.channel {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  img {
    width: 32px;
    height: 32px;
    margin-right: 4px;
  }
  span {
    line-height: 32px;
  }
}
.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #f5f5f5;
  }
  div {
    margin-left: 8px;
    height: 50px;
    flex: 1;
    p {
      color: #333;
      font-size: 18px;
      line-height: 25px;
      margin: 0;
      padding: 0;
      span {
        color: #ff8300;
        font-size: 12px;
        float: right;
      }
      span.pill {
        float: none;
        font-size: 12px;
        color: #4244ff;
        line-height: 25px;
        padding: 0 8px;
        border-radius: 12px;
        background-color: #4244ffa6;
        margin-right: 8px;
      }
    }
  }
}
</style>
