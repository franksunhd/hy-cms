<template>
	<Box>
		<div v-show="isShow" class="systemSettings-navBar">
			<!--<systemSettingsNavBar/>-->
			<div class="borderRightColorGray">
				<p class="dataDictionary-title">
					<a href="javascript:;" @click="clickNode">设备分组</a>
					<el-button type="text" @click="dialogGrouping = true">新增</el-button>
					<el-dialog class="EquipmentMonitoringGrid" append-to-body title="新增设备分组" :visible.sync="dialogGrouping">
						<div class="padding20" style="padding-top:0;">
							<label style="padding-right:10px ;">父级节点</label>
							<el-select v-model="parentNode" placeholder="请选择">
								<el-option v-for="(item,index) in parentNodeList" :key="index" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<el-table :row-class-name="tableRowClassName" type="index" :data="gridData" @row-contextmenu="openDetails" border align="center" indent style="width: 100%">
							<el-table-column label="第一级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount0" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第二级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount1" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第三级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount2" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第四级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount3" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
								</template>
							</el-table-column>
						</el-table>

						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="dialogGrouping = false">确 定</el-button>
							<el-button @click="dialogGrouping = false">取 消</el-button>
						</div>
					</el-dialog>

					<!--编辑设备分组-->
					<el-button type="text" @click="dialogGroupingBj = true">编辑</el-button>

					<el-dialog class="EquipmentMonitoringBj" append-to-body title="编辑设备分组" :visible.sync="dialogGroupingBj">
						<div class="padding20 " style="padding-top:0;margin-left: 80px;">
							<ul>
								<li><label for="">父级节点:</label>
									<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopoverss" ref="popover">
										<el-tree :data="computerRoomList" highlight-current :expand-on-click-node="false" @node-click="clickRoomNodes" :props="defaultProps" />
										<el-input v-model="addEdits.nodeName" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
									</el-popover>
								</li>
								<li><label for="">节点名称:</label>
									<el-input v-model="nameOfTheNode" class="width200"></el-input>
								</li>
								<li><label for="">顺序:</label>
									<el-input v-model="order" class="width200"></el-input>
								</li>
							</ul>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="dialogGroupingBj = false">确 定</el-button>
							<el-button @click="dialogGroupingBj = false">取 消</el-button>
						</div>
					</el-dialog>
					<!--删除设备分组-->
					<el-button type="text" @click="dialogGroupingSc = true">删除</el-button>

					<el-dialog class="EquipmentMonitoringSc" title="确认提示" :visible.sync="dialogGroupingSc" append-to-body :before-close="handleClose" width="30%">
						<span>请问是否确认删除当前的记录?</span>
						<span slot="footer" class="dialog-footer">
    
                            <el-button type="primary" @click="dialogGroupingSc = false">确 定</el-button>
                            <el-button @click="dialogGroupingSc = false">取 消</el-button>
                        </span>
					</el-dialog>
					<!--{{formItem.menuName}}-->
				</p>
				<el-tree class="dataDictionary-tree" :data="treeData" highlight-current @node-click="getCurrentNode" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="false" />
			</div>
			<a href="javascript:;" @click="clickInset" id="EquipmentMonitoring-navBar-inSet">
				<span class="iconfont">&#xe613;</span>
			</a>
		</div>
		<a href="javascript:;" @click="clickOutset" id="EquipmentMonitoring-navBar-outSet">
			<span class="iconfont">&#xe614;</span>
		</a>

		<div class="systemSettings-routerView" id="EquipmentMonitoring_right">
			<Box>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>监测管理</el-breadcrumb-item>
						<el-breadcrumb-item>设备监测</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="padding20" style="margin-bottom: 50px;">
					<!--表单-->
					<el-form :model="formItem" inline label-width="120px">
						<!--设备分类/类型-->
						<el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + '：'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowTypePopover" ref="popover">
								<el-tree :data="equipmentTypeList" highlight-current :expand-on-click-node="false" @node-click="clickTypeNode" :props="defaultProps" />
								<el-input v-model="formItem.equipmentType" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
							</el-popover>
						</el-form-item>
						<!--设备名称/资产信息-->
						<el-form-item :label="$t('alarmCurrent.equipmentNameInfo') + '：'">
							<el-input v-model="formItem.equipmentName" class="width200" />
						</el-form-item>
						<!--序列号-->
						<el-form-item :label="$t('alarmCurrent.serialNumber') + '：'">
							<el-input v-model="formItem.serialNumber" class="width200" />
						</el-form-item>
						<!--机房-->
						<el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopover" ref="popover">
								<el-tree :data="computerRoomList" highlight-current :expand-on-click-node="false" @node-click="clickRoomNode" :props="defaultProps" />
								<el-input v-model="formItem.computerRoom" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
							</el-popover>
						</el-form-item>
						<!--机架/机柜-->
						<el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
							<el-select v-model="formItem.rackNameId" class="width200" clearable>
								<el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<!--关联业务-->
						<el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
							<el-select v-model="formItem.business" class="width200" clearable>
								<el-option v-for="(item,index) in businessList" :key="index" :label="item.label" :value="item.value" />
							</el-select>

						</el-form-item>
						<!--设备状态-->
						<el-form-item :label="$t('alarmCurrent.equipmentStatus') + '：'">
							<el-select v-model="formItem.equipmentStatus" class="width200" clearable>
								<el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<!--厂商  manufacturer-->
						<el-form-item :label="$t('EquipmentMonitoring.manufacturer')+ '：'">
							<el-select v-model="formItem.manufacturer" class="width200">
								<el-option v-for="(item,index) in manufacturerList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<!--查询按钮-->
						<el-form-item>
							<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
					</el-form>
					<!--按钮-->
					<div style="padding-bottom:10px;">
						<el-button>添加监测</el-button>
						<el-button>转移分组</el-button>
						<el-button>进行监测</el-button>
						<el-button>停止监测</el-button>
						<el-button>解除监测</el-button>
						<el-button>忽略告警</el-button>
						<el-button>取消忽略</el-button>
						<el-button>离线设备</el-button>
					</div>
					<!--表格-->
					<el-table min-width='1080px' :data="tableData" stripe @cell-click="cellClickColumn">
						<el-table-column type="selection" label="$t('EquipmentMonitoring.FutureGenerations')" width="55">
						</el-table-column>
						<!--序号-->
						<el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
							<template slot-scope="scope">
								<span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
							</template>
						</el-table-column>
						<!--监测状态-->
						<el-table-column width="100px" :label="$t('EquipmentMonitoring.workStatus')" prop="workStatus" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="tableDataBase.DeviceMonitorStatus[scope.row.workStatus]" placement="top-start">
									<span>{{tableDataBase.DeviceMonitorStatus[scope.row.workStatus]}}</span>
								</el-tooltip>
								
								<!--<el-tooltip v-if="scope.row.workStatus == 11" effect="dark" content="禁止" placement="top-start">
									<span class="iconfont iconfontError">&#xe609;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.workStatus == 22" effect="dark" content="暂时忽略" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe608;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.workStatus == 33" effect="dark" content="启用监测" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>-->

							</template>
						</el-table-column>
						<!--设备状态-->
						<el-table-column width="80px" prop="status" :label="$t('EquipmentMonitoring.status')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.status == 99" effect="dark" content="紧急" placement="top-start">
									<span class="iconfont iconfontError">&#xe609;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 66" effect="dark" content="警告" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe608;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 23" effect="dark" content="暂时忽略" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 22" effect="dark" content="离线忽略" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 11" effect="dark" content="离线禁止" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 33" effect="dark" content="正常" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--资产信息-->
						<el-table-column :label="$t('EquipmentMonitoring.AssetInformation')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.deviceName+','+scope.row.ip" placement="top-start">
									<span>{{scope.row.deviceName}},{{scope.row.ip}}</span>
								</el-tooltip>

							</template>
						</el-table-column>
						<!--序列号-->
						<el-table-column :label="$t('EquipmentMonitoring.servicetag')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.servicetag" placement="top-start">
									<span>{{scope.row.servicetag}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--厂商型号-->
						<el-table-column :label="$t('EquipmentMonitoring.ManufacturersModel')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.manufacturer+','+scope.row.model" placement="top-start">
									<span>{{scope.row.manufacturer}},{{scope.row.model}}</span>
								</el-tooltip>
								
							</template>
						</el-table-column>
						<!--设备类型-->
						<el-table-column :label="$t('EquipmentMonitoring.type')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="tableDataBase.AssetType[scope.row.type]" placement="top-start">
									<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
								</el-tooltip>
								
							</template>
						</el-table-column>
						<!--更新时间-->
						<el-table-column width="160px" :label="$t('EquipmentMonitoring.lastMonitorTime')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.lastMonitorTime | dateFilter" placement="top-start">
									<span>{{scope.row.lastMonitorTime | dateFilter}}</span>
								</el-tooltip>
								
							</template>
						</el-table-column>
						<!--操作-->
						<el-table-column prop="operation" :label="$t('EquipmentMonitoring.operation')" header-align="left" align="left" />
					</el-table>
					<!--分页-->
					<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize" @handleCurrentChangeSub="handleCurrentChange" />
				</div>
				<!--设备告警详情弹出层-->
				<equipmentAlarmDetails ref="alarmDialog" :dialogVisible="dialogVisible" :AssetType="tableDataBase.AssetType" :AlarmSeverity="tableDataBase.AlarmSeverity" :AlarmHandleStatus="tableDataBase.AlarmHandleStatus" @dialogVisibleStatus="dialogVisibleStatus" />
				<!--标签页-->
				<el-tabs v-if="isShowTabBox_tab" v-model="editableTabsValue" type="card" class="whiteBg" id="EquipmentMonitoring-tabs" tab-position="bottom" closable @tab-click="clickTabs" @tab-remove="removeTab">
					<el-tab-pane :key="index" stretch v-for="(item, index) in editableTabs" :name="item.name" :label="item.title">
						<div class="EquipmentMonitoring-btn">
							<!--收起-->
							<span @click="packUp" class="iconfont cursorPointer">&#xe61d;</span>
							<!--关闭弹出层-->
							<span @click="closeTab" class="iconfont cursorPointer">&#xe615;</span>
						</div>
						<AdministrationTags v-if="isShowTabBox" :page-device-id="item.content" />
					</el-tab-pane>
				</el-tabs>
			</Box>
		</div>

	</Box>
</template>

<script>
	import { dateFilter } from "../../../assets/js/filters";
	import Box from '../../../components/Box';
	import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
	import AdministrationTags from '../../../components/AdministrationTabs';
	export default {
		name: "EquipmentMonitoring",
		components: {
			Box,
			AdministrationTags,
			equipmentAlarmDetails
		},
		data() {
			return {
				/*节点名称*/
				nameOfTheNode: '',
				/*顺序*/
				order: '',
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				// 查询表单
				formItem: {
					/*设备类型*/
					equipmentType: 1,
					equipmentTypeId: null,
					/*设备名称/资产信息*/
					equipmentName: null,
					/*序列号*/
					serialNumber: null,

					computerRoom: null,
					/*机房ID*/
					computerRoomId: null,
					/*机架ID*/
					rackNameId: null,
					/*业务ID*/
					business: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,

				},
				/*父级节点*/
				forItems: {
					computerRooms: '',
				},

				// 设备告警详情提交字段
				addEdit: {
					id: ''
				},
				addEdits: {
					nodeName: '',
					parentId: '',

				},
				// 设备告警详情数据
				equipmentData: {},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],
				// 机房树形下拉框的数据
				computerRoomList: [{
					label: '一级 1',
					children: [{
						label: '二级 1-1',
						children: [{
							label: '三级 1-1-1'
						}]
					}]
				}, {
					label: '一级 2',
					children: [{
						label: '二级 2-1',
						children: [{
							label: '三级 2-1-1'
						}]
					}, {
						label: '二级 2-2',
						children: [{
							label: '三级 2-2-1'
						}]
					}]
				}, {
					label: '一级 3',
					children: [{
						label: '二级 3-1',
						children: [{
							label: '三级 3-1-1'
						}]
					}, {
						label: '二级 3-2',
						children: [{
							label: '三级 3-2-1'
						}]
					}]
				}],
				// 机架下拉框数据
				rackNameList: [],
				// 设备状态下拉框
				equipmentStatusList: [],
				//关联业务下拉框数据
				businessList: [],
				//厂商下拉框数据
				manufacturerList: [],
				// 表格数据
				tableData: [{
					id: '1',
					status: 1,
					equipmentName: '惠普1',
					alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
					lastModifiedTime: '2019-02-10 12:22:11',
					equipmentOwner: '张三'
				}, ],
				// 处理状态

				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowComputerPopover: false, // 控制机房下拉框的显示隐藏
				isShowComputerPopoverss: false, // 控制父级节点下拉框的显示隐藏
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示
				dialogVisible: false, // 设备详情信息弹出层
				dialogGrouping: false, //新增设备分组弹出层
				dialogGroupingBj: false, //编辑设备分组弹出层
				dialogGroupingSc: false, //删除设备分组弹出层
				dialogVisibleOwnerInfo: false, // 业务责任人信息弹出层
				defaultProps: {},
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				editableTabsValue: '', // 当前页签
				editableTabs: [], // 页面集合
				tabIndex: 0, // 页签序号
				isShow: true,
				levelList: null,
				//树形控件模拟数据
				treeData: [{
					label: '一级 1',
					children: [{
						label: '二级 1-1',
						children: [{
							label: '三级 1-1-1'
						}]
					}]
				}, {
					label: '一级 2',
					children: [{
						label: '二级 2-1',
						children: [{
							label: '三级 2-1-1'
						}]
					}, {
						label: '二级 2-2',
						children: [{
							label: '三级 2-2-1'
						}]
					}]
				}, {
					label: '一级 3',
					children: [{
						label: '二级 3-1',
						children: [{
							label: '三级 3-1-1'
						}]
					}, {
						label: '二级 3-2',
						children: [{
							label: '三级 3-2-1'
						}]
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				//新增设备分组
				gridData: [{
					amount0: '12987121',
					amount1: '1.1',
					amount2: '1.1.1',
					amount3: '1.1.1.1'
				}, {
					amount0: '12987122',
					amount1: '2.1',
					amount2: '2.1.1',
					amount3: '2.1.1.1'
				}, {
					amount0: '12987123',
					amount1: '3.1',
					amount2: '3.1.1',
					amount3: '3.1.1.1'
				}, {
					amount0: '12987124',
					amount1: '4.1',
					amount2: '4.1.1',
					amount3: '4.1.1.1'
				}],
				rowIndex: '',
				/*gridData: [{
						label: '1',
						children: [{
							label: '1.1',
							children: [{
								label: '1.1.1',
								children: [{
									label: '1.1.1.1'
								}]
							}]
						}, {
							label: '1.2',
							children: [{
								label: '1.2.1',
								children: [{
									label: '1.2.1.1'
								}]
							}]
						}]
					},
					{
						label: '2',
						children: [{
							label: '2.1',
							children: [{
								label: '2.1.1',
								children: [{
									label: '2.1.1.1'
								}]
							}]
						}]
					}
				],*/
				parentNode: '',
				/*gridDatas: '',*/
				parentNodeList: [{
						value: '1',
						label: '11'
					},
					{
						value: '2',
						label: '22'
					}
				],

			}
		},
		mounted() {
			this.manufacturerDropDown();
			this.getData();
		},
		methods: {
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				this.dialogVisible = val;
			},
			// 点击设备类型下拉框节点
			clickTypeNode(val) {},
			// 点击机房下拉框的节点
			clickRoomNode(val) {},
			// 点击付集结点下拉框的节点
			clickRoomNodes(val) {

				var _t = this;
				_t.addEdits.parentId = val.nodeId;
				_t.addEdits.nodeName = val.label;
				_t.isShowComputerPopoverss = false;
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						//						assetDevice: {
						//							/*设备名称/资产信息*/
						//							deviceName:_t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
						//							/*设备类型*/
						//							type: _t.formItem.equipmentType == null ? null : (_t.formItem.equipmentType == 0 ? null : _t.formItem.equipmentType),
						//							/*序列号*/
						//							servicetag: _t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber.trim() == '' ? null : _t.formItem.serialNumber.trim()),
						//							/*机房ID*/
						//							roomId: _t.formItem.computerRoomId == null ? null : _t.formItem.computerRoomId,
						//							/*机架ID*/
						//							frameId: _t.formItem.rackNameId == null ? null : _t.formItem.rackNameId,
						//							/*设备状态*/
						//							status: _t.formItem.dealWithStatus == null ? null : _t.formItem.dealWithStatus,
						//							/*业务ID*/
						//							business: _t.formItem.business == null ? null : _t.formItem.business,
						//							/*厂商*/
						//							manufacturer:_t.formItem.manufacturer == null ? null : _t.formItem.manufacturer,
						//							/*目录ID*/
						//							catalogId: _t.formItem.catalogId == null ? null : _t.formItem.catalogId,
						//						},
						alarmDevice: true,
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							console.log(res);
							_t.getTableDataValue(res.data);
							/*var Income1 = res.data.list;
							var Income = [];
							for(var i = 0; i < Income1.length; i++) {
								if(Income1[i].type == '1') {
									Income1[i].type = "机架/塔式服务器"
								} else if(Income1[i].type == '2') {
									Income1[i].type = "网络设备"
								} else if(Income1[i].type == '3') {
									Income1[i].type = "小型机"
								} else if(Income1[i].type == '4') {
									Income1[i].type = "刀片/刀箱"
								} else if(Income1[i].type == '5') {
									Income1[i].type = "存储设备"
								}

								Income.push({
									id: Income1[i].id,
									workStatus: Income1[i].workStatus,*/
							/*监测状态*/
							/*status: Income1[i].status,*/
							/*设备状态*/
							/*AssetInformation: Income1[i].deviceName + ',' + Income1[i].ip,*/
							/*资产信息*/
							/*servicetag: Income1[i].servicetag,*/
							/*序列号*/
							/*ManufacturersModel: Income1[i].manufacturer + ',' + Income1[i].model,*/
							/*厂商型号*/
							/*type: Income1[i].type,*/
							/*设备类型*/
							/*lastMonitorTime: dateFilter(Income1[i].lastMonitorTime),*/
							/*更新时间*/
							/*operation: Income1[i].operation,*/
							/*操作*/

							/*})*/
							/*}*/

							/*_t.tableData = Income;
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.count;*/
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							/*_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;*/
							break;
					}
				});
			},
			// 导出excel数据
			downloadData() {},
			// 改变当前页码
			handleCurrentChange(val) {
				var _t = this;
				_t.options.currentPage = val;
				_t.getData();
			},
			// 改变每页显示条数
			handleSizeChangeSub(val) {
				var _t = this;
				_t.options.pageSize = val;
				_t.getData();
			},
			// 单元格点击
			cellClickColumn(row, column) {
				/*
				 * 点击表格的单元格
				 *    row 当前行绑定的 数据
				 *    column 当前 单元格的 属性
				 */
				var _t = this;
				// 点击设备状态列
				/*if(column.label == _t.$t('EquipmentMonitoring.status')) {
					_t.addEdit.id = row.id;
					_t.dialogVisible = true;*/
				// 父组件调用 子组件 获取数据的方法
				/*_t.$refs.alarmDialog.getData(_t.addEdit.id);*/
				/*}*/
				// 点击资产信息列
				if((column.label == _t.$t('EquipmentMonitoring.AssetInformation')) || (column.label == _t.$t('EquipmentMonitoring.status'))) {
					_t.addTab(row.AssetInformation, row.id);
				}
			},
			// 删除页签
			removeTab(targetName) {
				var _t = this;
				// 获取页面集合
				var tabs = _t.editableTabs;
				// 获取当前选中的页签
				var activeName = _t.editableTabsValue;
				if(activeName === targetName) {
					tabs.forEach((tab, index) => {
						if(tab.name === targetName) {
							var nextTab = tabs[index + 1] || tabs[index - 1];
							if(nextTab) {
								activeName = nextTab.name;
							} else {
								_t.isShowTabBox_tab = false;
							}
						}
					});
				}
				// 删除之后的页签
				_t.editableTabsValue = activeName;
				_t.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			// 添加页签
			addTab(title, id) {
				var _t = this;
				var newTabName = ++_t.tabIndex + '';
				_t.editableTabs.push({
					title: title,
					name: newTabName,
					content: id
				});
				_t.editableTabsValue = newTabName;
				_t.isShowTabBox = true;
				_t.isShowTabBox_tab = true;
				if(_t.editableTabs.length > 1) {
					document.getElementById('EquipmentMonitoring-tabs').style.top = '118px';
				}
			},
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('EquipmentMonitoring-tabs').style.top = 'initial';
			},
			// 关闭标签页
			closeTab() {
				var _t = this;
				_t.isShowTabBox_tab = false;
				document.getElementById('EquipmentMonitoring-tabs').style.top = 'initial';
				_t.editableTabsValue = '';
				_t.editableTabs = [];
				_t.tabIndex = 0;
			},
			// 点击标签页
			clickTabs() {
				var _t = this;
				_t.isShowTabBox = true;
				document.getElementById('EquipmentMonitoring-tabs').style.top = '118px';
			},
			// 收缩
			clickInset() {
				this.isShow = false;
				document.getElementById('EquipmentMonitoring-navBar-outSet').style.display = 'inline-block';
				document.getElementById('EquipmentMonitoring_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isShow = true;
				document.getElementById('EquipmentMonitoring-navBar-outSet').style.display = 'none';
				document.getElementById('EquipmentMonitoring_right').style.left = '174px';
			},
			// 获取选中的节点
			getCurrentNode(data) {
				var _t = this;
				_t.formItem.nodeId = data.nodeId;
				_t.addEdit.level = data.level;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 0;
				_t.getData();
			},
			//厂商下拉框数据获取
			manufacturerDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
					var Income1 = res.data;
					console.log(Income1)
				});
			},
			//设备类型下拉框数据获取
			DeviceTypeDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
				});
			},
			//设备状态下拉框数据获取
			EquipmentStateDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
				});
			},
			//机房下拉框数据获取
			//机架/机柜下拉框数据获取

			//删除设备分组确认提示
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			/*获取行index*/
			tableRowClassName({
				row,
				rowIndex
			}) {
				/*console.log(rowIndex)*/
				this.rowIndex = rowIndex;
			},
			/*添加行事件*/
			openDetails(row, column) {
				var newValue = {
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				};
				//添加新的行数

				this.gridData.push(newValue);
				console.log(row);
			},
			// 查询表格中状态对应的数据值
			getTableDataValue(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity", "DeviceMonitorStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							// 获取表格对应的状态值
							_t.tableDataBase = res.data;
							console.log(res.data);
							_t.tableData = resData.list;
							console.log(_t.tableData);
							_t.options.currentPage = resData.page.currentPage;
							_t.options.total = resData.page.totalResultSize;
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
							break;
					}
				});
			},
			// 查询设备类型
      getBaseData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('system/basedata/all',{
          jsonString: JSON.stringify({
            systemBasedata:{
              dictionaryType:'AssetType',
              languageMark: localStorage.getItem('hy-language')
            }
          })
        },function (res) {
        	console.log(res)
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              var equipmentTypeList = res.data.treeNode.children[0].children;
              equipmentTypeList.unshift({nodeName:'全部',level:1,children:null,nodeCode:null,parentId:'0'})
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

		},

		created() {}
	}
