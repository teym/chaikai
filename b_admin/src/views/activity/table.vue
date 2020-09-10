<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="row">
        <span class="title">活动列表</span>
        <el-input
          v-model="listQuery.key"
          placeholder="请输入活动名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />

        <el-button
          class="filter-item"
          style="float: right"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >创建活动</el-button>
      </div>
      <div class="row">
        <el-menu :default-active="''" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item :index="''">
            全部
            <span v-if="stat.total > 0" class="pill">{{ stat.total }}</span>
          </el-menu-item>
          <el-menu-item index="SIGNING_UP">
            报名中
            <span v-if="stat.signingUp > 0" class="pill">{{ stat.signingUp }}</span>
          </el-menu-item>
          <el-menu-item index="NOT_STARTED">
            未开始
            <span v-if="stat.notStarted > 0" class="pill">{{ stat.notStarted }}</span>
          </el-menu-item>
          <el-menu-item index="SIGN_UP_CLOSED">
            报名结束
            <span v-if="stat.signUpClosed > 0" class="pill">{{ stat.signUpClosed }}</span>
          </el-menu-item>
        </el-menu>
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
      <el-table-column label="商品名称" width="260">
        <template slot-scope="{row}">
          <div class="info">
            <img :src="row.picUrl" alt="pic">
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="待审核">
        <template slot-scope="{row}">
          <span>{{ row.pendingEvaNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待缴押金">
        <template slot-scope="{row}">
          <span>{{ row.notPayDepositNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待发货">
        <template slot-scope="{row}">
          <span>{{ row.undeliveredNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待评测">
        <template slot-scope="{row}">
          <span>{{ row.unevaluatedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已评测">
        <template slot-scope="{row}">
          <span>{{ row.evaluatedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" width="160">
        <template slot-scope="{row}">
          <span>
            {{ row.regStartTime }}
            <br>
            {{ row.regEndTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="{row}">
          <span>{{ ["","待提交","待排期","已拒绝","未开始","报名中","报名结束"][row.statusCode] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.statusCode === 1 || row.statusCode === 3"
            type="text"
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="row.statusCode === 1 || row.statusCode === 3"
            type="text"
            size="mini"
            @click="handleDelete(row,$index)"
          >删除</el-button>
          <el-button
            v-if="row.statusCode === 5 || row.statusCode === 6"
            type="text"
            size="mini"
            @click="handleOrder(row)"
          >活动订单</el-button>
          <el-button
            v-if="row.statusCode === 5 || row.statusCode === 6"
            type="text"
            size="mini"
            @click="handleOrder(row)"
          >预览订单</el-button>
          <br v-if="row.statusCode === 5 || row.statusCode === 6">
          <el-button
            v-if="row.statusCode >= 4"
            type="text"
            size="mini"
            @click="handleOrder(row)"
          >复制订单</el-button>
          <el-button
            v-if="row.statusCode === 4 || row.statusCode === 5"
            type="text"
            size="mini"
            @click="handleAddOrder(row)"
          >增加名额</el-button>
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
import { fetchList, fetchStat, updateData } from '@/api/activities'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      stat: {},
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        key: undefined
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
      fetchStat()
        .then((r) => {
          this.stat = r.data
        })
        .catch((e) => {})
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery)
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
      this.activeIndex = e
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
    },
    handleAddOrder(row) {
      this.detail = row
      this.formVisible = true
    },
    handleAddNumber() {
      this.formLoading = true
      updateData({ id: this.detail.id, totalNum: this.append })
        .then((r) => {
          this.formLoading = false
          this.formVisible = false
          this.getList()
        })
        .catch((e) => {
          this.formLoading = false
        })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
    width: 90px;
    height: 90px;
  }
  span {
    flex: 1;
  }
}
</style>
