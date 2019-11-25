<template>
	<div class="container">
		<tab :line-width='1' active-color='#2b85e4'>
	      <tab-item selected @on-item-click="onItemClick">剩余休假</tab-item>
	      <tab-item @on-item-click="onItemClick">已过期假期</tab-item>
	    </tab>
		<div v-if='showIndex==0'>
			<div class="tips">
				<span>
					tips：剩余年休天数为在职至年底的可休假天数
					<a href="javascript:;" @click='dialog=true'>如何计算？</a>
				</span>	
				<!-- <p>年休假天数计算规则</p>
				<p>
					计算：目前可休年假天数=当年度在职天数÷365天×职工本人全年享有的年休假天数。当天数不为整数时，小数点后一位向前取数，大于0.5不足1天时，取0.5天，小于0.5天时，取0天。
				</p>
				<p>
					示例：一名员工当年在职210天，全年享有年休假5天，本年可休年假天数=210÷365×5=2.88≈2.5天
				</p> -->
			</div>
			<div class="card">
				<div class="name">
					<span class="fl holiday_name purple">年休假</span>
					<span class="fr right">剩余{{holidays.totalAnnual}}天</span> 
				</div>
				<div class="holiday_info" v-if='holidays.totalAnnual>0'>
					<ul>
						<li class="clear">
							<span class="fl">剩余假期</span>
							<span class="fr right">过期时间</span> 
						</li>
						<li class="clear" v-if='holidays.rest.annualLeaveCount>0'>
							<span class="fl">{{holidays.rest.annualLeaveCount}}天</span>
							<span class="fr right">{{holidays.rest.annualLeaveCountTime}}</span>
						</li>
						<li class="clear" v-if='holidays.rest.nextAnnualLeaveCount>0'>
							<span class="fl">{{holidays.rest.nextAnnualLeaveCount}}天</span>
							<span class="fr right">{{holidays.rest.nextAnnualLeaveCountTime}}</span>
						</li>
					</ul>
				</div>
				
			</div>
			<div class="card">
				<div class="name">
					<span class="fl holiday_name orange">司龄假</span>
					<span class="fr right">剩余{{holidays.totalAgesham}}天</span> 
				</div>
				<ul class="holiday_info" v-if='holidays.totalAgesham>0'>
					<li class="clear">
						<span class="fl">剩余假期</span>
						<span class="fr right">过期时间</span> 
					</li>
					<li class="clear" v-if='holidays.rest.ageshamLeaveCount>0'>
						<span class="fl">{{holidays.rest.ageshamLeaveCount}}天</span>
						<span class="fr right">{{holidays.rest.ageshamLeaveCountTime}}</span>
					</li>
					<li class="clear" v-if='holidays.rest.nextAgeshamLeaveCount>0'>
						<span class="fl">{{holidays.rest.nextAgeshamLeaveCount}}天</span>
						<span class="fr right">{{holidays.rest.nextAgeshamLeaveCountTime}}</span>
					</li>
				</ul>
			</div>
			<div class="card">
				<div class="name">
					<span class="fl holiday_name green">调休假</span>
					<span class="fr right">剩余{{holidays.totalTwl}}天</span> 
				</div>
				<ul class="holiday_info" v-if='holidays.totalTwl>0'>
					<li class="clear">
						<span class="fl">剩余假期</span>
						<span class="fr right">过期时间</span> 
					</li>
					<li class="clear" v-for='item,index of holidays.twl' :key='index' v-if='item.dateCount>0'>
						<span class="fl">{{item.dateCount}}天</span>
						<span class="fr right">{{item.endDate}}</span>
					</li>
					<!-- <li class="clear">
						<span class="fl">{{holidays.rest.nextAgeshamLeaveCount}}天</span>
						<span class="fr right">{{holidays.rest.nextAgeshamLeaveCountTime}}</span>
					</li> -->
				</ul>
			</div>
		</div>
		<div v-if='showIndex==1'>
			<div class="card" v-if='dayOff.annual.length>0&&!showNoInfo'>
				<div class="name">
					<span class="fl holiday_name blue">年休假</span>
				</div>
				<div class="holiday_info">
					<ul>
						<li class="clear">
							<span class="fl">过期天数</span>
							<span class="fr right">过期时间</span> 
						</li>
						<li class="clear" v-for='item,index of dayOff.annual' :key='index'>
							<span class="fl">{{item.dayCount}}天</span>
							<span class="fr right">{{item.time}}</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="card" v-if='dayOff.agesham.length>0&&!showNoInfo'>
				<div class="name">
					<span class="fl holiday_name red">司龄假</span>
				</div>
				<ul class="holiday_info">
					<li class="clear">
						<span class="fl">过期天数</span>
						<span class="fr right">过期时间</span> 
					</li>
					<li class="clear" v-for='item,index of dayOff.agesham' :key='index'>
						<span class="fl">{{item.dayCount}}天</span>
						<span class="fr right">{{item.time}}</span>
					</li>
				</ul>
			</div>
			<div class="card" v-if='dayOff.twl.length>0&&!showNoInfo'>
				<div class="name">
					<span class="fl holiday_name yellow">调休假</span>
				</div>
				<ul class="holiday_info">
					<li class="clear">
						<span class="fl">过期天数</span>
						<span class="fr right">过期时间</span> 
					</li>
					<li class="clear" v-for='item,index of dayOff.twl' :key='index'>
						<span class="fl">{{item.dayCount}}天</span>
						<span class="fr right">{{item.time}}</span>
					</li>
				</ul>
			</div>
			<div class="noinfos" v-if='showNoInfo'>
				<img src="../assets/images/nothing.png" alt="">
				<p>暂无已过期数据</p>
			</div>	
		</div>
		<div class="mask" v-show='dialog' @touchmove.prevent='' @click='dialog=false'>
			<div class="tips_words" @click.stop=''>
				<h2 class="title">年休假天数计算规则</h2>
				<div class="article">
					<div class="rule">
						<span class="labels">计算：</span>
						<span class="example">
							目前可休年假天数=当年度在职天数÷365天×职工本人全年享有的年休假天数。当天数不为整数时，小数点后一位向前取数，大于0.5不足1天时，取0.5天，小于0.5天时，取0天。
						</span>
					</div>
					<div class="rule margintop">
						<span class="labels">示例：</span>
						<span class="example">一名员工当年在职210天，全年享有年休假5天，本年可休年假天数=210÷365×5=2.88≈2.5天</span>
					</div>
				</div>
				<div class="btn">
					<span @click='dialog=false'>我知道了</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	// import { Flexbox, FlexboxItem } from 'vux'
  	import api from '@/assets/js/api'
  	import { Tab, TabItem } from 'vux'
	export default {
		data(){
			return {
				showNoInfo:false,
				showIndex:0,
        		workCode: this.getCookie('username'), // 工号
        		holidays:{
        			rest:{}
        		},
        		dialog:false,
        		dayOff:{
        			annual:[],
        			agesham:[],
        			twl:[],
        		},
			}
		},
		// components: {
		//     Flexbox,
		//     FlexboxItem
		// },
		components: {
		    Tab,
		    TabItem
		},
		methods:{
			onItemClick(index){
				this.showIndex = index;
			},
			getUserInfo(){
				api(`/attendance/annualDayoff/restDetail?workCode=` + this.workCode).then(res=>{
					if(res.success){
						this.holidays = res.data;
					}
				})
			},
			getUserDayoff(){
				api(`/attendance/annualDayoff/expired?workCode=` + this.workCode).then(res=>{
					if(res.success){
						let data = Object.assign(this.dayOff,res.data);
						if(data.agesham.length<1&&data.annual.length<1&&data.twl.length<1){
							this.showNoInfo = true;
						}else{
							this.dayOff = data;
						}
					}
				})
			}
		},
		mounted(){
			this.getUserInfo();
			this.getUserDayoff();
		}
	}
