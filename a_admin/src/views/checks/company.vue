<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入企业名称"
        style="width: 200px"
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
      <el-table-column label="账号ID|企业名称">
        <template slot-scope="{ row }">
          <span>{{ row.account.id }}</span><br>
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.account.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contactWechat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.creditCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业执照" align="center">
        <template slot-scope="{ row }">
          <p @click="handlePreview(row)">查看</p>
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
        label="操作"
        align="center"
        width="160"
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
import { fetchCompanyList, updateCompanyState } from '@/api/check'
import { clearQueryObject } from '@/utils/index'
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
        name: undefined,
        statusCode: 2
      },
      status: ['全部', '未认证', '审核中', '已通过', '已拒绝'],
      preview: false,
      previewUrl: ''
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
      fetchCompanyList(clearQueryObject(this.listQuery, true)).then(
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

    handlePreview(row) {
      this.previewUrl = row.businessLicense
      this.preview = true
    },
    handleAction(row, state) {
      if (state === 3) {
        this.$confirm('确认通过?').then((r) => {
          updateCompanyState({ id: row.id, statusCode: state }).then((r) => {
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
          inputErrorMessage: '已超出最长输入长度200个字',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm' && !instance.inputValue) {
              this.$message({ message: '请输入拒绝理由', type: 'error' })
            } else {
              done()
            }
          }
        }).then((r) => {
          updateCompanyState({
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
