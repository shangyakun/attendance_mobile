<template>
    <div class="content" v-show="!loading">
        <div class="network-fail" v-if="network">
            <img class="netfailed" src="../assets/images/netfailed.png" alt="">
            <div class="network-desc">网络加载失败</div>
            <x-button class="btn" type="default" @click="reload">重新加载</x-button>
        </div>
        <div v-else>
            <div class="attend-panel">
                <div class="attend-title">打卡记录</div>
                <timeline class="attend-timeline">
                    <timeline-item :class="{active: onWork.status === 0}">
                        <div class="attend-item">
                          <strong>{{onWork.title+onWork.timeText}}</strong>
                          <span v-if="onWork.status > 0" :class="[`label label-${statusList[onWork.status].icon}`]">{{statusList[onWork.status].label}}</span>
                        </div>
                    </timeline-item>
                    <timeline-item class="active" v-if="onWork.status > 0 || isWeekEnd">
                        <div class="attend-item">
                            <strong>{{offWork.title+offWork.timeText}}</strong>
                            <span v-if="offWork.status > 0" :class="[`label label-${statusList[offWork.status].icon}`]">{{statusList[offWork.status].label}}</span>
                        </div>
                        <div class="attend-update" v-if="offWork.status > 0" @click="attendUpdate">
                            <span class="inline">更新打卡</span>
                            <x-icon type="ios-arrow-right" class="icon-primary inline"></x-icon>
                        </div>
                    </timeline-item>
                </timeline>
            </div>
          <!-- 打卡 -->
            <!-- <div class="attend-action" :disabled="offWork.status > 0 || !inDistance || noPunch" @click="action"> -->
            <div class="attend-action" :disabled="offWork.status > 0 || !inDistance || noPunch" @click="action">

                <div class="btn-action" v-if="!noPunch">
                    <div class="action-title">{{actionTitle}}</div>
                    <div class="action-time">{{timeNow}}</div>
                </div>
                <div class="btn-action" v-else>
                    <!-- <img class="weekend-icon" style="fill:#eee;" src="../assets/images/shape.svg" /> -->
                    <div class="weekend-title">{{'无需打卡'}}</div>
                </div>
            </div>
          <!-- 考勤范围 -->
            <div v-if='!noPunch'>
                <div class="action-desc" v-if="inDistance">
                    <x-icon type="ios-checkmark" class="icon-success inline" size="14"></x-icon>
                    <span class="inline">在考勤范围</span>
                </div>
                <div class="action-desc" v-else>
                    <icon type="warn" class="inline icon-warn"></icon>
                    <span class="inline">不在考勤范围</span>
                </div>
            </div>
            <div v-else>
                <div class="action-desc">
                    <icon type="warn" class="inline icon-warn"></icon>
                    <span class="inline">{{tips}}</span>
                </div>
            </div>  
            <!-- 更新打卡 -->
            <div v-transfer-dom>
                <confirm v-model="updateConfirm" class="leaveEarlyConfirm" title="确定是否要更新打卡记录？" @on-cancel="updateConfirm = false" @on-confirm="isEarly" confirm-text="更新打卡" cancel-text="取消">
                </confirm>
            </div>
            <!-- 更新打卡成功 -->
            <toast v-model="attendToast" :time="1000" type="text">{{toastText}}</toast>
            <!-- 早退了，是否继续打卡 -->
            <div v-transfer-dom>
                <confirm v-model="leaveEarlyConfirm" class="leaveEarlyConfirm" title="早退了，是否继续打卡？" @on-cancel="leaveEarlyConfirm = false" @on-confirm="leaveEarly" confirm-text="继续打卡" cancel-text="取消">
                </confirm>
            </div>
            <!-- 早退了，是否继续打卡 -->
            <div v-transfer-dom>
                <x-dialog v-model="onworkSuccessAlert" class="attendsucc-dialog">
                    <div class="attendsucc-body">
                        <img src="../assets/images/card.png" style="width:100%;" />
                        <div class="alert-title">上班打卡成功</div>
                        <div class="alert-desc">开启元气满满的一天</div>
                        <div class="alert-time">{{onWork.timeText}}</div>
                    </div>
                    <div class="attendsucc-footer" @click="onworkSuccessAlert=false">
                        我知道了
                    </div>
                </x-dialog>
            </div>
            <!-- 早退了，是否继续打卡 -->
            <div v-transfer-dom>
                <x-dialog v-model="offworkSuccessAlert" class="attendsucc-dialog">
                    <div class="attendsucc-body">
                        <img src="../assets/images/card.png" style="width:100%;" />
                        <div class="alert-title">下班打卡成功</div>
                        <div class="alert-desc">努力奋斗的美好</div>
                        <div class="alert-time">{{offWork.timeText}}</div>
                    </div>
                    <div class="attendsucc-footer" @click="offworkSuccessAlert=false">
                    我知道了
                    </div>
                </x-dialog>
            </div>
        </div>
        <div v-transfer-dom>
            <loading :show="loading"></loading>
        </div>
    </div>
