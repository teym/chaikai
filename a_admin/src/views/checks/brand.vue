<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.companyName"
        placeholder="请输入企业名称"
        style="width: 200px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="请输入品牌名称"
        style="width: 200px; margin-left: 16px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <el-table-column label="企业名称">
        <template slot-scope="{ row }">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template slot-scope="{ row }">
          <img style="width: 40px; height: 40px" :src="row.logo" alt="log">
        </template>
      </el-table-column>
      <el-table-column label="品牌故事" align="center">
        <template slot-scope="{ row }">
          <el-popover
            placement="bottom"
            title="品牌故事"
            width="400"
            trigger="click"
            :content="row.story"
          >
            <p
              slot="reference"
              style="
                height: 23px;
                overflow: hidden;
                word-break: keep-all;
                text-overflow: ellipsis;
                margin: 0;
              "
            >
              {{ row.story }}
            </p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商标证书" align="center">
        <template slot-scope="{ row }">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.trademarkRegistrations[0]"
            :preview-src-list="row.trademarkRegistrations"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌关系" align="center">
        <template slot-scope="{ row }">
          <span>{{ { "1": "品牌方", "2": "代理商" }[row.relationType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌授权资质" align="center">
        <template slot-scope="{ row }">
          <el-image
            v-if="
              row.relationType === '2' &&
                row.qualifications &&
                row.qualifications.length > 0
            "
            style="width: 60px; height: 60px"
            :src="row.qualifications[0]"
            :preview-src-list="row.qualifications"
          />
          <span v-else>无</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
          <span v-if="row.statusCode === 4"><br>{{ row.rejectReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.statusCode === 2"
            type="primary"
            size="mini"
            @click="handleAction(row, 3)"
          >通过</el-button>
          <el-button
            v-if="row.statusCode === 2"
            size="mini"
            @click="handleAction(row, 4)"
          >拒绝</el-button>
          <el-button
            v-if="row.statusCode === 2"
            size="mini"
            @click="handleDetail(row)"
          >企业信息</el-button>
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
      width="60%"
      title="企业详情"
      :visible.sync="detailVisable"
      append-to-body
    >
      <detail :detail="detail" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchBrandList, updateBrandState } from '@/api/check'
import { fetchCompanyList } from '@/api/accounts'

import { clearQueryObject } from '@/utils/index'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import detail from '../accounts/components/company'

export default {
  name: 'ComplexTable',
  components: { Pagination, detail },
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
        companyName: undefined,
        statusCode: 2
      },
      status: ['全部', '未认证', '审核中', '已通过', '已拒绝'],
      detailVisable: false,
      detail: null
    }
  },
  computed: {
    stateOp() {
      return this.status
        .map((i, j) => ({ v: j, l: i }))
        .filter((i) => i.v !== 1)
    },
    ...mapGetters(['name', 'avatar', 'telephone'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchBrandList(clearQueryObject(this.listQuery, true)).then(
        ({ data }) => {
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
        }
      )
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAction(row, state) {
      if (state === 3) {
        this.$confirm('确认通过?').then((r) => {
          updateBrandState({ id: row.id, statusCode: state }).then((r) => {
            row.statusCode = state
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      } else {
        this.$prompt('请输入拒绝理由', {
          inputPlaceholder: '拒绝理由,最多200字',
          inputType: 'textarea',
          inputValidator: (s) => {
            return s && s.length <= 200
          },
          beforeClose: (action, instance, done) => {
            if (action === 'confirm' && !instance.inputValue) {
              this.$message({ message: '请输入拒绝理由', type: 'error' })
            } else {
              done()
            }
          }
        }).then((r) => {
          updateBrandState({
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
      this.detail = null
      this.detailVisable = true
      fetchCompanyList({ page: 1, size: 1, accountId: item.brAccountId }).then(
        (r) => {
          const d = r.data.data[0] || {}
          d.brands = (d.brands || []).map((i) =>
            Object.assign(
              { date: moment(i.gmtCreate).format('YYYY-MM-DD HH:mm:ss') },
              i
            )
          )
          d.date = moment(d.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
          this.detail = d
        }
      )
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
