<template>
  <div class="app-container">
    <div class="filter-container">
      <h3 class="filter-item" style="margin-top: 0; line-height: 28px">H5编辑</h3>
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
      <el-table-column label="页面标题" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">编辑</el-button>
          <el-button size="mini" @click="handleDelete(row)">删除</el-button>
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
    <el-dialog width="60%" title="编辑" :visible.sync="detailVisable">
      <div v-if="detail" class="detail">
        <div class="row">
          <h4>页面标题:</h4>
          <div>
            <el-input v-model="detail.title" :maxlength="20" show-word-limit size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>正文内容:</h4>
          <div>
            <Tinymce
              ref="editor"
              v-model="detail.content"
              :upload="conf"
              :height="600"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button
          @click="detailVisable = false"
        >取消</el-button>
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
  fetchWebList,
  fetchWeb,
  createWeb,
  updateWeb,
  removeWeb
} from '@/api/other'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getConf } from '@/api/oss'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ComplexTable',
  components: { Pagination, Tinymce },
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
        size: 20
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
      fetchWebList(clearQueryObject(obj, true)).then(({ data }) => {
        this.list = data.data
        this.total = data.pager.count

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleAdd() {
      this.detail = null
      setTimeout(() => {
        this.detail = {
          title: '',
          content: ''
        }
      }, 0)

      this.detailVisable = true
    },
    handleDetail(row) {
      this.detail = null
      this.detailVisable = true
      fetchWeb(row.id).then(r => {
        this.detail = r.data
      })
    },
    handleDelete(row) {
      removeWeb(row.id).then((r) => {
        this.$message({ message: '操作成功', type: 'success' })
        this.getList()
      })
    },
    handleSuccess() {
      if (!this.detail.title) {
        return this.$message({ message: '请输入名称', type: 'error' })
      }
      if (!this.detail.content) {
        return this.$message({ message: '请输入跳转链接', type: 'error' })
      }
      this.detailLoading = true;
      (this.detail.id ? updateWeb : createWeb)(
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
