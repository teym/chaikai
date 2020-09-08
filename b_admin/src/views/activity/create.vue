<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <div class="createPost-main-container">
        <div class="form-container">
          <p>基本信息</p>
          <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="活动商品:">
            <el-button v-if="!postForm.goods" icon="el-icon-plus" @click="handleSelectGoods">选择商品</el-button>
            <div v-else class="goods_p">
              <img :src="postForm.goods.picUrl" alt="pic">
              <div>
                <p>{{ postForm.goods.title }}</p>
                <span>{{ postForm.goods.price }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="brand" style="margin-bottom: 30px;" label-width="90px" label="商品规格:">
            <el-input v-model="postForm.sku" placeholder="活动规格" />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="90px" label="活动名称:">
            <el-input v-model="postForm.title" placeholder="活动名称" />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="90px" label="报名时间:">
            <el-date-picker
              v-model="postForm.regTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
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
            <el-button v-if="postForm.guidelines.length < 5" icon="el-icon-plus">添加指引</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="createPost-main-container">
        <div class="form-container">
          <p>活动设置</p>
          <el-form-item style="margin-bottom: 30px;" label-width="90px" label="私密活动:">
            <el-switch
              v-model="postForm.displayType"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 30px;" label-width="90px" label="收货地限制:">
            <el-switch v-model="postForm.recvArea" active-color="#13ce66" inactive-color="#ff4949" />
            <div>
              <h5>已选地区</h5>
              <el-button type="text" @click="addressFormVisible=true">选择</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="createPost-main-container">
        <div class="form-container">
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
      <div>
        <el-row :gutter="20" justify="center" :loading="goods.loading">
          <el-col v-for="(g, i) in goods.list" :key="i" :span="4">
            <div class="info" @click="handleGoods(g)">
              <img :src="g.picUrl" alt="pic">
              <p>{{ g.title }}</p>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          layout="total, prev, pager, next"
          :page-size="10"
          :total="goods.total"
          :current-page="goods.page"
          @current-change="handleGoodsPage"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goodsFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择区域" :visible.sync="addressFormVisible">
      <div>
        <h5>省份选择</h5>
        <div>
          <span v-for="i in addressKeys" :key="i" class="pill">{{ i }}</span>
        </div>
        <div>
          <el-row v-for="(i, j) in priovices" :key="j">
            <el-col :span="4">
              <el-checkbox
                :indeterminate="isIndeterminate"
                :checked="checked(i)"
                @change="handleCheckAllChange(i)"
              >{{ i.name }}</el-checkbox>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col
                  v-for="(m,n) in i.cities"
                  :key="n"
                  :span="4"
                  :checked="checked(i, m)"
                >{{ m.name }}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addressFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validURL } from '@/utils/validate'
import { fetchData, fetchPv } from '@/api/activities'
import { area } from '@/util/area'

const defaultForm = {
  goods: null,
  regTime: [],
  guidelines: [''],
  title: '',
  totalNum: 0
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
      },
      addressKeys: area.map(i => i.key)
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
    handleGoods(goods) {
      this.postForm.goods = goods
      this.goodsFormVisible = false
      console.log(goods)
    },
    handleFilter() {
      this.fetchPv(1)
    },
    handleGoodsPage(p) {
      this.fetchPv(p)
    },
    handleCheckAllChange(i) {

    },
    checked(i, m) {
      return false
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

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    background-color: white;
    margin: 10px 20px;
    .form-container {
      max-width: 720px;
    }

    .goods_p {
      img {
        width: 70px;
        height: 70px;
      }
      div {
        display: inline-block;
        p {
          font-size: 14px;
          margin: 0;
          padding: 0;
        }
        span {
          font-size: 12px;
          color: #4244ff;
        }
      }
    }

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
  .el-dialog__header {
    padding-bottom: 0;
  }
  .el-row {
    .info {
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
