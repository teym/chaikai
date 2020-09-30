<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="活动商品:">
          <el-select v-model="postForm.brand" placeholder="请选择活动商品">
            <el-option
              v-for="(item,index) in brandListOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="活动规格:">
          <el-select v-model="postForm.brand" placeholder="请选择商品规格">
            <el-option
              v-for="(item,index) in brandListOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="活动名称:">
          <el-input v-model="postForm.link" placeholder="活动名称" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="报名时间:">
          <el-input v-model="postForm.price" placeholder="报名时间" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="活动名额:">
          <el-input v-model="postForm.price" placeholder="活动名额" />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="90px" label="测评指引:">
          <el-input v-model="postForm.name" placeholder="请输入测评指引" maxlength="10" show-word-limit />
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
  </div>
</template>

<script>
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'

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
      tempRoute: {}
    }
  },
  computed: {
    displayTime: {
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then((response) => {
          this.postForm = response.data

          // just for test
          this.postForm.title += `   Article Id:${this.postForm.id}`
          this.postForm.content_short += `   Article Id:${this.postForm.id}`

          // set tagsview title
          this.setTagsViewTitle()

          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
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
    },
    getRemoteUserList(query) {
      searchUser(query).then((response) => {
        if (!response.data.items) return
        this.brandListOptions = response.data.items.map((v) => v.name)
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

.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
