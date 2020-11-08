<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.searchType"
        size="mini"
        class="filter-item"
        style="width: 100px"
      >
        <el-option :value="1" label="活动ID" />
        <el-option :value="2" label="活动名称" />
        <el-option :value="3" label="活动品牌" />
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
        v-model="listQuery.coopType"
        size="mini"
        class="filter-item"
        style="width: 200px; margin-left: 16px"
      >
        <el-option v-for="(i, j) in coopTypes" :key="j" :value="j" :label="i" />
      </el-select>
      <el-select
        v-model="listQuery.statusCode"
        size="mini"
        class="filter-item"
        style="margin-left: 16px"
      >
        <el-option
          v-for="(item, i) in status"
          :key="i"
          :value="i"
          :label="item"
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
      <el-table-column label="活动ID">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company && row.company.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goods.brandInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合作方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ coopTypes[row.cooperationType] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ status[row.statusCode] }}</span>
          <span v-if="row.statusCode === 3" style="color: #999">
            <br>
            {{ row.rejectReason }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.regStartTime.substr(0, 10) }}</span>
          <br>
          <span>{{ row.regEndTime.substr(0, 10) }}</span>
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
            v-if="row.statusCode === 2 && row.statusCode !== 3"
            type="primary"
            size="mini"
            @click="handleAction(row, 4)"
          >通过</el-button>
          <el-button
            v-if="row.statusCode === 2 && row.statusCode !== 3"
            size="mini"
            @click="handleAction(row, 3)"
          >拒绝</el-button>
          <br v-if="row.statusCode === 2 && row.statusCode !== 3">
          <el-button
            v-if="row.statusCode >= 2 && row.statusCode !== 3"
            size="mini"
            @click="handlePreview(row)"
          >预览</el-button>
          <el-button
            v-if="row.statusCode >= 2 && row.statusCode !== 3"
            size="mini"
            @click="handleDetail(row)"
          >详情</el-button>
          <br v-if="row.statusCode >= 2 && row.statusCode !== 3">
          <el-button
            v-if="row.statusCode === 4 || row.statusCode === 5"
            size="mini"
            type="primary"
            @click="handleAction(row, 6)"
          >关闭</el-button>
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
    <el-dialog width="80%" title="活动详情" :visible.sync="detailVisible">
      <detail
        v-if="detailVisible && detail"
        :id="detail.id + ''"
        ref="detail"
      />
      <div slot="footer">
        <el-button @click="detailVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="detailLoading"
          @click="onSave"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="415px" title="预览" :visible.sync="previewVisible">
      <preview v-if="detail" :item="detail" />
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchActivityList,
  updateActivityState,
  fetchActivity,
  // updateActivity,
  fetchActivityQR
} from '@/api/check'
// import moment from 'moment'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import preview from './components/preview'
import detail from './components/detail'

export default {
  name: 'ComplexTable',
  components: { Pagination, preview, detail },
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
        statusCode: 2,
        coopType: 0
      },
      status: [
        '全部',
        '待提交',
        '待排期',
        '已拒绝',
        '未开始',
        '报名中',
        '报名结束'
      ],
      coopTypes: ['全部', '接受悬赏', '接受悬赏/达人报价', '免费置换'],
      detailVisible: false,
      detailLoading: false,
      detail: null,
      previewVisible: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'telephone'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const obj = Object.assign({}, this.listQuery)
      obj[['', 'brActivityId', 'title', 'brandName'][obj.searchType]] =
        obj.searchKey
      fetchActivityList(clearQueryObject(obj, true)).then(({ data }) => {
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

    handlePreview(row) {
      this.detail = null
      this.previewVisible = true
      this.loadDetail(row.id)
      // this.loadQR(row.id)
    },
    handleAction(row, state) {
      if (state === 4) {
        this.$confirm('确认通过?').then((r) => {
          updateActivityState({ id: row.id, statusCode: state }).then((r) => {
            row.statusCode = state
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      } else {
        this.$prompt(state === 6 ? '请输入关闭理由' : '请输入拒绝理由', {
          inputPlaceholder:
            state === 6 ? '关闭理由,最多200字' : '拒绝理由,最多200字',
          inputValidator: (s) => {
            return s && s.length <= 200
          },
          beforeClose: (action, instance, done) => {
            if (action === 'confirm' && !instance.inputValue) {
              this.$message({
                message: state === 6 ? '请输入关闭理由' : '请输入拒绝理由',
                type: 'error'
              })
            } else {
              done()
            }
          }
        }).then((r) => {
          updateActivityState({
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
    handleDetail(row) {
      this.detail = row
      this.detailVisible = true
    },
    onSave() {
      this.detailLoading = true
      this.$refs.detail
        .submitForm()
        .then((r) => {
          this.detailLoading = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch((e) => {
          this.detailLoading = false
        })
    },
    loadDetail(id) {
      fetchActivity(id).then((r) => {
        r.data.date = [r.data.regStartTime, r.data.regEndTime]
        r.data.guideList = r.data.guidelines.map((i) => ({ txt: i }))
        r.data.displayType = r.data.displayType === 1
        r.data.otherReq = r.data.otherReq
          ? r.data.otherReq.split('+').map(
            (i) =>
              ({
                1: '产品和达人同框露脸',
                2: '使用前后效果对比',
                3: '提供评测原图使用权'
              }[i])
          )
          : ''
        this.detail = r.data
      })
    },
    loadQR(id) {
      fetchActivityQR(id).then((r) => {
        this.previewQR = r.data ? 'data:image/png;base64,' + r.data : ''
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
  }
}
</style>
