<template>
  <div class="dashboard-container">
    <notice />
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="block">
          <h5>快捷功能</h5>
          <el-row>
            <el-col :span="12">创建商品</el-col>
            <el-col :span="12">发布活动</el-col>
            <el-col :span="12">认证授权</el-col>
            <el-col :span="12">申请开票</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block">
          <h5>待办事项</h5>
          <el-row>
            <el-col :span="12">创建商品</el-col>
            <el-col :span="12">创建商品</el-col>
            <el-col :span="12">创建商品</el-col>
            <el-col :span="12">创建商品</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import notice from "./components/notice";

export default {
  name: "Dashboard",
  components: { notice },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 40px 45px 20px 50px;
  .block {
    background-color: lightgray;
    border-radius: 4px;
  }
}
</style>