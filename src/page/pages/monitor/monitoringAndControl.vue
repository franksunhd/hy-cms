<template>
	<Box class="grayBg">
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>监测管理</el-breadcrumb-item>
				<el-breadcrumb-item>监测汇总</el-breadcrumb-item>
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
				<li><span>最新告警设备列表</span></li>
				<!--设备类型-->
				<li>
					<el-popover trigger="click" placement="bottom-start" v-model="isShowTypePopover" ref="popover">
						<el-tree :data="equipmentTypeList" highlight-current :expand-on-click-node="false" @node-click="clickTypeNode" :props="defaultProps" />
						<el-input v-model="formItem.equipmentType" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
					</el-popover>

					<!--<el-select class="fr selectArr" v-model="addEdit.sortValue">
						<el-option v-for="(item,index) in sortArr" :key="index" :label="item.label" :value="item.value" />
					</el-select>-->
				</li>
				<!--<li>
					<el-popover trigger="click" placement="bottom-start" v-model="isShowEditPopover" ref="popover" style="float: left;">
						<el-tree :data="treeData" highlight-current :expand-on-click-node="false" @node-click="clickNodeAlert" :props="defaultProps" />
						<el-input v-model="addEdit.organizationName" style="width: 230px; height: 30px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
					</el-popover>
				</li>-->
			</ul>
		</div>
		<div class="equipmentList clearfix" style="margin-bottom: 50px;">
			<el-table :data="tableData" stripe @cell-click="cellClickColumn">
				<el-table-column width="80px" label="序号" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
                        {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                        </span>
					</template>
				</el-table-column>
				<el-table-column width="80px" prop="status" label="设备状态" header-align="left" align="left">
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
				<el-table-column prop="deviceName" label="设备名称" header-align="left" align="left">
					<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.deviceName" placement="top-start">
									<span>{{scope.row.deviceName}}</span>
								</el-tooltip>
							</template>
				</el-table-column>
				<!--<el-table-column prop="alarmContent" label="告警内容" main-width="" header-align="left" align="left" />-->
				<el-table-column prop="lastMonitorTime" label="最新告警时间" header-align="left" align="left">
					<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.lastMonitorTime | dateFilter" placement="top-start">
									<span>{{scope.row.lastMonitorTime | dateFilter}}</span>
								</el-tooltip>
							</template>
				</el-table-column>
				<!--<el-table-column prop="StatusSummary" label="状态汇总" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="紧急" placement="top-start">
							<span>
                <span class="iconfont iconfontError">&#xe609;</span>
							<span>10</span>
							</span>
						</el-tooltip>
						<el-tooltip effect="dark" content="警告" placement="top-start">
							<span>
                <span class="iconfont iconfontWarn">&#xe608;</span>
							<span>5</span>
							</span>
						</el-tooltip>
						<el-tooltip effect="dark" content="忽略" placement="top-start">
							<span>
                <span class="iconfont iconfontDisable">&#xe60a;</span>
							<span>2</span>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>-->
				<el-table-column prop="roomName" label="机房" header-align="left" align="left">
					<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.roomName" placement="top-start">
									<span>{{scope.row.roomName}}</span>
								</el-tooltip>
							</template>
				</el-table-column>
				<el-table-column prop="frameName" label="机架" header-align="left" align="left">
					<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.frameName" placement="top-start">
									<span>{{scope.row.frameName}}</span>
								</el-tooltip>
							</template>
				</el-table-column>
				<el-table-column prop="framePosition" label="位置" header-align="left" align="left">
					<template slot-scope="scope">
						<!--(Income1[i].framePosition) == null ? null : (Income1[i].framePosition) + 'U',-->
								<el-tooltip effect="dark" :content="(scope.row.framePosition)==null ?null : (scope.row.framePosition)+'U'" placement="top-start">
									<span>{{scope.row.framePosition}}</span>
								</el-tooltip>
							</template>
				</el-table-column>
				<!--<el-table-column prop="operation" label="操作" header-align="left" align="left" />-->
			</el-table>
			<!--分页-->
			<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize" @handleCurrentChangeSub="handleCurrentChange" />
		</div>
		<!--设备告警详情弹出层-->
		<equipmentAlarmDetails ref="alarmDialog" :dialogVisible="dialogVisible" :AssetType="tableDataBase.AssetType" :AlarmSeverity="tableDataBase.AlarmSeverity" :AlarmHandleStatus="tableDataBase.AlarmHandleStatus" @dialogVisibleStatus="dialogVisibleStatus" />
		<!--标签页-->
		<el-tabs v-if="isShowTabBox_tab" v-model="editableTabsValue" type="card" class="whiteBg" id="monitoringAndControl-tabs" tab-position="bottom" closable @tab-click="clickTabs" @tab-remove="removeTab">
			<el-tab-pane :key="index" stretch v-for="(item, index) in editableTabs" :name="item.name" :label="item.title">
				<div class="monitoringAndControl-btn">
					<!--收起-->
					<span @click="packUp" class="iconfont cursorPointer">&#xe64a;</span>
					<!--关闭弹出层-->
					<span @click="closeTab" class="iconfont cursorPointer">&#xe64e;</span>
				</div>
				<AdministrationTags v-if="isShowTabBox" :page-device-id="item.content" />
			</el-tab-pane>
		</el-tabs>
	</Box>
</template>
<script>
	import { dateFilter } from "../../../assets/js/filters";
	import Box from '../../../components/Box';
	import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
	import AdministrationTags from '../../../components/AdministrationTabs';
	export default {
		name: 'monitoringAndControl',
		components: {
			Box,
			AdministrationTags,
			equipmentAlarmDetails
		},
		data() {
			return {

				/*分页*/
				options: {
					total: 0, //总条数
					currentPage: 1, //当前页码
					pageSize: 10, //显示条数
				},
				editableTabsValue: '', // 当前页签
				editableTabs: [], // 页面集合
				tabIndex: 0, // 页签序号
				formItem: {
					/*设备类型*/
					equipmentType: '全部',
					equipmentTypeId: null,
				},
				// 排序
				addEdit: {
					id: '',
					/*sortValue: 10, // 绑定的pageSize值
					organizationName: '', // 树形下拉框绑定的值
					organizationId: '', // 树形下拉框的绑定的id*/
				},
				/*表格数据*/
				tableData: [],
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
				// 设备类型树形下拉框数据
				equipmentTypeList: [],
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowEditPopover: false, // 控制树形下拉框的显示隐藏
				dialogVisible: false, // 设备告警详情弹出层
				organizationList: [], // 树形下拉框的数据
				equipmentData: {}, // 设备告警详情
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示
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

			}
		},

		mounted() {
			this.refresh();
			this.refresh2();
			this.getData();
			this.getBaseData();
			/*this.drawLine();
			this.drawLine2();*/
		},
		methods: {
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				this.dialogVisible = val;
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							type: _t.formItem.equipmentTypeId
						},
						alarmDevice: true,
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							console.log(res)
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
					/*switch(res.status) {
						case 200:
							console.log(res);
							var Income1 = res.data.list;

							var Income = [];
							for(var i = 0; i < Income1.length; i++) {
								Income.push({
									id: Income1[i].id,
									deviceName: Income1[i].deviceName,
									roomName: Income1[i].roomName,
									frameName: Income1[i].frameName,
									framePosition: (Income1[i].framePosition) == null ? null : (Income1[i].framePosition) + 'U',
									lastMonitorTime: dateFilter(Income1[i].lastMonitorTime),
									status: Income1[i].status,
								})
							}

							_t.tableData = Income;
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.count;
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
					}*/
				});
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
							console.log(resData)
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
			clickNodeAlert(val) {
				var _t = this;
				console.log(val);
				_t.addEdit.organizationName = val.label;
				//_t.addEdit.organizationId = val.id;
				_t.isShowEditPopover = false;
			},
			refresh2() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/devicetype', {

				}, function(res) {
					switch(res.status) {
						case 200:
							var Income2 = res.data;
							var Income1 = dateFilter(res.requesttime);
							_t.Income1 = Income1;

							var Income = [];
							for(var i = 0; i < Income2.length; i++) {
								Income.push({
									value: Income2[i].count,
									name: Income2[i].name
								})
							}
							_t.Dincome = Income
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

				})
			},
			drawLine2() {
				var _t = this;
				var myChart2 = this.$echarts.init(document.getElementById("echartText"))
				var option = {
					color: ['#fde33f', '#32cc35 ', '#fb6041', '#975de1', '#40a8ff'],
					title: {
						text: '设备占比实时监测',
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
						name: '设备发现进度',
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
				_t.$api.get('/alarm/alarm/dev', {

				}, function(res) {
					switch(res.status) {
						case 200:
							console.log(res)
							var Income2 = res.data;
							var Income1 = dateFilter(res.requesttime);
							_t.income1 = Income1;
							console.log(_t.income1)
							var Income = [];
							for(var i = 0; i < Income2.length; i++) {
								Income.push({
									value: Income2[i].count,
									name: Income2[i].name
								})
							}
							_t.Dincome1 = Income;
							_t.drawLine();
							console.log(_t.Dincome1)
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
						text: '设备告警级别实时监测',
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
					series: (function() {
						var series = [];
						for(var i = 0; i < 30; i++) {
							series.push({
								name: '当前状态',
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

						/*series[0].markPoint = {
							symbol: 'image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554907158685&di=3ed03cd97d6ac71f30e51dab04c93403&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F19f7a76f9205e1452eb958e75739d95ee05fc5e04a4bf-yHYrfg_fw658',
							symbolSize: series[0].radius[0],
							//effect: {
							show: true,
							animation: true,
							animationThreshold: '2000',
							animationDuration: '1000',

							//scaleSize: 120,
							//symbolSize:'50',
							//symbolOffset:[0,1],
							color: 'rgba(250,225,50,0.8)',

							//},
							data: [{
								x: '50%',
								y: '50%',
								symbol: 'emptyCircle',
								symbolSize: '50',
								itemStyle: {
									shadowBlur: '300',
									shadowColor: 'rgba(250,225,50,0.8)',
									//period: '300',
								},
								label: {
									textBorderWidth: "350",
									textShadowBlur: "200"
								}
							}]
						};*/
						return series;
					})()
				};
				myChart.setOption(option);
				/*setTimeout(function() {
				            function ShowObjProperty(Obj) {
				                var PropertyList = '';
				                var PropertyCount = 0;
				                for(i in Obj) {
				                    if(Obj.i != null)
				                        PropertyList = PropertyList + i + '属性：' + Obj.i + '\r\n';
				                    else
				                        PropertyList = PropertyList + i + '方法\r\n';
				                }
				                alert(PropertyList);
				            }
				            var _ZR = myChart.getZr();
				            console.log(_ZR);
				            ShowObjProperty(_ZR);
				            _ZR.add(new echarts.graphic.Text({
				                hoverable: false,
				                style: {
				                    x: _ZR.getWidth() * 0.5,
				                    y: _ZR.getHeight() / 2 - 10,
				                    textFill: "#666", //设置文字颜色
				                    textFont: 'normal 16px Microsoft YaHei',
				                    text: '恶梦的过去',
				                    textAlign: 'center'
				                }
				            }));
				            var _ZR = myChart.getZr();
				            var text = new echarts.graphic.Text({
				                hoverable: false,
				                style: {
				                    x: _ZR.getWidth() * 0.5,
				                    y: _ZR.getHeight() / 2 - 10,
				                    textFill: "red", //设置文字颜色
				                    textFont: 'normal 16px Microsoft YaHei',
				                    text: '美好的未来',
				                    textAlign: 'center'
				                }
				            })
				            _ZR.add(text);
				            text.attr('style', {
				                text: total
				            })
				        }, 2000);*/
			},
			handleCurrentChange(val) {
				var _t = this;
				_t.options.currentPage = val;
				_t.getData();
			},
			cellClickColumn(row, column) {
				var _t = this;
				// 点击状态列
				/*if(column.label == '状态') {
					console.log(row.id)
					_t.addEdit.id = row.id;
					_t.dialogVisible = true;*/
				// 父组件调用 子组件 获取数据的方法
				/*	_t.$refs.alarmDialog.getData(_t.addEdit.id);
				}*/
				// 点击设备名称列
				if((column.label == '状态') || (column.label == "设备名称") || (column.label == "最新告警时间") || (column.label == "机房") || (column.label == "机架") || (column.label == "位置")) {
					console.log(row.id)
					_t.addTab(row.deviceName, row.id);
				}
				// 点击告警内容列
				/*if(column.label == "告警内容") {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}*/
				// 点击最新告警时间列
				/*if(column.label == "最新告警时间") {
					_t.addTab(row.lastMonitorTime, row.id);
				}*/
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
					document.getElementById('monitoringAndControl-tabs').style.top = '118px';
				}
			},
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('monitoringAndControl-tabs').style.top = 'initial';
			},
			// 关闭标签页
			closeTab() {
				var _t = this;
				_t.isShowTabBox_tab = false;
				document.getElementById('monitoringAndControl-tabs').style.top = 'initial';
				_t.editableTabsValue = '';
				_t.editableTabs = [];
				_t.tabIndex = 0;
			},
			// 点击标签页
			clickTabs() {
				var _t = this;
				_t.isShowTabBox = true;
				document.getElementById('monitoringAndControl-tabs').style.top = '118px';
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
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							var equipmentTypeList = res.data.treeNode.children[0].children;
							equipmentTypeList.unshift({
								nodeName: '全部',
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
		}
	}
</script>
<style>
	#monitoringAndControl-tabs {
		position: fixed;
		bottom: 0;
		right: 20px;
		left: 80px;
		top: 118px;
		z-index: 1100;
	}
	
	#monitoringAndControl-tabs .el-tabs__header.is-bottom {
		margin-top: 0;
		position: absolute;
		bottom: 0;
		left: -24px;
		right: -20px;
	}
	
	#monitoringAndControl-tabs .el-tabs__header.is-bottom .el-tabs__item {
		font-size: 12px;
		position: relative;
	}
	
	#monitoringAndControl-tabs>.el-tabs__content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 40px;
		top: 0;
	}
	
	#monitoringAndControl-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:before {
		content: '';
		width: 10px;
		height: 10px;
		background-color: #dee1e6;
		display: inline-block;
		position: absolute;
		top: 0;
		left: -10px;
		border-radius: 0 10px 0 0;
		box-shadow: 2px -2px 0 #fff;
	}
	
	#monitoringAndControl-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:after {
		content: '';
		width: 10px;
		height: 10px;
		background-color: #dee1e6;
		display: inline-block;
		position: absolute;
		top: 0;
		right: -10px;
		border-radius: 10px 0 0 0;
		box-shadow: -2px -2px 0 #fff;
	}
	
	#monitoringAndControl-tabs .el-tabs__header.is-bottom .el-tabs__nav-scroll {
		padding: 0 20px;
	}
	
	.monitoringAndControl-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 100;
	}
	/*.monitoringAndControl-deviceName{
		width: 800px;
		height: 500px;
	}*/
	
	.closeCheckBox {
		margin-left: 30px;
	}
	
	.closeCheckBox .el-checkbox__label {
		font-size: 12px;
	}
</style>
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