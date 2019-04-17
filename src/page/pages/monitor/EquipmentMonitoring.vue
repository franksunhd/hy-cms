<template>
	<Box>
		<div v-show="isShow" class="systemSettings-navBar">
			<!--<systemSettingsNavBar/>-->
			<div class="borderRightColorGray">
				<p class="dataDictionary-title">
					<a href="javascript:;" @click="clickNode">设备分组</a>
					<!--{{formItem.menuName}}-->
				</p>
				<el-tree class="dataDictionary-tree" :data="treeData" highlight-current @node-click="getCurrentNode" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="false" />
			</div>
			<a href="javascript:;" @click="clickInset" id="EquipmentMonitoring-navBar-inSet">
				<span class="iconfont">&#xe613;</span>
			</a>
		</div>
		<a href="javascript:;" @click="clickOutset" id="EquipmentMonitoring-navBar-outSet">
			<span class="iconfont">&#xe614;</span>
		</a>

		<div class="systemSettings-routerView" id="EquipmentMonitoring_right">
			<Box>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>监测管理</el-breadcrumb-item>
						<el-breadcrumb-item>设备监测</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="padding20">
					<!--表单-->
					<el-form :model="formItem" inline label-width="150px">
						<el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + ':'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowTypePopover" ref="popover">
								<el-tree :data="equipmentTypeList" highlight-current :expand-on-click-node="false" @node-click="clickTypeNode" :props="defaultProps" />
								<el-input v-model="formItem.equipmentType" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
							</el-popover>
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.equipmentNameInfo') + ':'">
							<el-input v-model="formItem.equipmentName" class="width200" />
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.serialNumber') + ':'">
							<el-input v-model="formItem.serialNumber" class="width200" />
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.computerRoomName') + ':'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopover" ref="popover">
								<el-tree :data="computerRoomList" highlight-current :expand-on-click-node="false" @node-click="clickRoomNode" :props="defaultProps" />
								<el-input v-model="formItem.computerRoom" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly slot="reference" />
							</el-popover>
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.rackNameInfo') + ':'">
							<el-select v-model="formItem.rackName" class="width200">
								<el-option v-for="(item,index) in rackNameList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.relateBusiness') + ':'">
							<el-input v-model="formItem.business" class="width200" />
						</el-form-item>
						<el-form-item :label="$t('alarmCurrent.equipmentStatus') + ':'">
							<el-select v-model="formItem.equipmentStatus" class="width200">
								<el-option v-for="(item,index) in equipmentStatusList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('EquipmentMonitoring.manufacturer')+ ':'">
							<el-select v-model="formItem.dealWithStatus" class="width200">
								<el-option v-for="(item,index) in dealWithStatusList" :key="index" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
					</el-form>
					<!--表格-->
					<el-table :data="tableData" stripe @cell-click="cellClickColumn">
						<el-table-column type="selection" label="$t('EquipmentMonitoring.FutureGenerations')" width="55">
						</el-table-column>
						<!--序号-->
						<el-table-column :label="$t('public.index')" header-align="left" align="left">
							<template slot-scope="scope">
								<span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
							</template>
						</el-table-column>
						<!--监测状态-->
						<el-table-column :label="$t('EquipmentMonitoring.workStatus')" prop="workStatus" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.workStatus == 11" effect="dark" content="禁止" placement="top-start">
									<span class="iconfont iconfontError">&#xe609;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.workStatus == 22" effect="dark" content="暂时忽略" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe608;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.workStatus == 33" effect="dark" content="启用监测" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>

							</template>
						</el-table-column>
						<!--设备状态-->
						<el-table-column prop="status" :label="$t('EquipmentMonitoring.status')" header-align="left" align="left">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.status == 99" effect="dark" content="紧急" placement="top-start">
									<span class="iconfont iconfontError">&#xe609;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 66" effect="dark" content="警告" placement="top-start">
									<span class="iconfont iconfontWarn">&#xe608;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 23" effect="dark" content="暂时忽略" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 22" effect="dark" content="离线忽略" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 11" effect="dark" content="离线禁止" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 33" effect="dark" content="正常" placement="top-start">
									<span class="iconfont iconfontDisable">&#xe60a;</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--资产信息-->
						<el-table-column prop="AssetInformation" :label="$t('EquipmentMonitoring.AssetInformation')" header-align="left" align="left" />
						<!--<template slot-scope="scope">
						<el-tooltip effect="dark" placement="left-start">
							<div slot="content" style="width: 150px">{{scope.row.alarmContent}}</div>
							<span>{{scope.row.alarmContent}}</span>
						</el-tooltip>
					</template>-->
						<!--序列号-->
						<el-table-column prop="servicetag" :label="$t('EquipmentMonitoring.servicetag')" header-align="left" align="left" />
						<!--厂商型号-->
						<el-table-column prop="ManufacturersModel" :label="$t('EquipmentMonitoring.ManufacturersModel')" header-align="left" align="left" />
						<!--设备类型-->
						<el-table-column prop="type" :label="$t('EquipmentMonitoring.type')" header-align="left" align="left" />
						<!--更新时间-->
						<el-table-column prop="lastMonitorTime" :label="$t('EquipmentMonitoring.lastMonitorTime')" header-align="left" align="left" />
						<!--操作-->
						<el-table-column prop="operation" :label="$t('EquipmentMonitoring.operation')" header-align="left" align="left" />

						<!--<el-table-column :label="$t('alarmCurrent.lastAlarmTime')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.lastModifiedTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('alarmCurrent.statusAll')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
              <span class="iconfont iconfontError">&#xe609;</span>
						<span>22</span>
						</span>
						<span>
              <span class="iconfont iconfontWarn">&#xe608;</span>
						<span>222</span>
						</span>
						<span>
              <span class="iconfont iconfontDisable">&#xe60a;</span>
						<span>12</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="computerRoomName" :label="$t('alarmCurrent.computerRoomName')" header-align="left" align="left" />
				<el-table-column prop="rackName" :label="$t('alarmCurrent.rackName')" header-align="left" align="left" />
				<el-table-column prop="location" :label="$t('alarmCurrent.location')" header-align="left" align="left" />
				<el-table-column prop="ip" :label="$t('alarmCurrent.Ip')" header-align="left" align="left" />
				<el-table-column prop="equipmentType" :label="$t('alarmCurrent.equipmentType')" header-align="left" align="left" />
				<el-table-column prop="equipmentOwner" :label="$t('alarmCurrent.equipmentOwner')" header-align="left" align="left" />
				<el-table-column prop="processStatus" :label="$t('alarmCurrent.processStatus')" header-align="left" align="left" />-->
					</el-table>
					<!--分页-->
					<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize" @handleCurrentChangeSub="handleCurrentChange" />
				</div>

				<!--设备告警详情弹出层-->
				<el-dialog class="EquipmentMonitoringBox" :title="$t('alarmCurrent.addUpdateAlarm')" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
					<div class="dialogTitle">{{$t('alarmCurrent.equipmentInfo')}}</div>
					<el-form :model="equipmentData" inline label-position="right" label-width="76px">
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentName') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.productName') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentIp') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.UUID') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.equipmentVendor') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.serialNumber') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.objectType') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.severityLevel') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.alarmNumber') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.eventType') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.createTime') + ':'"></el-form-item>
						<el-form-item style="width: 33%;" :label="$t('alarmCurrent.lastTime') + ':'"></el-form-item>
					</el-form>
					<div class="dialogTitle">{{$t('alarmCurrent.alarmInfo')}}</div>
					<el-form inline label-position="right" label-width="76px">
						<p class="paddingLeft-10"><strong>{{$t('alarmCurrent.alarmField')}}</strong></p>
						<el-form-item :label="$t('alarmCurrent.status') + ':'">Down != Up</el-form-item>
						<p class="paddingLeft-10"><strong>{{$t('alarmCurrent.currentStatus')}}</strong></p>
						<el-form-item style="width: 50%;" :label="$t('alarmCurrent.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
						<el-form-item :label="$t('alarmCurrent.status') + ':'">Down</el-form-item>
						<p class="paddingLeft-10"><strong>{{$t('alarmCurrent.addField')}}</strong></p>
						<el-form-item :label="$t('alarmCurrent.status') + ':'">Down != Up</el-form-item>
						<p class="paddingLeft-10"><strong>{{$t('alarmCurrent.addInfo')}}</strong></p>
						<el-form-item style="width: 60%;" :label="$t('alarmCurrent.productName') + ':'">Intel(R) Gigabit 4P I350-t rNDC - EC:F4:BB:C1:0C:CA</el-form-item>
						<el-form-item style="width: 30%;" :label="$t('alarmCurrent.name') + ':'">NIC.Integrated.1-3-1</el-form-item>
						<br>
						<el-form-item style="width: 30%;" :label="$t('alarmCurrent.AutoNegotiation') + ':'">Enabled</el-form-item>
						<el-form-item style="width: 30%;" :label="$t('alarmCurrent.linkSpeed') + ':'">Unknown</el-form-item>
						<el-form-item style="width: 30%;" :label="$t('alarmCurrent.macLocation') + ':'">EC:F4:BB:C1:0C:CA</el-form-item>
						<el-form-item :label="$t('alarmCurrent.alarmDescription') + ':'">
							<el-input type="textarea" style="width: 734px;" />
						</el-form-item>
					</el-form>
					<span slot="footer">
        <el-button type="primary">{{$t('public.ignoreAlarm')}}</el-button>
        <el-button type="primary">{{$t('public.confirmAlarm')}}</el-button>
        <el-button type="primary">{{$t('public.toWarranty')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
				</el-dialog>
				<!--设备责任人弹出层-->
				<el-dialog :title="$t('alarmCurrent.ownerInfo')" append-to-body :visible.sync="dialogVisibleOwnerInfo" :close-on-click-modal="false" :close-on-press-escape="false">
					<el-form label-width="150px">
						<el-form-item :label="$t('alarmCurrent.userName') + ':'"></el-form-item>
						<el-form-item :label="$t('alarmCurrent.organizationName') + ':'"></el-form-item>
						<el-form-item :label="$t('alarmCurrent.businessCode') + ':'"></el-form-item>
						<el-form-item :label="$t('alarmCurrent.email') + ':'"></el-form-item>
						<el-form-item :label="$t('alarmCurrent.phoneNumber') + ':'"></el-form-item>
					</el-form>
					<span slot="footer">
        <el-button class="queryBtn" type="primary">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="dialogVisibleOwnerInfo = false">{{$t('public.cancel')}}</el-button>
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
		</div>

	</Box>
</template>

<script>
	import Box from '../../../components/Box';
	import AdministrationTags from '../../../components/AdministrationTabs';
	export default {
		name: "EquipmentMonitoring",
		components: {
			Box,
			AdministrationTags
		},
		data() {
			return {
				// 查询表单
				formItem: {
						type: 1, /*设备类型*/
						catalogId:null, /*目录ID 左侧树形控件*/
						/*ip: IP地址*/
						manufacturer:null,/*厂商*/
						servicetag: null,/*序列号*/
						roomId: null,/*机房ID*/
						frameId: null,/*机架ID*/
						status: null,/*状态*/
						business:null,/*业务ID*/
				},
				// 设备告警详情提交字段
				addEdit: {
					id: ''
				},
				// 设备告警详情数据
				equipmentData: {},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],
				// 机房树形下拉框的数据
				computerRoomList: [],
				// 机架下拉框数据
				rackNameList: [],
				// 设备状态下拉框
				equipmentStatusList: [],
				// 表格数据
				tableData: [{
					id: '1',
					status: 1,
					equipmentName: '惠普1',
					alarmContent: '告警内容告警内容告警内容告警内容告,警内容告警内容告警内容告警内容告警内容告警内容告警内,容告警内容告警内容告警内容告警内容告警内容',
					lastModifiedTime: '2019-02-10 12:22:11',
					equipmentOwner: '张三'
				}, ],
				// 处理状态
				dealWithStatusList: [],
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowComputerPopover: false, // 控制机房下拉框的显示隐藏
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示
				dialogVisible: false, // 设备详情信息弹出层
				dialogVisibleOwnerInfo: false, // 业务责任人信息弹出层
				defaultProps: {},
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
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
				isShow: true,
				levelList: null,
				//树形控件模拟数据
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

			}
		},
		mounted() {
			this.manufacturerDropDown();
			this.getData();
		},
		methods: {
			// 点击设备类型下拉框节点
			clickTypeNode(val) {},
			// 点击机房下拉框的节点
			clickRoomNode(val) {},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						/*assetDevice: {
							type: '',
							catalogId: '',
							ip: '',
							servicetag: '',
							roomId: '',
							frameId: '',
							status: '',
							business:'',
						},*/
						currentPage: 1,
						pageSize: 10
					})
				}, function(res) {
					switch(res.status) {
						case 200:
							console.log(res);
							var Income1 = res.data.list;
							//console.log(Income);
							var Income = [];
							for(var i = 0; i < Income1.length; i++) {
								if(Income1[i].type == '1') {
									Income1[i].type = "机架/塔式服务器"
								} else if(Income1[i].type == '2') {
									Income1[i].type = "网络设备"
								} else if(Income1[i].type == '3') {
									Income1[i].type = "小型机"
								} else if(Income1[i].type == '4') {
									Income1[i].type = "刀片/刀箱"
								} else if(Income1[i].type == '5') {
									Income1[i].type = "刀片/刀箱"
								}

								Income.push({
									workStatus: Income1[i].workStatus,
									/*监测状态*/
									status: Income1[i].status,
									/*设备状态*/
									AssetInformation: Income1[i].deviceName + ',' + Income1[i].ip,
									/*资产信息*/
									servicetag: Income1[i].servicetag,
									/*序列号*/
									ManufacturersModel: Income1[i].manufacturer + ',' + Income1[i].model,
									/*厂商型号*/
									type: Income1[i].type,
									/*设备类型*/
									lastMonitorTime: Income1[i].lastMonitorTime,
									/*更新时间*/
									operation: Income1[i].operation,
									/*操作*/

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
			// 导出excel数据
			downloadData() {},
			// 改变当前页码
			handleCurrentChange(val) {
				var _t = this;
				_t.options.currentPage = val;
				_t.getData();
			},
			// 单元格点击
			cellClickColumn(row, column) {

				/*
				 * 点击表格的单元格
				 *    row 当前行绑定的 数据
				 *    column 当前 单元格的 属性
				 */
				var _t = this;
				// 点击设备状态列
				if(column.label == _t.$t('EquipmentMonitoring.status')) {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}

				/*if(column.label == _t.$t('alarmCurrent.status')) {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}*/
				// 点击资产信息列
				if(column.label == _t.$t('EquipmentMonitoring.AssetInformation')) {
					_t.addTab(row.AssetInformation, row.id);
				}

				/*// 点击设备名称列
				if(column.label == _t.$t('alarmCurrent.equipmentName')) {
					_t.addTab(row.equipmentName, row.id);
				}*/
				/*// 点击告警内容列
				if(column.label == _t.$t('alarmCurrent.alarmContent')) {
					_t.dialogVisible = true;
					_t.addEdit.id = row.id;
				}*/
				/*// 点击最新告警时间列
				if(column.label == _t.$t('alarmCurrent.lastAlarmTime')) {
					_t.addTab(row.equipmentName, row.id);
				}*/
				/*// 点击设备责任人列
				if(column.label == _t.$t('alarmCurrent.equipmentOwner')) {
					_t.dialogVisibleOwnerInfo = true;
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
			// 收缩
			clickInset() {
				this.isShow = false;
				document.getElementById('EquipmentMonitoring-navBar-outSet').style.display = 'inline-block';
				document.getElementById('EquipmentMonitoring_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isShow = true;
				document.getElementById('EquipmentMonitoring-navBar-outSet').style.display = 'none';
				document.getElementById('EquipmentMonitoring_right').style.left = '174px';
			},
			// 获取选中的节点
			getCurrentNode(data) {
				var _t = this;
				_t.formItem.nodeId = data.nodeId;
				_t.addEdit.level = data.level;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 0;
				_t.getData();
			},
			//厂商下拉框数据获取
			manufacturerDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
					var Income1 = res.data;
					console.log(Income1)
				});
			},
			//设备类型下拉框数据获取
			DeviceTypeDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
				});
			},
			//设备状态下拉框数据获取
			EquipmentStateDropDown() {
				var _t = this;
				_t.$api.get('/asset/assetDevice/manufacture', {}, function(res) {
					console.log(res);
				});
			},
			//机房下拉框数据获取
			//机架/机柜下拉框数据获取
		},

		created() {}
	}
</script>

<style scoped>
	.systemSettings-routerView {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}
	
	.systemSettings-navBar {
		width: 174px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
	}
	
	#EquipmentMonitoring-navBar-inSet,
	#EquipmentMonitoring-navBar-outSet {
		height: 40px;
		width: 20px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}
	
	#EquipmentMonitoring-navBar-inSet {
		left: 210px;
		border-radius: 15px 0 0 15px;
	}
	
	#EquipmentMonitoring-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}
</style>
<style>
	#systemSettings-navBar-inSet,
	#systemSettings-navBar-outSet {
		background-color: #3f81d0;
		color: #fff;
	}
	
	.EquipmentMonitoringBox .el-dialog {
		width: 880px;
		height: 600px;
	}
	
	.EquipmentMonitoringBox .el-dialog__body {
		padding-top: 10px;
	}
	
	.alarmCurrentBox .el-form--inline .el-form-item {
		margin: 0;
	}
	
	#alarmCurrent-tabs {
		position: fixed;
		bottom: 0;
		right: 20px;
		left: 80px;
		top: 118px;
		z-index: 1100;
		border: 1px solid #000;
	}
	
	#alarmCurrent-tabs .el-tabs__header.is-bottom {
		margin-top: 0;
		position: absolute;
		bottom: 0;
		left: -24px;
		right: -20px;
		background-color: gray;
	}
	
	#alarmCurrent-tabs .el-tabs__content {
		position: fixed;
		left: 100px;
		right: 40px;
		bottom: 50px;
		top: 150px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	
	.alarmCurrent-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 100;
	}
</style>