<template>
	<Box>
		<div class="page404_Box">
			<img src="../assets/img/page404.jpg" height="413" width="538"/>
			<span>{{$t('public.page_404')}}</span>
		</div>
	</Box>
</template>

<script>
	import Box from '../components/common/Box';

	export default {
		name: "Page404",
		components: {Box},
		created() {
			this.$store.commit('setLoading',false);
		}
	}
</script>

<style scoped>
	.page404_Box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}

	.page404_Box span {
		position: absolute;
		top: 165px;
		font-size: 14px;
		color: #666;
		font-weight: bold;
		right: 95px;
	}
</style>
