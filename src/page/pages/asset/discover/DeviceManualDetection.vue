<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceDiscovery')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceManualDetection')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-row>
			<el-col :span="5"
							style="position: fixed;top: 104px;left: 56px;bottom: 0;max-width: 350px;height: 100%;border-right: 1px solid #ccc;">
				<div class="DeviceManualDetection-box-left">
					<div class="DeviceType">{{$t('breadcrumb.DeviceType')}}</div>
					<div class="TreeControl">
						<el-tree
							class="deviceManualDetection-tree"
							ref="tree"
							:data="treeData"
							:props="defaultProps"
							node-key="nodeId"
							@node-click="handleNodeClick"
							highlight-current
							:expand-on-click-node="true"
							:default-expand-all="false">
						</el-tree>
					</div>
				</div>
			</el-col>
			<el-col :span="19" style="float: right;">
				<div class="DeviceManualDetection-box-right">
					<div class="DeviceManualDetection-box-right-top">
						<div class="rackTowerServer"><span>{{label}}</span></div>
					</div>
					<div class="DeviceManualDetection-button">
						<div class="IncreaseTheSearchScope" @click='add'>
							<span class="iconfont fs14">&#xe6a1;</span>
							{{$t('DeviceManualDetection.increaseRetrieve')}}
						</div>
						<div class="BeganToSee" @click="BeganToSee">
							<span class="iconfont fs14">&#xe6ac;</span>
							{{$t('DeviceManualDetection.BeganToSee')}}
						</div>
						<div class="ListOfUncompletedDiscoveries" @click="UncompletedDiscoveryTask">
							<el-popover placement="bottom" width="400" v-model="visible2" trigger="click" popper-class="BeganToSee_unfinished">
								<div class="ListOfUncompletedDiscoveries-process">
									<h3>{{$t('DeviceManualDetection.showProcess')}}</h3>
									<ul v-for="(item,index) in process" :key="item.sn" @click="handClickprocess(item.sn)">
										<li>{{item.id}}</li>
										<li>{{item.date}}</li>
										<li>{{item.name}}</li>
									</ul>
								</div>
								<!--未完成的发现任务-->
								<el-button slot="reference">
									<span class="iconfont fs14">&#xe6ad;</span>
									{{$t('DeviceManualDetection.UncompletedDiscoveryTask')}}
								</el-button>
							</el-popover>
						</div>
					</div>
					<el-form inline>
						<div v-for="(list,index) in lists" class="DeviceManualDetection-box-right-bottom">
							<el-button v-if="index!==0" @click="del(index)" style="float: right;margin-top: 20px;margin-right: 20px;">
								<span class="iconfont ">&#xe647;</span>
							</el-button>
							<el-form-item :label="$t('DeviceManualDetection.ipAddresses') + '：'" style="display: block;margin: 0;">
								<el-button @click="addI(index)" style="float: right;margin-top: 1px;">+</el-button>
								<template v-for="(val,i) in list.ip">
									<el-input v-model="val.startIp" class="width200" style="margin-bottom: 20px;"></el-input>
									<span>~</span>
									<el-input @focus="FocusStartIp(val)"  v-model="val.endIp" ref="input" class="width200" style="margin-bottom: 20px;"></el-input>
									<el-button v-if="(i!==0)" @click="delI(index,i)" style="margin-bottom: 20px;">-</el-button>
									<br/>
								</template>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId0)!=-1"
										  :label="$t('DeviceManualDetection.username') + '：'">
								<el-input v-model="list.username" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId0)!=-1"
										  :label="$t('DeviceManualDetection.password') + '：'">
								<el-input type="password" v-model="list.password" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId0)!=-1"
										  :label="$t('DeviceManualDetection.port') + '：'">
								<el-input v-model="list.port" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1"
										  :label="$t('DeviceManualDetection.snmpVersion') + '：'">
								<el-select
									v-model="list.snmpVersion"
									class="width200">
									<el-option
										v-for="item in version" :key="item.value"
										:label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1" :label="$t('DeviceManualDetection.snmpPort') + '：'">
								<el-input v-model="list.snmpPort" class="width200"></el-input>
							</el-form-item>
							<br/>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion!=='3'"
										  :label="$t('DeviceManualDetection.snmpCommunity') + '：'">
								<el-input type="password" v-model="list.snmpCommunity" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
										  :label="$t('DeviceManualDetection.snmpUsername') + '：'">
								<el-input v-model="list.snmpUsername" class="width200"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
										  :label="$t('DeviceManualDetection.snmpSecurityLevel') + '：'">
								<el-select
									v-model="list.snmpSecurityLevel"
									class="width200"
									@change="selectsnmpSecurityLevel(list)">
									<el-option v-for="item in SecurityLevel"
											   :key="item.value"
											   :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
										  :label="$t('DeviceManualDetection.snmpAuthAlgorithm') + '：'">
								<el-select
									v-model="list.snmpAuthAlgorithm" clearable
									class="width200"
									:disabled="list.snmpSecurityLevel==='noAuthNoPriv' ? true:(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='authPriv') ? false:false">
									<el-option v-for="item in VerifyTheAlgorithm"
											   :key="item.value" :label="item.label"
											   :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
										  :label="$t('DeviceManualDetection.snmpAuthPassword') + '：'">
								<el-input type="password" v-model="list.snmpAuthPassword"
										  class="width200" clearable
										  :disabled="list.snmpSecurityLevel==='noAuthNoPriv' ? true:(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
										  :label="$t('DeviceManualDetection.snmpPrivacyAlgorithm') + '：'">
								<el-select
									v-model="list.snmpPrivacyAlgorithm"
									class="width200"
									clearable
									:disabled="(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='noAuthNoPriv')? true:(list.snmpSecurityLevel==='authPriv') ? false:false">
									<el-option v-for="item in PrivateVerificationAlgorithm "
											   :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
														:label="$t('DeviceManualDetection.snmpPrivacyPassword') + '：'">
								<el-input type="password" v-model="list.snmpPrivacyPassword" class="width200" clearable
													:disabled="(list.snmpSecurityLevel==='authNoPriv'||list.snmpSecurityLevel==='noAuthNoPriv')? true:(list.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
							</el-form-item>
							<el-form-item v-if="Id.indexOf(nodeId.nodeId1)!=-1&&list.snmpVersion==='3'"
														:label="$t('DeviceManualDetection.snmpContextName') + '：'">
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
	import Box from '../../../../components/common/Box';
	export default {
		name: 'DeviceManualDetection',
		components: {
			Box
		},
		data() {
			return {
				nodeIdOne: '',
				nodeIdTwo: '',
				nodeIdThree: '',
				nodeIdFour: '',
				nodeIdFive: '',
				//未完成的发现任务*/
				visible2: false,
				//点击左侧树获取的id
				Id: '',
				process: [],
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
						startIp: '',
						endIp: ''
					}],
					username: '',
					password: '',
					port: '',
					snmpPort: '',
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
				type: '1',
				label: '',
				treeData: [],
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				//左侧树nodeid值
				nodeId:{},

			}
		},
		created() {
			//树形控件取值接口
			var _t = this;
			_t.$api.get('/system/basedata/all', {
				jsonString: JSON.stringify({
					"dictionaryType": "AssetType",
					"enable": true,
					"languageMark": localStorage.getItem("hy-language")
				})
			}, function (res) {
				switch (res.status) {
					case 200:
						var obj =new Object();
						for(var i=0;i<res.data.treeNode.children[0].children.length;i++){
							obj['nodeId'+i] = res.data.treeNode.children[0].children[i].nodeId;
						}

						_t.nodeId=obj;
						_t.treeData = res.data.treeNode.children[0].children === null ? [] : res.data.treeNode.children[0].children;
						// 获取treeData的第一个节点 并高亮选中
						if (_t.treeData[0]) {
							_t.$nextTick(function () {
								_t.$refs.tree.setCurrentKey(_t.treeData[0]);
								_t.handleNodeClick(_t.treeData[0])
							});
						}
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
				if (val.snmpSecurityLevel === 'noAuthNoPriv') {
					val.snmpAuthAlgorithm = '';
					val.snmpAuthPassword = '';
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authNoPriv') {
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authPriv') {
				}
			},
			// 查询表格中状态对应的数据值
			getSnData(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 获取对应的状态值
							_t.tableDataBase = res.data;
							var process = [];
							var index = 0;
							for (var key in resData) {
								index++;
								process.push({
									"date": resData[key].time,
									"name": _t.tableDataBase.AssetType[resData[key].type],
									"sn": key,
									"id": index
								})
							}
							_t.process = process;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableDataBase = [];
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							_t.disableBtn.more = true;
							break;
					}
				});
			},
			//未完成的发现任务
			UncompletedDiscoveryTask() {
				var _t = this;
				_t.$api.post('/asset/discovery/history', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.getSnData(res.data);
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
				}, function (response) {
					switch (response.status) {
						case 200:
							var res = response.data=== null ? [] :response.data;
							if (response.status == 200) {
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
				var _t = this;
				_t.label = data.nodeName;
				_t.type = data.nodeCode;
				_t.Id = data.nodeId;
			},
			//ip地址段开始ip段获取
			FocusStartIp(val){
				var _t=this;
					var ip = val.startIp;
					val.endIp = ip;
			},
			//增加检索范围
			add: function () {
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
			del: function (index) {
				this.lists.splice(index, 1);
			},
			//增加ip段
			addI(index) {
				var _t = this;
				let copes = {
						startIp: "",
						endIp: ""
				};
				_t.lists[index].ip.push(copes)
			},
			//删除ip段
			delI(index, i) {
				this.lists[index].ip.splice(i, 1);
			}
		},

	}
</script>
<style scoped>
	.DeviceManualDetection-box-left {
		padding: 20px;
		background-color: #fff;
		z-index: 1001;
		height: 100%;
		overflow: hidden;
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

	.rackTowerServer {
	}

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
		height: 30px;
		text-align: center;
		line-height: 30px;
		margin-left: 20px;
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
		width: 156px;
		font-size: 12px;
	}

	.DeviceManualDetection-box-right .el-form--inline .el-form-item {
		margin-right: 100px;
	}

	.BeganToSee_unfinished {
		background-color: #000000;
		opacity: 0.8;
		height: 350px;
		overflow: auto
	}

	.deviceManualDetection-tree .el-tree-node__content {
		height: 36px;
		line-height: 36px;
	}
</style>
