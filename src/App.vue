<template>
    <div id="app">
      <!-- <keep-alive> -->
    	<router-view></router-view>
      <!-- </keep-alive> -->
      <!-- <footer-view></footer-view> -->
    </div>
</template>

<script>
import footerView from './views/footerView'
export default {
  name: 'App',
  components: {
    footerView
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import './assets/css/index.less';
#app {
    font-family: 'PingFangSC-Regular', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #fff;
    margin-bottom: 50rem/20;
}
// [v-cloak] {
//     display: none;
// }
</style>
