<template>
	<view class="page">
		<view class="feedback-title"><text>菜品名称</text></view>
		<view class="feedback-body"><input class="feedback-input" v-model="sendDate.name" placeholder="请输入菜品名称" /></view>

		<view class="feedback-title"><text>价 格(￥)</text></view>
		<view class="feedback-body"><input class="feedback-input" type="number" v-model="sendDate.price" placeholder="请输入菜品价格" /></view>

		<view class="feedback-title"><text>简单说明</text></view>
		<view class="feedback-body"><input class="feedback-input" v-model="sendDate.explain" maxlength="6" placeholder="1到6个字" /></view>

		<view class="feedback-title">分类选择</view>
		<view class="feedback-body">
			<view class="feedback-input">
				<picker @change="bindPickerChange" :value="index" :range="typeList">
					<view class="uni-input">{{ typeList[index] }}</view>
				</picker>
			</view>
		</view>

		<view class="feedback-title">
			<text>详细说明</text>
			<text class="feedback-quick" @tap="chooseMsg">快速键入</text>
		</view>
		<view class="feedback-body"><textarea placeholder="请输入菜品详细说明..." v-model="sendDate.content" class="feedback-textare" /></view>

		<view class="feedback-title">
			<text>上下架(选中为上架)</text>
			<switch checked color="#5479e3" @change="switchChange" />
		</view>

		<view class="feedback-title"><text>排序</text></view>
		<view class="feedback-body"><input class="feedback-input" type="number" v-model="sendDate.sort" placeholder="数字越大,顺序越靠后" /></view>

		<view class="feedback-title"><text>菜品照片(建议大小100k以下)</text></view>
		<view class="feedback-body feedback-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">已选照片</view>
					<view class="uni-uploader-info">{{ imageList.length }}/1</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="uni-uploader__file" style="position: relative;">
								<image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
								<view class="close-view" @click="close(index)">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-show="imageList.length < 1"><view class="uni-uploader__input" @tap="chooseImg"></view></view>
					</view>
				</view>
			</view>
		</view>

		<button type="primary" class="feedback-submit" @tap="send" :disabled="disabled" :loading="disabled">添加菜品</button>
		<view class="feedback-title"><text>添加后直接添加到菜品列表，可在上下架管理中下架该菜品</text></view>
		<warningBox v-model="show" title="错误" text="请添加完整的菜品信息" noCancel @confirm="confirm"></warningBox>
	</view>
</template>

<script>
import warningBox from '@/components/warning-box/warning-box.vue';

