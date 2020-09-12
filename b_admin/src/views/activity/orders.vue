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
            <span v-if="stat[i.value] > 0" class="pill">{{ stat[i.value] }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div v-show="listQuery.statusCode === '1'" class="row">
        <el-select v-model="listQuery.sort">
          <el-option label="推荐排序" value="RECOMMEND" />
          <el-option label="粉丝量" value="FANS" />
          <el-option label="最新申请" value="TIME" />
        </el-select>

        <el-select v-model="listQuery.platformId">
          <el-option label="全部渠道" :value="''" />
          <el-option v-for="i in channels" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>

        <el-select v-model="listQuery.goodsSkuUnionId">
          <el-option label="全部规格" :value="''" />
          <el-option v-for="i in channels" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
        <div>
          活动名额 已通过 以候选
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
      <el-table-column label="达人" width="200">
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
      <el-table-column label="申请信息" width="160">
        <template slot-scope="{row}">
          <span>
            规格：{{ row.goodsSku }}
            <br>
            申请理由：{{ row.applyReason }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.statusCode === '1'" label="申请渠道" width="160">
        <template slot-scope="{row}">
          <img v-for="c in row.channels" :key="c.platformId" :src="ChannelIcons['' + c.platformId]" alt="" srcset="">
        </template>
      </el-table-column>
      <el-table-column label="收货信息">
        <template slot-scope="{row}">
          <span>
            收货人：{{ row.notPayDepositNum }}
            <br>
            手机号码：{{}}
            <br>
            收货地址：{{}}
            <br>
            物流信息：{{}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="评测时间">
        <template slot-scope="{row}">
          <span>{{ row.undeliveredNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金">
        <template slot-scope="{row}">
          <span>{{ row.unevaluatedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="handleUpdate(row)">订单详情</el-button>
          <el-button type="text" size="mini" @click="handleDelete(row,$index)">查看物流</el-button>
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
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import { fetchOdList, fetchOdStat } from '@/api/activities'
import { ActivityOrderStatus, Channels } from '@/utils/constant'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      statusList: ActivityOrderStatus,
      channels: Channels,
      tableKey: 0,
      list: null,
      total: 0,
      stat: {},
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        sort: 'RECOMMEND',
        statusCode: '1',
        platformId: '',
        goodsSkuUnionId: ''
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
    this.getTabs()
    this.getList()
  },
  methods: {
    getTabs() {
      fetchOdStat()
        .then((r) => {
          this.stat = r.data
        })
        .catch((e) => {})
    },
    getList() {
      this.listLoading = true
      fetchOdList(this.listQuery)
        .then((response) => {
          this.list = response.data.data
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
      this.statusCode = e
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      if (this.statusCode !== 3) {
        this.$alert('无法创建商品，为保障品牌合作规范，请先完成企业认证').then(
          (r) => {
            if (r === 'confirm') {
              this.$router.push('/user/create')
            }
          }
        )
      } else if (this.brandCount === 0) {
        this.$alert('无法创建商品，为保障品牌合作规范，请先完成品牌授权').then(
          (r) => {
            if (r === 'confirm') {
              this.$router.push('/user/auth')
            }
          }
        )
      } else {
        this.$router.push('/activity/create')
      }
    },
    handleOrder() {
      this.$router.push('/activity/order')
    },
    handleUpdate(row) {
      this.$router.push({ path: '/activity/create', query: { id: row.id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  background-color: white;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 8px 0;
  .row {
    padding: 8px 16px;
    .title {
      font-size: 20px;
      color: #333;
      font-weight: bold;
      margin-right: 12px;
    }
    .el-menu {
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
  .row:last-child {
    border-top: 1px solid #f5f5f5;
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
