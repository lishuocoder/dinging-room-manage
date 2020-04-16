<template>
	<view class="zai-box">
		<view class="header">
			<image src="../../static/logo.png"></image>
		</view>
		<view class="zai-form">
			<input class="zai-input" v-model="userEmail" type="number" placeholder="账号" />
			<input class="zai-input" v-model="passData" type="number" password placeholder="密码" />
			<button class="zai-btn" @click="startLogin()">立即登录</button>
		</view>
		<view class="bottom_con">
			<view>
				<text class="text_link">本软件仅限餐厅工作人员使用</text>
				<text class="text_link">严禁泄露账号密码</text>
			</view>
			<text class="text_copy">版权所有@2019-2029-LiShuoCoder保留一切权利</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userEmail: '', //用户名
				passData: '', //密码
			};
		},
		methods: {
			//登录
			startLogin() {
				if (this.userEmail.length == "") {
					this.$msg('用户名不能为空', 2000)
					return;
				}
				if (this.passData.length < 5) {
					this.$msg('密码有误', 2000)
					return;
				}
				uni.showLoading({
				    title: '登录中'
				})
				setTimeout(function() {
					//登录接口
					uni.request({
						url: this.$apiPath + "?m=admin&c=login&a=login",
						method: 'POST',
						dataType: 'json',
						header: {
							"content-type": "application/x-www-form-urlencoded"
						},
						data: {
							email: this.userEmail,
							password: this.passData
						},
						success: (res) => {
							if (res.data.error == 0) {
								console.log(res.data.data.token)
								uni.setStorage({
									key: 'token',
									data: res.data.data.token,
									success(res) {
										console.log('存入成功了')
									},
								});
								uni.switchTab({
									url: '../order/index'
								});
							} else {
								this.$msg(res.data.msg, 2000)
							}
						}
					})
				}.bind(this), 1000)
			}
		}
	}
</script>

<style>
	page {
		background: #2D335A;
		background-image: linear-gradient(45deg, #4D395C, #253155);
	}

	/* 头部 logo */
	.header {
		width: 161rpx;
		height: 161rpx;
		box-shadow: 0rpx 0rpx 60rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		background-color: #000000;
		margin-top: 150rpx;
		margin-bottom: 200rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 161rpx;
		height: 161rpx;
		border-radius: 50%;
	}

	.zai-box {
		padding: 0 70rpx;
		position: relative;
	}

	.zai-form {
		margin-top: 100rpx;
	}

	.zai-input {
		background: #eff1ff;
		margin-top: 35rpx;
		border-radius: 100rpx;
		padding: 30rpx 40rpx;
		font-size: 30rpx;
		color: #94afce;
	}

	.zai-btn {
		margin-top: 120rpx;
		background: #8564a2;
		color: #fff;
		border: 0;
		border-radius: 100rpx;
		font-size: 36rpx;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(2rpx, 2rpx);
	}
	
	.bottom_con {
		/* background-color: #4CD964; */
		width: 90%;
		margin-left: auto;
		position: fixed;
		bottom: 20rpx;
		padding-left: 15%;
	}
	.text_link {
		color: #005BBA;
		font-size: 20.8rpx;
		margin-right: 20rpx;
	}
	
	.text_copy {
		color: rgba(26, 26, 26, 0.5);
		font-size: 21rpx;
	}
</style>
