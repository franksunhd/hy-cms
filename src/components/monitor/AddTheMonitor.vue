<template>
	<div>
		<el-dialog
			class="AddEquipmentMonitoring"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:before-close="getAddDevicemonitoringQx"
			append-to-body
			:title="$t('BusinessMonitoring.dialogAddDeviceMonitoring')"
			:visible.sync="AddDeviceMonitoringBg">
			<div class="AddEquipmentMonitoring_box"
				 v-loading="loading"
					 :element-loading-text="$t('public.loading')"
					 element-loading-spinner="el-icon-loading"
					 element-loading-background="rgba(0, 0, 0, 0.6)">
				<div class="AddEquipmentMonitoring_left">
					<el-tree :data="equipmentTypeList"
							 highlight-current
							 :expand-on-click-node="true"
							 node-key="nodeId"
							 ref="tree"
							 @node-click="clickAddDeviceTypeNode"
							 :props="AddDeviceTypeNode"
							 :default-expand-all="false"/>
				</div>
				<div class="AddEquipmentMonitoring_right">
					<el-form :model="forssItem" inline>
						<el-form-item>
							<template slot-scope="scope">
								<el-tooltip
									effect="dark" placement="top-start"
									:content="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')">
									<el-input v-model="forssItem.searchStr"
											  :placeholder="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')"
											  class="width200" clearable></el-input>
								</el-tooltip>
							</template>
						</el-form-item>
						<el-form-item>
							<el-button class="queryBtn"
									   type="primary"
									   @click="getDataTwe">
								{{$t('public.query')}}
							</el-button>
						</el-form-item>
					</el-form>
					<!--添加设备监测表格-->
					<el-table border :data="tableDataOne" stripe
							  @selection-change="handleSelectionChangeOne">
						<el-table-column type="selection"
										 width="40"
										 header-align="center"
										 align="center">
						</el-table-column>
						<!--序号-->
						<el-table-column width="50px"
										 :label="$t('public.index')"
										 header-align="center"
										 align="center">
							<template slot-scope="scope">
								<span>
									{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
								</span>
							</template>
						</el-table-column>
						<!--ip-->
						<el-table-column :label="$t('BusinessMonitoring.dialogIp')"
										 header-align="center"
										 align="left">
							<template slot-scope="scope">
								<span>{{scope.row.ip}}</span>
							</template>
						</el-table-column>
						<!--设备名称-->
						<el-table-column :label="$t('BusinessMonitoring.dialogDeviceName')"
										 header-align="left"
										 align="left">
							<template slot-scope="scope">
								<span>{{scope.row.deviceName}}</span>
							</template>
						</el-table-column>
						<!--设备类型-->
						<el-table-column :label="$t('BusinessMonitoring.dialogType')"
										 header-align="left"
										 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark"
											:content="tableDataBase.AssetType[scope.row.type]"
											placement="top-start">
									<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--序列号-->
						<el-table-column :label="$t('BusinessMonitoring.dialogServiceTag')"
										 header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.servicetag"
											placement="top-start">
									<span>{{scope.row.servicetag}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--厂商型号-->
						<el-table-column :label="$t('BusinessMonitoring.dialogManufacturersModel')"
										 header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark"
											:content="scope.row.manufacturer+','+scope.row.model"
											placement="top-start">
									<span>{{scope.row.manufacturer}},{{scope.row.model}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--状态=设备发现描述-->
						<el-table-column :label="$t('BusinessMonitoring.dialogState')"
										 header-align="left" align="left">
							<template slot-scope="scope">
								<span v-if="scope.row.isResultFalse == 1"></span>
								<span v-if="scope.row.isResultFalse == 2">
									{{$t('BusinessMonitoring.dialogSuccessful')}}
								</span>
								<span v-if="scope.row.isResultFalse == 3">
									{{$t('BusinessMonitoring.dialogFailure')}}
								</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn"
						   :disabled="disabledLod"
						   type="primary"
						   @click="getAddDevicemonitoring">
					{{$t('BusinessMonitoring.dialogTheNextStep')}}
				</el-button>
				<el-button @click="getAddDevicemonitoringQx"
						   class="alertBtn">{{$t('public.cancel')}}
				</el-button>
			</div>
		</el-dialog>
		<!--下一页-->
		<el-dialog class="ModifyMonitoringSetting" :close-on-click-modal="false"
				   :close-on-press-escape="false" :before-close="getAddDevicemonitoringNextQx"
				   append-to-body :title="$t('BusinessMonitoring.dialogAddDeviceMonitoring')"
				   :visible.sync="AddDeviceMonitoringNextBg">
			<el-form inline :model="forsItem">
				<!--基本信息-->
				<el-form-item v-if="manufacturerList.length !=0"
							  style="display: block; width:700px">
					<div class="fs14"
						 style="color: #000; width: 680px; border-bottom: 1px solid #ccc;margin-left: 20px">
						{{$t('BusinessMonitoring.dialogTheBasicInformation')}}
					</div>
				</el-form-item>
				<!--带外用户名-->
				<el-form-item v-if="forssItem.typeId==='1'"
							  :label="$t('DeviceManualDetection.username') + '：'" prop="username">
					<el-input v-model="forsItem.username"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--带外用户密码-->
				<el-form-item v-if="forssItem.typeId==='1'"
							  :label="$t('DeviceManualDetection.password') + '：'" prop="password">
					<el-input type="password"
							  v-model="forsItem.password"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--端口-->
				<el-form-item v-if="forssItem.typeId==='1'"
							  :label="$t('DeviceManualDetection.port') + '：'" prop="port">
					<el-input v-model="forsItem.port"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--华为服务器选填信息-->
				<!--文字-->
				<el-form-item v-if="manufacturerList.length !=0"
							  style="display: block; width:700px;">
					<div class="fs14"
						 style="color: #000; width: 680px; border-bottom: 1px solid #ccc;margin-left: 20px">
						{{$t('BusinessMonitoring.dialogHuaweiServerOptionalInformation')}}
					</div>
				</el-form-item>
				<!--snmp版本-->
				<el-form-item v-if="forssItem.typeId==='2' || manufacturerList.length !=0" :label="$t('DeviceManualDetection.snmpVersion') + '：'">
					<el-select v-model="forsItem.snmpVersion"
							   :placeholder="$t('public.select')"
							   class="width200"
							   clearable>
						<el-option v-for="item in version"
								   :key="item.value"
								   :label="item.label"
								   :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--snmp端口-->
				<el-form-item v-if="forssItem.typeId==='2'||manufacturerList.length !=0" :label="$t('DeviceManualDetection.snmpPort') + '：'">
					<el-input v-model="forsItem.snmpPort"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--snmp团体名-->
				<el-form-item v-if="(forssItem.typeId==='2'&&forsItem.snmpVersion!='3')||(manufacturerList.length !=0&& forsItem.snmpVersion!='3')"
							  :label="$t('DeviceManualDetection.snmpCommunity') + '：'">
					<el-input type="password"
							  v-model="forsItem.snmpCommunity"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--snmp用户名-->
				<el-form-item v-if="(forssItem.typeId==='2'&&forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpUsername') + '：'">
					<el-input v-model="forsItem.snmpUsername"
							  class="width200"
							  clearable>
					</el-input>
				</el-form-item>
				<!--snmp安全级别-->
				<el-form-item v-if="(forssItem.typeId==='2'&&forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpSecurityLevel') + '：'">
					<el-select v-model="forsItem.snmpSecurityLevel"
							   :placeholder="$t('public.select')"
							   clearable
							   class="width200"
							   @change="selectsnmpSecurityLevels(forsItem)">
						<el-option v-for="item in SecurityLevel"
								   :key="item.value"
								   :label="item.label"
								   :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--snmp验证算法-->
				<el-form-item v-if="(forssItem.typeId==='2' && forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpAuthAlgorithm') + '：'">
					<el-select v-model="forsItem.snmpAuthAlgorithm"
							   clearable
							   :placeholder="$t('public.select')"
							   class="width200"
							   :disabled="forsItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='authPriv') ? false:false">
						<el-option v-for="item in VerifyTheAlgorithm" :key="item.value"
								   :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--snmp验证密码-->
				<el-form-item v-if="(forssItem.typeId==='2' && forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpAuthPassword') + '：'">
					<el-input type="password"
							  v-model="forsItem.snmpAuthPassword"
							  class="width200"
							  clearable
							  :disabled="forsItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
				</el-form-item>
				<!--snmp私有验证算法-->
				<el-form-item v-if="(forssItem.typeId==='2' && forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpPrivacyAlgorithm') + '：'">
					<el-select v-model="forsItem.snmpPrivacyAlgorithm"
							   :placeholder="$t('public.select')"
							   class="width200"
							   clearable
							   :disabled="(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forsItem.snmpSecurityLevel==='authPriv') ? false:false">
						<el-option v-for="item in PrivateVerificationAlgorithm "
								   :key="item.value"
								   :label="item.label"
								   :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--snmp私有验证密码-->
				<el-form-item v-if="(forssItem.typeId==='2' && forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpPrivacyPassword') + '：'">
					<el-input type="password"
							  v-model="forsItem.snmpPrivacyPassword"
							  class="width200"
							  clearable
							  :disabled="(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forsItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
				</el-form-item>
				<!--snmp文本名称-->
				<el-form-item v-if="(forssItem.typeId==='2' && forsItem.snmpVersion=='3')||(manufacturerList.length !=0&& forsItem.snmpVersion=='3')"
							  :label="$t('DeviceManualDetection.snmpContextName') + '：'">
					<el-input v-model="forsItem.snmpContextName"
							  class="width200"
							  clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" @click="egtThePreviousPage">
					{{$t('BusinessMonitoring.dialogThePreviousPage')}}
				</el-button>
				<el-button type="primary" class="alertBtn" @click="getAddDevicemonitoringNext">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" @click="getAddDevicemonitoringNextQx">
					{{$t('public.cancel')}}
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// import {isNotNull, isIpNumbers} from "../../assets/js/validator";
	export default {
		name: "AddTheMonitor",
		props: {
			//第一页弹出层
			AddDeviceMonitoringBg: {
				type: Boolean,
				default: false,
			},
			//第二页弹出层
			AddDeviceMonitoringNextBg: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				timers: null, //记录定时器
				disabledLod:false,
				loading: false,
				/*添加监测页表格选中后的集合*/
				multipleSelectionOne: [],
				/*添加监测页表格选中后的huawei集合*/
				manufacturerList:[],
				forssItem: {
					/*ip地址*/
					ip: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*目录节点获取nodeCode*/
					catalogPath: null,
					/*模糊查询的设备名称/Ip/序列号*/
					searchStr: null,
					/*设备类型*/
					type: null,
					/*设备类型ID*/
					typeId: null,
				},
				//添加监测二级页面数据
				forsItem: {
					/**    用户名 **/
					username: null,
					/**    密码。AES加密存储 **/
					password: null,
					/**端口号， SSH或TELNET **/
					port: null,
					/**    SNMP版本 **/
					snmpVersion: '2c',
					/**    SNMP团体名 **/
					snmpCommunity: null,
					/**    SNMP端口号 **/
					snmpPort: null,
					/**    SNMP用户名 **/
					snmpUsername: null,
					/**    SNMP安全级别 **/
					snmpSecurityLevel: "noAuthNoPriv",
					/**    SNMP验证算法 **/
					snmpAuthAlgorithm: null,
					/**    SNMP验证密码 **/
					snmpAuthPassword: null,
					/**    SNMP私有验证算法 **/
					snmpPrivacyAlgorithm: null,
					/**    SNMP私有密码 **/
					snmpPrivacyPassword: null,
					/**    SNMP文本名称 **/
					snmpContextName: null,
					/*监测间隔时间*/
					monitorInterval: null,
				},
				//添加监测的表格数据
				tableDataOne: [],
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
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
					},
				],
				//左侧树
				treeData: [],
				/*下拉框树*/
				equipmentTypeList: [],
				/*rules: {
					catalogName: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					ips: [{
						validator: isIpNumbers,
						trigger: ['blur']
					}],
				},*/
				/*添加设备监测右侧下拉框tree*/
				AddDeviceTypeNode: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*添加设备监测左侧tree*/
				AddDeviceMonitor: {
					catalogPath: 'nodeCode',
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				isShowAddDeviceMonitoringtree:false,
				sn:'',
			}
		},
		mounted(){
			var _t=this;
			_t.getTableDataValue();

		},
		methods: {
			// 查询表格中状态对应的数据值
			getTableDataValue() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity", "DeviceMonitorStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 获取表格对应的状态值
							_t.tableDataBase = res.data;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableDataBase = {};
							break;
					}
				});
			},
			// 查询设备类型
			getBaseData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/basedata/all', {
					jsonString: JSON.stringify({
						systemBasedata: {
							dictionaryType: 'AssetType',
							languageMark: localStorage.getItem('hy-language')
						}
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var equipmentTypeList = res.data.treeNode.children[0].children === null ? [] : res.data.treeNode.children[0].children;

							_t.equipmentTypeList = equipmentTypeList;
							// 获取treeData的第一个节点 并高亮选中
							if (_t.equipmentTypeList[0]) {
								_t.$nextTick(function () {
									_t.$refs.tree.setCurrentKey(_t.equipmentTypeList[0]);
									_t.clickAddDeviceTypeNode(_t.equipmentTypeList[0]);
									_t.getQueryTable();
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
							_t.equipmentTypeList = [];
							break;
					}
				});
			},
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('/asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.treeData = res.data.children === null ? [] :res.data.children;
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
			//添加监测安全级别筛选
			selectsnmpSecurityLevels(val) {
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
			/*----------------------------------------------------------------------*/
			//添加监测表格数据获取
			getQueryTable() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							/*设备类型*/
							type: _t.forssItem.typeId == null ? null : _t.forssItem.typeId,
							monitorStatus: 0,
							searchStr: _t.forssItem.searchStr,
							catalogPath: _t.forssItem.catalogPath,
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if(res.data!==null){
								var resData = res.data.list === null ? [] : res.data.list;
								resData.forEach((item) => {
									item.isResultFalse = 1;
								});
								_t.tableDataOne = resData;
								_t.$bus.emit('tableData', true); // 刷新tableData请求tableDataBase
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
			//点击添加设备监测弹出层里的下一步按钮
			getAddDevicemonitoring() {
				var _t = this;
				if (_t.multipleSelectionOne.length > 0) {
					_t.$emit('AddDeviceMonitoringBg',false);
					_t.$emit('AddDeviceMonitoringNextBg',true);
				} else {
					_t.$confirm(_t.$t('BusinessMonitoring.dialogAddMonitorTip')+'！', _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass:'alertBtn',
						cancelButtonText: _t.$t('public.cancel'),
						cancelButtonClass:'alertBtn',
						type: 'warning'
					}).then(() => {

					}).catch(() => {

					});
				}
			},
			//点击添加设备监测弹出层里的取消按钮
			getAddDevicemonitoringQx() {
				var _t = this;
				_t.tableDataOne = [];
				_t.forssItem = {
					catalogPath: null,
					typeId: null,
					type: null,
					ips: null
				};
				clearInterval(_t.timers);
				_t.timers = null;
				_t.disabledLod=false;
				_t.loading=false;
				_t.$bus.emit('tableData', true); // 刷新tableData
				_t.$emit('AddDeviceMonitoringBg', false); // 取消弹出层
			},
			//点击添加设备监测弹出层里的上一步弹出层中的确认按钮
			egtThePreviousPage() {
				var _t = this;
				_t.$emit('AddDeviceMonitoringBg',true);
				_t.$emit('AddDeviceMonitoringNextBg',false);
			},
			//点击添加设备监测弹出层里的下一步弹出层中的确认按钮
			getAddDevicemonitoringNext() {
				var _t = this;
					_t.loading=true;
					_t.disabledLod=true;
					_t.$api.post('/asset/discovery/start', {
						param: [_t.forsItem],
						deviceIds: _t.multipleSelectionOne,
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.sn = res.data;
								_t.$emit('AddDeviceMonitoringBg',true);
								_t.$emit('AddDeviceMonitoringNextBg',false);
								_t.getAddDevicemonitoringNexttwe();
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
			//状态值
			getAddDevicemonitoringNexttwe() {
				var _t = this;
				_t.$api.post('/asset/discovery/result', {
					sn: _t.sn,
				}, function (res) {
					switch (res.status) {
						case 200:
							var pageList = res.data.pageList === null ? [] : res.data.pageList;
							var isfalse = false;
							for(var j=0;j<pageList.length;j++){
								if(pageList[j].finish == false){
									isfalse=true;
								}
							}
								if (isfalse==false) {
									clearInterval(_t.timers);
									_t.timers=null;
									for (var i = 0; i < pageList.length; i++) {
										var tableDataOne = _t.tableDataOne;
										tableDataOne.forEach((item) => {
											pageList.forEach((val) => {
												if (item.id === val.deviceId) {
													if (val.discovery === true) {
														item.isResultFalse = 2;
													} else if (val.discovery === false) {
														item.isResultFalse = 3;
													} else {
														item.isResultFalse = 1;
													}
												}
											})
										});
										_t.loading = false;
										_t.disabledLod = false;
										_t.tableDataOne = tableDataOne;
									}
								}else {
									_t.timer();
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
				})
			},
			//持续刷新页面直到finish为true结束
			timer() {
				var _t = this;
				clearInterval(_t.timers);
				_t.timers=null;
				_t.timers = setInterval(()=>{
					_t.getAddDevicemonitoringNexttwe();
				},3000);

			},
			//点击添加设备监测弹出层里的下一步弹出层中的取消按钮
			getAddDevicemonitoringNextQx() {
				var _t = this;
				_t.forsItem = {
					/**    用户名 **/
					username: null,
					/**    密码。AES加密存储 **/
					password: null,
					/**端口号， SSH或TELNET **/
					port: null,
					/**    SNMP版本 **/
					snmpVersion: '2c',
					/**    SNMP团体名 **/
					snmpCommunity: null,
					/**    SNMP端口号 **/
					snmpPort: null,
					/**    SNMP用户名 **/
					snmpUsername: null,
					/**    SNMP安全级别 **/
					snmpSecurityLevel: "noAuthNoPriv",
					/**    SNMP验证算法 **/
					snmpAuthAlgorithm: null,
					/**    SNMP验证密码 **/
					snmpAuthPassword: null,
					/**    SNMP私有验证算法 **/
					snmpPrivacyAlgorithm: null,
					/**    SNMP私有密码 **/
					snmpPrivacyPassword: null,
					/**    SNMP文本名称 **/
					snmpContextName: null,
					/*监测间隔时间*/
					monitorInterval: null,
				};
				_t.$bus.emit('tableData', true); // 刷新tableData
				_t.$emit('AddDeviceMonitoringNextBg', false); // 取消弹第二级出层
			},
			// 点击添加监测树获取节点
			clickAddDeviceTypeNode(val) {
				var _t = this;
				_t.forssItem.type = val.nodeName;
				_t.forssItem.typeId = val.nodeCode;
				_t.isShowAddDeviceMonitoringtree = false;
				_t.getQueryTable();
			},
			//点击添加设备监测弹出层里的查询按钮
			getDataTwe() {
				var _t = this;
				_t.getQueryTable();
			},
			//添加设备监测弹出层里的表格改变获取值
			handleSelectionChangeOne(val) {
				var _t = this;
				var multipleSelectionOne = [];
				var manufacturerList=[];
				for (var i = 0; i < val.length; i++) {
					multipleSelectionOne.push(val[i].id);
					if(val[i].manufacturer.toLowerCase()=='huawei'){
						manufacturerList.push(val[i].manufacturer);
					}
				}
				_t.manufacturerList = manufacturerList;
				_t.multipleSelectionOne = multipleSelectionOne;
			},
		}
	}
</script>
<style scoped>
	.AddEquipmentMonitoring_box {
		display: flex;
	}

	.AddEquipmentMonitoring_left {
		border: 1px solid #ccc;
		width: 230px;
		height: 455px;
	}

	.AddEquipmentMonitoring_right {
		flex: 1;
		height: 455px;
		padding-left: 20px;
	}
</style>
<style>
	.AddEquipmentMonitoring .el-dialog {
		width: 944px;
		height: 588px;
	}
	.ModifyMonitoringSetting .el-dialog {
		width: 800px;
		height: 476px;
	}
	.ModifyMonitoringSetting .el-dialog__title{
		font-size: 15px;
	}
	.ModifyMonitoringSetting .el-form-item {
		width: 46%;
		height: 25px;
	}

	.ModifyMonitoringSetting .el-form-item__label {
		width: 130px;
		height: 25px;
	}
	.AddEquipmentMonitoring_box .el-loading-text{
		color:#fff;
	}
</style>
