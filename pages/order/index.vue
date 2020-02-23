<template>
	<view class="content">
		<view class="test-flex">
			<view class='test-item' v-for="(item,index) in deskList" :key="index">
				<zai-lattice shadow :progressPercent='time(item)' :progressColor='textColor(item.id)' title='桌位' :numColor='textColor(item.id)'
				 :num='item.id' :unit='statusName(item.status).name' type='img' :src='statusName(item.status).img' @click="latticeClick(item.id,item.order.id)" />
			</view>
		</view>
		<warningBox v-model="show" :title="msgDeskId+'号桌发现新订单'" text='点击确认查看该订单' @confirm='confirm' />
	</view>
</template>

<script>
	import zaiLattice from "@/components/zai-lattice";
	import warningBox from "@/components/warning-box/warning-box.vue";
	export default {
		components: {
			zaiLattice,
			warningBox
		},
		data() {
			return {
				deskList: [],
				statusNames: {
					status_1: {
						name: '空闲',
						img: '../../static/img/Free.png'
					},
					status_2: {
						name: '就餐中',
						img: '../../static/img/Busy.png'
					}
				},
				textColors: [
					'#00d969',
					'#1495e7',
					'#dc4f43',
					'#b3693c',
					'#fee082'
				],
				Token: 0,
				show: false,
				msgDeskId: 0,
				msgOrderId: 0
			}
		},
		onShow() {
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.Token = res.data
				}
			});
			this.newOrder()
			setInterval(function() {
				//获取最新订单接口
				uni.request({
					url: this.$apiPath + "?m=admin&c=message&a=one",
					data: {
						"token": this.Token
					},
					success: (res) => {
						if (res.data.data != null) {
							this.ScanAudio();
							// console.log(res.data.data)
							this.msgDeskId = res.data.data.content.desk_id;
							this.msgOrderId = res.data.data.content.order_id;
							this.show = true;
							this.newOrder(); //刷新桌位状态
						} else {
							this.newOrder(); //刷新桌位状态
						}
					}
				})
			}.bind(this), 2000)
			uni.hideLoading();
		},
		methods: {
			//查看订单方法(各个桌位状态)
			newOrder() {
				//服务端查看订单接口(各个桌位状态)
				uni.request({
					url: this.$apiPath + "?m=admin&c=index&a=desks",
					dataType: 'json',
					data: {
						"token": this.Token
					},
					success: (res) => {
						// console.log(res.data.data)
						if (res.data.error == 0) {
							this.deskList = res.data.data
						} else {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				})
			},
			time(order) {
				if (order.status == 1) {
					return 0;
				}
				var nowtimestamp = Date.parse(new Date()) / 1000; //获取当前时间(秒)
				var order_start_time = order.order.start_time.replace(/\-/g, '/');
				var Time = new Date(order_start_time);
				var timestemp = Time.getTime() / 1000; //订单时间(秒)
				var timeNum = parseInt((nowtimestamp - timestemp) / 60);
				timeNum = timeNum > 100 ? 100 : timeNum
				// console.log("当前时间:"+nowtimestamp,"订单时间:"+timestemp,"返回的分钟:"+timeNum)
				return timeNum
			},
			statusName(status) {
				var statusStr = 'status_' + status;
				return this.statusNames[statusStr]
			},
			textColor(id) {
				let yushu = id % this.textColors.length
				return this.textColors[yushu]
			},
			//点击弹框确认
			confirm() {
				this.latticeClick(this.msgDeskId, this.msgOrderId)
			},
			latticeClick(id, orderid) {
				console.log("座位号" + id, "订单id" + orderid)
				uni.navigateTo({
					url: '/pages/order/singleOrder?desk_id=' + id + '&order_id=' + orderid,
				});
			}
		}
	}
</script>

<style>
	page {
		background: #2D335A;
		background-image: linear-gradient(45deg, #4D395C, #253155);
		height: 100%;
	}

	//简单的栅格处理 CSS
	.test-flex {
		position: relative;
		display: flow-root;
		width: 100%;
	}

	.test-flex .test-item {
		float: left;
		width: 40%;
		margin: 5%;
	}

	.test-flex .test-item:active {
		transform: translate(2rpx, 2rpx);
	}
</style>
