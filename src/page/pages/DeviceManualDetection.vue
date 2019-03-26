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
						<div class="rackTowerServer"><span>{{label}}</span></div>

					</div>
					<div class="DeviceManualDetection-button">
						<div class="IncreaseTheSearchScope" @click='add'><i class="el-icon-circle-plus">&nbsp;&nbsp;增加检索范围</i></div>
						<div class="BeganToSee">开始发现</div>
						<div class="ListOfUncompletedDiscoveries">未完成的发现列表</div>
					</div>
					<el-form v-model="tables" inline>
						<div v-for="(list,index) in lists" class="DeviceManualDetection-box-right-bottom">
							<el-button @click="del(index)" style="float: right;margin-top: 20px;margin-right: 20px;"><i class="el-icon-delete"></i></el-button>
							<el-form-item label="IP地址段:">
								<el-button @click="addI(index)" style="float: right; margin-top: 5px;">+</el-button>
								<template v-for="(val,i) in list.ipAddress">
									<el-input v-model="val.ips1" class="width200"></el-input>
									<span>~</span>
									<el-input v-model="val.ips2" class="width200"></el-input>
									<el-button v-if="(i!==0)" @click="delI(index,i)">-</el-button>
									<br />
								</template>
							</el-form-item>

							<el-form-item v-if="status === 1" label="带外用户名:">
								<el-input v-model="list.userName" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="status === 1" label="带外用户密码:">
								<el-input v-model="list.password" class="width200"></el-input>
							</el-form-item>
							<br />
							<el-form-item v-if="status === 1" label="端口:">
								<el-input v-model="list.port" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="status === 2" label="SNMP版本:">
								<el-select v-model="value" placeholder="请选择" class="width200">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>

								<!--<el-input v-model="list.userName" class="width200"></el-input>-->
							</el-form-item>
							<el-form-item v-if="status === 2" label="SNMP端口:">
								<el-input v-model="list.password" class="width200"></el-input>
							</el-form-item>
							<br />
							<el-form-item v-if="status === 2" label="SNMP团体名:">
								<el-input v-model="list.port" class="width200"></el-input>
							</el-form-item>
						</div>
					</el-form>
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
				status: 1,
				label: '',
				//树形控件
				data: [{
						id: 1,
						status: 1,
						label: '机架/塔式服务器 ',
						children: [{
							status: 1,
							id: 6,
							label: 'IBM',
							children: [{
								id: 11,
								status: 1,
								label: '101-101'
							}, {
								id: 12,
								status: 1,
								label: '102-102'
							}]
						}, {
							id: 7,
							status: 1,
							label: 'DELL'
						}]
					}, {
						id: 2,
						status: 2,
						label: '网络设备',
						children: [{
							id: 8,
							status: 2,
							label: '华为'
						}, {
							id: 9,
							status: 2,
							label: '锐捷'
						}]
					}, {
						id: 3,
						status: 3,
						label: '小型机',
						children: [{
							id: 10,
							status: 3,
							label: '空调',
							children: [{
									id: 13,
									status: 3,
									label: '格力'
								},
								{
									id: 14,
									status: 3,
									label: '美的'
								}
							]
						}, {
							id: 8,
							status: 3,
							label: 'UPS'
						}]
					}, {
						id: 4,
						status: 4,
						label: '刀片/刀箱'
					},
					{
						id: 5,
						status: 5,
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
					ipAddress: [{
						ips1: 'enter text',
						ips2: 'asdasdsad'
					}],
					userName: "enter text...",
					password: "enter text...",
					port: "enter text..."
				}],
				options: [{
					value: '1',
					label: 'V1a'
				}, {
					value: '2',
					label: 'V2b'
				}, {
					value: '3',
					label: 'V3c'
				}, {
					value: '4',
					label: 'V4d'
				}, {
					value: '5',
					label: 'V5e'
				}],
				value: ''

			}
		},
		methods: {
			handleNodeClick(data) {
				this.status = data.status;
				this.label = data.label;
				if(this.status === 1) {
					this.label = this.label + '的信息'
				} else if(this.status === 2) {
					this.label = '【' + this.label + '】' + '的检索范围'
				}
			},
			add: function() {
				let cope = {
					ipAddress: [{
						ips1: "",
						ips2: ""
					}],
					userName: "",
					password: "",
					port: "",
				}
				this.lists.push(cope);
				/*console.log(this.lists)*/
			},
			del: function(index) {
				this.lists.splice(index, 1);
				/*console.log(this.lists)*/
			},
			addI(index) {
				let copes = {
					ipAddress: [{
						ips1: "",
						ips2: ""
					}]
				}
				this.lists[index].ipAddress.push(copes)
			},
			delI(index, i) {
				this.lists[index].ipAddress.splice(i, 1);
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
	
	.rackTowerServer {}
	
	.rackTowerServer span {
		font-weight: 600;
		color: #3F81D0;
	}
	
	.DeviceManualDetection-button {
		overflow: hidden;
		padding: 16px 0;
	}
	
	.IncreaseTheSearchScope {
		float: left;
		width: 138px;
		height: 30px;
		background-color: #e7a835;
		color: #fff;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		cursor: pointer;
	}
	
	.BeganToSee {
		float: left;
		width: 110px;
		height: 30px;
		background-color: #3f81d0;
		text-align: center;
		line-height: 30px;
		cursor: pointer;
		color: #fff;
		margin-left: 20px;
	}
	
	.ListOfUncompletedDiscoveries {
		float: left;
		width: 130px;
		height: 30px;
		border: #c1c1c1 solid 1px;
		background-color: #fff;
		color: #252a2f;
		text-align: center;
		line-height: 30px;
		margin-left: 20px;
	}
	
	.ListOfUncompletedDiscoveries:hover {
		color: #3f81d0;
		border: 1px solid #3F81D0;
		cursor: pointer;
	}
	
	.DeviceManualDetection-box-right-bottom {
		overflow: hidden;
		padding-top: 10px;
		margin-bottom: 20px;
		background-color: #f6f9f9;
	}
	
	.DeviceManualDetection-box-right-bottom:hover {
		background-color: #eaeef2;
	}
	
	.DeviceManualDetection-box-right-bottom ul {
		overflow: hidden;
	}
	
	.DeviceManualDetection-box-right-bottom ul li {
		display: inline-block;
		padding: 20px 20px 0 20px;
	}
	
	.DeviceManualDetection-box-right-bottom ul li:nth-child(4) {
		display: inline-block;
		padding: 20px 20px 0 0;
	}
	
	.DeviceManualDetection-box-right-bottom ul li:first-child {
		display: inline-block;
		float: right;
	}
	
	.DeviceManualDetection-box-right-bottom ul li span {
		display: inline-block;
		width: 96px;
	}
	
	.DeviceManualDetection-box-right-bottom ul li input {
		width: 200px;
		height: 30px;
	}
	
	.right-ul {
		float: left;
	}
	
	.right-ul li span {
		font-weight: 900;
		font-size: 30px;
		display: inline-block;
	}
	
	.right-ul li input {
		width: 150px;
		height: 30px;
		display: inline-block;
	}
	
	.DeleteSearchScope {
		float: left;
	}
</style>
<style>
	.el-form-item__label {
		/*display: inline-block;*/
		width: 96px;
		font-size: 12px;
	}
	/*.DeviceManualDetection-box-right-bottom {
		padding: 10px 20px;
		overflow: hidden;
		padding-bottom: 20px;
		margin-bottom: 20px;
		background-color: #f6f9f9;
	}*/
</style>