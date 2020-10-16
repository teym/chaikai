<template>
  <div class="login-container">
    <div id="sso_qr" class=".qr"></div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      code: "",
    };
  },
  watch: {
    "$route.query": function () {
      console.log("change", this.$route.query);
      this.login();
    },
  },
  mounted() {
    const { code, state } = this.$route.query;
    if (this.login()) {
      console.log("login", code, state);
    } else if (window.location.search) {
      window.location = "/?sso=1#/sso" + window.location.search;
      // setTimeout(() => {
      //   // location.reload();
      //   this.login();
      // }, 100);
      console.log("redir");
    } else {
      window.WwLogin({
        id: "sso_qr",
        appid: "ww9bd117a014bf30bf",
        agentid: "1000016",
        redirect_uri: encodeURIComponent(
          `${location.protocol}//${location.host}/#/sso`
        ),
        state: "brandTest",
        href: "",
      });
    }
  },
  methods: {
    login() {
      const { code, state } = this.$route.query;
      if (code) {
        console.log("login", code, state);
        this.$store
          .dispatch("user/loginCode", { code, state })
          .then(() => {
            // this.$router.push({
            //   path: this.redirect || "/",
            //   query: this.otherQuery,
            // });
            this.loading = false;
            window.location = "/?sso=1#/";
          })
          .catch(() => {
            this.loading = false;
          });
        return true;
      }
      return false;
    },
  },
};
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
