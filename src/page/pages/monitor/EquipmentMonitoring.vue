<template>
	<Box>
		<div v-show="isShow" class="systemSettings-navBar">
			<!--<systemSettingsNavBar/>-->
			<div class="borderRightColorGray">
				<p class="dataDictionary-title">
					<a href="javascript:;" @click="clickNode">设备分组</a>
					<el-button type="text" @click="appendDevice">新增</el-button>
					<el-dialog class="EquipmentMonitoringGrid" append-to-body title="新增设备分组" :visible.sync="dialogGrouping">
						<div class="padding20" style="padding-top:0;">
							<label style="padding-right:10px ;">父级节点</label>
							<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopoversss" ref="popover">
								<el-tree :data="treeData" highlight-current :expand-on-click-node="false" @node-click="clickRoomNodess" :props="defaultPropsssa" />
								<el-input v-model="addEditss.nodeName" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
							</el-popover>
							<!--<el-select v-model="parentNode" placeholder="请选择">
								<el-option v-for="(item,index) in parentNodeList" :key="index" :label="item.label" :value="item.value">
								</el-option>
							</el-select>-->
						</div>
						<el-table :data="catalogList" @row-contextmenu="openDetails" border align="center" indent style="width: 100%">
							<el-table-column label="序号" align="center" width="50">
								<template slot-scope="scope">
									{{scope.$index+1}}
								</template>
							</el-table-column>
							<el-table-column label="第一级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount0" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第二级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount1" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第三级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount2" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="第四级" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount3" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
						</el-table>
						<el-dialog class="massdia" width="20%" :visible.sync="dialogGroupingNei" append-to-body>
							<div style="border-bottom:1px solid #ccc; line-height: 40px;">
								<span>下方插入</span>
								<el-input v-model="indexs" style="width:50px" /><span> 行 </span>
								<el-button @click="getClick"> 确认</el-button>
							</div>
							<div>
								<el-button @click="delClick" class="cursorPointer">删除本行</el-button>
							</div>
						</el-dialog>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="getAddDevice">确 定</el-button>
							<el-button @click="dialogGrouping = false">取 消</el-button>
						</div>
					</el-dialog>
					<!--编辑设备分组-->
					<!--<el-button type="text" @click="EditDevice">编辑</el-button>-->
					<el-dialog class="EquipmentMonitoringBj" append-to-body title="编辑设备分组" :visible.sync="dialogGroupingBj">
						<el-form :model="formItem" inline label-width="150px" :rules="rules" ref="roleName">
							<el-form-item label="父级节点:">
								<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopoverss" ref="popover">
									<el-tree :data="treeData" highlight-current :expand-on-click-node="false" @node-click="clickRoomNodes" :props="defaultPropsss" />
									<el-input v-model="addEdits.nodeName" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
								</el-popover>
							</el-form-item>
							<el-form-item class="star" label="节点名称:" prop="catalogName">
								<el-input v-model="formItem.catalogName" class="width200" clearable></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="getEditDevice('roleName')">确 定</el-button>
							<el-button @click="dialogGroupingBj = false">取 消</el-button>
						</div>
					</el-dialog>
					<!--删除设备分组-->
					<!--<el-button type="text" @click="remove">删除</el-button>-->

					<el-dialog class="EquipmentMonitoringSc" title="确认提示" :visible.sync="dialogGroupingSc" append-to-body :before-close="handleClose" width="30%">
						<span>请问是否确认删除当前的记录?</span>
						<span slot="footer" class="dialog-footer">

                            <el-button type="primary" @click="getRemove">确 定</el-button>
                            <el-button @click="dialogGroupingSc = false">取 消</el-button>
                        </span>
					</el-dialog>
					<!--{{formItem.menuName}}-->
				</p>
				<el-tree class="dataDictionary-tree" :data="treeData" highlight-current node-key="idd" @node-click="getCurrentNode" @node-contextmenu="rightClick" :props="defaultPropssss" :expand-on-click-node="true" :default-expand-all="false">

					<span class="custom-tree-node" slot-scope="{ node, data}">
                    <span>{{ node.label }}</span>
					<span>
						<!--<context-menu class="right-menu"
                            :target="contextMenuTarget"
                            :show="contextMenuVisible"
                            @update:show="(show) => contextMenuVisible = show">
                            <a href="javascript:;" @click="appendDevice(data)">增加</a>
                            <a href="javascript:;" @click="EditDevice(node, data)">编辑</a>
                            <a href="javascript:;" @click="remove(node, data)">删除</a>-->
                        <!--<el-button type="text" size="mini" @click="() => appendDevice(data)">
                        <i class="el-icon-edit" title="增加"></i>
                        </el-button>
                        <el-button type="text" size="mini" @click="() => EditDevice(node, data)">
                        <i class="el-icon-share" title="编辑"></i>
                        </el-button>
                        <el-button type="text" size="mini" @click="() => remove(node, data)">
                        <i class="el-icon-delete" title="删除"></i>
                        </el-button>-->
                        <!--</context-menu>-->
                    </span>
                    
					</span>
				</el-tree>
				<div v-show="menuVisible">
                    <ul id="menu" class="menu">
                        <li class="menu__item cursorPointer" @click="appendDevice"><i class="el-icon-share"> 增加</i></li>
                        <li class="menu__item cursorPointer" @click="EditDevice"><i class="el-icon-edit"> 编辑</i></li>
                        <li class="menu__item cursorPointer" @click="remove" v-if="showVisible"><i class="el-icon-delete"> 删除</i></li>
                    </ul>
                </div>
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
							<el-select v-model="formItem.computerRoomId" @change="changeRoom(formItem.computerRoomId)" class="width200">
								<el-option v-for="(item,index) in computerRoomList" :key="index" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>

						<!--机架/机柜-->
						<el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
							<el-select v-model="formItem.rackNameId" class="width200" clearable>
								<el-option v-for="(item,index) in rackNameList" :key="index" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
						<!--关联业务-->
						<el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowBusinessPopover" ref="popover">
								<el-tree :data="businessTreeData" highlight-current :expand-on-click-node="false" @node-click="clickBusinessNode" :props="defaultPropsBusiness" />
								<el-input v-model="formItem.businessName" readonly style="width: 200px;" suffix-icon="el-icon-arrow-down" slot="reference" />
							</el-popover>
						</el-form-item>
						<!--设备状态-->
						<el-form-item :label="$t('alarmCurrent.equipmentStatus') + '：'">
							<el-select v-model="formItem.equipmentStatus" class="width200" clearable>
								<el-option v-for="(item,index) in formBaseData.AlarmSeverity" :key="index" :label="item.name" :value="item.type" />
							</el-select>
						</el-form-item>
						<!--厂商  manufacturer-->
						<el-form-item :label="$t('EquipmentMonitoring.manufacturer')+ '：'">
							<el-select v-model="formItem.manufacturer" class="width200">
								<el-option v-for="(item,index) in manufacturerList" :key="index" :label="item.name" :value="item.value" />
							</el-select>
						</el-form-item>
						<!--查询按钮-->
						<el-form-item>
							<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
						<!--重置按钮-->
						<el-form-item>
							<el-button class="queryBtn" type="reset" @click="formReset">重置</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
					</el-form>
					<!--按钮-->
					<div style="padding-bottom:10px;">
						<el-button>转移分组</el-button>
						<el-button>添加监测</el-button>
						<el-button>启动监测</el-button>
						<el-button>暂停监测</el-button>
						<el-button>删除监测</el-button>
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
								<el-tooltip v-if="scope.row.status == 99" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
									<span class="iconfont iconfontError">&#xe64a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 66" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe649;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 22" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64f;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 11" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64e;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 33" effect="dark" :content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
									<span class="iconfont iconfontSuccess">&#xe648;</span>
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
						<el-table-column prop="operation" :label="$t('EquipmentMonitoring.operation')" header-align="left" align="left">
							<template slot-scope="scope">
								<span class="iconfont iconfontError cursorPointer" @click="monitorThreshold(scope.row)">&#xe64a;</span>
							</template>
						</el-table-column>
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
							<span @click="packUp" class="iconfont cursorPointer">&#xe64a;</span>
							<!--关闭弹出层-->
							<span @click="closeTab" class="iconfont cursorPointer">&#xe64e;</span>
						</div>
						<AdministrationTags v-if="isShowTabBox" :page-device-id="item.content" />
					</el-tab-pane>
				</el-tabs>
			</Box>
		</div>

	</Box>
