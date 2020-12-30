<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="row">
        <el-menu
          :default-active="'1'"
          class="el-menu-demo"
          active-text-color="#4244FF"
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
            :value="i.id"
          />
        </el-select>
        <div class="right">
          <span
            >活动名额: {{ stat["0"] }} 已通过: {{ stat["10"] }} 剩余名额:
            {{ stat["11"] }}</span
          >
          <el-button
            type="primary"
            size="medium"
            @click="
              $router.push({
                path: '/activity/qorder',
                query: { id: listQuery.brActivityId },
              })
            "
            >候选名单{{ stat["9"] > 0 ? stat["9"] : "" }}</el-button
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
      <div v-show="listQuery.statusCode === '6'" class="row row2">
        <div class="place" />
        <div class="right">
          <el-button type="primary" size="mini" @click="handleExport"
            >导出</el-button
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
      <el-table-column label="达人" :index="1" width="320">
        <template slot-scope="{ row }">
          <div class="info">
            <img :src="row.blogger.avatar" alt="pic" />
            <div class="content">
              <div class="row">
                <el-tooltip content="Top center" placement="top">
                  <p>
                    {{ row.blogger.nickname }}
                  </p>
                </el-tooltip>
                <span>评分：{{ row.blogger.score }}</span>
              </div>
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
          <div class="apply">
            <p>规格：{{ row.goodsSku }}</p>
            <el-popover
              trigger="click"
              :content="row.applyReason"
              placement="bottom"
            >
              <p
                slot="reference"
                style="
                  height: 23px;
                  overflow: hidden;
                  word-break: keep-all;
                  text-overflow: ellipsis;
                  margin: 0;
                  color: #999;
                "
              >
                申请理由：{{ row.applyReason }}
              </p>
            </el-popover>
          </div>
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
            <a target="_blank" :href="c.channel.homeLink">
              <img :src="channelIcons[c.platformId + ''].icon" alt="" />
              <span>{{ c.type === 2 ? "追加" : "正式" }}</span> </a
            ><a :href="c.url" target="_blank" @click="onRead(c)">
              <span>互动量{{ c.activeAmount }}</span>
              <el-icon class="el-icon-arrow-right"></el-icon>
            </a>
            <div v-if="!c.read" class="dot"></div>
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
            <span>{{
              ((parseFloat(c.fansCount) || 0) / 10000).toFixed(2)
            }}</span>
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
          listQuery.statusCode === '5' ||
          listQuery.statusCode === '8'
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
            {{
              listQuery.statusCode === "3"
                ? ""
                : `物流信息：${
                    ((row.receiver || {}).logisticsPlatform || "") +
                    ((row.receiver || {}).logisticsNo || "")
                  }`
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="8"
        v-if="listQuery.statusCode === '8'"
        label="逾期时间"
      >
        <template slot-scope="{ row }">
          <span> 已逾期{{ row.delayed }} </span>
        </template>
      </el-table-column>
      <el-table-column
        :index="9"
        v-if="listQuery.statusCode === '3'"
        label="发货时间"
      >
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="10"
        v-if="listQuery.statusCode === '4'"
        label="确认收货"
      >
        <template slot-scope="{ row }">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="11"
        v-if="listQuery.statusCode === '5'"
        label="评测时间"
      >
        <template slot-scope="{ row }">
          <span>测评发布时间还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :index="12"
        v-if="listQuery.statusCode === '6' || listQuery.statusCode === '7'"
        label="悬赏"
      >
        <template slot-scope="{ row }">
          <span>
            <strong>{{
              row.coopSubType === 3
                ? "无"
                : ["", "待发放", "已发放", "已取消"][row.rewardStatusCode]
            }}</strong>
            <br />
            {{ row.coopSubType === 3 ? "" : row.rewardMsg }}
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
              :type="row.candidate ? '' : 'primary'"
              :icon="row.candidate ? 'el-icon-check' : 'el-icon-plus'"
              @click="handleAction(row, 'CANDIDATE')"
              >{{ row.candidate ? "已" : "" }}候选</el-button
            >
            <el-button
              v-if="
                listQuery.statusCode === '3' ||
                listQuery.statusCode === '4' ||
                listQuery.statusCode === '5' ||
                listQuery.statusCode === '6' ||
                listQuery.statusCode === '8'
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
                row.ticketStatusCode !== 7
              "
              size="mini"
              :type="
                row.ticketStatusCode > 0 && row.ticketStatusCode < 5
                  ? ''
                  : 'primary'
              "
              @click="handleComplain(row)"
              >{{
                row.ticketStatusCode > 0 && row.ticketStatusCode < 5
                  ? "投诉处理中"
                  : row.ticketStatusCode === 7
                  ? "已违规"
                  : "投诉"
              }}
            </el-button>
            <el-button
              v-if="listQuery.statusCode === '6' && row.rewardStatusCode > 1"
              size="mini"
              :type="row.scoreInfo ? '' : 'primary'"
              @click="handleCommend(row)"
              >{{ row.scoreInfo ? "已评价" : "评价" }}</el-button
            >
            <el-button
              v-if="
                listQuery.statusCode === '4' ||
                listQuery.statusCode === '5' ||
                listQuery.statusCode === '8'
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
                <el-checkbox
                  :disabled="c.type !== 1"
                  :label="c.id"
                  style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                  "
                >
                  <span class="ceping">
                    <img :src="channelIcons[c.platformId + ''].icon" alt="" />
                    <span>{{ c.type === 2 ? "追加" : "正式" }}</span>
                    <span>互动量{{ c.activeAmount }}</span>
                  </span>
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <h6>请选择您要投诉的测评问题（最多可选3项）</h6>
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
            <el-checkbox-group v-model="reason" :max="3">
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
          :disabled="sels.length === 0 || reason.length === 0"
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
      <div v-if="ship && ship.no">
        <h6 style="margin: 8px 0; padding: 0">快递公司: {{ ship.name }}</h6>
        <h6 style="margin: 8px 0; padding: 0">快递单号: {{ ship.no }}</h6>
        <div v-for="(l, i) in ship.list" :key="i" style="margin: 8px 0">
          <p style="margin: 0">{{ l.time }}</p>
          <p style="margin: 8px 0">{{ l.content }}</p>
        </div>
      </div>
      <div v-else class="ship_empty">
        <img src="@/assets/images/ship_empty.png" alt="empty" />
        <p>抱歉，暂未查询到物流信息</p>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title=""
      :visible.sync="commendVisible"
      width="360px"
    >
      <div class="commend">
        <el-rate
          :disabled="commend.disabled"
          v-model="commend.value"
          class="big"
          @change="onValue"
        />
        <p>{{ commend.scopes.msg }}</p>
        <el-checkbox-group
          :disabled="commend.disabled"
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
        <span v-if="!commend.disabled">合作结束15天后默认好评</span>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!commend.disabled">
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
        v-model="batchFile"
        v-if="batchVisbale"
        ref="upload"
        :url="conf.url"
        :headers="conf.headers"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="(batchVisbale = false), (batchFile = '')"
          >取消</el-button
        >
        <el-button
          :disabled="!batchFile"
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
  readPingce,
} from "@/api/activities";
import { ActivityOrderStatus, Channels, ChannelIcons } from "@/utils/constant";
import { clearQueryObject, formatDeadLine } from "@/utils/index";
import { mapGetters } from "vuex";
import _ from "underscore";
import moment from "moment";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Upload from "@/components/Upload/SingleFile";
import { exportConf, getConf } from "@/api/oss";

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
      batchFile: "",
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
            0: r[1].data.totalNum || 0,
            1: r[0].data.pending || 0,
            2: r[0].data.notPayDeposit || 0,
            3: r[0].data.toBeDelivered || 0,
            4: r[0].data.toBeReceived || 0,
            5: r[0].data.toBeEvaluated || 0,
            6: r[0].data.evaluated || 0,
            7: r[0].data.closed || 0,
            8: r[0].data.delayed || 0,
            9: r[0].data.candidate || 0,
            10: r[1].data.totalNum - (r[1].data.remainingNum || 0),
            11: r[1].data.remainingNum || 0,
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
      if (obj.searchType === "2") {
        obj.orderId = obj.searchKey;
      } else {
        obj.bloggerName = obj.searchKey;
      }
      fetchOdList(clearQueryObject(obj))
        .then((response) => {
          this.list = response.data.data.map((i) =>
            Object.assign(
              {
                brRemark: "",
                deadlineText: formatDeadLine(i.deadline),
                delayed:
                  i.statusCode === 8
                    ? formatDeadLine(new Date(), i.deadline)
                    : 0,
              },
              i,
              {
                rewardMsg: ((t) => {
                  if (t.rewardStatusCode === 1) {
                    const deadline = formatDeadLine(t.deadline);
                    console.log(t.statusCode, t.ticketStatusCode, deadline);
                    return t.statusCode === 6
                      ? t.ticketStatusCode &&
                        t.ticketStatusCode !== 6 &&
                        t.ticketStatusCode !== 5
                        ? "测评投诉中，若处理超时或违规，将取消悬赏发放"
                        : !deadline
                        ? "将自动发放"
                        : `还剩${deadline}自动发放`
                      : "提交测评后，15天自动发放";
                  } else if (t.rewardStatusCode === 3) {
                    return "测评逾期/测评违规/不符合悬赏规范/未达成合作";
                  }
                  return "";
                })(i),
              }
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
      if (act === "PASS" && !tip) {
        this.$confirm(
          "确认通过" +
            row.blogger.nickname +
            "的活动申请，并消耗账户余额" +
            row.reward +
            "元",
          {
            title: "审核通过",
            customClass: "pass_confirm",
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
    onRead(c) {
      c.read = true;
      readPingce(c.id);
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
    handleBatchShip() {
      if (!this.list || this.list.length === 0) {
        this.$message({ message: "无可用数据", type: "info" });
        return;
      }
      this.batchUrl = downloadUrl(this.listQuery.brActivityId);
      this.batchVisbale = true;
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
          this.batchFile = null;
          this.$message({ message: e.msg, type: "error" });
        });
    },
    handleShip(row) {
      this.shipVisible = true;
      this.getShip(row.receiver.logisticsNo);
    },
    handleComplain(row) {
      if (row.ticketStatusCode > 0 && row.ticketStatusCode < 5) {
        this.$router.push("/issue/index");
      } else {
        this.detail = row;
        this.formVisible = true;
      }
    },
    handleCommend(row) {
      const v = row.scoreInfo ? row.scoreInfo.score - 5 : 5;
      const ids = row.scoreInfo
        ? row.scoreInfo.scoreItemIds.split(",").map((i) => parseInt(i))
        : [];
      this.commend = {
        value: v,
        tags: ids,
        scopes: this.scopes[v - 1],
        disabled: !!row.scoreInfo,
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
          this.getList();
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
        this.getList();
      });
    },
    handleDetail(row) {
      window.showCommunicate(row.id);
    },
    handleExport() {
      window.location = exportConf("/br/activity/order/export/evaluated", {
        brActivityId: this.listQuery.brActivityId,
      });
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
          background-color: #4244ff26;
          font-size: 12px;
          color: #4244ff;
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
  div.content {
    margin-left: 8px;
    height: 50px;
    flex: 1;
    div.row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      p {
        color: #333;
        font-size: 18px;
        line-height: 25px;
        margin: 0;
        padding: 0;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        color: #ff8300;
        font-size: 12px;
        float: right;
      }
    }
    p {
      color: #333;
      font-size: 18px;
      line-height: 25px;
      margin: 0;
      padding: 0;
    }
    span.pill {
      float: none;
      font-size: 12px;
      color: #4244ff;
      line-height: 25px;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #ececff;
      margin-right: 6px;
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
  position: relative;
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  img {
    width: 24px;
    height: 24px;
  }
  span {
    margin: 0 4px;
  }
  .dot {
    position: absolute;
    right: -2px;
    top: -2px;
    width: 6px;
    height: 6px;
    background-color: #ff4949;
    border-radius: 3px;
  }
}
.ceping {
  background-color: #dcdfe6;
  border: 1px solid #f5f5f5;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
.ship_empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.apply {
  p {
    margin: 0;
    height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<style>
.pass_confirm {
  width: 280px;
}
.check_btn.is-checked .el-checkbox-button__inner {
  background-color: #4244ff;
  color: white;
}
</style>