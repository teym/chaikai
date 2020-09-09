<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-item">商品管理</span>
      <el-input
        v-model="listQuery.key"
        placeholder="请输入商品名称"
        style="width: 200px;"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleCreate"
      >创建商品</el-button>
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
          <p class="info">
            <img :src="row.picUrl" alt="pic" class="pic">
            <span>{{ row.title }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="150" align="center">
        <template slot-scope="{row}">
          <span class="info">{{ (row.brand || {}).name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="text"
            @click="handleDelete(row,$index)"
          >删除</el-button>
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
import { fetchList, removeData } from '@/api/goods'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
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
        size: 20,
        key: undefined
      }
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
      fetchList(this.listQuery).then(({ data }) => {
        this.list = data.data
        this.total = data.pager.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
        this.$router.push('/goods/create')
      }
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/create', query: { id: row.itemId }})
    },
    handleDelete(row, index) {
      this.$confirm(
        '确认删除商品' + row.name + ',将无法恢复',
        '删除商品',
        {}
      ).then((r) => {
        if (r === 'confirm') {
          removeData(row.id).then((r) => {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    background-color: white;
    padding: 16px 16px 6px 16px;
    border-radius: 4px;
    span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .el-table {
    margin: 20px 0;
    border-radius: 4px;
  }
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 90px;
      height: 90px;
      border-radius: 4px;
      margin-right: 8px;
    }
    font-size: 14px;
    color: #666;
    vertical-align: middle;
    margin: 0;
    padding: 0;
  }
}
</style>
