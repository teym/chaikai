<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入商品名称"
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
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
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
        limit: 20,
        title: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total

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
      // check
      const t = Math.random();
      if (t < 0.3) {
        this.$alert('无法创建商品，为保障品牌合作规范，请先完成企业认证').then(
          (r) => {
            if (r === 'confirm') {
              this.$router.push('/account/cert')
            }
          }
        )
      }else if(t < 0.6){
        this.$alert('无法创建商品，为保障品牌合作规范，请先完成品牌授权').then(
          (r) => {
            if (r === 'confirm') {
              this.$router.push('/account/auth')
            }
          }
        )
      }else {
        this.$router.push('/goods/create')
      }
    },
    createData() {},
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
