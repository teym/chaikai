<template>
  <div class="dashboard-container">
    <h4>欢迎{{ name }}</h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['roles', 'name'])
  }

}
</script>

<style lang="scss" scoped>
.dashboard-container {
  h4{
    margin-top: 320px;
    text-align: center;
  }
}
</style>