</template>
<script>
    import { Group, Timeline, TimelineItem, dateFormat, Loading, Toast, Confirm, XDialog, XButton, Icon, TransferDomDirective as TransferDom } from 'vux'
    import api from '@/assets/js/api'
    import '../config/wx-config'
    import { clearInterval } from 'timers';
    export default {
        directives: {
            TransferDom
        },
        components: {
            Group,
            Timeline,
            TimelineItem,
            Toast,
            Confirm,
            XDialog,
            XButton,
            Icon,
            Loading
        },
        data() {
            return {
                tips:'',//无需打卡提示
                workCode: this.getCookie('username'), // 工号
                attendToast: false, // 更新提示及不在考勤范围内提示弹窗
                toastText: '', // 更新提示及不在考勤范围内提示文案
                updateConfirm: false, // 更新打卡确认弹窗
                leaveEarlyConfirm: false, // 早退打卡弹窗
                onworkSuccessAlert: false, // 上班打卡成功弹窗
                offworkSuccessAlert: false, // 下班打卡成功弹窗
                inDistance: false, // 是否在范围内
                network: false, // 有无网络
                isWeekEnd: false, // 是否周末
                noPunch: false, // 无需打卡
                loading: false,
                timeNow: '', // 当前时间
                // 上班打卡内容
                onWork: {
                  title: '上班打卡',
                  timeText: '',
                  status: 0,
                },
                // 下班打卡内容
                offWork: {
                  title: '下班打卡',
                  timeText: '',
                  status: 0,
                },
                // 打卡状态值
                statusList: [{
                  value: 0,
                  label: '',
                }, {
                  value: 1,
                  label: '正常',
                  icon: 'primary',
                }, {
                  value: 2,
                  label: '迟到',
                  icon: 'warning',
                }, {
                  value: 3,
                  label: '早退',
                  icon: 'warning',
                }, {
                  value: 4,
                  label: '缺进',
                  icon: 'warning',
                }],
                // 工作地点
                workPlace: {
                  attendanceStartTime: '', // 规定上班时间
                  attendanceEndTime: '', // 规定下班时间
                  latitude: '', // 经度
                  longitude: '', // 纬度
                },
                breakTime:0,
                timer:null,
                setLocalList: [], // 经纬度
            }
        },
        computed: {
          /*
           **  打卡按钮标题监听
           */
            actionTitle() {
                let title = this.onWork.status === 0 ? this.onWork.title :
                this.offWork.status === 0 ? this.offWork.title : '打卡完成';
                return title;
            },
        },
        methods: {
          /*
           **  获取网络状态
           */
            getNetStatus() {
                let _this = this
                wx.ready(function() {
                wx.getNetworkType({
                    success: function(res) {
                        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
                    },
                    fail: function() {
                        _this.network = true
                    }
                })
                  // wx.onNetworkStatusChange(function(res) {
                  //   if(res.networkType == 'none' || res.networkType == 'unknown' || !res.isConnected) {
                  //       this.network = true
                  //     } 
                  // })
                })
            },
            /*
            *  获取考勤状态
            */
            getUserAttendance() {
                api(`/attendance/attendance/getUserAttendance?workcode=` + this.workCode).then(res => {
                    if (res.errorCode == '200') {
                        this.workPlace.attendanceStartTime = res.data.attendanceStartTime
                        this.workPlace.attendanceEndTime = res.data.attendanceEndTime
                        this.isWeekEnd = res.data.flag == 0 ? true : false
                        this.parseData(res.data);
                    } else if (res.errorCode == '100018') {
                        this.noPunch = true;
                        this.tips = '您在考勤白名单中，无需打卡'
                    } else if(res.errorCode == '100023'){
                        this.noPunch = true;
                        this.tips = '休假中，无需打卡'
                    } else if(res.errorCode == '100022'){
                        this.noPunch = true;
                        this.tips = '未分配考勤组'
                    } else if(res.errorCode == '100024'){
                        this.noPunch = true;
                        this.tips = '公出/出差中，无需打卡'
                    } 
                })
            },
            /*
            *  获取考勤地址
            */
            getWorkPlace() {
                return api(`/attendance/attendancePoint/findByWorkCode?workCode=` + this.workCode)
                .then(res => {
                    if (res.errorCode == '200') {
                        this.setLocalList = res.data
                        return res.data
                    }
                })
            },
            /*
            *  打卡调用接口
            */
            async check() {
                let attendResult;
                await api(`/attendance/attendance/check?workcode=` + this.workCode)
                .then(res => {
                    if (res.errorCode == '200') {
                        attendResult = res.data;
                    }
                })
                return attendResult;
            },
            /*
            *  打卡
            */
            async action() {
                if (this.offWork.status > 0 || this.noPunch) return;
                await this.isInDistance()
                .then(isIn => {
                    this.inDistance = isIn;
                    if (!this.inDistance) {
                        this.toastText = '不在考勤范围内，打卡失败';
                        this.attendToast = true;
                        return
                    };
                    if(this.breakTime>0){
                        this.attendToast = true;
                        this.toastText = '重复打卡了，请间隔1分钟后再试';
                        return;
                    }else{
                        this.breakTime = 60;
                        this.timer = setTimeout(this.countdownTime,1000);
                    };
                    if (this.onWork.status === 0) {
                        this.isLate();
                    } else if (this.offWork.status === 0) {
                        this.isEarly();
                    }
                });
            },
            /*
            *  更新打卡
            */
            async attend() {
                await this.check().then(data => {
                    this.parseData(data);
                })
            },
            /*
            *  解析数据到本地
            */
            parseData(data) {
                this.onWork.timeText = data.inTime ? dateFormat(new Date(data.inTime.replace(/-/g, "/")), 'HH:mm') : '';
                this.onWork.status = (!data.inTime && !data.in) ? 0 : (data.in ? 4 : (data.late ? 2 : 1));
                this.offWork.timeText = data.outTime ? dateFormat(new Date(data.outTime.replace(/-/g, "/")), 'HH:mm') : '';
                this.offWork.status = !data.outTime ? 0 : (data.early ? 3 : 1);
            },
            /*
            *  判断是否迟到
            */
            isLate() {
                this.attend().then(_ => {
                    this.onworkSuccessAlert = true;
                });
            },
            /*
            *  判断是否早退
            */
            isEarly() {
                let isEarly = new Date().getTime() <= new Date(this.workPlace.attendanceEndTime.replace(/-/g, "/")).getTime();
                if (isEarly && !this.isWeekEnd) {
                    this.leaveEarlyConfirm = true;
                } else {
                    this.attend().then(_ => {
                        this.offworkSuccessAlert = true;
                     });
                }
            },
            /*
            *  确认早退
            */
            leaveEarly() {
                this.attend().then(_ => {
                    this.offworkSuccessAlert = true;
                });
            },
            //倒计时
            countdownTime(){
                if(this.breakTime<=0){
                    clearTimeout(this.timer);
                    this.breakTime = 0;
                    return;
                };
                this.breakTime--;
                this.timer = setTimeout(this.countdownTime,1000);
            },
            attendUpdate() {
                if(this.breakTime>0){
                    this.attendToast = true;
                    this.toastText = '重复打卡了，请间隔1分钟后再试';
                    return;
                }else{
                    this.breakTime = 60;
                    this.timer = setTimeout(this.countdownTime);
                };
                this.isInDistance().then(isIn => {
                    if (!isIn) {
                        this.toastText = '不在考勤范围内，打卡失败';
                        this.attendToast = true;
                        return;
                    } else {
                        // 显示确认更新dialog
                        this.updateConfirm = true;
                    }
                });
            },
            // 按钮计时器
            setTimeNow: (function() {
                let timeNowID = '';
                return function() {
                    // this.offWork.time && clearInterval(timeNowID);
                    let time = this.offWork.time || Date.now();
                    this.timeNow = dateFormat(time, 'M/D HH:mm:ss');
                    timeNowID = timeNowID || setInterval(_ => {
                        this.offWork.time || this.setTimeNow();
                    }, 1000);
                }
            })(),
            /*
            *  计算当前位置到办公地点的距离
            */
            async getDistance(local) {
                let success = this.setLocalList
                return success.map(item => {
                    var list = item.attendancePointsLAddress.split(',')
                    var La1 = list[1] * Math.PI / 180.0;
                    var La2 = (local.latitude - 0.0031) * Math.PI / 180.0
                    var La3 = La1 - La2;
                    var Lb3 = list[0] * Math.PI / 180.0 - (Number(local.longitude) + 0.0047) * Math.PI /   180.0;

                    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));

                    s = s * 6378137.0; //地球半径(单位：m)
                    s = Math.round(s * 10000) / 10000;
                    return s
                })
            },
            /*
            * 判断是否在打卡范围
            */
            isInDistance() {
                return new Promise((resolve, reject) => {
                    let _this = this;
                    wx.ready(function() {
                        wx.getLocation({
                            type: 'wgs84',
                            success: async function(res) {
                                let distance = await _this.getDistance(res);
                                _this.inDistance = distance.some(item => item < 800);
                                resolve(_this.inDistance);
                            },
                            fail: function() {
                                //定位失败跳转
                                _this.$router.push({
                                    path:'/errortip'
                                });
                                reject();
                            }
                        })
                    })
                })
            },
            gpsLocation() {
                if (this.inDistance) {
                  return
                };
                this.isInDistance().finally(res => {
                    setTimeout(() => {
                        this.gpsLocation()
                    }, 3000)
                })
            },
            /*
            *  重新加载
            */
            reload() {
                this.$router.push({ path: '/attendance' })
            }
        },
        beforeRouteEnter(to, from, next) {
            next(async vm => {
                vm.loading = true
                vm.setTimeNow();
                vm.getNetStatus();
                vm.getUserAttendance();
                let success = await vm.getWorkPlace();
                if (success) {
                  vm.gpsLocation()
                }
                vm.loading = false
            })
        },
        async created() {},
        async activated() {}
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
    .btn {
        width: 100rem/20;
        line-height: 30rem/20;
        font-size: 12rem/20;
        background: #fff;
        border: 1px solid #979797;
    }
}

