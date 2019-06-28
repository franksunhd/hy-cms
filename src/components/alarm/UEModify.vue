<template>
	<script id="editor" type="text/plain"></script>
</template>

<script>
	export default {
		name: "UE",
		data () {
			return {
				editor: null
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
			this.editor = UE.getEditor('editor', this.config); // 初始化UE
			this.editor.addListener("ready", function () {
				_this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
			});
		},
		methods: {
			// 获取内容方法
			getUEContent() {
				return this.editor.getContent()
			},
			// 设置内容
			setUEContent(val){
				this.editor.setContent(val);
			}
		},
		destroyed() {
			this.editor.destroy();
		}
	}
</script>

<style scoped>
	#editor {
		position: absolute;
		z-index: 10000;
	}
</style>
