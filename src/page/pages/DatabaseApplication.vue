<template>
	<Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.SystemMonitoring')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.DatabaseApplication')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
		<el-row>
			<el-col :span="24">
				<div id="echart" style="width: 100%; height: 430px; border: #CCCCCC solid 1px; padding:20px 100px 0 50px"></div>
			</el-col>
		</el-row>
		<el-row v-show="WEB">
			<el-col>
				<div class="col-title">
					<div class="col-title-l">DB01（192.168.0.101）</div>
					<div class="col-title-r">【正常】</div>
				</div>
			</el-col>
			<el-col>
				<div class="col-tab">
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="资源实用情况" name="first">
							<div class="Resources">
								<div class="Resources-left">
									<ul>
										<li><span>CPU总体使用率：</span><span>35%</span></li>
										<li><span>当前应用CPU使用率：</span><span>20%</span></li>
										<li><span>当前出流量：</span><span>25MB/s</span></li>
										<li><span>平均出流量：</span><span>22.5 MB/s</span></li>
										<li><span>峰值出流量：</span><span>37 MB/s</span></li>
									</ul>
								</div>
								<div class="Resources-right">
									<ul>
										<li><span>内存总体使用率：</span><span>30%</span></li>
										<li><span>当前应用内存使用率：</span><span>10%</span></li>
										<li><span>当前入流量：</span><span>25 MB/s</span></li>
										<li><span>平均入流量：</span><span>22.5 MB/s</span></li>
										<li><span>峰值入流量：</span><span>37 MB/s</span></li>
									</ul>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane label="磁盘空间情况" name="second">
							<el-collapse v-model="activeNames" @change="handleChange">
								<el-collapse-item title="disk0" name="1">
									<div class="dataSource">
										<div class="dataSource-left">
											<ul>
												<li><span>磁盘总量：</span><span>1000GB</span></li>
												<li><span>可用空间：</span><span>500GB</span></li>
											</ul>
										</div>
										<div class="dataSource-right">
											<ul>
												<li><span>已使用：</span><span>500GB</span></li>
												<li><span>使用率：</span><span>50%</span></li>
											</ul>
										</div>
									</div>
								</el-collapse-item>
								<el-collapse-item title="disk1" name="2">
									<div class="dataSource">
										<div class="dataSource-left">
											<ul>
												<li><span>磁盘总量：</span><span>1000GB</span></li>
												<li><span>可用空间：</span><span>800GB</span></li>
											</ul>
										</div>
										<div class="dataSource-right">
											<ul>
												<li><span>已使用：</span><span>200GB</span></li>
												<li><span>使用率：</span><span>20%</span></li>
											</ul>
										</div>
									</div>
								</el-collapse-item>
							</el-collapse>

						</el-tab-pane>

					</el-tabs>
				</div>
			</el-col>
		</el-row>
	</Box>
</template>

