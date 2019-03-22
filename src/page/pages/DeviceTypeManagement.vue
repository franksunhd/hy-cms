<template>
	<div class="DeviceTypeManagement-box">
		<!--<el-input placeholder="输入关键字进行过滤" v-model="filterText">
	</el-input>-->

		<!--default-expand-all :filter-node-method="filterNode"-->
		<el-row>
			<el-col>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item>{{$t('breadcrumb.DeviceDiscovery')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.DeviceTypeManagement')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="6">
				<div class="NewDeviceType">
					<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
					<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
						<span>这是一段信息</span>
						<span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
					</el-dialog>

				</div>
				<div class="DeviceType">设备类型</div>
				<div class="TreeControl">
					<el-tree class="filter-tree" :data="data2" :props="defaultProps" ref="tree2"></el-tree>
				</div>
			</el-col>
			<el-col :span="18">
				<div><span>设备XX的通用信息</span><span>
					<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
					<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
						<span>这是一段信息</span>
						<span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
					</el-dialog>
				</span></div>
				<div class="tabs">

				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	export default {
		name: 'DeviceTypeManagement',
		data() {
			return {
				/*filterText: '',*/
				data2: [{
					id: 1,
					label: '服务器硬件 ',
					children: [{
						id: 4,
						label: 'IBM',
						children: [{
							id: 9,
							label: '101-101'
						}, {
							id: 10,
							label: '102-102'
						}]
					}, {
						id: 11,
						label: 'DELL'
					}]
				}, {
					id: 2,
					label: '交换机',
					children: [{
						id: 5,
						label: '华为'
					}, {
						id: 6,
						label: '锐捷'
					}]
				}, {
					id: 3,
					label: '机房设备',
					children: [{
						id: 7,
						label: '空调',
						children: [{
								id: 12,
								label: '格力'
							},
							{
								id: 13,
								label: '美的'
							}
						]
					}, {
						id: 8,
						label: 'UPS'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		/*methods: {
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},*/
	}
</script>

<style>
	.DeviceTypeManagement-box {
		overflow: hidden;
		padding: 20px 20px;
	}
	
	.NewDeviceType {
		margin: 20px 0 20px 20px;
	}
	
	.DeviceType {
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 5px;
	}
	
	.TreeControl {
		overflow: hidden;
	}
</style>