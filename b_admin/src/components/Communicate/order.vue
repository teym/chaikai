<template>
  <div class="container">
    <div class="tab">
      <el-button
        size="mini"
        :type="active === 1 ? 'primary' : ''"
        @click="active = 1"
        >订单信息</el-button
      >
      <el-button
        size="mini"
        :type="active === 2 ? 'primary' : ''"
        @click="active = 2"
        >合作任务</el-button
      >
      <el-button
        size="mini"
        :type="active === 3 ? 'primary' : ''"
        @click="active = 3"
        >订单问题</el-button
      >
    </div>
    <div v-if="active === 1" class="content order">
      <div class="row">
        <h5>订单编号：</h5>
        <p>{{ data.id }}</p>
      </div>
      <div class="row">
        <h5>申请时间：</h5>
        <p>{{ data.date }}</p>
      </div>
      <div class="row">
        <h5>订单状态：</h5>
        <div>
          <p>{{ activityStatus[data.statusCode] }}</p>
          <span v-if="data.statusCode >= 7" style="color: #999">{{
            data.statusDesc
          }}</span>
        </div>
      </div>
      <div class="row">
        <h5>用户名称：</h5>
        <p>{{ data.blogger.nickname }}</p>
      </div>
      <div class="row">
        <h5>活动名称：</h5>
        <p>{{ data.activity.title }}</p>
      </div>
      <div class="row">
        <h5>申请规格：</h5>
        <p>{{ data.goodsSku }}</p>
      </div>
      <div class="row">
        <h5>申请理由：</h5>
        <p>{{ data.applyReason }}</p>
      </div>
      <div class="address">
        <div class="row">
          <h5 style="line-height: 28px; width: 64px">收货人：</h5>
          <div>
            <el-input v-model="data.build.address.name" size="mini" />
          </div>
        </div>
        <div class="row">
          <h5 style="line-height: 28px; width: 64px">手机号：</h5>
          <div>
            <el-input v-model="data.build.address.telephone" size="mini" />
          </div>
        </div>
        <div class="row">
          <h5 style="line-height: 28px; width: 64px">收货地址：</h5>
          <div style="flex: 1">
            <el-cascader
              v-model="data.build.addrs"
              size="mini"
              :options="addrs"
              :placeholder="
                data.build.address.province +
                '/' +
                data.build.address.city +
                '/' +
                data.build.address.county
              "
            />
            <el-input
              v-model="data.build.address.address"
              style="margin-top: 8px"
              size="mini"
            />
          </div>
        </div>
        <div class="row">
          <h5 style="line-height: 28px; width: 64px">快递信息：</h5>
          <div style="flex: 1">
            <el-input
              v-model="data.build.address.logisticsPlatform"
              size="mini"
              placeholder="快递平台"
            />
            <el-input
              v-model="data.build.address.logisticsNo"
              style="margin-top: 8px"
              size="mini"
              placeholder="快递单号"
            />
          </div>
        </div>
        <div v-if="data.statusCode > 2 && data.statusCode <= 5" class="row">
          <div style="width: 64px" />
          <el-button
            size="mini"
            type="primary"
            :loading="data.update"
            @click="updateAddr"
            >修改</el-button
          >
        </div>
      </div>
    </div>
    <div v-if="active === 2" class="content task">
      <div class="row">
        <h5>合作方式：</h5>
        <p>{{ ["", "接受悬赏", "达人报价", "免费置换"][data.coopSubType] }}</p>
      </div>
      <div class="row" v-if="data.coopSubType !== 3">
        <h5>悬赏金额：</h5>
        <p>{{ data.reward }}</p>
      </div>
      <div class="row" v-if="data.coopSubType !== 3">
        <h5>悬赏结算：</h5>
        <div style="flex: 1">
          <p>{{ ["", "待发放", "已发放", "已取消"][data.rewardStatusCode] }}</p>
          <span>{{ data.rewardMsg }}</span>
        </div>
      </div>
      <div
        class="row"
        v-if="data.coopSubType !== 3 && data.activity.cooperationType !== 4"
      >
        <h5>合作要求：</h5>
        <div>
          <div
            class="row"
            style="margin-top: 0"
            v-if="data.activity.extension.articleType > 0"
          >
            <h5>合作篇幅：</h5>
            <p>
              {{ data.activity.extension.articleType > 0 ? "单篇" : "无要求" }}
            </p>
          </div>
          <div class="row" v-if="data.activity.extension.contentType > 0">
            <h5>内容形式：</h5>
            <p>
              {{
                ["无要求", "图文", "视频"][data.activity.extension.contentType]
              }}
            </p>
          </div>
          <div class="row" v-if="data.activity.extension.minWordNum > 0">
            <h5 class="small normal light">最低字数：</h5>
            <p>
              {{
                ["无要求", "200字", "400字"][data.activity.extension.minWordNum]
              }}
            </p>
          </div>
          <div class="row" v-if="data.activity.extension.minPicNum > 0">
            <h5>最低图片数：</h5>
            <p>
              {{ ["无要求", "6张", "9张"][data.activity.extension.minPicNum] }}
            </p>
          </div>
          <div class="row" v-if="data.activity.extension.minVideoLength > 0">
            <h5>最低视频时长：</h5>
            <p>
              {{
                ["无要求", "15秒", "30秒", "1分钟", "2分钟"][
                  data.activity.extension.minVideoLength
                ]
              }}
            </p>
          </div>
          <div v-if="data.build.topics.length > 0" class="row">
            <h5>账号话题：</h5>
            <div>
              <p v-for="(c, i) in data.build.topics" :key="i" class="mb">
                {{ c.platformName }}@{{ c.nickname }}#{{ c.topic }}
              </p>
            </div>
          </div>
          <div v-if="data.activity.discountInfo" class="row">
            <h5>优惠信息：</h5>
            <p>
              {{ data.activity.discountInfo }}
            </p>
          </div>
          <div v-if="data.build.keywords.length > 0" class="row">
            <h5>附带关键词：</h5>
            <div>
              <p v-for="(k, i) in data.build.keywords" :key="i" class="mb">
                {{ k }}
              </p>
            </div>
          </div>
          <div v-if="data.build.otherReq.length > 0" class="row">
            <h5>其他要求：</h5>
            <div>
              <p v-for="(o, i) in data.build.otherReq" :key="i" class="mb">
                {{ o }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="data.build.zhengshi.length > 0" class="row ceping">
        <h5 style="line-height: 34px">正式测评：</h5>
        <div class="box">
          <div class="item" v-for="(c, i) in data.build.zhengshi" :key="i">
            <div class="pingce">
              <a target="_blank" :href="(c.channel || {}).homeLink">
                <img :src="c.icon" alt="" />
                <span>{{ c.type === 2 ? "追加" : "正式" }}</span> </a
              ><a :href="c.url" target="_blank">
                <span>互动量{{ c.activeAmount }}</span>
                <el-icon class="el-icon-arrow-right"></el-icon>
              </a>
            </div>
            <span style="margin-left: 12px">{{ c.date }}</span>
          </div>
        </div>
      </div>
      <div v-if="data.build.zhuijia.length > 0" class="row ceping">
        <h5 style="line-height: 34px">追加测评：</h5>
        <div class="box">
          <div class="item" v-for="(c, i) in data.build.zhuijia" :key="i">
            <div class="pingce">
              <a target="_blank" :href="(c.channel || {}).homeLink">
                <img :src="c.icon" alt="" />
                <span>{{ c.type === 2 ? "追加" : "正式" }}</span> </a
              ><a :href="c.url" target="_blank">
                <span>互动量{{ c.activeAmount }}</span>
                <el-icon class="el-icon-arrow-right"></el-icon>
              </a>
            </div>
            <span style="margin-left: 12px">{{ c.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="active === 3" class="content issue">
      <div v-if="data.tickets && data.tickets.length > 0">
        <div v-for="(ticket, i) in data.tickets" :key="i" class="ticket">
          <div class="row">
            <h5>工单编号：</h5>
            <p>{{ ticket.id }}</p>
          </div>
          <div class="row">
            <h5>创建时间：</h5>
            <p>
              {{ ticket.date }}
            </p>
          </div>
          <div class="row">
            <h5>工单类型：</h5>
            <p>测评投诉</p>
          </div>
          <div class="row">
            <h5>工单状态：</h5>
            <div>
              <p>
                {{
                  [
                    "",
                    "待修改",
                    "待确认",
                    "小二审核中",
                    "待重评",
                    "已修改",
                    "已取消",
                    "已违规",
                  ][ticket.statusCode]
                }}
              </p>
              <span>{{ ticket.msg }}</span>
            </div>
          </div>
          <div class="row">
            <h5>投诉理由：</h5>
            <div>
              <p v-for="(i, j) in ticket.items" :key="j" class="mb">
                {{ i.content }}
              </p>
            </div>
          </div>
          <div v-if="ticket.ticketedEvaluations.length > 0" class="row ceping">
            <h5 style="line-height: 34px">投诉测评：</h5>
            <div class="box">
              <div
                class="item"
                v-for="(c, i) in ticket.ticketedEvaluations"
                :key="i"
              >
                <div class="pingce">
                  <a target="_blank" :href="(c.channel || {}).homeLink">
                    <img :src="c.icon" alt="" />
                    <span>{{ c.type === 2 ? "追加" : "正式" }}</span> </a
                  ><a :href="c.url" target="_blank">
                    <span>互动量{{ c.activeAmount }}</span>
                    <el-icon class="el-icon-arrow-right"></el-icon>
                  </a>
                </div>
                <span style="margin-left: 12px">{{ c.date }}</span>
              </div>
            </div>
          </div>
          <div v-if="ticket.modifiedEvaluations.length > 0" class="row ceping">
            <h5 style="line-height: 34px">修改测评：</h5>
            <div class="box">
              <div
                class="item"
                v-for="(c, i) in ticket.modifiedEvaluations"
                :key="i"
              >
                <div class="pingce">
                  <a target="_blank" :href="(c.channel || {}).homeLink">
                    <img :src="c.icon" alt="" />
                    <span>{{ c.type === 2 ? "追加" : "正式" }}</span> </a
                  ><a :href="c.url" target="_blank">
                    <span>互动量{{ c.activeAmount }}</span>
                    <el-icon class="el-icon-arrow-right"></el-icon>
                  </a>
                </div>
                <span style="margin-left: 12px">{{ c.date }}</span>
              </div>
            </div>
          </div>
          <div v-if="ticket.statusCode === 2" class="row">
            <el-button
              size="mini"
              :loading="data.update"
              @click="updateState(ticket, 3)"
              >未达要求</el-button
            >
            <el-button
              size="mini"
              type="primary"
              :loading="data.update"
              @click="updateState(ticket, 5)"
              >确认修改</el-button
            >
          </div>
          <div v-if="ticket.statusCode === 1" class="row">
            <el-button
              size="mini"
              :loading="data.update"
              @click="updateState(ticket, 6)"
              >取消投诉</el-button
            >
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <img src="@/assets/images/issue_empty.png" alt="empty" />
        <p>太棒了<br />暂无订单问题</p>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOrder, addrs, updateIssueState, updateAddress } from "./api";
import { ChannelIcons, ActivityOrderStatus } from "@/utils/constant";
import { formatDeadLine } from "@/utils/index";
import _ from "underscore";

import moment from "moment";

const DefObj = {
  blogger: {},
  activity: {
    extension: {},
  },
  build: {
    topics: [],
    keywords: [],
    otherReq: [],
    zhengshi: [],
    zhuijia: [],
    address: {},
    addrs: [],
  },
  update: false,
  tickets: [],
};
export default {
  props: ["id"],
  data() {
    return {
      active: 1,
      data: DefObj,
      activityStatus: _.object(
        ActivityOrderStatus.map((i) => [i.value, i.name])
      ),
      addrs,
      logistics: ["顺丰", "圆通", "中通"],
    };
  },
  watch: {
    id(val, old) {
      if (val !== old) {
        this.loadData(val);
      }
    },
  },
  created() {
    if (this.id) {
      this.loadData(this.id);
    }
  },
  methods: {
    update(tab) {
      if (this.id) {
        this.loadData(this.id);
      }
      this.active = tab === "issue" ? 3 : 1;
    },
    onUrl(url) {
      window.open(url, "_blank");
    },
    updateState(ticket, s) {
      const id = this.id;
      this.data.update = true;
      updateIssueState({ id: ticket.id, statusCode: s })
        .then((r) => {
          if (id === this.id) {
            this.data.update = false;
            this.loadData(id);
          }
        })
        .catch((e) => {
          this.data.update = false;
        });
    },
    updateAddr() {
      const id = this.id;
      this.data.update = true;
      const addr = this.data.build.address;
      addr.province = this.data.build.addrs[0] || addr.province;
      addr.city = this.data.build.addrs[1] || addr.city;
      addr.county = this.data.build.addrs[2] || addr.county;
      updateAddress(Object.assign(addr, { brActivityOrderId: id }))
        .then((r) => {
          this.data.update = false;
          this.$message({ message: "修改成功", type: "success" });
          this.loadData(id);
        })
        .catch((e) => {
          this.data.update = false;
        });
    },
    loadData(id) {
      this.data = DefObj;
      const ticketMsg = (tt) => {
        const t = formatDeadLine(tt.deadline);
        switch (tt.statusCode) {
          case 1: //"待修改",
            return `修改测评还剩${t}，超时将由小二介入`;
          case 2: //"待确认",
            return `品牌确认修改还剩${t}，超时将自动确认`;
          case 3: //"小二审核中",
            return "请等待小二审核";
          case 4: //"待重评",
            return `修改测评还剩${t}，超时将判违规`;
          //case 5: //"已修改",
          //case 6: //"已取消",
          case 7: //"已违规",
            return "处理超时/违规";
        }
        return "";
      };
      fetchOrder(id).then(({ data }) => {
        if (id === this.id) {
          if (data.statusCode === 8) {
            data.statusDesc = `已逾期${Math.min(
              moment().diff(
                data.deadline ? moment(data.deadline) : new Date(),
                "days"
              ),
              15
            )}天`;
          }
          data.build = {};
          data.build.topics = data.channels.filter((i) => i.topic);
          data.build.keywords = data.activity.extension.keywords
            ? data.activity.extension.keywords.split(" ")
            : [];
          data.build.otherReq = data.activity.extension.otherReq
            ? data.activity.extension.otherReq.split("+").map(
                (i) =>
                  ({
                    1: "产品和达人同框露脸",
                    2: "使用前后效果对比",
                    3: "提供评测原图使用权",
                  }[i])
              )
            : [];

          const ev = (data.evaluationItems || []).map((i) =>
            Object.assign(i, ChannelIcons[i.platformId + ""], {
              date: moment(i.gmtCreate).format("YYYY-MM-DD"),
            })
          );
          data.build.zhengshi = ev.filter((i) => i.type === 1);
          data.build.zhuijia = ev.filter((i) => i.type === 2);
          data.build.address = data.receiver;
          data.build.addrs = [
            data.receiver.province,
            data.receiver.city,
            data.receiver.county,
          ];
          data.date = moment(data.gmtCreate).format("YYYY-MM-DD HH:mm:ss");
          data.tickets = (data.tickets || []).map((i) =>
            Object.assign(i, {
              modifiedEvaluations: i.modifiedEvaluations.map((i) =>
                Object.assign(
                  i,
                  { date: moment(i.gmtCreate).format("YYYY-MM-DD") },
                  ChannelIcons[i.platformId + ""]
                )
              ),
              ticketedEvaluations: i.ticketedEvaluations.map((i) =>
                Object.assign(
                  i,
                  { date: moment(i.gmtCreate).format("YYYY-MM-DD") },
                  ChannelIcons[i.platformId + ""]
                )
              ),
              date: moment(i.gmtCreate).format("YYYY-MM-DD HH:mm:ss"),
              msg: ticketMsg(i),
            })
          );
          data.ticket = (data.tickets || []).filter(
            (i) => i.statusCode <= 4
          )[0];
          data.rewardMsg = ((t) => {
            if (t.rewardStatusCode === 1) {
              const deadline = formatDeadLine(t.deadline);
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
          })(data);
          this.data = data;
          const done = data.statusCode === 7 || data.rewardStatusCode > 1;
          this.$emit("order", { id, done });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
  .tab {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .el-button {
      margin: 0 8px;
    }
  }
  .content {
    flex: 1;
    margin-top: 12px;
    overflow: hidden scroll;
    padding-bottom: 16px;
    .row {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      h5 {
        font-size: 12px;
        color: #333;
        margin: 0;
        padding: 0;
      }
      p {
        font-size: 12px;
        color: #333;
        margin: 0;
        padding: 0;
      }
      div {
        span {
          font-size: 10px;
          color: #999;
        }
      }
      .mb {
        margin-bottom: 6px;
      }
    }
    .ticket {
      border-bottom: 1px solid #f5f5f5;
    }
    .ticket:last-of-type {
      border-bottom: none;
    }
  }
  .address {
    border-top: 1px solid #e9e9e9;
  }
  .ceping {
    .box {
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        .pingce {
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #dcdfe6;
          border: 1px solid #f5f5f5;
          border-radius: 4px;
          margin: 4px 0;
          font-size: 14px;
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
        }
      }
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    p {
      text-align: center;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
