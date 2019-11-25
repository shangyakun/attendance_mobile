<template>
  <div style="background:#f5f5f5">
    <div class="apply">
      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="1/3" align="center" @click.native="toApply(2)">
          <div class="flex-demo">
            <img src="./images/icon_2.svg" />
            <p>请假</p>
          </div>
        </flexbox-item>
        <flexbox-item :span="1/3" align="center" @click.native="toApply(3)">
          <div class="flex-demo">
            <img src="./images/icon_3.svg" />
            <p>加班</p>
          </div>
        </flexbox-item>
        <flexbox-item :span="1/3" align="center" @click.native="toApply(4)">
          <div class="flex-demo">
            <img src="./images/icon_4.svg" />
            <p>出差</p>
          </div>
        </flexbox-item>
        <flexbox-item :span="1/3" align="center" @click.native="toApply(5)">
          <div class="flex-demo">
            <img src="./images/icon_5.svg" />
            <p>公出</p>
          </div>
        </flexbox-item>
        <!-- <flexbox-item :span="1/3" align="center" @click.native="toApply(6)">
          <div class="flex-demo">
            <img src="./images/icon_5.svg" />
            <p>剩余假期</p>
          </div>
        </flexbox-item> -->

        <!-- <flexbox-item :span="1/3" align="center" @click.native="toApply(1)">
          <div class="flex-demo">
            <img src="./images/icon_1.svg" />
            <p>销假</p>
          </div>
        </flexbox-item> -->
      </flexbox>
    </div>
    <div class="vacation" @click="$router.push({path:'holidays'})">
      <img class="img" src="./images/vacation.png" alt="">
      <span class="title">剩余休假</span>
      <span class="arrow">
        <x-icon type="ios-arrow-right" size="20"></x-icon>
      </span>
      <span class="count">调休{{holidays.totalTwl}}天</span>
      <span class="count">司龄{{holidays.totalAgesham}}天</span>
      <span class="count">年休{{holidays.totalAnnual}}天</span>
    </div>
    <div class="record" @click="$router.push({path:'record'})">
      <img class="img" src="./images/record.png" alt="">
      <span class="title">申请记录</span>
      <span class="arrow">
        <x-icon type="ios-arrow-right" size="20"></x-icon>
      </span>
    </div>
  </div>

</template>
<script>
  import { Flexbox, FlexboxItem, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import api from "@/assets/js/api";
  import menu from "@/config/menu";
  export default {
    name: 'apply',
    directives: {
      TransferDom
    },
    components: {
      Flexbox,
      FlexboxItem,
      Confirm,
    },
    data() {
      return {
        holidays:{},
        workCode: this.getCookie('username'), // 工号
      }
    },
    mounted() {
      let nowDate = new Date().Format("yyyy-MM-dd");
      this.getUserInfo();
    },
    methods: {
      getUserInfo(){
        api(`/attendance/annualDayoff/restDetail?workCode=` + this.workCode).then(res=>{
          if(res.success){
            this.holidays = res.data;
          }
        })
      },
      toApply(type) {
        let attendanceDay = new Date().Format("yyyy-MM-dd")
        if (type == 1) {
          window.location.href = menu.xjApi + attendanceDay
        } else if (type == 2) {
          window.location.href = menu.qjApi + attendanceDay
        } else if (type == 3) {
          window.location.href = menu.jbApi + attendanceDay
        } else if (type == 4) {
          window.location.href = menu.ccApi + attendanceDay
        } else if (type == 5) {
          window.location.href = menu.gcApi + attendanceDay
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .apply {
    background:#fff;
    padding-bottom: 30rem/20;
    .flex-demo {
      margin-top: 30rem/20;
      font-size: 12px;
      color: #656565;
      line-height: 20rem/20;
    }
    .appealConfirm {
      .weui-dialog__bd {
        display: none;
      }
      .weui-dialog__ft {
        margin-top: 10px;
        border: 1px solid #e5e5e5;
        a {
          background: #FFF !important;
          font-size: 16px;
          color: #212121;
          letter-spacing: 0.2px;
          text-align: center;
        }
        .weui-dialog__btn_primary {
          color: #5698F6;
        }
      }
    }
    .v-transfer-dom {
      .vux-popup-header-right {
        color: #2f7dcd;
      }
    }
    
  }
  .vacation{
    text-align: left;
    background:#fff;
    padding:10rem/20 10rem/20;
    margin-top:30rem/20;
    line-height: 24rem/20;
    height: 24rem/20;
    .img{
      width:23rem/20;
      vertical-align: middle;
    }
    .title{
      color: #656565;
      font-size:14rem/20;
      line-height: 26rem/20;
      height: 26rem/20;
      display: inline-block;
      vertical-align: top;

    }
    .arrow{
      vertical-align: middle;
      height: 20rem/20;
      float:right;
      line-height: 26rem/20;
      margin-top:3rem/20;
    }
    .count{
      color: #5698F6;
      font-size:14rem/20;
      float:right;
      height:26rem/20;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10rem/20;
    }
  }
  .record{
    text-align: left;
    background:#fff;
    padding:10rem/20 10rem/20;
    line-height: 24rem/20;
    border-top: 1px solid #eee;
    height: 24rem/20;
    .img{
      width:23rem/20;
      vertical-align: top;
    }
    .title{
      color: #656565;
      font-size:14rem/20;
      line-height: 26rem/20;
      height: 26rem/20;
      display: inline-block;
      vertical-align: top;

    }
    .arrow{
      vertical-align: middle;
      height: 20rem/20;
      float:right;
      line-height: 26rem/20;
      margin-top:3rem/20;
    }
    .count{
      color: #5698F6;
      font-size:14rem/20;
      float:right;
      height:26rem/20;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10rem/20;
    }
  }
  .vux-x-icon {
    fill: #656565;
  }
</style>
