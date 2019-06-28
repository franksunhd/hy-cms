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
				<div class="equipmentList_eCharts_left">
					<div id="eChartsText" class="whiteBg" style="width: 100%; height:440px"></div>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="equipmentList_eCharts_right">
					<div id="eChart_monitor" class="whiteBg" style="width: 100%; height:440px"></div>
				</div>
			</el-col>
		</el-row>
		<div class="equipmentList">
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
		<div class="equipmentList marBottom50" style="padding-bottom: 20px">
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
				<el-table-column prop="rackName" :label="$t('MonitoringSummary.columnRackName')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.rackName" placement="top-start">
							<div slot="content">
								<span>{{scope.row.rackName == null ? 'N/A' : scope.row.rackName}}</span>
							</div>
							<span>{{scope.row.rackName == null ? 'N/A' : scope.row.rackName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="rackPosition" :label="$t('MonitoringSummary.columnRackPosition')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="(scope.row.rackPosition)==null ? 'N/A' : (scope.row.rackPosition)+'U'"
												placement="top-start">
							<span v-if="scope.row.rackPosition==null">N/A</span>
							<span>{{scope.row.rackPosition}}</span>
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
	import Box from '../../../components/common/Box';
	import AdministrationTags from '../../../components/monitor/AdministrationTabs';

	export default {
		name: 'monitoringAndControl',
		components: {
			Box,
			AdministrationTags,
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
				organizationList: [], // 树形下拉框的数据
				equipmentData: {}, // 设备告警详情
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
				// 柱形图 option
				barChartsOption: {
					// 标题相关配置
					title: {
						text: this.$t('MonitoringSummary.assetCount'), // 主标题
						top: 5, // 距离顶部
						left: 20, // 左侧距离
						textStyle: { // 主标题属性
							fontSize: 12,
							color: '#333'
						},
						subtextStyle: { // 副标题属性
							fontSize: 12,
							color: '#444'
						},
						itemGap: 10, // 主标题与副标题 上下间距
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					// 工具栏
					toolbox: {
						show: true,
						top: 10,
						right: 30,
						feature: {
							// 还原
							restore: {
								show: true,
								title: this.$t('MonitoringSummary.restore')
							},
							// 下载
							saveAsImage: {
								show: true,
								title: this.$t('MonitoringSummary.download')
							}
						}
					},
					// 柱状图 距离顶部距离
					grid: {
						top: 80,
						right: 20,
						left: 80,
						bottom: 40
					},
					// 图例数据
					legend: {
						top: 10,
						data: []
					},
					xAxis: [],
					// y轴配置
					yAxis: [
						{
							type: 'value',
							label: {
								normal: {
									show: true,
									position: 'top',
									formatter: '{c}'
								}
							}
						}
					],
					// 数据集合
					series: []
				},
				// 饼图 option
				pieChartsOption: {
					// 标题相关设置
					title: {
						text: this.$t('MonitoringSummary.alarmLevel'), // 主标题
						subtext: '', // 副标题
						top: 5, // 标题顶部距离
						left: 20, // 标题左侧距离
						// 主标题文字颜色
						textStyle: {
							fontSize: 12,
							color: '#333'
						},
						// 副标题文字颜色
						subtextStyle: {
							fontSize: 12,
							color: '#444'
						},
						// 主副标题 间距
						itemGap: 10
					},
					// 鼠标移上去
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					// 图例
					legend: {
						orient: 'vertical', // 纵向排列
						right: 20,
						y: 'center',
						data: []
					},
					icon: ['circle'], // 图例为圆
					color: ['#fb6140', '#fdbb41', '#5bd25d', '#24b4c5', '#999999'], // 设置饼图颜色
					// 工具栏
					toolbox: {
						show: true, // 显示工具栏
						top: 10, // 工具栏 顶部位置
						right: 30, // 工具栏 右侧位置
						feature: {
							restore: {
								show: true,
								title: this.$t('MonitoringSummary.restore')
							},
							saveAsImage: {
								show: true,
								title: this.$t('MonitoringSummary.download')
							}
						}
					},
					// 千层饼数据
					series: []
				},
			}
		},
		methods: {
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
							var resData = res.data;
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
							_t.tableData = [];
							_t.options.currentPage = 1;
							_t.options.total = 0;
							break;
					}
				});
			},
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
			clickNodeAlert(val) {
				var _t = this;
				_t.addEdit.organizationName = val.label;
				//_t.addEdit.organizationId = val.id;
				_t.isShowEditPopover = false;
			},
			// 设备占比实时监测 左侧柱形图数据
			refresh2() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/devicetype', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								var resData = res.data;
								var legendArr = new Array(); // 图例数组
								var dataArr = new Array();
								// 差分数据 用于图例和数据显示
								// 设置柱形颜色
								var colorArr = ['','#f96563','#27afcd','#359dfb','#8170f5','#4f5e6c','#60d162','#f4bd5b','#6e84bc','#e471e5'];
								resData.forEach((item) => {
									legendArr.push(item.name);
									// 设置Y轴数据
									var val  = new Object();
									// 给y轴单个柱状设值
									val.value = item.count;
									// 给y轴单个柱状设颜色
									val.itemStyle = {
										color: colorArr[item.type]
									};
									dataArr.push(val);
								});
								// x轴对象
								var xAxis = new Object();
								xAxis.type = 'category';
								xAxis.data = legendArr;
								// y轴对象
								var yAxis = new Object();
								yAxis.type = 'bar';
								yAxis.name = _t.$t('MonitoringSummary.eChartsXAisName');
								yAxis.data = dataArr;
								yAxis.label = {
									normal: {
										show: true,
										position: 'top',
										formatter: '{c}'
									}
								};
								yAxis.barMaxWidth = 50;
								// 动态设置副标题
								_t.barChartsOption.title.subtext = dateFilter(res.requesttime);
								// 设置x轴数据
								_t.barChartsOption.xAxis[0] = xAxis;
								// 设置y轴数据
								_t.barChartsOption.series[0] = yAxis;
								var myChart2 = _t.$echarts.init(document.getElementById("eChartsText"));
								// 使用刚指定的配置项和数据显示图表。
								myChart2.setOption(_t.barChartsOption);
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
			/*设备告警级别占比图*/
			refresh() {
				var _t = this;
				_t.$api.get('/alarm/alarm/dev', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								var resData = res.data === null ? [] : res.data;
								var legendArr = new Array();
								// 将count 转为 饼图需要的 value
								resData.forEach((item) => {
									legendArr.push(item.name);
									if (item.name !== null) {
										item.value = item.count;
									} else {
										item.value = '';
									}
								});
								_t.pieChartsOption.title.subtext = dateFilter(res.requesttime); // 设置副标题
								_t.pieChartsOption.legend.data = legendArr; // 设置 图例数据
								// 设置千层饼
								var series = [];
								for (var i = 0; i < 30; i++) {
									series.push({
										name: _t.$t('MonitoringSummary.eChartTipTitleStatus'),
										type: 'pie',
										itemStyle: {
											normal: {
												label: {show: i > 28},
												labelLine: {
													show: i > 28,
													length: 20
												}
											}
										},
										radius: [i * 3 + 40, i * 3 + 43], //图形大小角度 层级
										data: resData,
									})
								}
								_t.pieChartsOption.series = series;
								var myChart = _t.$echarts.init(document.getElementById("eChart_monitor"));
								myChart.setOption(_t.pieChartsOption);
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
			this.getTableDataValue();
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

	.equipmentList_eCharts_left {
		padding: 10px 0 10px 10px;
	}

	.equipmentList_eCharts_right {
		padding: 10px 10px 10px 0;
	}
</style>
