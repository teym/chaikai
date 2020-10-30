<template>
  <div class="app-container">
    <div class="filter-container">
      <h3 class="filter-item" style="margin-top: 0; line-height: 28px">插图</h3>
      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleAdd"
      >新增插图</el-button>
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
      <el-table-column label="插图" align="center" style="width: 160">
        <template slot-scope="{ row }">
          <img style="width: 150px; height: 80px" :src="row.url">
        </template>
      </el-table-column>
      <el-table-column label="插图名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.link }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动ID" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.exIds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轮播开关" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.valid ? "开" : "关" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button size="mini" @click="handleState(row)">{{
            !row.valid ? "开" : "关"
          }}</el-button>
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
    <el-dialog width="60%" title="详情" :visible.sync="detailVisable">
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>插图:</h4>
          <div>
            <Upload
              v-model="detail.url"
              :url="conf.url"
              :headers="conf.headers"
              :count="7"
              :limit="conf.limit"
              tip="702*128像素，支持PNG,JPG格式，小于5M"
            />
          </div>
        </div>
        <div class="row">
          <h4>插图名称:</h4>
          <div>
            <el-input v-model="detail.title" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>跳转链接:</h4>
          <div>
            <el-input v-model="detail.link" size="mini">
              <el-select
                slot="prepend"
                v-model="detail.linkType"
                style="width: 96px"
              >
                <el-option label="小程序" :value="1" />
                <el-option label="外部URL" :value="2" />
              </el-select>
            </el-input>
          </div>
        </div>
        <div class="row">
          <h4>活动ID:</h4>
          <div>
            <el-input
              v-model="detail.exIds"
              size="mini"
              placeholder="多个ID用,拼接"
            />
          </div>
        </div>
        <div class="row">
          <h4>插图开关:</h4>
          <div>
            <el-switch
              v-model="detail.valid"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button
          :loading="detailLoading"
          @click="handleClose"
        >删除</el-button>
        <el-button
          :loading="detailLoading"
          type="primary"
          @click="handleSuccess"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchBannerList,
  addBanner,
  updateBanner,
  removeBanner
} from '@/api/other'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Upload from '@/components/Upload/SingleImage3'
import { getConf } from '@/api/oss'

export default {
  name: 'ComplexTable',
  components: { Pagination, Upload },
  directives: { waves },
  data() {
    const upload = getConf()

    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        type: 2
      },
      detailVisable: false,
      detail: null,
      detailLoading: false,
      conf: {
        url: upload.url,
        headers: upload.headers,
        limit: {
          type: {
            list: ['image/png', 'image/jpg', 'image/jpeg'],
            tip: '请上传png/jpg格式的图片'
          },
          size: {
            size: 5 * 1024 * 1024,
            tip: '请上传小于5M的图片'
          }
        }
      }
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
      fetchBannerList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data
        this.total = data.length

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleAdd() {
      this.detail = {
        link: '',
        linkType: 1,
        sort: 1,
        title: '',
        url: '',
        type: 2,
        exIds: '',
        valid: true
      }
      this.detailVisable = true
    },
    handleDetail(row) {
      this.detail = row
      this.detailVisable = true
    },
    handleState(row) {
      updateBanner(Object.assign({}, row, { valid: !row.valid })).then((r) => {
        row.valid = !row.valid
      })
    },
    handleSuccess() {
      if (!this.detail.url) {
        return this.$message({ message: '请上传轮播图', type: 'error' })
      }
      if (!this.detail.title) {
        return this.$message({ message: '请输入名称', type: 'error' })
      }
      if (!this.detail.link) {
        return this.$message({ message: '请输入跳转链接', type: 'error' })
      }
      if (!this.detail.exIds) {
        return this.$message({ message: '请输入活动ID', type: 'error' })
      }
      this.detailLoading = true;
      (this.detail.id ? updateBanner : addBanner)(
        Object.assign({}, this.detail)
      )
        .then((r) => {
          this.detailVisable = false
          this.detailLoading = false
          this.$message({ message: '操作成功', type: 'success' })
          this.getList()
        })
        .catch((e) => {
          this.detailLoading = false
        })
    },
    handleClose() {
      if (this.detail.id) {
        this.detailLoading = true
        removeBanner(this.detail.id)
          .then((r) => {
            this.detailLoading = false
            this.detailVisable = false
            this.$message({ message: '操作成功', type: 'success' })
            this.getList()
          })
          .catch((e) => {
            this.detailLoading = false
          })
      } else {
        this.detailVisable = false
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
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
    > div {
      flex: 1;
    }
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
