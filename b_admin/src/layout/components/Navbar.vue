<template>
  <div class="navbar">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <search v-if="xiaoer" id="header-search" class="right-menu-item" />
      <el-popover
        class="right-menu-item"
        placement="bottom"
        width="318"
        trigger="hover"
        popper-class="account-pop"
      >
        <img
          slot="reference"
          class="nav_img_icon"
          src="@/assets/images/nav_account.png"
          alt="setting"
        />
        <div class="account">
          <img class="bg" :src="bg_img" />
          <div class="row" style="padding-bottom: 12px">
            <h5>账户资产</h5>
          </div>
          <div class="row">
            <div></div>
            <div class="col">
              <div @click="$router.push('/user/buy')">
                <span>{{ activity }}</span
                >次
              </div>
              <p @click="$router.push('/user/buy')">置换活动</p>
              <el-button size="mini" round @click="$router.push('/user/buy')"
                >增加次数</el-button
              >
            </div>
            <div class="col">
              <div style="cursor: pointer;" @click="$router.push('/user/balance')">
                <span>{{ amount }}</span
                >元
                <el-icon class="el-icon-arrow-right"></el-icon>
              </div>
              <p @click="$router.push('/user/balance')">账户余额</p>
              <el-button size="mini" round @click="$router.push('/user/topup')"
                >充值金额</el-button
              >
            </div>
            <div></div>
          </div>
        </div>
      </el-popover>
      <div class="right-menu-item menu-noti" @click="handelMessage">
        <el-badge :value="count" :hidden="count <= 0" class="nav_img_box">
          <img
            class="nav_img_icon"
            src="@/assets/images/nav_noti.png"
            alt="setting"
          />
        </el-badge>
      </div>
      <el-dropdown class="right-menu-item">
        <img
          class="nav_img_box nav_img_icon"
          src="@/assets/images/nav_setting.png"
          alt="setting"
        />
        <el-dropdown-menu slot="dropdown" class="account-pop">
          <el-dropdown-item>
            <router-link style="color: #ffffff" to="/user/index"
              >账号信息</router-link
            >
          </el-dropdown-item>
          <el-dropdown-item style="color: #ffffff" @click.native="logout"
            >退出登陆</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="right-menu-item menu-help" @click="onHelp"
        >帮助</el-button
      >
    </div>
    <Communicate ref="communicate" @count="onCount" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Search from "@/components/HeaderSearch";
import Communicate from "@/components/Communicate";

const bg = require("@/assets/images/account_bg.png");

export default {
  components: {
    Breadcrumb,
    Search,
    Communicate,
  },
  data() {
    return {
      bg_img: bg,
      count: 0,
      list: 0,
    };
  },
  computed: {
    ...mapGetters(["amount", "activity", "xiaoer"]),
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch("app/toggleSideBar");
    // },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
    },
    handelMessage() {
      if (this.list > 0 || this.count > 0) {
        this.$refs.communicate.show();
      } else {
        this.$message({ message: "暂无最新消息", type: "info" });
      }
    },
    onHelp() {
      window._MEIQIA("showPanel");
    },
    onCount(t) {
      this.count = t.count;
      this.list = t.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 14px 8px;
      height: 100%;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .nav_img_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
    .menu-help {
      margin-right: 8px;
    }
  }
}
.account {
  position: relative;
  color: white;
  .bg {
    position: absolute;
    left: -12px;
    top: -12px;
    width: 318px;
    bottom: -12px;
  }
  h5 {
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
      padding-left: 0;
      padding-right: 0;
      min-width: 120px;
      div {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        span {
          font-size: 26px;
          font-weight: bold;
          line-height: 1;
        }
        .el-icon-arrow-right {
          line-height: 26px;
          margin-left: 4px;
        }
      }
      p {
        margin: 6px 0 16px 0;
        padding: 0;
      }
      .el-button {
        background-color: transparent;
        color: white;
      }
    }
  }
}
</style>
<style>
.account-pop {
  background-color: #4244ff;
}
.account-pop .popper__arrow::after {
  border-bottom-color: #4244ff !important;
}
.account-pop .el-dropdown-menu__item:hover {
  background-color: #4244ff;
}
</style>