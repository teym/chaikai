<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 96px"
      >
        <el-option :value="1" label="手机号" />
        <el-option :value="2" label="账户ID" />
        <el-option :value="3" label="企业名称" />
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
        v-model="listQuery.companyStatus"
        size="mini"
        class="filter-item"
        style="width: 90px; margin-left: 16px"
      >
        <el-option
          v-for="(item, i) in status"
          :key="i"
          :value="i"
          :label="item"
        />
      </el-select>

      <el-date-picker
        v-model="listQuery.timeRange"
        size="mini"
        class="filter-item"
        style="margin-left: 16px"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />

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
      <el-table-column label="账号ID|企业名称">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
          <br>
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证情况" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.companyInfo.statusCode] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权品牌" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.brands.map((i) => i.name).join("|") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.financeInfo.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="置换活动" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.financeInfo.activityAmount }}次</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
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
    <el-dialog
      width="80%"
      title="达人详情"
      :visible.sync="detailVisable"
      append-to-body
    >
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>账户ID:</h4>
          <p>{{ detail.id }}</p>
        </div>
        <div class="row">
          <h4>手机号:</h4>
          <p>{{ detail.telephone }}</p>
        </div>
        <div class="row">
          <h4>注册时间:</h4>
          <p>{{ detail.date }}</p>
        </div>
        <div class="row">
          <h4>企业名称:</h4>
          <p>{{ detail.company }}</p>
        </div>
        <div class="row">
          <h4>统一社会信用代码:</h4>
          <p>{{ detail.companyInfo.creditCode }}</p>
        </div>
        <div class="row">
          <h4>营业执照:</h4>
          <div>
            <el-button
              size="mini"
              @click="onPreview(detail.companyInfo.businessLicense)"
            >查看</el-button>
          </div>
        </div>
        <div class="row">
          <h4>联系人:</h4>
          <p>{{ detail.companyInfo.contact }}</p>
        </div>
        <div class="row">
          <h4>微信号:</h4>
          <p>{{ detail.companyInfo.contactWechat }}</p>
        </div>
        <div class="row">
          <h4>企业认证:</h4>
          <p>{{ status[detail.companyInfo.statusCode] }}</p>
        </div>
        <div class="row">
          <h4>账户余额:</h4>
          <p>{{ detail.financeInfo.totalAmount }}</p>
        </div>
        <div class="row">
          <h4>置换活动:</h4>
          <p>{{ detail.financeInfo.activityAmount }}</p>
        </div>
        <h4>品牌授权</h4>
        <el-table :data="detail.brands" border fit>
          <el-table-column label="品牌名称" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="品牌LOGO" width="90" align="center">
            <template slot-scope="{ row }">
              <img :src="row.logo" style="width: 60px; height: 60px">
            </template>
          </el-table-column>
          <el-table-column label="品牌故事">
            <template slot-scope="{ row }">
              <span>{{ row.story }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商标证书" align="center">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                @click="onPreview(row.trademarkRegistration)"
              >查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="品牌关系" align="center">
            <template slot-scope="{ row }">
              <span>{{
                { "1": "品牌方", "2": "代理商" }[row.relationType]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="品牌授权资质" align="center">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.qualification"
                size="mini"
                @click="onPreview(row.qualification)"
              >查看</el-button>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="通过时间">
            <template slot-scope="{ row }">
              <span>{{ row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button size="mini" @click="onUnbind(row)">删除</el-button>
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
    </el-dialog>
  </div>
</template>

<script>
import { fetchCompanyList, unbindCompany } from '@/api/accounts'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import moment from 'moment'
// import { mapGetters } from 'vuex'
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
        companyStatus: 3,
        timeRange: []
      },
      status: ['全部', '未认证', '审核中', '已认证', '已拒绝'],
      detailVisable: false,
      detail: null,
      previewVisable: false,
      preview: ''
    }
  },
  // computed: {
  //   ...mapGetters(['name', 'avatar', 'telephone'])
  // },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[
        ['key', 'telephone', 'accountId', 'companyName'][
          this.listQuery.searchType
        ]
      ] = obj.searchKey
      if (obj.timeRange.length > 0) {
        obj.startTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.endTime = moment(this.listQuery.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        obj.timeRange = ''
      }
      fetchCompanyList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data.data.map((i) =>
          Object.assign(i, {
            date: moment(i.companyInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
            brands: (i.brands || []).map((i) =>
              Object.assign(i, {
                date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
              })
            )
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

    onPreview(url) {
      this.preview = url
      this.previewVisable = true
    },
    handleDetail(row) {
      this.detail = row
      this.detailVisable = true
    },
    onUnbind(row) {
      this.$confirm(
        `确定删除${this.detail.company}的${row.name}品牌名称，删除后需重新提交认证申请`
      ).then((r) => {
        unbindCompany(row.id).then((r) => {
          const index = this.detail.brands.findIndex(
            (i) => i.platformId === row.platformId
          )
          if (index >= 0) {
            this.detail.brands.splice(index, 1)
          }
        })
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
    margin-top: 4px;
    h4 {
      width: 128px;
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
