<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmHistory')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="borderBottomFormItem">
			<!--表单-->
			<el-form :model="formItem" inline label-width="120px">
				<el-form-item :label="$t('alarmHistory.equipmentTypeInfo') + '：'">
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
				<el-form-item :label="$t('alarmHistory.equipmentName') + '：'">
					<el-input v-model="formItem.equipmentName" class="width200" clearable/>
				</el-form-item>
				<el-form-item :label="$t('alarmHistory.equipmentIp') + '：'">
					<el-input v-model="formItem.equipmentIp" class="width200" clearable/>
				</el-form-item>
				<el-form-item :label="$t('alarmHistory.computerRoomName') + '：'">
					<el-select
						v-model="formItem.computerRoomId"
						clearable
						@change="changeRoom(formItem.computerRoomId)"
						class="width200">
						<el-option
							v-for="(item,index) in computerRoomList"
							:key="index"
							:label="item.name"
							:value="item.id"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmHistory.rackNameInfo') + '：'">
					<el-select v-model="formItem.rackNameId" class="width200" clearable>
						<el-option
							v-for="(item,index) in rackNameList"
							:key="index"
							:label="item.name"
							:value="item.id"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmHistory.relateBusiness') + '：'">
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
				<el-form-item :label="$t('alarmHistory.alarmLevelText') + '：'">
					<el-select v-model="formItem.equipmentStatus" class="width200" clearable>
						<el-option
							v-for="(item,index) in formBaseData.AlarmSeverity"
							:key="index"
							v-if="item.type == 66 || item.type == 99"
							:label="item.name"
							:value="item.type"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('alarmHistory.processStatus') + '：'">
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
			<div class="fr">
				<el-form inline>
					<el-form-item style="margin-right: 0">
						<el-button @click="downloadData" :disabled="disableBtn.more">
							<span class="iconfont">&#xe6a8;</span>
							{{$t('alarmHistory.exportExcel')}}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<!--表格-->
			<el-table
				:data="tableData"
				ref="table"
				class="indexTableBox"
				stripe
				border
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
				<el-table-column width="70px" :label="$t('alarmHistory.alarmLevelText')" header-align="center"
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
				<el-table-column width="100px" :label="$t('alarmHistory.equipmentName')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
							<span>{{scope.row.deviceName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('alarmHistory.alarmContent')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">
								{{scope.row.currentStatus}}
							</div>
							<span>{{scope.row.currentStatus}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="160px" :label="$t('alarmHistory.alarmThisTime')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<span>{{scope.row.occurrenceTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmHistory.computerRoomName')" header-align="left"
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
				<el-table-column width="100px" :label="$t('alarmHistory.rackName')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.frameName" placement="top-start">
							<div slot="content">
								<span>{{scope.row.frameName == null? 'N/A' : (scope.row.frameName == '' ? 'N/A' : scope.row.frameName)}}</span>
							</div>
							<span>{{scope.row.frameName == null? 'N/A' : (scope.row.frameName == '' ? 'N/A' : scope.row.frameName)}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="110px" prop="framePosition" :label="$t('alarmHistory.location')"
								 header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.framePosition == null ? 'N/A' : (scope.row.framePosition == '' ? 'N/A' : scope.row.framePosition + 'U')}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" prop="ip" :label="$t('alarmHistory.equipmentIp')" header-align="left"
								 align="left"/>
				<el-table-column width="120px" :label="$t('alarmHistory.equipmentType')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">
								{{tableDataBase.AssetType[scope.row.type]}}
							</div>
							<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="120px" :label="$t('alarmHistory.equipmentOwner')" header-align="left"
								 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" class="alarmHistory-tooltip" placement="top-start">
							<div slot="content" :manual="true" v-model="scope.row.statusMenu">
								<!--
							  <el-form class="alarmHistoryBox-chargeBy" label-width="120px">
								<el-form-item :label="$t('alarmHistory.userName') + '：'"></el-form-item>
								<el-form-item :label="$t('alarmHistory.organizationName') + '：'"></el-form-item>
								<el-form-item :label="$t('alarmHistory.businessCode') + '：'"></el-form-item>
								<el-form-item :label="$t('alarmHistory.email') + '：'"></el-form-item>
								<el-form-item :label="$t('alarmHistory.phoneNumber') + '：'"></el-form-item>
							  </el-form>
								-->
								<span>{{scope.row.chargeBy == null ? 'N/A' : scope.row.chargeBy}}</span>
							</div>
							<span>{{scope.row.chargeBy == null ? 'N/A' : scope.row.chargeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="160px" :label="$t('alarmHistory.closeTime')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.closeTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px" :label="$t('alarmHistory.closeBy')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="light" :content="scope.row.closeBy" placement="left-start">
							<span>{{scope.row.closeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
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
	import Box from '../../../components/Box';
	import AdministrationTags from '../../../components/AdministrationTabs';
	import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
	import {dateFilterDay, dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

	export default {
		name: "alarmHistory",
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
					statusTip: this.$t('alarmHistory.confirmOpinions')
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
				computerRoomList: [
					{name: this.$t('public.all'), id: null}
				],
				// 机架下拉框数据
				rackNameList: [],
				framesData: [],
				// 筛选下拉列表
				optionsList: [],
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
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				this.dialogVisible = val;
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
			// 获取数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('alarm/alarmHistory/pagelist', {
					jsonString: JSON.stringify({
						alarm: {
							type: _t.formItem.equipmentTypeId == null ? null : _t.formItem.equipmentTypeId,
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
							ip: _t.formItem.equipmentIp == null ? null : (_t.formItem.equipmentIp.trim() == '' ? null : _t.formItem.equipmentIp.trim()),
							roomId: _t.formItem.computerRoomId == null ? null : (_t.formItem.computerRoomId.trim() == '' ? null : _t.formItem.computerRoomId.trim()),
							frameId: _t.formItem.rackNameId == null ? null : (_t.formItem.rackNameId.trim() == '' ? null : _t.formItem.rackNameId.trim()),
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
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableDataBase = {};
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							break;
					}
				});
			},
			// 点击设备类型下拉框
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
			// 导出excel数据
			downloadData() {},
			// 单元格点击
			cellClickColumn(row, column) {
				var _t = this;
				// 点击状态列 点击告警内容列
				if (column.label === _t.$t('alarmHistory.alarmLevelText') || column.label === _t.$t('alarmHistory.alarmContent')) {
					if (row.id !== null) {
						_t.addEdit.id = row.id;
						_t.dialogVisible = true;
						// 父组件调用 子组件 获取数据的方法
						_t.$refs.alarmDialog.getData(_t.addEdit.id, true);
					}
				}
				// 点击设备名称列 点击最新告警时间列
				if (column.label === _t.$t('alarmHistory.equipmentName') || column.label === _t.$t('alarmHistory.alarmThisTime')) {
					if (row.deviceId !== null) {
						_t.pageDeviceId = row.deviceId;
						_t.pageDeviceName = row.deviceName;
						//销毁刷新定时器
						clearInterval(_t.timer);
						_t.timer = null;
					}
				}
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
				if (column.label == _t.$t('alarmHistory.equipmentOwner')) {
					row.statusMenu = true;
				}
			},
			// 单元格移出事件
			cellMouseLeave(row, column) {
				var _t = this;
				// 设备责任人列
				if (column.label == _t.$t('alarmHistory.equipmentOwner')) {
					row.statusMenu = false;
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
							var computerRoomList = res.data.rooms === null ? [] : res.data.rooms;
							_t.framesData = res.data.frames === null ? [] : res.data.frames;
							computerRoomList.unshift({name: _t.$t('public.all'), id: null});
							_t.computerRoomList = computerRoomList;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.computerRoomList = [{name: _t.$t('public.all'), id: null}];
							break;
					}
				});
			},
			// 改变表单的机房时加载机柜的数据
			changeRoom(val) {
				var _t = this;
				if (_t.formItem.computerRoomId !== null) {
					_t.framesData = _t.framesData === null ? [] : _t.framesData;
					_t.framesData.forEach(function (item) {
						if (item.roomId == val) {
							_t.rackNameList = item.frame;
						}
					});
				} else {
					_t.rackNameList = [];
				}
				_t.formItem.rackNameId = '';
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
							equipmentTypeList = equipmentTypeList === null ? [] : equipmentTypeList;
							equipmentTypeList.unshift({
								nodeName: _t.$t('public.all'),
								level: 1,
								children: null,
								nodeCode: null,
								parentId: '0'
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
			// 接收组件中传回的设备id
			changePageDeviceId(val){
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val){
				var _t = this;
				if (val) {
					// 开启父级表格定时器
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
			var _t = this;
			_t.$store.commit('setLoading', true);
			_t.getData();
			_t.getFormData();
			_t.getBaseData();
			_t.getBusinessTreeData();
			_t.getBaseDataList();
		},
		mounted() {
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
	.alarmHistoryBox-dialog .el-dialog {
		width: 930px;
		height: 560px;
	}
</style>
