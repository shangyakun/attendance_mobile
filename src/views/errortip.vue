<template>
	<div class="network-fail">
      <img class="netfailed" src="../assets/images/netfailed.png" alt="">
      <div class="network-desc">企微接口出错，定位服务暂时无法使用<br/>请稍后再试</div>
    </div>
</template>
<script>
	export default{
		name:'error'
	}
</script>
<style lang="less" scoped>
	.network-fail {
		position: absolute;
		top:0;
		bottom: 0;
		width: 100%;
		background: #fff;
		height:100%;
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