<template>
  <div class="count">
    <Calendar v-on:choseDay="clickDay" v-on:changeMonth="changeDate" v-on:isToday="clickToday" :mark-date="dateMore" :ago-day-hide='agoDayHide' :sunday-start="true" :future-day-hide='Math.round(new Date().getTime()/1000).toString()' ref="Calendar"></Calendar>
    <div>
      <ul :class="[JSON.stringify(dataCount) != '{}' ? 'count-item' : '']" v-show="dataCount != null">
        <li v-show="dataCount.missCheckIn!=0 && dataCount.missCheckIn != null">
          <span></span>缺进{{dataCount.missCheckIn}}次</li>
        <li v-show="dataCount.missCheckOut!=0 && dataCount.missCheckOut != null">
          <span></span>缺退{{dataCount.missCheckOut}}次</li>
        <li v-show="dataCount.missAttendance!=0 && dataCount.missAttendance != null">
          <span></span>缺勤{{dataCount.missAttendance}}次</li>
        <li v-show="dataCount.late!=0 && dataCount.late != null">
          <span></span>迟到{{dataCount.late}}次</li>
        <li v-show="dataCount.earlyLeave!=0 && dataCount.earlyLeave != null">
          <span></span>早退{{dataCount.earlyLeave}}次</li>
        <li v-show="dataCount.sameCityBusinessTrip!=0 && dataCount.sameCityBusinessTrip != null">
          <span></span>公出{{dataCount.sameCityBusinessTrip}}次</li>
        <li v-show="dataCount.businessTrip!=0 && dataCount.businessTrip != null">
          <span></span>出差{{dataCount.businessTrip}}次</li>
        <li v-show="dataCount.vacationLeave!=0 && dataCount.vacationLeave != null">
          <span></span>休假{{dataCount.vacationLeave}}次</li>
        <li v-show="dataCount.extraWorkLength!=0 && dataCount.extraWorkLength != null">
          <span></span>加班{{dataCount.extraWorkLength}}次</li>
      </ul>
    </div>
    <div class="line-bg"></div>
    <div class="apply" @click="toAppeal">
      <group>
        <popup-picker :data="reason" class="statusWord" :disabled="disabled" :show.sync="show" v-model="status" placeholder="">
          <template slot="title" slot-scope="props">
            <span slot="title" class="title">考勤状态&nbsp;&nbsp;
            <span v-show="errorMsg" class="apply-tag">{{errorMsg}}</span>
            <span v-show="errorWord" class="apply-tag-late">{{errorWord}}</span>
            <span v-show="errorInfo" class="apply-tag-late">{{errorInfo}}</span>
            </span>
          </template>
        </popup-picker>
      </group>
    </div>
    <flexbox class="count-time">
      <flexbox-item>
        <div class="flex-demo"><span>上班打卡：</span><span v-if="checkinTime">{{checkinTime}}</span><span v-if="!checkinTime">--</span></div>
      </flexbox-item>
      <flexbox-item>
        <div class="flex-demo"><span>下班打卡：</span><span v-if="checkoutTime">{{checkoutTime}}</span><span v-if="!checkoutTime">--</span></div>
      </flexbox-item>
    </flexbox>
    <toast v-model="tipShow" type="text" :text="tipText"></toast>
    <!-- 申诉 -->
    <div v-transfer-dom>
      <confirm v-model="appealConfirm" class="appealConfirm" :title="appealTitle" @on-cancel="appealConfirm = false" @on-confirm="appealFn" confirm-text="确定" cancel-text="取消">
      </confirm>
    </div>
    <loading :show="showLoading" text="申诉中..."></loading>
  </div>
