<template>
	<div class="giantScreen_box">
		<!--轮播图-->
		<el-carousel
			class="giantScreen_carousel"
			:loop="loop"
			:autoplay="autoplay"
			arrow="never"
			:initial-index="1"
			indicator-position="none"
			:interval="interval * 1000"
			:height="bannerHeight + 'px'">
			<!--大屏第一屏-->
			<el-carousel-item class="giantScreen_first">
				<!--标签区域-->
				<el-row :gutter="24" class="marginBottom20">
					<!--设备总数-->
					<el-col :span="6">
						<div class="giantScreen_box_top_card">
							<!--左侧背景-->
							<div class="giantScreen_box_top_card_left dark_blue"></div>
							<!--内容区域-->
							<div class="giantScreen_box_top_card_center dark_blue middle clearfix">
								<img class="img_icon" src="../../../assets/img/giantScreen/firstScreen/eq_icon.png">
								<div class="line"></div>
								<div class="contentText">
									<span class="text">{{$t('giantScreen.equipmentAllData')}}</span>
									<span class="number">{{equipmentData.equipmentAllData}}</span>
									<span class="unit">{{$t('giantScreen.unitTai')}}</span>
								</div>
							</div>
							<!--右侧背景-->
							<div class="giantScreen_box_top_card_right dark_blue"></div>
						</div>
					</el-col>
					<!--告警设备数-->
					<el-col :span="6">
						<div class="giantScreen_box_top_card">
							<!--左侧背景-->
							<div class="giantScreen_box_top_card_left light_red"></div>
							<!--内容区域-->
							<div class="giantScreen_box_top_card_center light_red middle clearfix">
								<img class="img_icon" src="../../../assets/img/giantScreen/firstScreen/alarm_eq_icon.png">
								<div class="line"></div>
								<div class="contentText">
									<span class="text">{{$t('giantScreen.equipmentAlarmData')}}</span>
									<span class="number">{{equipmentData.equipmentAlarmData}}</span>
									<span class="unit">{{$t('giantScreen.unitTai')}}</span>
								</div>
							</div>
							<!--右侧背景-->
							<div class="giantScreen_box_top_card_right light_red"></div>
						</div>
					</el-col>
					<!--今日新增告警数-->
					<el-col :span="6">
						<div class="giantScreen_box_top_card">
							<!--左侧背景-->
							<div class="giantScreen_box_top_card_left light_orange"></div>
							<!--内容区域-->
							<div class="giantScreen_box_top_card_center light_orange middle clearfix">
								<img class="img_icon" src="../../../assets/img/giantScreen/firstScreen/alarm_icon.png">
								<div class="line"></div>
								<div class="contentText">
									<span class="text">{{$t('giantScreen.newAlarmCount')}}</span>
									<span class="number">{{equipmentData.newAlarmCount}}</span>
									<span class="unit">{{$t('giantScreen.unitGe')}}</span>
								</div>
							</div>
							<!--右侧背景-->
							<div class="giantScreen_box_top_card_right light_orange"></div>
						</div>
					</el-col>
					<!--今日告警恢复数-->
					<el-col :span="6">
						<div class="giantScreen_box_top_card">
							<!--左侧背景-->
							<div class="giantScreen_box_top_card_left dark_blue"></div>
							<!--内容区域-->
							<div class="giantScreen_box_top_card_center dark_blue middle clearfix">
								<img class="img_icon" src="../../../assets/img/giantScreen/firstScreen/alarm_return_icon.png">
								<div class="line"></div>
								<div class="contentText">
									<span class="text">{{$t('giantScreen.recoverCount')}}</span>
									<span class="number">{{equipmentData.recoverCount}}</span>
									<span class="unit">{{$t('giantScreen.unitGe')}}</span>
								</div>
							</div>
							<!--右侧背景-->
							<div class="giantScreen_box_top_card_right dark_blue"></div>
						</div>
					</el-col>
				</el-row>
				<!--eCharts图表区-->
				<el-row :gutter="24" class="marginBottom20">
					<el-col :span="8" class="giantScreen_pieCharts_box">
						<div class="giantScreen_pieCharts">
							<!--标题区域-->
							<div class="giantScreen_title">
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-left.png">
								<span class="title">{{$t('giantScreen.eChart_PieTitle')}}</span>
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-right.png">
								<img class="triangle" src="../../../assets/img/giantScreen/firstScreen/triangle.png">
							</div>
							<!--饼图区域-->
							<div class="eChart_Monitor_box_bg">
								<div id="eChart_Monitor_alarm" style="height: 450px"></div>
								<div class="eChart_Monitor_leftTopAngle"></div>
								<div class="eChart_Monitor_leftBottomAngle"></div>
								<div class="eChart_Monitor_rightTopAngle"></div>
								<div class="eChart_Monitor_rightBottomAngle"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="16" class="giantScreen_barCharts_box">
						<div class="giantScreen_barCharts">
							<!--标题区域-->
							<div class="giantScreen_title">
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-left.png">
								<span class="title">{{$t('giantScreen.eChart_BarTitle')}}</span>
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-right.png">
								<img class="triangle" src="../../../assets/img/giantScreen/firstScreen/triangle.png">
							</div>
							<!--柱形图区域-->
							<div class="eChart_Monitor_box_bg">
								<div id="eChart_Monitor" class="eChart_Monitor_bg" style="height: 450px"></div>
								<div class="eChart_Monitor_leftBottomAngle"></div>
								<div class="eChart_Monitor_rightBottomAngle"></div>
							</div>
						</div>
					</el-col>
				</el-row>
				<!--表格区域-->
				<el-row :gutter="24">
					<el-col :span="15">
						<div class="giantScreen_table_box">
							<!--标题区域-->
							<div class="giantScreen_title">
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-left.png">
								<span class="title">{{$t('giantScreen.table_alarmTitle')}}</span>
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-right.png">
								<img class="triangle" src="../../../assets/img/giantScreen/firstScreen/triangle.png">
							</div>
							<!--表格区域-->
							<div class="giantScreen_table_Box">
								<el-table class="giantScreen_table" :data="currentAlarmTableData" @cell-click="cellClickColumn">
									<!--序号-->
									<el-table-column width="50" :label="$t('giantScreen.columnIndex')" header-align="center"
																	 align="center">
										<template slot-scope="scope">
											<span>{{scope.$index+(currentAlarmOptions.currentPage - 1) * currentAlarmOptions.pageSize + 1}}</span>
										</template>
									</el-table-column>
									<!--状态-->
									<el-table-column width="90" :label="$t('giantScreen.columnStatus')" header-align="center"
																	 align="center">
										<template slot-scope="scope">
											<!--99-->
											<span v-if="scope.row.status == 99" class="iconfont iconfontError">&#xe64a;</span>
											<!--66-->
											<span v-if="scope.row.status == 66" class="iconfont iconfontWarn">&#xe649;</span>
											<!--33-->
											<span v-if="scope.row.status == 33" class="iconfont iconfontSuccess">&#xe648;</span>
											<!--22-->
											<span v-if="scope.row.status == 22" class="iconfont iconfontDisable">&#xe64f;</span>
											<!--11-->
											<span v-if="scope.row.status == 11" class="iconfont iconfontDisable">&#xe64e;</span>
										</template>
									</el-table-column>
									<!--设备名称-->
									<el-table-column prop="deviceName" :label="$t('giantScreen.columnName')" header-align="left"
																	 align="left"/>
									<!--最新告警时间-->
									<el-table-column width="160" :label="$t('giantScreen.columnTime')" header-align="left" align="left">
										<template slot-scope="scope">
											<span v-if="scope.row.lastMonitorTime === ''">N/A</span>
											<span v-else>{{scope.row.lastMonitorTime | dateFilter}}</span>
										</template>
									</el-table-column>
									<!--机房-->
									<el-table-column width="135" :label="$t('giantScreen.columnRoom')" header-align="left" align="left">
										<template slot-scope="scope">
											<span v-if="scope.row.roomName === null">N/A</span>
											<span v-else>{{scope.row.roomName}}</span>
										</template>
									</el-table-column>
									<!--机柜-->
									<el-table-column width="135" :label="$t('giantScreen.columnRack')" header-align="left" align="left">
										<template slot-scope="scope">
											<span v-if="scope.row.rackName === null">N/A</span>
											<span v-else>{{scope.row.rackName}}</span>
										</template>
									</el-table-column>
									<!--U位-->
									<el-table-column width="60" :label="$t('giantScreen.columnLocation')" header-align="left"
																	 align="left">
										<template slot-scope="scope">
											<span v-if="scope.row.rackPosition === null">N/A</span>
											<span v-else>{{scope.row.rackPosition}}U</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
					</el-col>
					<el-col :span="9">
						<div class="giantScreen_table_box">
							<!--标题区域-->
							<div class="giantScreen_title">
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-left.png">
								<span class="title">{{$t('giantScreen.table_businessTitle')}}</span>
								<img class="icon" src="../../../assets/img/giantScreen/firstScreen/tittle-right.png">
								<img class="triangle" src="../../../assets/img/giantScreen/firstScreen/triangle.png">
							</div>
							<!--表格区域-->
							<div class="giantScreen_table_Box">
								<el-table class="giantScreen_table" :data="businessTableData">
									<!--序号-->
									<el-table-column width="50" :label="$t('giantScreen.columnIndex')" header-align="center"
																	 align="center">
										<template slot-scope="scope">
											<span>{{scope.$index+(businessTableOptions.currentPage - 1) * businessTableOptions.pageSize + 1}}</span>
										</template>
									</el-table-column>
									<!--状态-->
									<el-table-column width="90" :label="$t('giantScreen.columnStatus')" header-align="center"
																	 align="center">
										<template slot-scope="scope">
											<!--99-->
											<span v-if="scope.row.status == 99" class="iconfont iconfontError">&#xe64a;</span>
											<!--66-->
											<span v-if="scope.row.status == 66" class="iconfont iconfontWarn">&#xe649;</span>
											<!--33-->
											<span v-if="scope.row.status == 33" class="iconfont iconfontSuccess">&#xe648;</span>
											<!--22-->
											<span v-if="scope.row.status == 22" class="iconfont iconfontDisable">&#xe64f;</span>
											<!--11-->
											<span v-if="scope.row.status == 11" class="iconfont iconfontDisable">&#xe64e;</span>
										</template>
									</el-table-column>
									<!--业务名称-->
									<el-table-column prop="businessNames" :label="$t('giantScreen.columnBusiness')" header-align="left"
																	 align="left"/>
									<!--最新告警时间-->
									<el-table-column width="160" :label="$t('giantScreen.columnTime')" header-align="left" align="left">
										<template slot-scope="scope">
											<span v-if="scope.row.lastMonitorTime === ''">N/A</span>
											<span v-else>{{scope.row.lastMonitorTime | dateFilter}}</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
					</el-col>
				</el-row>
			</el-carousel-item>
			<!--大屏第二屏 机柜-->
			<el-carousel-item class="giantScreen_second">
				<!--顶部机房-->
				<div class="giantScreen_roomBox">
					<!--左侧-->
					<div class="giantScreen_roomBox_left"></div>
					<!--中间-->
					<div class="giantScreen_roomBox_center">
						<!--左侧平铺背景-->
						<div class="giantScreen_roomBox_isActive_left"></div>
						<!--当前选中背景-->
						<div class="giantScreen_roomBox_isActive"></div>
						<!--右侧平铺背景-->
						<div class="giantScreen_roomBox_isActive_right"></div>
						<!--机房内容区域 加按钮-->
						<div class="giantScreen_roomBox_content">
							<div class="giantScreen_roomBox_content_left">
								<img @click="changePreviousRoom"
										 src="../../../assets/img/giantScreen/secondScreen/room_nab_previous.png">
							</div>
							<div class="giantScreen_roomBox_content_center">
								<!--机房平铺集合 style="left: 265px;" 不可以写在 css类名中 否则获取不到-->
								<ul id="roomBox_ul" class="giantScreen_roomBox_content_center_ul clearfix" style="left: 265px;">
									<li v-for="(item,index) in roomList" :key="index" :title="item.room_name">{{item.room_name}}</li>
								</ul>
							</div>
							<div class="giantScreen_roomBox_content_right">
								<img @click="changeNextRoom" src="../../../assets/img/giantScreen/secondScreen/room_nab_next.png">
							</div>
						</div>
					</div>
					<!--右侧-->
					<div class="giantScreen_roomBox_right"></div>
				</div>
				<!--行数和机柜的绘制-->
				<div class="giantScreen_rackBox_margin">
					<!--行数的绘制-->
					<div class="giantScreen_rackBox_row">
						<div class="giantScreen_rackBox_row_topBg"></div>
						<div class="giantScreen_rackBox_row_centerBg">
							<!--向上移动的行按钮-->
							<div class="giantScreen_rackBox_row_center_nextBtn">
								<img @click="rowRackToUp" src="../../../assets/img/giantScreen/secondScreen/row_next.png">
							</div>
							<!--显示行数的内容区域-->
							<div id="rowClientHeight" class="giantScreen_rackBox_row_center">
								<!--注意这里的style不可以写成类名里边(style="top: 0;") 下边js获取style-->
								<ul id="rowRack" class="giantScreen_rackBox_row_centerRowBg" style="top: 0;">
									<!--这里li要改变样式的话 使用ul > li 下边js会给 li加类名-->
									<li @click="clickRoomRow(val)" v-for="(val) in roomRackNum">第{{val}}行机柜</li>
								</ul>
							</div>
							<!--向下移动的行按钮-->
							<div class="giantScreen_rackBox_row_center_previousBtn">
								<img @click="rowRackToDown" src="../../../assets/img/giantScreen/secondScreen/row_previous.png">
							</div>
						</div>
						<div class="giantScreen_rackBox_row_bottomBg"></div>
					</div>
					<!--机柜的绘制-->
					<div class="giantScreen_rackBox_rackBody"></div>
				</div>
			</el-carousel-item>
		</el-carousel>
		<!--标签页-->
		<AdministrationTags
			@changePageDeviceId="changePageDeviceId"
			@refreshSetInterval="refreshSetInterval"
			@clearSetInterval="clearSetInterval"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId"/>
	</div>
