<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceDiscovery')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.DeviceManualDetection')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="BeganToSee-col clearfix">
			<div class="BeganToSee-return" @click="BeganToSeeReturn">
				<i class="el-icon-back"></i>
				<span class="paddingLeft-10">{{$t('DeviceManualDetection.ReturnToDeviceManualDiscovery')}}</span>
			</div>
			<div class="BeganToSee-IncompleteDiscovery" @click="UncompletedDiscoveryTask">
				<el-popover placement="bottom" width="400" v-model="visible2" trigger="click"
										popper-class="BeganToSee_unfinished">
					<div class="ListOfUncompletedDiscoveries-process">
						<h3>{{$t('DeviceManualDetection.showProcess')}}</h3>
						<ul v-for="(item,index) in process" :key="item.sn" @click="handClickprocess(item.sn)">
							<li>{{item.id}}</li>
							<li>{{item.date |dateFilter}}</li>
							<li>{{item.name}}</li>
						</ul>
					</div>
					<el-button slot="reference">
						{{$t('DeviceManualDetection.UncompletedDiscoveryTask')}}
					</el-button>
				</el-popover>
			</div>
		</div>
		<div class="padding10 flex_box">
			<div id='echart_Beg' class="echart_Beg"></div>
			<div id="table_flex" class="table_flex"
					 v-loading="loading"
					 :element-loading-text="$t('public.loading')"
					 element-loading-spinner="el-icon-loading"
					 element-loading-background="rgba(0, 0, 0, 0.3)">
				<div class="BeganToSee-right">
					<div class="BeganToSee-button">
						<div class="marginBottom20 clearfix">
							<div class="BeganToSee-right-list">
								{{BeganToSee}}{{$t('DeviceManualDetection.ListOfDevicesFound')}}
							</div>
							<el-button id="BeganToSee_addEquipment" class="BeganToSee-addEquipment" @click="addEquipment" :disabled="disabled">
								<span class="iconfont fs14">&#xe6a1;</span>
								{{$t('DeviceManualDetection.AddTheSelectedDevice')}}
							</el-button>
							<!--
							<el-button
								class="BeganToSee-exportEquipment" @click="DiscoveryExport" :disabled="disabledExport">
								<span class="iconfont fs14">&#xe6a8;</span>
								{{$t('DeviceManualDetection.DiscoveryExport')}}
							</el-button>
							-->
						</div>
						<!--表格-->
						<el-table
							class="beginToSee"
							border :data="tableData"
							:height="heightTable"
							style="width: 100%; margin-top: 16px;"
							@selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55" :selectable="selectable"/>
							<el-table-column :label="$t('public.index')" header-align="left" width="80" align="left">
								<template slot-scope="scope">
									<span>
										{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="ip" width="150" label-class-name="disColunm">
								<template slot="header">
									<div class="table-column">
										{{$t('DeviceManualDetection.ipAddress')}}
										<span class="ipSpan">
											<i id="AscTop" class="el-icon-caret-top ipAsc " @click="IpClick(true)"></i>
											<i id="DescBottom" class="el-icon-caret-bottom ipDesc" @click="IpClick(false)"></i>
										</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="manufacturerModel" :label="$t('DeviceManualDetection.BrandModels')"
															 show-overflow-tooltip/>
							<el-table-column show-overflow-tooltip>
								<template slot="header">
									<div class="table-column">
										{{$t('DeviceManualDetection.FoundThatTheState')}}
										<span class="ipSpan">
											<i id="disAscTop" class="el-icon-caret-top ipAsc"
												 @click="discoveryClick(true)"></i>
											<i id="disDescBottom" class="el-icon-caret-bottom ipDesc"
												 @click="discoveryClick(false)"></i>
										</span>
									</div>
								</template>
								<template slot-scope="scope">
									<span v-if="scope.row.discovery=='未发现'" style="color:#fb6140;">{{scope.row.discovery}}</span>
									<span v-if="scope.row.discovery=='待发现'" style="color:#fdbb41;">{{scope.row.discovery}}</span>
									<span v-if="scope.row.discovery=='成功'" style="color:#5bd25d;">{{scope.row.discovery}}</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('DeviceManualDetection.describe')" show-overflow-tooltip>
								<template slot-scope="scope">
									<span v-if="describes[scope.row.ip]=='-1'">{{$t('DeviceManualDetection.existing')}}</span>
									<span v-if="describes[scope.row.ip]=='1'">{{$t('DeviceManualDetection.AddASuccess')}}</span>
									<span v-if="describes[scope.row.ip]=='0'">{{$t('DeviceManualDetection.AddFailure')}}</span>
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
				</div>
			</div>
		</div>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {dateFilterSeconds, dateFilter} from "../../../../assets/js/filters";

	export default {
		name: 'BeganToSee',
		components: {
			Box
		},
		data() {
			return {
				loading:true,
				heightTable: '0px',
				//禁用添加已选设备按钮
				disabled: true,
				disabledExport: true,
				BeganToSee: '',
				//表格
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				//页面刷新时间
				optionss: [{
					value: '1',
					label: '不刷新'
				}, {
					value: '2',
					label: '1秒'
				}, {
					value: '3',
					label: '3秒'
				}, {
					value: '4',
					label: '5秒'
				}, {
					value: '5',
					label: '10秒'
				}, {
					value: '6',
					label: '15秒'
				}, {
					value: '7',
					label: '30秒'
				}, {
					value: '8',
					label: '1分钟'
				}],
				value: '',
				tableData: [],
				/*描述*/
				describes: {},
				multipleSelection: [],
				ips: [],
				Dincome: [],
				Dincome2: '',
				//未完成任务列表弹出层
				visible2: false,
				process: [],
				val: '',
				/*sn码存取*/
				optionsData: '',
				/*点击饼图获取下标*/
				paramStatus: '',
				/*待发现设备数*/
				stayDevice: '',
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				//排序
				sort: null,
				orderIp: '',
				orderDiscovery: '',
				valIpFlag: '', // 标识ip排序
				discoveryAscFlag: '', //标识发现状态排序
			}
		},
		created() {
			var _t = this;
			var clientHeight = document.body.clientHeight;
			_t.$nextTick(function () {
				var echart_Beg = document.getElementById('echart_Beg');
				var table_flex = document.getElementById('table_flex');
				if (echart_Beg) {
					echart_Beg.style.height = clientHeight - 173 + 'px';
				}
				if (table_flex) {
					table_flex.style.height = clientHeight - 173 + 'px';
				}

				_t.heightTable = clientHeight - 325 + 'px';
				_t.getData();
				_t.getSnData();
			});
		},

		methods: {
			//ip排序
			IpClick(val) {
				var _t = this;
				var IPASC = document.getElementById('AscTop');
				var IPDESC = document.getElementById('DescBottom');
					if(val===true){
						var IpAsc = IPASC.classList.contains('ipDescEsc');
						if(IpAsc===false){
							IPASC.classList.add('ipDescEsc');
							IPDESC.classList.remove('ipDescEsc');
							_t.orderIp = 'ipAsc';
							_t.$nextTick(function(){
								_t.getData();
							});
						}else{
							IPASC.classList.remove('ipDescEsc');
						}
					}else{
						var IpDesc = IPDESC.classList.contains('ipDescEsc');
						if(IpDesc===false){
							IPDESC.classList.add('ipDescEsc');
							IPASC.classList.remove('ipDescEsc');
							_t.orderIp = 'ipDesc';
							_t.$nextTick(function(){
								_t.getData();
							});
						}else{
							IPDESC.classList.remove('ipDescEsc');
						}
					}
			},
			//发现状态排序
			discoveryClick(val) {
				var _t = this;
				var DiscoveryAsc = document.getElementById('disAscTop');
				var DiscoveryDesc = document.getElementById('disDescBottom');
				if(val===true){
					var DisAsc = DiscoveryAsc.classList.contains('ipDescEsc');
					if(DisAsc===false){
						DiscoveryAsc.classList.add('ipDescEsc');
						DiscoveryDesc.classList.remove('ipDescEsc');
						_t.orderDiscovery = 'discoveryAsc';
						_t.$nextTick(function(){
							_t.getData();
						});
					}else{
						DiscoveryAsc.classList.remove('ipDescEsc');
					}
				}else{
					var DisDesc = DiscoveryDesc.classList.contains('ipDescEsc');
					if(DisDesc===false){
						DiscoveryDesc.classList.add('ipDescEsc');
						DiscoveryAsc.classList.remove('ipDescEsc');
						_t.orderDiscovery = 'discoveryDesc';
						_t.$nextTick(function(){
							_t.getData();
						});
					}else{
						DiscoveryDesc.classList.remove('ipDescEsc');
					}
				}
			},
			// 查询表格中状态对应的数据值
			getSnData(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AssetType"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 获取对应的状态值
							_t.tableDataBase = res.data;
							var process = [];
							var index = 0;
							for (var key in resData) {
								index++;
								process.push({
									"date": resData[key].time,
									"name": _t.tableDataBase.AssetType[resData[key].type],
									"sn": key,
									"id": index
								})
							}
							_t.process = process;
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
			//未完成的发现任务
			UncompletedDiscoveryTask() {
				var _t = this;
				_t.$api.post('/asset/discovery/history', {}, function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data === null ? [] : res.data;
							_t.getSnData(resData);
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
			handClickprocess(val) {
				this.val = val;
				this.visible2 = false;
				this.getData();
			},
			/*定时器*/
			timer() {
				//获取设备发现接口的频率
				var rate = 1; //默认1秒
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateMap = JSON.parse(refreshRateMap);
					var rateMap = refreshRateMap['RefreshRate-Discovery'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 1; //都为空时默认1秒
						}
					}
				}
				var _t = this;
				return setTimeout(() => {
					_t.getData()
				}, 1000 * rate)
			},
			//刷新接口
			getData() {
				var _t = this;
				var optionsData2 = new Object();
				optionsData2 = _t.$route.params.type ? _t.$route.params.type : JSON.parse(localStorage.getItem('hy-typesone'));
				var optionsData = new Object();
				if (optionsData2 == 2 && _t.val != '') {
					optionsData = _t.val;
				} else if (optionsData2 == 2 && _t.val == '') {
					optionsData = _t.$route.params.value2 ? _t.$route.params.value2 : JSON.parse(localStorage.getItem('hy-resdata2'));
				} else if (optionsData2 == 1 && _t.val == '') {
					optionsData = _t.$route.params.value ? _t.$route.params.value : JSON.parse(localStorage.getItem('hy-resdata'));
				} else if (optionsData2 == 1 && _t.val != '') {
					optionsData = _t.val;
				}
				_t.optionsData = optionsData;
				_t.$api.post('/asset/discovery/result', {
					sn: _t.optionsData,
					status: _t.paramStatus,
					sort: _t.orderDiscovery + ',' + _t.orderIp,
					currentPage: _t.options.currentPage,
					pageSize: _t.options.pageSize
				}, function (res) {
					switch (res.status) {
						case 200:
							var stayDevice = res.data.stayDevice;
							if (stayDevice !== 0) {
								/*_t.loading = true;*/
								_t.timer();
							} else if (stayDevice === 0) {
								clearTimeout(_t.timer);
								_t.loading = false;
								_t.disabledExport = false;
							}
							var Income = [];
							Income = res.data.pageList === null ? [] : res.data.pageList;
							_t.tableData = [];
							for (var i = 0; i < Income.length; i++) {
								if (Income[i].discovery === true) {
									Income[i].discovery = "成功"
								} else if (Income[i].discovery === false) {
									Income[i].discovery = "未发现"
								} else {
									Income[i].discovery = "待发现"
								}
								if (Income[i].manufacturer === undefined) {
									Income[i].manufacturer = '';
								}
								if (Income[i].model === undefined) {
									Income[i].model = '';
								}
								_t.tableData.push({
									manufacturerModel: (Income[i].manufacturer == '' && Income[i].model == '') ? '' : (Income[i].manufacturer + ' ， ' + Income[i].model),
									ip: Income[i].ip,
									discovery: Income[i].discovery,
									errorText: Income[i].errorText
								});
							}
							var Dincome = [{
								value: res.data.failDevice,
								name: _t.$t('DeviceManualDetection.eChartLegendFirst')
							}, {
								value: res.data.stayDevice,
								name: _t.$t('DeviceManualDetection.eChartLegendSecond')
							}, {
								value: res.data.successDevice,
								name: _t.$t('DeviceManualDetection.eChartLegendThird')
							}];
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.totalResultSize;
							_t.drawLine(Dincome, dateFilterSeconds(res.requesttime));
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
			//饼图
			drawLine(legend, subtext) {
				var _t = this;
				var myChart = _t.$echarts.init(document.getElementById("echart_Beg"))
				var option = {
					title: {
						text: _t.$t('DeviceManualDetection.eChartsTitle'),
						subtext: subtext,
						top: 5,
						left: 20,
						textStyle: {
							fontSize: 14,
							color: '#333'
						},
						subtextStyle: {
							fontSize: 12,
							color: '#ccc'
						},
						itemGap: 10
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'horizontal',
						top: 60,
						data: legend,
					},
					icon: ['circle'],
					color: ['#fb6140', '#fdbb41', '#5bd25d', '#24b4c5', '#999999'],
					toolbox: {
						show: true,
						top: 10,
						right: 20,
						feature: {
							restore: {
								show: true,
								title: _t.$t('DeviceManualDetection.restore')
							},
							saveAsImage: {
								show: true,
								title: _t.$t('DeviceManualDetection.download')
							}
						}
					},
					calculable: true,
					series: [{
						name: _t.$t('DeviceManualDetection.eChartsTitle'),
						type: 'pie',
						radius: '50%',
						center: ['50%', '60%'],
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
						data: legend,
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				myChart.off('click');
				myChart.on('click', function (param) {
					_t.paramStatus = param.dataIndex - 1;
					_t.$refs.pages.handleCurrentChange(1);
				});
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
			//返回设备手动发现
			BeganToSeeReturn() {
				this.$router.push({
					path: '/YUser/DeviceManualDetection'
				})
			},
			//添加设备
			handleSelectionChange(val) {
				if (val.length !== 0) {
					this.disabled = false;
					var BeganToSee= document.getElementById('BeganToSee_addEquipment');
					BeganToSee.style.backgroundColor="#3f81d0";
					BeganToSee.style.color="#ffffff";
				} else {
					this.disabled = true;
					var BeganToSee= document.getElementById('BeganToSee_addEquipment');
          					BeganToSee.style.backgroundColor="#f4f4f4";
          					BeganToSee.style.color="#999999";
				}
				this.multipleSelection = val;
				var int = [];
				for (var i = 0; i < val.length; i++) {
					int.push(
						val[i].ip
					)
				}
				this.ips = int;
			},
			addEquipment() {
				var _t = this;
				_t.$api.post('/asset/discovery/insert', {
					"sn": _t.optionsData,
					"ips": _t.ips
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.getData();
							_t.describes = res.data;
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.totalResultSize;
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
			//表格禁用
			selectable(row) {
				if (row.discovery === "成功") {
					return true
				} else {
					return false
				}
			},
			//发现结果导出
			DiscoveryExport() {
				var _t = this;
				_t.$api.get('/asset/discovery/export', {
					jsonString: JSON.stringify({
						"sn": _t.optionsData
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							window.location.href = res.data.fileName;
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
		},
	}
</script>

<style scoped>
	.ipSpan {
		/*display: -ms-inline-flexbox;
		display: -webkit-inline-box;
		display: inline-flex;*/
		/*display: inline-block;*/
		/*-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;*/
		/*flex-direction: column;*/
		/*	-webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;*/
		/*display: inline-block;*/
		height: 40px;
		width: 24px;
		cursor: pointer;
		/*overflow: initial;*/
		position: relative;

	}
	.ipAsc {
		position: absolute;
		top: -10px;
		left: 3px;
		width: 14px;
		height: 14px;
		font-size: 18px;
		line-height: 18px;
		color: #ccc;
	}

	.ipDesc {
		font-size: 18px;
		position: absolute;
		top: 4px;
		width: 14px;
		height: 14px;
		left: 3px;
		color: #ccc;
	}
	.ipDescEsc{
		color: #3f81d0;
	}

	.echart_Beg {
		width: 524px;
		background-color: #fff;
		border: 1px solid #ececec;
		margin-right: 20px;
		border-radius: 10px;
		box-shadow: 2px 2px 8px #ececec;
	}

	.flex_box {
		display: flex;
	}

	.table_flex {
		overflow: auto;
		flex: 1;
		border: 1px solid #ececec;
		box-shadow: -2px -2px 8px #ececec;
		border-radius: 10px;
	}

	.BeganToSee-col {
		margin: 10px 10px 0 10px;
		background-color: #fff;
		height: 40px;
		line-height: 40px;
	}

	.BeganToSee-return {
		float: left;
		font-size: 12px;
		cursor: pointer;
	}

	.BeganToSee-IncompleteDiscovery {
		float: right;
		text-align: center;
	}

	.BeganToSee-right {
		overflow: hidden;
		background-color: #fff;
	}

	.BeganToSee-right-list {
		float: left;
		overflow: hidden;
		height: 30px;
		line-height: 30px;
	}

	.BeganToSee-button {
		overflow: hidden;
		padding: 20px;
	}

	.BeganToSee-addEquipment {
		float: left;
		height: 30px;
		margin-left: 30px;
		background-color: #f4f4f4;
		color:#999999;
		font-size:14px;
		border: 0;
	}

	.ListOfUncompletedDiscoveries-process {
		overflow: hidden;
	}

	.ListOfUncompletedDiscoveries-process h3 {
		font-size: 14px;
		color: #252a2f;
		padding-left: 10px;
	}

	.ListOfUncompletedDiscoveries-process ul {
		padding-left: 10px;
		overflow: hidden;
	}

	.ListOfUncompletedDiscoveries-process ul li {
		float: left;
		font-size: 14px;
		padding-left: 10px;
		padding-top: 10px;
		cursor: pointer;
	}

	.ListOfUncompletedDiscoveries-process ul li:first-child {
		padding-left: 0;
	}
</style>
<style>
	.BeganToSee_unfinished {
		background-color: #000000;
		opacity: 0.8;
		height: 350px;
		overflow: auto
	}

	.beginToSee.el-table .el-table__body-wrapper tbody tr:last-child td {
		border-bottom: 1px solid #EBEEF5;
	}

	.beginToSee.el-table .disColunm.cell {
		overflow: initial !important;
	}

	.beginToSee.el-table .table-column {
		display: block;
	}
	.table_flex .el-loading-text{
		color:#fff;
	}
</style>
