<template>
	<Box class="grayBg">
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>监测管理</el-breadcrumb-item>
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
				<!--<li>
					<el-select class="fr selectArr" v-model="addEdit.sortValue">
						<el-option v-for="(item,index) in sortArr" :key="index" :label="item.label" :value="item.value" />
					</el-select>
				</li>-->
				<li>
					<el-popover trigger="click" placement="bottom-start" v-model="isShowEditPopover" ref="popover" style="float: left;">
						<el-tree :data="treeData" highlight-current :expand-on-click-node="false" @node-click="clickNodeAlert" :props="defaultProps" />
						<el-input v-model="addEdit.organizationName" style="width: 230px; height: 30px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
					</el-popover>
				</li>
			</ul>
		</div>
		<div class="equipmentList clearfix">
			<el-table :data="tableData" stripe @cell-click="cellClickColumn">
				<el-table-column label="序号" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
                        {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                        </span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态"  header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.status == 99" effect="dark" content="紧急" placement="top-start">
							<span class="iconfont iconfontError">&#xe609;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 66" effect="dark" content="警告" placement="top-start">
							<span class="iconfont iconfontWarn">&#xe608;</span>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 3" effect="dark" content="忽略" placement="top-start">
							<span class="iconfont iconfontDisable">&#xe60a;</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="deviceName" label="设备名称" header-align="left" align="left" />
				<!--<el-table-column prop="alarmContent" label="告警内容" main-width="" header-align="left" align="left" />-->
				<el-table-column prop="lastMonitorTime" label="最新告警时间" header-align="left" align="left" />
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
				<el-table-column prop="roomName" label="机房" header-align="left" align="left" />
				<el-table-column prop="frameName" label="机架" header-align="left" align="left" />
				<el-table-column prop="framePosition" label="位置" header-align="left" align="left" />
				<!--<el-table-column prop="operation" label="操作" header-align="left" align="left" />-->
			</el-table>
			<!--分页-->
			<pages v-if="tableData.length > 10" :total="options.total" :currentPage="options.currentPage" :page-size="options.pageSize" @handleCurrentChangeSub="handleCurrentChange" />
		</div>
		<!--设备告警详情弹出层-->
		<el-dialog class="alarmMessageBox_monitoringAndControl" :title="$t('alarmManagement.addUpdateAlarm')" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="dialogTitle">设备基本信息</div>
			<el-form :model="equipmentData" inline label-position="right" label-width="76px">
				<el-form-item style="width: 33%;" label="设备名称:"></el-form-item>
				<el-form-item style="width: 33%;" label="产品名称:"></el-form-item>
				<el-form-item style="width: 33%;" label="设备IP:"></el-form-item>
				<el-form-item style="width: 33%;" label="UUID:"></el-form-item>
				<el-form-item style="width: 33%;" label="设备厂商:"></el-form-item>
				<el-form-item style="width: 33%;" label="序列号:"></el-form-item>
				<el-form-item style="width: 33%;" label="对象类型:"></el-form-item>
				<el-form-item style="width: 33%;" label="严重级别:"></el-form-item>
				<el-form-item style="width: 33%;" label="告警次数:"></el-form-item>
				<el-form-item style="width: 33%;" label="事件类别:"></el-form-item>
				<el-form-item style="width: 33%;" label="起始时间:"></el-form-item>
				<el-form-item style="width: 33%;" label="最新时间:"></el-form-item>
			</el-form>
			<div class="dialogTitle">告警信息</div>
			<el-form inline label-position="right" label-width="76px">
				<p class="paddingLeft-10"><strong>告警字段</strong></p>
				<el-form-item label="状态:">Down != Up</el-form-item>
				<p class="paddingLeft-10"><strong>当前状态</strong></p>
				<el-form-item style="width: 50%;" label="MAC地址:">EC:F4:BB:C1:0C:CA</el-form-item>
				<el-form-item label="状态:">Down</el-form-item>
				<p class="paddingLeft-10"><strong>附加字段</strong></p>
				<el-form-item label="状态:">Down != Up</el-form-item>
				<p class="paddingLeft-10"><strong>附加信息</strong></p>
				<el-form-item style="width: 60%;" label="产品名称:">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
				<el-form-item style="width: 30%;" label="名称:">NIC.Integrated.1-3-1</el-form-item>
				<br <el-form-item style="width: 30%;" label="自动协商:">Enabled</el-form-item>
				<el-form-item style="width: 30%;" label="链路速度:">Unknown</el-form-item>
				<el-form-item style="width: 30%;" label="MAC地址:">EC:F4:BB:C1:0C:CA</el-form-item>
				<el-form-item label="告警评注:">
					<el-input type="textarea" style="width: 734px;" />
				</el-form-item>
			</el-form>
			<span slot="footer">
        <el-button class="queryBtn" type="primary">忽略告警</el-button>
        <el-button class="queryBtn" type="primary">确认告警</el-button>
        <el-button class="queryBtn" type="primary">转保修</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">取消</el-button>
      </span>
		</el-dialog>
		<!--标签页-->
				<el-tabs v-if="isShowTabBox_tab" v-model="editableTabsValue" type="card" class="whiteBg" id="alarmCurrent-tabs" tab-position="bottom" closable @tab-click="clickTabs" @tab-remove="removeTab">
					<el-tab-pane :key="index" stretch v-for="(item, index) in editableTabs" :name="item.name" :label="item.title">
						<div class="alarmCurrent-btn">
							<!--收起-->
							<span @click="packUp" class="iconfont" style="cursor: pointer;">&#xe61d;</span>
							<!--关闭弹出层-->
							<span @click="closeTab" class="iconfont" style="cursor: pointer;">&#xe615;</span>
						</div>
						<AdministrationTags v-if="isShowTabBox" :pages-id="item.content" />
					</el-tab-pane>
				</el-tabs>
	</Box>
</template>
<script>
	import Box from '../../../components/Box';
	import AdministrationTags from '../../../components/AdministrationTabs';
	export default {
		name: 'monitoringAndControl',
		components: {
			Box,
			AdministrationTags
		},
		data() {
			return {

				/*分页*/
				options: {
					total: 0, //总条数
					currentPage: 1, //当前页码
					pageSize: 10, //显示条数
				},
				editableTabsValue: '1', // 当前页签
				editableTabs: [
					/*{
										name: '1',
										title: '标题1',
										content: '1'
									}*/
				], // 页面集合
				tabIndex: 1, // 页签序号
				sortArr: [{
						label: 'Top10',
						value: 10
					},
					{
						label: 'Top15',
						value: 15
					},
					{
						label: 'Top20',
						value: 20
					},
					{
						label: 'Top30',
						value: 30
					},
				], // 排序

				addEdit: {
					id: '',
					sortValue: 10, // 绑定的pageSize值
					organizationName: '', // 树形下拉框绑定的值
					organizationId: '', // 树形下拉框的绑定的id
				},
				/*表格数据*/
				tableData: [{
					id: '1',
					state: '1',
					DeviceName: 'H3C',
					alarmContent: '告警内容告警内容告警内容告警内容告警内容告警内容告警内容',
					LatestAlarmTime: '2019-01-31',
					StatusSummary: '1 2 3 4',
					ComputerRoom: '苏州',
					rack: 'A8-3',
					location: 'U22',
					operation: '详情'

				}],
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
				isShowEditPopover: false, // 控制树形下拉框的显示隐藏
				dialogVisible: false, // 设备告警详情弹出层
				organizationList: [], // 树形下拉框的数据
				equipmentData: {}, // 设备告警详情
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示

			}
		},

		mounted() {
			this.getData();
			this.drawLine();
			this.drawLine2();
		},
		methods: {
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						alarmDevice:true,
						currentPage: 1,
						pageSize: 10
					})
				}, function(res) {
					switch(res.status) {
						case 200:
							console.log(res);
							var Income1=res.data.list;
							console.log(Income);
							var Income=[];
							for(var i=0;i<Income1.length;i++){
								/*if(Income1[i].status=="11"){
									
								}else if(Income1[i].status=="22"){
									
								}else if(Income1[i].status=="")
								*/
								Income.push({
								deviceName:Income1[i].deviceName,
								roomName:Income1[i].roomName,
								frameName:Income1[i].frameName,
								framePosition:Income1[i].framePosition,
								lastMonitorTime:Income1[i].lastMonitorTime,
								status:Income1[i].status,
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
			drawLine2() {
				var _t = this;
				var myChart2 = this.$echarts.init(document.getElementById("echartText"))
				var option = {
					color: ['#fde33f', '#32cc35 ', '#fb6041', '#975de1', '#40a8ff'],
					title: {
						text: '设备占比实时监测',
						subtext: '2017 年 3 月 12 日 11 时 29 分 29 秒',
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
						data: ['机架/塔式服务器', '小型机', '刀片/刀箱', '网络设备', '存储设备']
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
						data: [{
								value: 335,
								name: '机架/塔式服务器'
							},
							{
								value: 310,
								name: '小型机'
							},
							{
								value: 234,
								name: '刀片/刀箱'
							},
							{
								value: 135,
								name: '网络设备'
							},
							{
								value: 1548,
								name: '存储设备'
							}
						],
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart2.setOption(option);
			},
			drawLine() {
				let myChart = this.$echarts.init(document.getElementById("echart"));
				var option = {
					title: {
						text: '设备告警级别实时监测',
						subtext: '2017 年 3 月 12 日 11 时 29 分 29 秒',
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
						data: ['正常', '紧急', '警告', '离线', '禁止', '忽略']
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
								/*radius: [i * 4 + 40, i * 4 + 43],*/
								data: [{
										value: i * 128 + 80,
										name: '正常'
									},
									{
										value: i * 64 + 160,
										name: '紧急'
									},
									{
										value: i * 32 + 320,
										name: '警告'
									},
									{
										value: i * 16 + 640,
										name: '离线'
									},
									{
										value: i * 8 + 1280,
										name: '禁止'
									},
									{
										value: i * 4 + 2560,
										name: '忽略'
									}
								]
							})
						}

						series[0].markPoint = {
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
						};
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
				if(column.label == '状态') {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}
				// 点击设备名称列
				if(column.label == "设备名称") {
					_t.addTab(row.deviceName, row.id);
				}
				// 点击告警内容列
				if(column.label == "告警内容") {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}
				// 点击最新告警时间列
				if(column.label == "最新告警时间") {
					_t.addTab(row.deviceName, row.id);
					/*console.log('最新告警时间' + row.id);*/
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
					document.getElementById('alarmCurrent-tabs').style.top = '118px';
				}
			},
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('alarmCurrent-tabs').style.top = 'initial';
				_t.editableTabsValue = '';
			},
			// 关闭标签页
			closeTab() {
				var _t = this;
				_t.editableTabsValue = '';
				_t.editableTabs = [];
				_t.tabIndex = 0;
				_t.isShowTabBox_tab = false;
				_t.isShowTabBox = false;
			},
			// 点击标签页
			clickTabs() {
				var _t = this;
				_t.isShowTabBox = true;
				document.getElementById('alarmCurrent-tabs').style.top = '118px';
			},
		}
	}
</script>
<style>
	.alarmMessageBox_monitoringAndControl .el-dialog {
		width: 780px;
		height: 500px;
	}
</style>
<style scoped>
	.equipmentList {
		/*overflow: hidden;*/
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