.attend-panel {
    text-align: left;
    height: 206rem / 20;
    .attend-title {
        font-size: 12rem / 20;
        color: #9A9A9A;
        margin: 20rem / 20 20rem / 20 0;
    }
}

.attend-timeline {
    font-size: 22rem / 20;
    padding: 0 !important;
    margin-left: -20rem / 20;
    -webkit-transform: scale(0.8);
    color: #212121;

    .attend-item {
        strong {
            float: left;
        }
        .label {
            font-size: 18rem / 20;
            margin-left: 2rem / 20;
            transform: scale(0.8);
        }
    }

    .vux-timeline-item {
        height: 4.8rem;
        &.active {
            .vux-timeline-item-color {
                background-image: linear-gradient(-180deg, #81D2FF 0%, #5698F6 100%);
                box-shadow: 0 2px 6px 0 rgba(67, 166, 246, 0.31);
            }
        }
        &:first-child {
            .vux-timeline-item-color {
                margin-top: 6rem / 20;
            }
        }
    }
    .vux-timeline-item-head-first {
        width: 10rem / 20;
        height: 10rem / 20;
        left: 1rem / 20; // margin-top:6rem / 20;
    }
    .vux-timeline-item-checked {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        left: 1px; // margin-top:6rem / 20;
        &:before {
            content: '';
        }
    }
    .vux-timeline-item-color {
        margin-top: 8rem / 20;
    }
    .vux-timeline-item-color,
    .vux-timeline-item-tail {
        background: #BEBEBE;
    }
    .vux-timeline-item-tail {
        width: 1rem / 20;
        top: 12rem / 20;
    }
    .attend-update {
        color: #3A8DE3;
        font-size: 18rem / 20;
    }
    .icon-primary {
        fill: #3A8DE3;
        width: 1em;
        height: 1em;
    }
}

.attend-action {
    @size: 132rem / 20;
    width: @size;
    height: @size;
    line-height: 1.6;
    padding-top: 40rem / 20;
    margin: 0 auto 20rem / 20;
    border-radius: 100%;
    background-image: linear-gradient(-180deg, #81D2FF 0%, #5698F6 100%);
    box-shadow: 0 10px 12px 0 rgba(67, 166, 246, 0.31);
    text-align: center;
    box-sizing: border-box;

    &[disabled] {
        background-image: linear-gradient(-180deg, #D2D2D2 0%, #B6B6B6 100%);
        box-shadow: none;
        .action-time {
            color: #FFF;
        }
    }
    .action-title {
        font-size: 20rem / 20;
        color: #FFFFFF;
    }
    .action-time {
        font-size: 14rem / 20;
        color: #B4DEFF;
    }
    .weekend-icon {
        display: inline-block;
        width: 32rem / 20;
        height: 35rem / 20;
    }
    .weekend-title {
        margin-top: 20rem / 20;
        font-size: 16rem / 20;
        color: #FFFFFF;
    }
}

  .action-desc {
    font-size: 12rem / 20;
    color: #656565;
    .icon-success {
      fill: #68CA6F;
      width: 1em;
      height: 1em;
      margin-top: -4rem / 20;
    }
    .icon-warn {
      font-size: 12rem / 20;
      color: #FFA93B;
      margin-top: -4rem / 20;
    }
  }

  .leaveEarlyConfirm {
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

  .attendsucc-dialog .weui-dialog {
    width: 281rem / 20;
    border-radius: 8px;
    max-width: initial;
  }

  .attendsucc-body {
    height: 213rem / 20;
    padding-top: 96rem / 20;
    img {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .alert-icon {}
    .alert-title {
      // margin-top: 10rem / 20;
      font-size: 26rem / 20;
      color: #FFFFFF;
    }
    .alert-desc {
      font-size: 14rem / 20;
      color: #B4D8FF;
    }
    .alert-time {
      margin-top: 15rem / 20;
      font-size: 30rem / 20;
      color: #FFFFFF;
    }
  }

  .attendsucc-footer {
    line-height: 46rem / 20;
    font-size: 16rem / 20;
    color: #FFFFFF;
    letter-spacing: 0;
  }

</style>
<style scoped lang="less">
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
  }

</style>
