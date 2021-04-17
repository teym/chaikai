<template>
  <div class="_usercard">
    <el-row class="tools" :gutter="20">
      <el-col :span="12">
        <div class="block function">
          <h4>{{ name }}</h4>
          <div>
            手机号：{{ telephone }}
            <span>
              <el-button type="text" @click="onShowChangePhone"
                >换绑手机</el-button
              >
              <el-button type="text" @click="onShowChangePassword"
                >修改密码</el-button
              >
            </span>
          </div>
          <div>
            企业认证：{{
              ["UNKNOW", "未认证", "审核中", "已认证", "已拒绝"][
                user.statusCode
              ]
            }}
            <span>
              <el-button
                class="bg_light"
                size="mini"
                type="primary"
                round
                @click="handleAuth"
                >{{
                  ["", "马上认证", "查看认证", "查看认证", "重新认证"][
                    user.statusCode
                  ]
                }}</el-button
              >
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block task">
          <h4>账户资产</h4>
          <el-row>
            <el-col :span="12">
              <span>{{ activity }}</span> 次
            </el-col>
            <el-col :span="12">
              <div class="quic" @click="$router.push('/user/balance')">
                <span>{{ amount }}</span> 元
                <el-icon class="el-icon-arrow-right" />
              </div>
            </el-col>
            <el-col class="title" :span="12">
              置换活动
              <el-button
                class="bg_light"
                size="mini"
                type="primary"
                round
                @click="$router.push('/user/buy')"
                >增加次数</el-button
              >
            </el-col>
            <el-col class="title" :span="12">
              账户余额
              <el-button
                class="bg_light"
                size="mini"
                type="primary"
                round
                @click="$router.push('/user/topup')"
                >充值金额</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="绑定手机号" :visible.sync="showChangePhone" width="420px">
      <el-form
        :model="fromdata"
        :rules="rules"
        label-position="right"
        label-width="92px"
      >
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="fromdata.password"
            autocomplete="off"
            placeholder="请输入当前账号登录密码"
          />
        </el-form-item>
        <el-form-item label="(新)手机号" class="username" prop="username">
          <el-input
            v-model="fromdata.username"
            autocomplete="off"
            placeholder="请输入11位手机号码"
          >
            <div slot="prefix" class="prefix">
              <p>+86</p>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" props="code">
          <el-input
            v-model="fromdata.code"
            autocomplete="off"
            style="width: 60%"
            placeholder="请输入验证码"
          />
          <el-button
            style="float: right"
            plain
            type="primary"
            @click="handleCode(104)"
            >{{ count > 0 ? `${count}后再试` : "获取验证码" }}</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="fromLoading"
          @click="handleChangePhone"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="showChangePassword"
      width="420px"
    >
      <el-form
        :model="fromdata"
        :rules="rules"
        label-position="right"
        label-width="92px"
      >
        <el-form-item label="手机号" class="username" prop="username">
          <el-input
            disabled
            v-model="fromdata.username"
            autocomplete="off"
            placeholder="请输入11位手机号码"
          >
            <div slot="prefix" class="prefix">
              <p>+86</p>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" props="code">
          <el-input
            v-model="fromdata.code"
            autocomplete="off"
            style="width: 60%"
            placeholder="请输入验证码"
          />
          <el-button
            style="float: right"
            plain
            type="primary"
            @click="handleCode('PASSWORD_MODIFY')"
            >{{ count > 0 ? `${count}后再试` : "获取验证码" }}</el-button
          >
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="fromdata.password"
            autocomplete="off"
            placeholder="请输入当前账号登录密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="fromLoading"
          @click="handleChangePassword"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { validPhone, validCode } from "@/utils/validate";
import { getCode, bindPhone, resetPass } from "@/api/user";

export default {
  name: "UserCard",
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("错误的手机号码"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!validCode(value)) {
        callback(new Error("验证码为6位数字"));
      } else {
        callback();
      }
    };
    return {
      showChangePhone: false,
      showChangePassword: false,
      fromdata: {
        username: "",
        password: "",
        code: "",
      },
      fromLoading: false,

      rules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },

      count: 0,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "telephone", "amount", "activity"]),
  },
  methods: {
    onShowChangePhone() {
      this.fromdata.username = "";
      this.fromdata.code = "";
      this.fromdata.password = "";
      clearTimeout(this.timer);
      this.count = 0;
      this.fromLoading = false;
      this.showChangePhone = true;
    },
    onShowChangePassword() {
      this.fromdata.username = this.telephone;
      this.fromdata.code = "";
      this.fromdata.password = "";
      clearTimeout(this.timer);
      this.count = 0;
      this.fromLoading = false;
      this.showChangePassword = true;
    },
    handleTimer() {
      this.timer = setTimeout(() => {
        this.count -= 1;
        if (this.count > 0) {
          this.handleTimer();
        }
      }, 1000);
    },
    handleCode(type) {
      if (this.count > 0) return;
      if (!validPhone(this.fromdata.username)) return;
      this.count = 59;
      this.handleTimer();

      getCode(this.fromdata.username, type);
    },
    handleChangePhone() {
      this.fromLoading = true;
      bindPhone({
        telephone: this.fromdata.username,
        code: this.fromdata.code,
        password: this.fromdata.password,
      })
        .then((r) => {
          this.fromLoading = false;
          clearTimeout(this.timer);
          this.count = 0;
          this.showChangePhone = false;
          this.$store.dispatch("user/getInfo");
          this.$message({
            message: "修改成功",
            type: "success",
          });
        })
        .catch((e) => {
          this.fromLoading = false;
        });
    },
    handleChangePassword() {
      this.fromLoading = true;
      resetPass({
        code: this.fromdata.code,
        password: this.fromdata.password,
      })
        .then((r) => {
          this.fromLoading = false;
          clearTimeout(this.timer);
          this.count = 0;
          this.showChangePassword = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
        })
        .catch((e) => {
          this.fromLoading = false;
        });
    },
    handleAuth() {
      this.$router.push("/user/create");
    },
  },
};
</script>

<style lang="scss" scoped>
._usercard {
  .tools {
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h4 {
        margin: 0 0 24px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px 0;
      }
    }
    .bg_light {
      background-color: #4244ff26;
      color: #4244ff;
    }
    .function {
      div {
        font-size: 16px;
        padding: 6px 16px 6px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 14px;
          padding: 2px 0;
        }
      }
    }
    .task {
      .el-col {
        font-size: 16px;
        color: #333;
        span {
          font-size: 26px;
          line-height: 40px;
          color: #4244ff;
        }
        .el-button {
          margin-left: 8px;
        }
        .quic {
          cursor: pointer;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
.prefix {
  p {
    width: 38px;
    border-right: 1px solid #dcdfe6;
    text-align: center;
    margin: 0;
  }
}
</style>

<style>
._usercard .el-form-item.username .el-input__inner {
  padding-left: 48px;
}
</style>