</template>

<script>
	import {dateFilter} from "../../../assets/js/filters";
	import AdministrationTags from '../../../components/monitor/AdministrationTabs';

	export default {
		name: "giantScreen",
		components: {AdministrationTags},
		data() {
			return {
				bannerHeight: '', // 轮播图初始化高度
				interval: 0, // 轮播图切换速度 0 不切换 1 1秒切换一次
				autoplay: true, // 轮播图是否自动切换
				loop: true, // 轮播图是否循环显示
				// 统计集合
				equipmentData: {
					equipmentAllData: 0, // 设备总数
					equipmentAlarmData: 0, // 告警设备数
					newAlarmCount: 0, // 今日新增告警数
					recoverCount: 0, //今日告警恢复数
				},
				// 柱状图初始化
				barChartsOption: {
					// 标题相关配置
					title: {
						top: 5, // 距离顶部
						left: 20, // 左侧距离
						textStyle: { // 主标题属性
							fontSize: 18,
							color: '#333'
						},
						subtextStyle: { // 副标题属性
							fontSize: 14,
							color: '#ccc'
						},
						itemGap: 10, // 主标题与副标题 上下间距
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					// 柱状图 距离顶部距离
					grid: {
						top: 80,
						right: 20,
						left: 80,
						bottom: 40
					},
					icon: ['circle'], // 设置图例为圆形
					color: ['#999999', '#2eb6c1', '#60d162', '#fabb4d', '#f76446', '#3a97ff'], // 柱形数据加图例颜色
					// 图例数据
					legend: {
						top: 10,
						right: 20,
						textStyle: {
							color: '#f9fcff'
						},
						data: []
					},
					// x轴配置
					xAxis: [{
						type: 'category',
						data: [],
					}],
					// y轴配置
					yAxis: [{
						type: 'value',
						axisLabel: {
							show: true,
							textStyle: {
								color: '#2a98de',
								fontSize: 14
							}
						},
						// 取消内容区域 横向 辅助线
						splitLine: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#133a5e'
							}
						}
					}],
					// 柱形图数据集合
					series: []
				},
				// 饼图初始化
				pieChartsOption: {
					title: {
						subtext: '', // 副标题文本
						top: 0, // 顶部距离
						right: 0, // 右侧距离
						subtextStyle: { // 副标题属性
							fontSize: 14,
							color: '#a7f3ff',
						},
						itemGap: 0,
					},
					legend: {
						orient: 'vertical',
						x: 'right',
						y: 'center',
						itemGap: 20,
						textStyle: {
							color: '#f9fcff'
						},
						data: []
					},
					icon: ['circle'], // 设置图例为圆形
					color: ['#f76446', '#fabb4d', '#60d162', '#2eb6ce', '#999999'], // 饼图数据加图例颜色
					series: [
						{
							type: 'pie', //
							radius: ['25%', '50%'], // 圆环区域
							center: ['50%', '50%'], // 饼图位置
							label: { // 单个指向提示
								normal: {
									show: true,
									formatter: '{b}  {d} %'
								}
							},
							labelLine: {
								normal: {
									show: true,
								}
							},
							data: [],
						}
					]
				},
				// 当前告警列表
				currentAlarmTableData: [],
				// 业务告警列表
				businessTableData: [],
				// 当前告警列表分页
				currentAlarmOptions: {
					currentPage: 1, // 当前页码
					pageSize: 5, // 显示条数
				},
				// 当前告警列表分页
				businessTableOptions: {
					currentPage: 1, // 当前页码
					pageSize: 5, // 显示条数
				},
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				pageDeviceId: '',
				pageDeviceName: '',
				// 第二屏
				roomList: [], // 机房列表
				roomThisIndex: 0, // 当前选中机房 dom节点 0没有选中 1第一个节点
				roomRackNum: 0, // 机房下具有的行数
				roomThisRowIndex: 0, // 机柜当前选中行下标
				rowRackClientHeight: 0, // 所在行区域可视区域的高度
				roomId: '', // 当前选中的机房id
			}
		},
		methods: {
			/**
			 * 第一屏
			 */
			// 点击当前告警行
			cellClickColumn(row) {
				var _t = this;
				if (row.device_id !== null) {
					_t.pageDeviceId = row.device_id;
					_t.pageDeviceName = row.deviceName;
					//销毁刷新定时器
					// clearInterval(_t.timer);
					// _t.timer = null;
				}
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
					// _t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val) {
				var _t = this;
				if (val) {
					//销毁刷新定时器
					// clearInterval(_t.timer);
					// _t.timer = null;
				}
			},
			// 今日新增告警数量接口
			getNewAlarmCount() {
				var _t = this;
				_t.$api.get('/alarm/alarm/newAlarm', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.newAlarmCount && res.data.newAlarmCount !== null) {
									_t.equipmentData.newAlarmCount = res.data.newAlarmCount;
								} else {
									_t.equipmentData.newAlarmCount = 0;
								}
							} else {
								_t.equipmentData.newAlarmCount = 0;
							}
							break;
						default:
							_t.equipmentData.newAlarmCount = 0;
							break;
					}
				})
			},
			// 今日告警恢复数
			getRecoverCount() {
				var _t = this;
				_t.$api.get('/alarm/alarm/resumeAlarm', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.recoverCount && res.data.recoverCount !== null) {
									_t.equipmentData.recoverCount = res.data.recoverCount;
								} else {
									_t.equipmentData.recoverCount = 0;
								}
							} else {
								_t.equipmentData.recoverCount = 0;
							}
							break;
						default:
							_t.equipmentData.recoverCount = 0;
							break;
					}
				})
			},
			// 监测概览接口
			getDeviceSortStatus() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/deviceSortStatus', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								var deviceData = res.data.deviceData; // 设备
								var alarmSeverity = res.data.alarmSeverity; // 字典状态
								var equipmentAllData = 0; // 设备总数
								var equipmentAlarmData = 0; // 告警设备数
								// 字段状态 map 转为list
								var alarmSeverityListArr = new Array();
								// 图例
								var legend = new Array();
								for (var key in alarmSeverity) {
									var obj = new Object();
									obj.key = key; // 字典编号 作为 集中状态区分的 关键字
									obj.name = alarmSeverity[key]; // name 为 状态的文案
									obj.type = 'bar'; // 柱状图类型
									obj.stack = obj.name; // 一个 x 上 多个y 合并 stack 名字一样即可
									obj.label = {
										normal: {
											show: true,
											position: 'top',
											formatter: '{a} {c}'
										}
									}; // 设置每条柱形数据上 显示的详细数据
									obj.barMaxWidth = 50;
									obj.data = []; // y 轴数据初始化
									alarmSeverityListArr.push(obj);
									legend.push(alarmSeverity[key]); // 添加图例
								}
								// 柱形图 x轴 数据
								var xDataArr = new Array();
								deviceData.forEach((item) => {
									// 计算 统计设备总数 和 告警设备数
									equipmentAllData += item.all;
									equipmentAlarmData += item['66'] + item['99'];
									// x 轴 文案
									xDataArr.push(item['device_type']);
								});
								alarmSeverityListArr.forEach((keyValue) => {
									deviceData.forEach((data) => {
										keyValue.data.push(data[keyValue['key']]);
									});
								});
								// 给x轴赋值
								var xAxis = new Object();
								xAxis.type = 'category';
								xAxis.data = xDataArr;
								// 设置 x 轴文字颜色
								xAxis.axisLabel = {
									show: true,
									textStyle: {
										color: '#ffc675',
										fontSize: 14,
									},
								};
								xAxis.axisLine = {
									lineStyle: {
										color: '#133a5e'
									}
								};
								// 给x轴赋值
								_t.barChartsOption.xAxis[0] = xAxis;
								// 给 y轴赋值
								_t.barChartsOption.series = alarmSeverityListArr;
								// 图例
								_t.barChartsOption.legend.data = legend;
								// 设备总数
								_t.equipmentData.equipmentAllData = equipmentAllData;
								// 告警设备数 紧急和警告的综合
								_t.equipmentData.equipmentAlarmData = equipmentAlarmData;
							}
							// 绘制柱状图
							var myChart = _t.$echarts.init(document.getElementById("eChart_Monitor"));
							myChart.setOption(_t.barChartsOption);
							break;
						default:
							_t.equipmentData.equipmentAllData = 0;
							_t.equipmentData.equipmentAlarmData = 0;
							break;
					}
				})
			},
			// 当前告警列表
			getCurrentAlarmData() {
				var _t = this;
				// 判断页码
				if (_t.currentAlarmTableData.length < _t.currentAlarmOptions.pageSize) {
					// 返回条数小于每页显示条数 说明最后一页了
					_t.currentAlarmOptions.currentPage = 1;
				} else {
					// 否则下一页
					_t.currentAlarmOptions.currentPage++;
				}
				_t.$api.get('monitor/giantScreen/currentAlarm/pagelist', {
					jsonString: JSON.stringify({
						params: null,
						currentPage: _t.currentAlarmOptions.currentPage,
						pageSize: _t.currentAlarmOptions.pageSize
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.list && res.data.list !== null) {
									var listData = res.data.list;
									listData.forEach((item) => {
										// 判断设备名称是否有数据
										item.deviceName = item.device_name ? item.device_name : null;
										// 判断最新告警时间是否有数据
										item.lastMonitorTime = item.last_monitor_time ? item.last_monitor_time : '';
										// 判断机房是否有数据
										item.roomName = item.room_name ? item.room_name : null;
										// 判断机柜是否有数据
										item.rackName = item.rack_name ? item.rack_name : null;
										// 判断U位是否有数据
										item.rackPosition = item.rack_position ? item.rack_position : null;
									});
									_t.currentAlarmTableData = listData;
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 业务告警列表
			getBusinessAlarmData() {
				var _t = this;
				// 判断页码
				if (_t.businessTableData.length < _t.businessTableOptions.pageSize) {
					// 返回条数小于每页显示条数 说明最后一页了
					_t.businessTableOptions.currentPage = 1;
				} else {
					// 否则下一页
					_t.businessTableOptions.currentPage++;
				}
				_t.$api.get('monitor/giantScreen/businessAlarm/pagelist', {
					jsonString: JSON.stringify({
						params: null,
						currentPage: _t.businessTableOptions.currentPage,
						pageSize: _t.businessTableOptions.pageSize
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								// 状态字典
								var statusMap = new Object();
								if (res.data.statusMap && res.data.statusMap !== null) {
									statusMap = res.data.statusMap;
								}
								// 最新告警时间字典
								var updateTimeMap = new Object();
								if (res.data.updateTimeMap && res.data.updateTimeMap !== null) {
									updateTimeMap = res.data.updateTimeMap;
								}
								if (res.data.list && res.data.list !== null) {
									var listData = res.data.list;
									var _tempList = new Array();
									listData.forEach((item) => {
										// 判断状态是否有数据
										item.status = statusMap[item.id] ? statusMap[item.id] : null;
										// 判断业务名称是否有数据
										item.businessNames = item.business_path ? item.business_path : null;
										// 判断最新告警时间是否有数据
										item.lastMonitorTime = updateTimeMap[item.id] ? updateTimeMap[item.id] : '';

										if (null != item.status && item.status > 33) {
											_tempList.push(item);
										}
									});
									_t.businessTableData = _tempList;
								}
							}
							break;
						default:
							break;
					}
				});
			},
			/*设备告警级别实时监测*/
			refresh() {
				var _t = this;
				_t.$api.get('/alarm/alarm/dev', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.requesttime) {
								_t.pieChartsOption.title.subtext = dateFilter(res.requesttime);
							}
							if (res.data && res.data !== null) {
								var pieChartData = res.data;
								var pieChartDataArr = new Array();
								pieChartData.forEach((item) => {
									if (item.name !== null) {
										var obj = new Object();
										obj.value = item.count;
										obj.name = item.name;
										pieChartDataArr.push(obj);
									}
								});
								_t.pieChartsOption.legend.data = pieChartDataArr;
								_t.pieChartsOption.series[0].data = pieChartDataArr;
								var myChart2 = _t.$echarts.init(document.getElementById("eChart_Monitor_alarm"));
								myChart2.setOption(_t.pieChartsOption);
							}
							break;
						default:
							break;
					}
				})
			},
			/**
			 * 第二屏
			 */
			// 获取机房列表
			getRoomListData() {
				var _t = this;
				_t.$api.get('monitor/giantScreen/serverRoom/all', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.list && res.data.list !== null) {
									_t.roomList = res.data.list;
									// 页面渲染完毕 判断是不是有 机房数据
									if (_t.roomList.length !== 0) {
										_t.$nextTick(function () {
											// 有机房 先清空 全部的 is-active
											var domLi = document.querySelectorAll('#roomBox_ul li');
											if (domLi.length !== 0) {
												var ulClientWidth = 0;
												domLi.forEach((t, index) => {
													// 先清空全部的is-active
													t.className = '';
													ulClientWidth += t.clientWidth;
												});
												ulClientWidth = ulClientWidth - domLi[0].clientWidth + 265;
												document.querySelector('#roomBox_ul').style.width = ulClientWidth + 'px';
												// 有机房 默认选中第一个机房作为 显示条件
												_t.roomThisIndex = 1; // 选中第一个节点
												if (_t.roomList[0] && _t.roomList[0] !== null) {
													// 获取当前选中机房的 机房id
													if (_t.roomList[0].room_id && _t.roomList[0].room_id !== null) {
														_t.roomId = _t.roomList[0].room_id;
													} else {
														_t.roomId = '';
													}
													if (_t.roomList[0].max_row && _t.roomList[0].max_row !== null) {
														// 所在行数
														_t.roomRackNum = _t.roomList[0].max_row;
														if (_t.roomRackNum !== 0) {
															// 先清空全部的 is-active类名
															var rowRackUl = document.querySelectorAll('#rowRack li');
															if (rowRackUl.length !== 0) {
																rowRackUl.forEach((t) => {
																	t.className = '';
																});
															}
															_t.$nextTick(function () {
																_t.roomThisRowIndex = 1;
																if (document.querySelector('#rowRack li:nth-child(' + 1 + ')')) {
																	document.querySelector('#rowRack li:nth-child(' + 1 + ')').className = 'is-active';
																	// 调取设备集合数据
																	_t.getGiantScreenData();
																}
															});
														}
													} else {
														_t.roomRackNum = 0;
													}
												} else {
													_t.roomRackNum = 0;
												}
												document.querySelector('#roomBox_ul li:nth-child(' + 1 + ')').className = 'is-active';
												document.querySelector('#roomBox_ul').style.left = '265px';
											}
										});
									} else {
										// 没有机房
									}
								}
							}
							console.log(res.data)
							break;
						default:
							break;
					}
				});
			},
			// 手动改变下一个机房
			changeNextRoom() {
				var _t = this;
				// 当前机房序号先自加
				_t.roomThisIndex++;
				// 判断下一项是不是最后一项
				if (_t.roomThisIndex > _t.roomList.length) {
					// 自加之后 超出没有下一项了 重新调用机房接口 从头开始
					_t.getRoomListData();
				} else {
					// 有下一项加载下一项 并清除所有的is-active 满足条件之后再加
					var domLi = document.querySelectorAll('#roomBox_ul li');
					if (domLi.length !== 0) {
						domLi.forEach((t) => {
							// 先清空全部的is-active
							t.className = '';
						});
					}
					if (document.querySelector('#roomBox_ul li:nth-child(' + _t.roomThisIndex + ')')) {
						// 给下一个节点添加 选中类
						document.querySelector('#roomBox_ul li:nth-child(' + _t.roomThisIndex + ')').className = 'is-active';
						// ul整体移动选中节点上一个节点的宽度
						var previousDomIndex = _t.roomThisIndex - 1;
						if (document.querySelector('#roomBox_ul li:nth-child(' + previousDomIndex + ')')) {
							var previousClientWidth = document.querySelector('#roomBox_ul li:nth-child(' + previousDomIndex + ')').clientWidth;
							if (document.querySelector('#roomBox_ul')) {
								// 先拿到当前 ul的left定位 再次基础上向左移动 previousClientWidth
								var leftWidth = document.querySelector('#roomBox_ul').style.left;
								leftWidth = Number(leftWidth.split('px')[0]);
								document.querySelector('#roomBox_ul').style.left = (leftWidth - previousClientWidth) + 'px';
							}
						}
						// 根据当前选中的 节点获取机房列表中的机房id
						_t.roomId = _t.roomList[_t.roomThisIndex - 1].room_id;
						// 改变对应机房下的 所在行
						if (_t.roomList[_t.roomThisIndex - 1].max_row !== null) {
							_t.roomRackNum = _t.roomList[_t.roomThisIndex - 1].max_row;
							if (_t.roomRackNum !== 0) {
								// 所在函数不为空时 先清除选中的类名
								var roomRackRow = document.querySelectorAll('#rowRack li');
								if (roomRackRow && roomRackRow.length !== 0) {
									roomRackRow.forEach((t)=>{
										t.className = '';
									});
								}
								_t.roomThisRowIndex = 1;
								document.querySelector('#rowRack li:nth-child(' + _t.roomThisRowIndex + ')').className = 'is-active';
							} else {
								_t.roomThisRowIndex = 0;
							}
						}
						// 改变选中机房之后 调取设备接口信息
						_t.getGiantScreenData();
					}
				}
			},
			// 手动改变上一个机房
			changePreviousRoom() {
				var _t = this;
				// 当前机房序号先自减
				_t.roomThisIndex--;
				// 判断下一项是不是最后一项
				if (_t.roomThisIndex <= 0) {
					// 已经是第一项了 自减之后
					_t.roomThisIndex = 1;
				} else {
					// 有下一项加载下一项 并清除所有的is-active 满足条件之后再加
					var domLi = document.querySelectorAll('#roomBox_ul li');
					if (domLi.length !== 0) {
						domLi.forEach((t) => {
							// 先清空全部的is-active
							t.className = '';
						});
					}
					if (document.querySelector('#roomBox_ul li:nth-child(' + _t.roomThisIndex + ')')) {
						// 上一个节点添加 选中类
						document.querySelector('#roomBox_ul li:nth-child(' + _t.roomThisIndex + ')').className = 'is-active';
						_t.$nextTick(function () {
							// ul整体移动选中节点上一个节点的宽度
							var nextDomIndex = _t.roomThisIndex + 1;
							if (document.querySelector('#roomBox_ul li:nth-child(' + nextDomIndex + ')')) {
								var nextClientWidth = document.querySelector('#roomBox_ul li:nth-child(' + nextDomIndex + ')').clientWidth;
								if (document.querySelector('#roomBox_ul')) {
									// 先拿到当前 ul的left定位 再次基础上向左移动 previousClientWidth
									var leftWidth = document.querySelector('#roomBox_ul').style.left;
									leftWidth = Number(leftWidth.split('px')[0]);
									document.querySelector('#roomBox_ul').style.left = (leftWidth + nextClientWidth) + 'px';
								}
							}
							// 根据当前选中的 节点获取机房列表中的机房id
							_t.roomId = _t.roomList[_t.roomThisIndex - 1].room_id;
							// 改变对应机房下的 所在行
							if (_t.roomList[_t.roomThisIndex - 1].max_row !== null) {
								_t.roomRackNum = _t.roomList[_t.roomThisIndex - 1].max_row;
								if (_t.roomRackNum !== 0) {
									// 所在函数不为空时 先清除选中的类名
									var roomRackRow = document.querySelectorAll('#rowRack li');
									if (roomRackRow && roomRackRow.length !== 0) {
										roomRackRow.forEach((t)=>{
											t.className = '';
										});
									}
									// 所在行数不为空时 选中第一行
									_t.roomThisRowIndex = 1;
									document.querySelector('#rowRack li:nth-child(' + _t.roomThisRowIndex + ')').className = 'is-active';
								} else {
									_t.roomThisRowIndex = 0;
								}
							}
							// 改变选中机房之后 调取设备接口信息
							_t.getGiantScreenData();
						});
					}
				}
			},
			// 手动改变行数向下移动
			rowRackToDown() {
				var _t = this;
				if (_t.roomRackNum === 0) {
					_t.$alert('没有所在行机柜', _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn',
						type: 'warning'
					}).then(() => {
						return false;
					}).catch(() => {
						return false;
					});
				} else {
					// 所在行机柜不为空 判断 所在行机柜列表高度是否超出 可视区域高度
					var rowRack = document.getElementById('rowRack');
					if (rowRack) {
						// 机柜列表 高度
						var rowRackHeight = rowRack.clientHeight;
						// 先获取 移动区域的 ul 的top值 top绝对值和可视区域高度的 之和 超出 ul的可视区域之后 点击向上效果无效
						var topNum = Number(rowRack.style.top.split('px')[0]);
						if (Math.abs(topNum) + _t.rowRackClientHeight <= rowRackHeight) {
							// 机柜列表的高度超出可视区域的高度
							if (rowRackHeight > _t.rowRackClientHeight) {
								// 超出可视区域 点击一次移动距离 50px
								if (rowRackHeight - _t.rowRackClientHeight >= 50) {
									// 可移动距离 超出50px 也只是移动一个 50px 的距离
									if (rowRack && rowRack.style.top !== '') {
										var topValue = Number(rowRack.style.top.split('px')[0]);
										rowRack.style.top = (topValue - 50) + 'px';
									}
								} else {
									// 可移动距离不足50px 按照不足50计算
									if (rowRack && rowRack.style.top !== '') {
										var topValueNum = Number(rowRack.style.top.split('px')[0]);
										rowRack.style.top = (topValueNum - (rowRackHeight - _t.rowRackClientHeight)) + 'px';
									}
								}
							} else {
								// 没有超出可视区域 不会进行ul的位置移动
							}
						}
					}
				}
			},
			// 手动改变行数向上移动
			rowRackToUp() {
				var _t = this;
				if (_t.roomRackNum === 0) {
					_t.$alert('没有所在行机柜', _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn',
						type: 'warning'
					}).then(() => {
						return false;
					}).catch(() => {
						return false;
					});
				} else {
					// 所在行机柜不为空 判断 所在行机柜列表高度是否超出 可视区域高度
					var rowRack = document.getElementById('rowRack');
					if (rowRack) {
						// 获取 机柜列表的 top值 判断绝对值 0 到 50之间 top为0 大于50 移动50px
						var topValue = Number(rowRack.style.top.split('px')[0]);
						if (Math.abs(topValue) >= 50) {
							rowRack.style.top = topValue + 50 + 'px';
						} else if (Math.abs(topValue) >= 0 && Math.abs(topValue) < 50) {
							rowRack.style.top = '0px';
						}
					}
				}
			},
			// 点击所在行
			clickRoomRow(index) {
				var _t = this;
				// 注意 index是从1开始的  判断点击的是否是当前选中
				var isActiveAll = document.querySelectorAll('#rowRack li');
				var indexNum = '';
				if (isActiveAll) {
					isActiveAll.forEach((t, i) => {
						if (t.className.indexOf('is-active') !== -1) {
							indexNum = i;
						}
					});
					// 点击不是自身
					if (indexNum !== '' && (indexNum + 1) !== index) {
						isActiveAll.forEach((t, i) => {
							t.className = '';
						});
						// 获取当前 选中的 is-active的下标 点击不是当前选中节点
						document.querySelector('#rowRack li:nth-child(' + index + ')').className = 'is-active';
						// 给选中行赋值
						_t.roomThisRowIndex = index;
						// 改变所在行之后 调取设备接口信息
						_t.getGiantScreenData();
					}
				}
			},
			// 获取机房和机柜行所在的 设备接口
			getGiantScreenData() {
				var _t = this;
				// 打印机房id 所在行
				// console.log(_t.roomId, _t.roomThisRowIndex);
				// _t.$api.get('monitor/giantScreen/rack/pagelist',{
				// 	jsonString: JSON.stringify({
				// 		params:{
				// 			roomId:"fe1b29c8e1f14fddb4aab9bfebea217d",
				// 			rackRow:1
				// 		},
				// 		currentPage:1,
				// 		pageSize:10
				// 	})
				// },function(res){
				// 	switch (res.status){
				// 		case 200:
				// 			break;
				// 		default:
				// 			break;
				// 	}
				// });
			},
			/**
			 * 计算
			 */
			// 计算屏幕的高度
			setSize() {
				var _t = this;
				var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				_t.bannerHeight = height;
				if (height) {
					// 计算 eChart 图表剩余高度
					var eChartsHeight = 0;
					/**
					 * 固定的 布局高度 523
					 * 轮播图 上下各 20
					 * 四个展示项 height 60,marginBottom 20
					 * 表格区域 5条 324
					 * 图表区 marginBottom 20 title 23
					 * 图表区域 上下 padding 各18 共 36
					 */
					eChartsHeight = height - (60 + 20 + 40) - 324 - 20 - 23 - (18 * 2);
					if (document.getElementById('eChart_Monitor')) {
						document.getElementById('eChart_Monitor').style.height = eChartsHeight + 'px';
					}
					if (document.getElementById('eChart_Monitor_alarm') !== null) {
						document.getElementById('eChart_Monitor_alarm').style.height = eChartsHeight + 'px';
					}
					// 屏幕改变时 重新绘制 eCharts 图表
					window.onresize = function () {
						if (document.getElementById("eChart_Monitor") && document.getElementById("eChart_Monitor_alarm")) {
							var myChart = _t.$echarts.init(document.getElementById("eChart_Monitor"));
							var myChart2 = _t.$echarts.init(document.getElementById("eChart_Monitor_alarm"));
							var timer = setTimeout(function () {
								myChart.resize();
								myChart2.resize();
								clearTimeout(timer);
							}, 100);
						}
					}
				}
				// 监听 所在行机柜 可视区域高度
				_t.$nextTick(function () {
					if (document.getElementById('rowClientHeight')) {
						// 所在行机柜可视区域的高度
						_t.rowRackClientHeight = document.getElementById('rowClientHeight').clientHeight;
					}
				});
			},
			//页面定时刷新
			refreshPage() {
				var _t = this;
				var rate = 5 * 60; //默认30秒
				var interval = 2 * 60; // 默认 屏幕切换 2分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-ScreenDataRefresh'];
					var intervalMap = refreshRateJson['RefreshRate-ScreenShuffling'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
						}
					}
					// 大屏切换速度
					if (null != intervalMap && undefined != intervalMap) {
						interval = intervalMap.dictionaryCode;
						if (null == interval || '' == interval || undefined == interval) {
							interval = 2 * 60; //都为空时默认 2分钟
						}
					}
					_t.interval = interval;
				}
				// 定时器防止密集访问
				_t.timer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.lastTime = nowTime;
						_t.getDeviceSortStatus();
						_t.getNewAlarmCount();
						_t.getRecoverCount();
						_t.refresh();
						_t.getCurrentAlarmData();
						_t.getBusinessAlarmData();
						_t.getRoomListData();
					}
				}, rate * 1000);
			}
		},
		mounted() {
			var _t = this;
			_t.setSize();
			window.addEventListener('resize', function () {
				_t.setSize();
			}, false);
			_t.refreshPage();
		},
		created() {
			var _t = this;
			_t.getDeviceSortStatus();
			_t.getNewAlarmCount();
			_t.getRecoverCount();
			_t.refresh();
			_t.getCurrentAlarmData();
			_t.getBusinessAlarmData();
			_t.getRoomListData();
		},
		beforeDestroy() {
			var _t = this;
			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style scoped>
	.giantScreen_box {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		background-color: #042c4b;
	}

	.giantScreen_first {
		padding: 20px;
		background: url("../../../assets/img/giantScreen/firstScreen/bg.png") repeat-x;
		background-size: 100% 100%;
	}

	.giantScreen_box_top_card {
		width: 100%;
		height: 60px;
		line-height: 60px;
		display: flex;
		flex-direction: row;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_left,
	.giantScreen_box_top_card .giantScreen_box_top_card_center,
	.giantScreen_box_top_card .giantScreen_box_top_card_right {
		height: 60px;
		line-height: 44px;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_left {
		width: 17px;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center {
		flex: 1;
		padding: 8px 13px;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > img,
	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.line,
	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.contentText {
		vertical-align: middle;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.line {
		width: 30px;
		display: inline-block;
		box-sizing: border-box;
		line-height: 44px;
		height: 44px;
		border-right: 1px solid #fff;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.contentText {
		display: inline-block;
		line-height: 44px;
		height: 44px;
		float: right;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.contentText > span.text {
		font-size: 16px;
		display: inline-block;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.contentText > span.number {
		font-size: 24px;
		margin: 0 8px;
		display: inline-block;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center > div.contentText > span.unit {
		font-size: 14px;
		display: inline-block;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_right {
		width: 13px;
	}

	/*蓝色卡*/
	.giantScreen_box_top_card .giantScreen_box_top_card_left.dark_blue {
		background: url("../../../assets/img/giantScreen/firstScreen/eq_bg_left.png") no-repeat;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center.dark_blue {
		background: url("../../../assets/img/giantScreen/firstScreen/eq_all_bg.png");
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_right.dark_blue {
		background: url("../../../assets/img/giantScreen/firstScreen/eq_bg_right.png") no-repeat;
	}

	/*红色卡*/
	.giantScreen_box_top_card .giantScreen_box_top_card_left.light_red {
		background: url("../../../assets/img/giantScreen/firstScreen/alarm_bg_left.png") no-repeat;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center.light_red {
		background: url("../../../assets/img/giantScreen/firstScreen/alarm_eq_bg.png");
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_right.light_red {
		background: url("../../../assets/img/giantScreen/firstScreen/alarm_bg_right.png") no-repeat;
	}

	/*橘色卡*/
	.giantScreen_box_top_card .giantScreen_box_top_card_left.light_orange {
		background: url("../../../assets/img/giantScreen/firstScreen/newAlarm_left_bg.png") no-repeat;
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_center.light_orange {
		background: url("../../../assets/img/giantScreen/firstScreen/alarm_bg.png");
	}

	.giantScreen_box_top_card .giantScreen_box_top_card_right.light_orange {
		background: url("../../../assets/img/giantScreen/firstScreen/newAlarm_right_bg.png") no-repeat;
	}

	.giantScreen_title {
		display: inline-block;
		position: relative;
		margin-left: 20px;
	}

	.giantScreen_title > .title {
		font-size: 16px;
		color: #a7f3ff;
		display: inline-block;
		border-bottom: 2px solid #fe7b33;
		margin: 0 8px;
		padding-bottom: 3px;
		position: relative;
		top: -3px;
	}

	.giantScreen_title > img.icon {
		display: inline-block;
		height: 19px;
		margin-top: 4px;
	}

	.giantScreen_title > .triangle {
		width: 12px;
		position: absolute;
		left: 50%;
		right: 0;
		bottom: -7px;
		transform: translateX(-50%);
		z-index: 1;
	}

	.eChart_Monitor_box_bg {
		background: url("../../../assets/img/giantScreen/firstScreen/card_bg.png") repeat-x;
		background-size: 100% 100%;
		padding: 18px;
		position: relative;
	}

	.eChart_Monitor_bg {
		background-color: #041c36;
	}

	.eChart_Monitor_leftTopAngle {
		width: 7px;
		height: 8px;
		position: absolute;
		left: 0;
		top: 0;
		background: url("../../../assets/img/giantScreen/firstScreen/left_top.png") no-repeat;
	}

	.eChart_Monitor_rightTopAngle {
		width: 9px;
		height: 10px;
		position: absolute;
		right: 0;
		top: 0;
		background: url("../../../assets/img/giantScreen/firstScreen/right-top.png") no-repeat;
	}

	.eChart_Monitor_leftBottomAngle {
		width: 9px;
		height: 10px;
		position: absolute;
		left: 0;
		bottom: 0;
		background: url("../../../assets/img/giantScreen/firstScreen/left_bottom.png") no-repeat;
	}

	.eChart_Monitor_rightBottomAngle {
		width: 7px;
		height: 8px;
		position: absolute;
		right: 0;
		bottom: 0;
		background: url("../../../assets/img/giantScreen/firstScreen/right-bootom.png") no-repeat;
	}

	.giantScreen_table_Box {
		background: url("../../../assets/img/giantScreen/firstScreen/card_bg.png") repeat-x;
		background-size: 100% 100%;
		padding: 18px;
		position: relative;
	}
</style>
<style>
	.giantScreen_table {
		background: url("../../../assets/img/giantScreen/firstScreen/table_bg.png") repeat-x;
		background-size: 100% 100%;
	}

	.giantScreen_table.el-table {
		border: none;
		height: 265px;
	}

	.giantScreen_table.el-table .el-table__empty-block {
		height: 230px;
	}

	.giantScreen_table.el-table .el-table__header-wrapper,
	.giantScreen_table.el-table .el-table__header-wrapper thead tr,
	.giantScreen_table.el-table .el-table__body-wrapper tbody tr,
	.giantScreen_table.el-table .el-table__header-wrapper thead tr th,
	.giantScreen_table.el-table .el-table__body-wrapper tbody tr:hover td {
		background: none;
	}

	.giantScreen_table.el-table .el-table__header-wrapper thead tr th {
		height: 34px;
		line-height: 34px;
		color: #008fff;
		font-size: 14px;
	}

	.giantScreen_table.el-table .el-table__body-wrapper tbody tr td {
		color: #c6e0f1;
		font-size: 12px;
	}

	.giantScreen_table.el-table th.is-leaf,
	.giantScreen_table.el-table td {
		border-bottom: 1px solid #126698;
	}

	/*大屏关于标签页弹出层*/
	.giantScreen_box #tabs-Box-tabs {
		left: 0;
	}

	.giantScreen_box #tabs-Box-tabs::before {
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		top: -52px;
		height: 52px;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
<style scoped>
	.giantScreen_second {
		position: relative;
		padding: 0;
		background: url("../../../assets/img/giantScreen/secondScreen/carousel_bg.jpg") repeat-x;
		background-size: 100% 100%;
	}

	.giantScreen_roomBox {
		width: 995px;
		margin: 0 auto;
		height: 47px;
		display: flex;
	}

	.giantScreen_roomBox_left {
		width: 34px;
		height: 47px;
		display: inline-block;
		background: url("../../../assets/img/giantScreen/secondScreen/room_line_left.png") no-repeat;
	}

	.giantScreen_roomBox_center {
		flex: 1;
		position: relative;
		display: flex;
	}

	.giantScreen_roomBox_isActive_left,
	.giantScreen_roomBox_isActive_right {
		border-bottom: 2px solid #26a0ff;
		flex: 1;
	}

	.giantScreen_roomBox_isActive {
		width: 216px;
		height: 67px;
		overflow: visible;
		background: url("../../../assets/img/giantScreen/secondScreen/room_line_active.png") no-repeat;
	}

	.giantScreen_roomBox_right {
		width: 44px;
		height: 47px;
		display: inline-block;
		background: url("../../../assets/img/giantScreen/secondScreen/room_line_right.png") no-repeat;
	}

	.giantScreen_roomBox_content {
		position: absolute;
		left: 52px;
		right: 52px;
		display: flex;
	}

	.giantScreen_roomBox_content_left {
		width: 11px;
		height: 47px;
		line-height: 47px;
		display: inline-block;
	}

	.giantScreen_roomBox_content_center {
		flex: 1;
		margin: 0 24px;
		overflow: hidden;
		position: relative;
	}

	.giantScreen_roomBox_content_right {
		width: 11px;
		height: 47px;
		line-height: 47px;
		display: inline-block;
	}

	.giantScreen_roomBox_content_left > img,
	.giantScreen_roomBox_content_right > img {
		cursor: pointer;
	}

	.giantScreen_roomBox_content_center_ul {
		position: absolute;
	}

	.giantScreen_roomBox_content_center_ul li {
		float: left;
		width: 120px;
		padding: 0 10px;
		color: #a7f3ff;
		cursor: pointer;
		text-align: center;
		height: 47px;
		line-height: 47px;
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.giantScreen_roomBox_content_center_ul li.is-active {
		width: 216px !important;
		height: 67px;
		line-height: 67px;
		font-size: 24px;
		padding: 0 25px;
		color: #feba77;
	}

	.giantScreen_rackBox_margin {
		position: absolute;
		top: 97px;
		bottom: 60px;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: row;
	}

	.giantScreen_rackBox_row {
		width: 184px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.giantScreen_rackBox_row_topBg {
		width: 100%;
		height: 97px;
		background: url("../../../assets/img/giantScreen/secondScreen/left_nav_top.png") no-repeat;
	}

	.giantScreen_rackBox_row_centerBg {
		flex: 1;
		border-right: 2px solid #26a0ff;
		text-align: center;
		display: flex;
		flex-direction: column;
		padding-bottom: 20px;
	}

	.giantScreen_rackBox_row_center {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.giantScreen_rackBox_row_centerRowBg {
		float: left;
		position: absolute;
		left: 0;
		right: 0;
	}

	.giantScreen_rackBox_row_center_nextBtn {
		margin-bottom: 12px;
	}

	.giantScreen_rackBox_row_center_previousBtn {
		margin-top: 12px;
	}

	.giantScreen_rackBox_row_center_nextBtn > img,
	.giantScreen_rackBox_row_center_previousBtn > img {
		cursor: pointer;
	}

	.giantScreen_rackBox_row_bottomBg {
		width: 100%;
		height: 34px;
		background: url("../../../assets/img/giantScreen/secondScreen/left_nav_bottom.png") no-repeat;
	}

	.giantScreen_rackBox_row_centerRowBg > li {
		width: 144px;
		height: 38px;
		line-height: 38px;
		margin: 0 auto 12px;
		color: #a7f3ff;
		font-size: 14px;
		cursor: pointer;
		background: url("../../../assets/img/giantScreen/secondScreen/row_btn_bg.png") no-repeat;
	}

	.giantScreen_rackBox_rackBody {
		margin-left: 27px;
		flex: 1;
	}

	.giantScreen_carousel {
		overflow: hidden;
	}

	#rowRack li.is-active {
		color: #feba77;
	}
</style>
