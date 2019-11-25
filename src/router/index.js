import Vue from 'vue'
import Router from 'vue-router'
import Attendance from '@/views/attendance.vue'
import Count from '@/views/count/count.vue'
import Apply from '@/views/apply/apply.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
        path: '/', 
        redirect: '/attendance',
        component:resolve => { require(['@/views/main.vue'], resolve) },
        children:[
            {
                // 考勤休假
                name: 'attendance',
                path: '/attendance',
                meta: {
                    title: '打卡'
                },
                component: resolve => { require(['@/views/attendance.vue'], resolve) }
                // component:Attendance
            },
            {
                // 统计
                name: 'count',
                path: '/count',
                meta: {
                    title: '统计'
                },
                component: resolve => { require(['@/views/count/count.vue'], resolve) }
                // component:Count
            },
            {
                // 申请
                name: 'apply',
                path: '/apply',
                meta: {
                    title: '申请'
                },
                component: resolve => { require(['@/views/apply/apply.vue'], resolve) }
                // component:Apply
            }
        ]
    },
    {
        // 申请
        name: 'holidays',
        path: '/holidays',
        meta: {
            title: '剩余假期'
        },
        component: resolve => { require(['@/views/holidays.vue'], resolve) }
    },{
        // 申请
        name: 'record',
        path: '/record',
        meta: {
            title: '申请记录'
        },
        component: resolve => { require(['@/views/record.vue'], resolve) }
    },
    {
        // 网络异常
        name: 'error',
        path: '/error',
        meta: {
            title: '网络异常'
        },
        component: resolve => { require(['@/components/noNetWork.vue'], resolve) }
    },
    {
        // 网络异常
        path: '/errortip',
        name:'errortip',
        component: resolve => { require(['@/views/errortip.vue'], resolve) }
    }
  ]
})
// router.beforeEach((to, from, next) => {//beforeEach是router的钩子函数，在进入路由前执行
//     if (to.meta.title) {//判断是否有标题
//         document.title = to.meta.title
//     };
//     next()//执行进入路由，如果不写就不会进入目标页
// })
export default router