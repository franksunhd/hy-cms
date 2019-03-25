<template>
	<div class="DeviceManualDetection-box">
		<el-row>
			<el-col>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item>{{$t('breadcrumb.DeviceDiscovery')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.DeviceManualDetection')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="8">
				<div class="DeviceManualDetection-box-left">
					<div class="DeviceType">{{$t('breadcrumb.DeviceType')}}</div>
					<div class="TreeControl">
						<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">

						</el-tree>
					</div>
				</div>
			</el-col>
			<el-col :span="16">
				<div class="DeviceManualDetection-box-right">
					<div class="DeviceManualDetection-box-right-top">
						<div class="rackTowerServer"><span>{{$t('breadcrumb.rackTowerServer')}}</span>的信息</div>
						<div class="IncreaseTheSearchScope" @click='add'><i class="el-icon-circle-plus">增加检索范围</i></div>
					</div>
					<div class="DeviceManualDetection-box-right-bottom" v-for="(list,index) in lists">
						<el-row :gutter="10">

							<el-col :span="12">

								<ul>
									<li>
										<span>IP地址段:</span>
										<input type="text" v-model="list.ipAddress">
									</li>
									<li>
										<span>用户名:</span>
										<input type="text" v-model="list.tel">
									</li>
									<li>
										<span>密码:</span>
										<input type="text" v-model="list.tel">
									</li>
									<li>
										<span>端口:</span>
										<input type="text" v-model="list.tel">
									</li>
								</ul>
								<!--<div class="DeleteSearchScope"><i class="el-icon-remove"></i></div>-->

							</el-col>

							<el-col :span="12">
								<ul class="right-ul">
									<li>
										<span>~</span>
										<input type="text" v-model="list.ipAddress">
									</li>
								</ul>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	export default {
		name: 'DeviceManualDetection',
		data() {
			return {
				//树形控件
				data: [{
						id: 1,
						label: '机架/塔式服务器 ',
						children: [{
							id: 6,
							label: 'IBM',
							children: [{
								id: 11,
								label: '101-101'
							}, {
								id: 12,
								label: '102-102'
							}]
						}, {
							id: 7,
							label: 'DELL'
						}]
					}, {
						id: 2,
						label: '网络设备',
						children: [{
							id: 8,
							label: '华为'
						}, {
							id: 9,
							label: '锐捷'
						}]
					}, {
						id: 3,
						label: '小型机',
						children: [{
							id: 10,
							label: '空调',
							children: [{
									id: 13,
									label: '格力'
								},
								{
									id: 14,
									label: '美的'
								}
							]
						}, {
							id: 8,
							label: 'UPS'
						}]
					}, {
						id: 4,
						label: '刀片/刀箱'
					},
					{
						id: 5,
						label: '存储设备'
					}
				],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				//表单
				tables: [],
				lists: [{
					ipAddress: "enter text...",
					userName: "enter text...",
					password: "enter text...",
					port: "enter text..."
				}]

			}
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
			},
			add: function() {
				let cope = {
					ipAddress: "",
					userName: "",
					password: "",
					port: "",
				}
				this.lists.push(cope);
				console.log(this.lists)
			},
			del: function(index) {
				this.lists.splice(index, 1);
				console.log(this.lists)
			}
		},

	}
</script>

<style scoped>
	.DeviceManualDetection-box {
		overflow: hidden;
		padding: 20px 20px;
	}
	
	.DeviceManualDetection-box-left {
		border: 1px solid #f22;
		height: 600px;
		padding: 20px;
	}
	
	.DeviceType {
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 5px;
	}
	
	.TreeControl {
		overflow: hidden;
	}
	
	.DeviceManualDetection-box-right {
		border: 1px solid #f22;
		height: 600px;
		padding: 20px 40px;
	}
	
	.DeviceManualDetection-box-right-top {
		overflow: hidden;
	}
	
	.rackTowerServer {
		float: left;
	}
	
	.rackTowerServer span {
		font-weight: 600;
		color: #3F81D0;
	}
	
	.IncreaseTheSearchScope {
		float: right;
	}
	
	.DeviceManualDetection-box-right-bottom {
		border: 1px solid #333;
		overflow: hidden;
		padding-bottom: 20px;
	}
	
	..DeviceManualDetection-box-right-bottom ul {
		overflow: hidden;
	}
	
	.DeviceManualDetection-box-right-bottom ul li {
		float: right;
		padding: 20px 20px 0 20px;
	}
	.DeviceManualDetection-box-right-bottom ul li span{
		
	}
	.DeviceManualDetection-box-right-bottom ul li input{
width: 150px;
height: 30px;
	}
	.right-ul{
		float: left;
	}
	.right-ul li span{
		font-weight: 900;
		font-size: 30px;
		display: inline-block;
		
	}
	.right-ul li input{
		width: 150px;
		height: 30px;
		display: inline-block;
	}
	.DeleteSearchScope {
		float: left;
	}
</style>