</template>
<script>
  import Calendar from "@/components/calendar/index";
  import { InlineCalendar,Loading } from 'vux'
  import {
    Group,
    Cell,
    CellBox,
    Flexbox,
    FlexboxItem,
    PopupPicker,
    Toast,
    Confirm,
    TransferDomDirective as TransferDom
  } from "vux";
  import api from "@/assets/js/api";
  import menu from "@/config/menu";
  import util from "@/views/count/util";
  export default {
    name: "count",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Calendar,
      Group,
      Cell,
      CellBox,
      Flexbox,
      FlexboxItem,
      PopupPicker,
      Toast,
      InlineCalendar,
      Confirm
    },
    data() {
      return {
        showLoading:false,
        countList: [], // 返回list
        workCode: this.getCookie('username'), // 工号
        dateMore: [],
        agoDayHide: "",
        errorMsg: "", // 异常信息1
        errorWord: "", // 异常信息2
        errorInfo: '', // 异常信息3
        tipText: "", // 提示信息
        appealTitle: "", // 申诉提示信息
        tipShow: false,
        dataCount: {},
        isShowCount: true,
        clickDate: '', // 点击某一天
        checkinTime: "", // 上班打卡时间
        checkoutTime: "", // 下班打卡时间
        reason: [
          ["请选择", "考勤申诉", "请假", "加班", "出差", "公出"]
        ],
        status: [],
        appealNum: false,
        appealConfirm: false,
        disabled: true,
        hideApply: false,
        show: false
      };
    },
    mounted() {
      this.getCount()
      this.getNowDayTime()
      this.getWorkflowStatus(new Date().Format("yyyy-MM-dd"))
    },
    watch: {
      status(val) {
        if (val[0] == '考勤申诉') {
          this.$nextTick(() => {
            document.querySelector('.vux-popup-picker-select span').style.color = '#1690e9'
          })
        }
      }
    },
    methods: {
      /*
       ** 获取统计数据
       */
      getCount() {
        let nowDate = new Date()
        let year = nowDate.getFullYear()
        let month = nowDate.getMonth() + 1
        let monthStart
        let monthEnd
        let d = new Date(year, month, 0);
        if(month < 10) {
          monthStart = year + '-' + '0' + month + '-' + "01"
          monthEnd = year + '-' + '0' + month + '-' + d.getDate()
        }else{
          monthStart = year + '-' + month + '-' + "01"
          monthEnd = year + '-' + month + '-' + d.getDate()
        }
        let data = {
          monthStart: monthStart,
          monthEnd: monthEnd,
          workCode: this.workCode
        };
        this.getCountFn(data);
      },
      /*
       ** 统计数据调用方法
       */
      async getCountFn(data) {
        this.dateMore = [];
        await api(`/attendance/statistics/getStatisticsMonthlyByWorkCode`, "get", data).then(
          res => {
            if (res.errorCode == "200") {
              this.countList = res.data;
              if (res.dataCount) {
                this.dataCount = res.dataCount
                this.isShowCount = true
              } else {
                this.dataCount = {}
                this.isShowCount = false
              }
              this.countList.map(item => {
                if (item.checkinStatus != 1 || item.checkoutStatus != 1) {
                  this.dateMore.push(
                    new Date(item.attendDate).Format("yyyy-MM-dd")
                  );
                }
              });
            }
          }
        );
      },
      /*
       ** 获取当天考勤时间
       */
      async getNowDayTime() {

        await api(`/attendance/attendance/getUserAttendance?workcode=` + this.workCode, "post").then(res => {
          if (res.errorCode == "200") {
            this.checkinTime = res.data.inTime.split(" ")[1];
            this.checkoutTime = res.data.outTime.split(" ")[1];
          }
        });
      },
      /*
       ** 获取用户信息
       */
      async getUserInfo() {
        let userInfoList = []
        await api(`/attendance/OACallBack/getUserInfo?workCode=` + this.workCode).then(res => {
          if (res.errorCode == "200") {
            userInfoList = res.data
          }
        })
        return userInfoList
      },
      /*
       ** 考勤申诉次数判断
       */
      async checkWorkflow(date) {
        let res = await this.getUserInfo()
        if (res) {
          let success = await api('/attendance/attendance/checkWorkflow?sqr=' + res[0].id + '&attendanceDay=' + date)
          if (success.errorCode == "9999") {
            this.appealNum = true
          }
        }
      },
      /*
       ** 获取审批状态
       */
      getWorkflowStatus(date) {
        let data = {
          workcode: this.workCode,
          attendanceDay: date
        }
        let _this = this
        return api(`/attendance/attendance/getWorkflowStatus`, "get", data).then(res => {
          if (res.errorCode == "200") {
            return res.data
          }
        })
      },
      toAppeal() {
        if (this.status[0] == '考勤申诉' && this.appealNum) {
          this.appealTitle = '您的申诉次数已达上限，无法提交'
          this.appealConfirm = true
        } else if (this.status[0] == '考勤申诉' && !this.appealNum) {
          this.appealTitle = '确认进行考勤申诉吗'
          this.appealConfirm = true
        }
      },
      appealFn() {
        if(this.appealNum) {
          return
        }
        this.appeal()
      },
      /*
       ** 点击某一天
       */
      async clickDay(data) {
        this.status = [];
        this.errorMsg = '';
        this.errorWord = '';
        this.errorInfo = '';
        this.clickDate = new Date(data).Format("yyyy-MM-dd");
        let nowDate = new Date(data).Format("yyyy-MM-dd");
        this.checkWorkflow(nowDate);
        let result = await this.getWorkflowStatus(nowDate);
        this.checkinTime = '';
        this.checkoutTime = '';
        this.countList.filter(item => {
          if (new Date(item.attendDate).getTime() == new Date(nowDate).getTime()) {
            if (item.checkinTime != null) {
              this.checkinTime = item.checkinTime.split(" ")[1];
            } else {
              this.checkinTime = ''
            }
            if (item.checkoutTime != null) {
              this.checkoutTime = item.checkoutTime.split(" ")[1];
            } else {
              this.checkoutTime = ''
            };
            if(item.attendOff == 1 && item.checkinStatus == 1 && item.checkoutStatus==1 && item.businessTrip == 1){
              this.errorMsg = '正常';
              return;
            };
            this.errorMsg = item.attendOff == 2 ? '缺勤' : (item.checkinStatus != 1 ? util.formatCheckinStatus(item.checkinStatus) : '');
            this.errorWord = item.attendOff == 2 ? '' : (item.checkoutStatus != 1 ? util.formatCheckoutStatus(item.checkoutStatus) : '');
            this.errorInfo = item.businessTrip != 1 ? util.formatBusinessTrip(item.businessTrip) : (item.vacationTrip != 1 ? '请假' : (item.extraWork != 1) ? '加班' : '');
            if(this.errorMsg == '' && this.errorWord == '早退'){
              this.status = [];
            }else if(this.errorMsg == '迟到' && this.errorWord == '早退'){
              this.status = [];
            }else if(this.errorMsg == '迟到' && this.errorWord == ''){
              this.status = [];
            }else if (!result && (this.errorMsg != '' || this.errorWord != '')) {
              this.status = ["考勤申诉"]
            }else if(result && result != '待审批' && (this.errorMsg != '' || this.errorWord != '')) {
              this.status = ["考勤申诉"]
            } else if (result && this.status[0] != result) {
              console.log(result)
              this.status = [result]
              this.$nextTick(() => {
                document.querySelector('.vux-popup-picker-select span').style.color = '#656565'
              })
            } else if (!result && (this.errorMsg === '' || this.errorWord === '')) {
              this.status = []
            }
          }
        })
        // if(this.errorMsg == '' && this.errorWord == '早退'){
        //       this.status = [];
        //     }else if(this.errorMsg == '迟到' && this.errorWord == '早退'){
        //       this.status = [];
        //     }else if(this.errorMsg == '迟到' && this.errorWord == ''){
        //       this.status = [];
        //     }else
        // 每月2号开始不能提交上一个月的的考勤申诉
        let nowDay = new Date();
        let year = nowDay.getFullYear();
        let month = nowDay.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        // let compareFirst = year + '-' + month + '-' + "03";
        let compareSecond = year + '-' + month + '-' + "01";
        if(new Date(nowDay).Format("yyyy-MM-dd") > compareSecond && nowDate < compareSecond) {
          this.status = [];
        }
      },
      /*
       ** 左右切换月份
       */
      changeDate(val) {
        let nowDate = new Date(val)
        let year = nowDate.getFullYear()
        let month = nowDate.getMonth() + 1
        let monthStart
        let monthEnd
        let d = new Date(year, month, 0);
        if(month < 10) {
          monthStart = year + '-' + '0' + month + '-' + "01"
          monthEnd = year + '-' + '0' + month + '-' + d.getDate()
        }else{
          monthStart = year + '-' + month + '-' + "01"
          monthEnd = year + '-' + month + '-' + d.getDate()
        }
        let data = {
          monthStart: monthStart,
          monthEnd: monthEnd,
          workCode: this.workCode
        };
        this.getCountFn(data);
      },
      clickToday(data) {
        //   console.log(data); //跳到了本月
      },
      /*
       ** 获取用户信息
       */
      async getUserInfo() {
        let userInfoList = []
        await api(`/attendance/OACallBack/getUserInfo?workCode=` + this.workCode).then(res => {
          if (res.errorCode == "200") {
            userInfoList = res.data
          }
        })
        return userInfoList
      },
      /*
       ** 考勤申诉请求
       */
      async appeal() {
        await this.getUserInfo().then(async res => {
          let qrqc;
          if (this.errorMsg == '迟到' || this.errorMsg == '缺进') {
            qrqc = 0
          }
          if (this.errorWord == '早退' || this.errorWord == '缺退') {
            qrqc = 1
          }
          if (this.errorMsg == '缺勤') {
            qrqc = 2
          }
          if(this.errorMsg == '迟到' && this.errorWord == '早退') {
            qrqc = 3
          }
          if(this.errorMsg == '迟到' && this.errorWord == '缺退') {
            qrqc = 4
          }
          let data = {
            data: [{
              sqrq: new Date().Format("yyyy-MM-dd"), // 当前日期
              sqr: res[0].id, // 申请人id
              gw: res[0].jobtitle, // 职位id
              sjbm: res[0].supdepid, // 上级部门id
              sqbm: res[0].departmentid, // 末级部门id
              bkrq: this.clickDate, // 补卡日期
              qrqc: qrqc, // 签入签出
              gh: res[0].workcode // 工号
            }],
            creator: res[0].workcode, // 申请人id
            workflowId: 378, // 请求id
            title: '考勤申诉' // 自定义流程标题
          };
          this.showLoading = true;
          await api(`/attendance_workflow/`, 'POST', data).then(res => {
            this.showLoading = false;
            if (res.code == 1) {
                this.$vux.toast.text('申诉成功');
                this.status = [];
                this.getCount();
                this.errorMsg = '正常';
                this.errorWord = '';
                // this.status[0] = '申请审批中';
                // document.querySelector('.vux-popup-picker-select span').style.color = '#656565'
            } else {
                this.$vux.toast.text('申诉失败');
                this.status[0] = '考勤申诉'
                document.querySelector('.vux-popup-picker-select span').style.color = '#1690e9'
            }
          }).catch(err => {
                this.status[0] = '考勤申诉'
                document.querySelector('.vux-popup-picker-select span').style.color = '#1690e9'
          })
        })
      },
      // onShow() {
      //   //   console.log('on show')
      // },
      // onChange() {
      //   //   console.log('on hide', type)
      // }
    }
  };

