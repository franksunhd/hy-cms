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
			<div class="BeganToSee-return" @click="BeganToSeeReturn"><i class="el-icon-back">&nbsp;&nbsp;{{$t('DeviceManualDetection.ReturnToDeviceManualDiscovery')}}</i></div>
			<div class="BeganToSee-IncompleteDiscovery" @click="UncompletedDiscoveryTask">
				<el-popover placement="bottom" width="400" v-model="visible2" trigger="click" popper-class="aaa" >
					<div class="ListOfUncompletedDiscoveries-process" >
						<h3>发现队列中正在执行设备发现的进程</h3>
						<ul v-for="(item,index) in process" :key="item.sn" @click="handClickprocess(item.sn)">
							<li>{{item.id}}</li>
							<li>{{item.date |dateFilter}}</li>
							<li>{{item.name}}</li>
						</ul>
					</div>
					<el-button slot="reference">{{$t('DeviceManualDetection.UncompletedDiscoveryTask')}}</el-button>
				</el-popover>
			</div>
			<!--<div class="BeganToSee-RefreshRate">
				<span>页面刷新频率</span>
				<el-select v-model="value" placeholder="请选择" style="width: 100px;">
					<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>-->
		</div>
		<div class="padding10">
			<el-row>
				<el-col>
					<div id='echart' style="width: 100%;height:420px; background-color: #fff;"></div>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col>
					<div class="BeganToSee-right">
						<div class="BeganToSee-right-list"> {{BeganToSee}}{{$t('DeviceManualDetection.ListOfDevicesFound')}}</div>
						<div class="BeganToSee-button">
							<el-button class="BeganToSee-addEquipment" @click="addEquipment">
								<i class="el-icon-circle-plus">&nbsp;&nbsp;{{$t('DeviceManualDetection.AddTheSelectedDevice')}}</i>
							</el-button>
							<el-button class="BeganToSee-exportEquipment " @click="DiscoveryExport">
								<i class="el-icon-circle-plus">&nbsp;&nbsp;{{$t('DeviceManualDetection.DiscoveryExport')}}</i>
							</el-button>
							<el-button @click="gbym"> 改变页码</el-button>
							<!--表格-->
							<el-table :data="tableData" :default-sort="{prop: 'ip', order: 'ascending'}" style="width: 100%; margin-top: 16px;" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55" :selectable="selectable" />
								<!--<el-table-column prop="serialNumber" label="序号" />-->
								<el-table-column :label="$t('public.index')" header-align="left" width="80" align="left">
									<template slot-scope="scope">
										<span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
									</template>
								</el-table-column>
								<!--prop="errorText"-->
								<el-table-column sortable prop="ip" :label="$t('DeviceManualDetection.ipAddress')" width="120" />
								<el-table-column prop="manufacturerModel" :label="$t('DeviceManualDetection.BrandModels')" show-overflow-tooltip/>
								<el-table-column prop="discovery" :label="$t('DeviceManualDetection.FoundThatTheState')" show-overflow-tooltip/>
								<el-table-column :label="$t('DeviceManualDetection.describe')" show-overflow-tooltip>
									<template slot-scope="scope">
										<span v-if="describes[scope.row.ip]=='-1'">已存在</span>
										<span v-if="describes[scope.row.ip]=='1'">添加成功</span>
										<span v-if="describes[scope.row.ip]=='0'">添加失败</span>
									</template>
								</el-table-column>
							</el-table>
							<!--分页-->
							<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize" ref="pages" @handleSizeChangeSub="handleSizeChangeSub" @handleCurrentChangeSub="handleCurrentChange" />
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</Box>
</template>

