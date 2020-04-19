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
				<picker @change="bindPickerChange" :value="index" :range="typeList" >
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
			<switch :checked=check color="#5479e3" @change="switchChange" />
		</view>
			
			
		<view class="feedback-title"><text>菜品照片(大小100k以下)</text></view>
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

		<button type="primary" class="feedback-submit" @tap="send">修改该菜品</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			typeList: ['请选择分类'],
			index: 0,
			msgContents: ['烧烤伴侣', '烤鱼，牛蛙必点配菜', '味甜的味道，给你可口又清爽', '不放任何添加剂，价格实惠，超值！'],
			imageList: [],
			sendDate: {
				name:0,
				price:'0',
				explain:0,
				type: '0',
				status:1,
				content: '0',
				image: null
			},
			check:true,
			Token: 0,
			foodID: 0,
			typeID: 0,
			foodsDetails: []
		};
	},
	onLoad(option) {
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
		this.foodID = option.food_id; //传过来要修改的菜品ID
		this.typeID = option.type_id; //修改菜品所属于的分类ID

		uni.request({
			//菜品接口
			url: this.$apiPath + '?m=admin&c=food&a=index',
			data: {
				token: this.Token,
				type_id: this.typeID
			},
			success: res => {
				var reslist = res.data.data;
				this.foodsDetails= reslist.find((item)=>{
					if(item.id===this.foodID){
						return item;
					}
				});
				console.log(this.foodsDetails);//得到当前菜品的详细信息
				this.sendDate.name=this.foodsDetails.name;
				this.sendDate.price=this.foodsDetails.price;
				this.sendDate.explain=this.foodsDetails.explain
				this.index=this.foodsDetails.type_id;
				this.status=this.foodsDetails.status;
				this.sendDate.content=this.foodsDetails.content;
				this.sendDate.image=this.foodsDetails.img;
				this.imageList.push(this.foodsDetails.img);
				if(this.foodsDetails.status==1){
					this.check=true;//switch是否选中
				}else{
					this.check=false;
				}
			}
		});
	},
	methods: {
		bindPickerChange(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
			this.sendDate.type = this.typeList[e.target.value];
			this.typeID=e.target.value;
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
				sizeType: 'compressed',
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
		switchChange(e){
			 console.log('switch1 发生 change 事件，携带值为', e.target.value);
			 if(e.target.value){
				 this.status=1;
			 }else{
				 this.status=0;
			 }
		},
		// 修改方法
		send() {
			console.log(this.sendDate);
			// console.log(this.typeID)
			//修改菜品接口
			uni.request({
				url: this.$apiPath + '?m=admin&c=food&a=update',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					token: this.Token,
					food_id: this.foodID,
					name:this.sendDate.name,
					explain:this.sendDate.explain,
					type_id:this.typeID,
					status:this.status,
					price:this.sendDate.price,
					content:this.sendDate.content,
					img: this.sendDate.image
				},
				success: res => {
					console.log("修改成功");
					this.$msg("修改成功",2000);
					// this.$jump('foods');
					uni.redirectTo({
						url:'foods'
					})
				}
			})
			
		}
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