</template>

<script>
	let idd = 1000;
	import { isNotNull } from "../../../assets/js/validator";
	import { getObjectById } from "../../../assets/js/recursive";
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
				/*点击删除按钮得到当前的ID*/
				deleteId: '',
				/*插入行数*/
				indexs: '',
				/*右键下标*/
				Index: '',
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
				// 表单数据字典
				formBaseData: {
					AlarmHandleStatus: [],
					AlarmSeverity: [],
					AssetType: [],
					DeviceMonitorStatus: []
				},
				// 查询表单
				formItem: {
					/*设备类型*/
					equipmentType: '-全部-',
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
					businessId: null,
					businessName: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*编辑设备分组父级节点名称*/
					prentcatalogName: '无',
				},

				/*父级节点*/
				forItems: {
					computerRooms: '',
				},
				// 设备告警详情提交字段
				addEdit: {
					id: ''
				},
				rules: {
					catalogName: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
				},
				addEdits: {
					nodeName: '',
					nodeId: '',
					parentId: '',
				},
				addEditss: {
					nodeName: '',
					nodeId: '',
					parentId: '',

				},
				// 设备告警详情数据
				equipmentData: {},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],

				// 机房树形下拉框的数据
				computerRoomList: [{
					name: '-所有纳管的设备-',
					id: null
				}],
				/*编辑分组 父级节点*/
				computerRoomListFj: [],
				// 机架下拉框数据
				rackNameList: [],
				framesData: [],
				// 设备状态下拉框
				equipmentStatusList: [],
				// 关联业务树形下拉框集合
				businessTreeData: [],
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
				showVisible:false,//控制tree弹出层删除按钮隐藏
				menuVisible:false,//控制tree右键弹出框
				dialogGroupingNei: false, //控制增加设备分组内层弹出层
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowBusinessPopover: false, // 关联业务树形下拉框显示隐藏
				isShowComputerPopoverss: false, // 控制父级节点下拉框的显示隐藏
				isShowComputerPopoversss: false, //控制新增设备分组父级节点下拉框的显示隐藏
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示
				dialogVisible: false, // 设备详情信息弹出层
				dialogGrouping: false, //新增设备分组弹出层
				dialogGroupingBj: false, //编辑设备分组弹出层
				dialogGroupingSc: false, //删除设备分组弹出层
				dialogVisibleOwnerInfo: false, // 业务责任人信息弹出层
				/*defaultProps: {},*/
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
				/*设备类型tree*/
				defaultProps: {
					children: 'children',
					label: 'nodeName'
				},
				/*机房tree*/
				defaultPropss: {
					children: 'children',
					label: 'nodeName'
				},
				/*编辑设备分组父级节点tree*/
				defaultPropsss: {
					children: 'children',
					label: 'nodeName'
				},
				/*左侧数tree*/
				defaultPropssss: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*新增设备分组父级节点树形下拉框*/
				defaultPropsssa: {
					parentId: 'parentNodeId', // 父级唯一标识
					value: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*关联业务*/
				defaultPropsBusiness: {
					label: 'nodeName',
					children: 'children'
				},

				//新增设备分组
				catalogList: [{
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}],
				selectlistRow: [],
				/*catalogList: [{
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
			this.getDataTree();
			this.getManufacturer();
			this.getData();
			this.getFormData();
			this.getBaseData();
			this.getBusinessTreeData();
			this.getBaseDataList();

		},
		methods: {
			// 修改阈值
			monitorThreshold(val) {
				var _t = this;
				/*let newpage = _t.$router.resolve({
                name: 'monitorThresholdValue',
                query:{
                objectType:1,
                deviceId:val.id,
                    }
                })
				localStorage.setItem('hy-deviceId', val.id);
				window.open(newpage.href, '_blank')*/
				_t.$router.push({
					name: 'monitorThresholdValue',
					params: {
						deviceId: val.id,
					}
				});
				localStorage.setItem('hy-deviceId', val.id);

				/*window.open(newpage.href, '_blank')*/
			},
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				this.dialogVisible = val;
			},
			// 点击设备类型下拉框节点
			clickTypeNode(val) {
				var _t = this;
				_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;
				_t.isShowTypePopover = false;
			},
			// 点击关联业务下拉框节点
			clickBusinessNode(val) {
				var _t = this;
				_t.formItem.businessId = val.nodeId;
				_t.formItem.businessName = val.nodeName;
				_t.isShowBusinessPopover = false;
			},
			// 改变表单的机房时加载机柜的数据
			changeRoom(val) {
				var _t = this;
				if(_t.formItem.computerRoomId !== null) {
					_t.framesData.forEach(function(item) {
						if(item.roomId == val) {
							_t.rackNameList = item.frame;
						}
					});
				} else {
					_t.rackNameList = [];
				}
				_t.formItem.rackNameId = '';
			},
			//点击删除按钮
			remove() {
				var _t = this;
				_t.dialogGroupingSc = true;
			},
			//确定删除按钮
			getRemove() {
				var _t = this;
				var catalogId = _t.deleteId;
				_t.$api.delete('/asset/assetCatalog/' + catalogId, {

				}, function(res) {
					switch(res.status) {
						case 200:
							_t.dialogGroupingSc = false;
							_t.getDataTree();
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
			//点击新增按钮弹出框
			appendDevice() {
				var _t = this	
				_t.dialogGrouping = true;
			},
			// 新增设备分组点击父级结点下拉框的节点
			clickRoomNodess(val) {
				var _t = this;
				_t.addEditss.nodeId = val.nodeId;
				_t.addEditss.nodeName = val.nodeName;
				_t.isShowComputerPopoversss = false;
			},
			//新增设备分组弹出框点击确定按钮接口
			getAddDevice() {
				var _t = this;
				var all = [];
				var two = [];
				var three = [];
				var four = [];
				// console.log(_t.catalogList);
				// console.log(_t.catalogList.length);
				for(var i = 0; i < _t.catalogList.length; i++) {
					var ones = _t.catalogList[i].amount0.trim();
					// console.log(ones != '');
					// console.log(ones.length > 0);
					//第一级
					if(ones != '') {
						var obj = new Object();
						obj.name = _t.catalogList[i].amount0;
						obj.children = [];
						all.push(obj);
						// console.log(all.length > 0);
						if(all.length > 0) {
							var one = new Object();
							one.children = [];
							all[i].children.push(one)
						}

						//第二级
						if(_t.catalogList[i].amount1 != '') {
							var obj = new Object();
							obj.name = _t.catalogList[i].amount1;
							two.push(obj);
							if(two.length > 0) {
								var twoes = new Object();
								twoes.children = [];
								one.children.push(twoes)
							}
							//第三级
							if(_t.catalogList[i].amount2 != '') {
								var obj = new Object();
								obj.name = _t.catalogList[i].amount2;
								three.push(obj);
								//第四级
								if(_t.catalogList[i].amount3 != '') {
									var obj = new Object();
									obj.name = _t.catalogList[i].amount3;
									four.push(obj);
									//第四级else
								} else {

								}
								//第三级else
							} else {

							}
							//第二级else
						} else {

						}
						/*var obj=new Object();
						obj.name = _t.catalogList[i].amount0;
						obj.children = [];
						tree.push(obj);*/
						//第一级else
					} else {
						// console.log('one');
						if(all.length > 0) {
							if(_t.catalogList[i].amount1 != '') {
								var obj = new Object();
								obj.name = _t.catalogList[i].amount1;
								obj.children = [];
								two.push(obj)
							}
							if(_t.catalogList[i].amount2 != '') {
								var obj = new Object();
								obj.name = _t.catalogList[i].amount2;
								obj.children = [];
								three.push(obj)
							}
							if(_t.catalogList[i].amount3 != '') {
								var obj = new Object();
								obj.name = _t.catalogList[i].amount3;
								obj.children = [];
								four.push(obj)
							}
						}
					}
					/*for(var k=0;k<_t.catalogList.length;k++){
				if(_t.catalogList[k].amount1 !="" && _t.catalogList[k].amount0 !=""){
					var obj=new Object();
					obj.name = _t.catalogList[k].amount1;
					obj.children = [];
					tree[i].children.push(obj);
				}
				for(var p=0;p<_t.catalogList.length;p++){
				if(_t.catalogList[p].amount2 !=""){
					var obj=new Object();
					obj.name = _t.catalogList[p].amount2;
					obj.children = [];
					tree[i].children[k].children.push(obj);
				}
				for(var j=0;j<_t.catalogList.length;j++){
				if(_t.catalogList[j].amount3 !=""){
					var obj=new Object();
					obj.name = _t.catalogList[j].amount3;
					obj.children = [];
					tree[i].children[k].children[p].children.push(obj);
				}
			};
			};
			};*/

				};
				// console.log('1', all);
				// console.log('2', two);
				// console.log('3', three);
				// console.log('4', four);
				//				_t.dialogGrouping = false;
				//				_t.$api.post('/asset/assetCatalog/', {
				//					parentId: _t.addEditss.nodeId,
				//					catalogList: [
				//					]
				//				}, function(res) {
				//					// console.log(res);
				//				})
			},
			// 编辑设备分组点击父级结点下拉框的节点
			clickRoomNodes(val) {
				var _t = this;
				_t.addEdits.parentId = val.nodeId;
				_t.addEdits.nodeName = val.nodeName;
				_t.isShowComputerPopoverss = false;
			},
			EditDevice() {
				var _t = this;
				_t.dialogGroupingBj = true;
				_t.getBjtree();
			},
			/*点击设备编辑按钮查询接口*/
			getBjtree() {
				var _t = this;
				var id = _t.formItem.catalogId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {

				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.formItem.catalogName = res.data.catalogName;
							_t.formItem.catalogId = res.data.id;
							_t.addEdits.parentId = res.data.parentId;
							if(_t.addEdits.parentId != null) {
								this.getBjtreeF();
							} else if(_t.addEdits.parentId == null) {
								_t.addEdits.nodeName = "-无父级节点-"
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
			/*根据parentId查询父级节点*/
			getBjtreeF() {
				var _t = this;
				var id = _t.addEdits.parentId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {

				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.addEdits.nodeName = res.data.catalogName;
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
			/*编辑设备分组点击保存按钮接口*/
			getEditDevice(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if(valid) {
						var id = _t.addEdits.parentId;
						_t.$store.commit('setLoading', true);
						_t.$api.put('/asset/assetCatalog/', {
							catalog: {
								id: _t.formItem.catalogId,
								catalogName: _t.formItem.catalogName
							}
						}, function(res) {
							_t.$store.commit('setLoading', false);
							switch(res.status) {
								case 200:
									_t.dialogGroupingBj = false;
									_t.getDataTree();
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
					}
				});
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							/*设备名称/资产信息*/
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
							/*设备类型*/
							type: _t.formItem.equipmentTypeId == null ? null : _t.formItem.equipmentTypeId,
							/*序列号*/
							servicetag: _t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber.trim() == '' ? null : _t.formItem.serialNumber.trim()),
							/*机房ID*/
							roomId: _t.formItem.computerRoomId == null ? null : (_t.formItem.computerRoomId.trim() == '' ? null : _t.formItem.computerRoomId.trim()),
							/*机架Id*/
							frameId: _t.formItem.rackNameId == null ? null : (_t.formItem.rackNameId.trim() == '' ? null : _t.formItem.rackNameId.trim()),
							/*设备状态*/
							status: _t.formItem.equipmentStatus == null ? null : (_t.formItem.equipmentStatus.trim() == '' ? null : _t.formItem.equipmentStatus.trim()),
							/*业务ID*/
							business: _t.formItem.businessId == null ? null : (_t.formItem.businessId.trim() == '' ? null : _t.formItem.businessId.trim()),
							/*厂商*/
							manufacturer: _t.formItem.manufacturer == null ? null : _t.formItem.manufacturer,
							/*目录ID*/
							catalogId: _t.formItem.catalogId == null ? null : _t.formItem.catalogId,
						},
						alarmDevice: true,
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.getTableDataValue(res.data);
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
					_t.addTab(row.deviceName, row.id);
				}
				//点击操作列

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
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('/asset/assetCatalog/all', {}, function(res) {
					switch(res.status) {
						case 200:
							_t.treeData = res.data.children;
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
			// 获取树形控件选中的节点
			getCurrentNode(data) {
				var _t = this;
				_t.formItem.catalogId = data.nodeId;
				_t.formItem.catalogName = data.nodeName;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 0;
				_t.getData();
			},
			//删除设备分组确认提示
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			//内层框确认行数
			getClick(val) {
				var _t = this;
				_t.dialogGroupingNei = false;
				//在当前行的后面插入行
				for(var i = 0; i < _t.indexs; i++) {
					var newValue = {
						amount0: '',
						amount1: '',
						amount2: '',
						amount3: ''
					};
					_t.catalogList.splice((_t.Index + 1), 0, newValue);
				}
			},
			//根据下标删除当前行
			delClick() {
				var _t = this;
				_t.catalogList.splice(_t.Index, 1);
			},
			/*添加右键行事件*/
			openDetails(row, column, event) {
				var _t = this;
				event.preventDefault();
				_t.dialogGroupingNei = true;
				//获取右键行的下标
				var index = _t.catalogList.indexOf(row);
				_t.Index = index;
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
							_t.tableData = resData.list;
							_t.options.currentPage = resData.currentPage;
							_t.options.total = resData.count;
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
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							var equipmentTypeList = res.data.treeNode.children[0].children;
							equipmentTypeList.unshift({
								nodeName: '-全部-',
								level: 1,
								children: null,
								nodeCode: null,
								parentId: '0'
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
			// 查找关联业务树形列表
			getBusinessTreeData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.businessTreeData = res.data.children;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.businessTreeData = [];
							break;
					}
				});
			},
			// 表单部分机房机架下拉框数据
			getFormData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetEngineroom/maplist', {}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							var computerRoomList = res.data.rooms;
							_t.framesData = res.data.frames;
							computerRoomList.unshift({
								name: '-所有纳管的设备-',
								id: null
							});
							_t.computerRoomList = computerRoomList;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.computerRoomList = [{
								name: '-所有纳管的设备-',
								id: null
							}];
							break;
					}
				});
			},
			// 查询字典集合
			getBaseDataList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['AlarmHandleStatus', 'AssetType', 'AlarmSeverity', 'DeviceMonitorStatus']
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.formBaseData.AlarmSeverity = res.data.AlarmSeverity;
							_t.formBaseData.AlarmHandleStatus = res.data.AlarmHandleStatus;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.formBaseData.AlarmSeverity = [];
							_t.formBaseData.AlarmHandleStatus = [];
							break;
					}
				});
			},
			//厂商下拉框数据获取
			getManufacturer() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							var Income1 = [];
							for(var key in res.data) {
								Income1.push({
									'name': res.data[key],
									'value': key,
								})
							}
							_t.manufacturerList = Income1;
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
			//表单重置按钮
			formReset() {
				var _t = this;
				_t.formItem = {
					/*设备类型*/
					equipmentType: '-全部-',
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
					businessId: null,
					businessName: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,

				};
			},

			rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
				this.deleteId = object.nodeId;
				this.addEditss.nodeId = object.nodeId;
				this.addEditss.nodeName = object.nodeName;
				this.formItem.catalogId = object.nodeId;
				this.formItem.catalogName = object.nodeName;
//				console.log(object);
				if(object.children.length==0){
					this.showVisible=true;
				}else{
					this.showVisible=false;
				}
        this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
        var menu = document.querySelector('#menu')
        menu.style.left = MouseEvent.clientX - 80 + 'px'
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        menu.style.top = MouseEvent.clientY - 70 + 'px'
        // // console.log('右键被点击的event:', MouseEvent)
        // console.log('右键被点击的object:', object)
        // console.log('右键被点击的value:', Node)
        // console.log('右键被点击的element:', element)
        // console.log('鼠标点击了树形结构图')
      },
     foo() { // 取消鼠标监听事件 菜单栏
        this.menuVisible = false
        document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
     },

		},

		created() {}
	}
