import Vue from 'vue'
import _axios from 'axios';
// import router from '../../router'
import { ToastPlugin } from 'vux'
import config from './config'
Vue.use(ToastPlugin)
// var apiRoot = process.env.NODE_ENV == 'development' ? '' : config.baseUrl;
const axios = _axios.create({
  // baseURL: apiRoot,
  headers: {
    'contentType': 'application/json;'
  }
});
axios.interceptors.response.use(
    res => {
        if (res.data.errorCode != '200' && res.data.errorCode != '100018' && res.data.errorCode != '100023' && res.data.errorCode != '100022' && res.data.errorCode != '100024' && res.data.errorCode != '10000' && res.data.errorCode != '9999') {
            let message = res.data.message || res.data.errorMsg;
            Vue.$vux.toast.text(message, 'middle')
        };
        return res.data;
    },
    err => {
        Vue.$vux.toast.text('服务器异常', 'middle')
        Promise.reject(err);
    }
);
export default (url, method, data, headers) => {
    axios.defaults.withCredentials=true;
    // axios.defaults.baseURL = 'http://';
    axios.defaults.baseURL = 'http://';
    return axios(Object.assign({
        url: url,
        method: method || 'POST',
        headers
    }, method == 'get' ? {
        params: data
    } : { data }));
};
