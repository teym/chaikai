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
          <span v-if="row.statusCode === 4">
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
            v-if="row.statusCode === 2"
            type="primary"
            size="mini"
            @click="handleAction(row, 4)"
          >通过</el-button>
          <el-button
            v-if="row.statusCode === 2"
            size="mini"
            @click="handleAction(row, 3)"
          >拒绝</el-button>
          <br v-if="row.statusCode === 2">
          <el-button
            v-if="row.statusCode >= 2"
            size="mini"
            @click="handlePreview(row)"
          >预览</el-button>
          <el-button
            v-if="row.statusCode >= 2"
            size="mini"
            @click="handleDetail(row)"
          >详情</el-button>
          <br v-if="row.statusCode >= 2">
          <el-button
            v-if="row.statusCode === 45"
            size="mini"
            type="primary"
            @click="handleAction(row, 5)"
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
    <el-dialog width="60%" title="活动详情" :visible.sync="detailVisible">
      <div v-if="detail" class="detail">
        <h3>基本信息</h3>
        <div class="row">
          <h4>活动ID:</h4>
          <p>{{ detail.id }}</p>
        </div>
        <div class="row">
          <h4>活动名称:</h4>
          <div>
            <el-input v-model="detail.title" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>报名时间:</h4>
          <div>
            <el-date-picker
              v-model="detail.date"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
        <div class="row">
          <h4>活动名额:</h4>
          <p>{{ detail.totalNum }}</p>
        </div>
        <div class="row">
          <h4>活动商品:</h4>
          <p>{{ detail.goods.title }}</p>
        </div>
        <div class="row">
          <h4>活动规格:</h4>
          <p>{{ detail.goods.skuUnionList.map((i) => i.name).join(", ") }}</p>
        </div>
        <div class="row">
          <h4>测评指引:</h4>
          <div>
            <el-input
              v-for="(l, j) in detail.guideList"
              :key="j"
              v-model="l.txt"
              size="mini"
            >
              <el-button
                slot="append"
                size="mini"
                icon="el-icon-delete"
                @click="detail.guideList.splice(j, 1)"
              >删除</el-button>
            </el-input>
            <el-button
              size="mini"
              icon="el-icon-add"
              @click="
                detail.guideList.splice(detail.guideList.length, 0, { txt: '' })
              "
            >添加</el-button>
          </div>
        </div>
        <h3>活动设置</h3>
        <div class="row">
          <h4>私密活动:</h4>
          <el-checkbox :checked="detail.displayType" label="" />
        </div>
        <div class="row">
          <h4>收货地限制:</h4>
          <div>
            <el-checkbox
              :checked="detail.extension.receiveAreaLimit"
              label=""
            />
            <div v-if="detail.extension.receiveAreaLimit">
              <p>
                {{
                  detail.extension.receiveAreas[0].type === 1
                    ? "不可收货"
                    : "可收货"
                }}
              </p>
              <p>
                {{
                  detail.extension.receiveAreas
                    .map((i) => (i.province || "") + (i.city || ""))
                    .join(", ")
                }}
              </p>
            </div>
          </div>
        </div>
        <h3>合作任务</h3>
        <div class="row">
          <h4>报名渠道:</h4>
          <p>
            {{
              detail.extension.channels.map((i) => i.platformName).join(", ")
            }}
          </p>
        </div>
        <div class="row">
          <h4>合作方式</h4>
          <p>{{ coopTypes[detail.cooperationType] }}</p>
        </div>
        <div class="row">
          <h4>悬赏要求</h4>
          <div>
            <div class="row">
              <h6>合作篇幅</h6>
              <p>{{ detail.extension.articleType > 0 ? "单篇" : "无要求" }}</p>
            </div>
            <div class="row">
              <h6>内容形式</h6>
              <p>
                {{ ["无要求", "图文", "视频"][detail.extension.contentType] }}
              </p>
            </div>
            <div class="row">
              <h6>最低字数</h6>
              <p>
                {{ ["无要求", "200字", "400字"][detail.extension.minWordNum] }}
              </p>
            </div>
            <div class="row">
              <h6>最低图片数</h6>
              <p>{{ ["无要求", "6张", "9张"][detail.extension.minPicNum] }}</p>
            </div>
            <div class="row">
              <h6>最低视频时长</h6>
              <p>
                {{
                  ["无要求", "15秒", "30秒", "1分钟", "2分钟"][
                    detail.extension.minVideoLength
                  ]
                }}
              </p>
            </div>
            <div class="row">
              <h6>账号话题</h6>
              <div>
                <p v-for="(c, i) in detail.extension.channels" :key="i">
                  {{ c.platformName }}@{{ c.nickname }}#{{ c.topic }}
                </p>
              </div>
            </div>
            <div v-if="detail.extension.discountInfo" class="row">
              <h6>优惠信息</h6>
              <p>{{ detail.extension.discountInfo }}</p>
            </div>
            <div v-if="detail.extension.keywords" class="row">
              <h6>附带关键词</h6>
              <p>{{ detail.extension.keywords }}</p>
            </div>
            <div v-if="detail.extension.length > 0" class="row">
              <h6>其他要求</h6>
              <div>
                <p v-for="(o, i) in detail.extension.otherReq" :key="i">
                  {{ o }}
                </p>
              </div>
            </div>
            <div class="row">
              <h6>悬赏金额</h6>
              <p>{{ detail.reward }}元/人</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="detailVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">确定</el-button>
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
  updateActivity,
  fetchActivityQR
} from '@/api/check'
import moment from 'moment'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import preview from './preview'

export default {
  name: 'ComplexTable',
  components: { Pagination, preview },
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
        statusCode: 0,
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
      if (state === 4 || state === 6) {
        this.$confirm(state === 4 ? '确认通过?' : '确认关闭?').then((r) => {
          updateActivityState({ id: row.id, statusCode: state }).then((r) => {
            row.statusCode = state
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      } else {
        this.$prompt('请输入拒绝理由').then((r) => {
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
      this.detail = null
      this.detailVisible = true
      this.loadDetail(row.id)
    },
    loadQR(id) {
      fetchActivityQR(id).then((r) => {
        this.previewQR = r.data ? 'data:image/png;base64,' + r.data : ''
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
    onSave() {
      const obj = Object.assign({}, this.detail)
      obj.guidelines = obj.guideList.map((i) => i.txt)
      obj.regStartTime = moment(obj.date[0]).format('YYYY-MM-DD 00:00:00')
      obj.regEndTime = moment(obj.date[1]).format('YYYY-MM-DD 00:00:00')
      updateActivity(obj).then((r) => {
        this.$message({ message: '修改成功', type: 'success' })
        this.detailVisible = false
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