<script>
	import Box from '../../../../components/Box';
	import { dateFilterSeconds, dateFilter } from "../../../../assets/js/filters";

	export default {
		name: 'BeganToSee',
		components: {
			Box
		},
		data() {
			return {
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
			}
		},
		created() {
			var _t = this;
			_t.getData();
			_t.getSnData();
		},

		methods: {
			// 查询表格中状态对应的数据值
			getSnData(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
					languageMark: localStorage.getItem("hy-language")
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							// 获取对应的状态值
							_t.tableDataBase = res.data;
							var process = [];
							var index = 0;
							for(var key in resData) {
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
							_t.tableDataBase = [];
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
				_t.$api.post('/asset/discovery/history', {}, function(res) {
					switch(res.status) {
						case 200:
							_t.getSnData(res.data);
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
				this.visible2=false;
				this.getData();

			},
			/*定时器*/
			timer() {
				var _t = this;
				return setTimeout(() => {
					_t.getData()
				}, 1000)
			},
			//刷新接口
			getData() {
				var _t = this;
				var optionsData2 = new Object();
				optionsData2 = _t.$route.params.type ? _t.$route.params.type : JSON.parse(localStorage.getItem('hy-typesone'));
				var optionsData = new Object();
				if(optionsData2 == 2 && _t.val != '') {
					optionsData = _t.val;
				} else if(optionsData2 == 2 && _t.val == '') {
					optionsData = _t.$route.params.value2 ? _t.$route.params.value2 : JSON.parse(localStorage.getItem('hy-resdata2'));
				} else if(optionsData2 == 1 && _t.val == '') {
					optionsData = _t.$route.params.value ? _t.$route.params.value : JSON.parse(localStorage.getItem('hy-resdata'));
				} else if(optionsData2 == 1 && _t.val != '') {
					optionsData = _t.val;
				}
				_t.optionsData = optionsData;
				_t.$api.post('/asset/discovery/result', {
					sn: _t.optionsData,
					status: _t.paramStatus,
					currentPage: _t.options.currentPage,
					pageSize: _t.options.pageSize
				}, function(res) {
					switch(res.status) {
						case 200:
						console.log(res);
							var stayDevice = res.data.stayDevice;
							let timers;
							if(stayDevice !== 0) {
								_t.timer();
							} else if(stayDevice === 0) {
								clearTimeout(_t.timer);
							}
							var Income = [];
							Income = res.data.pageList;
							_t.tableData = [];
							for(var i = 0; i < Income.length; i++) {
								if(Income[i].discovery === true) {
									Income[i].discovery = "成功"
								} else if(Income[i].discovery === false) {
									Income[i].discovery = "失败"
								} else {
									Income[i].discovery = "待发现"
								}
								if(Income[i].manufacturer == undefined) {
									Income[i].manufacturer = '';
								}
								if(Income[i].model == undefined) {
									Income[i].model = '';
								}
								_t.tableData.push({
									manufacturerModel: (Income[i].manufacturer == '' && Income[i].model == '') ? '' : (Income[i].manufacturer + ' ， ' + Income[i].model),
									ip: Income[i].ip,
									discovery: Income[i].discovery,
									errorText: Income[i].errorText
								})
							}
							var Dincome = [];
							Dincome.push({
								'value': res.data.failDevice,
								'name': "检测无相应设备地址数"
							}, {
								'value': res.data.stayDevice,
								'name': "待发现地址数"
							}, {
								'value': res.data.successDevice,
								'name': "已发现相应设备地址数"
							})
							_t.Dincome = Dincome;
							var Dincome2 = dateFilterSeconds(res.requesttime);
							_t.Dincome2 = Dincome2;
							_t.options.currentPage = res.data.currentPage;
							console.log(res.data.currentPage)
							_t.options.total = res.data.totalResultSize;
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
				});
			},
			//饼图
			drawLine() {
				var _t = this;
				var myChart = this.$echarts.init(document.getElementById("echart"))
				var option = {
					color: ['#fde33f', '#fb6041', '#40a8ff'],
					title: {
						text: '设备发现进度',
						subtext: _t.Dincome2,
						top: 5,
						left: 20,
						textStyle: {
							fontSize: 18,
							color: '#333'
						},
						subtextStyle: {
							fontSize: 14,
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
						/*x: 'center',*/
						/*y:'center',*/
						/*left: 400,*/
						top: 30,
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
						data: _t.Dincome,
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				myChart.off('click');
				myChart.on('click', function(param) {
					console.log(111)
					_t.paramStatus = param.dataIndex - 1;
					_t.$refs.pages.handleCurrentChange(1);
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
				console.log(val);
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
				this.multipleSelection = val;
				var int = [];
				for(var i = 0; i < val.length; i++) {
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
				}, function(res) {
					switch(res.status) {
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
				if(row.discovery === "成功") {
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
				}, function(res) {
					switch(res.status) {
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
			gbym(){
				var _t=this;
				_t.options.currentPage = 1;
			}
		},
		/*beforeDestroy() {
		            localStorage.removeItem('hy-resdata');
		        }*/
	}
</script>

<style scoped>
	.BeganToSee-col {
		margin: 10px;
		margin-bottom: 0;
		background-color: #fff;
		height: 40px;
		line-height: 40px;
	}
	
	.BeganToSee-return {
		float: left;
		padding-left: 20px;
		font-size: 12px;
		cursor: pointer;
	}
	
	.BeganToSee-RefreshRate {
		float: right;
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
		overflow: hidden;
		padding-left: 20px;
		height: 50px;
		line-height: 50px;
	}
	
	.padding10 {
		padding: 10px;
	}
	
	.BeganToSee-button {
		overflow: hidden;
		padding: 20px;
	}
	
	.BeganToSee-addEquipment {
		height: 30px;
	}
	
	.BeganToSee-exportEquipment {
		height: 30px;
		margin-left: 10px;
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
	.aaa {
		background-color: #000000;
		opacity: 0.8;
		height: 350px;
		overflow: auto
	}
</style>