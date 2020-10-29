<template>
  <div>
    <div v-if="detail" class="detail">
      <el-row>
        <el-col :span="12">
          <div class="row">
            <h4>账户ID:</h4>
            <p>{{ detail.id }}</p>
          </div>
          <div class="row">
            <h4>微信昵称:</h4>
            <p>{{ detail.nickname }}</p>
          </div>
          <div class="row">
            <h4>真实姓名:</h4>
            <p>{{ detail.realName }}</p>
          </div>
          <div class="row">
            <h4>擅长领域:</h4>
            <p>{{ detail.areas.map((i) => i.name).join("/") }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="row">
            <h4>注册时间:</h4>
            <p>{{ detail.date }}</p>
          </div>
          <div class="row">
            <h4>手机号:</h4>
            <p>{{ detail.telephone }}</p>
          </div>
          <div class="row">
            <h4>微信号:</h4>
            <p>{{ detail.wechatNo }}</p>
          </div>
          <div class="row">
            <h4>钱包收入:</h4>
            <div class="row">
              <p>{{ detail.id }}</p>
              <el-button size="mini" @click="handleFinance">明细</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <h4>渠道</h4>
      <el-table :data="detail.channels" border fit>
        <el-table-column label="认证渠道">
          <template slot-scope="{ row }">
            <span>{{ row.platformName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="{ row }">
            <span>{{ row.platformNickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="粉丝数">
          <template slot-scope="{ row }">
            <span>{{ row.fansCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道ID">
          <template slot-scope="{ row }">
            <span>{{ row.platformUid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主页链接">
          <template slot-scope="{ row }">
            <a :href="row.homeLink" target="_blank">{{ row.homeLink }}</a>
          </template>
        </el-table-column>
        <el-table-column label="主页截图" align="center">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              @click="onPreview(row.homePic)"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" @click="onUnbind(row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      width="60%"
      title="预览"
      :visible.sync="previewVisable"
      append-to-body
    >
      <img style="width: 100%" :src="preview" alt="img">
    </el-dialog>
    <el-dialog
      width="60%"
      title="钱包明细"
      :visible.sync="financeVisable"
      append-to-body
    >
      <el-table
        v-loading="finance.loading"
        :data="finance.list"
        border
        fit
        style="width: 100%"
      >
        <el-table-column label="类型" width="90">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.msg }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.raeType === 1 ? "+" : "-" }}{{ row.amount }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="finance.total > 0"
        :total="finance.total"
        :page.sync="finance.page"
        :limit.sync="finance.size"
        @pagination="loadFinance"
      />
    </el-dialog>
  </div>
</template>

<script>
import { unbindBlogger, fetchBloggerFinance } from '@/api/accounts'
import { Channels } from '@/utils/constant'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
// import { mapGetters } from "vuex";
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      channels: Channels,
      // detailVisable: false,
      // detail: null,
      previewVisable: false,
      preview: '',
      financeVisable: false,
      finance: {
        loading: false,
        list: [],
        page: 1,
        size: 5,
        total: 0
      }
    }
  },
  methods: {
    // loadDetail(item) {
    //   fetchBlogger(item.id).then((r) => {
    //     r.data.financeInfo = item.financeInfo;
    //     r.data.channels = item.channels;
    //     r.data.date = item.date;
    //     this.detail = r.data;
    //   });
    // },
    loadFinance() {
      this.finance.loading = true
      fetchBloggerFinance({
        page: this.finance.page,
        size: this.finance.size,
        blAccountId: this.detail.id
      })
        .then((r) => {
          this.finance.list = r.data.data.map((i) =>
            Object.assign(i, {
              date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
            })
          )
          this.finance.total = r.data.pager.count
          this.finance.loading = false
        })
        .catch((e) => {
          this.finance.loading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // handleDetail(item) {
    //   this.loadDetail(item);
    //   this.detailVisable = true;
    // },
    onPreview(url) {
      this.preview = url
      this.previewVisable = true
    },
    onUnbind(row) {
      this.$confirm(
        `确定解绑${this.detail.nickname}的${row.platformName}渠道，解绑后达人需重新提交渠道认证申请`
      ).then((r) => {
        unbindBlogger({
          blAccountId: this.detail.id,
          platformId: row.platformId
        }).then((r) => {
          const index = this.detail.channels.findIndex(
            (i) => i.platformId === row.platformId
          )
          if (index >= 0) {
            this.detail.channels.splice(index, 1)
          }
        })
      })
    },
    handleFinance() {
      this.finance = {
        loading: false,
        list: [],
        page: 1,
        size: 5,
        total: 0
      }
      this.financeVisable = true
      this.loadFinance()
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 4px;
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
    .el-input {
      width: 280px;
    }
    div {
      flex: 1;
    }
  }
}
</style>
