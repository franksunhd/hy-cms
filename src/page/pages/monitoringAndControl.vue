<template>
	<Box>
    <tagViews />
    <el-button @click="clickNode1">点击添加路由 角</el-button>
    <el-button @click="clickNode2">点击添加路由 用</el-button>
    <el-button @click="clickNode3">点击添加路由 组</el-button>
    <router-view />
	</Box>
</template>

<script>
	import Box from '../../components/Box';
	import tagViews from '../../components/dynamicTabBox';
	export default {
		name: 'monitoringAndControl',
		components: {Box,tagViews},
		data() {
			return {

			}
		},
		methods: {
		  clickNode1(){
		    var val = {path: "/YUser/monitoringAndControl/monitoringAndControl1", name: 'monitoringAndControl1',meta:{title:'角'}};
		    this.$router.push({name:'monitoringAndControl1'})
        this.$store.dispatch('addVisitedViews',val);
      },
      clickNode2(){
		    var val = {path: "/YUser/monitoringAndControl/monitoringAndControl2", name: 'monitoringAndControl2',meta:{title:'用'}};
        this.$router.push({name:'monitoringAndControl2'})
        this.$store.dispatch('addVisitedViews',val);

      },
      clickNode3(){
		    var val = {path: "/YUser/monitoringAndControl/monitoringAndControl3", name: 'monitoringAndControl3',meta:{title:'组'}};
        this.$router.push({name:'monitoringAndControl3'})
        this.$store.dispatch('addVisitedViews',val);

      }
		}
	}
</script>

<style scoped>

</style>
