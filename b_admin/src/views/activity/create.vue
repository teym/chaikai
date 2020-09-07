<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="活动商品:">
          <el-button icon="el-icon-plus" @click="handleSelectGoods">选择商品</el-button>
        </el-form-item>
        <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="商品规格:">
          <el-input v-model="postForm.sku" placeholder="活动规格" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="活动名称:">
          <el-input v-model="postForm.title" placeholder="活动名称" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="报名时间:">
          <el-input v-model="postForm.regStartTime" placeholder="报名时间" />
          <el-input v-model="postForm.regEndTime" placeholder="报名时间" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="活动名额:">
          <el-input v-model="postForm.totalNum" placeholder="活动名额" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="测评指引:">
          <el-input
            v-for="(line, i) in postForm.guidelines"
            :key="i"
            v-model="line.txt"
            placeholder="请输入测评指引"
            maxlength="10"
            show-word-limit
          />
          <el-button>add guide</el-button>
        </el-form-item>
      </div>
      <div class="createPost-main-container">
        <p>活动设置</p>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="私密活动:">
          <el-input v-model="postForm.link" placeholder="私密活动" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="收货地限制:">
          <el-input v-model="postForm.link" placeholder="收货地限制" />
        </el-form-item>
      </div>
      <div class="createPost-main-container">
        <p>合作任务</p>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="报名渠道:">
          <el-input v-model="postForm.link" placeholder="私密活动" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="合作方式:">
          <el-input v-model="postForm.link" placeholder="收货地限制" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="合作要求:">
          <el-input v-model="postForm.link" placeholder="收货地限制" />
        </el-form-item>
      </div>
      <div>
        <el-button>取消</el-button>
        <el-button>保存</el-button>
        <el-button>提交审核</el-button>
      </div>
    </el-form>
    <el-dialog custom-class="goods" title="选择活动商品" :visible.sync="goodsFormVisible">
      <div slot="title">
        <el-form :inline="true">
          <el-form-item label="选择活动商品">
            <el-input v-model="goods.key" placeholder="请输入商品名称" @keypress.enter="handleFilter" />
          </el-form-item>
        </el-form>
      </div>
      <el-row :gutter="20" justify="center" :loading="goods.loading">
        <el-col v-for="(g, i) in goods.list" :key="i" :span="4">
          <img :src="g.picUrl" alt="pic">
          <p>{{ g.title }}</p>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validURL } from '@/utils/validate'
import { fetchData, fetchPv } from '@/api/activities'

const defaultForm = {
  brand: 'draft',
  link: '',
  price: '',
  name: '',
  image_uri: '',
  content: ''
}

export default {
  name: 'ArticleDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      brandListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      goodsFormVisible: false,
      goods: {
        page: 0,
        list: [],
        loading: false,
        total: 0,
        key: ''
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      fetchData(id)
        .then((response) => {
          this.postForm = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    fetchPv(page) {
      this.goods.loading = true
      fetchPv({ page, size: 10 }).then((r) => {
        this.goods = {
          page,
          total: r.data.pager.count,
          list: r.data.data,
          loading: false
        }
      })
    },
    handleSelectGoods() {
      this.goodsFormVisible = true
      if (this.goods.page === 0) {
        this.fetchPv(1)
      }
    },
    handleFilter() {
      this.fetchPv(1)
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  max-width: 960px;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.goods {
  .el-dialog__header{
    padding-bottom: 0;
  }
  .el-row {
    .el-col {
      background-color: #f2f3f7;
      border-radius: 4px;
      text-align: center;
      img {
        width: 94%;
        height: auto;
        max-height: 120px;
      }
      p {
        text-align: center;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
