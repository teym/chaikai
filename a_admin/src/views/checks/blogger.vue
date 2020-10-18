<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 90px"
      >
        <el-option :value="1" label="用户ID" />
        <el-option :value="2" label="用户昵称" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入"
        style="width: 200px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.platformId"
        size="mini"
        class="filter-item"
        style="margin-left: 16px"
      >
        <el-option :value="0" label="全部" />
        <el-option
          v-for="(item, i) in channels"
          :key="i"
          :value="item.id"
          :label="item.name"
        />
      </el-select>

      <el-select
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="margin-left: 16px"
      >
        <el-option
          v-for="(item, i) in stateOp"
          :key="i"
          :value="item.v"
          :label="item.l"
        />
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleFilter"
      >筛选</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="用户ID">
        <template slot-scope="{ row }">
          <span>{{ row.account.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.account.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请渠道" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主页链接" align="center">
        <template slot-scope="{ row }">
          <a :href="row.homeLink" target="_blank">{{ row.homeLink }}</a>
        </template>
      </el-table-column>
      <el-table-column label="主页截图" align="center">
        <template slot-scope="{ row }">
          <p @click="handlePreview(row.homePic)">查看</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
          <span v-if="row.statusCode === 2"><br>{{ row.rejectReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.statusCode === 1"
            type="primary"
            size="mini"
            @click="handleAction(row, 3)"
          >通过</el-button>
          <el-button
            v-if="row.statusCode === 1"
            size="mini"
            @click="handleAction(row, 2)"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog width="60%" title="预览" :visible.sync="preview" append-to-body>
      <img style="width: 100%" :src="previewUrl" alt="img">
    </el-dialog>
  </div>
</template>

<script>
import { fetchBloggerList, updateBloggerState } from '@/api/check'
import { clearQueryObject } from '@/utils/index'
import { Channels } from '@/utils/constant'
import moment from 'moment'
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
        searchType: 1,
        searchKey: '',
        statusCode: 1,
        platformId: 0
      },
      channels: Channels,
      status: ['全部', '审核中', '已拒绝', '已认证'],
      preview: false,
      previewUrl: ''
    }
  },
  computed: {
    stateOp() {
      return this.status.map((i, j) => ({ v: j, l: i }))
    },
    ...mapGetters(['name', 'avatar', 'telephone'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[['', 'blAccountId', 'nickname'][obj.searchType]] = obj.searchKey
      fetchBloggerList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data.data.map((i) =>
          Object.assign(i, {
            date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
          })
        )
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

    handlePreview(url) {
      this.previewUrl = url
      this.preview = true
    },
    handleAction(row, state) {
      if (state === 3) {
        this.$confirm('确认通过?').then((r) => {
          updateBloggerState({ id: row.id, statusCode: state }).then((r) => {
            row.statusCode = state
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      } else {
        this.$prompt('请输入拒绝理由').then((r) => {
          updateBloggerState({
            id: row.id,
            statusCode: state,
            rejectReason: r.value
          }).then(() => {
            row.statusCode = state
            row.rejectReason = r.value
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      }
    },
    handleDetail(item) {
      console.log(item.name)
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
