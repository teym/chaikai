<template>
  <div class="login-container">
    <div id="sso_qr" class=".qr" />
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      code: ''
    }
  },
  mounted() {
    const { code, state } = this.$route.query
    if (code) {
      console.log('login', code, state)
      this.$store
        .dispatch('user/loginCode', { code, state })
        .then(() => {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    } else if (window.location.search) {
      window.location = '/#/sso' + window.location.search
      console.log('redir')
    } else {
      window.WwLogin({
        id: 'sso_qr',
        appid: 'ww9bd117a014bf30bf',
        agentid: '1000015',
        redirect_uri: encodeURIComponent('http://admintest.ckgift.cn/#/sso'),
        state: 'adminTest',
        href: ''
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 160px;
}
</style>
