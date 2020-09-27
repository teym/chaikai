<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <div class="createPost-main-container">
        <div class="form-container">
          <p>基本信息</p>
          <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="110px" label="活动商品:">
            <el-button v-if="!postForm.goods" icon="el-icon-plus" @click="handleSelectGoods">选择商品</el-button>
            <div v-else class="goods_p" @click="handleSelectGoods">
              <img :src="postForm.goods.picUrl" alt="pic">
              <div>
                <p>{{ postForm.goods.title }}</p>
                <span>{{ postForm.goods.price }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="110px" label="商品规格:">
            <el-select v-model="postForm.skus" multiple placeholder="请选择">
              <el-option
                v-for="item in ((postForm.goods || {}).skuUnionList || [])"
                :key="item.skuIdUnion"
                :label="item.name"
                :value="item.skuIdUnion"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="活动名称:">
            <el-input v-model="postForm.title" placeholder="请输入品牌名+空格+商品名称" maxlength="30" />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="报名时间:">
            <el-date-picker
              v-model="postForm.regTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="dateOptions"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="活动名额:">
            <el-input v-model="postForm.totalNum" placeholder="活动名额" />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="测评指引:">
            <el-input
              v-for="(line, i) in postForm.guidelines"
              :key="i"
              v-model="line.txt"
              placeholder="请输入测评指引"
              maxlength="20"
              style="margin-bottom:8px"
              show-word-limit
            />
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
          <p>活动设置</p>
          <el-form-item prop="displayType" style="margin-bottom: 30px;" label-width="110px">
            <span slot="label" for="displayType">
              私密活动
              <el-popover
                placement="bottom"
                width="300"
                trigger="click"
                content="私密活动将不在小程序公开申请，需手动转发邀约博主参加"
              >
                <el-icon slot="reference" class="el-icon-question" />
              </el-popover>
            </span>
            <el-switch
              v-model="postForm.displayType"
              active-color="#13ce66"
              inactive-color="#D3D3D3"
            />
          </el-form-item>
          <el-form-item prop="recvArea" style="margin-bottom: 30px;" label-width="110px" label=":">
            <span slot="label" for="recvArea">
              收货地限制
              <el-popover placement="bottom" width="300" trigger="click" content="若博主收货地址不符，无法申请活动">
                <el-icon slot="reference" class="el-icon-question" />
              </el-popover>
            </span>
            <el-switch
              v-model="postForm.extension.receiveAreaLimit"
              active-color="#13ce66"
              inactive-color="#D3D3D3"
            />
            <div v-if="postForm.extension.receiveAreaLimit">
              <el-radio-group v-model="postForm.recvAreaType">
                <el-radio :label="1">不可收货地区</el-radio>
                <el-radio :label="2">可收货地区</el-radio>
              </el-radio-group>
              <div class="area">
                <h5>
                  已选地区
                  <el-button type="text" @click="addressFormVisible=true">选择</el-button>
                </h5>
                <span v-for="(i, j) in postForm.extension.receiveAreas" :key="j">{{ i.name }}</span>
                <span v-if="postForm.extension.receiveAreas.length === 0">未选择地区</span>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="createPost-main-container">
        <div class="form-container">
          <p>合作任务</p>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="报名渠道:">
            <el-checkbox-group v-model="postForm.channels" @change="onChannels">
              <el-checkbox :label="0">不限</el-checkbox>
              <el-checkbox v-for="i in channelList" :key="i.id" :label="i.id">{{ i.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="110px" label="合作方式:">
            <el-radio-group v-model="postForm.cooperationType">
              <el-radio-button :label="1">接受悬赏</el-radio-button>
              <el-radio-button :label="2">接受悬赏/博主报价</el-radio-button>
              <el-radio-button :label="3">免费置换</el-radio-button>
            </el-radio-group>
            <div class="tip_desc">
              --博主测评内容需满足
              <a>《基础合作规范》</a>
              <br>--品牌方可提出：[图片数量]、[视频长度]等合作要求，每增加一项，悬赏金额保底价将相应提高
              <a>《合作要求价格表》</a>
            </div>
          </el-form-item>
          <el-form-item prop style="margin-bottom: 30px;" label-width="170px" label="合作要求 内容篇幅:">
            <el-radio-group v-model="postForm.extension.articleType" @change="handleTypeChange">
              <el-radio-button :label="0">无要求</el-radio-button>
              <el-radio-button :label="1">单篇</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            prop="articleType"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="内容形式:"
          >
            <el-radio-group v-model="postForm.extension.contentType">
              <el-radio-button :label="0">无要求</el-radio-button>
              <el-radio-button :label="1">图文</el-radio-button>
              <el-radio-button :label="2">视频</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="postForm.extension.contentType === 2"
            prop="minVideoLength"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="视频时长:"
          >
            <el-radio-group v-model="postForm.extension.minVideoLength">
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
            style="margin-bottom: 30px;"
            label-width="170px"
            label="最低字数:"
          >
            <el-radio-group v-model="postForm.extension.minWordNum">
              <el-radio-button :label="0">无要求</el-radio-button>
              <el-radio-button :label="1">200</el-radio-button>
              <el-radio-button :label="2">400</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="postForm.extension.contentType === 1"
            prop="minPicNum"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="最低图片数:"
          >
            <el-radio-group v-model="postForm.extension.minPicNum">
              <el-radio-button :label="0">无要求</el-radio-button>
              <el-radio-button :label="1">6张</el-radio-button>
              <el-radio-button :label="2" :disabled="postForm.extension.articleType === 0">9张</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="170px" label="账号话题:">
            <div v-for="(t, i) in postForm.topics" :key="i">
              <span>
                {{ t.platformName }}
                <br>
                @{{ t.nickname }}#{{ t.topic }}
              </span>
            </div>
            <el-button @click="onShowTopicForm">添加话题</el-button>
          </el-form-item>
          <el-form-item prop="discountInfo" style="margin-bottom: 30px;" label-width="170px">
            <span slot="label" for="discountInfo">
              优惠信息
              <el-popover
                placement="bottom"
                width="300"
                trigger="click"
                content="博主可在正文或评论中添加优惠信息，小红书暂不支持携带优惠信息"
              >
                <el-icon slot="reference" class="el-icon-question" />
              </el-popover>
            </span>
            <el-input
              v-model="postForm.extension.discountInfo"
              placeholder="请填写需要露出的优惠信息"
              maxlength="150"
            />
          </el-form-item>
          <el-form-item
            prop="keywords"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="附加关键词:"
          >
            <span slot="label" for="keywords">
              附加关键词
              <el-popover placement="bottom" width="300" trigger="click" content="博主需在测评正文中添加关键词">
                <el-icon slot="reference" class="el-icon-question" />
              </el-popover>
            </span>
            <el-input v-model="postForm.extension.keywords" placeholder="博主需在测评正文中添加关键词" />
          </el-form-item>
          <el-form-item
            prop="bloggerPublishTime"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="发布时间"
          >
            <span slot="label" for="bloggerPublishTime">
              发布时间
              <el-popover
                placement="bottom"
                width="300"
                trigger="click"
                content="截止发布时间前，所发布的测评才能获得悬赏"
              >
                <el-icon slot="reference" class="el-icon-question" />
              </el-popover>
            </span>
            <el-date-picker
              v-model="postForm.extension.bloggerPublishTime"
              type="date"
              placeholder="指定博主发布测评时间"
            />
          </el-form-item>
          <el-form-item
            prop="otherReq"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="其它要求"
          >
            <el-checkbox-group v-model="postForm.extension.otherReq">
              <el-checkbox-button :label="1">产品和达人同框露脸</el-checkbox-button>
              <el-checkbox-button :label="2">使用前后效果对比</el-checkbox-button>
              <el-checkbox-button :label="3">提供评测原图使用权</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            prop="reward"
            style="margin-bottom: 30px;"
            label-width="170px"
            label="悬赏金额"
          >
            <el-input
              v-model="postForm.reward"
              :placeholder="'最低' + minAmount +'元/人'"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="100px">
            <el-button @click="onCancel">取消</el-button>
            <el-button @click="submitForm(false)">保存</el-button>
            <el-button type="primary" @click="submitForm(true)">提交审核</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog custom-class="custom-dialog" title="选择活动商品" :visible.sync="goodsFormVisible">
      <div slot="title">
        <el-form :inline="true" class="goods-title">
          <el-form-item label="选择活动商品">
            <el-input v-model="goods.key" placeholder="请输入商品名称" @keypress.enter="handleFilter" />
          </el-form-item>
        </el-form>
      </div>
      <div class="goods-form">
        <el-row :gutter="20" justify="center" :loading="goods.loading">
          <el-col v-for="(g, i) in goods.list" :key="i" :span="4">
            <div class="info" @click="handleGoods(g)">
              <img :src="g.picUrl" alt="pic">
              <p>{{ g.title }}</p>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          layout="total, prev, pager, next"
          :page-size="10"
          :total="goods.total"
          :current-page="goods.page"
          @current-change="handleGoodsPage"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goodsFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="custom-dialog" title="选择区域" :visible.sync="addressFormVisible">
      <div class="address-form">
        <p>
          <span v-for="(a, n) in postForm.receiveAreas" :key="n" class="pill">{{ a.name }}</span>
        </p>
        <h5>省份选择</h5>
        <a-address v-model="postForm.extension.receiveAreas" :type="postForm.recvAreaType" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addressFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="custom-dialog"
      title="账号话题"
      :visible.sync="topicFormVisible"
      width="420px"
    >
      <el-form label-width="60px">
        <el-form-item v-for="i in topics" :key="i.id" :label="i.platformName">
          <el-input v-model="i.nickname" placeholder="@账号" style="width:50%;padding-right:8px" />
          <el-input v-model="i.topic" placeholder="#话题" style="width:50%;padding-left:8px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="topicFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTopic">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { validURL } from '@/utils/validate'
import {
  fetchData,
  fetchPv,
  createData,
  submitData,
  updateData
} from '@/api/activities'
import { Channels } from '@/utils/constant'
import address from './components/address'
import moment from 'moment'

const defaultForm = {
  goods: null,
  skus: [],
  regTime: [],
  title: '',
  totalNum: 5,
  guidelines: [{ txt: '' }],
  displayType: 0,
  recvAreaType: 1,
  cooperationType: 1,
  channels: [0].concat(Channels.map((i) => i.id)),
  topics: [],
  extension: {
    channels: [],
    articleType: 0,
    contentType: 0,
    receiveAreaLimit: false,
    receiveAreas: [],
    minWordNum: 0,
    minPicNum: 0,
    minVideoLength: 0,
    discountInfo: '',
    keywords: '',
    bloggerPublishTime: undefined,
    otherReq: [],
    awardAmount: ''
  }
}

export default {
  name: 'ArticleDetail',
  components: {
    'a-address': address
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // const validateRequire = (rule, value, callback) => {
    //   if (value === '') {
    //     this.$message({
    //       message: rule.field + '为必传项',
    //       type: 'error'
    //     })
    //     callback(new Error(rule.field + '为必传项'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validURL(value)) {
    //       callback()
    //     } else {
    //       this.$message({
    //         message: '外链url填写不正确',
    //         type: 'error'
    //       })
    //       callback(new Error('外链url填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    const validateAmount = (rule, value, callback) => {
      const v = parseInt(value)
      if (v >= 0 && v >= this.minAmount) {
        if (this.postForm.cooperationType !== 3 && v === 0) {
          this.$message({
            message: '请至少设置一项合作要求',
            type: 'error'
          })
          callback(new Error('请至少设置一项合作要求'))
        } else {
          callback()
        }
      } else {
        this.$message({
          message: '请输入正确的推广悬赏金额',
          type: 'error'
        })
        callback(new Error('请输入正确的推广悬赏金额'))
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      brandListOptions: [],
      rules: {
        'reward': [
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      channelList: Channels,
      goodsFormVisible: false,
      goods: {
        page: 0,
        list: [],
        loading: false,
        total: 0,
        key: ''
      },
      topics: [],
      addressFormVisible: false,
      dateOptions: {
        disabledDate(time) {
          const t = time.getTime()
          const n = Date.now()
          return !(
            t > n + 2 * 24 * 60 * 60 * 1000 && t < n + 7 * 24 * 60 * 60 * 1000
          )
        }
      },
      topicFormVisible: false
    }
  },
  computed: {
    minAmount() {
      return (
        [0, 100][this.postForm.extension.articleType] +
        [0, 30, 100][this.postForm.extension.contentType] +
        [0, 25, 120][
          this.postForm.extension.contentType === 1
            ? this.postForm.extension.minWordNum
            : 0
        ] +
        [0, 25, 50][
          this.postForm.extension.contentType === 1
            ? this.postForm.extension.minPicNum
            : 0
        ] +
        [0, 100, 200, 300, 400][
          this.postForm.extension.contentType === 2
            ? this.postForm.extension.minVideoLength
            : 0
        ] +
        (this.postForm.extension.topic ? 30 : 0) +
        (this.postForm.extension.discountInfo ? 30 : 0) +
        (this.postForm.extension.keywords
          ? this.postForm.extension.keywords.split('').length * 30
          : 0) +
        (this.postForm.extension.bloggerPublishTime ? 30 : 0) +
        (this.postForm.extension.otherReq.indexOf(1) >= 0 ? 10 : 0) +
        (this.postForm.extension.otherReq.indexOf(2) >= 0 ? 20 : 0) +
        (this.postForm.extension.otherReq.indexOf(3) >= 0 ? 30 : 0)
      )
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.loadData(id)
    }
  },
  methods: {
    loadData(id) {
      fetchData(id)
        .then((response) => {
          return fetchPv({
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
          const obj = Object.assign({}, defaultForm, r)

          obj.regTime = [r.regStartTime, r.regEndTime]
          if (!r.extension.channelLimit) {
            obj.channels = Channels.map((i) => i.id)
          } else {
            obj.channels = r.extension.channels.map((i) => i.platformId)
          }
          if (r.extension.receiveAreaLimit) {
            obj.recvAreaType = r.extension.receiveAreas[0].type || 1
            obj.extension.receiveAreas = r.extension.receiveAreas.map((i) =>
              Object.assign({ name: i.cityId ? i.city : i.province }, i)
            )
          } else {
            obj.extension.receiveAreas = []
          }
          obj.topics = []
            .concat(r.extension.channels || [])
            .filter((i) => i.nickname && i.topic)
          obj.extension.otherReq = (r.extension.otherReq || '')
            .split('+')
            .map((i) => parseInt(i))
            .filter((i) => i > 0 && i <= 3)
          obj.guidelines = r.guidelines.map((i) => ({ txt: i }))
          this.postForm = obj
        })
        .catch((err) => {
          console.log(err)
        })
    },
    fetchPv(page) {
      this.goods.loading = true
      fetchPv({ page, size: 10 }).then((r) => {
        this.goods = {
          page,
          total: r.data.pager.count,
          list: r.data.data,
          loading: false
        }
      })
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
    handleGoods(goods) {
      this.postForm.goods = goods
      this.goodsFormVisible = false
    },
    handleFilter() {
      this.fetchPv(1)
    },
    handleGoodsPage(p) {
      this.fetchPv(p)
    },
    handleTypeChange(e) {
      if (e === 0 && this.postForm.extension.minPicNum === 2) {
        this.postForm.extension.minPicNum = 0
      }
    },
    onCancel() {
      this.$router.back()
    },
    onChannels(e) {
      const last = [].concat(e).pop()
      if (last === 0) {
        e.splice(0, e.length, 0, ...Channels.map((i) => i.id))
      } else {
        if (e.filter((i) => i !== 0).length >= Channels.length) {
          e.splice(0, e.length, 0, ...Channels.map((i) => i.id))
        } else {
          e.splice(0, e.length, ...e.filter((i) => i !== 0))
        }
      }
    },
    onShowTopicForm() {
      this.topics = Channels.filter(
        (i) => this.postForm.channels.indexOf(i.id) >= 0
      ).map((i) => {
        const obj = this.postForm.topics.find((j) => j.id === i.id)
        return Object.assign(
          { nickname: '', topic: '', platformName: i.name },
          i,
          obj || {}
        )
      })
      this.topicFormVisible = true
    },
    handleAddTopic() {
      this.postForm.topics = this.topics.filter((i) => i.nickname && i.topic)
      this.topicFormVisible = false
    },
    submitForm(submit) {
      var obj = Object.assign(
        {},
        this.postForm,
        {
          guidelines: this.postForm.guidelines.map((i) => i.txt),
          displayType: this.postForm.displayType ? 1 : 0,
          regStartTime: moment(this.postForm.regTime[0]).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          regEndTime: moment(this.postForm.regTime[1]).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        },
        {
          goods: Object.assign({}, this.postForm.goods, {
            skuUnionList: this.postForm.goods.skuUnionList.filter(
              (i) => this.postForm.skus.indexOf(i.skuIdUnion) >= 0
            )
          })
        },
        {
          extension: Object.assign({}, this.postForm.extension, {
            receiveAreaLimit: this.postForm.extension.receiveAreas.length > 0,
            receiveAreas: this.postForm.extension.receiveAreas.map((i) =>
              Object.assign({}, i, { type: this.postForm.recvAreaType })
            ),
            channels: this.postForm.channels.map((id) => {
              const topic = this.postForm.topics.find((i) => i.id === id)
              return Object.assign({}, topic || {}, { platformId: id })
            }),
            channelLimit: this.postForm.channels.indexOf('0') < 0,
            otherReq: this.postForm.extension.otherReq.join('+')
          })
        }
      )
      const id = this.$route.query && this.$route.query.id

      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          var t = !id ? createData(obj) : updateData(obj)
          if (submit) {
            t = t.then((r) => submitData(id || r.data))
          }
          t.then((r) => {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    }

    .goods_p {
      img {
        width: 70px;
        height: 70px;
      }
      div {
        display: inline-block;
        p {
          font-size: 14px;
          margin: 0;
          padding: 0;
        }
        span {
          font-size: 12px;
          color: #4244ff;
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
      img {
        width: 94%;
        height: auto;
        max-height: 120px;
      }
      p {
        text-align: center;
        font-size: 12px;
        margin: 0;
        padding: 0;
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
</style>
