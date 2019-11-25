<template>
	<div class="footerView">
        <!-- <flexbox :gutter="0" wrap="wrap">
            <flexbox-item align="center"> -->
                <div class='link' @click='$router.push({path:"attendance"})'>
                    <div class="flex-demo-img">
                      <img v-show="$route.name!='attendance'" src="@/assets/images/attendance.svg" />
                      <img v-show="$route.name=='attendance'" src="@/assets/images/attendance-hover.svg" />
                    </div>
                    <div :class="[$route.name!='attendance' ? 'noHover' : 'hover','word']">打卡</div>
                </div>
            <!-- </flexbox-item>
            <flexbox-item :span="1/3" align="center"> -->
                <div @click='$router.push({path:"count"})' class='link'>
                    <div class="flex-demo-img">
                        <img v-show="$route.name!='count'" src="@/assets/images/count.svg" />
                        <img v-show="$route.name=='count'" src="@/assets/images/count-hover.svg" />
                    </div>
                    <div :class="[$route.name!='count' ? 'noHover' : 'hover','word']">统计</div>
                </div>
            <!-- </flexbox-item> -->
            <!-- <flexbox-item :span="1/3" align="center"> -->
                <div class='link' @click='$router.push({path:"apply"})' >
                    <div class="flex-demo-img">
                      <img v-show="$route.name!='apply'" src="@/assets/images/apply.svg" />
                      <img v-show="$route.name=='apply'" src="@/assets/images/apply-hover.svg" />
                    </div>
                    <div :class="[$route.name!='apply' ? 'noHover' : 'hover','word']">申请</div>
                </div>
            <!-- </flexbox-item>
        </flexbox> -->
	</div>
</template>
<script>
// import { Flexbox, FlexboxItem } from 'vux'
export default {
    name: 'footerView',
    // components: {
    //     Flexbox,
    //     FlexboxItem
    // }
}
</script>
<style lang="less">
.footerView{
    // height: 37rem/20;
    height: 50rem/20;
    // padding:4rem/20 71rem/20 9rem/20 ;
    padding:0 61rem/20 0 60rem/20;
    background: #FAFAFA;
    position: fixed;
    bottom: 0;
    left:0;
    right:0;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 320px) {
        height: 50rem/17.0667;
    }
    .link{
        width: 46rem/20;
        padding-top:4rem/20;
        text-align: center;
        .flex-demo-img{
            height:26rem/20;
            text-align: center;
        }
        .word{
            font-size:12rem/20;
            margin-top:2px;
        }
        .noHover{
            color: #9B9B9B;
        }
        .hover{
            color: #467DB9;
        }
    }
    
    // .flex-demo{
    //     float: left;
    //     font-size: 0;
        
    //     p
    //     img{
    //       width:26rem/20;
    //     }
    //     .noHover{
    //         color: #9B9B9B;
    //     }
    //     .hover{
    //         color: #467DB9;;
    //     }
    // }
    // .flex-demo-left{
    //   img{
    //     width:26rem/20;
    //   }
    // }
    // .flex-demo-center{
    //   margin:0 79rem/20 0 77rem/20;
    //   img{
    //     width:26rem/20;
    //   }
    // }
}
</style>

