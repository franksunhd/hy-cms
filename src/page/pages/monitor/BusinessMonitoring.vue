<template>
	<Box>
		<!--左侧导航-->
		<div id="BusinessMonitoring_left" v-show="isShow" class="BusinessMonitoring-navBar">
			<div class="BusinessMonitoring-title">
				<div class="BusinessMonitoring-title_text" @click="clickNode">
					{{$t('BusinessMonitoring.NavBusinessGroup')}}
				</div>
				<div class="BusinessMonitoring-title_button" @click="appendDevice('1')">
					<span class="iconfont BusinessMonitoring-title_tb">&#xe689;</span>
					<span class="BusinessMonitoring-title_xz">{{$t('BusinessMonitoring.NavNews')}}</span>
				</div>
			</div>
			<!--左侧树-->
			<el-tree
				ref="leftTreeCatalog"
				class="dataDictionary-tree"
				:data="treeData"
				highlight-current
				node-key="nodeId"
				@node-click="getCurrentNode"
				@node-contextmenu="rightClick"
				:props="defaultPropssss"
				:expand-on-click-node="true"
				:default-expanded-keys="defaultExpandedKeys">
					<span class="custom-tree-node" slot-scope="{ node, data}">
						<span v-if="treeStatusMap[data.nodeId] == 99" class="iconfont fs14 iconfontError">&#xe64a;</span>
						<span v-if="treeStatusMap[data.nodeId] == 66" class="iconfont fs14 iconfontWarn">&#xe649;</span>
						<span v-if="treeStatusMap[data.nodeId] == 22" class="iconfont fs14 iconfontLightBlue">&#xe64f;</span>
						<span v-if="treeStatusMap[data.nodeId] == 11" class="iconfont fs14 iconfontDisable">&#xe64b;</span>
						<span v-if="treeStatusMap[data.nodeId] == 33" class="iconfont fs14 iconfontSuccess">&#xe648;</span>
					    <span>{{data.nodeName}}</span>
					</span>
			</el-tree>
			<div v-show="menuVisible">
				<ul id="menu" class="menu">
					<li class="menu__item cursorPointer" @click="appendDevice('0')">
						<i class="el-icon-share"> {{$t('BusinessMonitoring.NavIncrease')}}</i></li>
					<li class="menu__item cursorPointer" @click="EditDevice">
						<i class="el-icon-edit"> {{$t('BusinessMonitoring.NavTheEditor')}}</i></li>
					<li class="menu__item cursorPointer" @click="remove" v-if="showVisible"><i
						class="el-icon-delete"> {{$t('BusinessMonitoring.NavDelete')}}</i></li>
				</ul>
			</div>
			<!--收起-->
			<a href="javascript:;" @click="clickInset" id="BusinessMonitoring-navBar-inSet">
				<span class="iconfont">&#xe68b;</span>
			</a>
		</div>
		<!--展开-->
		<a href="javascript:;" @click="clickOutset" id="BusinessMonitoring-navBar-outSet">
			<span class="iconfont">&#xe69d;</span>
		</a>
		<div id="resize-navBar" v-show="isShow"></div>
		<!--右侧内容区域-->
		<div class="BusinessMonitoring-routerView" id="BusinessMonitoring_right">
			<!--面包屑区域-->
			<div class="Breadcrumb">
				<el-breadcrumb>
					<el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
					<el-breadcrumb-item>{{$t('breadcrumb.BusinessMonitoring')}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="padding20 borderBottom borderBottom_formItem marginTop50">
				<!--表单-->
				<el-form :model="formItem" inline>
					<!--设备分类/类型-->
					<el-form-item :label="$t('BusinessMonitoring.formDeviceType') + '：'">
						<el-popover trigger="click" placement="bottom-start" v-model="isShowTypePopover"
									ref="popover">
							<el-tree :data="equipmentTypeList" highlight-current :expand-on-click-node="false"
									 @node-click="clickTypeNode" :props="defaultProps"/>
							<el-input v-model="formItem.equipmentType" class="width180"
									  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
						</el-popover>
					</el-form-item>
					<!--设备名称/序列号/IP-->
					<el-form-item :label="$t('BusinessMonitoring.formDeviceNameSerialNumberIP') + '：'">
						<el-input v-model="formItem.searchStr" class="width180" @keyup.enter.native="getData()" clearable/>
					</el-form-item>
					<!--设备状态-->
					<el-form-item :label="$t('BusinessMonitoring.formStatus') + '：'">
						<el-select v-model="formItem.equipmentStatus" class="width180" @change="getData" clearable>
							<el-option v-for="(item,index) in formBaseData.AlarmSeverity" :key="index"
									   :label="item.name" :value="item.type"/>
						</el-select>
					</el-form-item>
					<!--查询按钮-->
					<el-form-item>
						<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}
						</el-button>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item>
						<el-button class="queryBtn" type="reset" @click="formReset">{{$t('public.reset')}}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<!--表格区域-->
			<div class="padding20">
				<!--全局操作按钮-->
				<div class="marBottom16">
					<!--关联设备-->
					<el-button :disabled="isBus" @click="TransferOfGrouping" class="fs14">
						<span class="iconfont iconfont_color">&#xe65b;</span>
						{{$t('BusinessMonitoring.BtnDeviceContext')}}
					</el-button>
					<!--添加设备监测-->
					<el-button @click="AddDeviceMonitoring" class="fs14">
						<span class="iconfont iconfont_color">&#xe689;</span>
						{{$t('BusinessMonitoring.BtnAddTheMonitor')}}
					</el-button>
					<!--启动监测-->
					<el-button @click="StartMonitoring" class="fs14" :disabled="ischeck">
						<span class="iconfont iconfont_color">&#xe68d; </span>
						{{$t('BusinessMonitoring.BtnStartTheMonitoring')}}
					</el-button>
					<!--暂停监测-->
					<el-button @click="SuspendMonitoring" class="fs14" :disabled="ischeck">
						<span class="iconfont iconfont_color">&#xe64b; </span>
						{{$t('BusinessMonitoring.BtnSuspendMonitoring')}}
					</el-button>
					<!--删除监测-->
					<el-button @click="DeleteTheMonitoring" class="fs14" :disabled="ischeck">
					<span class="iconfont iconfont_color">&#xe650; </span>
					{{$t('BusinessMonitoring.BtnDeleteTheMonitoring')}}
					</el-button>
					<!--忽略告警-->
					<el-button @click="IgnoreTheAlarm" class="fs14" :disabled="ischeck">
						<span class="iconfont iconfont_color">&#xe68e; </span>
						{{$t('BusinessMonitoring.BtnIgnoreTheAlarm')}}
					</el-button>
					<!--取消忽略-->
					<el-button @click="CancelToIgnore" class="fs14" :disabled="ischeck">
						<span class="iconfont iconfont_color">&#xe64e; </span>
						{{$t('BusinessMonitoring.BtnCancelToIgnore')}}
					</el-button>
					<!--离线设备-->
					<!--<el-button>
						<span class="iconfont iconfont_color">&#xe6a9;</span>
						{{$t('BusinessMonitoring.BtnOfflineEquipment')}}
					</el-button>-->
				</div>
				<!--表格-->
				<el-table
					border
					:data="tableData"
					stripe
					@cell-click="cellClickColumn"
					@selection-change="handleSelectionChange">
					<el-table-column
						type="selection"
						:label="$t('BusinessMonitoring.columnFutureGenerations')"
						header-align="center" align="center" width="40">
					</el-table-column>
					<!--序号-->
					<el-table-column width="60px"
									 :label="$t('public.index')"
									 header-align="center"
									 align="center">
						<template slot-scope="scope">
								<span>
									{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
								</span>
						</template>
					</el-table-column>
					<!--监测状态-->
					<el-table-column
						width="150px"
						:label="$t('BusinessMonitoring.columnWorkStatus')"
						prop="workStatus"
						header-align="left" align="left">
						<template slot-scope="scope">
							<div class="displayNone" @mouseover="displayInlineBlock(scope.row)"
								 @mouseout="displayNone(scope.row)">
								<el-tooltip effect="dark"
											:content="tableDataBase.DeviceMonitorStatus[scope.row.deviceMonitorAttr.workStatus]"
											placement="top-start">
									<span>{{tableDataBase.DeviceMonitorStatus[scope.row.deviceMonitorAttr.workStatus]}}</span>
								</el-tooltip>
								<div v-show="scope.row.InlineBlock" class="displayInlineBlock">
									<el-tooltip v-if="scope.row.deviceMonitorAttr.workStatus ==11" effect="dark"
												:content="$t('BusinessMonitoring.BtnStartTheMonitoring')"
												placement="top-start">
											<span @click="StartMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe68d;</span>
									</el-tooltip>
									<el-tooltip v-if="scope.row.deviceMonitorAttr.workStatus == 33||scope.row.deviceMonitorAttr.workStatus == 23"
												effect="dark" :content="$t('BusinessMonitoring.BtnSuspendMonitoring')"
												placement="top-start">
											<span @click="SuspendMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe64b;</span>
									</el-tooltip>
									<el-tooltip
										v-if="scope.row.deviceMonitorAttr.workStatus == 11||scope.row.deviceMonitorAttr.workStatus == 22||scope.row.deviceMonitorAttr.workStatus == 23||scope.row.deviceMonitorAttr.workStatus == 33"
										effect="dark" :content="$t('BusinessMonitoring.BtnDeleteTheMonitoring')"
										placement="top-start">
											<span @click="DeleteTheMonitoring(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe650;</span>
									</el-tooltip>
									<el-tooltip v-if="scope.row.deviceMonitorAttr.workStatus == 23||scope.row.deviceMonitorAttr.workStatus == 33"
												effect="dark" :content="$t('BusinessMonitoring.BtnIgnoreTheAlarm')"
												placement="top-start">
											<span @click="IgnoreTheAlarm(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe68e;</span>
									</el-tooltip>
									<el-tooltip v-if="scope.row.deviceMonitorAttr.workStatus == 22" effect="dark"
												:content="$t('BusinessMonitoring.BtnCancelToIgnore')"
												placement="top-start">
											<span @click="CancelToIgnore(scope.row.id)"
												  class="iconfont StartMonitoringTb">&#xe64e;</span>
									</el-tooltip>
								</div>
							</div>
						</template>
					</el-table-column>
					<!--设备状态-->
					<el-table-column
						width="80px"
						prop="status"
						:label="$t('BusinessMonitoring.columnStatus')"
						header-align="center" align="center">
						<template slot-scope="scope">
							<el-tooltip v-if="scope.row.deviceMonitorAttr.status == 99" effect="dark"
										:content="tableDataBase.AlarmSeverity[scope.row.deviceMonitorAttr.status]"
										placement="top-start">
								<span class="iconfont iconfontError">&#xe64a;</span>
							</el-tooltip>
							<el-tooltip v-if="scope.row.deviceMonitorAttr.status == 66" effect="dark"
										:content="tableDataBase.AlarmSeverity[scope.row.deviceMonitorAttr.status]"
										placement="top-start">
								<span class="iconfont iconfontWarn">&#xe649;</span>
							</el-tooltip>
							<el-tooltip v-if="scope.row.deviceMonitorAttr.status == 22" effect="dark"
										:content="tableDataBase.AlarmSeverity[scope.row.deviceMonitorAttr.status]"
										placement="top-start">
								<span class="iconfont iconfontLightBlue">&#xe64f;</span>
							</el-tooltip>
							<el-tooltip v-if="scope.row.deviceMonitorAttr.status == 11" effect="dark"
										:content="tableDataBase.AlarmSeverity[scope.row.deviceMonitorAttr.status]"
										placement="top-start">
								<span class="iconfont iconfontDisable">&#xe64b;</span>
							</el-tooltip>
							<el-tooltip v-if="scope.row.deviceMonitorAttr.status == 33" effect="dark"
										:content="tableDataBase.AlarmSeverity[scope.row.deviceMonitorAttr.status]"
										placement="top-start">
								<span class="iconfont iconfontSuccess">&#xe648;</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--资产信息-->
					<el-table-column :label="$t('BusinessMonitoring.columnAssetInformation')" header-align="center"
									 align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.deviceName+','+scope.row.ip"
										placement="top-start">
								<span>{{scope.row.deviceName}}【{{scope.row.ip}}】</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--序列号-->
					<el-table-column :label="$t('BusinessMonitoring.columnServiceTag')" header-align="left"
									 align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.servicetag" placement="top-start">
								<span>{{scope.row.servicetag}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--厂商型号-->
					<el-table-column :label="$t('BusinessMonitoring.columnManufacturersModel')" header-align="left"
									 align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.manufacturer+','+scope.row.model"
										placement="top-start">
								<span>{{scope.row.manufacturer}},{{scope.row.model}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--设备类型-->
					<el-table-column :label="$t('BusinessMonitoring.columnType')" header-align="left" align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="tableDataBase.AssetType[scope.row.type]"
										placement="top-start">
								<span>{{tableDataBase.AssetType[scope.row.type]}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--所属业务-->
					<el-table-column :label="$t('BusinessMonitoring.columnSubordinateToTheBusiness')" header-align="left" align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.assetBusiness.businessPath"
										placement="top-start">
								<span>{{scope.row.assetBusiness.businessPath}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--更新时间-->
					<el-table-column width="140px" :label="$t('BusinessMonitoring.columnLastMonitorTime')"
									 header-align="left" align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.deviceMonitorAttr.lastMonitorTime | dateFilter"
										placement="top-start">
								<span>{{scope.row.deviceMonitorAttr.lastMonitorTime | dateFilter}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!--操作-->
					<el-table-column prop="operation" width="70px" :label="$t('BusinessMonitoring.columnOperation')"
									 header-align="left" align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark"
										:content="$t('BusinessMonitoring.columnModifyTheMonitorThreshold')"
										placement="top-start">
									<span class="iconfont iconfontError iconfont_font cursorPointer"
										  @click="monitorThreshold(scope.row)">&#xe655;</span>
							</el-tooltip>
							<el-tooltip effect="dark" :content="$t('BusinessMonitoring.columnModifyMonitoringSettings')"
										placement="top-start">
									<span style="padding-left: 10px;"
										  class="iconfont iconfontError iconfont_font cursorPointer"
										  @click="ModifyMonitoringSettings(scope.row)">&#xe656;</span>
							</el-tooltip>
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
		<!--标签页-->
		<AdministrationTags
			@changePageDeviceId="changePageDeviceId"
			@refreshSetInterval="refreshSetInterval"
			@clearSetInterval="clearSetInterval"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId"/>
		<!--修改监测设置弹出层-->
		<el-dialog class="ModifyMonitoringSettings" :close-on-click-modal="false"
				   :close-on-press-escape="false" append-to-body
				   :before-close="getModifyMonitoringSettingsQx"
				   :title="$t('BusinessMonitoring.dialogModifyMonitoringSettings')"
				   :visible.sync="ModifyMonitoringSettingsBg">
			<el-form inline :model="forItemss">
				<el-form-item :label="$t('BusinessMonitoring.dialogDeviceName') +'：'">
					<span>{{forItemss.deviceName}}</span>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogServiceTag') +'：'">
					<span>{{forItemss.servicetag}}</span>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogBrand') +'：'">
					<span>{{forItemss.manufacturer}}</span>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogModel') +'：'">
					<span>{{forItemss.model}}</span>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogType') +'：'">
					<span v-if="forItemss.type==1">{{$t('BusinessMonitoring.dialogRackTowerServer')}}</span>
					<span v-if="forItemss.type==2">{{$t('BusinessMonitoring.dialogNetworkEquipment')}}</span>
					<span v-if="forItemss.type==3">{{$t('BusinessMonitoring.dialogMinicomputer')}}</span>
					<span v-if="forItemss.type==4">{{$t('BusinessMonitoring.dialogBladeToolCase')}}</span>
					<span v-if="forItemss.type==5">{{$t('BusinessMonitoring.dialogTheStorageDevice')}}</span>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogIPAddress') + '：'">
					<span>{{forItemss.ip}}</span>
				</el-form-item>
			</el-form>
			<el-form inline :model="forItem">
				<el-form-item v-if="forItemss.type== 1 || forItemss.manufacturer.toLowerCase()=='huawei'"
							  :label="$t('DeviceManualDetection.username') + '：'">
					<el-input v-model="forItem.username" class="width200" clearable></el-input>
				</el-form-item>
				<el-form-item v-if="forItemss.type == 1 || forItemss.manufacturer.toLowerCase()=='huawei'"
							  :label="$t('DeviceManualDetection.password') + '：'">
					<el-input type="password" v-model="forItem.password" class="width200"
							  clearable></el-input>
				</el-form-item>
				<br/>
				<el-form-item v-if="forItemss.type == 1 || forItemss.manufacturer.toLowerCase()=='huawei'"
							  :label="$t('DeviceManualDetection.port') + '：'">
					<el-input v-model="forItem.port" class="width200" clearable></el-input>
				</el-form-item>
				<el-form-item v-if="forItemss.type == 2 || forItemss.manufacturer.toLowerCase()=='huawei'"
							  :label="$t('DeviceManualDetection.snmpVersion') + '：'">
					<el-select v-model="forItem.snmpVersion"
							   :placeholder="$t('public.select')"
							   class="width200"
							   clearable>
						<el-option v-for="item in version" :key="item.value" :label="item.label"
								   :value="item.value">
						</el-option>
					</el-select>

				</el-form-item>
				<el-form-item v-if="forItemss.type == 2 || forItemss.manufacturer.toLowerCase()=='huawei'"
							  :label="$t('DeviceManualDetection.snmpPort') + '：'">
					<el-input v-model="forItem.snmpPort" class="width200" clearable></el-input>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion!=='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion!=='3')"
					:label="$t('DeviceManualDetection.snmpCommunity') + '：'">
					<el-input type="password" v-model="forItem.snmpCommunity" class="width200"
							  clearable></el-input>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpUsername') + '：'">
					<el-input v-model="forItem.snmpUsername" class="width200" clearable></el-input>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpSecurityLevel') + '：'">
					<el-select v-model="forItem.snmpSecurityLevel"
							   :placeholder="$t('public.select')" clearable
							   class="width200" @change="selectsnmpSecurityLevel(forItem)">
						<el-option v-for="item in SecurityLevel" :key="item.value"
								   :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpAuthAlgorithm') + '：'">
					<el-select v-model="forItem.snmpAuthAlgorithm" clearable
							   :placeholder="$t('public.select')"
							   class="width200"
							   :disabled="forItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='authPriv') ? false:false">
						<el-option v-for="item in VerifyTheAlgorithm" :key="item.value"
								   :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpAuthPassword') + '：'">
					<el-input type="password"
							  v-model="forItem.snmpAuthPassword"
							  class="width200"
							  clearable
							  :disabled="forItem.snmpSecurityLevel==='noAuthNoPriv' ? true:(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpPrivacyAlgorithm') + '：'">
					<el-select v-model="forItem.snmpPrivacyAlgorithm"
							   :placeholder="$t('public.select')"
							   class="width200" clearable
							   :disabled="(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forItem.snmpSecurityLevel==='authPriv') ? false:false">
						<el-option v-for="item in PrivateVerificationAlgorithm " :key="item.value"
								   :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpPrivacyPassword') + '：'">
					<el-input type="password" v-model="forItem.snmpPrivacyPassword" class="width200"
							  clearable
							  :disabled="(forItem.snmpSecurityLevel==='authNoPriv'||forItem.snmpSecurityLevel==='noAuthNoPriv')? true:(forItem.snmpSecurityLevel==='authPriv') ? false:false"></el-input>
				</el-form-item>
				<el-form-item
					v-if="(forItemss.type == 2&&forItem.snmpVersion==='3')||(forItemss.manufacturer.toLowerCase()=='huawei'&&forItem.snmpVersion==='3')"
					:label="$t('DeviceManualDetection.snmpContextName') + '：'">
					<el-input v-model="forItem.snmpContextName" class="width200"
							  clearable></el-input>
				</el-form-item>
				<el-form-item :label="$t('BusinessMonitoring.dialogMonitoringOfTheInterval') + '：'">
					<el-select v-model="forItem.monitorInterval" class="width200" clearable
							   :placeholder="$t('public.select')">
						<el-option v-for="item in monitorIntervalList" :key="item.type"
								   :label="item.name" :value="item.type"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" class="fontsize14 alertBtn" @click="getModifyMonitoringSettings">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="fontsize14 alertBtn" @click="getModifyMonitoringSettingsQx">
					{{$t('public.cancel')}}
				</el-button>
			</div>
		</el-dialog>
		<!--关联设备-->
		<AssociatedEquipment
			@AssociatedEquipmentBg="AssociatedEquipmentBgFun"
			:associated-equipment-bg="AssociatedEquipmentBg"
			:is-bus="isBus"
			@isBus="isBusFun"
			:business-id="businessId"
			@businessId="businessIdFun"
			:resource-checked-key="resourceCheckedKey"
			ref="myChild"/>
		<!--添加监测-->
		<AddTheMonitor
			@AddDeviceMonitoringBg="AddDeviceMonitoringBgFun"
			:add-device-monitoring-bg="AddDeviceMonitoringBg"
			@AddDeviceMonitoringNextBg="AddDeviceMonitoringNextBgFun"
			:add-device-monitoring-next-bg="AddDeviceMonitoringNextBg"
			ref="myChildTwe"/>
		<!--右键-->
		<RightBusiness
			@getTableData="getTableDataBc"
			@dialogGrouping="dialogGroupingFun"
			:dialog-grouping="dialogGrouping"
			@dialogGroupingBj="dialogGroupingBjFun"
			:dialog-grouping-bj="dialogGroupingBj"
			@dialogGroupingSc="dialogGroupingScFun"
			:dialog-grouping-sc="dialogGroupingSc"
			:object="object"
			:deleteId="deleteId"
			@delete-id="deleteIdFun"
			ref="myControl"/>
	</Box>
</template>
<script>
	import {dateFilter} from "../../../assets/js/filters";
	import Box from '../../../components/common/Box';
	import AdministrationTags from '../../../components/monitor/AdministrationTabs';
	import AssociatedEquipment from '../../../components/monitor/AssociatedEquipment';
	import AddTheMonitor from '../../../components/monitor/AddTheMonitor';
	import RightBusiness from "../../../components/monitor/RightBusiness";
	export default {
		name: "BusinessMonitoring",
		components: {
			RightBusiness,
			Box,
			AdministrationTags,
			AssociatedEquipment,
			AddTheMonitor,
		},
		data() {
			return {
				//按钮禁用
				ischeck:true,
				defaultExpandedKeys: [],
				/*右键获值*/
				object: {},
				/*点击删除按钮得到当前的ID*/
				deleteId: '',
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
					/*设备名称/序列号/IP*/
					searchStr: null,
					/*设备类型*/
					equipmentType: this.$t('public.all'),
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
				// 设备告警详情提交字段
				addEdit: {
					id: ''
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
				dataInfoResourceTree: [], // 资源视图树
				/*编辑分组 父级节点*/
				computerRoomListFj: [],
				racksData: [],
				// 设备状态下拉框
				equipmentStatusList: [],
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
				isShowTypePopover: false, // 控制设备类型下拉框的显示隐藏
				isShowBusinessPopover: false, // 关联业务树形下拉框显示隐藏
				dialogGrouping: false, //新增设备分组弹出层
				dialogGroupingBj: false, //编辑设备分组弹出层
				dialogGroupingSc: false, //删除设备分组弹出层
				AssociatedEquipmentBg: false, //转移设备分组弹出层
				AddDeviceMonitoringBg: false, //添加设备监测弹出层
				AddDeviceMonitoringNextBg: false, //添加设备监测第二级弹出层
				ModifyMonitoringSettingsBg: false, //修改监测设置弹出层
				isShowAddDeviceMonitoringtree: false, //控制添加设备监测弹出层右侧树形下拉框显示隐藏
				dialogVisibleOwnerInfo: false, // 业务责任人信息弹出层
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				isShow: true,
				//右侧内容区默认的left值
				leftOfRightView: 172,
				levelList: null,
				//树形控件模拟数据
				treeData: [],
				//左侧数状态集合
				treeStatusMap:{},
				/*转移设备右侧树*/
				defaultPropses: {
					children: 'children',
					label: 'nodeName',
					nodeId: 'nodeId',
				},
				/*设备类型tree*/
				defaultProps: {
					children: 'children',
					label: 'nodeName'
				},
				/*dataInfoTreeProps: {
					// label: 'nodeName',
					children: 'children',
					disabled: function (data, node) {
						if (data.orderNum === 1) {
							return true;
						}
					}
				},*/
				/*左侧数tree*/
				defaultPropssss: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},

				selectlistRow: [],
				parentNode: '',
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
					snmpVersion: '2C',
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
				resourceCheckedKey: [],
				one: '1',
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				pageDeviceId: '',
				pageDeviceName: '',
				//业务Id
				businessId:null,
				//关联设备按钮是否禁用
				isBus:true,
			}
		},
		methods: {
			getTableDataBc(val){
			var _t=this;
			if(val){
				_t.getData();
			}
			},
			/*拿浏览器宽度*/
			BrowserWidth() {
				var n = 320;
				var clientWidth = document.body.clientWidth - 308;
				var num = clientWidth / n;
			},
			deleteIdFun(val) {
				var _t = this;
				_t.deleteId = val;
			},

			/*刪除设备分组弹出层*/
			dialogGroupingScFun(val) {
				var _t = this;
				_t.dialogGroupingSc = val;
			},
			/*编辑设备分组弹出层*/
			dialogGroupingBjFun(val) {
				var _t = this;
				_t.dialogGroupingBj = val;
			},
			/*新增设备分组弹出层*/
			dialogGroupingFun(val) {
				var _t = this;
				_t.dialogGrouping = val;
			},
			/*关联设备*/
			AssociatedEquipmentBgFun(val) {
				var _t = this;
				_t.AssociatedEquipmentBg = val;
			},
			/*关联业务按钮是否禁用*/
			isBusFun(val){
				var _t = this;
				_t.isBus = val;
				},
			/*关联业务 选中业务id*/
			businessIdFun(val){
				var _t = this;
				_t.businessId = val;
			},
			/*添加监测接受值*/
			AddDeviceMonitoringBgFun(val) {
				var _t = this;
				_t.AddDeviceMonitoringBg = val;
			},
			AddDeviceMonitoringNextBgFun(val) {
				var _t = this;
				_t.AddDeviceMonitoringNextBg = val;
			},
			// 修改阈值
			monitorThreshold(val) {
				var _t = this;
				_t.$router.push({
					name: 'monitorThresholdValue',
					params: {
						deviceId: val.id,
					}
				});
				localStorage.setItem('hy-deviceId', val.id);
			},
			// 点击设备类型下拉框节点
			clickTypeNode(val) {
				var _t = this;
				_t.formItem.equipmentType = val.nodeName;
				_t.formItem.equipmentTypeId = val.nodeCode;
				_t.isShowTypePopover = false;
				_t.options.currentPage=1;
				_t.options.pageSize=10;
				_t.getData();
			},
			//点击删除按钮
			remove() {
				var _t = this;
				_t.dialogGroupingSc = true;
			},
			//点击新增按钮弹出框
			appendDevice(val) {
				var _t = this;
				if(val==1){
					_t.$refs.myControl.getXztree();
					_t.$refs.myControl.getDataTree();
				}else if(val==0){
					_t.$refs.myControl.getDataTree();
					_t.$refs.myControl.getBjtree();
				}
				_t.dialogGrouping = true;

			},
			//点击编辑设备按钮弹出层
			EditDevice() {
				var _t = this;
				_t.dialogGroupingBj = true;
				_t.$refs.myControl.getBjtree();
				_t.$refs.myControl.getDataTree();
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('monitor/deviceMonitor/businessPagelist', {
					jsonString: JSON.stringify({
						businessDevice: {
							/*设备类型*/
							type: _t.formItem.equipmentTypeId == null ? null : (_t.formItem.equipmentTypeId.trim() == '' ? null : _t.formItem.equipmentTypeId.trim()),
							monitorStatus: 1,
							/*设备名称/序列号/IP*/
							searchStr: _t.formItem.searchStr == null ? null : (_t.formItem.searchStr.trim() == '' ? null : _t.formItem.searchStr.trim()),
							assetBusiness: {
								id: null,
								parentId: null,
								businessPath: _t.formItem.catalogPath == null ? null : (_t.formItem.catalogPath.trim() == '' ? null : _t.formItem.catalogPath.trim()),
							},
							assetDataCenter: {
								id: null,
								name: null
							},
							/*设备状态*/
							deviceMonitorAttr: {
								status: _t.formItem.equipmentStatus == null ? null : (_t.formItem.equipmentStatus.trim() == '' ? null : _t.formItem.equipmentStatus.trim()),
							}
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize,
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if(res.data!==null){
								var tableData = res.data.list === null ? [] : res.data.list;
								tableData.forEach((item) => {
									item.InlineBlock = false;
								});
								_t.tableData = tableData;
								var resourceCheckedKey=[];
								for(var i=0;i<tableData.length;i++){
									resourceCheckedKey.push(tableData[i].id);
								}
								_t.resourceCheckedKey=resourceCheckedKey;
								_t.options.currentPage = res.data.currentPage;
								_t.options.total = res.data.count;
							}
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
				})
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
			// 单元格点击
			cellClickColumn(row, column) {
				var _t = this;
				// 点击资产信息列
				if ((column.label === _t.$t('BusinessMonitoring.columnStatus')) || (column.label === _t.$t('BusinessMonitoring.columnAssetInformation'))) {
					if (row.id !== null) {
						_t.pageDeviceId = row.id;
						_t.pageDeviceName = row.deviceName;
						//销毁刷新定时器
						clearInterval(_t.timer);
						_t.timer = null;
					}
				}
			},
			// 收缩
			clickInset() {
				this.isShow = false;
				document.getElementById('BusinessMonitoring-navBar-outSet').style.display = 'inline-block';
				document.getElementById('BusinessMonitoring_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isShow = true;
				document.getElementById('BusinessMonitoring-navBar-outSet').style.display = 'none';
				document.getElementById('BusinessMonitoring_right').style.left = this.leftOfRightView + "px";
			},
			//左右拖拽调整左侧的树的大小
			reSizeWin() {
				var _t = this;
				var inSet = document.getElementById("BusinessMonitoring-navBar-inSet");
				var left = document.getElementById("BusinessMonitoring_left");
				var resize = document.getElementById("resize-navBar");
				var right = document.getElementById("BusinessMonitoring_right");
				resize.onmousedown = function (e) {
					var startX = e.clientX;
					resize.left = resize.offsetLeft;
					document.onmousemove = function (e) {
						var endX = e.clientX;
						var moveLen = resize.left + (endX - startX);
						//var maxT = box.clientWidth - resize.offsetWidth;
						//设置左侧导航最小宽度
						if (moveLen < 172) moveLen = 172;
						//设置左侧导航最大宽度
						//if(moveLen>maxT-200) moveLen = maxT-200;
						if (moveLen > 370) moveLen = 370;
						//左侧菜单导航宽度56px,小图标自身宽度14
						inSet.style.left = (moveLen + 56 - 14) + "px";
						//左侧内容区宽度
						left.style.width = moveLen + "px";
						resize.style.left = moveLen + "px";
						//设置右侧内容区的left值
						_t.leftOfRightView = moveLen + 2;
						right.style.left = _t.leftOfRightView + "px";
					};
					document.onmouseup = function (evt) {
						document.onmousemove = null;
						document.onmouseup = null;
						resize.releaseCapture && resize.releaseCapture();
					};
					resize.setCapture && resize.setCapture();
					return false;
				}
			},
			//左侧树状态接口
			getDataStatus(){
				var _t=this;
				_t.$api.get('asset/assetBusiness/businessStatus',{},function(res){
					switch (res.status){
						case 200:
							if(res.data!==null){
								var resData=res.data;
								_t.treeStatusMap=resData;
							}
							break;
						default:
							break;
					}
				})
			},
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.treeData = res.data.children === null ? [] : res.data.children;
							//重新打开左侧的树
							_t.$nextTick(function () {
								if (null != _t.formItem.catalogId) {
									_t.defaultExpandedKeys = [];
									_t.$refs.leftTreeCatalog.setCurrentKey(_t.formItem.catalogId);
									_t.defaultExpandedKeys.push(_t.formItem.catalogId);
								};
								_t.getDataStatus();
							});
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
				_t.isBus=false;
				_t.businessId=data.nodeId;
				_t.formItem.catalogPath = data.nodeCode;
				_t.formItem.catalogId = data.nodeId;
				_t.formItem.catalogName = data.nodeName;
				_t.options.currentPage=1;
				_t.options.pageSize=10;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 0;
				_t.getData();
			},
			// 查询表格中状态对应的数据值
			getTableDataValue() {
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
							_t.tableDataBase = res.data;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableDataBase = {};
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
								nodeName: _t.$t('public.all'),
								level: 1,
								children: null,
								nodeCode: null,
								parentNodeId: '0',
								nodeId: null
							});
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
			//表单重置按钮
			formReset() {
				var _t = this;
				_t.formItem = {
					/*设备类型*/
					equipmentType: _t.$t('public.all'),
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
				_t.options.currentPage=1;
				_t.options.pageSize=10;
				_t.getData();
			},
			//右键左侧树
			rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
				var _t = this;
				_t.object = object;
				_t.deleteId = object.nodeId;
				_t.addEditss.nodeId = object.nodeId;
				_t.addEditss.nodeName = object.nodeName;
				_t.formItem.catalogId = object.nodeId;
				_t.formItem.catalogName = object.nodeName;
				if (object.children.length === 0) {
					_t.showVisible = true;
				} else {
					_t.showVisible = false;
				}
				_t.menuVisible = false;  // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
				_t.menuVisible = true;  // 显示模态窗口，跳出自定义菜单栏
				var menu = document.querySelector('#menu');
				menu.style.left = MouseEvent.clientX - 80 + 'px';
				document.addEventListener('click', this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
				menu.style.top = MouseEvent.clientY - 70 + 'px';
			},
			foo() { // 取消鼠标监听事件 菜单栏
				var _t = this;
				_t.menuVisible = false;
				document.removeEventListener('click', _t.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
			},
			//点击关联设备 弹出层
			TransferOfGrouping() {
				var _t = this;
				_t.$refs.myChild.getInfoDataTree();
				_t.$refs.myChild.getBaseData();
				_t.$refs.myChild.getDataBus();
				_t.AssociatedEquipmentBg = true;
				_t.resourceCheckedKey = _t.resourceCheckedKey;

			},
			//点击添加设备监测按钮弹出层
			AddDeviceMonitoring() {
				var _t = this;
				_t.$refs.myChildTwe.getDataTree();
				_t.$refs.myChildTwe.getQueryTable();
				_t.$refs.myChildTwe.getBaseData();
				_t.AddDeviceMonitoringBg = true;
			},
			//点击启动监测按钮弹出层
			StartMonitoring(ids) {
				var _t = this;
				var StartTheIds = [];
				StartTheIds.push(ids);
				_t.StartTheMonitoringBg = true;
				if (_t.multipleSelection.length === 0) {
					_t.multipleSelection = StartTheIds
				}
				_t.$confirm(_t.$t('BusinessMonitoring.dialogAreYouSureYouWantToStartMonitoring')+' ！', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.post('/monitor/deviceMonitorAttr/execute', {
						option: 33,
						isDevice: true,
						ids: _t.multipleSelection,
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
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
				}).catch(() => {
					return;
				});
			},
			//点击暂停监测按钮弹出层
			SuspendMonitoring(ids) {
				var _t = this;
				var suspendedIds = [];
				suspendedIds.push(ids);
				if (_t.multipleSelection.length === 0) {
					_t.multipleSelection = suspendedIds
				}
				_t.$confirm(_t.$t('BusinessMonitoring.dialogPleaseConfirmWhetherToSuspendTheMonitoring')+' ！', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.post('/monitor/deviceMonitorAttr/execute', {
						option: 11,
						isDevice: true,
						ids: _t.multipleSelection
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
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
				}).catch(() => {
					return;
				});
			},
			//点击删除监测按钮弹出层
			DeleteTheMonitoring(ids) {
				var _t = this;
				var DeleteTheIds = [];
				DeleteTheIds.push(ids);
				if (_t.multipleSelection.length === 0) {
					_t.multipleSelection = DeleteTheIds
				}
				_t.$confirm(_t.$t('BusinessMonitoring.dialogAreYouSureYouWantTtoDeleteTheMonitor')+' ！', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.post('/monitor/deviceMonitorAttr/execute', {
						option: 37,
						isDevice: true,
						ids: _t.multipleSelection
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
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
				}).catch(() => {
					return;
				});
			},
			//点击忽略告警按钮弹出层
			IgnoreTheAlarm(ids) {
				var _t = this;
				var IgnoreTheIds = [];
				IgnoreTheIds.push(ids);
				if (_t.multipleSelection.length === 0) {
					_t.multipleSelection = IgnoreTheIds
				}
				_t.$confirm(_t.$t('BusinessMonitoring.dialogPleaseConfirmWhetherTheAlarmMonitoringShouldBeIgnored')+' ！', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.post('/monitor/deviceMonitorAttr/execute', {
						option: 22,
						isDevice: true,
						ids: _t.multipleSelection
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
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
				}).catch(() => {
					return;
				});
			},

			//点击取消忽略按钮弹出层
			CancelToIgnore(ids) {
				var _t = this;
				var CancelToIds = [];
				CancelToIds.push(ids);
				if (_t.multipleSelection.length === 0) {
					_t.multipleSelection = CancelToIds
				}
				_t.$confirm(_t.$t('BusinessMonitoring.dialogAreYouSureYouWantToCancelTheIgnore')+' ！', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.post('/monitor/deviceMonitorAttr/execute', {
						option: 23,
						isDevice: true,
						ids: _t.multipleSelection
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
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
				}).catch(() => {
					return;
				});
			},
			/*获取表格选中的Id*/
			handleSelectionChange(val) {
				var _t = this;
				var multipleSelection = [];
				for (var i = 0; i < val.length; i++) {
					multipleSelection.push(val[i].id)
				}
				_t.multipleSelection = multipleSelection;
				if(val.length!==0){
					_t.ischeck=false;
				}else {
					_t.ischeck=true;
				}
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
					switch (res.status) {
						case 200:
							var monitorIntervalList = res.data.MonitorRate;
							_t.monitorIntervalList = monitorIntervalList;
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
			//点击修改监测设置弹出层的取消按钮
			getModifyMonitoringSettingsQx() {
				var _t = this;
				_t.ModifyMonitoringSettingsBg = false;
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
			//修改监测设置安全级别筛选
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
			//表单部分的展开隐藏
			ClickOne(val) {
				var _t = this;
				_t.one = val;
			},
			// 接收组件中传回的设备id
			changePageDeviceId(val) {
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val) {
				var _t = this;
				if (val) {
					_t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val) {
				var _t = this;
				if (val) {
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			//页面定时刷新
			refreshPage() {
				var _t = this;
				var rate = 5 * 60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-Monitor'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
						}
					}
				}
				// 定时器防止密集访问
				_t.timer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.lastTime = nowTime;
						//刷新左侧树形设备分组数据
						_t.getDataTree();
						//分页查询最新告警设备列表表格数据
						_t.getData();
					}
				}, rate * 1000);
			}
		},
		created() {
			var _t = this;
			var dataStatus = _t.$route.params.homeEquipmentStatus ? _t.$route.params.homeEquipmentStatus : localStorage.getItem('homeEquipmentStatus');
			var dataObject = _t.$route.params.homeEquipmentData ? _t.$route.params.homeEquipmentData : localStorage.getItem('homeEquipmentData');
			if (typeof dataObject === 'string') {
				dataObject = JSON.parse(dataObject);
			}
			// 判断 是导航 进入还是 首页点击 折线图进入
			if (dataStatus) {
				// 折线图
				_t.formItem.equipmentType = dataObject.nodeName;
				_t.formItem.equipmentTypeId = dataObject.nodeId;
				_t.formItem.equipmentStatus = dataObject.status;
			}
		},
		mounted() {
			var _t = this;
			_t.getTableDataValue();
			_t.getDataTree();
			_t.getData();
			_t.getBaseData();
			_t.getBaseDataList();
			_t.BrowserWidth();
			//调整左侧树形区宽度
			_t.reSizeWin();
			_t.$bus.on('getDeviceTreeData', (val) => {
				if (val) {
					_t.getData();
				}
			});
			/*新增设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeXz', (val) => {
				if (val) {
					_t.getDataTree();
				}
			});
			/*删除设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeSc', (val) => {
				if (val) {
					_t.getDataTree();
				}
			});
			/*编辑设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeBj', (val) => {
				if (val) {
					_t.getDataTree();
				}
			});
			_t.$bus.on('tableData', (val) => {
				if (val) {
					_t.getData();
				}
			});
			//定时刷新页面
			_t.refreshPage();
		},
		beforeDestroy() {
			var _t = this;
			localStorage.removeItem('homeEquipmentStatus');
			localStorage.removeItem('homeEquipmentData');
			// 销毁关于标签页 圆角化的样式
			var styleTag = document.getElementsByTagName('style');
			for (var key in styleTag) {
				if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
					styleTag[key].remove();
				}
			}
			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style scoped>
	.fontsize14 {
		font-size: 14px;
	}

	.iconfont_color {
		font-size: 14px;
		color: #888;
	}

	.iconfont_font {
		font-size: 14px;
		color: #3F81D0;
	}

	.displayNone {
		overflow: hidden;
	}

	.menu__item {
		display: block;
		color: #252A2F;
		font-size: 12px;
		line-height: 25px;
		border-bottom: 1px solid #ccc;
		text-align: center;
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

	.BusinessMonitoring-routerView {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}

	.BusinessMonitoring-navBar {
		width: 174px;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		overflow: auto;
		background-color: #fff;
	}


	#BusinessMonitoring-navBar-inSet,
	#BusinessMonitoring-navBar-outSet {
		height: 40px;
		width: 14px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}

	#BusinessMonitoring-navBar-inSet {
		left: 214px;
		border-radius: 15px 0 0 15px;
	}

	#BusinessMonitoring-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}

	#resize-navBar {
		width: 2px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 172px;
		border-right: 2px solid #eaedf1;
		cursor: col-resize;
		z-index: 1002;
	}

	.BusinessMonitoring-title {
		overflow: hidden;
		line-height: 40px;
		padding-left: 20px;
		font-weight: 600;
		height: 40px;
	}

	.BusinessMonitoring-title_text {
		float: left;
		line-height: 40px;
	}

	.BusinessMonitoring-title_button {
		cursor: pointer;
		float: right;
		line-height: 40px;
		margin-right: 10px;
		color: #3F81D0;
	}

	.BusinessMonitoring-title_tb,
	.BusinessMonitoring-title_xz {
		vertical-align: middle;
	}

	.EquipmentMonitoringBj ul li {
		padding-bottom: 20px;
	}

	.EquipmentMonitoringBj ul li label {
		display: inline-block;
		width: 60px;
	}

	.StartMonitoringTb {
		cursor: pointer;
		font-size: 14px;
		color: #888;
	}
</style>
<style>
	.borderBottom_formItem {
		padding-bottom: 0 !important;
	}

	.borderBottom_formItem .el-form .el-form-item {
		margin-bottom: 20px;
	}

	.alarmCurrentBox .el-form--inline .el-form-item {
		margin: 0;
	}

	.StartTheMonitoring .el-dialog {
		width: 350px;
		height: 180px;
	}

	.ModifyMonitoringSettings .el-dialog {
		width: 800px;
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
