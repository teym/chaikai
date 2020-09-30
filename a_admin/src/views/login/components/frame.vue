<template>
  <div class="container">
    <div class="frame">
      <img class="frame_bg" src="@/assets/images/login_from.png" alt="bg">
      <div class="form">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginFrame'
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: lightskyblue;
  display: flex;
  align-items: center;
  justify-content: center;

  .frame {
    position: relative;
    padding-top: 46%;
    width: 80%;
    max-width: 1200px;

    .frame_bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
    }
    .form {
      position: absolute;
      left: 0;
      top: 0;
      min-width: 400px;
      width: 40%;
      height: 60%;
      margin-left: 5%;
      margin-top: 5%;
    }
  }
}
</style>
