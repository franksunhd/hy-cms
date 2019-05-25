<template>
	<el-dialog
		class="TransferOfGroupingClass"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:before-close="getTransferOfGroupingQx"
		append-to-body
		:title="$t('EquipmentMonitoring.TransferOfGrouping')"
		:visible.sync="TransferOfGroupingBg">
		<div style="overflow: hidden;">
			<div class="TransferOfGrouping_left">
				<span class="TransferOfGrouping_left_span">{{$t('EquipmentMonitoring.DevicesThatNeedToBeMigrated')}}</span>
				<el-form :model="formItemLeft" inline ref="mackName" :rules="rules">
					<el-form-item style="margin-left: 10px">
						<el-popover trigger="click"
												placement="bottom-start"
												v-model="isShowTransferOfGroupingtree"
												ref="popover">
							<el-tree :data="equipmentTypeList"
											 highlight-current
											 :expand-on-click-node="false"
											 @node-click="clickAddDeviceType"
											 :props="TransferOfGroupingTree"/>
							<el-input v-model="formItemLeft.type"
												class="width150"
												suffix-icon="el-icon-arrow-down"
												readonly slot="reference"/>
						</el-popover>
					</el-form-item>
					<el-form-item prop="ip">
						<el-input
							class="width150"
							v-model="formItemLeft.ip"
							:placeholder="$t('EquipmentMonitoring.PleaseEnterTheIpAddress')"/>
					</el-form-item>
					<el-form-item style="margin-right: 0;">
						<el-button class="queryBtns" type="primary" @click="getLeftData('mackName')">
							{{$t('public.query')}}
						</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-tree
						id="dataLimit-box-tree"
						node-key="nodeId"
						:data="dataInfoResourceTree"
						:props="dataInfoTreeProps"
						show-checkbox
						highlight-current
						:check-strictly="true"
						@check-change="handleClicktwe"
						:default-expanded-keys="defaultExpandedKeys"
						ref="vueTree">
						<div slot-scope="{node,data}"
								 :class="data.orderNum == 2 ? 'activeColor' : ''">
							<span v-if="data.orderNum == 2" class="iconfont">&#xe663;</span>
							<span>{{data.nodeName}}</span>
							<span v-if="data.orderNum == 2">({{data.ip}})</span>
						</div>
					</el-tree>
				</div>
			</div>
			<div class="TransferOfGrouping_right">
				<span class="TransferOfGrouping_right_span">{{$t('EquipmentMonitoring.TheTargetDirectory')}}</span>
				<el-form inline
								 :model="formItemRight"
								 ref="mackNames"
								 :rules="rules">
					<el-form-item style="margin-left: 10px" prop="ipRight">
						<el-input class="width150"
											v-model="formItemRight.ipRight"
											:placeholder="$t('EquipmentMonitoring.PleaseEnterTheIpAddress')"/>
					</el-form-item>
					<el-form-item>
						<el-button class="queryBtns"
											 type="primary"
											 @click="getRightData('mackNames')">{{$t('public.query')}}
						</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-tree
						class="dataDictionary-tree_check"
						:data="treeData"
						highlight-current
						node-key="nodeId"
						:props="defaultPropses"
						:expand-on-click-node="true"
						show-checkbox
						check-strictly
						:default-expand-all="false"
						ref="treeForm"
						@check-change="handleClick"
						@node-click="nodeClick">
						<span class="custom-tree-node" slot-scope="{ node, data}">
							<span>{{ node.label }}</span>
						</span>
					</el-tree>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" class="alertBtn" @click="getTransferOfGrouping">
				{{$t('EquipmentMonitoring.determine')}}
			</el-button>
			<el-button @click="getTransferOfGroupingQx" class="alertBtn">
				{{$t('EquipmentMonitoring.cancel')}}
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {isNotNull, isIpNumber, isIpNumbers} from "../assets/js/validator";
	import {getObjectById} from "../assets/js/recursive";
	export default {
		name: "TransferOfGrouping",
		props: {
			TransferOfGroupingBg: {
				type: Boolean,
				default: false,
			},
			resourceCheckedKey:{
				type:Array,
				default: [],
			}
		},
		data() {
			return {
				defaultExpandedKeys:['tree_other'],
				/*左侧下拉框设备树*/
				equipmentTypeList:[],
				/*右侧树*/
				treeData:[],
				isShowTransferOfGroupingtree: false,//控制转移分组弹出层左侧侧树形下拉框显示隐藏
				/*转移分组弹出层左侧表单*/
				formItemLeft: {
					type: null,
					typeId: null,
					ip: null,
				},
				/*转移分组弹出层右侧表单*/
				formItemRight: {
					type: null,
					typeId: null,
					ipRight: null,
				},
				/*判断单选*/
				checkedId: null,
				/*转移分组左侧树选中的id集合*/
				deviceIds: [],
				/*转移设备分组左侧下拉框tree*/
				TransferOfGroupingTree: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*转移设备分组左侧树*/
				dataInfoTreeProps: {
					// label: 'nodeName',
					children: 'children',
					disabled: function (data, node) {
						if (data.orderNum === 1) {
							return true;
						}
					}
				},
				/*转移设备右侧树*/
				defaultPropses: {
					children: 'children',
					label: 'nodeName',
					nodeId: 'nodeId',

				},
				/*目录+设备树*/
				dataInfoResourceTree:[],
				rules: {
					catalogName: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					ips: [{
						validator: isIpNumber,
						trigger: ['blur']
					}],
					ip: [{
						validator: isIpNumbers,
						trigger: ['blur']
					}],
					ipRight: [{
						validator: isIpNumbers,
						trigger: ['blur']
					}]
				},
			}
		},
		methods: {
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
								nodeName: 'ALL',
								level: 1,
								children: null,
								nodeCode: null,
								parentNodeId: '0',
								nodeId: null
							})
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
			// 转移分组获取数据权限 监测目录树 及右侧树
			getInfoDataTree() {
				var _t = this;
				_t.$api.get('asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.treeData = res.data.children === null ? [] : res.data.children;
							var dataInfoResourceTree = res.data.children === null ? [] : res.data.children;
							dataInfoResourceTree.unshift({
								nodeId: 'tree_other',
								orderNum: 1,
								nodeName: _t.$t('EquipmentMonitoring.isNotDirectory'),
								children: []
							});
							_t.getDeviceTreeData(dataInfoResourceTree);
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
			// 转移分组获取设备列表
			getDeviceTreeData(tree) {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceList', {
					jsonString: JSON.stringify({
						assetDevice: {
							type: _t.formItemLeft.typeId,
							ip: _t.formItemLeft.ip,
						},
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var deviceList = res.data.list === null ? [] :res.data.list;
							var deviceListObject = new Object();
							deviceList.forEach((item) => {
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
							// 将键值存到数组中 用于遍历
							var keyArr = new Array();
							for (var key in deviceListObject) {
								keyArr.push(key);
							}
							keyArr.forEach((item) => {
								var nodeList = getObjectById(tree, item, 'nodeId', 'children');
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
							_t.dataInfoResourceTree = tree;
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
			//转移设备弹出层里左侧的查询按钮
			getLeftData(formNames) {
				var _t = this;
				_t.$refs[formNames].validate((valid) => {
					if (valid) {
						_t.getInfoDataTree();
					}
				});
			},
			//转移设备弹出层里右侧的查询按钮
			getRightData(formNames) {
				var _t = this;
				_t.$refs[formNames].validate((valid) => {
					if (valid) {
						_t.TransferOfGrouping();
					}
				});
			},
			// 转移分组点击设备类型筛选
			clickAddDeviceType(val) {
				var _t = this;
				_t.formItemLeft.type = val.nodeName;
				_t.formItemLeft.typeId = val.nodeCode;
				/*_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;*/
				_t.isShowTransferOfGroupingtree = false;
				_t.getInfoDataTree();
			},
			//转移分组点击节点内容右侧树节点获取
			nodeClick(data, checked, node) {
				var _t = this;
				_t.checkedId = data.nodeId
				_t.$refs.treeForm.setCheckedNodes([data]);
			},
			//转移分组点击checked右侧树节点获取
			handleClick(data, checked, node) {
				var _t = this;
				if (checked == true) {
					_t.checkedId = data.nodeId;
					_t.$refs.treeForm.setCheckedNodes([data]);
				}
			},
			//转移分组左侧树节点获取
			handleClicktwe() {
				var _t = this;
				var selectTreeList = _t.$refs.vueTree.getCheckedKeys();
				_t.deviceIds = selectTreeList;
			},
			//点击转移设备分组 弹出层中取消按钮
			getTransferOfGroupingQx() {
				var _t = this;
				/*_t.TransferOfGroupingBg = false;//取消弹出层*/
				_t.formItemLeft = {
					type: null,
					typeId: null,
					ip: null,
				};
				_t.checkedId = null;
				_t.deviceIds = [];
				_t.$refs.mackName.resetFields(); //移除校验结果并重置字段值
				_t.$refs.mackNames.resetFields(); //移除校验结果并重置字段值
				_t.$bus.emit('getDeviceTreeData', true); // 刷新设备导航树
				_t.$emit('TransferOfGroupingBg', false); // 取消弹出层
			},
			//点击转移设备分组 弹出层中确认按钮
			getTransferOfGrouping() {
				var _t = this;
				_t.$api.post('/asset/assetDevice/move', {
						catalogId: _t.checkedId,
						deviceIds: _t.deviceIds
					},
					function (res) {
						switch (res.status) {
							case 200:
								_t.getTransferOfGroupingQx();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							default:
								_t.getTransferOfGroupingQx();
								break;
						}
				});
			},
		}
	}
</script>

<style scoped>
	.activeColor{
		color: #4c97f0;
	}
	.TransferOfGrouping_left {
		width: 432px;
		height: 440px;
		/*float: left;*/
		position: absolute;
		top: 18px;
		bottom: 0;
		left: 10px;
		overflow: auto;
		border: #ccc 1px solid;
	}

	.TransferOfGrouping_left_span {
		background-color: #f0f0f0;
		display: block;
		padding-left: 10px;
		line-height: 40px;
		margin-bottom: 12px;
	}

	.TransferOfGrouping_right {
		width: 432px;
		height: 440px;
		position: absolute;
		top: 18px;
		bottom: 0;
		right: 10px;
		overflow: auto;
		border: #ccc 1px solid;
	}

	.TransferOfGrouping_right_span {
		background-color: #f0f0f0;
		display: block;
		padding-left: 10px;
		line-height: 40px;
		margin-bottom: 12px;
	}

	.width150 {
		width: 150px;
	}

	.queryBtns {
		width: 50px;
		height: 30px;
		line-height: 30px;
	}
</style>
<style>
	.TransferOfGroupingClass .el-dialog {
		width: 944px;
		height: 566px;
	}
	.dataDictionary-tree_check .el-checkbox__inner {
		border-radius: 50%;
	}
</style>
