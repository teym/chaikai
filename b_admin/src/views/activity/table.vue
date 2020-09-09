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
      <el-table-column label="商品名称">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待审核">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待缴押金">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待发货">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待评测">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已评测">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名时间">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(row,$index)">删除</el-button>
          <!-- <el-button type="text" size="mini" @click="handleOrder(row)">活动订单</el-button>
          <el-button type="text" size="mini" @click="handleOrder(row)">复制订单</el-button>
          <el-button type="text" size="mini" @click="handleOrder(row)">预览订单</el-button>
          <el-button type="text" size="mini" @click="handleOrder(row)">增加名额</el-button>-->
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
  </div>
</template>

<script>
import { fetchList, fetchStat } from '@/api/activities'
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
      activeIndex: ''
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
    handleUpdate(row) {},
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
</style>
