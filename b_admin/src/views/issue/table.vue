<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.searchKey" placeholder="请输入内容" class="input-with-select">
        <el-select
          slot="prepend"
          v-model="listQuery.searchType"
          placeholder="请选择"
          style="width:120px"
        >
          <el-option label="活动名称" value="1" />
          <el-option label="订单编号" value="2" />
        </el-select>
      </el-input>

      <el-select v-model="listQuery.statusCode" placeholder="请选择" style="width:80px">
        <el-option label="全部" :value="''" />
        <!-- <el-option v-for="(i, j) in statusList" :label="i" :value="(j + 1) + ''" :key="j" /> -->
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleFilter">筛选</el-button>
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
      <el-table-column label="问题编号" min-width="110px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.brActivityOrderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type === 101 ? '测评投诉':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ ([""].concat(statusList))[row.statusCode] }}</span>
          <span style="font-size:12px;line-height:1.2"><br>修改测评还剩5天0时0分，超时将由小二介入</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="row.statusCode !== 2"
            type="primary"
            size="mini"
            @click="handleDetail(row)"
          >查看</el-button>
          <el-button
            v-if="row.statusCode === 2"
            type="primary"
            size="mini"
            @click="handleAction(row)"
          >去处理</el-button>
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
import { fetchIssues } from '@/api/activities'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const Status = [
  '待修改',
  '待确认',
  '小二审核中',
  '待重评',
  '已修改',
  '已取消',
  '已违规'
]
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
        type: 101,
        searchType: '1',
        searchKey: '',
        statusCode: ''
      },
      statusList: Status
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
      const q = Object.assign(
        {},
        this.listQuery,
        this.listQuery.searchType === '1'
          ? { activityName: this.listQuery.searchKey }
          : { brActivityOrderId: this.listQuery.searchKey }
      )
      fetchIssues(q).then((response) => {
        this.list = response.data.data
        this.total = response.data.pager.count

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
    handleDetail(item) {},
    handleAction(item) {}
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  .filter-container {
    background-color: white;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 20px;

    .input-with-select {
      width: 320px;
      margin-right: 8px;
    }
    .filter-item {
      margin: 0 8px;
    }
  }
}
</style>
