<template>
	<div class="container">
		<div class="header">
			<tab :line-width='1' active-color='#2b85e4' prevent-default @on-before-index-change='switchTabItem' v-model='showIndex' :scroll-threshold='5'>
		      	<tab-item selected>全部</tab-item>
		      	<tab-item>请假</tab-item>
		      	<tab-item>加班</tab-item>
		      	<tab-item>出差</tab-item>
		      	<tab-item>公出</tab-item>
		      	<!-- <tab-item >请假</tab-item> -->
		    </tab>
		</div>
	    <div class="reocrd" v-if='!showNoData'>	
			<div class="card" v-for='item,index of oaWorkFlowList' :key='index'>
				<div class="name">
					<span class="fl holiday_name orange">{{typeArr[item.type]}}</span>
					<span class="fl oatype" v-if="item.nodename.indexOf('归档')>=0" style='color:#00FF7F'>归档</span>
					<span class="fl oatype" v-if="item.nodename.indexOf('归档')<0" style='color:#FFB90F;'>审批中</span>
					<span class="fr right">{{item.createDate}}</span> 
				</div>
				<div class="holiday_info">
					<ul v-if='item.type==1'>
						<li class="clear">
							<span class="fl">公出天数</span>
						</li>
						<li class="clear">
							<span class="fl">开始时间</span>
							<span class="fr right">{{item.startDate}}{{item.startTime}}</span>
						</li>
						<li class="clear">
							<span class="fl">结束时间</span>
							<span class="fr right">{{item.endDate}}{{item.endTime}}</span>
						</li>
					</ul>
					<ul v-if='item.type==2'>
						<li class="clear">
							<span class="fl">加班天数</span>
							<span class="fr right">{{item.days}}天</span>
						</li>
						<li class="clear">
							<span class="fl">开始时间</span>
							<span class="fr right">{{item.startDate}}{{item.startTime}}</span>
						</li>
						<li class="clear">
							<span class="fl">结束时间</span>
							<span class="fr right">{{item.endDate}}{{item.endTime}}</span>
						</li>
					</ul>
					<ul v-if='item.type==3'>
						<li class="clear">
							<span class="fl">出差天数</span>
							<span class="fr right">{{item.days}}天</span>
						</li>
						<li class="clear">
							<span class="fl">开始时间</span>
							<span class="fr right">{{item.startDate}}{{item.startTime}}</span>
						</li>
						<li class="clear">
							<span class="fl">结束时间</span>
							<span class="fr right">{{item.endDate}}{{item.endTime}}</span>
						</li>
					</ul>
					<ul v-if='item.type==4'>
						<li class="clear">
							<span class="fl">请假天数</span>
							<span class="fr right">{{item.days}}天</span>
						</li>
						<li class="clear">
							<span class="fl">开始时间</span>
							<span class="fr right">{{item.startDate}}{{item.startTime}}</span>
						</li>
						<li class="clear">
							<span class="fl">结束时间</span>
							<span class="fr right">{{item.endDate}}{{item.endTime}}</span>
						</li>
					</ul>
				</div>
			</div>
			<!-- <div class="card">
				<div class="name">
					<span class="fl holiday_name">司龄假</span>
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
					<span class="fl holiday_name">调休假</span>
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
					
				</ul>
			</div> -->
		</div>	
		<div class="nothing" v-if='showNoData'>
			<img src="../assets/images/nothing.png" alt="">
			<p>暂无此审批数据</p>
		</div>
      	<loading :show="loading" text="加载中"></loading>
	</div>
</template>
<script>
	import { Loading } from 'vux'
  	import api from '@/assets/js/api'
  	import { Tab, TabItem } from 'vux'
	export default {
		data(){
			return {
				loading:false,
				typeArr:['全部类型','公出','加班','出差','请假','申诉'],
				showIndex:0,
				oaWorkFlowList:[],
				showNoData:false,
			}
		},
		components: {
		    Tab,
		    TabItem,
		    Loading
		},
		methods:{
			switchTabItem(index){
				this.showIndex = index;
				let i = 0;
				switch (index) {
					case 1:
						i=4;
						break;
					case 4:
						i=1;
						break;
					default:
						i=index
						break;
				};
				this.getOaWorkflow(i);
			},
			getOaWorkflow(index=0){
				this.loading = true;
				api('/attendance/attendance/getOaWorkflowList','get',{
					workCode:this.getCookie('username'),
					type:index,
					pageNum:1,
					pageSize:0

				}).then(res=>{
					if(res.success){
						setTimeout(()=>{
						this.loading = false;
							if(res.data.length===0){
								this.showNoData = true;
							}else{
								this.oaWorkFlowList = res.data;
								this.showNoData = false;
							};
						},600)
						
						// let data = res.data;
						// for(let i=0;i<data.length;i++){
						// 	data[i].flowType = this.typeArr[data[i].type];
						// }
						// console.log(data)
					}else{
						this.loading = false;
					}
				})
			},
		},
		// mounted(){
		// 	this.getOaWorkflow();
		// },
		beforeRouteEnter(to, from, next) {
	      	next(async vm => {
	        	vm.getOaWorkflow();
	        	vm.showIndex=0;
	      	})
	    }
	}
</script>
<style lang="less" scoped>

	.container{
		height: 100%;
		// padding:10rem/20 10rem/20 0;
		background: #f5f5f5;
		padding-top:44rem/20;
	}
	.header{
		position:fixed;
		top:0;
		width: 100%;
		height: 44rem/20;
		z-index: 999;
		background:#fff;
	}
	.card{
		background:#fff;
		box-shadow: 0 2px 15px 0 rgba(149,149,149,0.22);
		margin:10rem/20 10rem/20 0;
		border-radius:4px;
		padding:0 10rem/20;
		font-size:14rem/20;
	}
	.holiday_name{
		color: #333;
		position: relative;
		padding-left:1rem;
	}
	.oatype{
		padding-left:1rem;
		font-size: 12rem/20;
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
		color: #2b85e4;
		font-size: 14rem/20;
	}
	.right{
		text-align: left;
		width:150rem/20;
	}
	.clear{
		overflow:hidden;
	}
	.nothing{
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
</style>







