<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>监测管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--echarts区域-->
		<div style="background-color: #ccc; overflow: hidden;">
			<div style="background-color: #fff; padding: 10px;">
				<el-row :gutter="20">
					<el-col :span="12">
						<div id="echartText" style="width: 100%; height:440px">1</div>
					</el-col>
					<el-col :span="12">
						<div id="echart" style="width: 100%; height:440px">2</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</Box>
</template>

<script>
	import Box from '../../components/Box';
	export default {
		name: 'monitoringAndControl',
		components: {
			Box,
		},
		data() {
			return {

			}
		},
		mounted() {
			this.drawLine();
			this.drawLine2();
		},
		methods: {
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
					calculable: true,
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
							symbol: 'emptyCircle',
							symbolSize: series[0].radius[0],
							effect: {
								show: true,
								scaleSize: 12,
								color: 'rgba(250,225,50,0.8)',
								shadowBlur: 10,
								period: 30
							},
							data: [{
								x: '50%',
								y: '50%'
							}]
						};
						return series;
					})()
				};
				myChart.setOption(option);
				/*setTimeout(function() {
					var _ZR = myChart.getZr();
					console.log(_ZR);

					//ShowObjProperty(_ZR);
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
			}
		}
	}
</script>

<style scoped>

</style>