<script>
  import Box from '../../components/Box';
	export default {
	  name:'Database-application',
    components:{Box},
		data() {
			return {
				activeName: 'second',
				activeNames: ['1'],
				WEB: false,
				W01: false,
				W02: false,
				W03: false,
			}

		},
		mounted() {
			this.drawLine();
		},
		methods: {
			/*tabs*/
			handleClick(tab, event) {
				console.log(tab, event);
			},
			/*折叠面板*/
			handleChange(val) {
				console.log(val);
			},
			drawLine() {
				/*基于准备好的DOM 初始化echarts*/
				let myChart = this.$echarts.init(document.getElementById("echart"));
				myChart.setOption({
					title: {
						text: 'DB应用状态',
						subtext: '虚构数据'
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							/*dataView : {show: true, readOnly: false},*/
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					/*calculable : false,*/

					series: [{
						name: '树图',
						type: 'tree',
						orient: 'horizontal', // vertical horizontal
						rootLocation: {
							x: '100',
							y: 50
						}, // 根节点位置  {x: 100, y: 'center'}
						nodePadding: 50,
						layerPadding: 12,
						hoverable: true,
						symbolSize: 16,
						itemStyle: {
							normal: {
								color: '#4883b4',
								label: {
									show: true,
									position: 'right',
									formatter: "{b}",
									textStyle: {
										color: '#000',
										fontSize: 16
									}
								},
								lineStyle: {
									color: '#48b',
									/*shadowColor: '#000',
									shadowBlur: 3,
									shadowOffsetX: 3,
									shadowOffsetY: 5,*/
									type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

								}
							},
							emphasis: {
								color: '#4883b4',
								label: {
									show: false
								},
								borderWidth: 0
							}
						},

						data: [{
							name: 'DB应用',
							value: 1,
							children: [{
									name: 'DB01（192.168.0.101）【正常】',
									value: 1
								},
								{
									name: 'DB02（192.168.0.102）【正常】',
									value: 1
								},
								{
									name: 'DB03（192.168.0.103）【正常】',
									value: 1
								}
							]
						}],
						left: '12%',
						right: '40%',
						top: '10%',
						bottom: "10%"
					}]
				});
				var that = this;
				myChart.on('click', function(param) {
					var index = param.dataIndex;
					if(index == 1) {
						that.WEB = false;
					} else if(index == 2 || index == 3 || index == 4) {
						that.WEB = true;
					}
					return that.WEB;
				});
				/*this.WEB=that.WEB;*/
			},
		}
	}
</script>
<style>
	.el-collapse-item__header{
		background-color: #ccc;
		margin: 20px 50px;
	}
</style>
<style scoped>
	.col-title {
		margin-top: 20px;
		overflow: hidden;
		height: 30px;
		line-height: 30px;
		font-size: 18px;
		background-color: #ccc;
	}
	
	.col-title-l {
		float: left;
	}
	
	.col-title-r {
		float: right;
	}
	
	.col-tab {
		overflow: hidden;
	}
	
	.dataSource {
		padding-top: 5%;
		overflow: hidden;
		height: auto;
	}
	
	.dataSource-left {
		width: 50%;
		float: left;
	}
	
	.dataSource-left ul li {
		font-size: 20px;
		line-height: 50px;
		text-align: center;
	}
	
	.dataSource-left ul li span {
		display: inline-block;
		width: 50%;
		
	}
	
	.dataSource-left ul li span:first-child {
		text-align: right;
		color: #f22;
		padding-right: 1%;
	}
	
	.dataSource-left ul li span:nth-child(2) {
		text-align: left;
		padding-left: 1%;
	}
	
	.dataSource-right {
		float: left;
		width: 50%;
		font-size: 18px;
	}
	
	.dataSource-right ul li {
		font-size: 20px;
		line-height: 50px;
		text-align: left;
	}
	
	.dataSource-right ul li span {
		display: inline-block;
		width: 50%;
	}
	
	.dataSource-right ul li span:first-child {
		text-align: right;
		color: #f22;
		padding-right: 1%;
	}
	
	.dataSource-right ul li span:nth-child(2) {
		text-align: left;
		padding-left: 1%;
	}
	
	.Resources {
		padding-top: 5%;
		overflow: hidden;
		height: 400px;
	}
	
	.Resources-left {
		width: 50%;
		float: left;
	}
	
	.Resources-left ul li {
		font-size: 20px;
		line-height: 50px;
		text-align: center;
	}
	
	.Resources-left ul li span {
		display: inline-block;
		width: 50%;
	}
	
	.Resources-left ul li span:first-child {
		text-align: right;
		color: #f22;
		padding-right: 1%;
	}
	
	.Resources-left ul li span:nth-child(2) {
		text-align: left;
		padding-left: 1%;
	}
	
	.Resources-right {
		float: left;
		width: 50%;
		font-size: 18px;
	}
	
	.Resources-right ul li {
		font-size: 20px;
		line-height: 50px;
		text-align: center;
	}
	
	.Resources-right ul li span {
		display: inline-block;
		width: 50%;
	}
	
	.Resources-right ul li span:first-child {
		text-align: right;
		color: #f22;
		padding-right: 1%;
	}
	
	.Resources-right ul li span:nth-child(2) {
		text-align: left;
		padding-left: 1%;
	}
</style>
