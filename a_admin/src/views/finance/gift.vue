<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 100px"
        @change="handleFilter"
      >
        <el-option :value="1" label="品牌账户" />
        <el-option :value="2" label="达人钱包" />
        <el-option :value="3" label="置换活动" />
      </el-select>
      <el-input
        v-model="listQuery.searchKey"
        :placeholder="
          '请输入' + (listQuery.searchType === 2 ? '用户昵称' : '公司名称')
        "
        style="width: 160px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleFilter"
      >筛选</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 16px"
        type="primary"
        size="mini"
        @click="handleExport"
      >导出</el-button>
      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleAdd"
      >新增</el-button>
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
      <el-table-column v-if="listQuery.searchType === 1" label="明细类型">
        <template>
          <span>其他</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.searchType === 2" label="用户ID">
        <template slot-scope="{ row }">
          <span>{{ row.blAccount.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else label="账户ID">
        <template slot-scope="{ row }">
          <span>{{ row.company.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.searchType === 2" label="用户昵称">
        <template slot-scope="{ row }">
          <span>{{ row.blAccount.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else label="企业名称">
        <template slot-scope="{ row }">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="listQuery.searchType === 3"
        label="赠送原因"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else label="明细" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark || row.msg }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.searchType === 3"
        label="赠送次数"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else label="金额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.opUser.nickname }}</span>
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
    <el-dialog width="60%" title="新增充值" :visible.sync="detailVisable">
      <div class="detail">
        <div class="row">
          <h4>{{ listQuery.searchType === 2 ? "用户" : "账户" }}ID:</h4>
          <div>
            <el-input
              v-model="detail.accountId"
              size="mini"
              @blur="handleAccount"
            />
            <p v-if="company">{{ company.name }}</p>
          </div>
        </div>
        <div v-if="listQuery.searchType === 3" class="row">
          <h4>次数:</h4>
          <div>
            <el-input-number v-model="detail.amount" size="mini" />
          </div>
        </div>
        <div v-else class="row">
          <h4>金额:</h4>
          <div>
            <el-input v-model="detail.amount" size="mini" />
          </div>
        </div>
        <div v-if="listQuery.searchType !== 3" class="row">
          <h4>打款至:</h4>
          <p>账户余额</p>
        </div>
        <div class="row">
          <h4>明细:</h4>
          <div>
            <el-input v-model="detail.remark" size="mini" type="textarea" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="detailVisable = false">取消</el-button>
        <el-button type="primary" @click="handleSuccess">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchCGiftList,
  fetchBGiftList,
  exportCGiftList,
  exportBGiftList,
  addBGift,
  addCGift
} from '@/api/finance'
import moment from 'moment'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
// import { mapGetters } from "vuex";
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchCompanyList, fetchBloggerList } from '@/api/accounts'
// import preview from "./preview";

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
        type: 102,
        searchType: 1,
        searchKey: '',
        statusCode: 0,
        timeRange: []
      },
      status: ['处理中', '等待支付', '成功', '失败', '已拒绝', '已关闭'],
      detailVisable: false,
      detail: {
        amount: 0,
        accountId: '',
        remark: ''
      },
      company: null
    }
  },
  // computed: {
  //   ...mapGetters(["name", "avatar", "telephone"]),
  // },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      if (obj.searchType === 2) {
        obj.blAccountName = obj.searchKey
      } else {
        obj.companyName = obj.searchKey
      }
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[0])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = ''
      }
      obj.type = obj.searchType === 3 ? 107 : 106;
      (obj.searchType === 2 ? fetchCGiftList : fetchBGiftList)(
        clearQueryObject(obj, true)
      )
        .then(({ data }) => {
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
        .catch((e) => {
          console.log('get', e)
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.list = []
      this.getList()
    },
    handleExport() {
      const obj = Object.assign({}, this.listQuery)
      if (obj.searchType === 2) {
        obj.blAccountName = obj.searchKey
      } else {
        obj.companyName = obj.searchKey
      }
      if (obj.timeRange && obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[0])
          .add(1, 'd')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.timeRange = ''
      }
      obj.type = obj.searchType === 3 ? 107 : 106
      window.location.href = (obj.searchType === 2
        ? exportCGiftList
        : exportBGiftList)(clearQueryObject(obj, true))
    },
    handleAdd() {
      this.company = null
      this.detail = {
        amount: 0,
        accountId: '',
        remark: ''
      }
      this.detailVisable = true
    },
    handleAccount() {
      if (this.listQuery.searchType === 2) {
        this.handleBlogger()
      } else {
        this.handleCompany()
      }
    },
    handleBlogger() {
      this.company = null
      fetchBloggerList({
        accountId: this.detail.accountId,
        page: 1,
        size: 1
      }).then((r) => {
        const d = r.data.data[0]
        this.company = d
          ? Object.assign({}, d, { name: d.nickname })
          : { name: '未查询到账户' }
      })
    },
    handleCompany() {
      this.company = null
      fetchCompanyList({
        accountId: this.detail.accountId,
        page: 1,
        size: 1
      }).then((r) => {
        const d = r.data.data[0]
        this.company = d
          ? Object.assign({}, d, { name: d.company })
          : { name: '未查询到账户' }
      })
    },
    handleSuccess() {
      const obj = Object.assign({}, this.detail)
      obj.type = this.listQuery.searchType === 3 ? 107 : 106
      if (!obj.accountId) {
        return this.$message({ message: '请输入账号ID', type: 'error' })
      }
      if (!parseFloat(obj.amount) > 0) {
        return this.$message({
          message:
            '请输入' + (this.listQuery.searchType === 3 ? '次数' : '金额'),
          type: 'error'
        })
      }
      if (!obj.remark) {
        return this.$message({ message: '请输入备注', type: 'error' })
      }
      if (!(this.company && this.company.id)) {
        return this.$message({ message: '请检查账号ID', type: 'error' })
      }
      (this.listQuery.searchType === 2 ? addCGift : addBGift)(
        clearQueryObject(obj, true)
      ).then(() => {
        this.$message({ message: '操作成功', type: 'success' })
        this.detailVisable = false
        this.getList()
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
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
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
