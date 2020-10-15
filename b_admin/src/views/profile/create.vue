<template>
  <div class="create-container">
    <div v-if="tip" class="tip">
      <div>
        <img src="@/assets/images/user_done.png" alt="done" />
        <h1>已提交和审核</h1>
        <p>
          审核通过后，将通过短信进行通知
          <br />为加快小二审核效率，
          <router-link :to="{ path: '/user/auth' }"
            >请完成最后一步品牌授权</router-link
          >，即可招募达人
        </p>
        <el-button size="mini" @click="$router.push('/user/auth')"
          >新增品牌授权</el-button
        >
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
        <el-form-item label="公司名称:" prop="name">
          <el-input v-model="postForm.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="统一社会信用代码:" prop="creditCode">
          <el-input
            v-model="postForm.creditCode"
            placeholder="请输入统一社会信用代码"
          />
        </el-form-item>
        <el-form-item
          prop="businessLicense"
          style="margin-bottom: 30px"
          label="营业执照:"
        >
          <Upload
            :url="conf.url"
            :headers="conf.headers"
            :count="7"
            :limit="conf.limit"
            tip="请上传小于5M的图片，支持图片格式：jpg,jpeg,png"
            v-model="postForm.businessLicense"
          />
        </el-form-item>
        <el-form-item label="联系人:" prop="contact">
          <el-input v-model="postForm.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="微信号:" prop="contactWechat">
          <el-input
            v-model="postForm.contactWechat"
            placeholder="请输入微信号"
          />
        </el-form-item>
        <el-button type="primary" @click="submitForm">{{
          ["", "提交审核", "审核中", "已通过", "提交审核"][stat.statusCode || 1]
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from "@/components/Upload/SingleImage3";
import { validURL } from "@/utils/validate";
import { fetchStat, auth } from "@/api/user";
import { getConf } from "@/api/oss";
// import { searchUser } from '@/api/remote-search'

const defaultForm = {
  name: "",
  contact: "",
  contactWechat: "",
  creditCode: "",
  businessLicense: "",
};

export default {
  name: "UserDetail",
  components: {
    Upload,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.name + "为必传项",
          type: "error",
        });
        callback(new Error(rule.name + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (validURL(value)) {
        callback();
      } else {
        this.$message({
          message: "外链url填写不正确",
          type: "error",
        });
        callback(new Error("外链url填写不正确"));
      }
    };
    const upload = getConf();
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      tip: false,
      stat: {},
      rules: {
        name: [{ validator: validateRequire, name: "公司名称" }],
        contact: [{ validator: validateRequire, name: "联系人" }],
        contactWechat: [{ validator: validateRequire, name: "微信号" }],
        creditCode: [{ validator: validateRequire, name: "统一社会信用代码" }],
        businessLicense: [{ validator: validateSourceUri }],
      },
      tempRoute: {},
      conf: {
        url: upload.url,
        headers: upload.headers,
        limit: {
          type: {
            list: ["image/png", "image/jpg", "image/jpeg"],
            tip: "请上传png/jpg格式的图片",
          },
          size: {
            size: 3 * 1024 * 1024,
            tip: "请上传小于3M的图片",
          },
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      fetchStat()
        .then((response) => {
          this.stat = response.data || { statusCode: 1 };
          for (const key in defaultForm) {
            this.postForm[key] = this.stat[key] || "";
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    submitForm() {
      if (this.stat.statusCode === 1 || this.stat.statusCode === 4) {
        this.$refs.postForm.validate((valid, e) => {
          if (valid) {
            this.loading = true;
            auth(Object.assign({}, this.postForm)).then((r) => {
              this.$notify({
                title: "成功",
                message: "提交成功",
                type: "success",
                duration: 2000,
              });
              this.tip = true;
              this.loading = false;
            });
          } else {
            console.log("error submit!!", e);
            return false;
          }
        });
      }
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
