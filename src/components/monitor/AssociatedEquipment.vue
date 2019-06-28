<template>
	<el-dialog
		class="AssociatedBusinessEquipment"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:before-close="getAssociatedEquipmentQx"
		append-to-body
		:title="$t('BusinessMonitoring.dialogSelectDeviceContext')"
		:visible.sync="AssociatedEquipmentBg">
		<div class="AssociatedBusinessEquipment_main">
			<el-form style="margin: 20px; margin-bottom: 0;" :model="formItem" inline>
				<el-form-item>
					<el-popover trigger="click"
											placement="bottom-start"
											v-model="isShowAssociatedEquipmentTree"
											ref="popover">
						<el-tree :data="equipmentTypeList"
										 highlight-current
										 :expand-on-click-node="false"
										 @node-click="clickAddDeviceType"
										 :props="AssociatedEquipmentTree"/>
						<el-input v-model="formItem.type"
											class="width200"
											suffix-icon="el-icon-arrow-down"
											readonly slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item>
					<template slot-scope="scope">
						<el-tooltip
							effect="dark" placement="top-start"
							:content="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')">
							<el-input
								class="width200"
								v-model="formItem.searchStr"
								@keyup.enter.native="getQueryData"
								clearable
								:placeholder="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')"/>
						</el-tooltip>
					</template>
				</el-form-item>
				<el-form-item>
					<el-button class="queryBtn" type="primary" @click="getQueryData">
						{{$t('public.query')}}
					</el-button>
				</el-form-item>
			</el-form>
			<div class="business_tree">
				<el-tree
					id="dataLimit-box-tree"
					node-key="nodeId"
					:data="dataInfoResourceTree"
					:props="dataInfoTreeProps"
					show-checkbox
					highlight-current
					:default-expand-all="expandAll"
					@check-change="handleClicktwe"
					:default-expanded-keys="defaultExpandedKeys"
					ref="vueTree">
					<div slot-scope="{node,data}"
							 :class="data.orderNum == 2 ? (data.flag === true ? 'activeColorRed' : 'activeColor') : ''">
						<span v-if="data.orderNum == 2" class="iconfont">&#xe663;</span>
						<span>{{data.nodeName}}</span>
						<span v-if="data.orderNum == 2">({{data.ip}}<span v-if="data.monitorStatus==1">,已纳管)</span></span>
					</div>
				</el-tree>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<div style="float: left;">
				<el-checkbox v-model="expandAll" @change="handleCheckAllChange">全部展开/收缩</el-checkbox>
			</div>
			<el-button type="primary" class="alertBtn" @click="getAssociatedEquipment">
				{{$t('public.confirm')}}
			</el-button>
			<el-button @click="getAssociatedEquipmentQx" class="alertBtn">
				{{$t('public.cancel')}}
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {getObjectById} from "../../assets/js/recursive";
	export default {
		name: "AssociatedEquipment",
		props: {
			AssociatedEquipmentBg: {
				type: Boolean,
				default: false,
			},
			resourceCheckedKey: {
				type: Array,
				default: [],
			},
			businessId: {
				type: String,
				default: '',
			},
			isBus: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				expandAll: false,
				defaultExpandedKeys: ['tree_other'],
				/*左侧下拉框设备树*/
				equipmentTypeList: [],
				// 缓存全部设备列表集合
				deviceList: [],
				/*右侧树*/
				treeData: [],
				isShowAssociatedEquipmentTree: false,//控制关联设备弹出层树形下拉框显示隐藏
				/*转移分组弹出层左侧表单*/
				formItem: {
					type: this.$t('BusinessMonitoring.ALL'),
					typeId: null,
					ip: null,
					searchStr: ''
				},

				/*判断单选*/
				checkedId: null,
				/*转移分组左侧树选中的id集合*/
				deviceIds: [],
				/*转移设备分组左侧下拉框tree*/
				AssociatedEquipmentTree: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*转移设备分组左侧树*/
				dataInfoTreeProps: {
					label: 'nodeName',
					children: 'children',

				},
				/*转移设备右侧树*/
				defaultPropses: {
					children: 'children',
					label: 'nodeName',
					nodeId: 'nodeId',

				},
				/*目录+设备树*/
				dataInfoResourceTree: [],
			}
		},
		methods: {
			//树展开、收缩
			handleCheckAllChange(val) {
				var _t = this;
				_t.expandAll = val;
				_t.getHandelCheckAll();
			},
			//展开收缩方法
			getHandelCheckAll() {
				var _t = this;
				for (var i = 0; i < _t.$refs.vueTree.store._getAllNodes().length; i++) {
					_t.$refs.vueTree.store._getAllNodes()[i].expanded = _t.expandAll;
				}
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
							equipmentTypeList.unshift({
								nodeName: _t.$t('BusinessMonitoring.ALL'),
								level: 1,
								children: null,
								nodeCode: null,
								parentNodeId: '0',
								nodeId: null
							});
							_t.equipmentTypeList = equipmentTypeList;
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
			// 关联设备获取数据权限 业务目录树
			getInfoDataTree() {
				var _t = this;
				_t.$api.get('asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var dataInfoResourceTree = res.data.children === null ? [] : res.data.children;
								dataInfoResourceTree.unshift({
									nodeId: 'tree_other',
									orderNum: 1,
									nodeName: _t.$t('BusinessMonitoring.dialogisNotDirectory'),
									children: []
								});
								_t.getDeviceTreeData(dataInfoResourceTree);
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
			// 关联设备获取设备列表
			getDeviceTreeData(nodeTreeData) {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceList', {
					jsonString: JSON.stringify({
						assetDevice: {
							monitorStatus: 1,
							type: _t.formItem.typeId,
							searchStr: _t.formItem.searchStr.trim() === '' ? null : _t.formItem.searchStr
						},
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var deviceList = res.data.list === null ? [] : res.data.list;
								var deviceListObject = new Object();
								deviceList.forEach((item) => {
									item.flag = false;
									item.nodeId = item.id;
									item.parentId = item.catalogId;
									item.nodeName = item.deviceName;
									item.orderNum = 2;
									if (item.children === undefined) {
										item.children = [];
									}
									// 未发现设备
									if (item.catalogId === null) {
										if (deviceListObject['tree_other'] !== undefined) {
											deviceListObject['tree_other'].push(item);
										} else {
											deviceListObject['tree_other'] = [];
											deviceListObject['tree_other'].push(item);
										}
									} else {
										// 已发现的设备
										if (deviceListObject[item.catalogId] !== undefined) {
											deviceListObject[item.catalogId].push(item);
										} else {
											deviceListObject[item.catalogId] = [];
											deviceListObject[item.catalogId].push(item);
										}
									}
								});
								// 缓存设备列表 集合用于后续的匹配
								_t.deviceList = deviceList;
							}
							// 将键值存到数组中 用于遍历
							var keyArr = new Array();
							for (var key in deviceListObject) {
								keyArr.push(key);
							}
							keyArr.forEach((item) => {
								var nodeList = getObjectById(nodeTreeData, item, 'nodeId', 'children');
								if (nodeList[0] && nodeList[0].nodeId === item) {
									if (nodeList[0].children.length !== 0) {
										deviceListObject[item].forEach((data) => {
											nodeList[0].children.unshift(data);
										});
									} else {
										nodeList[0].children = deviceListObject[item];
									}
								}

							});
							// 渲染左侧树
							_t.dataInfoResourceTree = nodeTreeData;
							_t.$nextTick(function () {
								// 树节点加载完成后选择节点并展开节点
								_t.defaultExpandedKeys = _t.resourceCheckedKey;
								_t.$refs.vueTree.setCheckedKeys(_t.resourceCheckedKey);
							});
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
			//关联设备弹出层里的查询按钮
			getQueryData() {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceMap', {
					jsonString: JSON.stringify({
						assetDevice: {
							monitorStatus: 1,
							type: _t.formItem.typeId,
							searchStr: _t.formItem.searchStr.trim() === '' ? null : _t.formItem.searchStr
						},
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								var resDataMap = res.data.map;
								if (_t.formItem.typeId === null && _t.formItem.searchStr.trim() === '') {
									_t.deviceList.forEach((item) => {
										item.flag = false;
									})
								} else {
									_t.deviceList.forEach((item) => {
										if (resDataMap[item.id]) {
											// 找到了
											item.flag = true;
										} else {
											// 没找到
											item.flag = false;
										}
									});
								}
								if(_t.formItem.typeId === null && _t.formItem.searchStr.trim() === ''){
								}else {
									_t.expandAll = true;
									_t.getHandelCheckAll();
								}
							}
							break;
						default:
							break;
					}
				})
			},
			// 关联设备点击设备类型筛选
			clickAddDeviceType(val) {
				var _t = this;
				_t.formItem.type = val.nodeName;
				_t.formItem.typeId = val.nodeCode;
				_t.isShowAssociatedEquipmentTree = false;
			},
			//关联设备左侧树节点获取
			handleClicktwe() {
				var _t = this;
			},
			//点击关联设备分组 弹出层中取消按钮
			getAssociatedEquipmentQx() {
				var _t = this;
				_t.formItem.type = _t.$t('BusinessMonitoring.ALL');
				_t.formItem.typeId = null;
				_t.formItem.ip = null;
				_t.formItem.searchStr = '';
				_t.expandAll = false;
				_t.checkedId = null;
				_t.deviceIds = [];
				//_t.$refs.mackName.resetFields(); //移除校验结果并重置字段值
				_t.$bus.emit('getDeviceTreeData', true); // 刷新设备导航树
				_t.$emit('AssociatedEquipmentBg', false); // 取消弹出层
				_t.$emit('isBus', true); // 关联业务按钮禁用
			},
			//点击关联设备 弹出层中确认按钮
			getAssociatedEquipment() {
				var _t = this;
				var deviceIdArrList = _t.$refs.vueTree.getCheckedNodes();
				var deviceIdArr = new Array();
				deviceIdArrList.forEach((item) => {
					if (item.orderNum === 2) {
						deviceIdArr.push(item.nodeId);
					}
				});
				_t.$api.post('asset/businessDevice/', {
						businessId: _t.businessId,
						deviceIds: deviceIdArr
					},
					function (res) {
						switch (res.status) {
							case 200:
								_t.getAssociatedEquipmentQx();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							default:
								_t.getAssociatedEquipmentQx();
								break;
						}
					});
			},
			//数据回显
			getDataBus() {
				var _t = this;
				_t.$api.get('asset/businessDevice/all', {
					jsonString: JSON.stringify({
						businessId: _t.businessId,
						deviceId: null,
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var deviceIds = [];
							var resData = res.data.list === null ? [] : res.data.list;

							for (var i = 0; i < resData.length; i++) {
								deviceIds.push(
									resData[i].deviceId
								);
							}
							_t.deviceIds = deviceIds;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.getAssociatedEquipmentQx();
							break;
					}
				})
			},
		}
	}
</script>

<style scoped>
	.AssociatedBusinessEquipment_main {
		overflow: hidden;
		height: 100%;
		border: 1px solid #f5f2f0;
		border-radius: 10px;
	}

	.activeColor {
		color: #4c97f0;
	}

	.activeColorRed {
		color: red;
	}

	.business_tree {
		width: 690px;
		height: 350px;
		position: absolute;
		top: 100px;
		bottom: 0;
		left: 30px;
		overflow: auto;
	}

</style>
<style>
	.AssociatedBusinessEquipment .el-dialog {
		width: 744px;
		height: 566px;
	}

	.dataDictionary-tree_check .el-checkbox__inner {
		border-radius: 50%;
	}
</style>
