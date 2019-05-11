<template>
	<Box>
		<div v-show="isShow" class="systemSettings-navBar">
			<div class="borderRightColorGray">
				<p class="dataDictionary-title">
					<a href="javascript:;" @click="clickNode">{{$t('EquipmentMonitoring.EquipmentGroup')}}</a>
					<el-button type="text" @click="appendDevice">{{$t('EquipmentMonitoring.news')}}</el-button>
					<el-dialog class="EquipmentMonitoringGrid" :close-on-click-modal="false"
							   :close-on-press-escape="false" append-to-body title="新增设备分组"
							   :before-close="handleDialogClose" :visible.sync="dialogGrouping">
						<div class="padding20" style="padding-top:0;">
							<label style="padding-right:10px ;">{{$t('EquipmentMonitoring.TheParentNode')}}</label>
							<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopoversss"
										ref="popover">
								<el-tree :data="treeData" highlight-current :expand-on-click-node="true"
										 @node-click="clickRoomNodess" :props="defaultPropsssa"/>
								<el-input v-model="addEditss.nodeName" style="width: 200px;"
										  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
							</el-popover>
						</div>
						<el-table :data="assetCatalogList" @row-contextmenu="openDetails" border align="center" indent
								  style="width: 100%">
							<el-table-column :label="$t('EquipmentMonitoring.TheLineNumbers')" align="center"
											 width="50">
								<template slot-scope="scope">
									{{scope.$index+1}}
								</template>
							</el-table-column>
							<el-table-column :label="$t('EquipmentMonitoring.check')" align="center" width="50">
								<template slot-scope="scope">
									<el-tooltip effect="dark" :content="scope.row.verifyMsg" placement="top-start">
										<span>{{scope.row.verify}}</span>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column :label="$t('EquipmentMonitoring.TheFirst')" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount0" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column :label="$t('EquipmentMonitoring.TheSecond')" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount1" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column :label="$t('EquipmentMonitoring.TheThird')" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount2" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column :label="$t('EquipmentMonitoring.TheFourth')" align="center">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.amount3" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
						</el-table>

						<div v-show="dialogGroupingNei">
							<ul id="menu1" class="menu1">
								<li class="menu1__item  cursorPointer">
									<span>{{$t('EquipmentMonitoring.InsertAbove')}}</span>
									<el-input v-model="aboveAddNum" style="width:50px"/>
									<span> {{$t('EquipmentMonitoring.line')}} </span>
									<el-button @click="getClick('above')"> {{$t('EquipmentMonitoring.determine')}}
									</el-button>
								</li>
								<li class="menu1__item  cursorPointer">
									<span>{{$t('EquipmentMonitoring.BelowTheInsert')}}</span>
									<el-input v-model="belowAddNum" style="width:50px"/>
									<span> {{$t('EquipmentMonitoring.line')}} </span>
									<el-button @click="getClick('below')"> {{$t('EquipmentMonitoring.determine')}}
									</el-button>
								</li>
								<li class="menu1__item  cursorPointer">
									<span style="display: block;" @click="delClick">{{$t('EquipmentMonitoring.DeleteTheBank')}}</span>
								</li>
							</ul>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="getAddAssetGroup">
								{{$t('EquipmentMonitoring.determine')}}
							</el-button>
							<el-button @click="getAddAssetGroupQx">{{$t('EquipmentMonitoring.cancel')}}</el-button>
						</div>
					</el-dialog>
					<!--编辑设备分组-->
					<el-dialog class="EquipmentMonitoringBj" :close-on-click-modal="false"
							   :close-on-press-escape="false" append-to-body
							   :title="$t('EquipmentMonitoring.EditDeviceGrouping')" :visible.sync="dialogGroupingBj">
						<el-form :model="formItem" inline label-width="150px" :rules="rules" ref="roleName">
							<el-form-item label="父级节点:">
								<el-popover trigger="click" placement="bottom-start" v-model="isShowComputerPopoverss"
											ref="popover">
									<el-tree :data="treeData" highlight-current :expand-on-click-node="false"
											 @node-click="clickRoomNodes" :props="defaultPropsss"/>
									<el-input v-model="addEdits.nodeName" style="width: 200px;"
											  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
								</el-popover>
							</el-form-item>
							<el-form-item class="star" label="节点名称:" prop="catalogName">
								<el-input v-model="formItem.catalogName" class="width200" clearable></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="getEditDevice('roleName')">
								{{$t('EquipmentMonitoring.determine')}}
							</el-button>
							<el-button @click="dialogGroupingBj = false">{{$t('EquipmentMonitoring.cancel')}}
							</el-button>
						</div>
					</el-dialog>
					<el-dialog class="EquipmentMonitoringSc" :close-on-click-modal="false"
							   :close-on-press-escape="false" :title="$t('EquipmentMonitoring.confirmation')"
							   :visible.sync="dialogGroupingSc" append-to-body :before-close="handleClose" width="30%">
						<span>请问是否确认删除当前的记录?</span>
						<span slot="footer" class="dialog-footer">
							<el-button type="primary"
									   @click="getRemove">{{$t('EquipmentMonitoring.determine')}}</el-button>
							<el-button
								@click="dialogGroupingSc = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
						</span>
					</el-dialog>
					<!--{{formItem.menuName}}-->
				</p>
				<el-tree class="dataDictionary-tree" :data="treeData" highlight-current node-key="idd"
						 @node-click="getCurrentNode" @node-contextmenu="rightClick" :props="defaultPropssss"
						 :expand-on-click-node="true" :default-expand-all="false">
					<span class="custom-tree-node" slot-scope="{ node, data}">
						<span>{{ node.label }}</span>
					</span>
				</el-tree>
				<div v-show="menuVisible">
					<ul id="menu" class="menu">
						<li class="menu__item cursorPointer" @click="appendDevice"><i class="el-icon-share"> 增加</i></li>
						<li class="menu__item cursorPointer" @click="EditDevice"><i class="el-icon-edit"> 编辑</i></li>
						<li class="menu__item cursorPointer" @click="remove" v-if="showVisible"><i
							class="el-icon-delete"> 删除</i></li>
					</ul>
				</div>
			</div>
			<a href="javascript:;" @click="clickInset" id="EquipmentMonitoring-navBar-inSet">
				<span class="iconfont">&#xe68b;</span>
			</a>
		</div>
		<a href="javascript:;" @click="clickOutset" id="EquipmentMonitoring-navBar-outSet">
			<span class="iconfont">&#xe69d;</span>
		</a>

		<div class="systemSettings-routerView" id="EquipmentMonitoring_right">
			<Box>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.equipmentMonitoring')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="padding20 borderBottom borderBottom_formItem">
					<!--表单-->
					<el-form :model="formItem" inline label-width="120px">
						<!--设备分类/类型-->
						<el-form-item :label="$t('alarmCurrent.equipmentTypeInfo') + '：'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowTypePopover"
										ref="popover">
								<el-tree :data="equipmentTypeList" highlight-current :expand-on-click-node="false"
										 @node-click="clickTypeNode" :props="defaultProps"/>
								<el-input v-model="formItem.equipmentType" style="width: 200px;"
										  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
							</el-popover>
						</el-form-item>
						<!--设备名称/资产信息-->
						<el-form-item :label="$t('alarmCurrent.equipmentNameInfo') + '：'">
							<el-input v-model="formItem.equipmentName" class="width200"/>
						</el-form-item>
						<!--序列号-->
						<el-form-item :label="$t('alarmCurrent.serialNumber') + '：'">
							<el-input v-model="formItem.serialNumber" class="width200"/>
						</el-form-item>
						<!--机房-->
						<el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">
							<el-select v-model="formItem.computerRoomId" @change="changeRoom(formItem.computerRoomId)"
									   class="width200">
								<el-option v-for="(item,index) in computerRoomList" :key="index" :label="item.name"
										   :value="item.id"/>
							</el-select>
						</el-form-item>
						<!--机架/机柜-->
						<el-form-item :label="$t('alarmCurrent.rackNameInfo') + '：'">
							<el-select v-model="formItem.rackNameId" class="width200" clearable>
								<el-option v-for="(item,index) in rackNameList" :key="index" :label="item.name"
										   :value="item.id"/>
							</el-select>
						</el-form-item>
						<!--关联业务-->
						<el-form-item :label="$t('alarmCurrent.relateBusiness') + '：'">
							<el-popover trigger="click" placement="bottom-start" v-model="isShowBusinessPopover"
										ref="popover">
								<el-tree :data="businessTreeData" highlight-current :expand-on-click-node="false"
										 @node-click="clickBusinessNode" :props="defaultPropsBusiness"/>
								<el-input v-model="formItem.businessName" readonly style="width: 200px;"
										  suffix-icon="el-icon-arrow-down" slot="reference"/>
							</el-popover>
						</el-form-item>
						<!--设备状态-->
						<el-form-item :label="$t('alarmCurrent.equipmentStatus') + '：'">
							<el-select v-model="formItem.equipmentStatus" class="width200" clearable>
								<el-option v-for="(item,index) in formBaseData.AlarmSeverity" :key="index"
										   :label="item.name" :value="item.type"/>
							</el-select>
						</el-form-item>
						<!--厂商  manufacturer-->
						<el-form-item :label="$t('EquipmentMonitoring.manufacturer')+ '：'">
							<el-select v-model="formItem.manufacturer" class="width200">
								<el-option v-for="(item,index) in manufacturerList" :key="index" :label="item.name"
										   :value="item.value"/>
							</el-select>
						</el-form-item>
						<!--查询按钮-->
						<el-form-item>
							<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}
							</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
						<!--重置按钮-->
						<el-form-item>
							<el-button class="queryBtn" type="reset" @click="formReset">{{$t('public.reset')}}
							</el-button>
							<!--<el-button type="primary" @click="downloadData">{{$t('alarmCurrent.exportExcel')}}</el-button>-->
						</el-form-item>
					</el-form>
				</div>
				<div class="padding20">
					<!--按钮-->
					<div class="marBottom16">
						<!--转移分组-->
						<el-button @click="TransferOfGrouping">
							<span class="iconfont">&#xe65b;</span>
							{{$t('EquipmentMonitoring.TransferOfGrouping')}}
						</el-button>
						<el-dialog
							class="TransferOfGroupingClass"
							:close-on-click-modal="false"
							:close-on-press-escape="false"
							:before-close="getTransferOfGroupingQx" append-to-body
							:title="$t('EquipmentMonitoring.TransferOfGrouping')"
							:visible.sync="TransferOfGroupingBg">
							<div style="overflow: hidden;">
								<div class="TransferOfGrouping_left">
									<span class="TransferOfGrouping_left_span">需要迁移的设备</span>
									<el-form :model="forssItems" inline>
										<el-form-item>
											<el-popover trigger="click" placement="bottom-start"
														v-model="isShowAddDeviceMonitoringtree" ref="popover">
												<el-tree :data="equipmentTypeList" highlight-current
														 :expand-on-click-node="false"
														 @node-click="clickAddDeviceTypeNode"
														 :props="AddDeviceTypeNode"/>
												<el-input v-model="forssItems.type" class="width180"
														  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
											</el-popover>
										</el-form-item>
										<el-form-item>
											<el-input class="width180" placeholder="请输入设备名称/Ip"/>
										</el-form-item>
										<el-form-item>
											<el-tree
												id="dataLimit-box-tree"
												node-key="nodeId"
												:data="dataInfoResourceTree"
												:props="dataInfoTreeProps"
												show-checkbox
												:check-strictly="true"
												:default-expanded-keys="['tree_other']"
												ref="vueTree"/>
										</el-form-item>
									</el-form>
								</div>
								<div class="TransferOfGrouping_right">
									<span class="TransferOfGrouping_right_span">目标目录</span>
									<el-form inline>
										<el-form-item>
											<el-input :placeholder="'请输入设备名称Ip'"/>
										</el-form-item>
										<el-form-item>
											<el-tree >

											</el-tree>
										</el-form-item>
									</el-form>
								</div>
							</div>
							<div slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getTransferOfGrouping">
									{{$t('EquipmentMonitoring.TheNextStep')}}
								</el-button>
								<el-button @click="getTransferOfGroupingQx">{{$t('EquipmentMonitoring.cancel')}}
								</el-button>
							</div>
						</el-dialog>
						<!--添加设备监测-->
						<el-button @click="AddDeviceMonitoring"><i class="el-icon-circle-plus-outline">{{$t('EquipmentMonitoring.AddTheMonitor')}}</i>
						</el-button>
						<el-dialog class="AddEquipmentMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" :before-close="handleDialogCloseOne" append-to-body
								   :title="$t('EquipmentMonitoring.AddTheMonitor')"
								   :visible.sync="AddDeviceMonitoringBg">
							<div class="AddEquipmentMonitoring_box">
								<div class="AddEquipmentMonitoring_left">
									<el-tree :data="treeData" highlight-current :expand-on-click-node="true"
											 @node-click="ClickAddDeviceMonitor" :props="AddDeviceMonitor"/>
								</div>
								<div class="AddEquipmentMonitoring_right">
									<el-form :model="forssItem" inline :rules="rules" ref="mack">
										<el-form-item>
											<el-popover trigger="click" placement="bottom-start"
														v-model="isShowAddDeviceMonitoringtree" ref="popover">
												<el-tree :data="equipmentTypeList" highlight-current
														 :expand-on-click-node="false"
														 @node-click="clickAddDeviceTypeNode"
														 :props="AddDeviceTypeNode"/>
												<el-input v-model="forssItem.type" style="width: 200px;"
														  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
											</el-popover>
										</el-form-item>
										<el-form-item prop="ips">
											<el-input v-model="forssItem.ips" placeholder="请输入Ip地址"
													  class="width200"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button class="queryBtn" type="primary" @click="getDataTwe('mack')">
												{{$t('public.query')}}
											</el-button>
										</el-form-item>
									</el-form>
									<!--添加设备监测表格-->
									<el-table border :data="tableDataOne" stripe
											  @selection-change="handleSelectionChangeOne">
										<el-table-column type="selection"
														 :label="$t('EquipmentMonitoring.FutureGenerations')"
														 width="55"
														 header-align="center"
														 align="left">
										</el-table-column>
										<!--序号-->
										<el-table-column width="60px"
														 :label="$t('public.index')"
														 header-align="center"
														 align="left">
											<template slot-scope="scope">
												<span>
                                                    {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                                                </span>
											</template>
										</el-table-column>
										<!--ip-->
										<el-table-column :label="$t('EquipmentMonitoring.ip')"
														 header-align="center"
														 align="left">
											<template slot-scope="scope">
												<span>{{scope.row.ip}}</span>
											</template>
										</el-table-column>
										<!--设备名称-->
										<el-table-column :label="$t('EquipmentMonitoring.DeviceName')"
														 header-align="left"
														 align="left">
											<template slot-scope="scope">
												<span>{{scope.row.deviceName}}</span>
											</template>
										</el-table-column>
										<!--设备类型-->
										<el-table-column prop=""
														 :label="$t('EquipmentMonitoring.DeviceType')"
														 header-align="left" align="left">
											<template slot-scope="scope">
												<el-tooltip effect="dark"
															:content="tableDataBase.AssetType[scope.row.type]"
															placement="top-start">
													<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
												</el-tooltip>
											</template>
										</el-table-column>
										<!--序列号-->
										<el-table-column :label="$t('EquipmentMonitoring.servicetag')"
														 header-align="left" align="left">
											<template slot-scope="scope">
												<el-tooltip effect="dark" :content="scope.row.servicetag"
															placement="top-start">
													<span>{{scope.row.servicetag}}</span>
												</el-tooltip>
											</template>
										</el-table-column>
										<!--厂商型号-->
										<el-table-column prop="" :label="$t('EquipmentMonitoring.ManufacturersModel')"
														 header-align="left" align="left">
											<template slot-scope="scope">
												<el-tooltip effect="dark"
															:content="scope.row.manufacturer+','+scope.row.model"
															placement="top-start">
													<span>{{scope.row.manufacturer}},{{scope.row.model}}</span>
												</el-tooltip>
											</template>
										</el-table-column>
										<!--状态=设备发现描述-->
										<el-table-column prop="" :label="$t('EquipmentMonitoring.state')"
														 header-align="left" align="left">
											<template slot-scope="scope">
												<span v-if="scope.row.isResultFalse == 1"></span>
												<span v-if="scope.row.isResultFalse == 2">成功</span>
												<span v-if="scope.row.isResultFalse == 3">失败</span>
											</template>
										</el-table-column>
									</el-table>
								</div>
							</div>
							<div slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getAddDevicemonitoring">
									{{$t('EquipmentMonitoring.TheNextStep')}}
								</el-button>
								<el-button @click="getAddDevicemonitoringQx">{{$t('EquipmentMonitoring.cancel')}}
								</el-button>
							</div>
						</el-dialog>
						<!--下一页-->
						<el-dialog class="ModifyMonitoringSettings" :close-on-click-modal="false"
								   :close-on-press-escape="false" :before-close="getAddDevicemonitoringNextQx"
								   append-to-body :title="$t('EquipmentMonitoring.AddTheMonitor')"
								   :visible.sync="AddDeviceMonitoringNextBg">
							<el-form inline :model="forsItem">
								<!--带外用户名-->
								<el-form-item :label="$t('DeviceManualDetection.username') + '：'">
									<el-input v-model="forsItem.username" class="width200" clearable></el-input>
								</el-form-item>
								<!--带外用户密码-->
								<el-form-item :label="$t('DeviceManualDetection.password') + '：'">
									<el-input type="password" v-model="forsItem.password" class="width200"
											  clearable></el-input>
								</el-form-item>
								<!--端口-->
								<el-form-item :label="$t('DeviceManualDetection.port') + '：'">
									<el-input v-model="forsItem.port" class="width200" clearable></el-input>
								</el-form-item>
								<!--snmp版本-->
								<el-form-item :label="$t('DeviceManualDetection.snmpVersion') + '：'">
									<el-select v-model="forsItem.snmpVersion" placeholder="请选择" class="width200"
											   clearable>
										<el-option v-for="item in version" :key="item.value" :label="item.label"
												   :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<!--snmp端口-->
								<el-form-item :label="$t('DeviceManualDetection.snmpPort') + '：'">
									<el-input v-model="forsItem.snmpPort" class="width200" clearable></el-input>
								</el-form-item>
								<!--snmp团体名-->
								<el-form-item v-if="forsItem.snmpVersion=='2c'||forsItem.snmpVersion=='1'"
											  :label="$t('DeviceManualDetection.snmpCommunity') + '：'">
									<el-input type="password" v-model="forsItem.snmpCommunity" class="width200"
											  clearable></el-input>
								</el-form-item>
								<!--snmp用户名-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpUsername') + '：'">
									<el-input v-model="forsItem.snmpUsername" class="width200" clearable></el-input>
								</el-form-item>
								<!--snmp安全级别-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpSecurityLevel') + '：'">
									<el-select v-model="forsItem.snmpSecurityLevel" placeholder="请选择" clearable
											   class="width200" @change="selectsnmpSecurityLevels(forsItem)">
										<el-option v-for="item in SecurityLevel" :key="item.value" :label="item.label"
												   :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<!--snmp验证算法-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpAuthAlgorithm') + '：'">
									<el-select v-model="forsItem.snmpAuthAlgorithm" clearable placeholder="请选择"
											   class="width200"
											   :disabled="forsItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='authPriv') ? false:false">
										<el-option v-for="item in VerifyTheAlgorithm" :key="item.value"
												   :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<!--snmp验证密码-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpAuthPassword') + '：'">
									<el-input type="password" v-model="forsItem.snmpAuthPassword" class="width200"
											  clearable
											  :disabled="forsItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
								</el-form-item>
								<!--snmp私有验证算法-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpPrivacyAlgorithm') + '：'">
									<el-select v-model="forsItem.snmpPrivacyAlgorithm" placeholder="请选择"
											   class="width200" clearable
											   :disabled="(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forsItem.snmpSecurityLevel==='authPriv') ? false:false">
										<el-option v-for="item in PrivateVerificationAlgorithm " :key="item.value"
												   :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<!--snmp私有验证密码-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpPrivacyPassword') + '：'">
									<el-input type="password" v-model="forsItem.snmpPrivacyPassword" class="width200"
											  clearable
											  :disabled="(forsItem.snmpSecurityLevel==='authNoPriv'||forsItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forsItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
								</el-form-item>
								<!--snmp文本名称-->
								<el-form-item v-if="forsItem.snmpVersion=='3'"
											  :label="$t('DeviceManualDetection.snmpContextName') + '：'">
									<el-input v-model="forsItem.snmpContextName" class="width200" clearable></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer">
								<el-button @click="egtThePreviousPage">{{$t('EquipmentMonitoring.ThePreviousPage')}}
								</el-button>
								<el-button type="primary" @click="getAddDevicemonitoringNext">
									{{$t('EquipmentMonitoring.determine')}}
								</el-button>
								<el-button @click="getAddDevicemonitoringNextQx">{{$t('EquipmentMonitoring.cancel')}}
								</el-button>
							</div>
						</el-dialog>
						<!--启动监测-->
						<el-button @click="StartMonitoring"><span class="iconfont">&#xe68d; </span>{{$t('EquipmentMonitoring.StartTheMonitoring')}}
						</el-button>
						<el-dialog class="StartTheMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" append-to-body
								   :title="$t('EquipmentMonitoring.confirmation')" :visible.sync="StartTheMonitoringBg">
							<span>请问是否确认要启动监测?</span>
							<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getStartTheMonitoring">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button
									@click="StartTheMonitoringBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                            </span>
						</el-dialog>
						<!--暂停监测-->
						<el-button @click="SuspendMonitoring"><span class="iconfont">&#xe64b; </span>{{$t('EquipmentMonitoring.SuspendMonitoring')}}
						</el-button>
						<el-dialog class="StartTheMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" append-to-body
								   :title="$t('EquipmentMonitoring.confirmation')" :visible.sync="SuspendMonitoringBg">
							<span>请问是否确认要暂停监测?</span>
							<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getSuspendMonitoring">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button
									@click="SuspendMonitoringBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                            </span>
						</el-dialog>
						<!--删除监测-->
						<el-button @click="DeleteTheMonitoring"><span class="iconfont">&#xe650; </span>{{$t('EquipmentMonitoring.DeleteTheMonitoring')}}
						</el-button>
						<el-dialog class="StartTheMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" append-to-body
								   :title="$t('EquipmentMonitoring.confirmation')"
								   :visible.sync="DeleteTheMonitoringBg">
							<span>请问是否确认要删除监测?</span>
							<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getDeleteTheMonitoring">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button
									@click="DeleteTheMonitoringBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                            </span>
						</el-dialog>
						<!--忽略告警-->
						<el-button @click="IgnoreTheAlarm"><span class="iconfont">&#xe68e; </span>{{$t('EquipmentMonitoring.IgnoreTheAlarm')}}
						</el-button>
						<el-dialog class="StartTheMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" append-to-body
								   :title="$t('EquipmentMonitoring.confirmation')" :visible.sync="IgnoreTheAlarmBg">
							<span>请问是否确认要忽略告警监测?</span>
							<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getIgnoreTheAlarm">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button
									@click="IgnoreTheAlarmBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                            </span>
						</el-dialog>
						<!--取消忽略-->
						<el-button @click="CancelToIgnore"><span class="iconfont">&#xe64e; </span>{{$t('EquipmentMonitoring.CancelToIgnore')}}
						</el-button>
						<el-dialog class="StartTheMonitoring" :close-on-click-modal="false"
								   :close-on-press-escape="false" append-to-body
								   :title="$t('EquipmentMonitoring.confirmation')" :visible.sync="CancelToIgnoreBg">
							<span>请问是否确认要取消忽略?</span>
							<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getCancelToIgnore">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button
									@click="CancelToIgnoreBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                            </span>
						</el-dialog>
						<el-button>{{$t('EquipmentMonitoring.OfflineEquipment')}}</el-button>
					</div>
					<!--表格-->
					<el-table min-width='1080px' border :data="tableData" stripe @cell-click="cellClickColumn"
							  @selection-change="handleSelectionChange">
						<el-table-column type="selection" :label="$t('EquipmentMonitoring.FutureGenerations')"
										 header-align="center" align="left" width="55">
						</el-table-column>
						<!--序号-->
						<el-table-column width="60px" :label="$t('public.index')" header-align="center" align="center">
							<template slot-scope="scope">
								<span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
							</template>
						</el-table-column>
						<!--监测状态-->
						<el-table-column width="200px" :label="$t('EquipmentMonitoring.workStatus')" prop="workStatus"
										 header-align="center" align="center">
							<template slot-scope="scope">
								<div class="displayNone" @mouseover="displayInlineBlock(scope.row)"
									 @mouseout="displayNone(scope.row)">
									<el-tooltip effect="dark"
												:content="tableDataBase.DeviceMonitorStatus[scope.row.workStatus]"
												placement="top-start">
										<span>{{tableDataBase.DeviceMonitorStatus[scope.row.workStatus]}}</span>
									</el-tooltip>
									<div v-show="scope.row.InlineBlock" class="displayInlineBlock">
										<el-tooltip v-if="scope.row.workStatus ==11" effect="dark" content="启动监测"
													placement="top-start">
											<span @click="StartMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe68d;</span>
											<!--iconfontDisable-->
										</el-tooltip>
										<el-tooltip v-if="scope.row.workStatus == 33||scope.row.workStatus == 23"
													effect="dark" content="暂停监测" placement="top-start">
											<span @click="SuspendMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe64b;</span>
											<!--iconfontDisable-->
										</el-tooltip>
										<el-tooltip
											v-if="scope.row.workStatus == 11||scope.row.workStatus == 22||scope.row.workStatus == 23||scope.row.workStatus == 33"
											effect="dark" content="删除监测" placement="top-start">
											<span @click="DeleteTheMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe650;</span>
											<!--iconfontError-->
										</el-tooltip>
										<el-tooltip v-if="scope.row.workStatus == 23||scope.row.workStatus == 33"
													effect="dark" content="忽略告警" placement="top-start">
											<span @click="IgnoreTheAlarm(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe68e;</span>
											<!--iconfontDisable-->
										</el-tooltip>
										<el-tooltip v-if="scope.row.workStatus == 22" effect="dark" content="取消忽略"
													placement="top-start">
											<span @click="CancelToIgnore(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe64e;</span>
											<!--iconfontWarn-->
										</el-tooltip>
									</div>
								</div>
							</template>
						</el-table-column>
						<!--设备状态-->
						<el-table-column width="80px" prop="status" :label="$t('EquipmentMonitoring.status')"
										 header-align="center" align="center">
							<template slot-scope="scope">
								<el-tooltip v-if="scope.row.status == 99" effect="dark"
											:content="tableDataBase.AlarmSeverity[scope.row.status]"
											placement="top-start">
									<span class="iconfont iconfontError">&#xe64a;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 66" effect="dark"
											:content="tableDataBase.AlarmSeverity[scope.row.status]"
											placement="top-start">
									<span class="iconfont iconfontWarn">&#xe649;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 22" effect="dark"
											:content="tableDataBase.AlarmSeverity[scope.row.status]"
											placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64f;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 11" effect="dark"
											:content="tableDataBase.AlarmSeverity[scope.row.status]"
											placement="top-start">
									<span class="iconfont iconfontDisable">&#xe64e;</span>
								</el-tooltip>
								<el-tooltip v-if="scope.row.status == 33" effect="dark"
											:content="tableDataBase.AlarmSeverity[scope.row.status]"
											placement="top-start">
									<span class="iconfont iconfontSuccess">&#xe648;</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--资产信息-->
						<el-table-column :label="$t('EquipmentMonitoring.AssetInformation')" header-align="center"
										 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.deviceName+','+scope.row.ip"
											placement="top-start">
									<span>{{scope.row.deviceName}},{{scope.row.ip}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--序列号-->
						<el-table-column :label="$t('EquipmentMonitoring.servicetag')" header-align="center"
										 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.servicetag" placement="top-start">
									<span>{{scope.row.servicetag}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--厂商型号-->
						<el-table-column :label="$t('EquipmentMonitoring.ManufacturersModel')" header-align="left"
										 align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.manufacturer+','+scope.row.model"
											placement="top-start">
									<span>{{scope.row.manufacturer}},{{scope.row.model}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--设备类型-->
						<el-table-column :label="$t('EquipmentMonitoring.type')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="tableDataBase.AssetType[scope.row.type]"
											placement="top-start">
									<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--更新时间-->
						<el-table-column width="160px" :label="$t('EquipmentMonitoring.lastMonitorTime')"
										 header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.lastMonitorTime | dateFilter"
											placement="top-start">
									<span>{{scope.row.lastMonitorTime | dateFilter}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--操作-->
						<el-table-column prop="operation" :label="$t('EquipmentMonitoring.operation')"
										 header-align="center" align="center">
							<template slot-scope="scope">
								<el-tooltip effect="dark" content="修改监测器阀值" placement="top-start">
									<span class="iconfont iconfontError cursorPointer"
										  @click="monitorThreshold(scope.row)">&#xe655;</span>
								</el-tooltip>
								<el-tooltip effect="dark" content="修改监测设置" placement="top-start">
									<span style="padding-left: 10px;" class="iconfont iconfontError cursorPointer"
										  @click="ModifyMonitoringSettings(scope.row)">&#xe656;</span>
								</el-tooltip>
							</template>
							<!--修改监测设置弹出层-->
							<el-dialog class="ModifyMonitoringSettings" :close-on-click-modal="false"
									   :close-on-press-escape="false" append-to-body title="修改监测设置"
									   :visible.sync="ModifyMonitoringSettingsBg">
								<el-form inline :model="forItemss">
									<el-form-item :label="$t('EquipmentMonitoring.DeviceName') +'：'">
										<span>{{forItemss.deviceName}}</span>
									</el-form-item>
									<el-form-item :label="$t('EquipmentMonitoring.servicetag') +'：'">
										<span>{{forItemss.servicetag}}</span>
									</el-form-item>
									<el-form-item :label="$t('EquipmentMonitoring.brand') +'：'">
										<span>{{forItemss.manufacturer}}</span>
									</el-form-item>
									<el-form-item :label="$t('EquipmentMonitoring.Model') +'：'">
										<span>{{forItemss.model}}</span>
									</el-form-item>
									<el-form-item :label="$t('EquipmentMonitoring.DeviceType') +'：'">
										<span v-if="forItemss.type==1">机架/塔式服务器</span>
										<span v-if="forItemss.type==2">网络设备</span>
										<span v-if="forItemss.type==3">小型机</span>
										<span v-if="forItemss.type==4">刀片/刀箱</span>
										<span v-if="forItemss.type==5">存储设备</span>
									</el-form-item>
									<el-form-item label="IP地址：">
										<span>{{forItemss.ip}}</span>
									</el-form-item>
								</el-form>
								<el-form inline :model="forItem">
									<el-form-item v-if="forItemss.type== 1"
												  :label="$t('DeviceManualDetection.username') + '：'">
										<el-input v-model="forItem.username" class="width200" clearable></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 1"
												  :label="$t('DeviceManualDetection.password') + '：'">
										<el-input type="password" v-model="forItem.password" class="width200"
												  clearable></el-input>
									</el-form-item>
									<br/>
									<el-form-item v-if="forItemss.type == 1"
												  :label="$t('DeviceManualDetection.port') + '：'">
										<el-input v-model="forItem.port" class="width200" clearable></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2"
												  :label="$t('DeviceManualDetection.snmpVersion') + '：'">
										<el-select v-model="forItem.snmpVersion" placeholder="请选择" class="width200"
												   clearable>
											<el-option v-for="item in version" :key="item.value" :label="item.label"
													   :value="item.value">
											</el-option>
										</el-select>

									</el-form-item>
									<el-form-item v-if="forItemss.type == 2"
												  :label="$t('DeviceManualDetection.snmpPort') + '：'">
										<el-input v-model="forItem.snmpPort" class="width200" clearable></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion!=='3'"
												  :label="$t('DeviceManualDetection.snmpCommunity') + '：'">
										<el-input type="password" v-model="forItem.snmpCommunity" class="width200"
												  clearable></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpUsername') + '：'">
										<el-input v-model="forItem.snmpUsername" class="width200" clearable></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpSecurityLevel') + '：'">
										<el-select v-model="forItem.snmpSecurityLevel" placeholder="请选择" clearable
												   class="width200" @change="selectsnmpSecurityLevel(forItem)">
											<el-option v-for="item in SecurityLevel" :key="item.value"
													   :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpAuthAlgorithm') + '：'">
										<el-select v-model="forItem.snmpAuthAlgorithm" clearable placeholder="请选择"
												   class="width200"
												   :disabled="forItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='authPriv') ? false:false">
											<el-option v-for="item in VerifyTheAlgorithm" :key="item.value"
													   :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpAuthPassword') + '：'">
										<el-input type="password" v-model="forItem.snmpAuthPassword" class="width200"
												  clearable
												  :disabled="forItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpPrivacyAlgorithm') + '：'">
										<el-select v-model="forItem.snmpPrivacyAlgorithm" placeholder="请选择"
												   class="width200" clearable
												   :disabled="(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forItem.snmpSecurityLevel==='authPriv') ? false:false">
											<el-option v-for="item in PrivateVerificationAlgorithm " :key="item.value"
													   :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpPrivacyPassword') + '：'">
										<el-input type="password" v-model="forItem.snmpPrivacyPassword" class="width200"
												  clearable
												  :disabled="(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
									</el-form-item>
									<el-form-item v-if="forItemss.type == 2&&forItem.snmpVersion==='3'"
												  :label="$t('DeviceManualDetection.snmpContextName') + '：'">
										<el-input v-model="forItem.snmpContextName" class="width200"
												  clearable></el-input>
									</el-form-item>
									<el-form-item :label="$t('EquipmentMonitoring.MonitoringOfTheInterval') + '：'">
										<el-select v-model="forItem.monitorInterval" class="width200" clearable
												   placeholder="请选择">
											<el-option v-for="item in monitorIntervalList" :key="item.type"
													   :label="item.name" :value="item.type"></el-option>
										</el-select>
									</el-form-item>
								</el-form>
								<span slot="footer" class="dialog-footer">
								<el-button type="primary" @click="getModifyMonitoringSettings">{{$t('EquipmentMonitoring.determine')}}</el-button>
                                <el-button @click="ModifyMonitoringSettingsBg = false">{{$t('EquipmentMonitoring.cancel')}}</el-button>
                                </span>
							</el-dialog>
						</el-table-column>
					</el-table>
					<!--分页-->
					<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize"
						   @handleCurrentChangeSub="handleCurrentChange"/>
				</div>
				<!--设备告警详情弹出层-->
				<equipmentAlarmDetails ref="alarmDialog" :dialogVisible="dialogVisible"
									   :AssetType="tableDataBase.AssetType" :AlarmSeverity="tableDataBase.AlarmSeverity"
									   :AlarmHandleStatus="tableDataBase.AlarmHandleStatus"
									   @dialogVisibleStatus="dialogVisibleStatus"/>
				<!--标签页-->
				<el-tabs v-if="isShowTabBox_tab" v-model="editableTabsValue" type="card" class="whiteBg"
						 id="EquipmentMonitoring-tabs" tab-position="bottom" closable @tab-click="clickTabs"
						 @tab-remove="removeTab">
					<el-tab-pane :key="index" stretch v-for="(item, index) in editableTabs" :name="item.name"
								 :label="item.title">
						<div class="EquipmentMonitoring-btn">
							<!--收起-->
							<span @click="packUp" class="iconfont cursorPointer">&#xe686;</span>
							<!--关闭弹出层-->
							<span @click="closeTab" class="iconfont cursorPointer">&#xe687;</span>
						</div>
						<AdministrationTags v-if="isShowTabBox" :page-device-id="item.content"/>
					</el-tab-pane>
				</el-tabs>
			</Box>
		</div>

	</Box>
</template>

<script>
	let idd = 1000;
	import {isNotNull, isIpNumber} from "../../../assets/js/validator";
	import {getObjectById} from "../../../assets/js/recursive";
	import {dateFilter} from "../../../assets/js/filters";
	import Box from '../../../components/Box';
	import equipmentAlarmDetails from '../../../components/equipmentAlarmDetails';
	import AdministrationTags from '../../../components/AdministrationTabs';

	export default {
		name: "EquipmentMonitoring",
		components: {
			Box,
			AdministrationTags,
			equipmentAlarmDetails
		},
		data() {
			return {
				/*点击删除按钮得到当前的ID*/
				deleteId: '',
				/*上方插入行数*/
				aboveAddNum: '1',
				/*下方插入行数*/
				belowAddNum: '1',
				/*右键行的下标*/
				currentRowIndex: '',
				/*节点名称*/
				nameOfTheNode: '',
				/*顺序*/
				order: '',
				// 表格数据字典
				tableDataBase: {
					AlarmHandleStatus: {},
					AlarmSeverity: {},
					AssetType: {},
					DeviceMonitorStatus: {}
				},
				// 表单数据字典
				formBaseData: {
					AlarmHandleStatus: [],
					AlarmSeverity: [],
					AssetType: [],
					DeviceMonitorStatus: []
				},
				// 查询表单
				formItem: {
					/*设备类型*/
					equipmentType: 'all',
					equipmentTypeId: null,
					/*设备名称/资产信息*/
					equipmentName: null,
					/*序列号*/
					serialNumber: null,
					computerRoom: null,
					/*机房ID*/
					computerRoomId: null,
					/*机架ID*/
					rackNameId: null,
					/*业务ID*/
					businessId: null,
					businessName: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*目录节点获取nodeCode*/
					catalogPath: null,
					/*编辑设备分组父级节点名称*/
					prentcatalogName: '无',
				},

				/*父级节点*/
				/*forItems: {
					computerRooms: '',
				},*/
				// 设备告警详情提交字段
				addEdit: {
					id: ''
				},
				rules: {
					catalogName: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					ips: [{
						validator: isIpNumber,
						trigger: ['change']
					}]
				},
				addEdits: {
					nodeName: '',
					nodeId: '',
					parentId: '',
				},
				addEditss: {
					nodeName: '',
					nodeId: '',
					parentId: '',

				},
				// 设备告警详情数据
				equipmentData: {},
				// 设备类型树形下拉框数据
				equipmentTypeList: [],

				// 机房树形下拉框的数据
				computerRoomList: [{
					name: '-所有纳管的设备-',
					id: null
				}],
				dataInfoResourceTree: [], // 资源视图树
				/*编辑分组 父级节点*/
				computerRoomListFj: [],
				// 机架下拉框数据
				rackNameList: [],
				framesData: [],
				// 设备状态下拉框
				equipmentStatusList: [],
				// 关联业务树形下拉框集合
				businessTreeData: [],
				//关联业务下拉框数据
				businessList: [],
				//厂商下拉框数据
				manufacturerList: [],
				// 表格数据
				tableData: [],
				/*表格选中后的集合*/
				multipleSelection: [],
				//添加监测的表格数据
				tableDataOne: [],
				/*添加监测页表格选中后的集合*/
				multipleSelectionOne: [],
				// 处理状态
				showVisible: false, //控制tree弹出层删除按钮隐藏
				menuVisible: false, //控制tree右键弹出框
				dialogGroupingNei: false, //控制增加设备分组内层弹出层
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowBusinessPopover: false, // 关联业务树形下拉框显示隐藏
				isShowComputerPopoverss: false, // 控制父级节点下拉框的显示隐藏
				isShowComputerPopoversss: false, //控制新增设备分组父级节点下拉框的显示隐藏
				isShowTabBox: false, // 控制标签页内容是否显示
				isShowTabBox_tab: false, // 控制标签页区域是否显示
				dialogVisible: false, // 设备详情信息弹出层
				dialogGrouping: false, //新增设备分组弹出层
				dialogGroupingBj: false, //编辑设备分组弹出层
				TransferOfGroupingBg: false, //转移设备分组弹出层
				AddDeviceMonitoringBg: false, //添加设备监测弹出层
				AddDeviceMonitoringNextBg: false, //添加设备监测第二级弹出层
				StartTheMonitoringBg: false, //启动设备监测弹出层
				SuspendMonitoringBg: false, //暂停设备监测弹出层
				DeleteTheMonitoringBg: false, //删除设备监测弹出层
				IgnoreTheAlarmBg: false, //忽略告警弹出层
				CancelToIgnoreBg: false, //取消忽略弹出层
				ModifyMonitoringSettingsBg: false, //修改监测设置弹出层
				isShowAddDeviceMonitoringtree: false, //控制添加设备监测弹出层右侧树形下拉框显示隐藏

				dialogGroupingSc: false, //删除设备分组弹出层
				dialogVisibleOwnerInfo: false, // 业务责任人信息弹出层
				/*defaultProps: {},*/
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				editableTabsValue: '', // 当前页签
				editableTabs: [], // 页面集合
				tabIndex: 0, // 页签序号
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
				/*设备类型tree*/
				defaultProps: {
					children: 'children',
					label: 'nodeName'
				},
				/*机房tree*/
				defaultPropss: {
					children: 'children',
					label: 'nodeName'
				},
				dataInfoTreeProps: {
					label: 'nodeName',
					children: 'children',
					disabled: function (data, node) {
						if (data.orderNum === 1) {
							return true;
						}
					}
				},
				/*编辑设备分组父级节点tree*/
				defaultPropsss: {
					children: 'children',
					label: 'nodeName'
				},
				/*添加设备监测左侧tree*/
				AddDeviceMonitor: {
					catalogPath: 'nodeCode',
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*添加设备监测右侧下拉框tree*/
				AddDeviceTypeNode: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*左侧数tree*/
				defaultPropssss: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*新增设备分组父级节点树形下拉框*/
				defaultPropsssa: {
					parentId: 'parentNodeId', // 父级唯一标识
					value: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*关联业务*/
				defaultPropsBusiness: {
					label: 'nodeName',
					children: 'children'
				},

				//新增设备分组
				assetCatalogList: [{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}],

				//批量创建分组的数据封装
				packagingGroupData: {
					all: [],
					firstObj: {},
					secondGroup: [],
					secondObj: {},
					thirdGroup: [],
					thirdObj: {},
					fourthGroup: []
				},
				selectlistRow: [],
				parentNode: '',
				/*gridDatas: '',*/
				parentNodeList: [{
					value: '1',
					label: '11'
				},
					{
						value: '2',
						label: '22'
					}
				],

				/*点击启动监测按钮传值 true/false*/
				StartThe: '',
				StartTheIds: [],
				/*点击暂停监测按钮传值 true/false*/
				suspended: '',
				suspendedIds: [],
				/*点击删除监测按钮传值 true/false*/
				DeleteThe: '',
				DeleteTheIds: [],
				/*点击忽略告警按钮传值 true/false*/
				IgnoreThe: '',
				IgnoreTheIds: [],
				/*点击取消忽略告警按钮传值 true/false*/
				CancelTo: '',
				CancelToIds: [],
				forItemss: {
					model: '',
					type: '',
					deviceName: '',
					servicetag: '',
					manufacturer: '',
					ip: ''
				},

				forItem: {
					/**    用户名 **/
					username: '',
					/**    密码。AES加密存储 **/
					password: '',
					/**端口号， SSH或TELNET **/
					port: '',
					/**    SNMP版本 **/
					snmpVersion: '',
					/**    SNMP团体名 **/
					snmpCommunity: '',
					/**    SNMP端口号 **/
					snmpPort: '',
					/**    SNMP用户名 **/
					snmpUsername: '',
					/**    SNMP安全级别 **/
					snmpSecurityLevel: '',
					/**    SNMP验证算法 **/
					snmpAuthAlgorithm: '',
					/**    SNMP验证密码 **/
					snmpAuthPassword: '',
					/**    SNMP私有验证算法 **/
					snmpPrivacyAlgorithm: '',
					/**    SNMP私有密码 **/
					snmpPrivacyPassword: '',
					/**    SNMP文本名称 **/
					snmpContextName: '',
					/*监测间隔时间*/
					monitorInterval: '',
				},
				//监测间隔时间下拉框
				monitorIntervalList: [],
				//版本
				version: [{
					value: '1',
					label: 'V1'
				}, {
					value: '2c',
					label: 'V2c'
				}, {
					value: '3',
					label: 'V3'
				}],
				//安全级别
				SecurityLevel: [{
					value: 'noAuthNoPriv',
					label: 'no auth, no priv'
				},
					{
						value: 'authNoPriv',
						label: 'auth, no priv'
					},
					{
						value: 'authPriv',
						label: 'auth, priv'
					}
				],
				//验证算法
				VerifyTheAlgorithm: [{
					value: 'MD5',
					label: 'MD5'
				},
					{
						value: 'SHA',
						label: 'SHA'
					}
				],
				//私有验证算法
				PrivateVerificationAlgorithm: [{
					value: 'DES',
					label: 'DES'
				},
					{
						value: '3DES',
						label: '3DES'
					},
					{
						value: 'AES',
						label: 'AES'
					},
					{
						value: 'AES192',
						label: 'AES192'
					},
					{
						value: 'AES256',
						label: 'AES256'
					}
				],
				forssItem: {
					/*ip地址*/
					ip: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*目录节点获取nodeCode*/
					catalogPath: null,
					/*模糊查询的Ip地址*/
					ips: null,
					/*设备类型*/
					type: null,
					/*设备类型ID*/
					typeId: null,
				},
				//添加监测二级页面数据
				forsItem: {
					/**    用户名 **/
					username: null,
					/**    密码。AES加密存储 **/
					password: null,
					/**端口号， SSH或TELNET **/
					port: null,
					/**    SNMP版本 **/
					snmpVersion: '2c',
					/**    SNMP团体名 **/
					snmpCommunity: null,
					/**    SNMP端口号 **/
					snmpPort: null,
					/**    SNMP用户名 **/
					snmpUsername: null,
					/**    SNMP安全级别 **/
					snmpSecurityLevel: "noAuthNoPriv",
					/**    SNMP验证算法 **/
					snmpAuthAlgorithm: null,
					/**    SNMP验证密码 **/
					snmpAuthPassword: null,
					/**    SNMP私有验证算法 **/
					snmpPrivacyAlgorithm: null,
					/**    SNMP私有密码 **/
					snmpPrivacyPassword: null,
					/**    SNMP文本名称 **/
					snmpContextName: null,
					/*监测间隔时间*/
					monitorInterval: null,
				},
				sn: '',
				/*判断定时器刷新*/
				finish: '',
				/*转移分组弹出层树*/
				forssItems: {
					type: null
				}
			}
		},
		mounted() {
			this.getDataTree();
			this.getManufacturer();
			this.getData();
			this.getFormData();
			this.getBaseData();
			this.getBusinessTreeData();
			this.getBaseDataList();

		},
		methods: {
			// 修改阈值
			monitorThreshold(val) {
				var _t = this;
				/*let newpage = _t.$router.resolve({
                name: 'monitorThresholdValue',
                query:{
                objectType:1,
                deviceId:val.id,
                    }
                })
				localStorage.setItem('hy-deviceId', val.id);
				window.open(newpage.href, '_blank')*/
				_t.$router.push({
					name: 'monitorThresholdValue',
					params: {
						deviceId: val.id,
					}
				});
				localStorage.setItem('hy-deviceId', val.id);

				/*window.open(newpage.href, '_blank')*/
			},
			// 接受弹出层关闭的参数
			dialogVisibleStatus(val) {
				this.dialogVisible = val;
			},
			// 点击设备类型下拉框节点
			clickTypeNode(val) {
				var _t = this;
				_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;
				_t.isShowTypePopover = false;
			},
			// 点击关联业务下拉框节点
			clickBusinessNode(val) {
				var _t = this;
				_t.formItem.businessId = val.nodeId;
				_t.formItem.businessName = val.nodeName;
				_t.isShowBusinessPopover = false;
			},
			// 改变表单的机房时加载机柜的数据
			changeRoom(val) {
				var _t = this;
				if (_t.formItem.computerRoomId !== null) {
					_t.framesData.forEach(function (item) {
						if (item.roomId == val) {
							_t.rackNameList = item.frame;
						}
					});
				} else {
					_t.rackNameList = [];
				}
				_t.formItem.rackNameId = '';
			},
			//点击删除按钮
			remove() {
				var _t = this;
				_t.dialogGroupingSc = true;
			},
			//确定删除按钮
			getRemove() {
				var _t = this;
				var catalogId = _t.deleteId;
				_t.$api.delete('/asset/assetCatalog/' + catalogId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.dialogGroupingSc = false;
							_t.getDataTree();
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
			//点击新增按钮弹出框
			appendDevice() {
				var _t = this
				_t.dialogGrouping = true;
			},
			// 新增设备分组点击父级结点下拉框的节点
			clickRoomNodess(val) {
				var _t = this;
				_t.addEditss.nodeId = val.nodeId;
				_t.addEditss.nodeName = val.nodeName;
				_t.isShowComputerPopoversss = false;
			},
			//新增设备分组弹出框点击叉号按钮
			handleDialogClose() {
				var _t = this;
				_t.addEditss.nodeId = '';
				_t.addEditss.nodeName = '-无父级节点-';
				_t.dialogGrouping = false;
				_t.dialogGroupingNei = false;
				//新增设备分组重置表格数据
				_t.assetCatalogList = [{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}];
			},
			//新增设备分组弹出框点击取消按钮
			getAddAssetGroupQx() {
				var _t = this;
				_t.addEditss.nodeId = '';
				_t.addEditss.nodeName = '-无父级节点-';
				_t.dialogGrouping = false;
				_t.dialogGroupingNei = false;
				//新增设备分组重置表格数据
				_t.assetCatalogList = [{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}];
			},
			//新增设备分组弹出框点击确定按钮接口
			getAddAssetGroup() {
				var _t = this;
				_t.dialogGroupingNei = false;
				//方法一开始就重新定义每个级别的数组、对象
				_t.packagingGroupData = {
					all: [],
					firstObj: {},
					secondGroup: [],
					secondObj: {},
					thirdGroup: [],
					thirdObj: {},
					fourthGroup: []
				};
				//记录是否全部校验通过
				var isPass = true;
				//当输入的table记录存在且行数大于0时才执行
				if (undefined != _t.assetCatalogList && null != _t.assetCatalogList && _t.assetCatalogList.length > 0) {
					for (var i = 0; i < _t.assetCatalogList.length; i++) {
						var _one = _t.assetCatalogList[i].amount0.trim();
						var _two = _t.assetCatalogList[i].amount1.trim();
						var _three = _t.assetCatalogList[i].amount2.trim();
						var _four = _t.assetCatalogList[i].amount3.trim();
						if (_one.length == 0 && _two.length == 0 && _three.length == 0 && _four.length == 0) {
							_t.assetCatalogList[i].verify = "error";
							_t.assetCatalogList[i].verifyMsg = "该行所有单元格均未录入数据，请删除！";

							//记录校验不通过
							isPass = false;

							//直接进行下一行校验
							continue;
						}
						if (_one.length > 0) {
							//一级不为空，则说明上一个一级结束，先封装上一个一级的内容到all中
							_t.packagingGroupDataFun(1);

							_t.assetCatalogList[i].verify = "pass";
							_t.assetCatalogList[i].verifyMsg = "校验通过！";

							//开始记录新一个一级
							_t.packagingGroupData.firstObj = {
								catalogName: _one
							};
						}
						if (_two.length > 0) {
							//二级不为空，则说明上一个二级结束，先封装上一个二级的内容到secondGroup中
							_t.packagingGroupDataFun(2);

							//检查是否存在可挂靠的父级
							var firstObj = _t.packagingGroupData.firstObj;
							if (undefined == firstObj.catalogName || '' == firstObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "<br/>";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第二级未找到任何可挂靠的第一级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//开始记录新一个二级
								_t.packagingGroupData.secondObj = {
									catalogName: _two
								};
							}
						}
						if (_three.length > 0) {
							//三级不为空，则说明上一个三级结束，先封装上一个三级的内容到thirdGroup中
							_t.packagingGroupDataFun(3);

							//检查是否存在可挂靠的父级
							var secondObj = _t.packagingGroupData.secondObj;
							if (undefined == secondObj.catalogName || '' == secondObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "<br/>";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第三级未找到任何可挂靠的第二级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//开始记录新一个三级
								_t.packagingGroupData.thirdObj = {
									catalogName: _three
								};
							}
						}
						if (_four.length > 0) {
							//检查是否存在可挂靠的父级
							var thirdObj = _t.packagingGroupData.thirdObj;
							if (undefined == thirdObj.catalogName || '' == thirdObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "<br/>";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第四级未找到任何可挂靠的第三级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//将四级的内容封装到fourthGroup中
								_t.packagingGroupData.fourthGroup.push({
									catalogName: _four
								});
							}
						}
					}
					//将最后一个一级的内容到all中
					_t.packagingGroupDataFun(1);
				} else {
					//记录校验不通过
					isPass = false;
				}
				/*console.log(_t.assetCatalogList);
				console.log(JSON.stringify(_t.packagingGroupData.all));*/

				if (isPass) {
					_t.$alert("全部数据校验通过，可以进行表单提交！", "提示");
					_t.$api.post('/asset/assetCatalog/', {
						parentId: _t.addEditss.nodeId,
						assetCatalogList: _t.packagingGroupData.all
					}, function (res) {
						_t.getDataTree();
						_t.addEditss.nodeId = '';
						_t.addEditss.nodeName = '-无父级节点-';
						_t.dialogGrouping = false;
						//新增设备分组重置表格数据
						_t.assetCatalogList = [{
							verify: '',
							verifyMsg: '',
							amount0: '',
							amount1: '',
							amount2: '',
							amount3: ''
						}, {
							verify: '',
							verifyMsg: '',
							amount0: '',
							amount1: '',
							amount2: '',
							amount3: ''
						}, {
							verify: '',
							verifyMsg: '',
							amount0: '',
							amount1: '',
							amount2: '',
							amount3: ''
						}, {
							verify: '',
							verifyMsg: '',
							amount0: '',
							amount1: '',
							amount2: '',
							amount3: ''
						}];
					})
				} else {
					_t.$alert("数据校验未通过，请完善数据！", "提示");
				}
			},
			//封装批量新增的设备分组的集合
			packagingGroupDataFun(level) {
				var _t = this.packagingGroupData;
				if (level <= 3 && undefined != _t.thirdObj.catalogName && '' != _t.thirdObj.catalogName) {
					if (_t.fourthGroup.length > 0) {
						_t.thirdObj.assetCatalogList = _t.fourthGroup;
						_t.fourthGroup = [];
					}
					_t.thirdGroup.push(_t.thirdObj);
					_t.thirdObj = {};
				}
				if (level <= 2 && undefined != _t.secondObj.catalogName && '' != _t.secondObj.catalogName) {
					if (_t.thirdGroup.length > 0) {
						_t.secondObj.assetCatalogList = _t.thirdGroup;
						_t.thirdGroup = [];
					}
					_t.secondGroup.push(_t.secondObj);
					_t.secondObj = {};
				}
				if (level <= 1 && undefined != _t.firstObj.catalogName && '' != _t.firstObj.catalogName) {
					if (_t.secondGroup.length > 0) {
						_t.firstObj.assetCatalogList = _t.secondGroup;
						_t.secondGroup = [];
					}
					_t.all.push(_t.firstObj);
					_t.firstObj = {};
				}
			},
			// 编辑设备分组点击父级结点下拉框的节点
			clickRoomNodes(val) {
				var _t = this;
				_t.addEdits.parentId = val.nodeId;
				_t.addEdits.nodeName = val.nodeName;
				_t.isShowComputerPopoverss = false;
			},
			EditDevice() {
				var _t = this;
				_t.dialogGroupingBj = true;
				_t.getBjtree();
			},
			/*点击设备编辑按钮查询接口*/
			getBjtree() {
				var _t = this;
				var id = _t.formItem.catalogId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formItem.catalogName = res.data.catalogName;
							_t.formItem.catalogId = res.data.id;
							_t.addEdits.parentId = res.data.parentId;
							if (_t.addEdits.parentId != null) {
								this.getBjtreeF();
							} else if (_t.addEdits.parentId == null) {
								_t.addEdits.nodeName = "-无父级节点-"
							}
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
			/*根据parentId查询父级节点*/
			getBjtreeF() {
				var _t = this;
				var id = _t.addEdits.parentId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.addEdits.nodeName = res.data.catalogName;
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
			/*编辑设备分组点击保存按钮接口*/
			getEditDevice(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						var id = _t.addEdits.parentId;
						_t.$store.commit('setLoading', true);
						_t.$api.put('/asset/assetCatalog/', {
							catalog: {
								id: _t.formItem.catalogId,
								catalogName: _t.formItem.catalogName
							}
						}, function (res) {
							_t.$store.commit('setLoading', false);
							switch (res.status) {
								case 200:
									_t.dialogGroupingBj = false;
									_t.getDataTree();
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
					}
				});
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							/*设备名称/资产信息*/
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName.trim() == '' ? null : _t.formItem.equipmentName.trim()),
							/*设备类型*/
							type: _t.formItem.equipmentTypeId == null ? null : _t.formItem.equipmentTypeId,
							/*序列号*/
							servicetag: _t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber.trim() == '' ? null : _t.formItem.serialNumber.trim()),
							/*机房ID*/
							roomId: _t.formItem.computerRoomId == null ? null : (_t.formItem.computerRoomId.trim() == '' ? null : _t.formItem.computerRoomId.trim()),
							/*机架Id*/
							frameId: _t.formItem.rackNameId == null ? null : (_t.formItem.rackNameId.trim() == '' ? null : _t.formItem.rackNameId.trim()),
							/*设备状态*/
							status: _t.formItem.equipmentStatus == null ? null : (_t.formItem.equipmentStatus.trim() == '' ? null : _t.formItem.equipmentStatus.trim()),
							/*业务ID*/
							business: _t.formItem.businessId == null ? null : (_t.formItem.businessId.trim() == '' ? null : _t.formItem.businessId.trim()),
							/*厂商*/
							manufacturer: _t.formItem.manufacturer == null ? null : _t.formItem.manufacturer,
							/*目录ID*/
							/*							catalogId: _t.formItem.catalogId == null ? null : _t.formItem.catalogId,*/
							catalogPath: _t.formItem.catalogPath == null ? null : _t.formItem.catalogPath,
							monitorStatus: 1,
						},
						alarmDevice: true,
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:

							_t.getTableDataValue(res.data);
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
			// 导出excel数据
			downloadData() {
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
			// 单元格点击
			cellClickColumn(row, column) {
				/*
				 * 点击表格的单元格
				 *    row 当前行绑定的 数据
				 *    column 当前 单元格的 属性
				 */
				var _t = this;
				// 点击设备状态列
				/*if(column.label == _t.$t('EquipmentMonitoring.status')) {
					_t.addEdit.id = row.id;
					_t.dialogVisible = true;*/
				// 父组件调用 子组件 获取数据的方法
				/*_t.$refs.alarmDialog.getData(_t.addEdit.id);*/
				/*}*/
				// 点击资产信息列
				if ((column.label == _t.$t('EquipmentMonitoring.AssetInformation')) || (column.label == _t.$t('EquipmentMonitoring.status'))) {
					_t.addTab(row.deviceName, row.id);
				}
				//点击操作列

			},
			// 删除页签
			removeTab(targetName) {
				var _t = this;
				// 获取页面集合
				var tabs = _t.editableTabs;
				// 获取当前选中的页签
				var activeName = _t.editableTabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							var nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
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
				if (_t.editableTabs.length > 1) {
					document.getElementById('EquipmentMonitoring-tabs').style.top = '118px';
				}
			},
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('EquipmentMonitoring-tabs').style.top = 'initial';
			},
			// 关闭标签页
			closeTab() {
				var _t = this;
				_t.isShowTabBox_tab = false;
				document.getElementById('EquipmentMonitoring-tabs').style.top = 'initial';
				_t.editableTabsValue = '';
				_t.editableTabs = [];
				_t.tabIndex = 0;
			},
			// 点击标签页
			clickTabs() {
				var _t = this;
				_t.isShowTabBox = true;
				document.getElementById('EquipmentMonitoring-tabs').style.top = '118px';
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
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('/asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.treeData = res.data.children;
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
			// 获取树形控件选中的节点
			getCurrentNode(data) {
				var _t = this;
				_t.formItem.catalogPath = data.nodeCode;
				_t.formItem.catalogId = data.nodeId;
				_t.formItem.catalogName = data.nodeName;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 0;
				_t.getData();
			},
			//删除设备分组确认提示
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
					});
			},
			//内层框确认行数
			getClick(val) {
				var _t = this;
				_t.dialogGroupingNei = false;
				var addNum = 1; //增加的行数
				var addToIndex; //加到哪个下标后边
				if ('above' == val) {
					addNum = _t.aboveAddNum;
					addToIndex = _t.currentRowIndex;

				} else {
					addNum = _t.belowAddNum;
					addToIndex = _t.currentRowIndex + 1;

				}
				//在当前行的后面插入行
				for (var i = 0; i < addNum; i++) {
					var newValue = {
						verify: '',
						verifyMsg: '',
						amount0: '',
						amount1: '',
						amount2: '',
						amount3: ''
					};
					_t.assetCatalogList.splice(addToIndex, 0, newValue);
				}
			},
			//根据下标删除当前行
			delClick() {
				var _t = this;
				if (_t.assetCatalogList.length < 2) {
					_t.dialogGroupingNei = false;
					_t.$alert("仅剩最后一行不能删除", "提示");
				} else {
					_t.assetCatalogList.splice(_t.currentRowIndex, 1);
					//删掉一行后要关闭，以防一直用该下标进行删除导致数组越界
					_t.dialogGroupingNei = false;
				}

			},

			/*添加右键行事件*/
			openDetails(row, object, MouseEvent) { // 鼠标右击触发事件
				MouseEvent.preventDefault();
				this.dialogGroupingNei = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
				this.dialogGroupingNei = true; // 显示模态窗口，跳出自定义菜单栏
				var clientWidth = document.body.clientWidth //屏幕可用宽度
				var clientHeight = document.body.clientHeight; //屏幕可用高度
				var menu = document.querySelector('#menu1');
				menu.style.left = MouseEvent.clientX + 'px';
				document.addEventListener('click', this.foo1); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
				menu.style.top = MouseEvent.clientY + 'px';
				//获取右键行的下标
				/*console.log(this.assetCatalogList.indexOf(row))*/
				var index = this.assetCatalogList.indexOf(row);
				this.currentRowIndex = index;
				/*console.log('右键被点击的MouseEventX:', MouseEvent);*/
				/*console.log('右键被点击的MouseEventY:', MouseEvent.clientY );*/
			},
			foo1() { // 取消鼠标监听事件 菜单栏
				/*this.dialogGroupingNei = false;*/
				document.removeEventListener('click', this.foo1) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
			},
			// 查询表格中状态对应的数据值
			getTableDataValue(resData) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity", "DeviceMonitorStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:

							// 获取表格对应的状态值
							var tableData = resData.list;
							_t.tableDataBase = res.data;
							if (tableData == null) {
								tableData = [];
							}
							tableData.forEach((item) => {
								item.InlineBlock = false;
							});
							_t.tableData = tableData;
							_t.options.currentPage = resData.currentPage;
							_t.options.total = resData.count;
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
			// 查询设备类型
			getBaseData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/basedata/all', {
					jsonString: JSON.stringify({
						systemBasedata: {
							dictionaryType: 'AssetType',
							languageMark: localStorage.getItem('hy-language')
						}
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var equipmentTypeList = res.data.treeNode.children[0].children;
							equipmentTypeList.unshift({
								nodeName: 'all',
								level: 1,
								children: null,
								nodeCode: null,
								parentNodeId: '0',
								nodeId: null
							})
							_t.equipmentTypeList = equipmentTypeList;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentTypeList = [];
							break;
					}
				});
			},
			// 查找关联业务树形列表
			getBusinessTreeData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.businessTreeData = res.data.children;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.businessTreeData = [];
							break;
					}
				});
			},
			// 表单部分机房机架下拉框数据
			getFormData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetEngineroom/maplist', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var computerRoomList = res.data.rooms;
							_t.framesData = res.data.frames;
							computerRoomList.unshift({
								name: '-所有纳管的设备-',
								id: null
							});
							_t.computerRoomList = computerRoomList;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.computerRoomList = [{
								name: '-所有纳管的设备-',
								id: null
							}];
							break;
					}
				});
			},
			// 查询字典集合
			getBaseDataList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['AlarmHandleStatus', 'AssetType', 'AlarmSeverity', 'DeviceMonitorStatus']
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formBaseData.AlarmSeverity = res.data.AlarmSeverity;
							_t.formBaseData.AlarmHandleStatus = res.data.AlarmHandleStatus;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.formBaseData.AlarmSeverity = [];
							_t.formBaseData.AlarmHandleStatus = [];
							break;
					}
				});
			},
			//厂商下拉框数据获取
			getManufacturer() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/manufacture', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var Income1 = [];
							for (var key in res.data) {
								Income1.push({
									'name': res.data[key],
									'value': key,
								})
							}
							_t.manufacturerList = Income1;
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
			//表单重置按钮
			formReset() {
				var _t = this;
				_t.formItem = {
					/*设备类型*/
					equipmentType: 'all',
					equipmentTypeId: null,
					/*设备名称/资产信息*/
					equipmentName: null,
					/*序列号*/
					serialNumber: null,

					computerRoom: null,
					/*机房ID*/
					computerRoomId: null,
					/*机架ID*/
					rackNameId: null,
					/*业务ID*/
					businessId: null,
					businessName: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,

				};
				_t.getData();
			},

			rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
				this.deleteId = object.nodeId;
				this.addEditss.nodeId = object.nodeId;
				this.addEditss.nodeName = object.nodeName;
				this.formItem.catalogId = object.nodeId;
				this.formItem.catalogName = object.nodeName;
				if (object.children.length == 0) {
					this.showVisible = true;
				} else {
					this.showVisible = false;
				}
				this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
				this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
				var menu = document.querySelector('#menu')
				menu.style.left = MouseEvent.clientX - 80 + 'px'
				document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
				menu.style.top = MouseEvent.clientY - 70 + 'px'
				// // console.log('右键被点击的event:', MouseEvent)
				// console.log('右键被点击的object:', object)
				// console.log('右键被点击的value:', Node)
				// console.log('右键被点击的element:', element)
				// console.log('鼠标点击了树形结构图')
			},
			foo() { // 取消鼠标监听事件 菜单栏
				this.menuVisible = false
				document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
			},
			// 获取数据权限 监测目录树
			getInfoDataTree() {
				var _t = this;
				_t.$api.get('asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var dataInfoResourceTree = res.data.children;
							dataInfoResourceTree.unshift({
								nodeId: 'tree_other',
								orderNum: 1,
								nodeName: '未分配目录',
								children: []
							});
							_t.getDeviceTreeData(dataInfoResourceTree);
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
			// 获取设备列表
			getDeviceTreeData(tree) {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceList', {
					jsonString: JSON.stringify({
						assetDevice: {}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var deviceList = res.data.list;
							var deviceListObject = new Object();
							deviceList.forEach((item) => {
								item.nodeId = item.id;
								item.parentId = item.catalogId;
								item.nodeName = item.deviceName;
								item.orderNum = 2;
								item.children = [];
								// 未发现设备
								if (item.catalogId === null) {
									if (deviceListObject['tree_other'] !== undefined) {
										deviceListObject['tree_other'].push(item);
									} else {
										deviceListObject['tree_other'] = [];
										deviceListObject['tree_other'].push(item);
									}
								} else {
									// 已发现的设备
									if (deviceListObject[item.catalogId] !== undefined) {
										deviceListObject[item.catalogId].push(item);
									} else {
										deviceListObject[item.catalogId] = [];
										deviceListObject[item.catalogId].push(item);
									}
								}
							});
							// 将键值存到数组中 用于遍历
							var keyArr = new Array();
							for (var key in deviceListObject) {
								keyArr.push(key);
							}
							keyArr.forEach((item) => {
								var nodeList = getObjectById(tree, item, 'nodeId', 'children');
								if (nodeList[0].nodeId === item) {
									nodeList[0].children = deviceListObject[item];
								}
							});
							_t.dataInfoResourceTree = tree;
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



			//点击转移设备分组 弹出层
			TransferOfGrouping() {
				var _t = this;
				_t.getInfoDataTree();
				_t.TransferOfGroupingBg = true;
			},
			//点击转移设备分组 弹出层中取消按钮
			getTransferOfGroupingQx() {
				var _t = this;
				_t.TransferOfGroupingBg = false;
			},
			//点击转移设备分组 弹出层中确认按钮
			getTransferOfGrouping() {
				var _t = this;
				_t.TransferOfGroupingBg = false;
			},
			//点击添加设备监测按钮弹出层
			AddDeviceMonitoring() {
				var _t = this;
				_t.AddDeviceMonitoringBg = true;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							/*设备类型*/
							type: _t.forssItem.typeId == null ? null : _t.forssItem.typeId,
							monitorStatus: 0,
							ip: _t.forssItem.ips,
							catalogPath: _t.forssItem.catalogPath,
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var resData = res.data.list;
							resData.forEach((item) => {
								item.isResultFalse = 1;
							});
							_t.tableDataOne = resData;
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
			// 添加设备监测树节点获取
			ClickAddDeviceMonitor(val) {
				var _t = this;
				_t.forssItem.catalogPath = val.nodeCode;
				/*_t.addEdits.parentId = val.nodeId;
				_t.addEdits.nodeName = val.nodeName;*/
			},
			//点击添加设备监测弹出层里的下一步按钮
			getAddDevicemonitoring() {
				var _t = this;
				_t.AddDeviceMonitoringBg = false;
				_t.AddDeviceMonitoringNextBg = true;
				/*_t.forssItem={
					catalogPath:null,
					typeId:null,
					type:null,
					ips:null
				}*/
			},
			//点击添加设备监测弹出层里的取消按钮
			getAddDevicemonitoringQx() {
				var _t = this;
				_t.AddDeviceMonitoringBg = false;
				_t.tableDataOne = [];
				_t.forssItem = {
					catalogPath: null,
					typeId: null,
					type: null,
					ips: null
				};
				_t.getData();
			},
			//点击添加设备监测弹出层里的X按钮
			handleDialogCloseOne() {
				var _t = this;
				_t.AddDeviceMonitoringBg = false;
				_t.tableDataOne = [];
				_t.forssItem = {
					catalogPath: null,
					typeId: null,
					type: null,
					ips: null
				};
				_t.getData();
			},
			//点击添加设备监测弹出层里的上一步弹出层中的确认按钮
			egtThePreviousPage() {
				var _t = this;
				_t.AddDeviceMonitoringBg = true;
				_t.AddDeviceMonitoringNextBg = false;
			},
			//点击添加设备监测弹出层里的下一步弹出层中的确认按钮
			getAddDevicemonitoringNext() {
				var _t = this;
				_t.$api.post('/asset/discovery/start', {
					param: [_t.forsItem],
					deviceIds: _t.multipleSelectionOne,
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.sn = res.data;
							_t.AddDeviceMonitoringBg = true;
							_t.AddDeviceMonitoringNextBg = false;
							_t.getAddDevicemonitoringNexttwe();
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
			//状态值
			getAddDevicemonitoringNexttwe() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('/asset/discovery/result', {
					sn: _t.sn,
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.timer(res.data.pageList);
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
			//持续刷新页面直到finish为true结束
			timer(pageList) {
				var _t = this;
				for (var i = 0; i < pageList.length; i++) {
					if (pageList[i].finish == false) {
						_t.getAddDevicemonitoringNexttwe();
					} else if (pageList[i].finish == true) {
						var tableDataOne = _t.tableDataOne;
						tableDataOne.forEach((item) => {
							pageList.forEach((val) => {
								if (item.id === val.deviceId) {
									if (val.discovery === true) {
										item.isResultFalse = 2;
									} else if (val.discovery === false) {
										item.isResultFalse = 3;
									} else {
										item.isResultFalse = 1;
									}
								}
							})
						});
						_t.tableDataOne = tableDataOne;
					}
				}

			},
			//点击添加设备监测弹出层里的下一步弹出层中的取消按钮
			getAddDevicemonitoringNextQx() {
				var _t = this;
				_t.AddDeviceMonitoringNextBg = false;
				_t.forsItem = {
					/**    用户名 **/
					username: null,
					/**    密码。AES加密存储 **/
					password: null,
					/**端口号， SSH或TELNET **/
					port: null,
					/**    SNMP版本 **/
					snmpVersion: '2c',
					/**    SNMP团体名 **/
					snmpCommunity: null,
					/**    SNMP端口号 **/
					snmpPort: null,
					/**    SNMP用户名 **/
					snmpUsername: null,
					/**    SNMP安全级别 **/
					snmpSecurityLevel: "noAuthNoPriv",
					/**    SNMP验证算法 **/
					snmpAuthAlgorithm: null,
					/**    SNMP验证密码 **/
					snmpAuthPassword: null,
					/**    SNMP私有验证算法 **/
					snmpPrivacyAlgorithm: null,
					/**    SNMP私有密码 **/
					snmpPrivacyPassword: null,
					/**    SNMP文本名称 **/
					snmpContextName: null,
					/*监测间隔时间*/
					monitorInterval: null,
				}
			},
			// 点击所有未监测的设备的下拉框节点
			clickAddDeviceTypeNode(val) {
				var _t = this;
				_t.forssItem.type = val.nodeName;
				_t.forssItem.typeId = val.nodeCode;
				/*_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;*/
				_t.isShowAddDeviceMonitoringtree = false;
			},
			//点击添加设备监测弹出层里的查询按钮
			getDataTwe(formNames) {
				var _t = this;
				_t.$refs[formNames].validate((valid) => {
					if (valid) {
						_t.AddDeviceMonitoring();
					}
				});
			},
			//添加设备监测弹出层里的表格改变获取值
			handleSelectionChangeOne(val) {
				var _t = this;
				var multipleSelectionOne = []
				for (var i = 0; i < val.length; i++) {
					multipleSelectionOne.push(val[i].id)
				}
				_t.multipleSelectionOne = multipleSelectionOne;
			},
			//点击启动监测按钮弹出层
			StartMonitoring(ids) {
				var _t = this;
				var StartTheIds = [];
				StartTheIds.push(ids);
				_t.StartTheMonitoringBg = true;
				if (_t.multipleSelection.length == 0) {
					_t.multipleSelection = StartTheIds
				}
			},
			//启动监测弹出层里点击确定按钮
			getStartTheMonitoring() {
				var _t = this;
				_t.$api.post('/monitor/deviceMonitorAttr/execute', {
					option: 33,
					isDevice: true,
					ids: _t.multipleSelection,
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.StartTheMonitoringBg = false;
							_t.multipleSelection = [];
							_t.getData();
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
			//点击暂停监测按钮弹出层
			SuspendMonitoring(ids) {
				var _t = this;
				var suspendedIds = [];
				suspendedIds.push(ids);
				if (_t.multipleSelection.length == 0) {
					_t.multipleSelection = suspendedIds
				}
				_t.SuspendMonitoringBg = true;
			},
			//暂停监测弹出层里点击确定按钮
			getSuspendMonitoring() {
				var _t = this;
				_t.$api.post('/monitor/deviceMonitorAttr/execute', {
					option: 11,
					isDevice: true,
					ids: _t.multipleSelection
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.SuspendMonitoringBg = false;
							_t.multipleSelection = [];
							_t.getData();
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
			//点击删除监测按钮弹出层
			DeleteTheMonitoring(ids) {
				var _t = this;
				var DeleteTheIds = [];
				DeleteTheIds.push(ids);
				if (_t.multipleSelection.length == 0) {
					_t.multipleSelection = DeleteTheIds
				}
				_t.DeleteTheMonitoringBg = true;
			},
			//删除监测弹出层里点击确定按钮
			getDeleteTheMonitoring() {
				var _t = this;
				_t.$api.post('/monitor/deviceMonitorAttr/execute', {
					option: 37,
					isDevice: true,
					ids: _t.multipleSelection
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.DeleteTheMonitoringBg = false;
							_t.multipleSelection = [];
							_t.getData();
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
			//点击忽略告警按钮弹出层
			IgnoreTheAlarm(ids) {
				var _t = this;
				var IgnoreTheIds = [];
				IgnoreTheIds.push(ids);
				if (_t.multipleSelection.length == 0) {
					_t.multipleSelection = IgnoreTheIds
				}
				_t.IgnoreTheAlarmBg = true;
			},
			//忽略告警弹出层里点击确定按钮
			getIgnoreTheAlarm() {
				var _t = this;
				_t.$api.post('/monitor/deviceMonitorAttr/execute', {
					option: 22,
					isDevice: true,
					ids: _t.multipleSelection
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.IgnoreTheAlarmBg = false;
							_t.multipleSelection = [];
							_t.getData();
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
			//点击取消忽略按钮弹出层
			CancelToIgnore(ids) {
				var _t = this;
				var CancelToIds = [];
				CancelToIds.push(ids);
				if (_t.multipleSelection.length == 0) {
					_t.multipleSelection = CancelToIds
				}
				_t.CancelToIgnoreBg = true;
			},
			//取消忽略弹出层里点击确定按钮
			getCancelToIgnore() {
				var _t = this;
				_t.$api.post('/monitor/deviceMonitorAttr/execute', {
					option: 23,
					isDevice: true,
					ids: _t.multipleSelection
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.CancelToIgnoreBg = false;
							_t.multipleSelection = [];
							_t.getData();
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
			/*获取表格选中的Id*/
			handleSelectionChange(val) {
				var _t = this;
				var multipleSelection = []
				for (var i = 0; i < val.length; i++) {
					multipleSelection.push(val[i].id)
				}
				_t.multipleSelection = multipleSelection;
			},
			//鼠标移入出现监测状态的图标
			displayInlineBlock(val) {
				var _t = this;
				val.InlineBlock = true;
			},
			//鼠标移出隐藏监测状态图标
			displayNone(val) {
				var _t = this;
				val.InlineBlock = false;
			},
			//获取间隔时间下拉框数据
			getMonitorIntervalList() {
				var _t = this;
				_t.$api.post('/system/basedata/maplist', {
					dictionaryTypes: ["MonitorRate"],
					languageMark: localStorage.getItem("hy-language"),
				}, function (res) {
					var monitorIntervalList = res.data.MonitorRate;
					_t.monitorIntervalList = monitorIntervalList;
				})
			},
			//点击修改监测设置按钮
			ModifyMonitoringSettings(val) {
				var _t = this;
				_t.forItemss.servicetag = val.servicetag;
				_t.forItemss.model = val.model;
				_t.forItemss.deviceName = val.deviceName;
				_t.forItemss.type = val.type;
				_t.forItemss.manufacturer = val.manufacturer;
				_t.forItemss.ip = val.ip;
				var id = val.id;
				_t.$api.get('/monitor/deviceMonitorAttr/' + id, {}, function (res) {
					switch (res.status) {
						case 200:
							//用户名
							_t.forItem.username = res.data.username;
							//用户密码
							_t.forItem.password = res.data.password;
							//端口
							_t.forItem.port = res.data.port;
							//snmp版本
							_t.forItem.snmpVersion = res.data.snmpVersion;
							//snmp端口
							_t.forItem.snmpPort = res.data.snmpPort;
							//snmp用户名
							_t.forItem.snmpUsername = res.data.snmpUsername;
							//团体名
							_t.forItem.snmpCommunity = res.data.snmpCommunity;
							//snmp安全级别
							_t.forItem.snmpSecurityLevel = res.data.snmpSecurityLevel;
							//snmp验证算法
							_t.forItem.snmpAuthAlgorithm = res.data.snmpAuthAlgorithm;
							//snmp验证密码
							_t.forItem.snmpAuthPassword = res.data.snmpAuthPassword;
							//snmp私有验证算法
							_t.forItem.snmpPrivacyAlgorithm = res.data.snmpPrivacyAlgorithm;
							//snmp私有密码
							_t.forItem.snmpPrivacyPassword = res.data.snmpPrivacyPassword;
							//snmp文件名称
							_t.forItem.snmpContextName = res.data.snmpContextName;
							//监测间隔时间
							_t.forItem.monitorInterval = res.data.monitorInterval.toString();
							//传参id
							_t.forItem.deviceId = res.data.deviceId;
							//监测间隔
							_t.forItem.port = res.data.port;
							_t.getMonitorIntervalList();
							_t.ModifyMonitoringSettingsBg = true;
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
			//点击修改监测设置弹出层的确认按钮
			getModifyMonitoringSettings() {
				var _t = this;
				_t.$api.put('/monitor/deviceMonitorAttr/', {
					deviceMonitorAttr: {
						deviceId: _t.forItem.deviceId,
						username: _t.forItem.username,
						password: _t.forItem.password,
						port: _t.forItem.port,
						snmpVersion: _t.forItem.snmpVersion,
						//snmp端口
						snmpPort: _t.forItem.snmpPort,
						//snmp用户名
						snmpUsername: _t.forItem.snmpUsername,
						//团体名
						snmpCommunity: _t.forItem.snmpCommunity,
						//snmp安全级别
						snmpSecurityLevel: _t.forItem.snmpSecurityLevel,
						//snmp验证算法
						snmpAuthAlgorithm: _t.forItem.snmpAuthAlgorithm,
						//snmp验证密码
						snmpAuthPassword: _t.forItem.snmpAuthPassword,
						//snmp私有验证算法
						snmpPrivacyAlgorithm: _t.forItem.snmpPrivacyAlgorithm,
						//snmp私有密码
						snmpPrivacyPassword: _t.forItem.snmpPrivacyPassword,
						//snmp文件名称
						snmpContextName: _t.forItem.snmpContextName,
						//监测时间
						monitorInterval: _t.forItem.monitorInterval,
					}
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.ModifyMonitoringSettingsBg = false;
							/*_t.getData();*/
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
			//安全级别筛选
			selectsnmpSecurityLevel(val) {
				if (val.snmpSecurityLevel === 'noAuthNoPriv') {
					val.snmpAuthAlgorithm = '';
					val.snmpAuthPassword = '';
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authNoPriv') {
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authPriv') {
				}
			},
			//添加监测安全级别筛选
			selectsnmpSecurityLevels(val) {
				if (val.snmpSecurityLevel === 'noAuthNoPriv') {
					val.snmpAuthAlgorithm = '';
					val.snmpAuthPassword = '';
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authNoPriv') {
					val.snmpPrivacyAlgorithm = '';
					val.snmpPrivacyPassword = '';
				} else if (val.snmpSecurityLevel === 'authPriv') {
				}
			}
		},

		created() {
		}
	}
</script>

<style scoped>
	.displayNone {
		overflow: hidden;
	}

	.menu1 {
		overflow: hidden;
		width: 180px;
		position: fixed;
		border-radius: 6px;
		border: 1px solid #999999;
		background-color: #f4f4f4;
		z-index: 9999;
	}

	.menu1 li:hover {
		background-color: #1790ff;
		color: white;
	}

	.menu1 .menu1__item {
		display: block;
		color: #252A2F;
		font-size: 12px;
		line-height: 25px;
		border-bottom: 1px solid #ccc;
		text-align: center;
	}

	/*.menu1 .menu1__item:last-child{
		text-align: left;
		
	}*/

	.menu__item {
		display: block;
		color: #252A2F;
		font-size: 12px;
		line-height: 25px;
		border-bottom: 1px solid #ccc;
		text-align: center;
		/*margin-top: 5px;
    margin-bottom: 5px;*/
	}

	.menu__item:last-child {
		border-bottom: none;
	}

	.menu {
		overflow: hidden;
		width: 60px;
		position: absolute;
		border-radius: 6px;
		border: 1px solid #999999;
		background-color: #f4f4f4;
	}

	.menu li:hover {
		background-color: #1790ff;
		color: white;
	}

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
		width: 14px;
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

	.borderRightColorGray {
		overflow: hidden;
		height: 100%;
	}

	.dataDictionary-title {
		overflow: hidden;
	}

	.dataDictionary-title a {
		line-height: 40px;
		padding-left: 20px;
		font-weight: 600;
	}

	.EquipmentMonitoringBj ul li {
		padding-bottom: 20px;
	}

	.EquipmentMonitoringBj ul li label {
		display: inline-block;
		width: 60px;
	}

	.AddEquipmentMonitoring_box {
		display: flex;
	}

	.AddEquipmentMonitoring_left {
		border: 1px solid #ccc;
		/*margin-left:10px ;*/
		width: 254px;
		height: 455px;
	}

	.AddEquipmentMonitoring_right {
		flex: 1;
		height: 455px;
		padding-left: 20px;
	}

	.StartMonitoringTb {
		cursor: pointer;
	}

	.TransferOfGrouping_left {
		width: 432px;
		float: left;
	}

	.TransferOfGrouping_left_span {
		background-color: #f0f0f0;
		display: block;
		padding-left: 10px;
		line-height: 40px;
		margin-bottom: 12px;
	}

	.TransferOfGrouping_right {
		width: 432px;
		float: right;
	}

	.TransferOfGrouping_right_span {
		background-color: #f0f0f0;
		display: block;
		padding-left: 10px;
		line-height: 40px;
		margin-bottom: 12px;
	}
</style>
<style>
	.borderBottom_formItem {
		padding-bottom: 0 !important;
	}

	.borderBottom_formItem .el-form .el-form-item {
		margin-bottom: 20px;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		color: #4386c6;
	}

	.custom-tree-node {
		font-weight: bold;
	}

	.upload-container .image-preview .image-preview-wrapper img {
		height: 100px;
	}

	.el-dialog .el-collapse-item__wrap {
		padding-top: 0px;
	}

	.upload-container .image-preview .image-preview-wrapper {
		width: 120px;
	}

	.upload-container .image-preview .image-preview-action {
		line-height: 100px;
		height: 100px;
	}

	.EquipmentMonitoringGrid .el-dialog {
		width: 812px;
		height: 525px;
	}

	.EquipmentMonitoringBj .el-dialog {
		width: 501px;
		height: 325px;
	}

	.EquipmentMonitoringSc .el-dialog {
		width: 200px;
		height: 180px;
	}

	.alarmCurrentBox .el-form--inline .el-form-item {
		margin: 0;
	}

	.EquipmentMonitoring-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 100;
	}

	.closeCheckBox {
		margin-left: 30px;
	}

	.closeCheckBox .el-checkbox__label {
		font-size: 12px;
	}

	#EquipmentMonitoring-tabs {
		position: fixed;
		bottom: 0;
		right: 20px;
		left: 80px;
		top: 118px;
		z-index: 1100;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom {
		margin-top: 0;
		position: absolute;
		bottom: 0;
		left: -24px;
		right: -20px;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item {
		font-size: 12px;
		position: relative;
	}

	#EquipmentMonitoring-tabs > .el-tabs__content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 40px;
		top: 0;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:before {
		content: '';
		width: 10px;
		height: 10px;
		display: inline-block;
		position: absolute;
		top: 0;
		left: -10px;
		border-radius: 0 10px 0 0;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item:after {
		content: '';
		position: absolute;
		top: 10px;
		right: 0;
		height: 20px;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active:after {
		content: '';
		width: 10px;
		height: 10px;
		display: inline-block;
		position: absolute;
		top: 0;
		right: -10px;
		border-radius: 10px 0 0 0;
	}

	#EquipmentMonitoring-tabs .el-tabs__header.is-bottom .el-tabs__nav-scroll {
		padding: 0 20px;
	}

	.massdia .el-dialog {
		height: 230px;
	}

	.TransferOfGroupingClass .el-dialog {
		width: 944px;
		height: 566px;
	}

	.AddEquipmentMonitoring .el-dialog {
		width: 944px;
		height: 588px;
	}

	.StartTheMonitoring .el-dialog {
		width: 350px;
		height: 180px;
	}

	.ModifyMonitoringSettings .el-dialog {
		width: 770px;
		height: 476px;
	}

	.ModifyMonitoringSettings .el-form-item {
		width: 46%;
		height: 25px;
	}

	.ModifyMonitoringSettings .el-form-item__label {
		width: 130px;
		height: 25px;
	}

	#dataLimit-box-tree .el-checkbox.is-disabled {
		display: none;
	}
</style>
