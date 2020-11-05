<template>
  <div class="profile-container">
    <div class="container">
      <el-form
        ref="postForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="width: 320px"
      >
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="form.amount" :placeholder="'账户余额' + amount" />
        </el-form-item>
        <el-form-item label="提现方式">
          <el-radio-group v-model="form.type">
            <el-radio-button label="2">银行卡</el-radio-button>
            <el-radio-button label="1">支付宝</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="form.type === '1'"
          label="支付宝帐号"
          prop="alipayAccount"
        >
          <el-input
            v-model="form.alipayAccount"
            placeholder="请输入支付宝帐号"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type === '1'"
          label="帐号名称"
          prop="alipayAccountName"
        >
          <el-input
            v-model="form.alipayAccountName"
            placeholder="请输入支付宝帐号名称"
          />
        </el-form-item>

        <el-form-item
          v-if="form.type === '2'"
          label="户名"
          prop="bandAccountName"
        >
          <el-input
            v-model="form.bandAccountName"
            placeholder="请输入银行卡户名"
          />
        </el-form-item>
        <el-form-item v-if="form.type === '2'" label="卡号" prop="bandCardNo">
          <el-input v-model="form.bandCardNo" placeholder="请输入银行卡卡号" />
        </el-form-item>
        <el-form-item v-if="form.type === '2'" label="开户行" prop="bandName">
          <el-input v-model="form.bandName" placeholder="请输入银行卡开户行" />
        </el-form-item>

        <el-form-item label>
          <el-button :loading="loading" type="primary" @click="handleSubmit"
            >提现</el-button
          > <p class="tip">提现将于1~2个工作日到账</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { withdraw } from "@/api/user";

export default {
  data() {
    return {
      loading: false,
      form: {
        amount: undefined,
        type: "1",
        listLoading: false,
        alipayAccount: "",
        alipayAccountName: "",
        bandAccountName: "",
        bandCardNo: "",
        bandName: "",
      },
      tip: 0,
    };
  },
  computed: {
    rules() {
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
        console.log(value, this.amount);
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
          if (parseFloat(value) > parseFloat(this.amount)) {
            if (this.tip <= 0) {
              this.tip += 1;
              this.$message({
                message: "当前可提现余额为" + this.amount,
                type: "error",
                onClose: () => {
                  this.tip -= 1;
                },
              });
              callback(new Error("当前可提现余额为" + this.amount));
            }
          } else {
            callback();
          }
        }
      };
      return {
        amount: [
          {
            required: true,
            validator: validateNumber,
            name: "提现金额",
            trigger: "blur",
          },
        ],
        alipayAccount:
          this.form.type !== "1"
            ? []
            : [
                {
                  required: true,
                  validator: validateRequire,
                  name: "支付宝账号",
                },
              ],
        alipayAccountName:
          this.form.type !== "1"
            ? []
            : [
                {
                  required: true,
                  validator: validateRequire,
                  name: "支付宝帐号名称",
                },
              ],
        bandAccountName:
          this.form.type !== "2"
            ? []
            : [
                {
                  required: true,
                  validator: validateRequire,
                  name: "银行卡户名",
                },
              ],
        bandCardNo:
          this.form.type !== "2"
            ? []
            : [
                {
                  required: true,
                  validator: validateRequire,
                  name: "银行卡卡号",
                },
              ],
        bandName:
          this.form.type !== "2"
            ? []
            : [
                {
                  required: true,
                  validator: validateRequire,
                  name: "银行卡开户行",
                },
              ],
      };
    },
    ...mapGetters(["avatar", "roles", "amount"]),
  },
  methods: {
    handleSubmit() {
      this.$refs.postForm.validate((valid, e) => {
        if (valid) {
          this.loading = true;
          withdraw(Object.assign({}, this.form))
            .then((r) => {
              this.loading = false;
              this.$message({ message: "提交成功", type: "success" });
              this.$store.dispatch("user/getInfo");
              setTimeout(() => {
                this.$router.push("/user/index");
              }, 500);
            })
            .catch((e) => {
              this.loading = false;
              console.log(e);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .container {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    .tip{
      color: #999;
      margin: 4px 0;
    }
  }
}
</style>
