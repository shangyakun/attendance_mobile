import api from '../assets/js/api'
let url = window.location.href
api(`/attendance/common/ticket?url=` + url).then(res => {
  if (res.errorCode == '200') {
    wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'ww76673d8a0d7cd9d7', // 必填，企业微信的corpID
      timestamp: '1414587466', // 必填，生成签名的时间戳
      nonceStr: 'Wm3WZYTPz0wzccnC', // 必填，生成签名的随机串
      signature: res.data, // 必填，签名，
      jsApiList: ['getNetworkType', 'onNetworkStatusChange', 'getLocation', 'startAutoLBS', 'onLocationChange'] // 必填，需要使用的JS接口列表，所有JS接口列表
    });
  }
})