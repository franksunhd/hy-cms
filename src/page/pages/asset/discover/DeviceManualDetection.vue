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
						<el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expand-all="false">
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
						</div>
						<div class="ListOfUncompletedDiscoveries" @click="UncompletedDiscoveryTask">
							<el-popover placement="bottom" width="400" v-model="visible2" trigger="click" popper-class="aaa">
								<div class="ListOfUncompletedDiscoveries-process">
									<h3>发现队列中正在执行设备发现的进程</h3>
									<ul v-for="(item,index) in process" :key="item.sn" @click="handClickprocess(item.sn)">
										<li>{{item.id}}</li>
										<li>{{item.date}}</li>
										<li>{{item.name}}</li>
									</ul>
								</div>
								<el-button slot="reference">未完成的发现任务</el-button>
							</el-popover>
						</div>
					</div>
					<el-form inline>
						<div v-for="(list,index) in lists" class="DeviceManualDetection-box-right-bottom">
							<el-button @click="del(index)" style="float: right;margin-top: 20px;margin-right: 20px;"><i class="el-icon-delete"></i></el-button>
							<el-form-item label="IP地址段:">
								<el-button @click="addI(index)" style="float: right;">+</el-button>
								<template v-for="(val,i) in list.ip">
									<el-input v-model="val.startIp" class="width200"></el-input>
									<span>~</span>
									<el-input v-model="val.endIp" class="width200"></el-input>
									<el-button v-if="(i!==0)" @click="delI(index,i)">-</el-button>
									<br/>
								</template>
							</el-form-item>

							<el-form-item v-if="type == 1" label="带外用户名:">
								<el-input v-model="list.username" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 1" label="带外用户密码:">
								<el-input type="password" v-model="list.password" class="width200"></el-input>
							</el-form-item>
							<br/>
							<el-form-item v-if="type == 1" label="端口:">
								<el-input v-model="list.port" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2" label="SNMP版本:">
								<el-select v-model="list.snmpVersion" placeholder="请选择" class="width200">
									<el-option v-for="item in version" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<!--<el-input v-model="list.userName" class="width200"></el-input>-->
							</el-form-item>
							<el-form-item v-if="type == 2" label="SNMP端口:">
								<el-input v-model="list.snmpPort" class="width200"></el-input>
							</el-form-item>
							<br/>
							<el-form-item v-if="type == 2&&list.snmpVersion!=='3'" label="SNMP团体名:">
								<el-input type="password" v-model="list.snmpCommunity" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP用户名:">
								<el-input v-model="list.snmpUsername" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP安全级别:">
								<el-select v-model="list.snmpSecurityLevel" placeholder="请选择" class="width200" @change="selectsnmpSecurityLevel(list)">
									<el-option v-for="item in SecurityLevel" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP验证算法:">
								<!--str = val == "1"?"one":val=="2"?"two":"three"-->
								<el-select v-model="list.snmpAuthAlgorithm" clearable placeholder="请选择" class="width200" :disabled="list.snmpSecurityLevel==='noAuthNoPriv' ? true:(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='authPriv') ? false:false">
									<el-option v-for="item in VerifyTheAlgorithm" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP验证密码:">
								<el-input type="password" v-model="list.snmpAuthPassword" class="width200" clearable :disabled="list.snmpSecurityLevel==='noAuthNoPriv' ? true:(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP私有验证算法:">
								<el-select v-model="list.snmpPrivacyAlgorithm" placeholder="请选择" class="width200" clearable :disabled="(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='noAuthNoPriv')? true:(list.snmpSecurityLevel==='authPriv') ? false:false">
									<el-option v-for="item in PrivateVerificationAlgorithm " :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP私有密码:">
								<el-input type="password" v-model="list.snmpPrivacyPassword" class="width200" clearable :disabled="(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='noAuthNoPriv')? true:(list.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
							</el-form-item>
							<el-form-item v-if="type == 2&&list.snmpVersion==='3'" label="SNMP文本名称:">
								<el-input v-model="list.snmpContextName" class="width200"></el-input>
							</el-form-item>
						</div>
					</el-form>
				</div>
			</el-col>
		</el-row>
	</Box>
