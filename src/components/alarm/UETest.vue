<template>
	<script id="UETest" type="text/plain"></script>
</template>

<script>
	export default {
		name: "UETest",
		data() {
			return {
				UETest: null
			}
		},
		props: {
			defaultMsg: {
				type: String
			},
			config: {
				type: Object
			}
		},
		mounted() {
			const _this = this;
			this.UETest = UE.getEditor('UETest', this.config); // 初始化UE
			this.UETest.addListener("ready", function () {
				_this.UETest.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
			});
		},
		methods: {
			// 获取内容方法
			getUEContent() {
				return this.UETest.getContent()
			},
			// 设置内容
			setUEContent(val){
				this.UETest.setContent(val);
			}
		},
		destroyed() {
			this.UETest.destroy();
		}
	}
</script>

<style scoped>

</style>
