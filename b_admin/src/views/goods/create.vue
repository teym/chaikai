<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <div class="createPost-main-container">
        <a
          class="help"
          href="https://www.yuque.com/docs/share/4775af8f-cee6-4cc6-a595-51096f8ef55d"
          target="_blank"
          ><el-icon class="el-icon-question" />如何快速导入</a
        >

        <el-form-item
          prop="brand"
          style="margin-bottom: 30px; max-width: 640px"
          label-width="90px"
          label="商品品牌:"
          :required="true"
        >
          <el-select
            v-model="postForm.brand.id"
            placeholder="请选择品牌"
            @change="onBrand"
          >
            <el-option
              v-for="(item, index) in brandListOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
            <el-option label="新增 品牌授权" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="importUrl"
          style="margin-bottom: 30px; max-width: 640px"
          label-width="90px"
          label="商品链接:"
        >
          <el-input
            v-model="postForm.importUrl"
            placeholder="请输入淘宝/天猫的售卖链接"
          />
          <el-button type="text" @click="handleImport">快速导入</el-button>
        </el-form-item>
        <el-form-item
          prop="price"
          style="margin-bottom: 30px; max-width: 360px"
          label-width="90px"
          label="商品价值:"
        >
          <el-input-number
            class="text-left"
            :min="1"
            :max="99999999"
            :step="1"
            :controls="false"
            v-model="postForm.price"
            placeholder="请输入产品价值"
          />
          <span> 元</span>
        </el-form-item>
        <el-form-item
          prop="title"
          style="margin-bottom: 30px; max-width: 640px"
          label-width="90px"
          label="商品名称:"
        >
          <el-input
            v-model="postForm.title"
            placeholder="请输入商品名称"
            :maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          prop="banners"
          style="margin-bottom: 30px; max-width: 1024px"
          label-width="90px"
          label="商品头图:"
          :required="true"
        >
          <Upload
            :url="conf.url"
            :headers="conf.headers"
            :count="7"
            :limit="conf.limit"
            tip="请上传大于700 * 700像素，小于5M的图片"
            v-model="postForm.banners"
          />
        </el-form-item>
        <el-form-item
          prop="skuGroups"
          style="margin-bottom: 30px; max-width: 840px"
          label-width="90px"
          label="商品规格:"
          :required="true"
        >
          <div class="skus">
            <el-row v-if="postForm.skuGroups.length > 0" class="head">
              <el-col :span="8">
                <span>规格名</span>
              </el-col>
              <el-col :span="16">
                <span>规格值</span>
              </el-col>
            </el-row>
            <el-row
              v-for="(sku, i) in postForm.skuGroups"
              :key="i"
              :gutter="32"
            >
              <el-col :span="8" class="label">
                <el-autocomplete
                  v-model="sku.name"
                  class="inline-input"
                  :fetch-suggestions="handleSkuSuggestions"
                  placeholder="请输入内容"
                  :maxlength="10"
                  show-word-limit
                >
                  <div slot="suffix" class="input_remove">
                    <div class="box" @click="handleRemoveSku(i)">
                      <el-icon class="el-icon-circle-close" />
                    </div>
                  </div>
                </el-autocomplete>
              </el-col>
              <el-col :span="16" class="value">
                <el-row :gutter="8">
                  <el-col v-for="(s, j) in sku.skuList" :key="j" :span="8">
                    <el-input v-model="s.name" :maxlength="10" show-word-limit>
                      <div slot="suffix" class="input_remove">
                        <div class="box" @click="handleRemoveSkuValue(sku, j)">
                          <el-icon class="el-icon-circle-close" />
                        </div>
                      </div>
                    </el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="text" @click="handleAddSkuValue(sku)"
                      >添加规格值</el-button
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="postForm.skuGroups.length < 2">
              <el-button @click="handleAddSku">添加规格项</el-button>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item
          prop="detail"
          label-width="90px"
          label="商品详情:"
          style="margin-bottom: 30px; max-width: 840px"
        >
          <Tinymce
            :upload="conf"
            ref="editor"
            v-model="postForm.detail"
            :height="400"
          />
        </el-form-item>
        <el-form-item
          label-width="90px"
          style="margin-bottom: 30px; max-width: 840px"
        >
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/SingleImage2";
import { validURL } from "@/utils/validate";
import {
  fetchData,
  fetchSkus,
  importData,
  createData,
  updateData,
  fetchPv,
} from "@/api/goods";
import { getConf } from "@/api/oss";