</template>

<script>
	import Box from '../../../../components/Box';
	export default {
		name: 'DeviceManualDetection',
		components: {
			Box
		},
		data() {
			return {
				/*//SNMP验证算法是否禁用
				disabledSnmpAuthAlgorithm: true,
				//SNMP验证密码是否禁用
				disabledSnmpAuthPassword: true,
				//SNMP私有验证算法是否禁用
				disabledSnmpPrivacyAlgorithm: true,
				//SNMP私有密码是否禁用
				disabledsnmpPrivacyPassword: true,
				//未完成的发现任务*/
				visible2: false,
				process: [{
					id: 1,
					date: '2019年3月23日13点45分13秒',
					name: '机架/塔式服务器'
				}, {
					id: 2,
					date: '2019年3月23日13点45分13秒',
					name: '机架/塔式服务器'
				}, {
					id: 2,
					date: '2019年3月23日13点45分13秒',
					name: '机架/塔式服务器'
				}],
				//树形控件
				da: [],
				//树形控件数据默认字段
				defaultProps: {
					parentId: 'parentId', // 父级唯一标识
					value: 'id', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
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
					snmpPort: '161',
					snmpCommunity: '',
					//版本
					snmpVersion: 'V1',
					//用户名
					snmpUsername: '',
					//安全级别
					snmpSecurityLevel: 'noAuthNoPriv',
					//验证算法
					snmpAuthAlgorithm: '',
					//验证密码
					snmpAuthPassword: '',
					//私有验证算法
					snmpPrivacyAlgorithm: '',
					//私有密码
					snmpPrivacyPassword: '',
					//文本名称
					snmpContextName: ''
				}],
				//版本
				version: [{
					value: '1',
					label: 'V1'
				}, {
					value: '2c',
					label: 'V2c'
				}, {
					value: '3',
					label: 'V3'
				}],
				//安全级别
				SecurityLevel: [{
						value: 'noAuthNoPriv',
						label: 'no auth, no priv'
					},
					{
						value: 'authNoPriv',
						label: 'auth, no priv'
					},
					{
						value: 'authPriv',
						label: 'auth, priv'
					}
				],
				//验证算法
				VerifyTheAlgorithm: [{
						value: 'MD5',
						label: 'MD5'
					},
					{
						value: 'SHA',
						label: 'SHA'
					}
				],
				//私有验证算法
				PrivateVerificationAlgorithm: [{
						value: 'DES',
						label: 'DES'
					},
					{
						value: '3DES',
						label: '3DES'
					},
					{
						value: 'AES',
						label: 'AES'
					},
					{
						value: 'AES192',
						label: 'AES192'
					},
					{
						value: 'AES256',
						label: 'AES256'
					}
				],

				//版本对象
				//versions:{},
				type: '1',
				label: '机架/塔式服务器（中）的信息',
				treeData: [],

			}
		},
		created() {
			//树形控件取值接口
			var _t = this;
			_t.$api.get('/system/basedata/all', {
				jsonString: JSON.stringify({
					"dictionaryType": "AssetType",
					"enable": true,
					"languageMark": "zh_CN"
				})
			}, function(res) {
				console.log(res)
				switch(res.status) {
					case 200:
						console.log(res.data.treeNode.children[0].children);
						_t.treeData= res.data.treeNode.children[0].children;
						console.log(_t.treeData)
						break;
					case 1003: // 无操作权限
					case 1004: // 登录过期
					case 1005: // token过期
					case 1006: // token不通过
						_t.exclude(_t, res.message);
						break;
					default:
						break;
				}

			});
		},
		methods: {
			//安全级别筛选
			selectsnmpSecurityLevel(val) {
				console.log(val);
				if(val.snmpSecurityLevel === 'noAuthNoPriv') {
					val.snmpAuthAlgorithm = "";
					val.snmpAuthPassword = '';
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';

				} else if(val === 'authNoPriv') {
					val.snmpAuthAlgorithm = "";
					val.snmpAuthPassword = '';

				} else if(val === 'authPriv') {

				}
			},
			//未完成的发现任务
			UncompletedDiscoveryTask() {
				var _t = this;
				_t.$api.post('/asset/discovery/history', {}, function(res) {

					switch(res.status) {
						case 200:
							var process = [];
							for(var key in res.data) {
								if(res.data[key].type === "1") {
									res.data[key].type = "机架/塔式服务器（中）"
								} else if(res.data[key].type === "2") {
									res.data[key].type = "网络设备（中）"
								}
								process.push({
									"dates": res.data[key].time,
									"names": res.data[key].type,
									"sns": key
								})
							}
							var processa = [];
							
							for(var i = 0; i < process.length; i++) {
								processa.push({
									"id": i + 1,
									"date": process[i].dates,
									"name": process[i].names,
									'sn': process[i].sns
								})
							}
							_t.process = processa;
							console.log(_t.process)
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							break;
					}
				})
			},
			handClickprocess(val) {
				this.$router.push({
					name: 'BeganToSee',
					params: {
						type: 1,
						value: val
					}
				});
				localStorage.setItem('hy-resdata', JSON.stringify(val));
				localStorage.setItem('hy-typesone', JSON.stringify(1));
			},
			//开始发现
			BeganToSee() {
				var _t = this;

				_t.$api.post('/asset/discovery/start', {
					param: _t.lists,
					type: _t.type
				}, function(response) {
					switch(response.status) {
						case 200:
							var res = response.data;
							if(response.status == 200) {
								_t.$router.push({
									name: 'BeganToSee',
									params: {
										value2: res,
										type: 2
									}
								});
								localStorage.setItem('hy-resdata2', JSON.stringify(res));
								localStorage.setItem('hy-typesone', JSON.stringify(2));
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, response.message);
							break;
						default:
							break;
					}
				});
			},
			//点击树形控件拼接label
			handleNodeClick(data) {
				console.log(data)
				var _t = this;
				this.label = data.nodeName;
				this.type = data.orderNum;
				/*if(this.type === 1) {
					this.label = this.label + '的信息'
				} else if(this.type === 2) {
					this.label = '【' + this.label + '】' + '的检索范围'
				}*/
			},
			//增加检索范围
			add: function() {
				let cope = {
					ip: [{
						startIp: "",
						endIp: ""
					}],
					username: "",
					password: "",
					port: "",
					//SNMP端口号
					snmpPort: '',
					//SNMP团体名
					snmpCommunity: '',
					//SNMP版本
					snmpVersion: '',
					//用户名
					snmpUsername: '',
					//安全级别
					snmpSecurityLevel: '',
					//验证算法
					snmpAuthAlgorithm: '',
					//验证密码
					snmpAuthPassword: '',
					//私有验证算法
					snmpPrivacyAlgorithm: '',
					//私有密码
					snmpPrivacyPassword: '',
					//文本名称
					snmpContextName: ''
				}
				this.lists.push(cope);
			},
			//删除检索范围
			del: function(index) {
				this.lists.splice(index, 1);
			},
			//增加ip段
			addI(index) {
				let copes = {
					ip: [{
						startIp: "",
						endIp: ""
					}]
				}
				this.lists[index].ip.push(copes)
			},
			//删除ip段
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
		height: auto;
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
		height: auto;
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
	
	.ListOfUncompletedDiscoveries-process {
		overflow: hidden;
	}
	
	.ListOfUncompletedDiscoveries-process h3 {
		font-size: 14px;
		color: #252a2f;
		padding-left: 10px;
	}
	
	.ListOfUncompletedDiscoveries-process ul {
		padding-left: 10px;
		overflow: hidden;
	}
	
	.ListOfUncompletedDiscoveries-process ul li {
		float: left;
		font-size: 14px;
		padding-left: 10px;
		padding-top: 10px;
		cursor: pointer;
	}
	
	.ListOfUncompletedDiscoveries-process ul li:first-child {
		padding-left: 0;
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
</style>
<style>
	.DeviceManualDetection-box-right-bottom .el-form-item__label {
		width: 126px;
		font-size: 12px;
	}
	
	.aaa {
		background-color: #000000;
		opacity: 0.8;
		height: 350px;
		overflow: auto
	}
</style>