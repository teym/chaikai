<template>
  <div>
    <div v-if="detail" class="detail">
      <el-row>
        <el-col :span="12">
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
        </el-col>
        <el-col :span="12">
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
        </el-col>
      </el-row>

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
  </div>
</template>

<script>
import { unbindCompany } from '@/api/accounts'

export default {
  name: 'ComplexTable',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      status: ['全部', '未认证', '审核中', '已认证', '已拒绝'],
      previewVisable: false,
      preview: ''
    }
  },
  created() {},
  methods: {
    onPreview(url) {
      this.preview = url
      this.previewVisable = true
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
