<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceDiscovery')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceManualDetection')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-row :gutter="80">
			<el-col :span="8">
				<div class="DeviceManualDetection-box-left">
					<div class="DeviceType">{{$t('breadcrumb.DeviceType')}}</div>
					<div class="TreeControl">
						<el-tree :data="d" :props="defaultProps" @node-click="handleNodeClick">

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
						<div class="BeganToSee" @click="BeganToSee">开始发现
							<!--<router-link :to="{path:'/YUser/DeviceManualDetection/BeganToSee',query:{BeganToSee:label}}">开始发现
							</router-link>-->
						</div>
						<div class="ListOfUncompletedDiscoveries">未完成的发现列表</div>
					</div>
					<el-form inline>
						<div v-for="(list,index) in lists" class="DeviceManualDetection-box-right-bottom">
							<el-button @click="del(index)" style="float: right;margin-top: 20px;margin-right: 20px;"><i class="el-icon-delete"></i></el-button>
							<el-form-item label="IP地址段:">
								<el-button @click="addI(index)" style="float: right; margin-top: 5px;">+</el-button>
								<template v-for="(val,i) in list.ip">
									<el-input v-model="val.startIp" class="width200"></el-input>
									<span>~</span>
									<el-input v-model="val.endIp" class="width200"></el-input>
									<el-button v-if="(i!==0)" @click="delI(index,i)">-</el-button>
									<br />
								</template>
							</el-form-item>

							<el-form-item v-if="type == 1" label="带外用户名:">
								<el-input v-model="list.username" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 1" label="带外用户密码:">
								<el-input type="password" v-model="list.password" class="width200"></el-input>
							</el-form-item>
							<br />
							<el-form-item v-if="type == 1" label="端口:">
								<el-input v-model="list.port" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2" label="SNMP版本:">
								<el-select v-model="list.snmpVersion" placeholder="请选择" class="width200">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>

								<!--<el-input v-model="list.userName" class="width200"></el-input>-->
							</el-form-item>
							<el-form-item v-if="type == 2" label="SNMP端口:">
								<el-input v-model="list.snmpPort" class="width200"></el-input>
							</el-form-item>
							<br />
							<el-form-item v-if="type == 2" label="SNMP团体名:">
								<el-input v-model="list.snmpCommunity" class="width200"></el-input>
							</el-form-item>
						</div>
					</el-form>
				</div>
			</el-col>
		</el-row>
	</Box>
</template>

<script>
	import Box from '../../components/Box';
	export default {
		name: 'DeviceManualDetection',
		components: {
			Box
		},
		data() {
			return {
				//树形控件
				
				da:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				//表单
				tables: [],
				
				lists: [{
					ip: [{
						"startIp": '192.168.0.2',
						"endIp": '192.168.0.5'
					}],
					"username": "asd",
					password: "asdasd",
					port: "80",
					snmpPort: '81',
					snmpCommunity: 'asd',
					snmpVersion: '',
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
				type: '1',
				label:'机架/塔式服务器（中）',
				d:[],

			}
		},
		created() {
			var _t = this;
			_t.$api.get('/system/basedata/all', {
				jsonString: JSON.stringify({
					"dictionaryType": "AssetType",
					"enable": true,
					"languageMark": "zh_CN"
				})
			}, function(res) {
				console.log(res);
				var datas = res.data.treeNode;
			    var da = datas.children[0].children;
			    var objArr = new Array()
			    for(var i=0; i < da.length;i++){
			    	var obj = new Object();
			    	obj.label = da[i].nodeName;
			    	obj.type = da[i].nodeCode;
			    	objArr.push(obj);
			    }
			    _t.d = objArr;
			});
		},
		methods: {
			BeganToSee() {
				var _t = this;
				_t.$api.post('/asset/discovery/start',{
					param: _t.lists,
					type: _t.type
				}, function(response) {
					var res=response.data;
					console.log(res);
					if(response.status==200){
						_t.$router.push({name:'BeganToSee',params:{
							resdata:res,
						}
						});
						localStorage.setItem('hy-resdata',JSON.stringify(res));
					}
					
				});
			},
			handleNodeClick(d) {
				/*this.status = da.status;*/
				this.label = d.label;
				this.type = d.type;
				console.log(this.type);
				if(this.type === 1) {
					this.label = this.label + '的信息'
				} else if(this.type === 2) {
					this.label = '【' + this.label + '】' + '的检索范围'
				}
			},
			add: function() {
				let cope = {
					ip: [{
						startIp: "",
						endIp: ""
					}],
					username: "",
					password: "",
					port: "",
					snmpPort: '',
					snmpCommunity: '',
					snmpVersion: '',
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
					ip: [{
						startIp: "",
						endIp: ""
					}]
				}
				this.lists[index].ip.push(copes)
			},
			delI(index, i) {
				this.lists[index].ip.splice(i, 1);
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
	.DeviceManualDetection-box-right-bottom .el-form-item__label {
		width: 96px;
		font-size: 12px;
	}
</style>