const defaultForm = () => ({
  brand: { id: 0 },
  importUrl: "",
  price: undefined,
  title: "",
  itemId: 0,
  picUrl: "",
  banners: [],
  detail: "<div></div>",
  skuGroups: [],
});

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
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
      if (!value || value.length === 0) {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请输入" + rule.name,
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请输入" + rule.name));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (!(parseFloat(value) > 0)) {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请填写正确的" + rule.name,
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请填写正确的" + rule.name));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (!value || validURL(value || "")) {
        callback();
      } else {
        if (this.tip <= 0) {
          this.tip += 1;
          this.$message({
            message: "请输入淘宝/天猫链接",
            type: "error",
            onClose: () => {
              this.tip -= 1;
            },
          });
        }
        callback(new Error("请输入淘宝/天猫链接"));
      }
    };
    const upload = getConf();
    return {
      postForm: defaultForm(),
      loading: false,
      brandListOptions: [],
      tip: 0,
      rules: {
        brand: [{ validator: validateRequire, name: "商品品牌" }],
        importUrl: [{ validator: validateSourceUri }],
        price: [
          {
            required: true,
            validator: validateNumber,
            name: "商品价值",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            validator: validateRequire,
            name: "商品名称",
            trigger: "blur",
          },
        ],
        detail: [{ validator: validateRequire, name: "商品详情" }],
        skuGroups: [{ validator: validateRequire, name: "商品规格" }],
        banners: [{ validator: validateRequire, name: "商品图片" }],
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
    this.fetchPv();
    // this.fetchSkus();
  },
  methods: {
    fetchData(id) {
      fetchData(id).then((r) => {
        const d = r.data || defaultForm();
        if (!d.skuGroups) {
          d.skuGroups = [];
        }
        d.detail = (d.detail || '<div></div>').replace(/<img.*?src="(.*?)"[^>]+>/g, '<img src="$1" />').replace(/^<p/, '<div').replace(/<\/p>$/, '</div>')
        this.postForm = d;
      });
    },
    fetchPv() {
      fetchPv({ page: 1, size: 50, statusCode: 3 }).then((r) => {
        this.brandListOptions = r.data.data;
        if (this.postForm.brand.id === 0) {
          this.postForm.brand.id = (this.brandListOptions[0] || {}).id || 0;
        }
      });
    },
    handleImport() {
      this.loading = true;
      importData({ url: this.postForm.importUrl })
        .then(({ data }) => {
          if (this.postForm.itemId && this.postForm.itemId !== data.itemId) {
            this.loading = false;
            this.$message({ message: "非同一商品不可导入", type: "error" });
            return;
          }
          const imgs = data.descImgs
            .map((i) => `<img src="${i}"/>`)
            .join("");
          const d = {
            title: (data.title || this.postForm.title).substring(0, 30),
            banners: data.images || this.postForm.banners,
            detail:
              data.descImgs && data.descImgs.length > 0
                ? "<div>" + imgs + "</div>"
                : this.postForm.detail,
            itemId: data.itemId || 0,
          };
          this.postForm = Object.assign({}, this.postForm, d);
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    fetchSkus() {
      fetchSkus().then((r) => {
        this.skus = r.data;
      });
    },
    onBrand(e) {
      if (e === 0) {
        this.postForm.brand = {};
        this.$router.push("/user/index");
      }
    },
    handleAddSku() {
      this.postForm.skuGroups.splice(this.postForm.skuGroups.length, 0, {
        name: "",
        skuList: [],
      });
    },
    handleRemoveSku(index) {
      console.log("remove sku", index);
      this.postForm.skuGroups.splice(index, 1);
    },
    handleAddSkuValue(sku) {
      sku.skuList = sku.skuList.concat({ name: "" });
    },
    handleRemoveSkuValue(sku, index) {
      console.log("remove sku value", sku, index);
      sku.skuList.splice(index, 1);
    },
    handleSkuSuggestions(queryString, cb) {
      var all = [
        "颜色",
        "尺寸",
        "尺码",
        "款式",
        "套装",
        "净含量",
        "容量",
        "口味",
      ];
      var rest = queryString
        ? all.filter((i) => i.indexOf(queryString) === 0)
        : all;
      cb(rest.map((i) => ({ value: i })));
    },
    handleSubmit() {
      this.$refs.postForm.validate((valid, e) => {
        if (valid) {
          this.loading = true;
          const id = this.$route.query && this.$route.query.id;
          this.postForm.picUrl = this.postForm.banners[0] || "";
          if (!id) {
            createData(Object.assign({}, this.postForm))
              .then((r) => {
                this.$notify({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                  duration: 2000,
                });
                this.loading = false;
                this.$router.push("/goods/index");
              })
              .catch((e) => {
                this.loading = false;
              });
          } else {
            updateData(Object.assign({ id }, this.postForm))
              .then((r) => {
                this.$notify({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                  duration: 2000,
                });
                this.loading = false;
                this.$router.push("/goods/index");
              })
              .catch((e) => {
                this.loading = false;
              });
          }
        } else {
          console.log(e);
          return false;
        }
      });
    },
  },
};
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

      .help {
        float: right;
        font-size: 14px;
        color: #999;
      }

      .el-form-item {
        .el-input {
          width: 80%;
        }
        .skus {
          .el-col {
            position: relative;
            .el-input {
              width: 100%;
            }
            .el-autocomplete {
              width: 100%;
            }
            .input_remove {
              width: 100%;
              height: 100%;
              position: absolute;
              right: 0;
              top: 0;
              .box {
                position: absolute;
                right: -15px;
                top: -20px;
                padding: 2px;
                width: 20px;
                height: 20px;
                .el-icon-circle-close {
                  font-size: 16px;
                  line-height: 20px;
                }
              }
            }
          }
          .head {
            span {
              color: #999;
            }
          }
          .value {
            .el-col {
              margin-bottom: 8px;
              position: relative;
            }
          }
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
