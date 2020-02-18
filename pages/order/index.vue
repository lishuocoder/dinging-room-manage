<template>
	<view class="content">
		<view class="test-flex">
			<view class='test-item' v-for="item in deskList">
				<zai-lattice shadow
					:progressPercent = 'time(item)'
					 title='座位'
					:numColor='textColor(item.id)'
					:num='item.id' 
					:unit='statusName(item.status).name'
					 type='img' 
					:src='statusName(item.status).img' 
					@click="latticeClick(item.id,item.order.id)"
				/>
			</view>
		</view>
	</view>
</template>

<script>
	import zaiLattice from "@/components/zai-lattice";
	export default {
		components:{
			zaiLattice
		},
		data() {
			return {
				deskList:[],
				statusNames: {
					status_1:{
						name:'空闲',
						img:'../../static/img/Free.png'
					},
					status_2:{
						name:'就餐中',
						img:'../../static/img/Busy.png'
					}
				},
				textColors:[
					'#00d969',
					'#1495e7',
					'#dc4f43',
					'#b3693c',
					'#fee082'
				]
				
			}
		},
		onShow() {
				//服务端查看订单接口
				uni.request({
					url: this.$apiPath+"?m=admin&c=index&a=desks",
					dataType: 'json',
					success: (res) => {
						console.log(res.data.data)
						this.deskList=res.data.data
					}
				})
		},
		methods: {
			time(order){
				if (order.status == 1) {
					return 0;
				}
				var nowtimestamp = Date.parse(new Date())/1000;//获取当前时间(秒)
				var Time = new Date(order.order.start_time);
				var timestemp =Time.getTime()/1000;//订单时间(秒)
				var timeNum=parseInt((nowtimestamp-timestemp)/60);
				console.log("当前时间:"+nowtimestamp,"订单时间:"+timestemp,"返回的分钟:"+timeNum)
				return timeNum
			},
			statusName(status) {
				var statusStr = 'status_' + status;
				return this.statusNames[statusStr]
			},
			textColor(id){
				let yushu = id%this.textColors.length
				return this.textColors[yushu]
			},
			latticeClick(id,orderid) {		
				console.log("座位号"+id,"订单id"+orderid)
				uni.navigateTo({
				    url: '/pages/order/singleOrder?desk_id='+id+'&order_id='+orderid,
				});
			}
		}
	}
</script>

<style>
	page{
		background: #2D335A;
		background-image: linear-gradient(45deg,#4D395C,#253155);
		height: 100%;
	}
	//简单的栅格处理 CSS
	.test-flex{
		position: relative;
		display: flow-root;
		width: 100%;
	}
	.test-flex .test-item{
		float: left;
		width: 40%;
		margin: 5%;
	}
</style>
