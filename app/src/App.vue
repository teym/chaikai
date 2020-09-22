<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
page{
  width: 100vw;
  height: 100vh;
  overflow: hidden scroll;
  margin: 0;
  padding: 0;
}

.container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.pos_r{
  position: relative;
}
.pos_a{
  position: absolute;
}
.pos_f{
  position: fixed;
}
.flex{
  flex: 1;
}
.row{
  display: flex;
  flex-direction: row;
}
.col{
  display: flex;
  flex-direction: column;
}
.just{
  justify-content: space-between;
}
.i-center{
  align-items: center;
}
.c-center{
  justify-content: center;
}
.center{
  align-items: center;
  justify-content: center;
}
.text-right{
  text-align: right;
}
.blod{
  font-weight: 500;
}
.medium{
  font-weight: 400;
}
.normal{
  font-weight: normal;
}
.h5{
  font-size: 28rpx;
  color: #494C5E;
  line-height: 40rpx;
}
.light{
  color:#7B7F8E;
}
.dark{
  color: #494C5E;
}
.red{
  color: #FF8E3B;
}
.red_bg{
  background-color: #FF8E3B44;
}
.white_bg{
  background-color: white;
}
.light_bg{
  background-color: #F5F5F5;
}
.small{
  font-size: 24rpx;
}
.middle{
  font-size: 28rpx;
}
.big{
  font-size: 32rpx;
}
.pad{
  padding: 16rpx;
}
.pad-t{
  padding-top: 16rpx;
}
.pad-l{
  padding-left: 16rpx;
}
.pad-r{
  padding-right: 16rpx;
}
.pad-b{
  padding-bottom: 16rpx;
}

.pad2{
  padding: 24rpx;
}
.pad2-t{
  padding-top: 24rpx;
}
.pad2-l{
  padding-left: 24rpx;
}
.pad2-r{
  padding-right: 24rpx;
}
.pad2-b{
  padding-bottom: 24rpx;
}


.margin{
  margin: 16rpx;
}
.margin-t{
  margin-top: 16rpx;
}
.margin-l{
  margin-left: 16rpx;
}
.margin-r{
  margin-right: 16rpx;
}
.margin-b{
  margin-bottom: 16rpx;
}

.margin2{
  margin: 24rpx;
}
.margin2-t{
  margin-top: 24rpx;
}
.margin2-l{
  margin-left: 24rpx;
}
.margin2-r{
  margin-right: 24rpx;
}
.margin2-b{
  margin-bottom: 24rpx;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