</script>
<style lang="less">
  .count {
    .count-item {
      &:before {
        content: '';
        display: block;
        width: 100%;
        height: 0.5rem/20;
        background: #eee;
        margin-bottom: 15rem/20;
        transform: scaleY(0.5);
      }
      width: 100%;
      box-sizing: border-box; // max-height: 60rem / 20;
      padding: 0 12rem/20 0; // border-top:1rem/20 solid #eee;
      font-size: 14rem / 20;
      color: #656565;
      overflow: hidden;
      line-height: 1;
      li {
        width: 25%;
        text-align: left;
        margin-bottom: 17rem/20;
        float: left;
        span {
          display: inline-block;
          width: 4rem / 20;
          height: 4rem / 20;
          margin: 0 5rem/20 4rem/20 0;
          border-radius: 2rem/20;
          background: #1690e9;
        }
      }
    }
    .mark1 {
      color: red;
    }
    .mark2 {
      color: green;
    }
    .mark3 {
      color: yellow;
    }
    .line-bg {
      height: 10rem/20;
      background: #f5f5f5;
    }
    .apply {
      .vux-no-group-title {
        padding: 15rem/20 12rem/20;
        padding-bottom: 0;
        margin-top: 0;

        &:after {
          display: none;
        }
      }
      .weui-cells:before {
        border-top: inherit;
      }
      .statusWord {
        &:after {
          content: '';
          display: block;
          width: 100%;
          height: 0.5rem/20;
          background: #eee;
          margin-top: 15rem/20;
          margin-bottom: 1rem/20;
          transform: scaleY(0.5);
        }
        font-size: 14rem/20;
        .weui-cell_access .weui-cell__ft:after {
          border-color: #1690e9;
        }
        .weui-cell {
          padding: 0;
        }
        .vux-cell-value {
          color: #1690e9;
        }
        .weui-cell_access .weui-cell__ft:after {
          border-color: #1690e9;
          border-width: 1px 1px 0 0;
        }
        .title {
          font-size: 14px;
          color: #212121;
        }
        .apply-tag {
          width: 32rem/20;
          height: 16rem/20;
          background: #e6f1ff;
          border-radius: 2rem/20;
          font-size: 12rem/20;
          padding: 2rem/20 8rem/20;
          color: #1690e9;
        }
        .apply-tag-late {
          width: 32rem/20;
          height: 16rem/20;
          color: #e79223;
          border-radius: 2rem/20;
          font-size: 12rem/20;
          padding: 2rem/20 8rem/20;
        }
      }
    }
    .count-time {
      line-height: 50rem/20;
      .flex-demo {
        display: flex;
        justify-content: flex-start;
        padding-left: 12rem/20;
        align-items: center;
        color: #212121;
        font-size: 14rem/20;
        border-radius: 4rem/20;
        background-clip: padding-box;
      }
    }
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

</style>
