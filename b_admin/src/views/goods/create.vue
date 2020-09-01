<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-form-item
          prop="brand"
          style="margin-bottom: 30px;max-width:640px"
          label-width="90px"
          label="商品品牌:"
        >
          <el-select v-model="postForm.brand.id" placeholder="请选择品牌">
            <el-option
              v-for="(item,index) in brandListOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="importUrl" style="margin-bottom: 30px;max-width:640px" label-width="90px" label="商品链接:">
          <el-input v-model="postForm.importUrl" placeholder="请输入淘宝/天猫的售卖链接" />
          <el-button type="text" @click="handleImport">快速导入</el-button>
        </el-form-item>
        <el-form-item prop="price" style="margin-bottom: 30px;max-width:360px" label-width="90px" label="商品价值:">
          <el-input v-model="postForm.price" placeholder="请输入产品价值" />
          <span>元</span>
        </el-form-item>
        <el-form-item prop="title" style="margin-bottom: 30px;max-width:640px" label-width="90px" label="商品名称:">
          <el-input v-model="postForm.title" placeholder="请输入商品名称" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item
          prop="picUrl"
          style="margin-bottom: 30px;max-width:720px"
          label-width="90px"
          label="商品头图:"
        >
          <Upload v-model="postForm.picUrl" />
        </el-form-item>
        <el-form-item
          prop="detail"
          label-width="90px"
          label="商品详情:"
          style="margin-bottom: 30px;max-width:840px"
        >
          <Tinymce ref="editor" v-model="postForm.detail" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import { validURL } from '@/utils/validate'
import { importData } from '@/api/goods'
import { searchUser } from '@/api/remote-search'

const defaultForm = {
  brand: { id: 0 },
  importUrl: '',
  price: '',
  title: '',
  picUrl: '',
  detail: '',
  skuGroups: []
}

export default {
  name: 'ArticleDetail',
  components: {
    Tinymce,
    Upload
  },
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
    // fetchData(id) {
    // fetchArticle(id)
    //   .then((response) => {
    //     this.postForm = response.data

    //     // just for test
    //     this.postForm.title += `   Article Id:${this.postForm.id}`
    //     this.postForm.content_short += `   Article Id:${this.postForm.id}`

    //     // set tagsview title
    //     this.setTagsViewTitle()

    //     // set page title
    //     this.setPageTitle()
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    // },
    handleImport() {
      this.loading = true
      importData({ url: this.postForm.importUrl })
        .then(({ data }) => {
          this.postForm = Object.assign({}, this.postForm, data || {})
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
        })
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
// @import "~@/styles/mixin.scss";
.createPost-container {
  padding: 20px;
  .form-container {
    border-radius: 4px;
    background-color: white;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .el-form-item {
        .el-input {
          width: 80%;
        }
      }

      // .postInfo-container {
      //   position: relative;
      //   @include clearfix;
      //   margin-bottom: 10px;

      //   .postInfo-container-item {
      //     float: left;
      //   }
      // }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
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
