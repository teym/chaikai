<template>
  <div class="navbar">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <search id="header-search" class="right-menu-item" />
      <el-popover class="right-menu-item" placement="bottom" width="200" trigger="hover">
        <img
          slot="reference"
          class="nav_img_icon"
          src="@/assets/images/nav_account.png"
          alt="setting"
        >
        <div>账户资产</div>
      </el-popover>
      <div class="right-menu-item menu-noti">
        <el-badge is-dot class="nav_img_box">
          <img class="nav_img_icon" src="@/assets/images/nav_noti.png" alt="setting">
        </el-badge>
      </div>
      <el-dropdown class="right-menu-item">
        <img class="nav_img_box nav_img_icon" src="@/assets/images/nav_setting.png" alt="setting">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/profile/index">账号信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="right-menu-item menu-help">帮助</el-button>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Search
  },
  // computed: {
  //   ...mapGetters(["sidebar"]),
  // },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch("app/toggleSideBar");
    // },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
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
      }
    }
    .menu-help {
      margin-right: 8px;
    }
  }
}
</style>
