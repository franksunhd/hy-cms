<template>
    <Box>
			<!--面包屑区域-->
			<div class="Breadcrumb">
				<el-breadcrumb>
					<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
					<el-breadcrumb-item>{{$t('breadcrumb.RackConfiguration')}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</Box>
</template>

<script>
	import Box from '../../../components/Box';
    export default {
        name: "RackConfiguration",
			components:{
        	Box,
			},
			data(){
        	return{

					}
			},
			methods:{

			}
    }
</script>

<style scoped>

</style>
