<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerConfiguration')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.rackRoomDistribution')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20">
			<!--表单-->
			<el-form inline :model="formItem">
				<el-form-item :label="$t('rackRoomDistribution.formDataCenterName') + '：'">
					<span class="marginRight20">{{formItem.dataCenterName}}</span>
				</el-form-item>
				<el-form-item :label="$t('rackRoomDistribution.formDataCenterRoomName') + '：'">
					<span class="marginRight20">{{formItem.name}}</span>
				</el-form-item>
				<el-form-item :label="$t('rackRoomDistribution.formDataCenterUser') + '：'">
					<span>{{formItem.chargeBy}}</span>
					<span class="marginRight20" v-if="formItem.mobile !== null">【{{formItem.mobile}}】</span>
				</el-form-item>
				<el-form-item class="fr" style="margin-right: 0;">
					<el-button type="primary" class="alertBtn" @click="goBack">{{$t('public.goBack')}}</el-button>
				</el-form-item>
			</el-form>
			<!--表格-->
			<div class="rackRoom-box" id="rackRoom-box">
				<section :style="{height: autoHeight}">
					<el-table id="rackTable" :data="tableData" border :height="tableHeight" :max-height="tableHeight"
							  ref="table">
						<el-table-column fixed width="70px" align="center">
							<template slot-scope="scope">
								<div class="col_dell">{{scope.$index + 1}}</div>
							</template>
						</el-table-column>
						<el-table-column
							width="100px"
							header-align="center"
							align="center"
							:label="(index+1).toString()"
							v-for="(item,index) in cols"
							:key="index">
							<template slot-scope="scope">
								<el-tooltip effect="light" placement="right">
									<div slot="content">
										<div class="form_rack">
											<el-form label-width="80px" class="paddingR20">
												<el-form-item :label="$t('rackRoomDistribution.formRackName') + '：'" >
													<span>{{scope.row['col_name_' + (index + 1)]}}</span>
												</el-form-item>
												<el-form-item :label="$t('rackRoomDistribution.formCode') + '：'">
													<span>{{scope.row['col_code_' + (index + 1)]}}</span>
												</el-form-item>
												<el-form-item :label="$t('rackRoomDistribution.formDataCenterUser')+'1'+'：'">
													<span v-if="scope.row['col_chargeByFirst_' + (index + 1)]!==null">{{scope.row['col_chargeByFirst_' + (index + 1)]}}</span>
													<span v-else>N/A</span>
												</el-form-item>
												<el-form-item :label="$t('rackRoomDistribution.formDataCenterUser')+'2'+'：'">
													<span v-if="scope.row['col_chargeBySecond_' + (index + 1)]!==null">{{scope.row['col_chargeBySecond_' + (index + 1)]}}</span>
													<span v-else>N/A</span>
												</el-form-item>
											</el-form>
										</div>
									</div>
									<span class="displayInlineBlock img_box">
								        <img v-if="scope.row['col_' + (index + 1)] !== null"
									   		 @click="clickRack(scope.row,scope.row['col_' + (index + 1)])"
									 		 src="./../../../../../static/rack/rack.png" width="50" height="80"/>
									</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
				</section>
			</div>
		</div>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';

	export default {
		name: "rackRoomDistribution",
		components: {Box},
		data() {
			return {
				// 顶部表单
				formItem: {
					roomId: '', // 机房id
					dataCenterName: '', // 数据中心名称
					name: '', // 机房名称
					chargeBy: '', // 责任人
					mobile: null, // 电话
				},
				tableData: [], // 表格数据
				cols: [],
				autoHeight: '',
				tableHeight: 0,
			}
		},
		methods: {
			// 获取数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/serverRoom/' + _t.formItem.roomId, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 头部表单信息
							if (res.data !== null) {
								if (res.data.dataCenterName && res.data.dataCenterName !== null) {
									_t.formItem.dataCenterName = res.data.dataCenterName;
								}
								if (res.data.name && res.data.name !== null) {
									_t.formItem.name = res.data.name;
								}
								if (res.data.chargeByName1 && res.data.chargeByName1 !== null) {
									_t.formItem.chargeBy = res.data.chargeByName1;
								}
								if (res.data.mobile1 && res.data.mobile1 !== null) {
									_t.formItem.mobile = res.data.mobile1;
								}
								// // 机柜分布 集合
								if (res.data.assetRackList && res.data.assetRackList !== null) {
									_t.dealWithTableData(res.data.maxRow, res.data.maxCol, res.data.assetRackList);
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 处理机柜分布
			dealWithTableData(maxRow, maxCol, assetRackList) {
				var _t = this;
				// 渲染列
				var cols = new Array();
				for (var i = 0; i < maxCol; i++) {
					var obj = new Object();
					cols.push(obj);
				}
				_t.cols = cols;
				// 渲染行
				var tableData = new Array();
				for (var j = 0; j < maxRow; j++) {
					var obj = new Object();
					obj.row = j + 1;
					for (var k = 0; k < maxCol; k++) {
						obj['col_' + (k + 1)] = null; // 每个单元格的 值
						obj['col_name_' + (k + 1)] = null; // 每个机柜的名称
						obj['col_code_' + (k + 1)] = null; // 每个机柜的编码
						obj['col_chargeByFirst_' + (k + 1)] = null; // 每个机柜的责任人1
						obj['col_chargeBySecond_' + (k + 1)] = null; // 每个机柜的责任人2
					}
					tableData.push(obj);
				}
				// 对比集合 填充数据
				tableData.forEach((t) => {
					assetRackList.forEach((item) => {
						for (var key in t) {
							if (t.row === item.rackRow && key === ('col_' + item.rackColumn)) {
								t['col_' + item.rackColumn] = item.id;
								t['col_name_' + item.rackColumn] = item.name;
								t['col_code_' + item.rackColumn] = item.code;
								t['col_chargeByFirst_' + item.rackColumn] = item.chargeByName1;
								t['col_chargeBySecond_' + item.rackColumn] = item.chargeByName2;
							}
						}
					});
				});
				_t.tableData = tableData;
			},
			// 返回按钮
			goBack() {
				this.$router.go(-1);
			},
			// 点击图片 跳转值设备分布页面
			clickRack(row, rackId) {
				var _t = this;
				if (rackId !== null) {
					_t.$router.push({
						name: 'equipmentDistribution', params: {
							rackId: rackId
						}
					});
					localStorage.setItem('hy-rack-id', rackId);
				}
			},
		},
		created() {
			var _t = this;
			_t.$store.commit('setLoading', true);
			_t.formItem.roomId = _t.$route.params.roomId ? _t.$route.params.roomId : localStorage.getItem('hy-room-id');
			_t.getData();
		},
		mounted() {
			var _t = this;
			_t.$nextTick(function () {
				var height = document.getElementById('rackRoom-box').clientHeight;
				_t.autoHeight = height + 'px';
				_t.tableHeight = height;
				document.getElementById('rackTable').style.height = height + 'px';
				document.getElementById('rackTable').style.maxHeight = height + 'px';
			});
			window.onresize = () => {
				if (document.getElementById('rackRoom-box') !== null && document.getElementById('rackRoom-box').clientHeight !== null) {
					_t.autoHeight = document.getElementById('rackRoom-box').clientHeight + 'px';
					_t.tableHeight = document.getElementById('rackRoom-box').clientHeight;
				}
			}
		},
		beforeDestroy() {
			var _t = this;
			_t.tableData = [];
		}
	}
</script>

<style scoped>
	.rackRoom-box {
		position: fixed;
		left: 76px;
		right: 20px;
		bottom: 15px;
		top: 170px;
		overflow: auto;
	}

	.rackRoom-box .img_box {
		cursor: pointer;
	}

	.form_rack {
		color: #000;
		font-size: 18px;
	}
	.paddingR20{
		padding-right: 20px;
	}

	.col_dell {
		display: inline-block;
		width: 30px;
		height: 30px;
		line-height: 30px;
		margin-top: 45px;
		border-radius: 50%;
	}
</style>
<style>
	.rackRoom-box .el-table__body-wrapper .el-table__body tbody tr td div.cell {
		width: 100px;
		height: 120px;
		line-height: 120px;
	}

	.rackRoom-box .el-table__fixed-body-wrapper .el-table__body tbody tr td div.cell {
		height: 120px;
	}

	.rackRoom-box .el-table__body-wrapper .el-table__empty-block {
		width: 100% !important;
	}

	.form_rack .el-form-item{
		margin-bottom: 0;
		margin-top: 10px;
	}
</style>
