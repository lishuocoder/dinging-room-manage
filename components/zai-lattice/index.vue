<template name="zai-lattice">
	<view class="zai-lattice-box"
		:class="shadow?'zai-lattice-box-shadow':''"
		:style="{'background':backgroundColor}"
		@click="onClick()"
	>
		<view class="zai-lattice-box-p">
			<progress
				:percent="progressPercent" active stroke-width="5" 
				:backgroundColor="backgroundColor" 
				:activeColor="progressColor"
			/>
			<view class="zai-lattice-title" :style="{color:titleColor}">{{title}}</view>
			<view class="zai-lattice-num">
				<text class="zai-lattice-num-title" :style="{color:numColor}">{{num}}</text>
				<text class="zai-lattice-num-unit" :style="{color:unitColor}">{{unit}}</text>
			</view>
			<view class="zai-lattice-icon" v-if="type=='icon'"
				:class="icon"
				:style="{color:iconColor,'font-size':fontSize}"
			></view>
			<view class="zai-lattice-img" v-if="type=='img'"
				:style="{width:fontSize,height:fontSize}"
			>
				<image 
					:src="src" 
					mode="aspectFit" 
					class="zai-lattice-image" 
					:style="{width:fontSize,height:fontSize}"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "zai-lattice",
		props: {
			//背景颜色
			backgroundColor: {
				type: [String],
				default: '#4F496C'
			},
			//是否开启阴影
			shadow: Boolean,
			//进度条颜色
			progressColor: {
				type: [String],
				default: '#2086D8'
			},
			//进度条位置
			progressPercent: {
				type: [Number],
				default: 0
			},
			//名称
			title: String,
			//数量
			num: {
				type: [Number, String],
				default: 0
			},
			//单位
			unit: String,
			//字体图标
			icon: String,
			//图片地址
			src: String,
			//图标颜色
			iconColor: {
				type: [String],
				default: '#A1A0B5'
			},
			//单位颜色
			unitColor: {
				type: [String],
				default: '#A1A0B5'
			},
			//数量颜色
			numColor: {
				type: [String],
				default: '#ffffff'
			},
			//名称颜色
			titleColor: {
				type: [String],
				default: '#EFEEF2'
			},
			//图标或图片大小
			size: {
				type: [Number, String],
				default: 33
			},
			//图标类型
			type: {
				type: [String],
				default: 'icon'
			},
		},
		computed: {
			fontSize() {
				var size = Number(this.size)
				size = isNaN(size) ? 33 : size
				return `${size}px`
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style>
	@import "./index.css";
</style>
