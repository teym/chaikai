<template>
  <div class="create-container">
    <div v-if="done" class="tip">
      <div>
        <img src="@/assets/images/user_done.png" alt="done" />
        <h1>已提交和审核</h1>
        <p>审核通过后，将通过短信进行通知</p>
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
          <el-input
            style="width: 320px"
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            :maxlength="50"
            show-word-limit
            v-model="postForm.name"
            placeholder="请输入品牌名称"
          />
        </el-form-item>
        <el-form-item prop="logo" style="margin-bottom: 30px" label="品牌LOGO:">
          <UploadS
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            :url="conf.url"
            :headers="conf.headers"
            :limit="conf.limit"
            v-model="postForm.logo"
            tip="最低尺寸要求: 18像素 x 18像素 请上传小于5M的图片, 支持图片格式: png, jpg"
          />
        </el-form-item>
        <el-form-item label="品牌故事:" prop="story">
          <el-input
            style="width: 320px"
            size="middle"
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            v-model="postForm.story"
            type="textarea"
            :maxlength="300"
            show-word-limit
            placeholder="请输入您的品牌故事，帮助达人和粉丝更好了解贵品牌"
          />
        </el-form-item>
        <el-form-item
          prop="trademarkRegistrations"
          style="margin-bottom: 30px"
          label="商标注册书:"
        >
          <Upload
            key="1"
            ref="upload1"
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            :url="conf.url"
            :headers="conf.headers"
            :count="5"
            :limit="conf.limit"
            v-model="postForm.trademarkRegistrations"
            tip="请上传小于5M的图片，支持图片格式：jpg,jpeg,png"
          />
          <p>若办理过变更、转让、续展，请一并提供商标总局颁发变更受理通知书</p>
        </el-form-item>
        <el-form-item label="品牌关系:" prop="relationType">
          <el-radio-group
            v-model="postForm.relationType"
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            @change="onType"
          >
            <el-radio :label="'1'">品牌方</el-radio>
            <el-radio :label="'2'">代理商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="postForm.relationType === '2'"
          prop="qualifications"
          style="margin-bottom: 30px"
          label="品牌授权资质:"
        >
          <Upload
            key="2"
            ref="upload2"
            :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
            :url="conf.url"
            :headers="conf.headers"
            :count="5"
            :limit="conf.limit"
            v-model="postForm.qualifications"
            tip="请上传小于5M的图片，支持图片格式：jpg,jpeg,png"
          />
        </el-form-item>

        <el-form-item label="" v-if="postForm.statusCode == 4">
          <div class="reason">{{ postForm.rejectReason }}</div>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          :disabled="postForm.statusCode === 3 || postForm.statusCode === 2"
          @click="submitForm"
          >{{
            ["", "提交审核", "审核中", "已认证", "提交审核"][
              postForm.statusCode || 1
            ]
          }}</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import UploadS from "@/components/Upload/SingleImage3";
import Upload from "@/components/Upload/SingleImage2";
import { validURL } from "@/utils/validate";
import _ from "underscore";
import { getPv, createPv, updatePv, submitPv } from "@/api/goods";
import { getConf } from "@/api/oss";

const defaultForm = () => ({
  name: "",
  logo: "",
  story: "",
  trademarkRegistration: "",
  qualification: "",
  trademarkRegistrations: [],
  qualifications: [],
  relationType: "1",
});

export default {
  name: "ArticleDetail",
  components: {
    Upload,
    UploadS,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (!value || value.length <= 0) {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请填写" + rule.name,
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请填写" + rule.name));
      } else {
        callback();
      }
    };
    const validateQRequire = (rule, value, callback) => {
      if (this.postForm.relationType === "2" && (!value || value.length <= 0)) {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请填写" + rule.name,
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请填写" + rule.name));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (validURL(value)) {
        callback();
      } else {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请上传" + rule.name,
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请上传" + rule.name));
      }
    };
    const upload = getConf();
    return {
      postForm: defaultForm(),
      loading: false,
      done: false,
      tip: 0,
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: validateRequire,
            name: "品牌名称",
          },
        ],
        story: [
          {
            required: true,
            trigger: "blur",
            validator: validateRequire,
            name: "品牌故事",
          },
        ],
        relationType: [
          { required: true, validator: validateRequire, name: "品牌关系" },
        ],
        logo: [
          { required: true, validator: validateSourceUri, name: "品牌LOGO" },
        ],
        trademarkRegistrations: [
          { required: true, validator: validateRequire, name: "商标注册书" },
        ],
        qualifications: [
          {
            required: false,
            validator: validateQRequire,
            name: "品牌授权资质",
          },
        ],
      },
      conf: {
        url: upload.url,
        headers: upload.headers,
        limit: {
          type: {
            list: ["image/png", "image/jpg", "image/jpeg"],
            tip: "请上传png/jpg格式的图片",
          },
          size: {
            size: 5 * 1024 * 1024,
            tip: "请上传小于5M的图片",
          },
        },
      },
    };
  },
  mounted() {
    const id = this.$route.query && this.$route.query.id;
    if (id) {
      this.fetchData(id);
    }
  },
  methods: {
    onType(type) {
      this.rules.qualifications[0].required = type === "2";
    },
    fetchData(id) {
      getPv(id)
        .then(({ data }) => {
          this.rules.qualifications[0].required = data.relationType === "2";
          this.postForm = data;
          // this.$refs.upload2.$forceUpdate();
          // this.$forceUpdate()
          console.log('abcd', this.postForm.qualifications);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const id = this.$route.query && this.$route.query.id;
          if (!id) {
            createPv(Object.assign({}, this.postForm))
              .then((r) => {
                this.loading = false;
                this.done = true;
              })
              .catch((e) => {
                this.loading = false;
              });
          } else {
            updatePv(Object.assign({}, this.postForm, { statusCode: 2 }))
              .then((r) => {
                this.loading = false;
                this.done = true;
              })
              .catch((e) => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.create-container {
  background-color: white;
  margin: 20px;
  border-radius: 4px;
  padding: 20px;
  .el-form {
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
  .reason {
    background-color: #fff1f0;
    border: 1px solid #ffa39e;
    border-radius: 2px;
    padding: 8px 12px;
    color: #ec5a52;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