</script>
<style lang="less" scoped>
	.container{
		height: 100%;
		// padding:10rem/20 10rem/20 0;
		background: #f5f5f5;
	}
	.card{
		background:#fff;
		box-shadow: 0 2px 15px 0 rgba(149,149,149,0.22);
		margin:10rem/20 10rem/20 0;
		border-radius:4px;
		padding:0 10rem/20;
		// margin-bottom:10rem/20;
		font-size:14rem/20;
	}
	.holiday_name{
		color: #333;
		position: relative;
		padding-left:1rem;
	}
	.holiday_info{
		border-top: 1px solid #eee;
		padding:10rem/20 0 10rem/20 20rem/20; 
	}
	.name{
		overflow: hidden;
		line-height: 30rem/20;
		font-size:16rem/20;
		padding:5px 0;
	}
	.name .right{
		color: #2b85e4
	}
	.right{
		width:100rem/20;
		text-align: left;
	}
	.clear{
		overflow:hidden;
	}
	.purple::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:purple;
	}
	.orange::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:orange;
	}
	.green::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:#228b22;
	}
	.blue::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:#1E90FF;
	}
	.red::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:#FF6A6A;
	}
	.yellow::after{
		content:'';
		height: 10rem/20;
		width: 10rem/20;
		position:absolute;
		left:5rem/20;
		top:10rem/20;
		border-radius:50%;
		background:#FFD700;
	}
	.noinfos{
		padding-top: 70rem/20;
		text-align: center;
		img{
			width: 100rem/20;
		}
		p{
			font-size: 14rem/20;
			color: #555;
		}
	}
	.tips{
		text-align: left;
		margin-left:14rem/20;
		margin-top: 8rem/20;
		line-height: 14rem/20;
		font-size: 12rem/20;
		span{
			font-size: 12rem/20;
			color:#ff461f;
			a{
				color:#2b85e4;
				text-decoration: underline;
			}
		}
	}
	.mask{
		top:0;
		position:fixed;
		background:rgba(0,0,0,.3);
		width: 100%;
		height: 100%;
		text-align: left;
		.tips_words{
			border-radius:8rem/20;
			padding:10rem/20;
			background:#fff;
			margin:105rem/20 10rem/20 0;
		}
		.title{
			margin-bottom: 8rem/20;
			font-size: 16rem/20;
		}
		.article{
			font-size: 14rem/20;
			.labels{
				font-weight: 700;
			}
			.example{
				color:#323232;
			}
		}
		.margintop{
			margin-top:18rem/20;
		}
		.btn{
			margin-top: 14rem/20;
			margin-right: 16rem/20;
			text-align: right;
			color:#2b85e4;
			font-size: 14rem/20;
		}
	}
</style>

















