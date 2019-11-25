<template>
  <div class="content">
    <div class="network-fail">
      <img class="netfailed" src="../assets/images/netfailed.png" alt="">
      <div class="network-desc">网络加载失败</div>
      <x-button class="btn" type="default" @click="reload">重新加载</x-button>
    </div>
  </div>
</template>
<script>
  import { XButton} from 'vux'
  export default {
    name: 'error',
    components: {
      XButton,
    },
    data() {
      return {
        networkType: '' // 网络状态
      }
    },
    computed: {
    },
    methods: {
      /*
      **  获取网络状态
      */
      getNetStatus() {
        wx.getNetworkType({
            success: function (res) {
                this.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
            },
            fail: function() {
                this.networkType = ''
            }
        });
      },
      reload() {
        let url = this.$route.query.url
        if(this.networkType != '') {
          this.$router.push({path: url})
        }
      }
    },
    mounted() {
      this.getNetStatus()
    }
  }

</script>
<style lang="less">
  .network-fail {
    .netfailed {
      margin-top: 187rem / 20;
      width: 130rem / 20;
      height: 100rem / 20;
    }
    .network-desc {
      font-size: 14rem / 20;
      color: #9B9B9B;
      letter-spacing: 0.17px;
      margin-bottom: 10rem/20;
      text-align: center;
    }
    .btn{
      width:100rem/20;
      line-height:30rem/20;
      font-size:12rem/20;
      background: #fff;
      border:1px solid #979797;
    }
  }
</style>
