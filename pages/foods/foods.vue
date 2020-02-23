<template>
	<view>
		<view class="list_box">
			<view class="left">
				<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
					<view class="item" v-for="(item,index) in typeList" :data-id="item.id" :key="index" :class="{ 'active':index==leftIndex }"
					 :data-index="index" @tap="leftTap">{{item.name}}</view>
				</scroll-view>
			</view>
			<view class="main">
				<!-- current：当前所在滑块的index  vertical：滑块方向是否为纵向 duration：滑动动画时长-->
				<swiper class="swiper" :style="{ 'height':scrollHeight }" :current="leftIndex" @change="swiperChange" vertical="true"
				 duration="300">
					<!-- 遍历菜品分类 -->
					<swiper-item v-for="(item,index) in typeList" :key="index">
						<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
							<view class="item">
								<view class="title">
									<view>{{item.name}}</view>
								</view>
								<!-- 遍历菜品 -->
								<view class="goods" v-for="(item,index) in foodsList" :key="index">
									<image :src="item.img" />
									<view>
										<view class="name">{{item.name}}</view>
										<view class="money"> ￥{{item.price}}</view>
									</view>
									<view class="state_btn">
										<text class="_btn" @click="revise(item.status)">{{text}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeList: [],
				foodsList: [],
				scrollHeight: '500px',
				leftIndex: 0,
				text: "下架"
			};
		},
		onLoad() {
			uni.request({
				//服务端分类接口
				url: this.$apiPath + "?c=type&a=index",
				dataType: 'json',
				success: (res) => {
					this.typeList = res.data.data;
					// console.log(res.data.data[0].id)
					this.getFoodsList(res.data.data[0].id);
				}
			}),
			/* 设置当前滚动容器的高，若非窗口的高度，请自行修改 */
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = `${res.windowHeight}px`;
				}
			});
		},
		methods: {
			/* 左侧导航点击 */
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.leftIndex = Number(index);
				this.getFoodsList(e.currentTarget.dataset.id);
				// console.log(e.currentTarget.dataset.id);
			},
			/* 轮播图切换 */
			swiperChange(e) {
				this.getFoodsList(this.typeList[e.detail.current].id);
				let index = e.detail.current;
				this.leftIndex = Number(index);
			},
			getFoodsList(typeId) {
				uni.request({
					//菜品接口
					url: this.$apiPath + "?c=food&a=index",
					data: {
						type_id: typeId
					},
					success: (res) => {
						this.foodsList = res.data.data;
					}
				})
			},
			revise(status) {
				if (status == 1) {
					this.text = "下架";
				} else {
					this.text = "上架";
				}
			}
		},
		onNavigationBarButtonTap() {
			
			uni.navigateTo({
			    url: '/pages/login/login'
			});
		},
	}
</script>

<style lang="scss">
	page {
		background: #2D335A;
		background-image: linear-gradient(45deg, #4D395C, #253155);
		height: 100%;
	}

	.list_box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28rpx;
		margin-right: 30rpx;

		.left {
			width: 176rpx;
			color: #888888;
			background-color: #3a3650;
			line-height: 97rpx;
			box-sizing: border-box;
			font-size: 29rpx;
			margin-left: 28rpx;

			.item {
				padding-left: 20rpx;
				position: relative;

				&:not(:first-child) {
					margin-top: 1px;

					&::after {
						content: '';
						display: block;
						height: 0;
						border-top: #d6d6d6 solid 1px;
						width: 620rpx;
						position: absolute;
						top: -1px;
						right: 0;
						transform: scaleY(0.5);
						/* 1px像素 */
					}
				}

				&.active,
				&:active {
					color: #00d8a0;
					background-color: #4f496c;
				}
			}
		}

		.main {
			color: #fffae8;
			background-color: #4f496c;
			padding-left: 20rpx;
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;

			.swiper {
				height: 500px;
			}

			.title {
				line-height: 64rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #232323;
				background-color: #4f496c;
				position: sticky;
				top: 0;
				z-index: 999;
			}

			.item {
				padding-bottom: 10rpx;
			}

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
					width: 150rpx;
					height: 150rpx;
					margin-right: 16rpx;
					border-radius: 20rpx;
				}

				.name {
					font-size: 32rpx;
					position: absolute;
					font-weight: 700;
					top: 5rpx;
				}

				.money {
					font-size: 30rpx;
					color: #efba21;
					position: absolute;
					right: 200rpx;
					bottom: 13rpx;
				}

				.add_img {
					width: 50rpx;
					height: 50rpx;
					position: absolute;
					right: 27rpx;
					bottom: 63rpx;
				}
			}

			.state_btn {
				display: flex;
				justify-content: flex-end;
				position: absolute;
				right: 30rpx;
			}

			._btn {
				width: 90rpx;
				height: 45rpx;
				text-align: center;
				color: #0d8ada;
				font-size: 28rpx;
				font-weight: 700;
				line-height: 45rpx;
				border: 3rpx solid #0d8ada;
				border-radius: 6rpx;
				// margin-right: 30rpx;
			}
		}
	}
</style>
