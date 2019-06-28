<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmCurrent')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="borderBottomFormItem">
			<!--表单-->
			<el-form :model="formItem" inline label-width="120px">
				<el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + '：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowTypePopover"
						ref="popover">
						<el-tree
							:data="equipmentTypeList"
							highlight-current
							:expand-on-click-node="false"
							@node-click="clickTypeNode"
							:props="defaultProps"/>
						<el-input
							v-model="formItem.equipmentType"
							style="width: 200px;"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.equipmentName') + '：'">
					<el-input v-model="formItem.equipmentName" class="width200" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.equipmentIp') + '：'">
					<el-input v-model="formItem.equipmentIp" class="width200" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">
					<el-select
						v-model="formItem.computerRoomId"
						clearable
						@change="changeRoom(formItem.computerRoomId)"
						class="width200 selectGroupList">
						<el-option-group
							v-for="(data,i) in computerRoomList"
							:label="data.name"
							:key="i">
							<el-option v-for="(item,index) in data.centerRooms" :key="index" :label="item.name"
												 :value="item.id"/>
						</el-option-group>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
					<el-select v-model="formItem.rackNameId" class="width200" clearable>
						<el-option
							v-for="(item,index) in rackNameList"
							:key="index"
							:label="item.name"
							:value="item.id"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowBusinessPopover"
						ref="popover">
						<el-tree
							:data="businessTreeData"
							highlight-current
							:expand-on-click-node="false"
							@node-click="clickBusinessNode"
							:props="defaultPropsBusiness"/>
						<el-input
							v-model="formItem.businessName"
							readonly
							style="width: 200px;"
							suffix-icon="el-icon-arrow-down"
							slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.alarmLevelText') + '：'">
					<el-select v-model="formItem.equipmentStatus" class="width200" clearable>
						<el-option
							v-for="(item,index) in formBaseData.AlarmSeverity"
							:key="index"
							v-if="item.type == 66 || item.type == 99"
							:label="item.name"
							:value="item.type"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmCurrent.processStatus') + '：'">
					<el-select v-model="formItem.dealWithStatus" class="width200" clearable>
						<el-option v-for="(item,index) in formBaseData.AlarmHandleStatus" :key="index"
								   :label="item.name" :value="item.type"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('public.happenTime') + '：'">
					<el-date-picker
						v-model="formItem.dateTime"
						type="daterange"
						:range-separator="$t('public.to')"
						:start-placeholder="$t('public.startTime')"
						:end-placeholder="$t('public.endTime')"/>
				</el-form-item>
				<el-form-item>
					<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
					<el-button class="queryBtn" type="reset" @click="resetData">{{$t('public.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="padding20 clearfix marBottom50">
			<el-form inline class="fr" :model="formItem">
				<el-form-item>
					<el-button @click="downloadData" :disabled="disableBtn.more">
						<span class="iconfont">&#xe6a8;</span>
						{{$t('alarmCurrent.exportExcel')}}
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button :disabled="disableBtn.more" @click="batchOpenAlarm">
						<span class="iconfont">&#xe6ab;</span>
						{{$t('alarmCurrent.batchOpenAlarm')}}
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button :disabled="disableBtn.more" @click="batchCloseAlarm">
						<span class="iconfont">&#xe6aa;</span>
						{{$t('alarmCurrent.batchCloseAlarm')}}
					</el-button>
				</el-form-item>
			</el-form>
			<!--表格-->
			<el-table
				:data="tableData"
				ref="table"
				class="indexTableBox"
				stripe
				border
				@selection-change="selectTableNum"
				@cell-click="cellClickColumn"
				@cell-mouse-enter="cellMouseEnter"
				@cell-mouse-leave="cellMouseLeave">
				<el-table-column width="90px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
						  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
						</span>
					</template>
				</el-table-column>
				<el-table-column width="70px" :label="$t('alarmCurrent.alarmLevelText')" header-align="center"
								 align="center">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark"
									:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
							<span class="iconfont iconfontSuccess">&#xe648;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark"
									:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
							<span class="iconfont iconfontWarn">&#xe649;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark"
									:content="tableDataBase.AlarmSeverity[scope.row.alarmLevel]" placement="top-start">
							<span class="iconfont iconfontError">&#xe64a;</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmCurrent.equipmentName')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
							<span>{{scope.row.deviceName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('alarmCurrent.alarmContent')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">
								{{scope.row.currentStatus}}
							</div>
							<span>{{scope.row.currentStatus}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="160px" :label="$t('alarmCurrent.alarmThisTime')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<span>{{scope.row.occurrenceTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmCurrent.computerRoomName')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">
								<span>{{scope.row.roomName == null? 'N/A' : (scope.row.roomName == '' ? 'N/A' : scope.row.roomName)}}</span>
							</div>
							<span>{{scope.row.roomName == null? 'N/A' : (scope.row.roomName == '' ? 'N/A' : scope.row.roomName)}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmCurrent.rackName')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">
								<span>{{scope.row.rackName == null? 'N/A' : (scope.row.rackName == '' ? 'N/A' : scope.row.rackName)}}</span>
							</div>
							<span>{{scope.row.rackName == null? 'N/A' : (scope.row.rackName == '' ? 'N/A' : scope.row.rackName)}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="120px" prop="rackPosition" :label="$t('alarmCurrent.location')"
								 header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.rackPosition == null ? 'N/A' : (scope.row.rackPosition == '' ? 'N/A' : scope.row.rackPosition + 'U')}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" prop="ip" :label="$t('alarmCurrent.equipmentIp')" header-align="left"
								 align="left"/>
				<el-table-column width="120px" :label="$t('alarmCurrent.equipmentType')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" :label="$t('alarmCurrent.equipmentOwner')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" class="alarmCurrent-tooltip" placement="top-start">
							<div slot="content" :manual="true" v-model="scope.row.statusMenu">
								<!--
								<el-form class="alarmCurrentBox-chargeBy" label-width="120px">
									<el-form-item :label="$t('alarmCurrent.userName') + '：'"></el-form-item>
									<el-form-item :label="$t('alarmCurrent.organizationName') + '：'"></el-form-item>
									<el-form-item :label="$t('alarmCurrent.businessCode') + '：'"></el-form-item>
									<el-form-item :label="$t('alarmCurrent.email') + '：'"></el-form-item>
									<el-form-item :label="$t('alarmCurrent.phoneNumber') + '：'"></el-form-item>
								</el-form>
								-->
								<span>{{scope.row.chargeBy == null ? 'N/A' : scope.row.chargeBy}}</span>
							</div>
							<span>{{scope.row.chargeBy == null ? 'N/A' : scope.row.chargeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmCurrent.processStatus')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<span>{{tableDataBase.AlarmHandleStatus[scope.row.status]}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" fixed="right" :label="$t('public.operation')">
					<template slot-scope="scope">
						<!--            <el-button type="text">{{$t('alarmCurrent.turnWarranty')}}</el-button>-->
						<el-button type="text" @click="dealWithAlarm(scope.row)">{{$t('alarmCurrent.dealWithAlarm')}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column type="selection" fixed="right" header-align="left" align="left"/>
			</el-table>
			<!--分页-->
			<pages
				:total='options.total'
				:currentPage='options.currentPage'
				:page-size="options.pageSize"
				@handleSizeChangeSub="handleSizeChangeSub"
				@handleCurrentChangeSub="handleCurrentChange"/>
		</div>
		<!--设备告警详情弹出层-->
		<equipmentAlarmDetails
			ref="alarmDialog"
			:dialogVisible="dialogVisible"
			:AssetType="tableDataBase.AssetType"
			:AlarmSeverity="tableDataBase.AlarmSeverity"
			:AlarmHandleStatus="tableDataBase.AlarmHandleStatus"
			@dialogVisibleStatus="dialogVisibleStatus"/>
		<!--标签页-->
		<AdministrationTags
			@changePageDeviceId="changePageDeviceId"
			@refreshSetInterval="refreshSetInterval"
			@clearSetInterval="clearSetInterval"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId" />
	</Box>
</template>

<script>
	import Box from '../../../components/common/Box';
	import AdministrationTags from '../../../components/monitor/AdministrationTabs';
	import equipmentAlarmDetails from '../../../components/monitor/equipmentAlarmDetails';
	import {dateFilterDay, dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

	export default {
		name: "alarmCurrent",
		components: {Box, AdministrationTags, equipmentAlarmDetails},
		data() {
			return {
				// 查询表单
				formItem: {
					equipmentType: this.$t('public.all'),
					equipmentTypeId: null,
					computerRoomId: null,
					rackNameId: null,
					equipmentIp: null,
					equipmentName: null,
					businessId: null,
					businessName: null,
					equipmentStatus: null,
					dealWithStatus: null,
					dateTime: null,
					status: 0,
					checked: false,
					operation: null,
					statusTip: this.$t('alarmCurrent.confirmOpinions')
				},
				statusMenu: true,
				// 设备告警详情提交字段
				addEdit: {
					id: ''
				},
				// 全局按钮启用禁用判断
				disableBtn: {
					more: true
				},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],
				// 机房树形下拉框的数据
				computerRoomList: [],
				// 机架下拉框数据
				rackNameList: [],
				// 筛选列表
				optionsList: [
					{label: 1, id: 1},
					{label: 2, id: 2}
				],
				// 设备状态下拉框
				equipmentStatusList: [],
				// 关联业务树形下拉框集合
				businessTreeData: [],
				// 表格数据
				tableData: [],
				// 缓存表格数据用于纯前端筛选
				tableDataAll: [],
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {}
				},
				// 表单数据字典
				formBaseData: {
					AlarmHandleStatus: [],
					AlarmSeverity: [],
					AssetType: []
				},
				// 设备告警详情弹出层信息
				alarmDetailDataAlarm: {},
				alarmDetailDataComment: [],
				// 处理状态
				dealWithStatusList: [],
				// 表格选中的数据集合
				checkValueList: [],
				// 控制设备类型下拉框的显示隐藏
				isShowTypePopover: false,
				// 关联业务树形下拉框显示隐藏
				isShowBusinessPopover: false,
				// 设备详情信息弹出层
				dialogVisible: false,
				defaultProps: {
					label: 'nodeName',
					children: 'children'
				},
				defaultPropsBusiness: {
					label: 'nodeName',
					children: 'children'
				},
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				pageDeviceId:'',
				pageDeviceName: '',
			}
		},
		methods: {
			// 重置筛选表单数据
			resetData() {
				var _t = this;
				_t.formItem.equipmentType = _t.$t('public.all');
				_t.formItem.equipmentTypeId = null;
				_t.formItem.computerRoomId = null;
				_t.formItem.rackNameId = null;
				_t.formItem.equipmentIp = null;
				_t.formItem.equipmentName = null;
				_t.formItem.businessId = null;
				_t.formItem.businessName = null;
				_t.formItem.equipmentStatus = null;
				_t.formItem.dealWithStatus = null;
				_t.formItem.dateTime = null;
				_t.formItem.status = 0;
				_t.formItem.checked = false;
				_t.formItem.operation = null;
				_t.formItem.statusTip = _t.$t('alarmCurrent.confirmOpinions')
			},
			// 表格选中的值
			selectTableNum(data) {
				var _t = this;
				if (data.length !== 0) {
					_t.disableBtn.more = false;
				} else {
					_t.disableBtn.more = true;
				}
				var checkValueList = new Array();
				data.forEach((item) => {
					checkValueList.push(item.id);
				});
				_t.checkValueList = checkValueList;
			},
			// 改变筛选值
			changeOperation(val) {
				var _t = this;
				var tableData = new Array();
				if (val !== '') {
					_t.tableDataAll = _t.tableDataAll === null ? [] : _t.tableDataAll;
					_t.tableDataAll.forEach((item) => {
						if (item.id === val.id) {
							tableData.push(item);
						}
					});
				} else {
					tableData = _t.tableDataAll;
				}
				_t.tableData = tableData;
			},
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				var _t = this;
				_t.dialogVisible = val;
			},
			// 改变表单的机房时加载机柜的数据
			changeRoom(val) {
				var _t = this;
				if (val !== null && val !== '') {
					_t.computerRoomList.forEach(function (item) {
						if (item.centerRooms && item.centerRooms !== null) {
							item.centerRooms.forEach((t)=>{
								if (t.id === val) {
									_t.rackNameList = t.rackList ? t.rackList : [];
								}
							});
						}
					});
				} else {
					_t.rackNameList = [];
				}
				_t.formItem.rackNameId = '';
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
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('alarm/alarm/pagelist', {
					jsonString: JSON.stringify({
						alarm: {
							type: _t.formItem.equipmentTypeId == null ? null : _t.formItem.equipmentTypeId,
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
							ip: _t.formItem.equipmentIp == null ? null : (_t.formItem.equipmentIp.trim() == '' ? null : _t.formItem.equipmentIp.trim()),
							roomId: _t.formItem.computerRoomId == null ? null : (_t.formItem.computerRoomId.trim() == '' ? null : _t.formItem.computerRoomId.trim()),
							rackId: _t.formItem.rackNameId == null ? null : (_t.formItem.rackNameId.trim() == '' ? null : _t.formItem.rackNameId.trim()),
							business: _t.formItem.businessId == null ? null : (_t.formItem.businessId.trim() == '' ? null : _t.formItem.businessId.trim()),
							alarmLevel: _t.formItem.equipmentStatus == null ? null : (_t.formItem.equipmentStatus.trim() == '' ? null : _t.formItem.equipmentStatus.trim()),
							status: _t.formItem.dealWithStatus == null ? null : (_t.formItem.dealWithStatus.trim() == '' ? null : _t.formItem.dealWithStatus.trim()),
							ocrStartTime: _t.formItem.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[0].getTime()),
							ocrEndTime: _t.formItem.dateTime == null ? null : dateFilterDay(_t.formItem.dateTime[1].getTime()),
						},
						page: {
							currentPage: _t.options.currentPage,
							pageSize: _t.options.pageSize
						}
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
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
			// 查询表格中状态对应的数据值
			getTableDataValue(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 获取表格对应的状态值
							_t.tableDataBase = res.data;
							_t.tableData = resData.list === null ? [] : resData.list;
							_t.options.currentPage = resData.page.currentPage;
							_t.options.total = resData.page.totalResultSize;
							// 用于判断鼠标是否移入设备责任人列 默认为false
							_t.tableData.forEach(function (item) {
								item.statusMenu = false;
							});
							_t.tableDataAll = _t.tableData;
							_t.disableBtn.more = true;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							_t.disableBtn.more = true;
							break;
					}
				});
			},
			// 导出excel数据
			downloadData() {
			},
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
			// 单元格鼠标移入事件
			cellMouseEnter(row, column) {
				var _t = this;
				// 设备责任人列
				if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
					row.statusMenu = true;
				}
			},
			// 单元格移出事件
			cellMouseLeave(row, column) {
				var _t = this;
				// 设备责任人列
				if (column.label == _t.$t('alarmCurrent.equipmentOwner')) {
					row.statusMenu = false;
				}
			},
			// 处理告警
			dealWithAlarm(row) {
				var _t = this;
				if (row.id !== null) {
					_t.addEdit.id = row.id;
					_t.dialogVisible = true;
					// 父组件调用 子组件 获取数据的方法
					_t.$refs.alarmDialog.getData(_t.addEdit.id, false);
				}
			},
			// 单元格点击
			cellClickColumn(row, column) {
				var _t = this;
				// 点击状态列 点击告警内容列
				if (column.label === _t.$t('alarmCurrent.alarmLevelText') || column.label === _t.$t('alarmCurrent.alarmContent')) {
					if (row.id !== null) {
						_t.addEdit.id = row.id;
						_t.dialogVisible = true;
						// 父组件调用 子组件 获取数据的方法
						_t.$refs.alarmDialog.getData(_t.addEdit.id, false);
					}
				}
				// 点击设备名称列 点击最新告警时间列
				if (column.label === _t.$t('alarmCurrent.equipmentName') || column.label === _t.$t('alarmCurrent.alarmThisTime')) {
					if (row.deviceId !== null) {
						_t.pageDeviceId = row.deviceId;
						_t.pageDeviceName = row.deviceName;
						//销毁刷新定时器
						clearInterval(_t.timer);
						_t.timer = null;
					}
				}
			},
			// 表单部分机房机架下拉框数据
			getFormData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/serverRoom/maplist', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								// 缓存机房机柜map
								var rackMap = new Object();
								if (res.data.racks && res.data.racks !== null) {
									rackMap = res.data.racks;
								}
								// 第一层先把 数据中心下的 机房map转为 机房list
								var dataCenterList = res.data.dataCenter === null ? [] : res.data.dataCenter;
								// 第一层循环 数据中心
								dataCenterList.forEach((center) => {
									// 判断机房集合字段是否存在
									if (center.centerRooms && center.centerRooms !== null) {
										center.centerRooms.forEach((t) => {
											t.rackList = rackMap[t.id] ? rackMap[t.id] : [];
										});
									}
								});
							}
							_t.computerRoomList = dataCenterList;
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
							var equipmentTypeList = res.data.treeNode.children[0].children;
							equipmentTypeList.unshift({
								nodeName: _t.$t('public.all'),
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
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.businessTreeData = res.data.children === null ? [] : res.data.children;
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
			// 查询字典集合
			getBaseDataList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['AlarmHandleStatus', 'AssetType', 'AlarmSeverity']
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
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
			// 表格左上角数据筛选接口
			getOptionsList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.optionsList = res.data.listData === null ? [] : res.data.listData;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.optionsList = [];
							break;
					}
				});
			},
			// 批量确认告警
			batchOpenAlarm() {
				var _t = this;
				_t.$api.post('alarm/alarm/batchconfirm', {
					alarmIds: _t.checkValueList,
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.getData();
							_t.$message({
								dangerouslyUseHTMLString: true,
								message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> 提交成功",
								customClass: 'messageBoxSuccess',
								duration: 2000
							});
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.getData();
							_t.$message({
								dangerouslyUseHTMLString: true,
								message: "<span class='iconfont iconfontError'>&#xe64e;</span> 提交失败",
								customClass: 'messageBoxError',
								duration: 2000
							});
							break;
					}
				});
			},
			// 批量关闭告警
			batchCloseAlarm() {
				var _t = this;
				_t.$api.post('alarm/alarm/batchdelete', {
					alarmIds: _t.checkValueList,
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.getData();
							_t.$message({
								dangerouslyUseHTMLString: true,
								message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> 提交成功",
								customClass: 'messageBoxSuccess',
								duration: 2000
							});
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.getData();
							_t.$message({
								dangerouslyUseHTMLString: true,
								message: "<span class='iconfont iconfontError'>&#xe64e;</span> 提交失败",
								customClass: 'messageBoxError',
								duration: 2000
							});
							break;
					}
				});
			},
			// 接收组件中传回的设备id
			changePageDeviceId(val){
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val){
				var _t = this;
				if (val) {
					_t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val){
				var _t = this;
				if (val) {
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			//页面定时刷新
			refreshPage(){
				var _t = this;
				var rate = 5*60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if(null != refreshRateMap && undefined != refreshRateMap){
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-Alarm'];
					if(null != rateMap && undefined != rateMap){
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5*60; //都为空时默认5分钟
						}
					}
				}
				// 定时器防止密集访问
				_t.timer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.lastTime = nowTime;
						//分页查询表格数据
						_t.getData();
					}
				}, rate * 1000);
			}
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getData();
			this.getFormData();
			this.getBaseData();
			this.getBusinessTreeData();
			this.getBaseDataList();
			this.getOptionsList();
		},
		mounted(){
			var _t = this;
			//定时刷新页面
			_t.refreshPage();
		},
		beforeDestroy() {
			var _t = this;
			// 销毁关于标签页 圆角化的样式
			var styleTag = document.getElementsByTagName('style');
			for (var key in styleTag) {
				if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
					styleTag[key].remove();
				}
			}
			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style>
	.alarmCurrentBox-dialog .el-dialog {
		width: 930px;
		height: 560px;
	}
</style>