</script>

<style scoped>
	.systemSettings-routerView {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}
	
	.systemSettings-navBar {
		width: 174px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
	}
	
	#EquipmentMonitoring-navBar-inSet,
	#EquipmentMonitoring-navBar-outSet {
		height: 40px;
		width: 20px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}
	
	#EquipmentMonitoring-navBar-inSet {
		left: 210px;
		border-radius: 15px 0 0 15px;
	}
	
	#EquipmentMonitoring-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}
	
	.borderRightColorGray {
		overflow: hidden;
	}
	
	.dataDictionary-title {
		overflow: hidden;
	}
	
	.dataDictionary-title a {
		line-height: 40px;
		padding-left: 20px;
		font-weight: 600;
	}
	
	.EquipmentMonitoringBj ul li {
		padding-bottom: 20px;
	}
	
	.EquipmentMonitoringBj ul li label {
		display: inline-block;
		width: 60px;
	}
</style>
<style>
	#systemSettings-navBar-inSet,
	#systemSettings-navBar-outSet {
		background-color: #3f81d0;
		color: #fff;
	}
	
	.EquipmentMonitoringGrid .el-dialog {
		width: 612px;
		height: 425px;
	}
	
	.EquipmentMonitoringBj .el-dialog {
		width: 501px;
		height: 325px;
	}
	
	.EquipmentMonitoringSc .el-dialog {
		width: 200px;
		height: 180px;
	}
	
	.alarmCurrentBox .el-form--inline .el-form-item {
		margin: 0;
	}
	
	.EquipmentMonitoring-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 100;
	}
	
	.closeCheckBox {
		margin-left: 30px;
	}
	
	.closeCheckBox .el-checkbox__label {
		font-size: 12px;
	}
	
	#EquipmentMonitoring-tabs {
		position: fixed;
		bottom: 0;
		right: 20px;
		left: 80px;
		top: 118px;
		z-index: 1100;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom {
		margin-top: 0;
		position: absolute;
		bottom: 0;
		left: -24px;
		right: -20px;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item {
		font-size: 12px;
		position: relative;
	}
	
	#EquipmentMonitoring-tabs>.el-tabs__content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 40px;
		top: 0;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:before {
		content: '';
		width: 10px;
		height: 10px;
		display: inline-block;
		position: absolute;
		top: 0;
		left: -10px;
		border-radius: 0 10px 0 0;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item:after {
		content: '';
		position: absolute;
		top: 10px;
		right: 0;
		height: 20px;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:after {
		content: '';
		width: 10px;
		height: 10px;
		display: inline-block;
		position: absolute;
		top: 0;
		right: -10px;
		border-radius: 10px 0 0 0;
	}
	
	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__nav-scroll {
		padding: 0 20px;
	}
</style>