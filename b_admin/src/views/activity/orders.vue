<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="row">
        <el-menu
          :default-active="'1'"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item v-for="i in statusList" :key="i.value" :index="i.value">
            {{ i.name }}
            <span v-if="stat[i.value] > 0" class="pill">{{
              stat[i.value]
            }}</span>
          </el-menu-item>
        </el-menu>
        <el-input
          v-model="listQuery.searchKey"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            slot="prepend"
            v-model="listQuery.searchType"
            placeholder="请选择"
            style="width: 80px"
          >
            <el-option label="达人" value="1" />
            <el-option label="订单" value="2" />
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleFilter"
          />
        </el-input>
      </div>
      <div v-show="listQuery.statusCode === '1'" class="row row2">
        <el-select v-model="listQuery.sort" @change="handleFilter">
          <el-option label="推荐排序" value="RECOMMEND" />
          <el-option label="粉丝量" value="FANS" />
          <el-option label="最新申请" value="TIME" />
        </el-select>

        <el-select v-model="listQuery.platformId" @change="handleFilter">
          <el-option label="全部渠道" :value="''" />
          <el-option
            v-for="i in channels"
            :key="i.id"
            :label="i.platformName"
            :value="i.platformId"
          />
        </el-select>

        <el-select v-model="listQuery.goodsSkuUnionId" @change="handleFilter">
          <el-option label="全部规格" :value="''" />
          <el-option
            v-for="i in skus"
            :key="i.skuIdUnion"
            :label="i.name"
            :value="i.skuIdUnion"
          />
        </el-select>
        <div class="right">
          <span
            >活动名额: {{ stat["0"] }} 已通过: {{ stat["2"] }} 已候选:
            {{ stat["8"] }}</span
          >
          <el-button
            type="primary"
            size="mini"
            @click="
              $router.push({
                path: '/activity/qorder',
                query: { id: listQuery.brActivityId },
              })
            "
            >候选名单{{ stat["8"] }}</el-button
          >
        </div>
      </div>
      <div v-show="listQuery.statusCode === '3'" class="row row2">
        <div class="place" />
        <div class="right">
          <el-button type="primary" size="mini" @click="handleBatchShip"
            >批量发货</el-button
          >
        </div>
      </div>
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
      <el-table-column label="达人">
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
      <el-table-column label="申请信息">
        <template slot-scope="{ row }">
          <span>
            规格：{{ row.goodsSku }}
            <br />
            申请理由：{{ row.applyReason }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="申请渠道"
        width="90"
      >
        <template slot-scope="{ row }">
          <div v-for="c in row.channels" :key="c.platformId" class="channel">
            <img :src="channelIcons['' + c.platformId].icon" />
            <span>{{ channelIcons[c.platformId + ""].name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '6'" label="评测内容">
        <template slot-scope="{ row }">
          <a
            v-for="(c, i) in row.evaluationItems"
            :key="i"
            class="pingce"
            target="_blank"
            :href="c.url"
          >
            <img :src="channelIcons[c.platformId + ''].icon" alt="" />
            <span>{{ c.type === 1 ? "正式" : "追加" }}</span>
            <span>活动量{{ c.activeAmount }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="粉丝/万"
        width="90"
      >
        <template slot-scope="{ row }">
          <span v-for="c in row.channels" :key="c.platformId">
            {{ c.fansCount }}
            <br />
          </span>
        </template>
      </el-table-column>
      <el-table-column
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
            >{{ ["", "接受悬赏", "达人报价"][row.activity.cooperationType] }}¥{{
              row.reward
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
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
      <el-table-column v-if="listQuery.statusCode === '3'" label="发货时间">
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '4'" label="确认收货">
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '5'" label="评测时间">
        <template slot-scope="{ row }">
          <span>测评发布时间还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
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
      <el-table-column label="押金状态">
        <template slot-scope="{ row }">
          <span>
            <strong>{{
              {
                "1": "未缴押金",
                "2": "已冻结",
                "3": "已解冻",
                "4": "已扣除",
              }[row.depositStatus + ""]
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
        v-if="listQuery.statusCode !== '2' && listQuery.statusCode !== '7'"
        label="操作"
        align="center"
        width="280"
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
                listQuery.statusCode === '5'
              "
              size="mini"
              type="primary"
              @click="handleDetail(row)"
              >订单详情</el-button
            >
            <el-button
              v-if="
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
              v-if="listQuery.statusCode === '6' && !row.scoreInfo"
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
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      custom-class="custom-dialog"
      title="投诉测评"
      :visible.sync="formVisible"
      width="720px"
    >
      <el-form class="dialog-content">
        <h6>请选择您要投诉的测评（只支持正式测评）</h6>
        <el-checkbox-group v-model="sels">
          <el-row>
            <el-col v-for="(c, i) in detail.evaluationItems" :key="i" :span="8">
              <el-form-item style="">
                <el-checkbox :disabled="c.type !== 1" :label="c.id">
                  <span class="ceping">
                    <img :src="channelIcons[c.platformId + ''].icon" alt="" />
                    <span>{{ c.type === 1 ? "正式" : "追加" }}</span>
                    <span>活动量{{ c.activeAmount }}</span>
                  </span>
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <h6>请选择您要投诉的测评（只支持正式测评）</h6>
        <p class="light">
          以下为官方接受的所有测评问题 |
          不合理的问题达人有权选择忽视，两天后官方会介入审核您的投诉
        </p>
        <el-row>
          <el-col :span="8">
            <div
              v-for="(row, i) in reasonList"
              :key="i"
              :style="{ height: '32px', marginTop: row.title ? '8px' : '0' }"
            >
              {{ row.title }}
            </div>
          </el-col>
          <el-col :span="16">
            <el-checkbox-group v-model="reason" :min="1" :max="3">
              <el-checkbox
                v-for="(row, i) in reasonList"
                :key="i"
                :style="{
                  display: 'block',
                  height: '32px',
                  marginTop: row.title ? '8px' : '0',
                }"
                :label="row.id"
                >{{ row.content }}</el-checkbox
              >
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button
          :loading="formLoading"
          type="primary"
          @click="handleCreateComplain"
          >发起投诉</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title="查看物流"
      :visible.sync="shipVisible"
      width="520px"
    >
      <h6 style="margin: 8px 0; padding: 0">快递公司: {{ ship.name }}</h6>
      <h6 style="margin: 8px 0; padding: 0">快递单号: {{ ship.no }}</h6>
      <div v-for="(l, i) in ship.list" :key="i" style="margin: 8px 0">
        <p style="margin: 0">{{ l.time }}</p>
        <p style="margin: 8px 0">{{ l.content }}</p>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title=""
      :visible.sync="commendVisible"
      width="360px"
    >
      <div class="commend">
        <el-rate v-model="commend.value" class="big" @change="onValue" />
        <p>{{ commend.scopes.msg }}</p>
        <el-checkbox-group
          v-model="commend.tags"
          size="small"
          class="check_btns"
          :min="0"
          :max="3"
        >
          <el-checkbox-button
            v-for="(item, i) in commend.scopes.list"
            :key="i"
            class="check_btn none_border"
            :label="item.id"
            >{{ item.msg }}</el-checkbox-button
          >
        </el-checkbox-group>
        <span>合作结束15天后默认好评</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commendVisible = false">取消</el-button>
        <el-button
          :loading="formLoading"
          type="primary"
          @click="handleCreateCommend"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title="批量发货"
      :visible.sync="batchVisbale"
      width="520px"
    >
      <p>
        步骤 １：点击<a
          :style="{ color: batchUrl ? '#4244ff' : '#999999' }"
          :href="batchUrl"
          >下载</a
        >发货信息表
      </p>
      <p>步骤 ２：在Excel表中填写快递单号、快递名称</p>
      <p>步骤 ３：上传已填好发货信息的Excel文件即可批量发货</p>
      <Upload
        v-if="batchVisbale"
        ref="upload"
        :url="conf.url"
        :headers="conf.headers"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchVisbale = false">取消</el-button>
        <el-button
          :loading="batchLoading"
          type="primary"
          @click="handleBatchUpload"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchOdList,
  fetchOdStat,
  fetchData,
  updateAction,
  complain,
  fetchTickets,
  fetchShip,
  fetchScope,
  updateScope,
  exportToken,
  downloadUrl,
  importUrl,
} from "@/api/activities";
import { ActivityOrderStatus, Channels, ChannelIcons } from "@/utils/constant";
import { clearQueryObject, formatDeadLine } from "@/utils/index";
import { mapGetters } from "vuex";
import _ from "underscore";
import moment from "moment";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Upload from "@/components/Upload/SingleFile";
import { getConf } from "@/api/oss";

export default {
  name: "ComplexTable",
  components: { Pagination, Upload },
  directives: { waves },
  data() {
    const upload = getConf();
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
      sels: [],
      reasonList: [],
      reason: [],
      formVisible: false,
      formLoading: false,
      shipVisible: false,
      ship: {},
      commendVisible: false,
      commend: {
        value: 5,
        tags: [],
        scopes: {},
      },
      scopes: [],
      batchVisbale: false,
      batchUrl: "",
      batchLoading: false,
      conf: {
        url: importUrl(),
        headers: upload.headers,
      },
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "telephone", "statusCode", "brandCount"]),
  },
  created() {
    this.listQuery.brActivityId = this.$route.query && this.$route.query.id;
    this.getTabs();
    this.getList();
    this.getTicks();
    this.getScope();
  },
  methods: {
    getTabs() {
      Promise.all([
        fetchOdStat({ brActivityId: this.listQuery.brActivityId }),
        fetchData(this.listQuery.brActivityId),
      ])
        .then((r) => {
          this.stat = {
            0: r[0].data.total,
            1: r[0].data.pending,
            2: r[0].data.notPayDeposit,
            3: r[0].data.toBeDelivered,
            4: r[0].data.toBeReceived,
            5: r[0].data.toBeEvaluated,
            6: r[0].data.evaluated,
            7: r[0].data.closed,
            8: r[0].data.candidate,
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
    getTicks() {
      fetchTickets().then(({ data }) => {
        this.reasonList = _.flatten(
          data.map((i) => {
            i.list[0].title = i.name;
            return i.list;
          })
        );
      });
    },
    getScope() {
      fetchScope().then((r) => {
        this.scopes = r.data;
      });
    },
    getShip(id) {
      fetchShip(id).then((r) => {
        this.ship = r.data;
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
      if (act === "CANDIDATE") {
        row.brRemark = "";
        row.candidate = true;
      } else if (act === "PASS" && !tip) {
        this.$confirm(
          "确认通过" +
            row.blogger.nickname +
            "的活动申请，并消耗账户余额" +
            row.reward +
            "元",
          {
            title: "一键通过",
          }
        )
          .then((r) => {
            if (r === "confirm") {
              this.handleAction(row, act, true);
            }
          })
          .catch((e) => {});
      } else {
        this.listLoading = true;
        updateAction({ orderId: row.id, action: act })
          .then((r) => {
            this.getTabs();
            this.getList();
          })
          .catch((e) => {
            this.listLoading = false;
          });
      }
    },
    handleRemark(row) {
      this.listLoading = true;
      updateAction({
        orderId: row.id,
        action: "CANDIDATE",
        candidate: row.candidate,
        remark: row.brRemark,
      })
        .then((r) => {
          this.getTabs();
          this.getList();
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    handleBatchShip() {
      this.batchVisbale = true;
      this.getBatchShip();
    },
    getBatchShip() {
      exportToken().then((r) => {
        if (r.data) {
          console.log(r.data);
          this.batchUrl = downloadUrl(r.data);
        } else {
          this.$message({ message: "获取下载链接失败", type: "error" });
        }
      });
    },
    handleBatchUpload() {
      this.batchLoading = true;
      this.$refs.upload
        .submit()
        .then((r) => {
          this.batchLoading = false;
          this.batchVisbale = false;
          this.getTabs();
          this.getList();
        })
        .catch((e) => {
          this.batchLoading = false;
          this.$message({ message: e.msg, type: "error" });
        });
    },
    handleShip(row) {
      this.shipVisible = true;
      this.getShip(row.receiver.logisticsNo);
    },
    handleComplain(row) {
      if (row.ticketStatusCode > 0) {
        this.$router.push("/issue/index");
      } else {
        this.detail = row;
        this.formVisible = true;
      }
    },
    handleCommend(row) {
      this.commend = {
        value: 5,
        tags: [],
        scopes: this.scopes[4],
      };
      this.detail = row;
      this.commendVisible = true;
    },
    onValue(e) {
      this.commend.scopes = this.scopes[Math.max(e, 1) - 1];
    },
    handleCreateCommend() {
      const value = this.commend.value;
      const list = this.commend.scopes.list
        .map((i) => Object.assign(i, { score: value + 5 }))
        .filter((i) => this.commend.tags.indexOf(i.id) >= 0);
      this.formLoading = true;
      updateScope({
        brActivityOrderId: this.detail.id,
        itemList: list,
        score: value + 5,
        blAccountId: this.detail.blAccountId,
      })
        .then((r) => {
          this.$message({ message: "已评价" });
          this.formLoading = false;
          this.commendVisible = false;
        })
        .catch((e) => {
          this.formLoading = false;
        });
    },
    handleCreateComplain() {
      complain({
        brActivityId: this.detail.activity.id,
        brActivityOrderId: this.detail.id,
        items: this.reason.map((itemId) => ({ itemId })),
        evaluations: this.sels.map((id) => ({ id })),
      }).then((r) => {
        this.formVisible = false;
        this.sels = [];
        this.reason = [];
        this.detail = {};
        this.$message({ message: "已投诉", type: "success" });
      });
    },
    handleDetail(row) {
      window.showCommunicate(row.id);
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
.pingce {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #dcdfe6;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
  margin: 4px 0;
  font-size: 14px;
  img {
    width: 24px;
    height: 24px;
  }
  span {
    margin: 0 4px;
  }
}
.ceping {
  background-color: #dcdfe6;
  border: 1px solid #f5f5f5;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  img {
    width: 20px;
    height: 20px;
  }
  span {
    margin: 0 4px;
  }
}
.commend {
  display: flex;
  flex-direction: column;
  align-items: center;
  .check_btns {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .check_btn {
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      overflow: hidden;
      margin: 6px 8px;
    }
  }
  p {
    font-size: 16px;
    color: #ff8300;
    margin: 16px;
  }
  span {
    margin-top: 36px;
    font-size: 12px;
    color: #c3c3c3;
  }
}
</style>
