<template>
  <el-dialog
    custom-class="custom-dialog fullbody"
    title=""
    :visible.sync="showDetail"
    modal
    lock-scroll
    :close-on-click-modal="false"
    :append-to-body="true"
    width="80%"
  >
    <div slot="title">
      <el-row>
        <el-col :span="5">留言</el-col>
        <el-col :span="12">{{ (list[active] || {}).name }}</el-col>
        <el-col :span="7" />
      </el-row>
    </div>
    <el-row class="layout">
      <el-col v-if="showList" :span="5" class="list">
        <div
          v-for="(i, j) in list"
          :key="j"
          class="item"
          :class="{ active: i.originId === active }"
          @click="onActive(i)"
        >
          <img :src="(i.accountInfo || {}).avatar" alt="avatar" />
          <div class="col">
            <div class="row t">
              <h5>{{ (i.accountInfo || {}).name }}</h5>
              <span>{{ i.date }}</span>
            </div>
            <div class="row b">
              <p>{{ i.content }}</p>
              <span v-if="i.brUnreadNum > 0">{{ i.brUnreadNum }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="content" :span="showList ? 12 : 16">
        <a
          class="tip"
          href="https://www.yuque.com/lftshh/ki3koh/ocpz0z"
          target="_blank"
        >
          <img src="@/assets/images/chat_tip.png" alt="tip" />
          <p>提示：警惕站外沟通交易，平台提供合作保障</p>
          <el-icon class="el-icon-arrow-right" />
        </a>
        <div class="box" ref="box">
          <div
            v-for="(item, i) in data.datas"
            :key="i"
            class="chat"
            :class="{ mine: item.my }"
          >
            <img
              class="logo"
              :src="(item.accountInfo || {}).avatar"
              alt="logo"
            />
            <div class="col">
              <span>{{ (item.accountInfo || {}).name }}</span>
              <div>
                <img
                  v-if="item.isImg"
                  :src="item.content"
                  alt="img"
                  @click="onPreview(item.content)"
                />
                <p v-else>{{ item.content }}</p>
                <span>{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bar">
          <textarea
            v-model="text"
            class="input"
            @keypress.enter="onSend"
            :placeholder="
              orderDone ? '合作已结束，无法发送消息' : '支持发送图文消息'
            "
          />
          <div class="row">
            <label for="file" class="file" @click="clickFile">
              <input
                ref="fileinput"
                class="file-input"
                name="file"
                type="file"
                accept="image/png, image/jpeg"
                hidden
                @change="onFile"
              />
              <el-icon class="el-icon-plus" />
              <span>图片支持 jpg png jpeg 大小不超过1M</span>
            </label>

            <el-button
              :loading="data.sending"
              type="primary"
              size="mini"
              @click="onSend"
              >发送</el-button
            >
          </div>
        </div>
      </el-col>
      <el-col :span="showList ? 7 : 8" class="detail">
        <order ref="order" :id="active" @order="onOrder" />
      </el-col>
    </el-row>
    <el-dialog width="60%" title="预览" :visible.sync="preview" append-to-body>
      <img style="width: 100%" :src="previewUrl" alt="" srcset="" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  fetchList,
  // fetchStat
  fetchHistory,
  //   createData,
  createHistory,
  uploadFile,
  //   updateData
} from "./api";
import order from "./order";
import moment from "moment";

const formatDate = (t) => {
  const m = moment(t);
  return m.isSame(new Date(), "day")
    ? m.format("HH:mm")
    : m.format("MM.DD HH:mm");
};

function isImgMsg(s) {
  return /^\[img:https?:\/\/[a-zA-Z0-9-_./]+\]$/.test(s);
}
function imgMsgUrl(s) {
  return /^\[img:(https?:\/\/[a-zA-Z0-9-_./]+)\]$/.exec(s)[1];
}
function makeImgMsg(u) {
  return `[img:${u}]`;
}

export default {
  components: {
    order,
  },
  data() {
    return {
      list: [],
      showList: true,
      active: null,
      stat: 0,
      page: 0,
      nomore: false,
      loading: false,
      showDetail: false,
      data: {
        datas: [],
        page: 0,
        nomore: false,
        loading: false,
        sending: false,
      },
      text: "",
      preview: false,
      previewUrl: "",
      orderDone: false,
    };
  },
  created() {
    this.loadList(1);
    window.showCommunicate = (id, issue) => {
      this.active = id;
      this.showList = false;
      this.showDetail = true;
      setTimeout(() => {
        this.$refs.order.update(issue ? "issue" : "order");
      }, 0);
      this.loadList(1);
    };
  },
  methods: {
    show() {
      this.showList = true;
      this.showDetail = true;
      setTimeout(() => {
        this.$refs.order.update("order");
      }, 0);
      this.loadList(1);
    },
    onPreview(img) {
      this.previewUrl = img;
      this.preview = true;
    },
    onSend() {
      if (this.orderDone) {
        return;
      }
      this.realSend(Promise.resolve(this.text), () => {
        this.text = "";
      });
    },
    clickFile() {
      if (this.orderDone) {
        return;
      }
      this.$refs.fileinput.click();
    },
    onFile(e) {
      this.realSend(uploadFile(e.target.files[0]).then((u) => makeImgMsg(u)));
    },
    realSend(txt, done) {
      this.data.sending = true;
      const act = this.active;
      const room = this.list.filter((i) => i.originId === act)[0] || {
        originId: act,
      };
      txt
        .then((r) => {
          return createHistory({
            content: r,
            originId: room.originId,
            roomId: room.id,
            type: 1,
            roomType: 1,
          });
        })
        .then(({ data }) => {
          if (act !== this.active) {
            return;
          }
          this.data.datas.splice(
            this.data.datas.length,
            0,
            Object.assign(data, {
              my: true,
              date: formatDate(data.lastTime),
              isImg: isImgMsg(data.content),
              content: isImgMsg(data.content)
                ? imgMsgUrl(data.content)
                : data.content,
            })
          );
          this.data.sending = false;
          setTimeout(() => {
            this.$refs.box &&
              this.$refs.box.scrollTo(0, this.$refs.box.scrollHeight);
          }, 0);
          if (done) {
            done();
          }
        })
        .catch((e) => {
          if (act !== this.active) {
            return;
          }
          console.log(e);
          this.data.sending = false;
        });
    },
    onActive(item) {
      this.active = item.originId;
      this.data = {
        datas: [],
        page: 0,
        nomore: false,
        loading: false,
        sending: false,
      };
      this.text = "";
      this.orderDone = false;
      this.loadData(1);
    },
    onCount() {
      const count = this.list
        .map((i) => i.brUnreadNum || 0)
        .reduce((a, b) => a + b, 0);
      this.$emit("count", { count, list: this.list.length });
    },
    onOrder(done) {
      this.orderDone = done;
    },
    loadList(page) {
      this.loading = true;
      fetchList({ page: page, size: 10, roomType: 1, type: 1 })
        .then((r) => {
          this.list = (page === 1 ? [] : this.list)
            .concat(r.data.data || [])
            .map((i) =>
              Object.assign(i, {
                content: isImgMsg(i.lastRecord.content)
                  ? "[图片]"
                  : i.lastRecord.content,
                date: formatDate(i.lastTime),
              })
            );
          this.nomore = r.data.pager.totalPages <= page;
          this.loading = false;
          if (!this.active) {
            this.active = this.list[0].originId;
          }
          this.loadData(1);
          this.onCount();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    loadData(page) {
      const act = this.active;
      if (page === 1) {
        this.data = {
          datas: [],
          page: page,
          nomore: false,
          loading: false,
        };
      }
      if (this.data.loading || this.data.nomore) {
        return;
      }
      this.data.loading = true;
      fetchHistory({ page, size: 10, originId: act, type: 1, roomType: 1 })
        .then(({ data }) => {
          if (act === this.active) {
            this.data.datas = data.data
              .reverse()
              .concat(page === 1 ? [] : this.data.datas)
              .map((i) =>
                Object.assign(i, {
                  date: moment(i.gmtCreate).format("YYYY-MM-DD HH:mm:ss"),
                  isImg: isImgMsg(i.content),
                  content: isImgMsg(i.content)
                    ? imgMsgUrl(i.content)
                    : i.content,
                })
              );
            this.data.nomore = data.pager.totalPages <= page;
            this.data.page = page;
            this.data.loading = false;
            if (this.showDetail) {
              const t = this.list.find((i) => i.originId === act);
              if (t) {
                t.brUnreadNum = 0;
              }
              this.onCount();
            }

            setTimeout(() => {
              this.$refs.box &&
                this.$refs.box.scrollTo(0, this.$refs.box.scrollHeight);
            }, 0);
          }
        })
        .catch((e) => {
          if (act === this.active) {
            this.data.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  border-top: 1px solid #e9e9e9;

  .list {
    border-right: 1px solid #e9e9e9;
    overflow: hidden scroll;
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #e9e9e9;
      padding: 8px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
      .col {
        margin-left: 8px;
        flex: 1;
        overflow: hidden;
      }
      .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1;
      }
      .t {
        h5 {
          margin: 0;
          padding: 0;
          font-size: 18px;
          color: #333333;
          font-weight: 500;
        }
        span {
          font-size: 14px;
          color: #737373;
        }
      }
      .b {
        margin-top: 8px;
        p {
          margin: 0;
          padding: 0;
          font-size: 14px;
          line-height: 18px;
          height: 18px;
          white-space: nowrap;
          color: #737373;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          background-color: #ff4848;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          padding: 2px 4px;
          color: white;
        }
      }
    }
  }
  .el-col {
    height: calc(100vh * 0.7);
  }
  .content {
    border-right: 1px solid #e9e9e9;
    display: flex;
    flex-direction: column;
    .tip {
      width: 100%;
      background-color: #ffe3e3;
      padding: 0 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      img {
        width: 16px;
        height: 16px;
      }
      p {
        margin: 8px 4px;
        flex: 1;
      }
    }
    .box {
      flex: 1;
      overflow: hidden scroll;
      padding-bottom: 12px;
      .chat {
        display: flex;
        flex-direction: row;
        margin: 12px 64px 0 12px;
        .logo {
          width: 52px;
          height: 52px;
          border-radius: 26px;
        }
        span {
          font-size: 12px;
          color: #7b7f8e;
          font-weight: 400;
        }
        .col {
          padding: 0 0 0 12px;
          div {
            margin: 8px 0 0 0;
            background-color: #f7f7f7;
            padding: 8px;
            border-radius: 0 10px 10px 10px;
            p {
              margin: 0;
              padding: 0;
              font-size: 14px;
              color: #333333;
              font-weight: 400;
            }
            img {
              width: 50px;
              height: 50px;
            }
          }
          span {
            color: #666666;
            font-weight: normal;
            margin-top: 8px;
            display: block;
          }
        }
      }
      .chat.mine {
        flex-direction: row-reverse;
        margin: 12px 12px 0 64px;
        text-align: right;
        .col {
          padding: 0 12px 0 0;
          div {
            border-radius: 10px 0 10px 10px;
          }
        }
      }
    }
    .bar {
      height: 130px;
      border-top: 1px solid #e9e9e9;
      padding: 12px;
      display: flex;
      flex-direction: column;
      .input {
        font-size: 14px;
        color: #333;
        line-height: 20px;
        flex: 1;
        border: none;
        outline-style: none;
      }
      .input:focus {
        border: 0;
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        .file {
          display: flex;
          flex-direction: row;
          align-items: center;
          .el-icon-plus {
            width: 30px;
            height: 30px;
            text-align: center;
            vertical-align: middle;
            font-size: 16px;
            line-height: 30px;
            border: 1px dashed #999999;
            margin-right: 8px;
          }
          span {
            flex: 1;
            font-size: 12px;
            color: #999999;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
