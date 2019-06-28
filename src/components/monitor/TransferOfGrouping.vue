<template>
	<el-dialog
		class="TransferOfGroupingClass"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:before-close="getTransferOfGroupingQx"
		append-to-body
		:title="$t('BusinessMonitoring.dialogBtnTransferOfGrouping')"
		:visible.sync="TransferOfGroupingBg">
		<div style="overflow: hidden;">
			<div class="TransferOfGrouping_left">
				<span class="TransferOfGrouping_left_span">
					{{$t('BusinessMonitoring.dialogDevicesThatNeedToBeMigrated')}}
				</span>
				<el-form :model="formItemLeft" inline>
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
					<el-form-item>
						<template slot-scope="scope">
							<el-tooltip
								effect="dark" placement="top-start"
								:content="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')">
								<el-input
									class="width150"
									v-model="formItemLeft.searchStr"
									@keyup.enter.native="getLeftData"
									:placeholder="$t('BusinessMonitoring.dialogPleaseEnterTheIpAddress')"
									clearable/>
							</el-tooltip>
						</template>
					</el-form-item>
					<el-form-item style="margin-right: 0;">
						<el-button class="queryBtns" type="primary" @click="getLeftData">
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
						:default-expand-all="expandAll"
						@check-change="handleClicktwe"
						:default-expanded-keys="defaultExpandedKeys"
						ref="vueTree">
						<div slot-scope="{node,data}"
								 :class="data.orderNum == 2 ? (data.flag===true ? 'activeColorRed' : 'activeColor') : ''">
							<span v-if="data.orderNum == 2" class="iconfont">&#xe663;</span>
							<span>{{data.nodeName}}</span>
							<span v-if="data.orderNum == 2">({{data.ip}})</span>
						</div>
					</el-tree>
				</div>
			</div>
			<div class="TransferOfGrouping_right">
				<span class="TransferOfGrouping_right_span">{{$t('BusinessMonitoring.dialogTargetDirectory')}}</span>
				<el-form inline
								 :model="formItemRight">
					<el-form-item style="margin-left: 10px">
						<template slot-scope="scope">
							<el-tooltip effect="dark" placement="top-start"
										:content="$t('BusinessMonitoring.dialogPleaseEnterADeviceGroupName')">
								<el-input class="width150"
										  v-model="filterText"
										  :placeholder="$t('BusinessMonitoring.dialogPleaseEnterADeviceGroupName')"
										  clearable/>
							</el-tooltip>
						</template>
					</el-form-item>
					<el-form-item>
						<el-button class="queryBtns"
								   type="primary"
								   @click="getRightData">{{$t('public.query')}}
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
						:filter-node-method="filterNode"
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
			<div style="float: left;">
				<el-checkbox v-model="expandAll" @change="handleCheckAllChange">全部展开/收缩</el-checkbox>
			</div>

			<el-button type="primary" class="alertBtn" @click="getTransferOfGrouping">
				{{$t('public.confirm')}}
			</el-button>
			<el-button @click="getTransferOfGroupingQx" class="alertBtn">
				{{$t('public.cancel')}}
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {getObjectById} from "../../assets/js/recursive";

	export default {
		name: "TransferOfGrouping",
		props: {
			TransferOfGroupingBg: {
				type: Boolean,
				default: false,
			},
			resourceCheckedKey: {
				type: Array,
				default: [],
			}
		},
		data() {
			return {
				deviceList: [],
				expandAll: false,
				isval: false,
				defaultExpandedKeys: ['tree_other'],
				/*左侧下拉框设备树*/
				equipmentTypeList: [],
				/*右侧树*/
				treeData: [],
				isShowTransferOfGroupingtree: false,//控制转移分组弹出层左侧侧树形下拉框显示隐藏
				/*转移分组弹出层左侧表单*/
				formItemLeft: {
					type: this.$t('BusinessMonitoring.ALL'),
					typeId: null,
					ip: null,
					searchStr: ''
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
				//右侧树筛选值
				filterText: '',
				deviceListObject: {},
			}
		},
		watch: {
			filterText(val) {
				this.$refs.treeForm.filter(val);
			}
		},
		methods: {
			//点击展开收缩
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
			//筛选右侧树
			filterNode(value, data) {
				if (!value) return true;
				return data.nodeName.indexOf(value) !== -1;
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
								nodeName: _t.$t('public.all'),
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
							if (res.data !== null) {
								var listData = res.data.children === null ? [] : res.data.children;
								var treeData = new Array();
								var dataInfoResourceTree = new Array();
								listData.forEach((item) => {
									treeData.push(item);
									dataInfoResourceTree.push(item);
								});
								dataInfoResourceTree.unshift({
									nodeId: 'tree_other',
									orderNum: 1,
									nodeName: _t.$t('BusinessMonitoring.dialogisNotDirectory'),
									children: []
								});
								_t.treeData = treeData;
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
							type: _t.formItemLeft.typeId,
							searchStr: _t.formItemLeft.searchStr.trim() === '' ? null : _t.formItemLeft.searchStr
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
			//关联设备弹出层里左侧的查询按钮
			getLeftData() {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceMap', {
					jsonString: JSON.stringify({
						assetDevice: {
							monitorStatus: 1,
							type: _t.formItemLeft.typeId,
							searchStr: _t.formItemLeft.searchStr.trim() === '' ? null : _t.formItemLeft.searchStr
						},
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								var resDataMap = res.data.map;
								if (_t.formItemLeft.typeId === null && _t.formItemLeft.searchStr.trim() === '') {
									_t.deviceList.forEach((item) => {
										item.flag = false;
									});
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
								if(_t.formItemLeft.typeId === null && _t.formItemLeft.searchStr.trim() === ''){

								}else {
									_t.expandAll=true;
									_t.getHandelCheckAll();
								}
							}
							break;
						default:
							break;
					}
				})
			},
			//转移设备弹出层里右侧的查询按钮
			getRightData() {
				var _t = this;
			},
			// 转移分组点击设备类型筛选
			clickAddDeviceType(val) {
				var _t = this;
				_t.formItemLeft.type = val.nodeName;
				_t.formItemLeft.typeId = val.nodeCode;
				_t.isShowTransferOfGroupingtree = false;
			},
			//转移分组点击节点内容右侧树节点获取
			nodeClick(data, checked, node) {
				var _t = this;
				_t.checkedId = data.nodeId;
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
				/*var selectTreeList = _t.$refs.vueTree.getCheckedKeys();
				_t.deviceIds = selectTreeList;*/
			},
			//点击转移设备分组 弹出层中取消按钮
			getTransferOfGroupingQx() {
				var _t = this;
				_t.formItemLeft.type = _t.$t('BusinessMonitoring.ALL');
				_t.formItemLeft.typeId = null;
				_t.formItemLeft.ip = null;
				_t.formItemLeft.searchStr = '';
				_t.expandAll = false;
				_t.checkedId = null;
				_t.deviceIds = [];
				_t.$bus.emit('getDeviceTreeData', true); // 刷新设备导航树
				_t.$emit('TransferOfGroupingBg', false); // 取消弹出层
			},
			//点击转移设备分组 弹出层中确认按钮
			getTransferOfGrouping() {
				var _t = this;
				var deviceIdArrList = _t.$refs.vueTree.getCheckedNodes();
				var deviceIdArr = new Array();
				deviceIdArrList.forEach((item) => {
					if (item.orderNum === 2) {
						deviceIdArr.push(item.nodeId);
					}
				});
				_t.$api.post('/asset/assetDevice/move', {
						catalogId: _t.checkedId,
						deviceIds: deviceIdArr
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
	.activeColor {
		color: #4c97f0;
	}

	.activeColorRed {
		color: red;
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
