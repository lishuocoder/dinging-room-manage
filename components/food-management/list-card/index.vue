<template>
	<view class="hm-sms-list-card"> 
		<view class="box">
			<image class="primary" :src="src" />
			<view class="sub">
				<view class="outer">
					<view class="wrap">
						<view class="title">{{ title }}</view>
					</view>
					<view class="txt">前往</view>
				</view>
				<view class="block">
					<view class="desc">{{ desc }}</view>
				</view>
			</view>
			<image class="side" src="/static/img/right.png" />
		</view>
	</view>
</template>
<script>
export default {
	name: 'HmSmsListCard',
	props: {
		dataId: {
			type: String,
			default: 'hm-sms-list-card'
		},
		title: {
			type: String
		},
		desc: {
			type: String
		},
		src:String
	},
	data() {
		return {};
	},
	methods: {}
};
</script>
<style>
@import './index.response.css';
</style>
