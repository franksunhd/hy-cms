<template>
	<Box class="grayBg">
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.MonitoringSummary')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--echarts区域-->
		<el-row :gutter="10">
			<el-col :span="12">
				<div style="padding: 10px 0 10px 10px">
					<div id="echartText" class="whiteBg" style="width: 100%; height:440px"></div>
				</div>
			</el-col>
			<el-col :span="12">
				<div style="padding: 10px 10px 10px 0">
					<div id="echart" class="whiteBg" style="width: 100%; height:440px"></div>
				</div>
			</el-col>
		</el-row>
		<div class="equipmentList clearfix">
			<ul class="clearfix">
				<li><span>{{$t('MonitoringSummary.LatestAlarmEquipmentList')}}</span></li>
				<!--设备类型-->
				<li>
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowTypePopover" ref="popover">
						<el-tree
							:data="equipmentTypeList"
							highlight-current
							:expand-on-click-node="false"
							@node-click="clickTypeNode"
							:props="defaultProps"/>
						<el-input
							v-model="formItem.equipmentType"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly slot="reference"/>
					</el-popover>
				</li>
			</ul>
		</div>
		<div class="equipmentList clearfix marBottom50">
			<el-table border :data="tableData" class="indexTableBox" stripe @cell-click="cellClickColumn">
				<el-table-column width="90px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column width="80px" prop="status" :label="$t('MonitoringSummary.columnStatus')" header-align="center"
												 align="center">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.status == 99" effect="dark"
												:content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontError">&#xe64a;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 66" effect="dark"
												:content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontWarn">&#xe649;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 22" effect="dark"
												:content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontDisable">&#xe64f;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 11" effect="dark"
												:content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontDisable">&#xe64e;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 33" effect="dark"
												:content="tableDataBase.AlarmSeverity[scope.row.status]" placement="top-start">
							<span class="iconfont iconfontSuccess">&#xe648;</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="deviceName" :label="$t('MonitoringSummary.columnDeviceName')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
							<div slot="content">
								<span>{{scope.row.deviceName == null ? 'N/A' : scope.row.deviceName}}</span>
							</div>
							<span>{{scope.row.deviceName == null ? 'N/A' : scope.row.deviceName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="lastMonitorTime" :label="$t('MonitoringSummary.columnLatestAlarmTime')"
												 header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.lastMonitorTime | dateFilter" placement="top-start">
							<span v-if="scope.row.lastMonitorTime==null">N/A</span>
							<span>{{scope.row.lastMonitorTime | dateFilter}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="roomName" :label="$t('MonitoringSummary.columnRoomName')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">
								<span>{{scope.row.roomName == null ? 'N/A' : scope.row.roomName}}</span>
							</div>
							<span>{{scope.row.roomName == null ? 'N/A' : scope.row.roomName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="frameName" :label="$t('MonitoringSummary.columnFrameName')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.frameName" placement="top-start">
							<div slot="content">
								<span>{{scope.row.frameName == null ? 'N/A' : scope.row.frameName}}</span>
							</div>
							<span>{{scope.row.frameName == null ? 'N/A' : scope.row.frameName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="framePosition" :label="$t('MonitoringSummary.columnFramePosition')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="(scope.row.framePosition)==null ? 'N/A' : (scope.row.framePosition)+'U'"
												placement="top-start">
							<span v-if="scope.row.framePosition==null">N/A</span>
							<span>{{scope.row.framePosition}}</span>
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
			:page-device-id="pageDeviceId"/>
	</Box>
</template>
<script>
	import {dateFilter} from "../../../assets/js/filters";
	import Box from '../../../components/Box';
	import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
	import AdministrationTags from '../../../components/AdministrationTabs';

	export default {
		name: 'monitoringAndControl',
		components: {
			Box,
			AdministrationTags,
			equipmentAlarmDetails,
			dateFilter
		},
		data() {
			return {
				/*分页*/
				options: {
					total: 0, //总条数
					currentPage: 1, //当前页码
					pageSize: 10, //显示条数
				},
				formItem: {
					/*设备类型*/
					equipmentType: this.$t('MonitoringSummary.formAllName'),
					equipmentTypeId: null,
				},
				// 排序
				addEdit: {
					id: '',
				},
				/*表格数据*/
				tableData: [],
				treeData: [],
				/*设备类型tree*/
				defaultProps: {
					children: 'children',
					label: 'nodeName'
				},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowEditPopover: false, // 控制树形下拉框的显示隐藏
				dialogVisible: false, // 设备告警详情弹出层
				organizationList: [], // 树形下拉框的数据
				equipmentData: {}, // 设备告警详情
				/*设备类型占比图数据*/
				Dincome: [],
				/*设备类型占比图时间*/
				Income1: '',
				/*设备告警级别占比图时间*/
				income1: '',
				/*设备告警级别占比图数据*/
				Dincome1: '',
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				pageDeviceId: '',
				pageDeviceName: '',
			}
		},
		methods: {
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				var _t = this;
				_t.dialogVisible = val;
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							type: _t.formItem.equipmentTypeId,
							monitorStatus: 1,
						},
						alarmDevice: true,
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
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
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity", "DeviceMonitorStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 获取表格对应的状态值
							_t.tableDataBase = res.data;
							_t.tableData = resData.list === null ? [] : resData.list;
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
							_t.tableDataBase = {};
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							break;
					}
				});
			},
			clickNodeAlert(val) {
				var _t = this;
				_t.addEdit.organizationName = val.label;
				//_t.addEdit.organizationId = val.id;
				_t.isShowEditPopover = false;
			},
			refresh2() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/devicetype', {}, function (res) {
					switch (res.status) {
						case 200:
							var Income2 = res.data === null ? [] : res.data;
							var Income1 = dateFilter(res.requesttime);
							_t.Income1 = Income1;
							var Income = [];
							for (var i = 0; i < Income2.length; i++) {
								if (Income2[i].name !== null) {
									Income.push({
										value: Income2[i].count,
										name: Income2[i].name
									})
								}
							}
							_t.Dincome = Income;
							_t.drawLine2();
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
			drawLine2() {
				var _t = this;
				var myChart2 = this.$echarts.init(document.getElementById("echartText"));
				var option = {
					color: ['#fde33f', '#32cc35', '#fb6041', '#975de1', '#40a8ff'],
					title: {
						text: _t.$t('MonitoringSummary.EquipmentProportionRealTimeMonitoring'),
						subtext: _t.Income1,
						top: 5,
						left: 20,
						textStyle: {
							fontSize: 12,
							color: '#333'
						},
						subtextStyle: {
							fontSize: 12,
							color: '#444'
						},
						itemGap: 20
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'horizontal',
						x: 'center',
						y: 'bottom',
						/*left: 400,*/
						/*top: 30,*/
						data: _t.Dincome,
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							magicType: {
								show: true,
								type: ['pie', 'funnel']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: true,
					series: [{
						name: _t.$t('MonitoringSummary.eChartTipTitle'),
						type: 'pie',
						radius: '55%',
						center: ['50%', '50%'],
						avoidLabelOverlap: true,
						label: {
							normal: {
								show: true,
								position: 'right',
								color: '#333',
							},
							emphasis: {
								show: true,
								textStyle: {}
							}
						},
						labelLine: {
							normal: {
								show: true,
								smooth: 0.1,
								length: 20,
								length2: 10,
							}
						},
						data: _t.Dincome,
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart2.setOption(option);
			},

			/*设备告警级别占比图*/
			refresh() {
				var _t = this;
				_t.$api.get('/alarm/alarm/dev', {}, function (res) {
					switch (res.status) {
						case 200:
							var Income2 = res.data === null ? [] : res.data;
							var Income1 = dateFilter(res.requesttime);
							_t.income1 = Income1;
							var Income = [];
							for (var i = 0; i < Income2.length; i++) {
								if (Income2[i].name !== null) {
									Income.push({
										value: Income2[i].count,
										name: Income2[i].name
									})
								}
							}
							_t.Dincome1 = Income;
							_t.drawLine();
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
			drawLine() {
				var _t = this;
				let myChart = this.$echarts.init(document.getElementById("echart"));
				var option = {
					title: {
						text: _t.$t('MonitoringSummary.EquipmentAlarmLevelRealTimeMonitoring'),
						subtext: _t.income1,
						top: 5,
						left: 20,
						textStyle: {
							fontSize: 12,
							color: '#333'
						},
						subtextStyle: {
							fontSize: 12,
							color: '#444'
						},
						itemGap: 20
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'horizontal',
						x: 'center',
						y: 'bottom',
						data: _t.Dincome1
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							magicType: {
								show: true,
								type: ['pie', 'funnel']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: false,
					series: (function () {
						var series = [];
						for (var i = 0; i < 30; i++) {
							series.push({
								name: _t.$t('MonitoringSummary.eChartTipTitleStatus'),
								type: 'pie',
								itemStyle: {
									normal: {
										label: {
											show: i > 28
										},
										labelLine: {
											show: i > 28,
											length: 20
										}
									}
								},
								radius: [i * 3 + 40, i * 3 + 43], //图形大小角度 层级
								data: _t.Dincome1,

							})
						}
						return series;
					})()
				};
				myChart.setOption(option);
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
			// 行点击
			cellClickColumn(row) {
				var _t = this;
				if (row.id !== null) {
					_t.pageDeviceId = row.id;
					_t.pageDeviceName = row.deviceName;
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			// 点击设备类型下拉框节点
			clickTypeNode(val) {
				var _t = this;
				_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;
				_t.getData();
				_t.isShowTypePopover = false;
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
								nodeName: _t.$t('MonitoringSummary.formAllName'),
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
			// 接收组件中传回的设备id
			changePageDeviceId(val) {
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val) {
				var _t = this;
				if (val) {
					_t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val) {
				var _t = this;
				if (val) {
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
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
						//刷新设备占比实时监测饼图
						_t.refresh();
						//刷新设备告警级别实时监测饼图
						_t.refresh2();
						//分页查询最新告警设备列表表格数据
						_t.getData();
					}
				}, rate * 1000);
			}
		},
		created() {
			this.$store.commit('setLoading', true);
			this.refresh();
			this.refresh2();
			this.getData();
			this.getBaseData();
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
<style scoped>
	.equipmentList {
		background-color: #fff;
		margin: 0 10px;
	}

	.equipmentList ul li {
		line-height: 56px;
	}

	.equipmentList ul li span {
		padding-left: 20px;
	}

	.equipmentList ul li:first-child {
		float: left;
	}

	.equipmentList ul li:nth-child(2) {
		float: right;
		margin-right: 20px;
	}

	.equipmentList ul li:last-child {
		float: right;
		margin-right: 10px;
	}
</style>
