<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerConfiguration')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<div class="ComputerConfiguration">
			<div class="ComputerConfiguration_left clearfix">
				<div class="ComputerConfiguration_left_head">
					<span class="ComputerConfiguration_left_head_oneSpan">
						{{$t('ComputerRoomManagement.DataCenterDirectory')}}
					</span>
					<span class="ComputerConfiguration_left_head_click">
						<span class="iconfont fs14">&#xe689;</span>
					  <span class="ComputerConfiguration_left_head_title">{{$t('ComputerRoomManagement.new')}}</span>
					</span>
				</div>
				<div class="ComputerConfiguration_left_main" v-for="item in leftData">
					{{item.name}}
				</div>
			</div>
			<div class="ComputerConfiguration_right clearfix">
				<div class="ComputerConfiguration_right_head">
					<div class="ComputerConfiguration_right_head_text">
						<span style="padding-left: 10px;">北京数据中心</span>
						<span>
							<span style="padding-left: 20px;">{{$t('ComputerRoomManagement.ThoseResponsible')}}：张三【13900000000】</span>
						</span>
					</div>

					<div class="ComputerConfiguration_right_head_btn">
						<!--添加机房按钮-->
						<el-button @click="AddTheRoom">{{$t('ComputerRoomManagement.AddTheRoom')}}</el-button>
						<!--批量导入按钮-->
						<el-button @click="BulkImport">{{$t('ComputerRoomManagement.BulkImport')}}</el-button>
					</div>
				</div>
			</div>
		</div>
		<el-dialog class="ComputerRoomManagement_dialog"
							 :close-on-click-modal="false"
							 :close-on-press-escape="false"
							 append-to-body
							 :before-close="getComputerRoomManagementQx"
							 :title="$t('ComputerRoomManagement.NewEditingRoom')"
							 :visible.sync="ComputerRoomManagementBg">
			<el-form label-width="140px">
				<!--机房名称-->
				<el-form-item :label="$t('ComputerRoomManagement.ComputerName')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--所属数据中心-->
				<el-form-item :label="$t('ComputerRoomManagement.DataCenter')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--位置信息-->
				<el-form-item :label="$t('ComputerRoomManagement.locationInformation')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--额定功率-->
				<el-form-item :label="$t('ComputerRoomManagement.RatedPower')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--电压-->
				<el-form-item :label="$t('ComputerRoomManagement.voltage')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--电流-->
				<el-form-item :label="$t('ComputerRoomManagement.current')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--最大行数-->
				<el-form-item :label="$t('ComputerRoomManagement.largestNumberOfLines')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--最大列数-->
				<el-form-item :label="$t('ComputerRoomManagement.largestNumberOfColumns')+'：'">
					<el-input class="width200"></el-input>
				</el-form-item>
				<!--负责人1-->
				<el-form-item :label="$t('ComputerRoomManagement.headOne')+'：'">
					<el-select class="width200"
										 v-model="formItem.headOne"
										 :placeholder="$t('public.select')">
						<el-option v-for="item in option"
											 :key="item.value"
											 :value="item.value"
											 :label="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<!--负责人2-->
				<el-form-item :label="$t('ComputerRoomManagement.headTwo')+'：'">
					<el-select class="width200"
										 v-model="formItem.headTwo"
										 :placeholder="$t('public.select')">
						<el-option v-for="item in option"
											 :key="item.value"
											 :value="item.value"
											 :label="item.label">

						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary"
									 class="fontsize14 alertBtn"
									 @click="getComputerRoomManagement">
					{{$t('EquipmentMonitoring.determine')}}
				</el-button>
				<el-button class="fontsize14 alertBtn"
									 @click="getComputerRoomManagementQx">
					{{$t('EquipmentMonitoring.cancel')}}
				</el-button>
			</div>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../components/Box';

	export default {
		name: "ComputerConfiguration",
		components: {
			Box,
		},
		data() {
			return {
				//添加机房弹出层显示隐藏
				ComputerRoomManagementBg: false,
				leftData: [{
					name: '广东数据中心'
				}, {
					name: '北京数据中心'
				}, {
					name: '河北数据中心'
				}],
			formItem:{
				// 机房名称
				// 所属数据中心
				// 位置信息
				// 额定功率
				// 电压
				// 电流
				// 最大行数
				// 最大列数
				// 负责人1
				headOne:null,
				// 负责人2
				headTwo:null,
			},
				option:[
					{
						label:'高渐离',
						value:'1'
					},{
						label:'孙尚香',
						value:'2'
					},{
						label:'阿珂',
						value:'3'
					}
				]
			}
		},
		methods: {
			//点击添加机房按钮
			AddTheRoom() {
				var _t = this;
				_t.ComputerRoomManagementBg = true;
			},
			//点击添加机房弹出层取消按钮
			getComputerRoomManagementQx() {
				var _t = this;
				_t.ComputerRoomManagementBg = false;
			},
			//点击添加机房弹出层确定按钮
			getComputerRoomManagement() {
				var _t = this;
				_t.ComputerRoomManagementBg = false;
			},
			//点击批量导入按钮
			BulkImport() {
				var _t = this;

			},
		}
	}
</script>

<style scoped>
	.ComputerConfiguration {
		overflow: hidden;
	}

	.ComputerConfiguration_left {
		float: left;
		width: 19%;
		height: 100%;
		margin-right: 1%;
		border: 1px solid #ccc;
		position: absolute;
		top: 50px;
		left: 0;
		bottom: 0;
		overflow: auto;
		overflow: auto;
	}

	.ComputerConfiguration_left_head {
		line-height: 40px;
		background-color: #f2f2f2;
		overflow: hidden;
	}
.ComputerConfiguration_left_head_click{
	cursor: pointer;
	display: inline-block;
	float: right;
padding-right: 10px;
	color: #3F81D0;
}

	.ComputerConfiguration_left_head_oneSpan {
		padding-left: 10px;
		display: inline-block;
		float: left;
	}

	.ComputerConfiguration_left_main {
		line-height: 36px;
		text-align: center;
		cursor: pointer;
	}

	.ComputerConfiguration_right {
		width: 80%;
		float: right;
		overflow-y: auto;
		overflow: hidden;
	}

	.ComputerConfiguration_right_head {
		line-height: 40px;
		overflow: hidden;
		background-color: #f2f2f2;
		width: 100%;
	}

	.ComputerConfiguration_right_head_text {
		float: left;
	}

	.ComputerConfiguration_right_head_btn {
		float: right;
		padding-right: 20px;
	}
</style>
<style>
	.ComputerRoomManagement_dialog .el-dialog {
		width: 500px;
		height: 400px;
	}
</style>
