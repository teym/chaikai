<template>
  <div class="pos_a done">
      <div class="col i-center">
        <img src="/static/images/act_done.png" alt="done">
        <h5 class="middle blod dark margin-t">已提交</h5>
        <p class="small light margin-t">{{message}}</p>
      </div>
    </div>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style>
.done{
  left: 0;
  top: 0;
  width: 750rpx;
  height: 100%;
  background-color: white;
  z-index: 1;
}
.done div{
  margin-top: 120rpx;
}
.done img{
  width: 220rpx;
  height: 220rpx;
}
</style>
