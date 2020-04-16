<template>
	<view class="content">
		<list-card title="菜品管理" desc="菜品上下架管理及编辑菜品" src="/static/img/up.png" @click.native="onClickFoodlist"></list-card>
		<list-card title="添加菜品" desc="可添加新菜品" src="/static/img/add.png" @click.native="onClickAdd"></list-card>
		<list-card title="新功能" desc="敬请期待" src="/static/img/tj.png" @click.native="onClickTj"></list-card>
	</view>
</template>

<script>
import listCard from '@/components/food-management/list-card/index.vue';
export default {
	components: {
		listCard
	},
	data() {
		return {
			arr: [0, 1]
		};
	},
	onLoad() {},
	methods: {
		onClickFoodlist() {
			this.$jump('./foods');
			// 震动反馈
			uni.vibrateShort({
				success: function() {
					console.log('震动反馈');
				}
			});
		},
		onClickAdd(){
			this.$jump('./addFood');
			// 震动反馈
			uni.vibrateShort({
				success: function() {
					console.log('震动反馈');
				}
			});
		},
		onClickTj(){
			this.$msg('新功能尽情期待', 1000)
			// 震动反馈
			uni.vibrateShort({
				success: function() {
					console.log('震动反馈');
				}
			});
		}
			
	},
	//退出登录方法
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
};
</script>

<style>
page {
	background: #2d335a;
	background-image: linear-gradient(45deg, #4d395c, #253155);
	height: 100%;
}
</style>
