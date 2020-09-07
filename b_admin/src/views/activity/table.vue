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
        <el-menu
          :default-active="'1'"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            处理中心
            <span class="pill">10</span>
          </el-menu-item>
          <el-menu-item index="2">处理中心</el-menu-item>
          <el-menu-item index="3">
            处理中心
            <span class="pill">3</span>
          </el-menu-item>
          <el-menu-item index="4">处理中心</el-menu-item>
          <el-menu-item index="5">处理中心</el-menu-item>
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
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Brand" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >Delete</el-button>
          <el-button type="primary" size="mini" @click="handleOrder(row)">Order</el-button>
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
import { fetchList } from '@/api/activities'
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
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        key: undefined
      },
      activeIndex: '1'
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone', 'statusCode', 'brandCount'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery)
        .then((response) => {
          this.list = response.data.items
          this.total = response.data.total

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    handleSelect(e) {
      console.log(this.activeIndex, e)
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
