<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm">
      <div class="createPost-main-container">
        <div class="form-container">
          <h3>基本信息</h3>
          <el-form-item
            prop="goods"
            style="margin-bottom: 30px"
            label-width="110px"
            label="活动商品:"
          >
            <!-- <el-button
              v-if="!postForm.goods"
              icon="el-icon-plus"
              @click="handleSelectGoods"
              >选择商品</el-button
            > -->
            <div v-if="postForm.goods" class="goods_p">
              <div class="box">
                <img :src="postForm.goods.picUrl" alt="pic">
                <div class="info">
                  <p>{{ postForm.goods.title }}</p>
                  <div class="line">
                    <span>价值：{{ postForm.goods.price }}</span>
                    <!-- <el-button size="mini" @click="handleSelectGoods"
                      >重新选择</el-button
                    > -->
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            prop="skus"
            style="margin-bottom: 30px"
            label-width="110px"
            label="商品规格:"
          >
            <el-select
              v-model="postForm.skus"
              :disabled="postForm.statusCode !== 2"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in (postForm.goods || {}).skuUnionList || []"
                :key="item.skuIdUnion"
                :label="item.name"
                :value="item.skuIdUnion"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="title"
            style="margin-bottom: 30px"
            label-width="110px"
            label="活动名称:"
          >
            <el-input
              v-model="postForm.title"
              placeholder="请输入品牌名+空格+商品名称"
              :maxlength="30"
            />
          </el-form-item>
          <el-form-item
            prop="regTime"
            style="margin-bottom: 30px"
            label-width="110px"
            label="报名时间:"
          >
            <el-date-picker
              v-model="postForm.regTime"
              :disabled="postForm.statusCode !== 2"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item
            prop="totalNum"
            style="margin-bottom: 30px"
            label-width="110px"
            label="活动名额:"
          >
            <el-input-number
              v-model="postForm.totalNum"
              disabled
              placeholder="活动名额"
            />
          </el-form-item>
          <el-form-item
            style="margin-bottom: 30px"
            label-width="110px"
            label="测评指引:"
          >
            <div v-for="(line, i) in postForm.guidelines" :key="i">
              <el-input
                v-model="line.txt"
                placeholder="请输入测评指引"
                :maxlength="20"
                style="margin-bottom: 8px"
                show-word-limit
              />
              <span class="guide-del" @click="onGuideDel(i)">删除</span>
            </div>
            <el-button
              v-if="postForm.guidelines.length < 5"
              icon="el-icon-plus"
              @click="handleAddGuide"
            >添加指引</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="createPost-main-container">
        <div class="form-container">
          <h3>活动设置</h3>
          <el-form-item
            prop="displayType"
            style="margin-bottom: 30px"
            label-width="110px"
            label="私密活动"
          >
            <el-switch
              v-model="postForm.displayType"
              :disabled="postForm.statusCode !== 2"
              active-color="#13ce66"
              inactive-color="#D3D3D3"
            />
          </el-form-item>
          <el-form-item
            prop="recvArea"
            style="margin-bottom: 30px"
            label-width="110px"
            label="收货地限制"
          >
            <el-switch
              v-model="postForm.extension.receiveAreaLimit"
              :disabled="postForm.statusCode !== 2"
              active-color="#13ce66"
              inactive-color="#D3D3D3"
            />
            <div v-if="postForm.extension.receiveAreaLimit">
              <el-radio-group
                v-model="postForm.recvAreaType"
                :disabled="postForm.statusCode !== 2"
              >
                <el-radio :label="1">不可收货地区</el-radio>
                <el-radio :label="2">可收货地区</el-radio>
              </el-radio-group>
              <div class="area">
                <h5>
                  已选地区
                  <el-button
                    :disabled="postForm.statusCode !== 2"
                    type="text"
                    @click="addressFormVisible = true"
                  >选择</el-button>
                </h5>
                <span
                  v-for="(i, j) in postForm.extension.receiveAreas"
                  :key="j"
                >{{ i.province + (i.city || "") }}</span>
                <span
                  v-if="postForm.extension.receiveAreas.length === 0"
                >未选择地区</span>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="createPost-main-container">
        <div class="form-container">
          <h3>合作任务</h3>
          <el-form-item
            prop="channels"
            style="margin-bottom: 30px"
            label-width="110px"
            label="报名渠道:"
          >
            <el-checkbox-group
              v-model="postForm.channels"
              disabled
              @change="onChannels"
            >
              <el-checkbox :label="0">不限</el-checkbox>
              <el-checkbox
                v-for="i in channelList"
                :key="i.id"
                :label="i.id"
              ><span>
                <img
                  style="width: 22px; height: 22px; vertical-align: middle"
                  :src="i.icon"
                  alt="icon"
                >
                {{ i.name }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 30px"
            label-width="110px"
            label="合作方式:"
          >
            <el-radio-group
              v-model="postForm.cooperationType"
              disabled
              @change="onCooperation"
            >
              <el-radio-button :label="1">接受悬赏</el-radio-button>
              <el-radio-button :label="2">接受悬赏/达人报价</el-radio-button>
              <el-radio-button :label="4">免费置换/达人报价</el-radio-button>
              <el-radio-button :label="3">免费置换</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div v-if="postForm.cooperationType < 3">
            <el-form-item
              prop
              style="margin-bottom: 30px"
              label-width="170px"
              label="合作要求 内容篇幅:"
            >
              <el-radio-group
                v-model="postForm.extension.articleType"
                disabled
                @change="handleTypeChange"
              >
                <el-radio-button :label="0">无要求</el-radio-button>
                <el-radio-button :label="1">单篇</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              prop="articleType"
              style="margin-bottom: 30px"
              label-width="170px"
              label="内容形式:"
            >
              <el-radio-group
                v-model="postForm.extension.contentType"
                disabled
                @change="handleContentType"
              >
                <el-radio-button :label="0">无要求</el-radio-button>
                <el-radio-button
                  :label="1"
                  :disabled="postForm.channels.filter((i) => i > 4).length > 0"
                >图文</el-radio-button>
                <el-radio-button :label="2">视频</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="postForm.extension.contentType === 2"
              prop="minVideoLength"
              style="margin-bottom: 30px"
              label-width="170px"
              label="视频时长:"
            >
              <el-radio-group
                v-model="postForm.extension.minVideoLength"
                disabled
              >
                <el-radio-button :label="0">无要求</el-radio-button>
                <el-radio-button :label="1">15秒</el-radio-button>
                <el-radio-button :label="2">30秒</el-radio-button>
                <el-radio-button :label="3">1分钟</el-radio-button>
                <el-radio-button :label="4">2分钟</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="postForm.extension.contentType === 1"
              prop="minWordNum"
              style="margin-bottom: 30px"
              label-width="170px"
              label="最低字数:"
            >
              <el-radio-group v-model="postForm.extension.minWordNum" disabled>
                <el-radio-button :label="0">无要求</el-radio-button>
                <el-radio-button :label="1">200</el-radio-button>
                <el-radio-button :label="2">400</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="postForm.extension.contentType === 1"
              prop="minPicNum"
              style="margin-bottom: 30px"
              label-width="170px"
              label="最低图片数:"
            >
              <el-radio-group v-model="postForm.extension.minPicNum" disabled>
                <el-radio-button :label="0">无要求</el-radio-button>
                <el-radio-button :label="1">6张</el-radio-button>
                <el-radio-button :label="2">9张</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              style="margin-bottom: 30px"
              label-width="170px"
              label="账号话题:"
            >
              <div class="topic_p">
                <div v-for="(t, i) in postForm.topics" :key="i" class="item">
                  <img :src="t.icon" alt="icon">
                  <div>
                    <span>账号：@{{ t.nickname }}</span>
                    <span>话题：#{{ t.topic }}</span>
                  </div>
                  <el-button
                    size="mini"
                    @click="onShowTopicForm"
                  >修改</el-button>
                </div>
              </div>
              <el-button
                v-if="postForm.topics.length <= 0"
                @click="onShowTopicForm"
              >添加话题</el-button>
            </el-form-item>
            <el-form-item
              prop="discountInfo"
              style="margin-bottom: 30px"
              label-width="170px"
            >
              <span slot="label" for="discountInfo">
                优惠信息
                <el-tooltip
                  effect="dark"
                  placement="bottom"
                  content="达人可在正文或评论中添加优惠信息，小红书暂不支持携带优惠信息"
                >
                  <el-icon class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-input
                v-model="postForm.extension.discountInfo"
                placeholder="请填写需要露出的优惠信息"
                :maxlength="150"
              />
            </el-form-item>
            <el-form-item
              prop="keywords"
              style="margin-bottom: 30px"
              label-width="170px"
              label="附加关键词:"
            >
              <span slot="label" for="keywords">
                附加关键词
                <el-tooltip
                  effect="dark"
                  placement="bottom"
                  content="达人需在测评正文中添加关键词"
                >
                  <el-icon class="el-icon-question" />
                </el-tooltip>
              </span>
              <div>
                <el-input
                  v-for="(k, i) in postForm.keywords"
                  :key="i"
                  v-model="k.txt"
                  style="width: 30%; margin-right: 8px"
                  :maxlength="5"
                  show-word-limit
                >
                  <div slot="suffix" class="input_remove">
                    <div class="box" @click="handleRemoveKeyword(i)">
                      <el-icon class="el-icon-circle-close" />
                    </div>
                  </div>
                </el-input>
                <el-button
                  v-if="postForm.keywords.length < 3"
                  @click="handleAddKeywords"
                >
                  添加
                </el-button>
              </div>
            </el-form-item>
            <el-form-item
              prop="bloggerPublishTime"
              style="margin-bottom: 30px"
              label-width="170px"
              label="发布时间"
            >
              <el-date-picker
                v-model="postForm.extension.bloggerPublishTime"
                disabled
                type="date"
                placeholder="指定达人发布测评时间"
              />
            </el-form-item>
            <el-form-item
              prop="otherReq"
              style="margin-bottom: 30px"
              label-width="170px"
              label="其它要求"
            >
              <el-checkbox-group v-model="postForm.extension.otherReq" disabled>
                <el-checkbox :label="1">产品和达人同框露脸</el-checkbox><br>
                <el-checkbox :label="2">使用前后效果对比</el-checkbox><br>
                <el-checkbox :label="3">提供评测原图使用权</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              prop="reward"
              style="margin-bottom: 30px"
              label-width="170px"
              label="悬赏金额"
            >
              <el-input v-model="postForm.reward" disabled />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <!-- <el-dialog
      custom-class="custom-dialog"
      title="选择活动商品"
      :visible.sync="goodsFormVisible"
    >
      <div slot="title">
        <el-form :inline="true" class="goods-title">
          <el-form-item label="选择活动商品">
            <el-input
              v-model="goods.key"
              placeholder="请输入商品名称"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="goods-form">
        <el-row :gutter="20" justify="center" :loading="goods.loading">
          <el-col v-for="(g, i) in goods.list" :key="i" :span="4">
            <div class="info" @click="handleGoods(g)">
              <div class="img">
                <img :src="g.picUrl" alt="pic" />
              </div>
              <div class="txt">
                <span>{{ g.title }}</span>
              </div>
              <div class="mask" v-if="g.activityAlive">活动进行中</div>
            </div>
          </el-col>
        </el-row>
        <pagination
          layout="total, prev, pager, next"
          :pageSizes="[12]"
          :total="goods.total"
          :page="goods.page"
          :limit="12"
          @pagination="handleGoodsPage"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goodsFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog> -->
    <el-dialog
      custom-class="custom-dialog"
      title="选择区域"
      :visible.sync="addressFormVisible"
      append-to-body
    >
      <div class="address-form">
        <p>
          <span
            v-for="(a, n) in postForm.extension.receiveAreas"
            :key="n"
            class="pill"
          >{{ a.province + (a.city || "") }}</span>
        </p>
        <h5>省份选择</h5>
        <a-address
          v-model="postForm.extension.receiveAreas"
          :type="postForm.recvAreaType"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="addressFormVisible = false"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title="账号话题"
      :visible.sync="topicFormVisible"
      width="820px"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item v-for="i in topics" :key="i.id" :label="i.platformName">
          <div slot="label" class="topic_label">
            <el-checkbox v-model="i.checked" :disabled="i.id === 2" />
            <img :src="i.icon" :alt="i.platformName">
          </div>
          <el-input
            v-if="i.id !== 2"
            v-model="i.nickname"
            placeholder="请输入账号昵称"
            style="width: 50%; padding-right: 8px"
          >
            <div slot="prepend">账号@</div>
          </el-input>
          <el-input
            v-if="i.id !== 2"
            v-model="i.topic"
            placeholder="请输入话题名称"
            style="width: 50%; padding-left: 8px"
          ><div slot="prepend">话题#</div></el-input>
          <p v-else style="margin: 0; width: 50%">暂不支持</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="topicFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTopic">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      custom-class="custom-dialog"
      title="合作要求价格表"
      :visible.sync="priceVisable"
      width="820px"
    >
      <el-table :data="priceTable" border fit style="width: 100%">
        <el-table-column label="合作要求" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="悬赏最低价累加">
          <template slot-scope="{ row }">
            <div class="split">
              <div>
                <pre>{{ row.data[0] }}</pre>
              </div>
              <div v-if="row.data.length > 1">
                <pre>{{ row.data[1] }}</pre>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="说明">
          <template slot-scope="{ row }">
            <span>{{ row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->
  </div>
</template>

<script>
// import { validURL } from '@/utils/validate'
import { fetchActivity, updateActivity, fetchGoods } from '@/api/check'
// import _ from 'underscore'
import { Channels, ChannelIcons } from '@/utils/constant'
// import { clearQueryObject } from '@/utils/index'
import address from './address'
import moment from 'moment'

export function mapChannel(channels) {
  return channels.map((i) =>
    Object.assign({}, i, ChannelIcons[i.platformId + ''])
  )
}

const defaultForm = () => ({
  goods: null,
  skus: [],
  regTime: [],
  title: '',
  totalNum: 5,
  guidelines: [{ txt: '' }],
  displayType: false,
  recvAreaType: 1,
  cooperationType: 1,
  channels: Channels.filter((i) => i.id <= 4).map((i) => i.id),
  topics: [],
  keywords: [],
  extension: {
    channels: [],
    receiveAreaLimit: false,
    receiveAreas: [],
    articleType: 1,
    contentType: 1,
    minWordNum: 0,
    minPicNum: 0,
    minVideoLength: 0,
    discountInfo: '',
    keywords: '',
    bloggerPublishTime: undefined,
    otherReq: [],
    awardAmount: ''
  },
  statusCode: 1
})

export default {
  name: 'ArticleDetail',
  components: {
    'a-address': address
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    // const validateRequire = (rule, value, callback) => {
    //   if (!value) {
    //     if (this.tip <= 0) {
    //       this.tip += 1;
    //       this.$message({
    //         message: rule.name + "为必填项",
    //         type: "error",
    //         onClose: () => {
    //           this.tip -= 1;
    //         },
    //       });
    //     }
    //     callback(new Error(rule.name + "为必填项"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validateNumberRequire = (rule, value, callback) => {
    //   if (parseFloat(value) < 0) {
    //     if (this.tip <= 0) {
    //       this.tip += 1;
    //       this.$message({
    //         message: rule.name + "需大于0",
    //         type: "error",
    //         onClose: () => {
    //           this.tip -= 1;
    //         },
    //       });
    //     }
    //     callback(new Error(rule.name + "需大于0"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validateArrayRequire = (rule, value, callback) => {
    //   if (!((value || {}).length || 0) > 0) {
    //     if (this.tip <= 0) {
    //       this.tip += 1;
    //       this.$message({
    //         message: rule.name + "为必填项",
    //         type: "error",
    //         onClose: () => {
    //           this.tip -= 1;
    //         },
    //       });
    //     }
    //     callback(new Error(rule.name + "为必填项"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validateAmount = (rule, value, callback) => {
    //   const v = parseInt(value);
    //   if (v >= 0 && v >= this.minAmount) {
    //     if (this.postForm.cooperationType !== 3 && v === 0) {
    //       if (this.tip <= 0) {
    //         this.tip += 1;
    //         this.$message({
    //           message: "请至少设置一项合作要求",
    //           type: "error",
    //           onClose: () => {
    //             this.tip -= 1;
    //           },
    //         });
    //       }
    //       callback(new Error("请至少设置一项合作要求"));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     if (this.tip <= 0) {
    //       this.tip += 1;
    //       this.$message({
    //         message: "请输入正确的推广悬赏金额",
    //         type: "error",
    //         onClose: () => {
    //           this.tip -= 1;
    //         },
    //       });
    //     }
    //     callback(new Error("请输入正确的推广悬赏金额"));
    //   }
    // };
    return {
      tip: 0,
      postForm: defaultForm(),
      loading: false,
      brandListOptions: [],
      // rules: {
      //   goods: [
      //     {
      //       required: true,
      //       validator: validateRequire,
      //       trigger: "blur",
      //       name: "活动商品",
      //     },
      //   ],
      //   skus: [
      //     {
      //       required: true,
      //       validator: validateArrayRequire,
      //       trigger: "blur",
      //       name: "商品规格",
      //     },
      //   ],
      //   title: [
      //     {
      //       required: true,
      //       validator: validateRequire,
      //       trigger: "blur",
      //       name: "活动名称",
      //     },
      //   ],
      //   totalNum: [
      //     {
      //       required: true,
      //       validator: validateNumberRequire,
      //       trigger: "blur",
      //       name: "活动名额",
      //     },
      //   ],
      //   reward: [
      //     {
      //       required: true,
      //       validator: validateAmount,
      //       required: true,
      //       trigger: "blur",
      //     },
      //   ],
      //   regTime: [
      //     {
      //       required: true,
      //       validator: validateArrayRequire,
      //       trigger: "blur",
      //       name: "报名时间",
      //     },
      //   ],
      //   channels: [
      //     {
      //       validator: validateArrayRequire,
      //       trigger: "blur",
      //       name: "推广渠道",
      //     },
      //   ],
      // },
      channelList: mapChannel(Channels),
      topics: [],
      addressFormVisible: false,
      topicFormVisible: false,
      s: 0
    }
  },
  mounted() {
    this.loadData(this.id)
  },
  methods: {
    // loadDetail(id) {
    //   fetchActivity(id).then((r) => {
    //     r.data.date = [r.data.regStartTime, r.data.regEndTime];
    //     r.data.guideList = r.data.guidelines.map((i) => ({ txt: i }));
    //     r.data.displayType = r.data.displayType === 1;
    //     r.data.otherReq = r.data.otherReq
    //       ? r.data.otherReq.split("+").map(
    //           (i) =>
    //             ({
    //               1: "产品和达人同框露脸",
    //               2: "使用前后效果对比",
    //               3: "提供评测原图使用权",
    //             }[i])
    //         )
    //       : "";
    //     this.detail = r.data;
    //   });
    // },
    // onSave() {
    //   const obj = Object.assign({}, this.detail);
    //   obj.guidelines = obj.guideList.map((i) => i.txt);
    //   obj.regStartTime = moment(obj.date[0]).format("YYYY-MM-DD 00:00:00");
    //   obj.regEndTime = moment(obj.date[1]).format("YYYY-MM-DD 00:00:00");
    //   updateActivity(obj).then((r) => {
    //     this.$message({ message: "修改成功", type: "success" });
    //     this.detailVisible = false;
    //     this.getList();
    //   });
    // },
    loadData(id) {
      fetchActivity(id)
        .then((response) => {
          return fetchGoods({
            page: 1,
            size: 1,
            brGoodsId: response.data.goods.brGoodsId
          }).then((r) => {
            response.data.skus = response.data.goods.skuUnionList.map(
              (i) => i.skuIdUnion
            )
            response.data.goods = r.data.data[0]
            return response.data
          })
        })
        .then((r) => {
          const obj = Object.assign({}, defaultForm(), r)

          obj.displayType = obj.displayType === 1
          obj.regTime = [r.regStartTime, r.regEndTime]
          if (!r.extension.channelLimit) {
            obj.channels = Channels.map((i) => i.id)
          } else {
            obj.channels = r.extension.channels.map((i) => i.platformId)
          }
          if (r.extension.receiveAreaLimit) {
            obj.recvAreaType = r.extension.receiveAreas[0].type || 1
            obj.extension.receiveAreas = r.extension.receiveAreas
          } else {
            obj.extension.receiveAreas = []
          }
          obj.topics = []
            .concat(mapChannel(r.extension.channels || []))
            .filter((i) => i.nickname && i.topic)
          obj.extension.otherReq = (r.extension.otherReq || '')
            .split('+')
            .map((i) => parseInt(i))
            .filter((i) => i > 0 && i <= 3)
          obj.guidelines = r.guidelines.map((i) => ({ txt: i }))
          obj.keywords = obj.extension.keywords
            ? obj.extension.keywords.split(' ').map((txt) => ({ txt }))
            : []
          this.postForm = obj
          console.log('detail', obj.statusCode)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // fetchPv(page) {
    //   this.goods.loading = true;
    //   fetchPv(clearQueryObject({ page, size: 12, key: this.goods.key })).then(
    //     (r) => {
    //       this.goods = {
    //         page,
    //         total: r.data.pager.count,
    //         list: r.data.data,
    //         key: this.goods.key,
    //         loading: false,
    //       };
    //     }
    //   );
    // },
    onGuideDel(index) {
      this.postForm.guidelines.splice(index, 1)
    },
    handleAddGuide() {
      this.postForm.guidelines.splice(this.postForm.guidelines.length, 0, {
        txt: ''
      })
    },
    handleSelectGoods() {
      this.goodsFormVisible = true
      if (this.goods.page === 0) {
        this.fetchPv(1)
      }
    },
    // handleGoods(goods) {
    //   if (!goods.activityAlive) {
    //     this.postForm.goods = goods;
    //     this.goodsFormVisible = false;
    //   }
    // },
    // handleFilter() {
    //   this.fetchPv(1);
    // },
    // handleGoodsPage(p) {
    //   this.fetchPv(p.page);
    // },
    handleContentType(e) {
      if (e === 1) {
        this.postForm.channels = this.postForm.channels.filter((i) => i <= 4)
      }
    },
    handleTypeChange(e) {
      if (e === 0 && this.postForm.extension.minPicNum === 2) {
        this.postForm.extension.minPicNum = 0
      }
    },
    handleAddKeywords() {
      this.postForm.keywords.splice(this.postForm.keywords.length, 0, {
        txt: ''
      })
    },
    handleRemoveKeyword(i) {
      this.postForm.keywords.splice(i, 1)
    },
    // onCancel() {
    //   this.$router.back();
    // },
    onChannels(e) {
      const last = [].concat(e).pop()
      if (last === 0) {
        if (this.postForm.extension.contentType === 1) {
          e.splice(
            0,
            e.length,
            ...Channels.filter((i) => i.id <= 4).map((i) => i.id)
          )
        } else {
          e.splice(0, e.length, 0, ...Channels.map((i) => i.id))
        }
      } else {
        if (e.filter((i) => i !== 0).length >= Channels.length) {
          e.splice(0, e.length, 0, ...Channels.map((i) => i.id))
        } else {
          e.splice(0, e.length, ...e.filter((i) => i !== 0))
        }
      }
    },
    onCooperation(e) {
      if (e === 3) {
        this.postForm.extension.contentType = 0
        this.onChannels(
          this.postForm.channels.splice(
            0,
            this.postForm.channels.length,
            0,
            ...Channels.map((i) => i.id)
          )
        )
      }
    },
    onShowTopicForm() {
      this.topics = mapChannel(Channels)
        .filter((i) => this.postForm.channels.indexOf(i.id) >= 0)
        .map((i) => {
          const obj = this.postForm.topics.find(
            (j) =>
              parseInt(j.platformId || j.id) === parseInt(i.platformId || i.id)
          )
          return Object.assign(
            { nickname: '', topic: '', platformName: i.name },
            i,
            obj || {},
            { checked: !!obj }
          )
        })
      this.topicFormVisible = true
    },
    handleAddTopic() {
      this.postForm.topics = this.topics.filter(
        (i) => i.checked && i.nickname && i.topic
      )
      this.topicFormVisible = false
    },
    submitForm(submit) {
      // this.$refs.postForm.validate((valid) => {
      //   if (valid) {
      var obj = Object.assign({}, this.postForm)
      if (obj.cooperationType === 3) {
        obj.extension = Object.assign({}, obj.extension, {
          articleType: 0,
          contentType: 0,
          minWordNum: 0,
          minPicNum: 0,
          minVideoLength: 0,
          discountInfo: '',
          keywords: '',
          bloggerPublishTime: undefined,
          otherReq: []
        })
        obj.reward = '0'
      }
      obj = Object.assign(
        {},
        obj,
        {
          guidelines: obj.guidelines.map((i) => i.txt),
          displayType: obj.displayType ? 1 : 0,
          regStartTime: moment(obj.regTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          regEndTime: moment(obj.regTime[1]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          goods: Object.assign({}, obj.goods, {
            skuUnionList: obj.goods.skuUnionList.filter(
              (i) => obj.skus.indexOf(i.skuIdUnion) >= 0
            )
          })
        },
        {
          extension: Object.assign({}, obj.extension, {
            receiveAreaLimit: obj.extension.receiveAreas.length > 0,
            receiveAreas: obj.extension.receiveAreas.map((i) =>
              Object.assign({}, i, { type: obj.recvAreaType })
            ),
            channels: obj.channels.map((id) => {
              const topic = obj.topics.find((i) => i.id === id)
              return Object.assign({}, topic || {}, { platformId: id })
            }),
            channelLimit: obj.channels.indexOf('0') < 0,
            otherReq: obj.extension.otherReq.join('+'),
            keywords: obj.keywords.map((i) => i.txt).join(' ')
          })
        }
      )
      return updateActivity(obj)
      //   } else {
      //     return false;
      //   }
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    background-color: white;
    margin: 10px 20px;
    .form-container {
      max-width: 720px;
      .el-input {
        width: 80%;
      }
      .guide-del {
        color: #4244ff;
        margin-left: 8px;
      }
    }

    .goods_p {
      display: flex;
      flex-direction: row;
      .box {
        display: flex;
        flex-direction: row;
        border: 1px solid #c0c4cc;
        border-radius: 4px;
        padding: 12px;
        img {
          width: 70px;
          height: 70px;
        }
        .info {
          flex: 1;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p {
            font-size: 14px;
            line-height: 20px;
            margin: 8px 8px 0 0;
            padding: 0;
            color: #3e3e3e;
          }
          .line {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 12px;
              line-height: 16px;
              color: #4244ff;
            }
            .el-button {
              background-color: #4244ff26;
              color: #4244ff;
            }
          }
        }
      }
    }
    .area {
      border: 1px solid #f5f5f5;
      border-radius: 4px;
      width: 300px;
      padding: 0 8px;
      h5 {
        margin: 0;
        .el-button {
          float: right;
        }
      }
      span {
        color: #666;
        margin: 0 8px 8px 0;
      }
    }
    .sub-form {
      position: relative;
      padding-left: 90px;
    }

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.goods-title {
  .el-form-item {
    margin-bottom: 0;
  }
}
.goods-form {
  .el-row {
    .info {
      background-color: #f2f3f7;
      border-radius: 4px;
      text-align: center;
      padding: 2px;
      position: relative;
      margin-bottom: 12px;
      .img {
        width: 84%;
        padding-bottom: 75%;
        position: relative;
        margin: 12px auto;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .txt {
        width: 84%;
        margin: 0 auto 12px auto;
        height: 32px;
        overflow: hidden;
        span {
          font-size: 12px;
          line-height: 16px;
        }
      }
      .mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }
}
.address-form {
  h5 {
    color: black;
    margin: 10px 0;
  }
  .index {
    margin-bottom: 16px;
    margin-left: -4px;
  }
  .pill {
    min-width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: #d8d8d8;
    margin: 0 4px;
    padding: 0 4px;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
  }
  .groups {
    height: 320px;
    overflow: hidden scroll;
    .row {
      padding: 8px 0 0 0;
      .el-checkbox {
        margin: 4px 8px 4px 0;
      }
    }
  }
}
.tip_desc {
  background-color: #f3f3f9;
  font-size: 14px;
  line-height: 24px;
  color: #9090d2;
  padding: 8px;
  margin-top: 8px;
  max-width: 400px;
  border-radius: 4px;
  a {
    color: #4244ff;
    text-decoration: underline;
  }
}
.input_remove {
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  .box {
    position: absolute;
    right: -15px;
    top: -20px;
    padding: 2px;
    width: 20px;
    height: 20px;
    .el-icon-circle-close {
      font-size: 16px;
      line-height: 20px;
    }
  }
}
.topic_label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  img {
    width: 22px;
    height: 22px;
    margin-left: 8px;
  }
}
.topic_p {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .item:first-of-type {
    margin-top: 0;
  }
  .item {
    display: flex;
    flex-direction: row;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;
    padding: 4px 8px;
    margin-top: 8px;
    img {
      width: 40px;
      height: 40px;
    }
    div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 32px;
      padding: 0 8px;
      span {
        margin: 0;
        padding: 0;
        line-height: 1;
      }
    }
  }
}
.split {
  display: flex;
  flex-direction: row;
  div {
    flex: 1;
    text-align: center;
    align-self: stretch;
    pre {
      font-size: 14px;
      color: #606266;
      margin: 0;
      font-weight: 400;
    }
  }
  div:nth-of-type(2) {
    border-left: 1px solid #dfe6ec;
  }
}
</style>
