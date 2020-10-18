<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-show="listQuery.statusCode === '1'" class="row row2">
        <div class="place" />
        <div class="right">
          <span>活动名额: {{ stat['0'] }} 已通过: {{ stat['2'] }} 已候选: {{ stat['8'] }}</span>
          <el-button type="primary" size="mini" @click="handleAccept()">一键通过</el-button>
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
      style="width: 100%;"
    >
      <el-table-column label="达人">
        <template slot-scope="{row}">
          <div class="info">
            <img :src="row.blogger.avatar" alt="pic">
            <div>
              <p>
                {{ row.blogger.nickname }}
                <span>评分：{{ row.blogger.score }}</span>
              </p>
              <p>
                <span v-for="(i, j) in ['abcd','def']" :key="j" class="pill">{{ i }}</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请信息">
        <template slot-scope="{row}">
          <span>
            规格：{{ row.goodsSku }}
            <br>
            申请理由：{{ row.applyReason }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="申请渠道"
        width="90"
      >
        <template slot-scope="{row}">
          <!-- <img
            v-for="c in row.channels"
            :key="c.platformId"
            :src="channelIcons['' + c.platformId]"
            alt
            srcset
          />-->
          <span v-for="c in row.channels" :key="c.platformId">
            {{ channelIcons[c.platformId + ''].name }}
            <br>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '6'" label="评测内容">
        <template slot-scope="{row}">
          <span v-for="c in row.channels" :key="c.platformId">
            {{ channelIcons[c.platformId + ''].name }}
            <br>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'"
        label="粉丝/万"
        width="90"
      >
        <template slot-scope="{row}">
          <span v-for="c in row.channels" :key="c.platformId">
            {{ c.fansCount }}
            <br>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '1' || listQuery.statusCode === '2'|| listQuery.statusCode === '6'|| listQuery.statusCode === '7'"
        label="合作方式"
        width="120"
      >
        <template slot-scope="{row}">
          <span>{{ ['','接受悬赏',"达人报价"][row.activity.cooperationType] }}¥{{ row.reward }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '3' || listQuery.statusCode === '4' || listQuery.statusCode === '5'"
        label="收货信息"
      >
        <template slot-scope="{row}">
          <span>
            收货人：{{ (row.receiver || {}).name }}
            <br>
            手机号码：{{ (row.receiver || {}).telephone }}
            <br>
            收货地址：{{ ((row.receiver || {}).province || '') + ((row.receiver || {}).city || '') + ((row.receiver || {}).county || '') + ((row.receiver || {}).address || '') }}
            <br>
            物流信息：{{ ((row.receiver || {}).logisticsPlatform || '') + ((row.receiver || {}).logisticsNo || '') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '3'" label="发货时间">
        <template slot-scope="{row}">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '4'" label="确认收货">
        <template slot-scope="{row}">
          <span>还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '5'" label="评测时间">
        <template slot-scope="{row}">
          <span>测评发布时间还剩{{ row.deadlineText }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '6' || listQuery.statusCode === '7'"
        label="悬赏"
      >
        <template slot-scope="{row}">
          <span>
            <strong>{{ ({'1':'未缴押金',"9":"已缴押金",'4':'已冻结','3':"押金退回"})[row.depositStatus + ''] }}</strong>
            <br>
            押金支付还剩{{ row.deadlineText }}超时将视作放弃名额
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.statusCode === '2' || listQuery.statusCode === '7'"
        label="押金状态"
      >
        <template slot-scope="{row}">
          <span>
            <strong>{{ ({'1':'未缴押金',"9":"已缴押金",'4':'已冻结','3':"押金退回"})[row.depositStatus + ''] }}</strong>
            <br>
            {{
              listQuery.statusCode === '2' ? '押金支付还剩' + row.deadlineText +',超时将视作放弃名额' :
              (listQuery.statusCode === '3' ? '发布测评后15天自动退还':'')
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
        <template slot-scope="{row}">
          <div>
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              @click="handleAction(row, 'REJECT')"
            >拒绝</el-button>
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              type="primary"
              @click="handleAction(row, 'PASS')"
            >通过</el-button>
            <el-button
              v-if="listQuery.statusCode === '1'"
              size="mini"
              type="primary"
              :icon="row.candidate ? 'el-icon-checked' : 'el-icon-plus'"
              @click="handleAction(row, 'CANDIDATE')"
            >{{ row.candidate ? '已':'' }}候选</el-button>
            <el-button
              v-if="listQuery.statusCode === '3' || listQuery.statusCode === '4' || listQuery.statusCode === '5'"
              size="mini"
              type="primary"
              @click="handleDetail(row)"
            >订单详情</el-button>
            <el-button
              v-if="listQuery.statusCode === '6'"
              size="mini"
              type="primary"
              @click="handleComplain(row)"
            >投诉</el-button>
            <el-button
              v-if="listQuery.statusCode === '6'"
              size="mini"
              type="primary"
              @click="handleComplain(row)"
            >评价</el-button>
            <el-button
              v-if="listQuery.statusCode === '4' || listQuery.statusCode === '5'|| listQuery.statusCode === '6'"
              size="mini"
              type="primary"
              @click="handleDetail(row)"
            >查看物流</el-button>
          </div>
          <div v-if="listQuery.statusCode === '1' && row.candidate" style="margin: 8px 32px 0 32px">
            <el-input v-model="row.brRemark" size="mini" @change="handleRemark(row)" />
          </div>
          <!-- <el-button type="text" size="mini" @click="handleUpdate(row)">订单详情</el-button>
          <el-button type="text" size="mini" @click="handleDelete(row,$index)">查看物流</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
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
  updateAction
} from '@/api/activities'
import { ActivityOrderStatus, Channels, ChannelIcons } from '@/utils/constant'
import {formatDeadLine} from '@/utils/index'
import { mapGetters } from 'vuex'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
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
        sort: 'RECOMMEND',
        statusCode: '1',
        platformId: '',
        goodsSkuUnionId: '',
        searchType: '1',
        searchKey: ''
      },
      activeIndex: '',
      detail: {},
      append: 0,
      formVisible: false,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone', 'statusCode', 'brandCount'])
  },
  created() {
    this.listQuery.brActivityId = this.$route.query && this.$route.query.id
    this.getTabs()
    this.getList()
  },
  methods: {
    getTabs() {
      Promise.all([
        fetchOdStat({ brActivityId: this.listQuery.brActivityId }),
        fetchData(this.listQuery.brActivityId)
      ])
        .then((r) => {
          this.stat = {
            '0': r[0].data.total,
            '1': r[0].data.pending,
            '2': r[0].data.notPayDeposit,
            '3': r[0].data.toBeDelivered,
            '4': r[0].data.toBeReceived,
            '5': r[0].data.toBeEvaluated,
            '6': r[0].data.evaluated,
            '7': r[0].data.closed,
            '8': r[0].data.candidate
          }
          this.channels = r[1].data.extension.channelLimit
            ? r[1].data.extension.channels.map((i) =>
              Object.assign({}, i, ChannelIcons[i.platformId + ''])
            )
            : Channels.map((i) =>
              Object.assign(
                { platformName: i.name, platformId: i.id },
                i,
                ChannelIcons[i.id + '']
              )
            )
          this.skus = r[1].data.goods.skuUnionList
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      if (obj.searchType === '1') {
        obj.orderId = obj.searchKey
      } else {
        obj.bloggerName = obj.searchKey
      }
      fetchOdList(obj)
        .then((response) => {
          this.list = response.data.data.map((i) =>
            Object.assign(
              { brRemark: '', deadlineText: formatDeadLine(i.deadline)},
              i
            )
          )
          this.total = response.data.pager.count

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    handleSelect(e) {
      this.listQuery.statusCode = e
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAction(row, act, tip) {
      if (act === 'CANDIDATE') {
        row.brRemark = row.brRemark || ''
        row.candidate = !row.candidate
      } else if (act === 'PASS' && !tip) {
        this.$confirm(
          '确认通过' +
            row.blogger.nickname +
            '的活动申请，并消耗账户余额' +
            row.reward +
            '元',
          {
            title: '一键通过'
          }
        ).then((r) => {
          if (r === 'confirm') {
            this.handleAction(row, act, true)
          }
        })
      } else {
        this.listLoading = true
        updateAction({ orderId: row.id, action: act })
          .then((r) => {
            this.getTabs()
            this.getList()
          })
          .catch((e) => {
            this.listLoading = false
          })
      }
    },
    handleRemark(row) {
      this.listLoading = true
      updateAction({
        orderId: row.id,
        action: 'CANDIDATE',
        candidate: row.candidate,
        remark: row.brRemark
      })
        .then((r) => {
          this.getTabs()
          this.getList()
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    handleAccept() {
      this.$confirm('将消耗3个活动名额和账户余额600元', {
        title: '一键通过'
      }).then((r) => {
        // if (r === 'confirm') {
        // }
      })
    }
  }
}
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
</style>
