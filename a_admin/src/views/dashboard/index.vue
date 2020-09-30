<template>
  <div class="dashboard-container">
    shouye
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['roles'])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  .tools {
    margin: 20px 0;
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h3 {
        margin: 0 0 12px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px;
      }
    }
    .function {
      .el-col div {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
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
          color: #2873fc;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
}
</style>
