<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.jobLog')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="BeganToSee-col">
			<div class="BeganToSee-return" @click="BeganToSeeReturn"><i class="el-icon-back">&nbsp;&nbsp;返回设备手动发现</i></div>

			<div class="BeganToSee-IncompleteDiscovery">未完成的发现列表</div>
			<div class="BeganToSee-RefreshRate">
				<span>页面刷新频率</span>
				<el-select v-model="value" placeholder="请选择" style="width: 100px;">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
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
						<div class="BeganToSee-right-list"> {{BeganToSee}}已发现的设备列表</div>
						<div class="BeganToSee-button">
							<button class="BeganToSee-addEquipment" @click="addEquipment">
									<i class="el-icon-circle-plus">&nbsp;&nbsp;添加已选设备</i>
							</button>
							<button class="BeganToSee-exportEquipment">
									<i class="el-icon-circle-plus">&nbsp;&nbsp;发现结果导出</i>
							</button>
							<!--表格-->
							<el-table :data="tableData" style="width: 100%; margin-top: 16px;" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55">
								</el-table-column>
								<el-table-column prop="serialNumber" label="序号" width="120">
									<!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
								</el-table-column>
								<el-table-column prop="ip" label="IP地址" width="120">
								</el-table-column>
								<el-table-column prop="manufacturerModel" label="品牌型号" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="discovery" label="发现状态" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="errorText " label="描述" show-overflow-tooltip>
								</el-table-column>
							</el-table>
							<!--分页-->
							<!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
							</el-pagination>-->

							<pages :total='optionss.total' :currentPage='optionss.currentPage' :pageSize='optionss.pageSize' :firstPage='optionss.firstPage' :lastPage='optionss.lastPage' @handleCurrentChangeSub="handleCurrentChange" />
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</Box>
</template>

<script>
	import Box from '../../components/Box';
	export default {
		name: 'BeganToSee',
		components: {
			Box
		},
		data() {
			return {
				BeganToSee: '',
				//表格
				

				/*currentPage: 1,
				pagesize: 5,*/
				optionss: {
					total: 1000, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 5, // 每页显示条数
					firstPage: 1, // 首页
					lastPage: 100 // 末页
				},
				//页面刷新时间
				options: [{
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
				multipleSelection: [],
				ips:[]
			}
		},
		created() {
			var _t = this;
			var optionsData = new Object();
			optionsData = _t.$route.params.resdata ? _t.$route.params.resdata : JSON.parse(localStorage.getItem('hy-resdata'));
			_t.$api.post('/asset/discovery/result', {
				"sn": optionsData
			}, function(res) {
				
				var Income = [];
				Income = res.data.pageList;
				console.log(res);
				for(var i = 0; i < Income.length; i++) {
					if(Income[i].discovery === true) {
						Income[i].discovery = "成功"
					} else if (Income[i].discovery === false) {
						Income[i].discovery = "失败"
					} else {
						Income[i].discovery = "待发现"
					}
					_t.tableData.push({
						'manufacturerModel': Income[i].manufacturer + Income[i].model,
						'serialNumber': i + 1,
						'ip': Income[i].ip,
						'discovery': Income[i].discovery,
						'errorText ':Income[i].errorText 
					})

				}
				//console.log(_t.tableData);

			});

			/*this.BeganToSee = this.$route.query.BeganToSee;
			console.log(this.BeganToSee);*/
		},
		mounted() {
			this.drawLine();
			/*console.log(this.BeganToSee);*/
		},
		methods: {
			drawLine() {
				var myChart = this.$echarts.init(document.getElementById("echart"))
				var option = {
					color: ['#fde33f', '#fb6041', '#40a8ff'],
					title: {
						text: '设备发现进度',
						subtext: '2019年3月25日 09:02',
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
						data: ['待发现地址数', '已发现相应设备地址数', '检测无相应设备地址数']
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							/*dataView: {
								show: true,
								readOnly: false
							},*/
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
								textStyle: {
									/*fontSize: '30',*/
									/*fontWeight: 'bold',*/

								}
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
								name: '待发现地址数'
							},
							{
								value: 310,
								name: '已发现相应设备地址数'
							},
							{
								value: 234,
								name: '检测无相应设备地址数'
							}

						]
					}]

				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				var _t=this;
				myChart.on('click', function(param) {
					var optionsData = new Object();
			optionsData = _t.$route.params.resdata ? _t.$route.params.resdata : JSON.parse(localStorage.getItem('hy-resdata'));
					_t.$api.post('/asset/discovery/result', {
					"sn": optionsData,
					"status":param.dataIndex-1
					
				}, function(res) {
					console.log(res);
					
					
				});
					alert(status);
				});
			},
			
			// 改变当前页码
			handleCurrentChange(val) {
				//console.log(val)
			},

			/*handleSizeChange: function(size) {
				this.pagesize = size;
			},
			/*handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			}*/
			//返回设备手动发现
			BeganToSeeReturn() {
				this.$router.push({
					path: '/YUser/DeviceManualDetection'
				})
			},
			//添加设备
			handleSelectionChange(val) {
				this.multipleSelection = val;
				var int=[];
				for(var i=0;i<val.length;i++){
					int.push(
						val[i].ip
					)
				}
				this.ips=int;
			},
			addEquipment() {
					var _t=this;
					var optionsData = new Object();
			optionsData = _t.$route.params.resdata ? _t.$route.params.resdata : JSON.parse(localStorage.getItem('hy-resdata'));
					_t.$api.post('/asset/discovery/insert', {
					"sn": optionsData,
					"ips":_t.ips
				}, function(res) {
					
					console.log(res);
					
				});
			},

		},
		beforeDestroy() {
			localStorage.removeItem('hy-resdata');
		}
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
	}
	
	.BeganToSee-RefreshRate {
		float: right;
	}
	
	.BeganToSee-IncompleteDiscovery {
		float: right;
		width: 170px;
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
		width: 136px;
		height: 30px;
		background-color: #eaedf1;
		border-radius: 2px;
		outline: none;
		border: 1px solid #c1c1c1;
	}
	
	.BeganToSee-exportEquipment {
		width: 136px;
		height: 30px;
		margin-left: 10px;
		background-color: #eaedf1;
		border-radius: 2px;
		outline: none;
		border: 1px solid #c1c1c1;
	}
</style>