<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.monitorStatusSearch')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="borderBottomFormItem">
			<!--表单-->
			<el-form :model="formItem" inline>
				<el-form-item :label="$t('monitorStatusSearch.formIP') + '：'">
					<el-input v-model="formItem.assetDevice.ip" class="width200" clearable/>
				</el-form-item>
				<el-form-item :label="$t('monitorStatusSearch.formStatusType') + '：'">
					<el-select
						v-model="formItem.status" class="width200" clearable>
						<el-option
							v-for="(item,index) in formBaseData.AlarmSeverityList"
							:key="index"
							:label="item.name"
							:value="item.type"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('monitorStatusSearch.formMonitorRate') + '：'">
					<el-select v-model="formItem.deviceMonitorAttr.monitorInterval" class="width200" clearable>
						<el-option
							v-for="(item,index) in formBaseData.MonitorRateList"
							:key="index"
							:label="item.name"
							:value="item.type"/>
					</el-select>
				</el-form-item>
				<el-form-item label=" "></el-form-item>
				<el-form-item>
					<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
					<el-button class="queryBtn" type="reset" @click="resetData">{{$t('public.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="padding20 clearfix">
			<el-form inline class="fr" :model="formItem">
				<el-form-item>
					<el-select v-model="formItem.operation" @change="changeOperation(formItem.operation)">
						<el-option
							v-for="(item,index) in operationList"
							:key="index"
							:label="item.name"
							:value="item.value"/>
					</el-select>
				</el-form-item>
			</el-form>
			<!--表格-->
			<el-table
				:data="tableData"
				ref="table"
				border
				stripe
				@cell-click="clickCellOfTable"
				@selection-change="selectTableLine">
				<el-table-column width="60px" :label="$t('public.index')" header-align="center" align="center">
					<template slot-scope="scope">
						<span>
						  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
						</span>
					</template>
				</el-table-column>
				<el-table-column width="70px" :label="$t('monitorStatusSearch.columnStatus')" header-align="center"
												 align="center">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.status == 99" effect="dark"
												:content="dictionaryMap.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontError">&#xe64a;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 66" effect="dark"
												:content="dictionaryMap.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontWarn">&#xe649;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 22" effect="dark"
												:content="dictionaryMap.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontDisable">&#xe64f;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 11" effect="dark"
												:content="dictionaryMap.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontDisable">&#xe64e;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 33" effect="dark"
												:content="dictionaryMap.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontSuccess">&#xe648;</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="130px" :label="$t('monitorStatusSearch.columnIp')" header-align="center" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.assetDevice.ip}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" :label="$t('monitorStatusSearch.columnType')" header-align="center"
												 align="center">
					<template slot-scope="scope">
						<span>{{scope.row.part}}</span>
					</template>
				</el-table-column>
				<el-table-column width="300px" :label="$t('monitorStatusSearch.columnName')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">
								{{scope.row.path}}
							</div>
							<span>{{scope.row.path}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="roomName" :label="$t('monitorStatusSearch.columnStatusText')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">
								{{scope.row.statusText}}
							</div>
							<span>{{scope.row.statusText}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column width="120px" prop="framePosition" :label="$t('monitorStatusSearch.columnMonitorRate')"
												 header-align="center" align="center">
					<template slot-scope="scope">
						<span>{{dictionaryMap.MonitorRate[scope.row.deviceMonitorAttrList[0].monitorInterval]}}</span>
					</template>
				</el-table-column>
				<el-table-column width="140px" prop="ip" :label="$t('monitorStatusSearch.columnLastModifyTime')"
												 header-align="center" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.lastModifyTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<!--
				<el-table-column width="70px" fixed="right" :label="$t('public.operation')" header-align="center" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click.stop="dealWithMonitor(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
				-->
				<el-table-column type="selection" fixed="right" header-align="center" align="center"/>
			</el-table>
			<!--分页-->
			<pages
				:total='options.total'
				:currentPage='options.currentPage'
				:page-size="options.pageSize"
				@handleSizeChangeSub="handleSizeChangeSub"
				@handleCurrentChangeSub="handleCurrentChange"/>
		</div>
		<el-dialog
			class="deviceMonitorStatus-dialog"
			:title="$t('monitorStatusSearch.dialogTitle')"
			append-to-body
			:visible.sync="dialogVisible_monitorInfo"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-table :data="monitorInformationInfoList" border stripe :show-header="false">
				<el-table-column width="230px" prop="key"/>
				<el-table-column prop="value"/>
			</el-table>
			<span slot="footer">
				<el-button type="primary" class="alertBtn"
									 @click="dialogVisible_monitorInfo = false">{{$t('public.confirm')}}</el-button>
				<el-button type="default" class="alertBtn"
									 @click="dialogVisible_monitorInfo = false">{{$t('public.cancel')}}</el-button>
			</span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../components/Box';
	import {dateFilterDay, dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

	export default {
		name: "monitorStatusSearch",
		components: {Box},
		data() {
			return {
				// 查询表单
				formItem: {
					part: null,
					path: null,
					statusText: null,
					status: null,
					assetDevice: {
						ip: null
					},
					deviceMonitorAttr: {
						monitorInterval: null
					},
					operation: null
				},
				statusMenu: true,
				// 全局按钮启用禁用判断
				disableBtn: {
					more: true
				},
				// 表格数据
				tableData: [],
				// 缓存表格数据用于纯前端筛选
				tableDataAll: [],
				// 表格数据字典
				dictionaryMap: {
					AlarmSeverity: {},
					MonitorRate: {},
					WorkStatus: {}
				},
				// 表单数据字典
				formBaseData: {
					MonitorRateList: [],
					AlarmSeverityList: []
				},
				operationList: [], // 操作下拉框数据
				dialogVisible_monitorInfo: false, // 控制设备部件监测信息弹出层的显示隐藏
				monitorInformationInfoList: [], // 设备部件监测信息弹出层的数据列表
				checkValueList: [], // 表格选中的数据集合
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},

				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null //记录定时器
			}
		},
		methods: {
			// 重置筛选表单数据
			resetData() {
				var _t = this;
				_t.formItem.part = null;
				_t.formItem.path = null;
				_t.formItem.statusText = null;
				_t.formItem.status = null;
				_t.formItem.assetDevice = {ip: null};
				_t.formItem.deviceMonitorAttr = {monitorInterval: null};
				_t.formItem.nodeType = 1;
			},
			// 表格选中的值
			selectTableLine(data) {
				//data 每次传进来的都是当前表格选中的行
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
			//行的点击事件
			clickCellOfTable(row, column, cell, event) {
				var _t = this;
				//解析 result 字段中的 json 串
				var resultContentArr = JSON.parse(row.result);
				var listArr = new Array();
				for (var key in resultContentArr) {
					var obj = new Object();
					obj.key = key;
					obj.value = resultContentArr[key];
					listArr.push(obj);
				}
				//显示监测详情弹窗
				_t.dialogVisible_monitorInfo = true;
				//设置弹窗的数据
				_t.monitorInformationInfoList = listArr;
			},
			// 监测状态批量操作提交
			changeOperation(val) {
				var _t = this;
				if (val !== null && _t.checkValueList.length > 0) {
					_t.formItem.operation = val;
					var operationName = _t.dictionaryMap.WorkStatus[val];

					_t.$confirm((_t.$t('monitorStatusSearch.dialogBatchOperationTip') + "<br/>1、" + operationName), _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn',
						cancelButtonText: _t.$t('public.cancel'),
						cancelButtonClass: 'alertBtn',
						type: 'warning',
						customClass: 'batchOperation-dialog',
						dangerouslyUseHTMLString: true
					}).then(() => {
						//写确认逻辑
						_t.$api.post('monitor/deviceMonitorAttr/execute', {
							option: val,
							isDevice: false,
							ids: _t.checkValueList
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.getData();
									_t.formItem.operation = null;
									_t.$message({
										dangerouslyUseHTMLString: true,
										message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> " + _t.$t('monitorStatusSearch.dialogSuccessTip'),
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
									_t.formItem.operation = null;
									_t.$message({
										dangerouslyUseHTMLString: true,
										message: "<span class='iconfont iconfontError'>&#xe64e;</span> " + _t.$t('monitorStatusSearch.dialogFailedTip'),
										customClass: 'messageBoxError',
										duration: 2000
									});
									break;
							}
						});
					}).catch(() => {
						//取消逻辑
						return;
					});
				} else {
					_t.$alert(_t.$t('monitorStatusSearch.dialogToSelectedLineTip'), _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn',
						type: 'warning',
						callback: action => {
							//
						}
					});
				}
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('monitor/deviceMonitor/uniteListByPage', {
					jsonString: JSON.stringify({
						deviceMonitorAssociated: {
							part: _t.formItem.part == null ? null : (_t.formItem.part.trim() == '' ? null : ('%' + _t.formItem.part.trim() + '%')),
							path: _t.formItem.path == null ? null : (_t.formItem.path.trim() == '' ? null : ('%' + _t.formItem.path.trim() + '%')),
							statusText: _t.formItem.statusText == null ? null : (_t.formItem.statusText.trim() == '' ? null : ('%' + _t.formItem.statusText.trim() + '%')),
							status: _t.formItem.status == null ? null : (_t.formItem.status.trim() == '' ? null : _t.formItem.status.trim()),
							assetDevice: _t.formItem.assetDevice.ip == null ? null : (_t.formItem.assetDevice.ip.trim() == '' ? null : {ip: ('%' + _t.formItem.assetDevice.ip.trim() + '%')}),
							deviceMonitorAttr: _t.formItem.deviceMonitorAttr.monitorInterval == null ? null : (_t.formItem.deviceMonitorAttr.monitorInterval.trim() == '' ? null : {monitorInterval: _t.formItem.deviceMonitorAttr.monitorInterval.trim()}),
							nodeType: 1
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
							var resData = res.data;
							_t.tableData = resData.list === null ? [] : resData.list;
							_t.options.currentPage = resData.currentPage;
							_t.options.total = resData.count;
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
			// 查询字典集合
			getBaseDataList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['MonitorRate', 'AlarmSeverity', "WorkStatus"]
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formBaseData.AlarmSeverityList = res.data.AlarmSeverity;
							_t.formBaseData.MonitorRateList = res.data.MonitorRate;

							//过滤封装批量操作下拉框的option项 begin
							var workStatus = new Array();
							if (null != res.data.WorkStatus) {
								for (var i = 0; i < res.data.WorkStatus.length; i++) {
									var status = res.data.WorkStatus[i];
									if (status.type == '38' || status.type == '39' || status.type == '47' || status.type == '48') {
										//排除掉
									} else {
										workStatus.push({name: status.name, value: status.type})
									}
								}
							}
							workStatus.unshift({name: _t.$t('monitorStatusSearch.formAllOperation'), value: null});
							_t.operationList = workStatus;
							//过滤封装批量操作下拉框的opton项 end
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.formBaseData.AlarmSeverityList = [];
							_t.formBaseData.MonitorRateList = [];
							break;
					}
				});
			},
			// 查询表格中用于翻译的字典
			getDictionaryMapList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["MonitorRate", "AlarmSeverity", "WorkStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							//设置表格的字典翻译
							_t.dictionaryMap.MonitorRate = res.data.MonitorRate;
							_t.dictionaryMap.AlarmSeverity = res.data.AlarmSeverity;
							_t.dictionaryMap.WorkStatus = res.data.WorkStatus;
							//分页查询表格数据
							_t.getData();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.dictionaryMap.MonitorRate = {};
							_t.dictionaryMap.AlarmSeverity = {};
							_t.dictionaryMap.WorkStatus = {};
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
			//页面定时刷新
			refreshPage() {
				var _t = this;

				var rate = 5 * 60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-Monitor'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
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
			//获取查询表单中的相关下拉框的值
			this.getBaseDataList();
			//获取分页表格中的需要用于翻译的字典值
			this.getDictionaryMapList();
		},
		mounted() {
			var _t = this;

			//定时刷新页面
			_t.refreshPage();
		},
		beforeDestroy() {
			var _t = this;

			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style>
	.deviceMonitorStatus-dialog .el-dialog {
		width: 700px;
		height: 500px;
	}

	.batchOperation-dialog {
		height: 200px;
	}
</style>