export default {
	components: {
		warningBox
	},
	data() {
		return {
			typeList: ['请选择分类'],
			index: 0,
			msgContents: ['烧烤伴侣', '烤鱼，牛蛙必点配菜', '味甜的味道，给你可口又清爽', '不放任何添加剂，价格实惠，超值！'],
			imageList: [],
			sendDate: {
				name: '',
				price: '',
				explain: '',
				type: '',
				status: 1,
				sort: '',
				content: '',
				image: ''
			},
			typeID: 0,
			show: false,
			disabled: false
		};
	},
	onLoad() {
		//获取存入的token
		uni.getStorage({
			key: 'token',
			success: res => {
				this.Token = res.data;
			}
		});

		uni.request({
			//服务端分类接口
			url: this.$apiPath + '?c=type&a=index',
			dataType: 'json',
			success: res => {
				const type = res.data.data;
				for (var i = 0; i < type.length; i++) {
					// console.log(type[i].name)
					this.typeList.push(type[i].name);
				}
			}
		});
		this.index = this.typeID;
	},
	methods: {
		bindPickerChange(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
			this.sendDate.type = e.target.value;
			this.typeID = e.target.value;
		},
		close(e) {
			this.imageList.splice(e, 1);
		},
		chooseMsg() {
			//快速输入
			uni.showActionSheet({
				itemList: this.msgContents,
				success: res => {
					this.sendDate.content = this.msgContents[res.tapIndex];
				}
			});
		},
		chooseImg() {
			//选择图片
			uni.chooseImage({
				sourceType: ['camera', 'album'],
				sizeType: 'compressed', //上传压缩图
				count: 8 - this.imageList.length,
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths);

					uni.uploadFile({
						// 上传图片接口
						url: this.$apiPath +'?c=upload&a=uploadImg',
						filePath: res.tempFilePaths[0],
						name: 'img',
						// header:{"Content-Type": "multipart/form-data"},
						success: res => {
							console.log(JSON.parse(res.data).data);
							this.sendDate.image=(JSON.parse(res.data).data.thumb_img);
							console.log(image);
						},
						fail: res => {
							uni.showToast({
								title: '失败',
								icon: 'none'
							});
						}
					});
				}
			});
		},

		previewImage() {
			//预览图片
			uni.previewImage({
				urls: this.imageList
			});
		},
		//switch改变
		switchChange(e) {
			console.log('switch1 发生 change 事件，携带值为', e.target.value);
			if (e.target.value) {
				this.status = 1;
			} else {
				this.status = 0;
			}
		},
		send() {
			console.log(this.sendDate);
			if (this.typeID == 0) {
				this.show = true;
				console.log('出错');
				return;
			}
			//添加菜品接口
			uni.request({
				url: this.$apiPath + '?m=admin&c=food&a=create',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					token: this.Token,
					name: this.sendDate.name,
					explain: this.sendDate.explain,
					type_id: this.typeID,
					status: this.sendDate.status,
					sort: this.sendDate.sort,
					price: this.sendDate.price,
					content: this.sendDate.content,
					img: this.sendDate.image
				},
				success: res => {
					console.log(res);
					if (res.data.error != 0) {
						this.show = true;
						console.log('出错');
					} else {
						this.$msg('添加成功', 1000);
						this.disabled = true;
						setTimeout(() => {
							uni.switchTab({
								url: 'menuList'
							});
						}, 1000);
					}
				}
			});
		},
		confirm() {}
	}
};
</script>

<style>
@font-face {
	font-family: uniicons;
	font-weight: normal;
	font-style: normal;
	src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
}
page {
	background: #a1a0b5;
	/* background-image: linear-gradient(45deg, #4d395c, #253155); */
	height: 100%;
}
view {
	font-size: 28upx;
}
.input-view {
	font-size: 28upx;
}
.close-view {
	text-align: center;
	line-height: 14px;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
}
/* 上传 */
.uni-uploader {
	flex: 1;
	flex-direction: column;
}
.uni-uploader-head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.uni-uploader-info {
	color: #b2b2b2;
}
.uni-uploader-body {
	margin-top: 16upx;
}
.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uni-uploader__file {
	margin: 10upx;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__img {
	display: block;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__input-box {
	position: relative;
	margin: 10upx;
	width: 208upx;
	height: 208upx;
	border: 2upx solid #d9d9d9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
	content: ' ';
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	background-color: #d9d9d9;
}
.uni-uploader__input-box:before {
	width: 4upx;
	height: 79upx;
}
.uni-uploader__input-box:after {
	width: 79upx;
	height: 4upx;
}
.uni-uploader__input-box:active {
	border-color: #999999;
}
.uni-uploader__input-box:active:before,
.uni-uploader__input-box:active:after {
	background-color: #999999;
}
.uni-uploader__input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 20upx;
	color: #4f496c;
	font-size: 28upx;
}

.feedback-quick {
	position: relative;
	padding-right: 40upx;
}
.feedback-quick:after {
	font-family: uniicons;
	font-size: 40upx;
	content: '\e581';
	position: absolute;
	right: 0;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.feedback-body {
	background: #fff;
}
.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
	background-color: #c1c1d9;
}
.feedback-input {
	font-size: 34upx;
	height: 50upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 50upx;
	background-color: #c1c1d9;
}
.feedback-uploader {
	padding: 22upx 20upx;
	background-color: #c1c1d9;
}

.feedback-submit {
	background: #4f496c;
	color: #ffffff;
	margin: 20upx;
}
</style>