</script>

<style scoped>
    .menu__item {
    display: block;
    color:#252A2F;
    font-size: 12px;
    line-height: 25px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    /*margin-top: 5px;
    margin-bottom: 5px;*/
  }
  .menu__item:last-child{
  	border-bottom: none;
  }
    .menu {
    overflow: hidden;
    width: 60px;
    position: absolute;
    border-radius: 6px;
    border: 1px solid #999999;
    background-color: #f4f4f4;
  }
   li:hover {
    background-color: #1790ff;
    color: white;
  }
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
		height: 100%;
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
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		color: #4386c6;
	}

	.el-ic {
		display: none;
		i,
		span {
			padding: 0 14px;
			font-size: 18px;
			font-weight: 600;
		}
		.svg-icon {
			color: #4386c6;
		}
	}

	.el-tree-node__content {
		height: 38px;
	}

	.el-tree-node__expand-icon {
		color: #428bca;
		/*padding: 10px 10px 0px 10px !important;*/
	}

	.el-tree-node__content:hover .el-ic {
		color: #428bca !important;
		display: inline-block;
	}

	.el-tree-node__content:hover {
		font-weight: bold;
	}

	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content :hover {
		.el-tree-node__expand-icon.is-leaf {
			color: transparent;
			cursor: default;
		}
		/*background-color: #3998d9;*/
		.custom-tree-node {
			font-weight: bold;
		}
		.el-tree-node__expand-icon {
			font-weight: bold;
		}
	}

	.el-dialog__body {
		.upload-container .image-preview .image-preview-wrapper img {
			height: 100px;
		}
		.el-dialog .el-collapse-item__wrap {
			padding-top: 0px;
		}
		.spatial_img {
			.el-collapse-item__wrap {
				margin-bottom: 0;
				padding-top: 0px;
			}
		}
		.upload-container .image-preview .image-preview-wrapper {
			width: 120px;
		}
		.upload-container .image-preview .image-preview-action {
			line-height: 100px;
			height: 100px;
		}
	}

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

	.massdia .el-dialog {
		width: 50px;
		height: 200px;
	}


	.right-menu {
      border: 1px solid #eee;
      box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
      border-radius: 1px;
      display: block;
      font-family: Microsoft Yahei,Avenir,Helvetica,Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      position: fixed;
      background: #fff;
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 3px;
      z-index: 999;
      display: none;
      a {
        padding: 2px 15px;

        // width: 120px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        display: block;
        color: #1a1a1a;

      }
      user agent stylesheet
      a:-webkit-any-link {
        color: -webkit-link;
        cursor: pointer;
        text-decoration: underline;
      }
      a:hover {
        // background: #42b983;
        background: $color-primary;
        color: #fff;
      }
  }
</style>
