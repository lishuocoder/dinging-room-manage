<template>
	<view class="body">
		<view class="time_clock  ">
			<image class="clock_image" src="/static/img/clock.png"></image>
			<view class="goods_time">{{order_time}}</view>
		</view>
		<view class="main">
			<view class="goods" v-for="(item,index) in formList" :key="index">
				<image :src="item.img" />
				<view>
					<view>{{item.name}}</view>
					<view class="num">数量:{{item.num}}</view>
					<view class="money">￥{{item.food_price}}</view>
					<transition name="fade">
						<image src="../../static/img/del.png" class="del_img" :class="{open:display}" @click="del(item,index)"></image>
					</transition>
				</view>
			</view>
		</view>
		<center>
			<hr style="border-top:0.5rpx solid #a1a0b5; width: 80%; size: 1rpx; align:center;" />
		</center>

		<view class="bottom_money">
			<text class="need_pay"> 合计：</text>
			<text class="totalMoney">￥{{total_price}}</text>
		</view>
		<view class="state_btn">
			<text class="_btn" @click="revise()">{{text}}</text>
			<text class="_btn2" @click="Settlement()">结算</text>
		</view>
		<warningBox v-model="show" title='结算该订单' text='是否结算该订单?确认后无法取消!!!' @confirm='confirm' />
	</view>
</template>

<script>
	import warningBox from "@/components/warning-box/warning-box.vue";
	export default {
		components: {
			warningBox
		},
		data() {
			return {
				orderId: null,
				list: [],
				order_time: 2020,
				total_price: {},
				display: true,
				text: "修改订单",
				show: false,
				Token: 0
			}
		},
		onLoad(option) {
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.Token = res.data
				}
			});
			console.log(option.desk_id)
			console.log(option.order_id)
			this.orderId = option.order_id
			//调用查看订单接口
			this.lookOrder(option.order_id);
		},
		computed: {
			//增加一个过滤器，将list里的菜品个数等于0的菜品过滤出去，返回个数非0的菜品
			formList: function() {
				return this.list.filter(function(item) {
					if (item.num != 0) {
						return item;
					}
				})
			}
		},
		methods: {
			revise() {
				this.display = !this.display;
				if (this.text == "修改订单") {
					this.text = "确认";
				} else {
					this.text = "修改订单";
				}
				// 震动反馈
				uni.vibrateShort({
					success: function() {
						console.log('success');
					}
				});
			},
			lookOrder(order_id) {
				//服务端查看订单接口
				uni.request({
					url: this.$apiPath + "?m=admin&c=index&a=order",
					dataType: 'json',
					data: {
						order_id: order_id,
						token: this.Token
					},
					success: (res) => {
						console.log(res.data.data)
						this.list = res.data.data.order_detail;
						this.order_time = res.data.data.start_time;
						this.total_price = res.data.data.price
					}
				})
			},
			del(item, index) {
				var orderId = item.order_id;
				var orderDetailId = item.id;
				// console.log(orderId,orderDetailId)
				//服务端修改订单接口
				uni.request({
					url: this.$apiPath + "?m=admin&c=index&a=changeOrderNum",
					method: 'POST',
					header: {
						"content-type": "application/x-www-form-urlencoded"
					},
					data: {
						token: this.Token,
						order_id: orderId,
						action: "decr",
						order_detail_id: orderDetailId
					},
					success: (res) => {
						if (res.data.error == 0) {
							item.num -= 1
							// console.log(this.list[index])
							this.list.splice(index, 1, item)
							this.lookOrder(orderId); //减了数量之后调用订单接口来更新总价数据
						} else {
							alert(res.data.msg)
						}
					}
				})
			},
			Settlement() {
				console.log("点击了结算按钮");
				this.show = true;
				// 震动反馈
				uni.vibrateShort({
					success: function() {
						console.log('success');
					}
				});
			},
			confirm() {
				uni.request({
					url: this.$apiPath + "?m=admin&c=index&a=changeOrderStatus",
					dataType: "json",
					method: 'POST',
					header: {
						"content-type": "application/x-www-form-urlencoded"
					},
					data: {
						order_id: this.orderId,
						status: 1,
						token: this.Token
					},
					success: (res) => {
						if (res.data.error != 0) {
							alert(res.data.msg)
						} else {
							//修改订单状态成功,跳转到订单列表页
							uni.navigateBack({
								url: 'pages/order/index'
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.open {
		visibility:hidden;
				opacity: 0;
				transition: 0.5s;
	}

	page {
		background: #2D335A;
		background-image: linear-gradient(45deg, #4D395C, #253155);
		height: 100%;
	}

	.body {
		padding-top: 20rpx;
	}

	.goods_time {
		font-size: 25rpx;
		color: #ffffff;
		opacity: 0.7;
		margin: 0 10rpx 10rpx 30rpx;
	}

	.clock_image {
		width: 33.3rpx;
		height: 33.3rpx;
		margin: 0 10rpx 10rpx 30rpx;
		float: left;
	}

	.main {
		margin: 0rpx 20rpx 20rpx 20rpx;
		background-color: #a1a0b5;
		padding: 20rpx 20rpx 10rpx 20rpx;
		border-radius: 15rpx;
		opacity: 0.8;

		.goods {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			align-content: center;
			margin-bottom: 10rpx;
			position: relative;

			&>image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 16rpx;
				border-radius: 10rpx;
			}

			.num {
				font-size: 24rpx;
				color: #18422e;
				opacity: 0.7;
			}

			.money {
				font-size: 33rpx;
				font-weight: bold;
				color: #000000;
				position: absolute;
				right: 68rpx;
				bottom: 20rpx;
			}

			.del_img {
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				right: 0rpx;
				bottom: 15rpx;
			}

			.del_img:active {
				transform: translate(4rpx, 4rpx);
			}
		}
	}

	.bottom_money {
		margin-top: 20rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.need_pay {
		color: #00aaff;
		font-size: 28rpx;
		font-weight: 900;
	}

	.totalMoney {
		color: #fa2a2d;
		font-size: 31rpx;
		margin-right: 50rpx;
	}

	.state_btn {
		display: flex;
		justify-content: flex-end;
		margin-top: 32.7rpx;
		margin-right: 33rpx;
	}

	._btn {
		width: 153rpx;
		height: 58rpx;
		text-align: center;
		color: $theme-color;
		font-size: 28rpx;
		line-height: 58rpx;
		border: 4rpx solid $theme-color;
		border-radius: 8rpx;
		margin-right: 30rpx;
		box-shadow:1px 1px 4px #000;
	}

	._btn2 {
		width: 153rpx;
		height: 58rpx;
		text-align: center;
		color: #d63031;
		font-size: 28rpx;
		line-height: 58rpx;
		border: 4rpx solid #d63031;
		border-radius: 6rpx;
		margin-right: 17rpx;
	}

	._btn:active,
	._btn2:active {
		transform: translate(2rpx, 2rpx);
	}
</style>
