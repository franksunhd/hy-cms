<template>
	<Box>
		<div id="box-all">
			<!-- 左侧导航 -->
			<div id="assetDevice_left" class="assetDevice-leftView" v-show="isLeftShow">
				<el-collapse v-model="collapseActiveName" @change="getCollapseActiveNames" accordion>
					<el-collapse-item :title="$t('assetDevice.leftCollapseMonitor')" name="1">
						<div class="left_collapseItem_content">
							<el-tree
								ref="leftTreeMonitor"
								class="dataDictionary-tree"
								:data="leftTreeData"
								node-key="nodeId"
								highlight-current
								:props="leftTreeProps"
								@node-click="getCurrentNode"
								@node-contextmenu="rightClick"
								:default-expand-all="false"
								:default-expanded-keys="defaultExpandedMonitorTreeKeys">
								<span class="custom-tree-node" slot-scope="{node, data}">
									<span>{{ node.label }}</span>
								</span>
							</el-tree>
						</div>
					</el-collapse-item>
					<el-collapse-item :title="$t('assetDevice.leftCollapseUnMonitor')" name="0">
						<div class="left_collapseItem_content">
							<el-tree
								ref="leftTreeUnMonitor"
								class="dataDictionary-tree"
								:data="leftTreeData"
								node-key="nodeId"
								@node-contextmenu="rightClick"
								:props="leftTreeProps"
								highlight-current
								@node-click="getCurrentNode"
								:default-expand-all="false"
								:default-expanded-keys="defaultExpandedUnMonitorTreeKeys">
								<span class="custom-tree-node" slot-scope="{node, data}">
									<span>{{ node.label }}</span>
								</span>
							</el-tree>
						</div>
					</el-collapse-item>
				</el-collapse>
				<!-- 点击进行左侧导航的隐藏 -->
				<a href="javascript:;" @click="clickInset" id="assetDevice-navBar-inSet">
					<span class="iconfont">&#xe68b;</span>
				</a>
			</div>
			<!-- 点击进行左侧导航的显示 -->
			<a href="javascript:;" @click="clickOutset" id="assetDevice-navBar-outSet">
				<span class="iconfont">&#xe69d;</span>
			</a>
			<div id="resize-navBar" v-show="isLeftShow"></div>
			<!-- 右侧内容 -->
			<div id="assetDevice_right" class="assetDevice-rightView">
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>{{$t('breadcrumb.assetManage')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.assetDevice')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="borderBottomForm">
					<!--表单-->
					<el-form :model="formItem" inline>
						<el-form-item :label="$t('assetDevice.formEquipmentNameInfo') + ' / ' + $t('assetDevice.formSerialNumber') + ' / ' + $t('assetDevice.formEquipmentIp') + '：'">
							<el-input v-model="formItem.searchStr" class="width200" @keyup.enter.native="getData()" clearable/>
						</el-form-item>
						<el-form-item>
							<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
							<el-button class="queryBtn" type="reset" @click="resetData">{{$t('public.reset')}}</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="padding20">
					<!--按钮-->
					<div style="text-align: right; margin-bottom: 20px;">
						<!--转移分组-->
						<el-button @click="toTransferGroup">
							<span class="iconfont fs14">&#xe65b;</span>{{$t('assetDevice.btnTransferOfGrouping')}}
						</el-button>
						<!--添加设备监测-->
						<el-button @click="toAddDeviceMonitoring" v-show="collapseActiveName == '0'">
							<span class="iconfont fs14">&#xe689;</span>
							{{$t('assetDevice.btnAddToMonitor')}}
						</el-button>
						<!--导入-->
						<el-button @click="toImportData">
							<span class="iconfont fs14">&#xe6af; </span>{{$t('assetDevice.btnImport')}}
						</el-button>
						<!--导出-->
						<el-button @click="toDownloadData">
							<span class="iconfont fs14">&#xe6a8; </span>{{$t('assetDevice.btnExport')}}
						</el-button>
					</div>
					<!--表格-->
					<el-table border :data="tableData" stripe @cell-click="clickCellOfTable" @selection-change="selectTableLine">
						<!--序号-->
						<el-table-column width="60px" :label="$t('public.index')" header-align="center" align="center">
							<template slot-scope="scope">
								<span>
									{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
								</span>
							</template>
						</el-table-column>
						<!--IP-->
						<el-table-column width="130px" :label="$t('assetDevice.columnAssetIp')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.ip" placement="left-start">
									<span>{{scope.row.ip}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--设备品牌-->
						<el-table-column :label="$t('assetDevice.columnManufacturer')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.manufacturer" placement="left-start">
									<span>{{scope.row.manufacturer}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--设备名称-->
						<el-table-column :label="$t('assetDevice.columnDeviceName')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.deviceName" placement="left-start">
									<span>{{scope.row.deviceName}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--序列号-->
						<el-table-column :label="$t('assetDevice.columnServicetag')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.servicetag" placement="left-start">
									<span>{{scope.row.servicetag}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--资产编号-->
						<el-table-column :label="$t('assetDevice.columnAccessCode')" header-align="center" align="left">
							<template slot-scope="scope">
								<span>{{scope.row.accessCode == null? 'N/A' : (scope.row.accessCode == '' ? 'N/A' : scope.row.accessCode)}}</span>
							</template>
						</el-table-column>
						<!--资产管理员-->
						<el-table-column :label="$t('assetDevice.columnChargeBy')" header-align="center" align="left">
							<template slot-scope="scope">
								<span>{{scope.row.chargeBy == null? 'N/A' : (scope.row.chargeBy == '' ? 'N/A' : scope.row.chargeBy)}}</span>
							</template>
						</el-table-column>
						<!--设备类型-->
						<el-table-column
							width="170px" :label="$t('assetDevice.columnAssetType')"
							header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="dictionaryMap.AssetType[scope.row.type]" placement="left-start">
									<span>{{dictionaryMap.AssetType[scope.row.type]}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--机房-->
						<el-table-column :label="$t('assetDevice.columnRoomName')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="top-start">
									<div slot="content">
										{{scope.row.roomName == null? 'N/A' : (scope.row.roomName == '' ? 'N/A' : scope.row.roomName)}}
									</div>
									<span>{{scope.row.roomName == null? 'N/A' : (scope.row.roomName == '' ? 'N/A' : scope.row.roomName)}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--机柜-->
						<el-table-column :label="$t('assetDevice.columnRackName')" header-align="center" align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="top-start">
									<div slot="content">
										{{scope.row.rackName == null? 'N/A' : (scope.row.rackName == '' ? 'N/A' : scope.row.rackName)}}
									</div>
									<span>{{scope.row.rackName == null? 'N/A' : (scope.row.rackName == '' ? 'N/A' : scope.row.rackName)}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!--位置-->
						<el-table-column :label="$t('assetDevice.columnRackPosition')" header-align="center" align="left">
							<template slot-scope="scope">
								<span>{{scope.row.rackPosition == null ? 'N/A' : (scope.row.rackPosition == '' ? 'N/A' : scope.row.rackPosition + 'U')}}</span>
							</template>
						</el-table-column>
						<!--更新时间-->
						<el-table-column
							width="150px" :label="$t('assetDevice.columnLastMonitorTime')"
							header-align="center" align="center">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.lastMonitorTime | dateFilter" placement="top-start">
									<span>{{scope.row.lastMonitorTime | dateFilter}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column type="selection" header-align="center" align="center" width="55"/>
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
		</div>
		<!-- 导入Excel -->
		<el-dialog
			class="assetDeviceImport-dialog"
			append-to-body
			:title="$t('assetDevice.dialog.import.dialogTitle')"
			:visible.sync="assetDeviceImportDialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-upload
				ref="upload"
				name="excel"
				accept=".xls,.xlsx"
				:headers="uploadHeaders"
				:auto-upload="false"
				:multiple="false"
				:limit="1"
				:file-list="fileList"
				:on-exceed="onExceedHandle"
				:on-remove="onRemoveHandle"
				:before-upload="beforeUploadHandle"
				:on-success="uploadSuccessHandle"
				:on-error="uploadErrorHandle"
				:action="rootUrl + '/asset/assetDevice/toImportExcel'">
				<el-button class="alertBtn" type="primary">{{$t('public.pickUpFile')}}</el-button>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="submitUpload" :disabled="submitUploadButtonDisabled">{{$t('public.submitUpload')}}</el-button>
			</div>
		</el-dialog>
		<!-- 展示Excel内容 -->
		<el-dialog
			class="showExcelContent-dialog"
			:title="showExcelContent_dialogTitle"
			append-to-body
			:visible.sync="excelAnalyzeResultDialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-table
				:data="excelAnalyzeResultDataList"
				class="excelAnalyzeResult" border height="455"
				v-loading="saveExcelContent_loading"
				:element-loading-text="saveExcelContent_loadingText"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)">
				<!-- 序号 -->
				<el-table-column
					width="50px" align="center" fixed="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnOrder')">
					<template slot-scope="scope">
						<span>
							{{scope.$index+1}}
						</span>
					</template>
				</el-table-column>
				<!-- 校验 -->
				<el-table-column
					width="70px" align="center" fixed="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnVerify')">
					<template slot-scope="scope">
						<span v-if="scope.row.isPass" class="iconfont iconfontSuccess">&#xe648;</span>
						<span v-if="!scope.row.isPass" style="display: inline-block;" class="iconfont iconfontError">&#xe64e;</span>
					</template>
				</el-table-column>
				<!-- 设备类型 -->
				<el-table-column
					width="120px" align="left" fixed="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnTypeName')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.typeNameVerify"
							:content="scope.row.typeName" type="dark" placement="left">
							<span>{{scope.row.typeName}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.typeNameVerify"
							:content="scope.row.typeNameVerifyMsg"
							placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.typeName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 带外IP -->
				<el-table-column
					width="120px" align="center" fixed="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnIP')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.ipVerify"
							:content="scope.row.ip" type="dark" placement="left">
							<span>{{scope.row.ip}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.ipVerify"
							:content="scope.row.ipVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.ip}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 序列号 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnServicetag')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.servicetagVerify"
							:content="scope.row.servicetag" type="dark" placement="left">
							<span>{{scope.row.servicetag}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.servicetagVerify"
							:content="scope.row.servicetagVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.servicetag}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 数据中心 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnDataCenter')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.dataCenterVerify"
							:content="scope.row.dataCenter" type="dark" placement="left">
							<span>{{scope.row.dataCenter}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.dataCenterVerify"
							:content="scope.row.dataCenterVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.dataCenter}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 所属机房 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnRoomName')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.roomNameVerify"
							:content="scope.row.roomName" type="dark" placement="left">
							<span>{{scope.row.roomName}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.roomNameVerify"
							:content="scope.row.roomNameVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.roomName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 机柜 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnRackName')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.rackNameVerify"
							:content="scope.row.rackName" type="dark" placement="left">
							<span>{{scope.row.rackName}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.rackNameVerify"
							:content="scope.row.rackNameVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.rackName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 机架U位 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnRackPosition')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.rackPositionVerify"
							:content="scope.row.rackPosition" type="dark" placement="left">
							<span>{{scope.row.rackPosition}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.rackPositionVerify"
							:content="scope.row.rackPositionVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.rackPosition}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 生产IP -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnProductIp')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.productIpVerify"
							:content="scope.row.productIp" type="dark" placement="left">
							<span>{{scope.row.productIp}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.productIpVerify"
							:content="scope.row.productIpVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.productIp}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 厂商 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnManufacturer')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.manufacturerVerify"
							:content="scope.row.manufacturer" type="dark" placement="left">
							<span>{{scope.row.manufacturer}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.manufacturerVerify"
							:content="scope.row.manufacturerVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.manufacturer}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 设备型号 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnModel')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.modelVerify"
							:content="scope.row.model" type="dark" placement="left">
							<span>{{scope.row.model}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.modelVerify"
							:content="scope.row.modelVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.model}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 资产编号 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnAccessCode')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.accessCodeVerify"
							:content="scope.row.accessCode" type="dark" placement="left">
							<span>{{scope.row.accessCode}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.accessCodeVerify"
							:content="scope.row.accessCodeVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.accessCode}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 设备责任人 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnChargeBy')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.chargeByVerify"
							:content="scope.row.chargeBy" type="dark" placement="left">
							<span>{{scope.row.chargeBy}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.chargeByVerify"
							:content="scope.row.chargeByVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.chargeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 业务责任人 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnBusinessChargeBy')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.businessChargeByVerify"
							:content="scope.row.businessChargeBy" type="dark" placement="left">
							<span>{{scope.row.businessChargeBy}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.businessChargeByVerify"
							:content="scope.row.businessChargeByVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.businessChargeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 设备名称 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnDeviceName')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.deviceNameVerify"
							:content="scope.row.deviceName" type="dark" placement="left">
							<span>{{scope.row.deviceName}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.deviceNameVerify"
							:content="scope.row.deviceNameVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.deviceName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 操作系统名称 -->
				<el-table-column
					width="200px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnOs')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.osVerify"
							:content="scope.row.os" type="dark" placement="left">
							<span>{{scope.row.os}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.osVerify"
							:content="scope.row.osVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.os}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 应用系统 -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnApp')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.appVerify"
							:content="scope.row.app" type="dark" placement="left">
							<span>{{scope.row.app}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.appVerify"
							:content="scope.row.appVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.app}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 服务商 -->
				<el-table-column
					width="180px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnServiceAgent')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.serviceAgentVerify"
							:content="scope.row.serviceAgent" type="dark" placement="left">
							<span>{{scope.row.serviceAgent}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.serviceAgentVerify"
							:content="scope.row.serviceAgentVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.serviceAgent}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 联系人 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnServiceAgentUser')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.serviceAgentUserVerify"
							:content="scope.row.serviceAgentUser" type="dark" placement="left">
							<span>{{scope.row.serviceAgentUser}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.serviceAgentUserVerify"
							:content="scope.row.serviceAgentUserVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.serviceAgentUser}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 联系人电话 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnServiceAgentPhone')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.serviceAgentPhoneVerify"
							:content="scope.row.serviceAgentPhone" type="dark" placement="left">
							<span>{{scope.row.serviceAgentPhone}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.serviceAgentPhoneVerify"
							:content="scope.row.serviceAgentPhoneVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.serviceAgentPhone}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 保修类型 -->
				<el-table-column
					width="120px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnWarrantyType')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.warrantyTypeVerify"
							:content="scope.row.warrantyType" type="dark" placement="left">
							<span>{{scope.row.warrantyType}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.warrantyTypeVerify"
							:content="scope.row.warrantyTypeVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.warrantyType}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 维保开始日期 -->
				<el-table-column
					width="130px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnPurchaseTime')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.purchaseTimeVerify"
							:content="scope.row.purchaseTime" type="dark" placement="left">
							<span>{{scope.row.purchaseTime}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.purchaseTimeVerify"
							:content="scope.row.purchaseTimeVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.purchaseTime}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 终止维保日期 -->
				<el-table-column
					width="130px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnExpireTime')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.expireTimeVerify"
							:content="scope.row.expireTime" type="dark" placement="left">
							<span>{{scope.row.expireTime}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.expireTimeVerify"
							:content="scope.row.expireTimeVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.expireTime}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- typeModel -->
				<el-table-column
					width="150px" header-align="center" align="left"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnTypeModel')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.typeModelVerify"
							:content="scope.row.typeModel" type="dark" placement="left">
							<span>{{scope.row.typeModel}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.typeModelVerify"
							:content="scope.row.typeModelVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.typeModel}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 保修等级 -->
				<el-table-column
					width="150px" header-align="center" align="center"
					:label="$t('assetDevice.dialog.excelAnalyzeResult.columnWarrantyLevel')">
					<template slot-scope="scope">
						<el-tooltip
							v-if="scope.row.warrantyLevelVerify"
							:content="scope.row.warrantyLevel" type="dark" placement="left">
							<span>{{scope.row.warrantyLevel}}</span>
						</el-tooltip>
						<el-tooltip
							v-if="!scope.row.warrantyLevelVerify"
							:content="scope.row.warrantyLevelVerifyMsg" placement="left" popper-class="errorTip">
							<span style="color:red;">{{scope.row.warrantyLevel}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer">
				<div style="float:left; margin-right: 280px; height: 29px; line-height: 29px;">
					<span style="color: green;">{{validateCorrectNumber}}</span>
					<span style="color: red; padding-left: 30px;">{{validateErrorNumber}}</span>
				</div>
				<el-button type="danger" plain class="analyzeResultBtn"
					v-if="excelAnalyzeResultFilePathForError != null" @click="downloadErrorData">
					{{$t('assetDevice.dialog.excelAnalyzeResult.downloadErrorBtn')}}
				</el-button>
				<el-button
					type="primary" class="analyzeResultBtn"
					@click="toSaveExcelData" :disabled="saveExcelContentBtn_disable">
					<template>
						<el-tooltip :content="$t('assetDevice.dialog.excelAnalyzeResult.confirmBtnTip')" placement="top" type="dark">
						<span>{{$t('assetDevice.dialog.excelAnalyzeResult.confirmBtn')}}</span>
					  </el-tooltip>
					</template>
				</el-button>
				<el-button type="default" class="alertBtn"
					@click="closeExcelAnalyzeContentDialog">{{showExcelContent_closeBtn}}</el-button>
			</span>
		</el-dialog>
		<!-- 转移分组 -->
		<TransferOfGrouping
			:equipment-type-list="leftTreeData"
			@TransferOfGroupingBg="TransferOfGroupingBgFun"
			:transfer-of-grouping-bg="TransferOfGroupingBg"
			:resourceCheckedKey="resourceCheckedKey"
			ref="myChild"/>
		<!-- 添加监测 -->
		<AddTheMonitor
			@AddDeviceMonitoringBg="AddDeviceMonitoringBgFun"
			:add-device-monitoring-bg="AddDeviceMonitoringBg"
			@AddDeviceMonitoringNextBg="AddDeviceMonitoringNextBgFun"
			:add-device-monitoring-next-bg="AddDeviceMonitoringNextBg"
			ref="myChildTwe"/>
		<!--右键弹出层-->
		<div v-show="menuVisible">
			<ul id="menu" class="menu">
				<li class="menu__item cursorPointer" @click="appendDevice">
					<i class="el-icon-share"> {{$t('EquipmentMonitoring.increase')}}</i>
				</li>
				<li class="menu__item cursorPointer" @click="EditDevice">
					<i class="el-icon-edit"> {{$t('EquipmentMonitoring.TheEditor')}}</i>
				</li>
				<li class="menu__item cursorPointer" @click="remove" v-if="showVisible">
					<i class="el-icon-delete"> {{$t('EquipmentMonitoring.delete')}}</i>
				</li>
			</ul>
		</div>
		<!--右键监测-->
		<RightCatalog
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
		<!--编辑信息标签页-->
		<editAdministrationTabs
			@changePageDeviceId="changePageDeviceId"
			@refreshSetInterval="refreshSetInterval"
			@clearSetInterval="clearSetInterval"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId"/>
	</Box>
</template>

<script>
	import Box from '../../../components/common/Box';
	// 设备详细信息编辑浮窗
	import editAdministrationTabs from '../../../components/asset/editAdministrationTabs';
	//转移分组
	import TransferOfGrouping from '../../../components/monitor/TransferOfGrouping';
	//添加监测
	import AddTheMonitor from '../../../components/monitor/AddTheMonitor';
	// 右键
	import RightCatalog from "../../../components/monitor/RightCatalog";
	// 日期时间过滤器
	import {dateFilter} from "../../../assets/js/filters";

	export default {
		name: "assetDeviceMaintenance",
		components: {Box, editAdministrationTabs, TransferOfGrouping, AddTheMonitor, RightCatalog},
		data() {
			return {
				rootUrl: this.$api.root(),
				uploadHeaders: {
					'token': localStorage.getItem('hy-token') || ''
				},
				//左侧导航是否展示
				isLeftShow: true,
				//右侧内容区默认的left值
				leftOfRightView: 228,
				collapseActiveName: '1',
				leftTreeData: [],
				// 查询表单
				formItem: {
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*目录节点获取nodeCode*/
					catalogPath: null,
					equipmentName: null,
					equipmentIp: null,
					serialNumber: null,
					/*设备名称/序列号/IP*/
					searchStr: null
				},
				//左侧tree
				leftTreeProps: {
					parentId: 'parentNodeId', // 父级唯一标识
					nodeId: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				defaultExpandedMonitorTreeKeys: [],//已监测设备的tree的展开节点
				defaultExpandedUnMonitorTreeKeys: [],//未监测设备的tree的展开节点

				//转移分组弹窗是否显示
				TransferOfGroupingBg: false,
				AddDeviceMonitoringBg: false, //添加设备监测弹出层
				AddDeviceMonitoringNextBg: false, //添加设备监测第二级弹出层

				//导入excel弹窗是否显示
				assetDeviceImportDialogVisible: false,
				submitUploadButtonDisabled: false,
				fileList: [],
				showExcelContent_dialogTitle: this.$t('assetDevice.dialog.excelAnalyzeResult.dialogTitle'),
				showExcelContent_closeBtn: this.$t('public.cancel'),
				//Excel的解析结果弹窗是否显示
				excelAnalyzeResultDialogVisible: false,
				//excel解析后的数据列表
				excelAnalyzeResultDataList: [],
				//解析接口返回的错误数据的文件路径
				excelAnalyzeResultFilePathForError: null,
				//解析接口返回的文件校验的key
				excelAnalyzeResultValidateKey: null,
				saveExcelContent_loading:false,
				saveExcelContent_loadingText:"拼命加载中",
				saveExcelContentBtn_disable:false,
				//校验通过与错误的数量
				validateCorrectNumber:"格式校验正确数：0",
				validateErrorNumber:"错误数：0",

				//页面刷新频率map
				RefreshRateMap: {},
				// 全局按钮启用禁用判断
				disableBtn: {
					more: true
				},
				// 表格数据
				tableData: [],
				// 缓存表格数据用于纯前端筛选
				tableDataAll: [],
				// 表格数据字典
				dictionaryMap: {
					AssetType: {}
				},
				// 表单数据字典
				formBaseData: {},
				checkValueList: [], // 表格选中的数据集合
				resourceCheckedKey: [], // 表格选中的数据集合
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				///*点击删除按钮得到当前的ID*/
				deleteId: '',
				//右键获值
				object: {},
				dialogGrouping: false, //新增设备分组弹出层
				dialogGroupingBj: false, //编辑设备分组弹出层
				dialogGroupingSc: false, //删除设备分组弹出层
				showVisible: false, //控制tree弹出层删除按钮隐藏
				menuVisible: false, //控制tree右键弹出框
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				pageDeviceId:'', // 设备id
				pageDeviceName: '', // 设备名称
			}
		},
		methods: {
			// 重置筛选表单数据
			resetData() {
				var _t = this;
				//目录ID 左侧树形控件
				_t.formItem.catalogId = null;
				//目录节点名称 左侧树形控件
				_t.formItem.catalogName = null;
				//目录节点获取nodeCode
				_t.formItem.catalogPath = null;
				//设备名称
				_t.formItem.equipmentName = null;
				//IP
				_t.formItem.equipmentIp = null;
				//序列号
				_t.formItem.serialNumber = null;
				/*设备名称/序列号/IP*/
				_t.formItem.searchStr = null;

				_t.options.currentPage=1;
				_t.options.pageSize=10;
				_t.getData();
			},
			// 收缩
			clickInset() {
				this.isLeftShow = false;
				document.getElementById("assetDevice-navBar-outSet").style.display = "inline-block";
				document.getElementById("assetDevice_right").style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isLeftShow = true;
				document.getElementById("assetDevice-navBar-outSet").style.display = "none";
				document.getElementById("assetDevice_right").style.left = this.leftOfRightView + "px";
			},
			//获取手风琴模式的折叠面板的打开的item名称
			getCollapseActiveNames(activeNames) {
				var _t = this;
				_t.collapseActiveName = activeNames;
				_t.formItem.catalogPath = null;

				_t.getData();
			},
			toTransferGroup() {
				var _t = this;
				_t.$refs.myChild.getInfoDataTree();
				_t.$refs.myChild.getBaseData();
				_t.resourceCheckedKey = _t.checkValueList;
				_t.TransferOfGroupingBg = true;
			},
			//点击添加设备监测按钮弹出层
			toAddDeviceMonitoring() {
				var _t = this;
				_t.$refs.myChildTwe.getDataTree();
				_t.$refs.myChildTwe.getQueryTable();
				_t.$refs.myChildTwe.getBaseData();
				_t.AddDeviceMonitoringBg = true;
			},
			TransferOfGroupingBgFun(val) {
				this.TransferOfGroupingBg = val;
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
			//行的点击事件
			clickCellOfTable(row, column) {
				var _t = this;
				if (row.id !== null) {
					_t.pageDeviceId = row.id;
					_t.pageDeviceName = row.deviceName;
					//销毁刷新定时器
					clearInterval(_t.timer);
					_t.timer = null;
				}
			},
			// 表格选中的值
			selectTableLine(data) {
				//data 每次传进来的都是当前表格选中的行
				var _t = this;
				if (data.length !== 0) {
					_t.disableBtn.more = false;
				} else {
					_t.disableBtn.more = true;
				}

				var checkValueList = new Array();
				data.forEach((item) => {
					checkValueList.push(item.id);
				});
				_t.checkValueList = checkValueList;
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetDevice/pagelist', {
					jsonString: JSON.stringify({
						assetDevice: {
							//目录ID 左侧树形控件
							catalogPath: _t.formItem.catalogPath == null ? null : (_t.formItem.catalogPath == '' ? null : _t.formItem.catalogPath.trim()),
							//设备名称
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName == '' ? null : _t.formItem.equipmentName.trim()),
							ip: _t.formItem.equipmentIp == null ? null : (_t.formItem.equipmentIp == '' ? null : _t.formItem.equipmentIp.trim()),
							//序列号
							servicetag: _t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber == '' ? null : _t.formItem.serialNumber.trim()),
							/*设备名称/序列号/IP*/
							searchStr:_t.formItem.searchStr ==null ? null : (_t.formItem.searchStr.trim() == '' ? null : _t.formItem.searchStr.trim()),
							//监测状态(0:未监测，1：已监测)
							monitorStatus: _t.collapseActiveName
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							var resData = res.data;
							_t.tableData = resData.list === null ? [] : resData.list;
							_t.options.currentPage = resData.currentPage;
							_t.options.total = resData.count;
							_t.tableDataAll = _t.tableData;
							_t.disableBtn.more = true;
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
							_t.disableBtn.more = true;
							break;
					}
				});
			},
			//左侧树形数据获取
			getTreeDataOfLeft() {
				var _t = this;
				_t.$api.get('/asset/assetCatalog/all', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.leftTreeData = res.data.children === null ? [] : res.data.children;
							_t.$nextTick(function () {
								//重新打开左侧的树
								if (null != _t.formItem.catalogId) {
									_t.defaultExpandedUnMonitorTreeKeys = [];
									_t.defaultExpandedMonitorTreeKeys = [];
									if ('0' == _t.collapseActiveName || 0 == _t.collapseActiveName) {
										//未监测设备的tree的展开节点进行高亮
										_t.$refs.leftTreeUnMonitor.setCurrentKey(_t.formItem.catalogId);
										//未监测设备的tree的展开节点
										_t.defaultExpandedUnMonitorTreeKeys.push(_t.formItem.catalogId);
									} else {
										//已监测设备的tree的展开节点进行高亮
										_t.$refs.leftTreeMonitor.setCurrentKey(_t.formItem.catalogId);
										//已监测设备的tree的展开节点
										_t.defaultExpandedMonitorTreeKeys.push(_t.formItem.catalogId);
									}
									//分页查询表格数据
									_t.getData();
								}
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
				_t.formItem.catalogPath = data.nodeCode;
				_t.formItem.catalogId = data.nodeId;
				_t.formItem.catalogName = data.nodeName;
				_t.getData();
			},
			// 获取查询表单下拉框等字典集合
			getBaseDataList() {
				var _t = this;
			},
			// 查询表格中用于翻译的字典
			getDictionaryMapList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AssetType"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							//设置表格的字典翻译
							_t.dictionaryMap.AssetType = res.data.AssetType;
							//分页查询表格数据
							_t.getData();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.dictionaryMap.AssetType = {};
							break;
					}
				});
			},
			// 打开导入excel窗口
			toImportData() {
				var _t = this;
				//打开上传窗口
				_t.assetDeviceImportDialogVisible = true;
				//清空上传列表，以防有文件残留
				_t.fileList = [];
				//将上传按钮先置为启用
				_t.submitUploadButtonDisabled = false;
			},
			//选择导入文件
			importHandleChange(file, fileList) {
				var _t = this;
				return _t.beforeUploadHandle(file);
			},
			//上传的文件个数超出设定时触发的函数
			onExceedHandle(files, fileList) {
				var _t = this;
				_t.$message({
					message: '抱歉，一次最多只能上传一个Excel文件！',
					type: 'warning',
					duration: 6000
				});
			},
			//删除文件列表中的文件时触发
			onRemoveHandle(file, fileList) {
				var _t = this;
				//将上传按钮先置为启用
				_t.submitUploadButtonDisabled = false;
			},
			//上传前校验
			beforeUploadHandle(file) {
				var _t = this;
				var testReg = /(xls|xlsx)$/.test(file.name.toLowerCase());
				var isLt4M = file.size / 1024 / 1024 <= 4; //图片大小不超过4MB
				if (!testReg) {
					_t.$message.error('抱歉，只能上传Excel文件！');
					return false;
				}
				if (!isLt4M) {
					_t.$message.error('抱歉，上传文件大小不能超过 4M!');
					return false;
				}
				return testReg && isLt4M;
			},
			//开始上传
			submitUpload() {
				var _t = this;
				//校验必须选择了文件才能开始上传
				if (_t.$refs.upload.$children[0].fileList.length >= 1) {
					//开始上传
					_t.$refs.upload.submit();
					//将上传按钮置为禁用，以防重复点击上传
					_t.submitUploadButtonDisabled = true;
				} else {
					_t.$message({
						message: '请选择一个Excel文件!',
						duration: 3000,
						type: 'error'
					});
				}
				;
			},
			//上传结果
			uploadSuccessHandle(res, file, fileList) {
				var _t = this;
				if (res.status === 200) {
					_t.showExcelContent_dialogTitle = _t.$t('assetDevice.dialog.excelAnalyzeResult.dialogTitle');
					_t.showExcelContent_closeBtn = _t.$t('public.cancel');
					//先置空原有表格的数据
					_t.excelAnalyzeResultDataList = [];
					//置空解析文件的错误数据集合的下载路径
					_t.excelAnalyzeResultFilePathForError = null;
					//解析文件的文件校验Key
					_t.excelAnalyzeResultValidateKey = null;
					_t.saveExcelContent_loading = false;
					_t.saveExcelContentBtn_disable = false;

					if (null != res.data) {
						if (null != res.data.list) {
							//清空上传列表
							_t.$refs.upload.clearFiles();
							//关闭上传窗口
							_t.assetDeviceImportDialogVisible = false;
							//打开解析解雇窗口
							_t.excelAnalyzeResultDialogVisible = true;
							_t.excelAnalyzeResultDataList = res.data.list;
						}
						if (null != res.data.errorFilePath) {
							_t.excelAnalyzeResultFilePathForError = _t.rootUrl + res.data.errorFilePath;
						}
						if (null != res.data.validateKey) {
							_t.excelAnalyzeResultValidateKey = res.data.validateKey;
						}
						if (null != res.data.correctNumber) {
							_t.validateCorrectNumber = "格式校验正确数：" + res.data.correctNumber;

							if(res.data.correctNumber === 0 || res.data.correctNumber === '0'){
								_t.saveExcelContentBtn_disable = true;
							}else{
								//去后台开启与数据库校验
								_t.toStartValidateData();
							}
						}
						if (null != res.data.errorNumber) {
							_t.validateErrorNumber = "错误数：" + res.data.errorNumber;
						}
					}
					_t.$message({
						message: '上传成功！',
						duration: 3000,
						type: 'success'
					});
				} else {
					var resData = res.data;
					var resMessage = res.message;
					if (null != resData) {
						var msg = resData.title;
						var content = resData.content;
						if (null != content) {
							msg += "</br></br>";
							msg += "<span style='color:red;'>" + content + "</span>";
						}
						_t.$message({
							message: msg,
							dangerouslyUseHTMLString: true,
							showClose: true,
							duration: 0,
							type: 'error'
						});
					} else if (null != resMessage) {
						_t.$message({
							message: resMessage,
							duration: 3000,
							type: 'error'
						});
					} else {
						_t.$message({
							message: '非常抱歉，文件解析失败，请稍后再尝试上传！',
							duration: 3000,
							type: 'error'
						});
					}
				}
			},
			//上传失败
			uploadErrorHandle(err, file) {
				this.$message.error('上传失败');
				this.submitUploadButtonDisabled = false;
			},
			//导出解析异常的数据
			downloadErrorData() {
				var _t = this;

				if (null != _t.excelAnalyzeResultFilePathForError) {
					window.location.href = _t.excelAnalyzeResultFilePathForError;
				}
			},
			//去后台开启与数据库校验
			toStartValidateData() {
				var _t = this;

				_t.$api.get('asset/assetDevice/toStartValidateData', {
					jsonString: JSON.stringify({
						validateKey: _t.excelAnalyzeResultValidateKey
					})
				}, function (res) {

				});
			},
			//保存正常解析的数据
			toSaveExcelData() {
				var _t = this;
				_t.saveExcelContent_loading = true;
				_t.saveExcelContentBtn_disable = true;
				_t.saveExcelContent_loadingText = "拼命加载中";

				// 定时器防止密集访问
				var validateTimer = setInterval(() => {
					_t.$api.get('asset/assetDevice/toSaveExcelData', {
						jsonString: JSON.stringify({
							validateKey: _t.excelAnalyzeResultValidateKey
						})
					}, function (res) {
						switch (res.status) {
							case 200:
								if(null != res.data && undefined != res.data){
									_t.showExcelContent_dialogTitle = _t.$t('assetDevice.dialog.excelAnalyzeResult.dialogSaveResultTitle');
									_t.showExcelContent_closeBtn = _t.$t('public.close');
									var resData = res.data;
									if(0 === resData.validatedNumber){
										_t.saveExcelContent_loadingText = "数据准备中";
									}else if(resData.validatedNumber === resData.totalNumber){
										_t.excelAnalyzeResultDataList = resData.list;
										_t.validateCorrectNumber = "已更新记录数：" + resData.correctNumber;
										_t.validateErrorNumber = "错误数：" + resData.errorNumber;
										if (null != res.data.errorFilePath) {
											_t.excelAnalyzeResultFilePathForError = _t.rootUrl + res.data.errorFilePath;
										}else{
											_t.excelAnalyzeResultFilePathForError = null;
										}
										_t.saveExcelContent_loading = false;
										//销毁定时器
										clearInterval(validateTimer);
									}else{
										_t.saveExcelContent_loadingText = "（已处理记录）" + resData.validatedNumber + "   /   " + resData.totalNumber + "（总记录数）";
									}
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
								_t.disableBtn.more = true;
								break;
						}
					});
				}, 1000);
			},
			//关闭excel解析结果展示窗口
			closeExcelAnalyzeContentDialog(){
				var _t = this;

				//关掉窗口
				_t.excelAnalyzeResultDialogVisible = false;

				//重新分页查询表格数据
				_t.getData();
			},
			// 导出excel数据
			toDownloadData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetDevice/toDownloadExcel', {
					jsonString: JSON.stringify({
						assetDevice: {
							//目录ID 左侧树形控件
							catalogPath: _t.formItem.catalogPath == null ? null : (_t.formItem.catalogPath == '' ? null : _t.formItem.catalogPath.trim()),
							//设备名称
							deviceName: _t.formItem.equipmentName == null ? null : (_t.formItem.equipmentName == '' ? null : _t.formItem.equipmentName.trim()),
							ip: _t.formItem.equipmentIp == null ? null : (_t.formItem.equipmentIp == '' ? null : _t.formItem.equipmentIp.trim()),
							//序列号
							servicetag: _t.formItem.serialNumber == null ? null : (_t.formItem.serialNumber == '' ? null : _t.formItem.serialNumber.trim()),
							//监测状态(0:未监测，1：已监测)
							monitorStatus: _t.collapseActiveName
						},
						deviceIds: _t.checkValueList.join(",")
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							window.location.href = _t.rootUrl + res.data.filePath;
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
			//左右拖拽调整左侧的树的大小
			reSizeWin() {
				var _t = this;

				var inSet = document.getElementById("assetDevice-navBar-inSet");
				var left = document.getElementById("assetDevice_left");
				var resize = document.getElementById("resize-navBar");
				var right = document.getElementById("assetDevice_right");
				//var box = document.getElementById("box-all");

				//设置左侧导航折叠面板打开后面板内容的最大高度
				var collapseItems = document.querySelectorAll(".left_collapseItem_content");
				collapseItems.forEach((item) => {
					// 目前有两个折叠项，每个高度 49，内容区底部有个margin-bottom 25
					item.style.maxHeight = (left.clientHeight - (50 * 2) - 28) + "px";
				});

				resize.onmousedown = function (e) {
					var startX = e.clientX;
					resize.left = resize.offsetLeft;
					document.onmousemove = function (e) {
						var endX = e.clientX;

						var moveLen = resize.left + (endX - startX);
						//var maxT = box.clientWidth - resize.offsetWidth;
						//设置左侧导航最小宽度
						if (moveLen < 200) moveLen = 200;
						//设置左侧导航最大宽度
						//if(moveLen>maxT-200) moveLen = maxT-200;
						if (moveLen > 370) moveLen = 370;

						//左侧菜单导航宽度56px,小图标自身宽度20
						inSet.style.left = (moveLen + 56 - 20) + "px";
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
			// 接收组件中传回的设备id
			changePageDeviceId(val){
				var _t = this;
				_t.pageDeviceId = val;
			},
			// 启动父组件定时器
			refreshSetInterval(val){
				var _t = this;
				if (val) {
					_t.getData();
					_t.refreshPage();
				}
			},
			// 清除父组件定时器
			clearSetInterval(val){
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
					var rateMap = refreshRateJson['RefreshRate-Asset'];
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
						//重新加载左侧的导航目录
						_t.getTreeDataOfLeft();
					}
				}, rate * 1000);
			},
			/*-----------------------------右键功能-------------------------------------*/
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
			//右键左侧树
			rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
				var _t = this;
				_t.object = object;
				_t.deleteId = object.nodeId;
				if (object.children.length == 0) {
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
			//点击删除按钮
			remove() {
				var _t = this;
				_t.dialogGroupingSc = true;
			},
			//点击新增按钮弹出框
			appendDevice() {
				var _t = this;
				_t.$refs.myControl.getDataTree();
				_t.$refs.myControl.getBjtree();
				_t.dialogGrouping = true;
			},//点击编辑设备按钮弹出层
			EditDevice() {
				var _t = this;
				_t.dialogGroupingBj = true;
				_t.$refs.myControl.getBjtree();
				_t.$refs.myControl.getDataTree();
			},
			/*-----------------------------右键功能完-------------------------------------*/
		},
		created() {
			var _t = this;
			_t.$store.commit('setLoading', true);

			//加载左侧菜单的数据
			_t.getTreeDataOfLeft();
			//获取查询表单中的相关下拉框的值
			_t.getBaseDataList();
			//获取分页表格中的需要用于翻译的字典值
			_t.getDictionaryMapList();
		},
		mounted() {
			var _t = this;

			//调整左侧树形区宽度
			_t.reSizeWin();

			//定时刷新页面
			_t.refreshPage();

			_t.$bus.on('getDeviceTreeData', (val) => {
				if (val) {
					//加载左侧菜单的数据
					_t.getTreeDataOfLeft();
				}
			});
			_t.$bus.on('tableData', (val) => {
				if (val) {
					//分页查询表格数据
					_t.getData();
				}
			});
			/*新增设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeXz', (val) => {
				if (val) {
					_t.getTreeDataOfLeft();
				}
			});
			/*删除设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeSc', (val) => {
				if (val) {
					_t.getTreeDataOfLeft();
				}
			});
			/*编辑设备分组后刷新treeData数据*/
			_t.$bus.on('getDataTreeBj', (val) => {
				if (val) {
					_t.getTreeDataOfLeft();
				}
			});
		},
		beforeDestroy() {
			var _t = this;
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
	.assetDevice-leftView {
		width: 227px;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		overflow-y: auto;
	}

	.assetDevice-rightView {
		width: auto;
		position: absolute;
		top: 0;
		left: 228px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}

	#assetDevice-navBar-inSet,
	#assetDevice-navBar-outSet {
		height: 40px;
		width: 20px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}

	#assetDevice-navBar-inSet {
		left: 264px;
		border-radius: 15px 0 0 15px;
	}

	#assetDevice-navBar-outSet {
		left: 55px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}

	#resize-navBar {
		width: 2px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 226px;
		border-right: 2px solid #eaedf1;
		cursor: col-resize;
	}

	.left_collapseItem_content {
		border-top: 1px solid #EBEEF5;
		max-height: 650px;
		overflow: hidden;
		overflow-y: auto;
		font-size: 13px;
		color: #606266;
	}

	.borderBottomForm {
		margin-top: 50px;
		border-bottom: 1px solid #eaedf1;
		padding: 20px 20px 0;
	}

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


</style>
<style>
	#assetDevice_left .el-collapse-item__header {
		text-indent: 10px;
		height: 49px;
		padding: 0 0 0 5px;
	}

	.assetDeviceImport-dialog .el-dialog {
		width: 500px;
		height: 300px;
	}

	.showExcelContent-dialog .el-dialog {
		width: 950px;
		height: 550px;
	}

	.showExcelContent-dialog .el-dialog__body {
		padding: 0px;
		max-height: 455px;
	}

	.showExcelContent-dialog .excelAnalyzeResult tr td,
	.showExcelContent-dialog .excelAnalyzeResult thead tr th {
		height: 35px !important;
		line-height: 35px !important;
	}

	.showExcelContent-dialog .excelAnalyzeResult .el-loading-spinner .el-loading-text {
		font-size: 16px;
		color: white;
	}

	.analyzeResultBtn .el-dialog {
		width: auto !important;
		padding: 0px 8px;
		height: 34px;
		line-height: 34px;
	}

	.errorTip {
		color: red !important;
		background-color: white !important;
		border: 1px solid red !important;
		opacity: 0.8;
	}

	.errorTip .popper__arrow:after {
		border-left-color: red !important;
	}

	.errorTip .popper__arrow {
		border-left-color: red !important;
	}
</style>
