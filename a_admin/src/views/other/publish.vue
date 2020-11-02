<template>
  <div class="app-container">
    <div class="filter-container">
      <h3 class="filter-item" style="margin-top: 0; line-height: 28px">公告</h3>
      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleAdd"
      >新增公告</el-button>
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
      <el-table-column label="排序" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.link }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标记" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.tag }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="90"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleDetail(row)">编辑</el-button>
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
          <h4>公告标题:</h4>
          <div>
            <el-input v-model="detail.content" :maxlength="20" show-word-limit size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>跳转链接:</h4>
          <div>
            <el-input v-model="detail.link" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>轮播排序:</h4>
          <div>
            <el-input-number v-model="detail.sort" size="mini" />
          </div>
        </div>
        <div class="row">
          <h4>标记:</h4>
          <div>
            <el-select v-model="detail.tagId">
              <el-option label="无" :value="0" />
              <el-option label="最新" :value="101" />
              <el-option label="最热" :value="102" />
              <el-option label="重点" :value="103" />
            </el-select>
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
import { fetchNotiList, addNoti, updateNoti, removeNoti } from '@/api/other'
import { clearQueryObject } from '@/utils/index'
import waves from '@/directive/waves' // waves directive
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
        type: 1
      },
      detailVisable: false,
      detail: null,
      detailLoading: false
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
      fetchNotiList(clearQueryObject(obj, true)).then(({ data }) => {
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
        content: '',
        tagId: 0
      }
      this.detailVisable = true
    },
    handleDetail(row) {
      this.detail = row
      this.detailVisable = true
    },
    handleSuccess() {
      if (!this.detail.content) {
        return this.$message({ message: '请输入名称', type: 'error' })
      }
      if (!this.detail.link) {
        return this.$message({ message: '请输入跳转链接', type: 'error' })
      }
      this.detailLoading = true;
      (this.detail.id ? updateNoti : addNoti)(Object.assign({}, this.detail))
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
        removeNoti(this.detail.id)
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
