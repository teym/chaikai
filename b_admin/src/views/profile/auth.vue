<template>
  <div class="create-container">
    <div v-if="tip" class="tip">
      <div>
        <img src="@/assets/images/user_done.png" alt="done">
        <h1>已提交和审核</h1>
        <p>
          审核通过后，将通过短信进行通知
          <br>为加快小二审核效率，
          <router-link :to="{path:'/user/auth'}">请完成最后一步品牌授权</router-link>，即可招募博主
        </p>
        <el-button size="mini">新增品牌授权</el-button>
      </div>
    </div>
    <el-form
      v-else
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-width="130px"
    >
      <div class="createPost-main-container">
        <el-form-item label="品牌名称:" prop="name">
          <el-input v-model="postForm.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item prop="logo" style="margin-bottom: 30px;" label="品牌LOGO:">
          <Upload v-model="postForm.logo" />
        </el-form-item>
        <el-form-item label="品牌故事:" prop="story">
          <el-input
            v-model="postForm.story"
            type="textarea"
            placeholder="请输入您的品牌故事，帮助博主和粉丝更好了解贵品牌"
          />
        </el-form-item>
        <el-form-item prop="trademarkRegistration" style="margin-bottom: 30px;" label="商标注册书:">
          <Upload v-model="postForm.trademarkRegistration" />
        </el-form-item>
        <el-form-item label="品牌关系:" prop="relationType">
          <el-radio-group v-model="postForm.relationType">
            <el-radio :label="'1'">品牌方</el-radio>
            <el-radio :label="'2'">代理商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="postForm.relationType === '2'"
          prop="qualification"
          style="margin-bottom: 30px;"
          label="品牌授权资质:"
        >
          <Upload v-model="postForm.qualification" />
        </el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm">提交审核</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage3'
import { validURL } from '@/utils/validate'
import { fetchPv, createPv, submitPv } from '@/api/goods'

const defaultForm = {
  name: '',
  logo:
    'https://gd2.alicdn.com/imgextra/i1/831279688/TB2HmVucrsTMeJjy1zbXXchlVXa_!!831279688.jpg_400x400.jpg',
  story: '',
  trademarkRegistration:
    'https://gd2.alicdn.com/imgextra/i1/831279688/TB2HmVucrsTMeJjy1zbXXchlVXa_!!831279688.jpg_400x400.jpg',
  qualification:
    'https://gd2.alicdn.com/imgextra/i1/831279688/TB2HmVucrsTMeJjy1zbXXchlVXa_!!831279688.jpg_400x400.jpg',
  relationType: '1'
}

export default {
  name: 'ArticleDetail',
  components: {
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
      if (validURL(value)) {
        callback()
      } else {
        this.$message({
          message: '外链url填写不正确',
          type: 'error'
        })
        callback(new Error('外链url填写不正确'))
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      tip: false,
      rules: {
        name: [{ validator: validateRequire }],
        story: [{}],
        relationType: [{ validator: validateRequire }],
        logo: [{ validator: validateSourceUri }],
        trademarkRegistration: [{ validator: validateSourceUri }],
        qualification: [{ validator: validateSourceUri }]
      }
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchPv({ id, page: 1, size: 1 })
        .then((response) => {
          this.postForm = response.data.data[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const id = this.$route.params && this.$route.params.id

          if (!id) {
            createPv(Object.assign({}, this.postForm))
              .then((r) => {
                this.loading = false
                this.tip = true
              })
              .catch((e) => {
                this.loading = false
              })
          } else {
            submitPv(Object.assign({}, this.postForm))
              .then((r) => {
                this.loading = false
                this.tip = true
              })
              .catch((e) => {
                this.loading = false
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.create-container {
  background-color: white;
  margin: 20px;
  border-radius: 4px;
  padding: 20px;
  .el-form {
    width: 50%;

    .el-button {
      margin-left: 130px;
    }
  }
  .tip {
    width: 100%;
    padding: 96px 0;
    text-align: center;
    img {
      width: 64px;
    }
    h1 {
      margin: 12px 0;
      padding: 0;
      font-size: 28px;
    }
    p {
      margin: 8px 0;
      padding: 0;
      line-height: 1.5;
      font-size: 14px;
      a {
        color: #4244ff;
        text-decoration: underline;
      }
    }
    .el-button {
      margin: 8px 0;
    }
  }
}
</style>
