<template>
	<Box>
		<div class="RackConfiguration">
			<!--左侧-->
			<div class="RackConfiguration_left" id="RackConfiguration_left" v-show="isShow">
				<div class="RackConfiguration_left_head">
					<span class="RackConfiguration_left_head_oneSpan">
						{{$t('RackConfiguration.ComputerRoomDirectory')}}
					</span>
				</div>
				<div class="RackConfiguration_left_main">
					<el-collapse
						v-model="activeNames"
						v-for="(item,index) in leftData"
						@change="handleChange"
						:key="index">
						<el-collapse-item :title="item.nodeName" :name="index">
							<div class="RackConfiguration_left_collapse"
									 :id="'RackConfiguration'+items.nodeId"
									 @click="cliiapswClick(items,indexs)"
									 v-for="(items,indexs) in item.children">
								{{items.nodeName}}
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
				<!--收起-->
				<a href="javascript:;" @click="clickInset" id="RackConfiguration-navBar-inSet">
					<span class="iconfont">&#xe68b;</span>
				</a>
			</div>
			<!--展开-->
			<a href="javascript:;" @click="clickOutset" id="RackConfiguration-navBar-outSet">
				<span class="iconfont">&#xe69d;</span>
			</a>
			<div id="resize-navBar" v-show="isShow"></div>
			<!--右侧-->
			<div class="RackConfiguration_right" id="RackConfiguration_right">
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.RackConfiguration')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<!--无数据页面-->
				<div v-if="isPageShow==true" class="isPageShowClass">
					{{$t('RackConfiguration.ThereIsNoRoomDataInTheRoomDirectory')}}
				</div>
				<div v-if="isPageShow==false">
					<div class="RackConfiguration_right_head marginTop50">
						<span v-if="queryItem.name != null && queryItem.name != '' " class="fsBold14">{{queryItem.name}}</span>
						<span v-if="queryItem.floor != null && queryItem.floor != '' "
									style="padding-left: 20px">{{queryItem.floor}}</span>
						<span v-if="queryItem.chargeByName1 != null && queryItem.chargeByName1 != '' "
									style="padding-left: 20px;">
						{{$t('RackConfiguration.formTitleText')+'1'}}：{{queryItem.chargeByName1}}
						<span v-if="queryItem.mobile1 !=null && queryItem.mobile1">【{{queryItem.mobile1}}】</span>
					</span>
						<span v-if="queryItem.chargeByName2 != null && queryItem.chargeByName2 != '' "
									style="padding-left: 20px;">
						{{$t('RackConfiguration.formTitleText')+'2'}}：{{queryItem.chargeByName2}}
						<span v-if="queryItem.mobile2 != null && queryItem.mobile2">【{{queryItem.mobile2}}】</span>
					</span>
					</div>
					<div>
						<div class="borderBottom padding20 marBottom16" style="padding-top: 0">
							<!--机架编号-->
							<el-form inline>
								<el-form-item :label="$t('RackConfiguration.columnChassisNumber')+'：'"
															style="margin-top: 10px;">
									<el-input v-model="queryItem.code"
														class="width200"
														clearable></el-input>
								</el-form-item>
								<el-form-item style="margin-top: 10px;">
									<el-button @click="getItemCode" type="primary" class="queryBtn">
										{{$t('RackConfiguration.query')}}
									</el-button>
								</el-form-item>
								<!--重置按钮-->
								<el-form-item style="margin-top: 10px;">
									<el-button class="queryBtn" type="reset" @click="formReset">
										{{$t('public.reset')}}
									</el-button>
								</el-form-item>
							</el-form>
						</div>
						<div class="RackConfiguration_btn">
							<!--新增-->
							<el-button type="warning" @click="AddRackConfiguration">
								<span class="iconfont fs14">&#xe689;</span>
								{{$t('public.add')}}
							</el-button>
							<!--编辑-->
							<el-button :disabled="isAdd" @click="EditRackConfiguration">
								<span class="iconfont fs14">&#xe641;</span>
								{{$t('public.edit')}}
							</el-button>
							<!--删除-->
							<el-button :disabled="isDelete" @click="getDeleteTheCabinet">
								<span class="iconfont fs14">&#xe647; </span>
								{{$t('public.delete')}}
							</el-button>
							<!--批量导入-->
							<el-button @click="toImportData">
								<span class="iconfont fs14">&#xe6af;</span>
								{{$t('RackConfiguration.BtnBulkImport')}}
							</el-button>
							<!--导出模板-->
							<el-button @click="download">
								<span class="iconfont fs14">&#xe6a8;</span>
								{{$t('RackConfiguration.BtnImportTheTemplate')}}
							</el-button>
						</div>
						<div class="padding20">
							<!--表格-->
							<el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
								<el-table-column type="selection" header-align="center" align="center" width="55"/>
								<!--序号-->
								<el-table-column width="60px" :label="$t('public.index')" header-align="center" align="center">
									<template slot-scope="scope">
										<span>{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}</span>
									</template>
								</el-table-column>
								<!--机架名称-->
								<el-table-column :label="$t('RackConfiguration.columnNameOfTheChassis')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" :content="scope.row.name" placement="top-start">
											<span v-if="scope.row.name !== null">{{scope.row.name}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--机架编号-->
								<el-table-column :label="$t('RackConfiguration.columnChassisNumber')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" :content="scope.row.code" placement="top-start">
											<span v-if="scope.row.code!==null">{{scope.row.code}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--设备总数-->
								<el-table-column :label="$t('RackConfiguration.columnTotalNumberOfDevices')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" :content="scope.row.assetDeviceCount" placement="top-start">
											<span v-if="scope.row.assetDeviceCount!==null">{{scope.row.assetDeviceCount}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--厂商型号-->
								<el-table-column :label="$t('RackConfiguration.columnManufacturersModel')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" placement="top-start">
											<div slot="content">
												<span v-if="scope.row.manufacturer !== null && scope.row.model !== null">{{scope.row.manufacturer}},{{scope.row.model}}</span>
												<span v-if="scope.row.manufacturer !== null && scope.row.model === null">{{scope.row.manufacturer}}</span>
												<span
													v-if="scope.row.manufacturer === null && scope.row.model !== null">{{scope.row.model}}</span>
												<span v-if="scope.row.manufacturer === null && scope.row.model === null">N/A</span>
											</div>
											<span v-if="scope.row.manufacturer !== null && scope.row.model !== null">{{scope.row.manufacturer}},{{scope.row.model}}</span>
											<span v-if="scope.row.manufacturer !== null && scope.row.model === null">{{scope.row.manufacturer}}</span>
											<span
												v-if="scope.row.manufacturer === null && scope.row.model !== null">{{scope.row.model}}</span>
											<span v-if="scope.row.manufacturer === null && scope.row.model === null">N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--剩余U数/总U数-->
								<el-table-column
									:label="$t('RackConfiguration.columnRemainingCount')+'/'+$t('RackConfiguration.columnTotality')"
									min-width="110px"
									header-align="left"
									align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" placement="top-start">
											<div slot="content">
												<span v-if="scope.row.residueUcount !== null && scope.row.ucount !== null">{{scope.row.residueUcount}}/{{scope.row.ucount}}</span>
												<span v-if="scope.row.residueUcount !== null && scope.row.ucount === null">{{scope.row.residueUcount}}</span>
												<span
													v-if="scope.row.residueUcount === null && scope.row.ucount !== null">{{scope.row.ucount}}</span>
												<span v-if="scope.row.residueUcount === null && scope.row.ucount === null">N/A</span>
											</div>
											<span v-if="scope.row.residueUcount !== null && scope.row.ucount !== null">{{scope.row.residueUcount}}/{{scope.row.ucount}}</span>
											<span v-if="scope.row.residueUcount !== null && scope.row.ucount === null">{{scope.row.residueUcount}}</span>
											<span
												v-if="scope.row.residueUcount === null && scope.row.ucount !== null">{{scope.row.ucount}}</span>
											<span v-if="scope.row.residueUcount === null && scope.row.ucount === null">N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--所在行-->
								<el-table-column :label="$t('RackConfiguration.columnWhereTheLine')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" :content="scope.row.rackRow" placement="top-start">
											<span v-if="scope.row.rackRow!==null">{{scope.row.rackRow}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--所在列-->
								<el-table-column :label="$t('RackConfiguration.columnInTheColumn')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" :content="scope.row.rackColumn" placement="top-start">
											<span v-if="scope.row.rackColumn!==null">{{scope.row.rackColumn}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--用途-->
								<el-table-column :label="$t('RackConfiguration.columnUse')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" placement="top-start">
											<div slot="content">
												<span v-if="scope.row.rackUsage!==null">{{scope.row.rackUsage}}</span>
												<span v-else>N/A</span>
											</div>
											<span v-if="scope.row.rackUsage!==null">{{scope.row.rackUsage}}</span>
											<span v-else>N/A</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<!--操作-->
								<el-table-column :label="$t('public.operation')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-button type="text" @click.stop="jumpToRackPage(scope.row.id)">
											{{$t('public.detail')}}
										</el-button>
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
				</div>
			</div>
		</div>
		<!--新增编辑弹出层-->
		<el-dialog class="AddRackConfiguration_dialog"
							 :close-on-click-modal="false"
							 :close-on-press-escape="false"
							 append-to-body
							 :before-close="AddRackConfigurationDialogQx"
							 :title="$t('RackConfiguration.dialogAddEditRack')"
							 :visible.sync="AddRackConfigurationDialogBg">
			<el-form :model="formItem" inline label-width="120px"
							 ref="rackCon" :rules="rules">
				<!--机架名称-->
				<el-form-item class="star"
											:label="$t('RackConfiguration.dialogNameOfTheChassis')+'：'"
											prop="name">
					<el-input v-model="formItem.name"
										class="width200"
										id="rackName"
										clearable>
					</el-input>
					<span v-if="queryItem.nameVerify=='0'"
								class="isNotNull_rack">
						{{$t('RackConfiguration.dialogRepeatCabinetName')}}
					</span>
				</el-form-item>
				<!--机架编号-->
				<el-form-item :label="$t('RackConfiguration.dialogChassisNumber')+'：'">
					<el-input @focus="FocusStartIp(formItem.name)"
										v-model="formItem.code"
										class="width200"
										id="rackCode"
										clearable>
					</el-input>
					<span v-if="queryItem.noVerify=='0'"
								class="isNotNull_rack">{{$t('RackConfiguration.dialogSerialNumberOfTheCabinetIsRepeated')}}</span>
				</el-form-item>
				<!--所属在机房-->
				<el-form-item :label="$t('RackConfiguration.dialogBelongsToTheMachineRoom')+'：'">
					<el-popover trigger="click"
											placement="bottom-start"
											v-model="isShowTypePopoverRoom"
											ref="popover">
						<el-tree :data="leftData"
										 highlight-current
										 @node-click="clickTypeNodeRoom"
										 :props="defaultProps"/>
						<el-input v-model="formItem.roomName" class="width200" clearable
											suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
					</el-popover>
				</el-form-item>
				<!--厂商-->
				<el-form-item :label="$t('RackConfiguration.dialogVendor')+'：'">
					<el-input v-model="formItem.manufacturer"
										class="width200"
										clearable></el-input>
				</el-form-item>
				<!--型号-->
				<el-form-item :label="$t('RackConfiguration.dialogModel')+'：'">
					<el-input v-model="formItem.model"
										class="width200"
										clearable></el-input>
				</el-form-item>
				<!--U数-->
				<el-form-item class="star" :label="$t('RackConfiguration.dialogNumberOfU')+'：'"
											prop="ucount">
					<el-input v-model="formItem.ucount"
										oninput="value=value.replace(/[^\d]/g,'')"
										class="width200 group_append"
										clearable>
						<span slot="append" class="inputGroup">U</span>
					</el-input>
				</el-form-item>
				<!--所在行-->
				<el-form-item class="star"
											:label="$t('RackConfiguration.dialogWhereTheLine')+'：'"
											prop="rackRow">
					<el-select v-model="formItem.rackRow"
										 class="width200"
										 id="rackRow"
										 clearable>
						<el-option v-for="item in maxRowList" :key="item.value"
											 :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<span v-if="queryItem.rowColVerify=='0'" class="isNotNull_rack">
						{{$t('RackConfiguration.dialogRowRepeat')}}
					</span>
				</el-form-item>
				<!--所在列-->
				<el-form-item class="star" :label="$t('RackConfiguration.dialogInTheColumn')+'：'"
											prop="rackColumn">
					<el-select v-model="formItem.rackColumn"
										 class="width200"
										 id="rackCol"
										 clearable>
						<el-option v-for="item in maxColList" :key="item.value"
											 :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<span v-if="queryItem.rowColVerify=='0'" class="isNotNull_rack">
						{{$t('RackConfiguration.dialogColumnRepeat')}}
					</span>
				</el-form-item>
				<!--主要供电来源-->
				<el-form-item :label="$t('RackConfiguration.dialogMainSourceOfPowerSupply')+'：'">
					<el-input v-model="formItem.mpowerSource"
										class="width200"
										clearable>
					</el-input>
				</el-form-item>
				<!--备用供电来源-->
				<el-form-item :label="$t('RackConfiguration.dialogBackupPowerSupply')+'：'">
					<el-input v-model="formItem.spowerSource"
										class="width200"
										clearable>
					</el-input>
				</el-form-item>
				<!--电源功耗-->
				<el-form-item :label="$t('RackConfiguration.dialogPowerConsumption')+'：'">
					<el-input v-model="formItem.powerCapacity"
										oninput="value=value.replace(/[^\d]/g,'')"
										class="width200 group_append"
										clearable>
						<span slot="append" class="inputGroup">W</span>
					</el-input>
				</el-form-item>
				<!--最大电压-->
				<el-form-item :label="$t('RackConfiguration.dialogMaximumVoltage')+'：'">
					<el-input v-model="formItem.voltageUc"
										oninput="value=value.replace(/[^\d]/g,'')"
										class="width200 group_append"
										clearable>
						<span slot="append" class="inputGroup">V</span>
					</el-input>
				</el-form-item>
				<!--最大电流-->
				<el-form-item :label="$t('RackConfiguration.dialogMaximumCurrent')+'：'">
					<el-input v-model="formItem.currentUc"
										oninput="value=value.replace(/[^\d]/g,'')"
										class="width200 group_append"
										clearable>
						<span slot="append" class="inputGroup">A</span>
					</el-input>
				</el-form-item>
				<!--用途-->
				<el-form-item :label="$t('RackConfiguration.dialogUse')+'：'">
					<el-input v-model="formItem.rackUsage"
										class="width200"
										clearable></el-input>
				</el-form-item>
				<!--负责人1-->
				<el-form-item class="star" :label="$t('RackConfiguration.dialogHead')+'1：'">
					<el-popover trigger="click"
											placement="bottom-start"
											v-model="isShowTypePopover"
											ref="popover">
						<el-tree :data="chargeByData"
										 highlight-current
										 @node-click="clickTypeNode"
										 :props="defaultProps"/>
						<el-input v-model="formItem.chargeBy" class="width200"
											id="dataCenter_chargeByFirst_rack"
											suffix-icon="el-icon-arrow-down"
											readonly
											slot="reference"
											clearable/>
					</el-popover>
					<span v-if="errorTip.chargeByFirstFlag==true"
								class="isNotNull_rack">{{$t('RackConfiguration.isNotNull')}}</span>
				</el-form-item>
				<!--负责人2-->
				<el-form-item :label="$t('RackConfiguration.dialogHead')+'2：'">
					<el-popover trigger="click"
											placement="bottom-start"
											v-model="isShowTypePopoverTwo"
											ref="popover">
						<el-tree :data="chargeByData"
										 highlight-current
										 @node-click="clickTypeNodeTwo"
										 :props="defaultProps"/>
						<el-input v-model="formItem.chargeBy2" class="width200"
											suffix-icon="el-icon-arrow-down"
											readonly
											slot="reference"
											clearable/>
					</el-popover>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
					<el-button class="alertBtn" v-if="isAdd==true" type="primary"
										 @click="getAddRackConfiguration('rackCon')">
						{{$t('EquipmentMonitoring.determine')}}
					</el-button>
					<el-button class="alertBtn" v-if="isAdd==false" type="primary"
										 @click="getEditRackConfiguration('rackCon')">
						{{$t('EquipmentMonitoring.determine')}}
					</el-button>
					<el-button class="alertBtn" @click="AddRackConfigurationDialogQx">
						{{$t('EquipmentMonitoring.cancel')}}
					</el-button>
				</span>
		</el-dialog>
		<!--导入excel-->
		<el-dialog
			class="RackConfigImport-dialog"
			append-to-body
			:title="$t('computerRoomManagement.dialog.import.dialogTitle')"
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
				:action="rootUrl + '/asset/assetRack/toImportExcel'">
				<el-button size="small" class="alertBtn" type="primary">{{$t('public.pickUpFile')}}</el-button>
			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					class="alertBtn"
					@click="submitUpload"
					:disabled="submitUploadButtonDisabled"
					size="small">{{$t('public.submitUpload')}}</el-button>
			</span>
		</el-dialog>
		<!-- 展示Excel内容 -->
		<el-dialog
			class="RackConfigExcelContent-dialog"
			:title="$t('computerRoomManagement.dialog.excelAnalyzeResult.dialogTitle')"
			append-to-body
			:before-close="closeExcelAnalyzeContentDialog"
			:visible.sync="excelAnalyzeResultDialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-table :data="excelAnalyzeResultDataList"
								class="excelAnalyzeResult"
								border max-height="455"
								v-loading="saveExcelContent_loading"
								:element-loading-text="saveExcelContent_loadingText"
								element-loading-spinner="el-icon-loading"
								element-loading-background="rgba(0, 0, 0, 0.8)">
				<!-- 序号 -->
				<el-table-column width="50px" align="center" fixed="left"
												 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnOrder')">
					<template slot-scope="scope">
						<span>
							{{scope.$index+1}}
						</span>
					</template>
				</el-table-column>
				<!-- 校验 -->
				<el-table-column width="50px" align="center" fixed="left"
												 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnVerify')">
					<template slot-scope="scope">
						<span v-if="scope.row.isPass" class="iconfont iconfontSuccess">&#xe648;</span>
						<span v-if="!scope.row.isPass" style="display: inline-block;" class="iconfont iconfontError">&#xe64e;</span>
					</template>
				</el-table-column>
				<!-- 机柜名称 -->
				<el-table-column width="100px" align="left" fixed="left"
												 :label="$t('RackConfiguration.dialogNameOfTheChassis')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.nameVerify">{{scope.row.name}}</span>
								<span v-else>{{scope.row.nameVerifyMsg}}</span>
							</div>
							<span :class="scope.row.nameVerify === false ? 'iconfontError':''">{{scope.row.name}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 机柜编号 -->
				<el-table-column width="100px" align="left"
												 :label="$t('RackConfiguration.dialogChassisNumber')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.codeVerify">{{scope.row.code}}</span>
								<span v-else>{{scope.row.codeVerifyMsg}}</span>
							</div>
							<span :class="scope.row.codeVerify === false ? 'iconfontError':''">{{scope.row.code}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 所属在机房 -->
				<el-table-column width="100px" align="left"
												 :label="$t('RackConfiguration.dialogBelongsToTheMachineRoom')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.roomIdVerify">{{scope.row.roomId}}</span>
								<span v-else>{{scope.row.roomIdVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.roomIdVerify === false ? 'iconfontError':''">{{scope.row.roomId}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 厂商 -->
				<el-table-column width="100px" align="left"
												 :label="$t('RackConfiguration.dialogVendor')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.manufacturerVerify">{{scope.row.manufacturer}}</span>
								<span v-else>{{scope.row.manufacturerVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.manufacturerVerify === false ? 'iconfontError':''">{{scope.row.manufacturer}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 型号 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogModel')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.modelVerify">{{scope.row.model}}</span>
								<span v-else>{{scope.row.modelVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.modelVerify === false ? 'iconfontError':''">{{scope.row.model}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!--U数-->
				<el-table-column width="50px" align="left"
												 :label="$t('RackConfiguration.dialogNumberOfU')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.ucountVerify">{{scope.row.ucount}}</span>
								<span v-else>{{scope.row.ucountVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.ucountVerify === false ? 'iconfontError':''">{{scope.row.ucount}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!--所在行-->
				<el-table-column width="60px" align="left"
												 :label="$t('RackConfiguration.dialogWhereTheLine')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.rackRowVerify">{{scope.row.rackRow}}</span>
								<span v-else>{{scope.row.rackRowVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.rackRowVerify === false ? 'iconfontError':''">{{scope.row.rackRow}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!--所在列-->
				<el-table-column width="60px" align="left"
												 :label="$t('RackConfiguration.dialogInTheColumn')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.rackColumnVerify">{{scope.row.rackColumn}}</span>
								<span v-else>{{scope.row.rackColumnVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.rackColumnVerify === false ? 'iconfontError':''">{{scope.row.rackColumn}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!--主要供电来源-->
				<el-table-column width="100px" align="left"
												 :label="$t('RackConfiguration.dialogMainSourceOfPowerSupply')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.mpowerSourceVerify">{{scope.row.mpowerSource}}</span>
								<span v-else>{{scope.row.mpowerSourceVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.mpowerSourceVerify === false ? 'iconfontError':''">{{scope.row.mpowerSource}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!--备用供电来源-->
				<el-table-column width="100px" align="left"
												 :label="$t('RackConfiguration.dialogBackupPowerSupply')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.spowerSourceVerify">{{scope.row.spowerSource}}</span>
								<span v-else>{{scope.row.spowerSourceVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.spowerSourceVerify === false ? 'iconfontError':''">{{scope.row.spowerSource}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 电源功耗 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogPowerConsumption')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.powerCapacityVerify">{{scope.row.powerCapacity}}</span>
								<span v-else>{{scope.row.powerCapacityVerifyMsg}}</span>
							</div>
							<span
								:class="scope.row.powerCapacityVerify === false ? 'iconfontError':''">{{scope.row.powerCapacity}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 最大电压 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogMaximumVoltage')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.voltageUcVerify">{{scope.row.voltageUc}}</span>
								<span v-else>{{scope.row.voltageUcVerifyMsg}}</span>
							</div>
							<span :class="scope.row.voltageUcVerify === false ? 'iconfontError':''">{{scope.row.voltageUc}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 最大电流 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogMaximumCurrent')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.currentUcVerify">{{scope.row.currentUc}}</span>
								<span v-else>{{scope.row.currentUcVerifyMsg}}</span>
							</div>
							<span :class="scope.row.currentUcVerify === false ? 'iconfontError':''">{{scope.row.currentUc}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 用途 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogUse')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.rackUsageVerify">{{scope.row.rackUsage}}</span>
								<span v-else>{{scope.row.rackUsageVerifyMsg}}</span>
							</div>
							<span :class="scope.row.rackUsageVerify === false ? 'iconfontError':''">{{scope.row.rackUsage}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 负责人1 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogHead')+'1'">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.chargeByVerify">{{scope.row.chargeBy}}</span>
								<span v-else>{{scope.row.chargeByVerifyMsg}}</span>
							</div>
							<span :class="scope.row.chargeByVerify === false ? 'iconfontError':''">{{scope.row.chargeBy}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 负责人2 -->
				<el-table-column width="80px" align="left"
												 :label="$t('RackConfiguration.dialogHead')+'2'">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.chargeBy2Verify">{{scope.row.chargeBy2}}</span>
								<span v-else>{{scope.row.chargeBy2VerifyMsg}}</span>
							</div>
							<span :class="scope.row.chargeBy2Verify === false ? 'iconfontError':''">{{scope.row.chargeBy2}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer">
				<div style="float:left; margin-right: 280px; height: 29px; line-height: 29px;">
					<span style="color: green;">{{validateCorrectNumber}}</span>
					<span style="color: red; padding-left: 30px;">{{validateErrorNumber}}</span>
				</div>
				<el-button type="danger" plain v-if="excelAnalyzeResultFilePathForError != null"
									 @click="downloadErrorData">
					{{$t('computerRoomManagement.dialog.excelAnalyzeResult.downloadErrorBtn')}}
				</el-button>
				<el-button type="primary" @click="toSaveExcelData" :disabled="saveExcelContentBtn_disable">
					<template>
						<el-tooltip :content="$t('computerRoomManagement.dialog.excelAnalyzeResult.confirmBtnTip')"
												placement="top"
												type="dark">
							<span>{{$t('computerRoomManagement.dialog.excelAnalyzeResult.confirmBtn')}}</span>
						</el-tooltip>
					</template>
				</el-button>
				<el-button class="alertBtn" @click="closeExcelAnalyzeContentDialog">{{$t('public.cancel')}}
				</el-button>
			</div>
		</el-dialog>
	</Box>
</template>
<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull, isIntNumber, isDoubleNumber} from "../../../../assets/js/validator";

	export default {
		name: "RackConfiguration",
		components: {
			Box,
		},
		data() {
			return {
				isPageShow: true,
				//校验通过与错误的数量
				validateCorrectNumber: "格式校验正确数：0",
				validateErrorNumber: "错误数：0",
				//解析接口返回的文件校验的key
				excelAnalyzeResultValidateKey: null,
				saveExcelContent_loading: false,
				saveExcelContent_loadingText: this.$t('public.loading'),
				saveExcelContentBtn_disable: true,
				//导入excel弹窗是否显示
				assetDeviceImportDialogVisible: false,
				submitUploadButtonDisabled: false,
				fileList: [],
				//Excel的解析结果弹窗是否显示
				excelAnalyzeResultDialogVisible: false,
				//excel解析后的数据列表
				excelAnalyzeResultDataList: [],
				//置空解析接口返回的错误数据的文件路径
				excelAnalyzeResultFilePathForError: null,
				rootUrl: this.$api.root(),
				uploadHeaders: {
					'token': localStorage.getItem('hy-token') || ''
				},
				rules: {
					name: [
						{validator: isNotNull, trigger: ['blur']}
					],
					ucount: [
						{validator: isNotNull, trigger: ['blur']}
					],
					rackRow: [
						{validator: isNotNull, trigger: ['blur']}
					],
					rackColumn: [
						{validator: isNotNull, trigger: ['blur']}
					],
					chargeBy: [
						{validator: isNotNull, trigger: ['blur']}
					]
				},
				// 判断新增编辑
				isAdd: true,
				//删除按钮
				isDelete: true,
				//添加编辑弹出层
				AddRackConfigurationDialogBg: false,
				isShow: true,
				//右侧内容区默认的left值
				leftOfRightView: 172,
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				activeNames: [0],
				leftData: [],
				queryItem: {
					/*机房ID*/
					roomId: '',
					code: '',
					//设备责任人
					chargeByName1: '',
					chargeByName2: '',
					//设备责任人ID
					chargeBy: '',
					chargeBy2: '',
					//手机号
					mobile1: '',
					mobile2: '',
					//地址
					floor: '',
					//机房名称
					name: '',
					//最大行数
					maxRow: '',
					//最大列数
					maxCol: '',
					//机柜名称重复
					nameVerify: '',
					//机柜编号重复
					noVerify: '',
					//所在行列重复
					rowColVerify: ''
				},
				//行数下拉框集合
				maxRowList: [],
				//列数下拉框集合
				maxColList: [],
				//弹出层表单
				formItem: {
					// 机架名称
					name: '',
					// 机架编号
					code: '',
					// 所属在机房ID
					roomId: '',
					roomName: '',
					// 厂商
					manufacturer: '',
					// 型号
					model: '',
					// U数
					ucount: '',
					// 所在行
					rackRow: '',
					// 所在列
					rackColumn: '',
					// 主要供电来源
					mpowerSource: '',
					// 备用供电来源
					spowerSource: '',
					// 电源功耗
					powerCapacity: '',
					// 最大电压
					voltageUc: '',
					// 最大电流
					currentUc: '',
					// 用途
					rackUsage: '',
					// 负责人1名称
					chargeBy: '',
					// 负责人1ID
					chargeById: '',
					// 负责人2名称
					chargeBy2: '',
					// 负责人2ID
					chargeBy2Id: '',
					//机柜Id
					rackId: '',
				},
				rackString: '',
				//表格数据
				tableData: [],
				//负责人树
				chargeByData: [],
				//负责人1树形下拉框显示隐藏
				isShowTypePopover: false,
				//负责人2树形下拉框显示隐藏
				isShowTypePopoverTwo: false,
				//所属在机房树形下拉框显示隐藏
				isShowTypePopoverRoom: false,
				//负责人tree
				defaultProps: {
					children: 'children',
					label: 'nodeName',
					nodeId: 'nodeId',
				},
				errorTip: {
					chargeByFirstFlag: false, // 数据中心责任人1
					chargeByRoomFirstFlag: false, // 机房责任人1
				},
			}
		},
		mounted() {
			var _t = this;
			//调整左侧树形区宽度
			_t.reSizeWin();
			_t.getLeftData();
			_t.getData();
		},
		methods: {
			//点击左侧区域取值
			cliiapswClick(val, index) {
				var _t = this;
				if (val.length !== 0) {
					_t.isPageShow = false;
				}
				var id = val.nodeId;
				_t.options.currentPage = 1;
				_t.options.pageSize = 10;
				_t.$api.get('asset/serverRoom/' + id, {}, function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data;
							/*机房地址*/
							_t.queryItem.floor = resData.floor;
							/*责任人1*/
							_t.queryItem.chargeByName1 = resData.chargeByName1;
							/*责任人1Id*/
							_t.queryItem.chargeBy = resData.chargeBy;
							/*责任人1手机号*/
							_t.queryItem.mobile1 = resData.mobile1;
							/*责任人2*/
							_t.queryItem.chargeByName2 = resData.chargeByName2;
							/*责任人2ID*/
							_t.queryItem.chargeBy = resData.chargeBy2;
							/*责任人2手机号*/
							_t.queryItem.mobile2 = resData.mobile2;
							/*机房名称*/
							_t.queryItem.name = resData.name;
							/*机房Id*/
							_t.queryItem.roomId = resData.id;

							_t.formItem.roomId = resData.id;
							_t.formItem.roomName = resData.name;
							/*最大行数*/
							_t.queryItem.maxRow = resData.maxRow;
							/*最大列数*/
							_t.queryItem.maxCol = resData.maxCol;
							_t.$nextTick(function () {
								var listClassName = document.getElementsByClassName('RackConfiguration_left_collapse');
								if (listClassName.length !== 0) {
									for (var i = 0; i < listClassName.length; i++) {
										// 清除全部的is-active 类名
										if (listClassName[i].classList[0] === 'is-active' || listClassName[i].classList[1] === 'is-active') {
											listClassName[i].classList.remove('is-active');
										}
									}
								}
								// 给点击的元素添加is-active类名
								document.getElementById("RackConfiguration" + val.nodeId).classList.add('is-active');
								//document.getElementsByClassName('RackConfiguration_left_collapse')[index].classList.add('is-active');
								// 获取数据中心底下的机房列表
								_t.getData();
							});
							break;
						default:
							break;
					}
				})
			},
			//表格复选框
			handleSelectionChange(val) {
				var _t = this;
				// 判断编辑按钮是否禁用
				if (val.length == 1) {
					_t.isAdd = false;
				} else {
					_t.isAdd = true;
				}
				// 判断删除按钮是否禁用
				if (val.length !== 0) {
					_t.isDelete = false;
				} else {
					_t.isDelete = true;
				}
				var rackIdList = [];
				for (var i = 0; i < val.length; i++) {
					var rackId = val[i].id;
					rackIdList.push(val[i].id);
				}
				var rackString = rackIdList.join(',');
				_t.rackString = rackString
				_t.formItem.rackId = rackId;
			},
			// 改变左侧手风琴
			handleChange(val) {},
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
			// 收缩
			clickInset() {
				this.isShow = false;
				document.getElementById('RackConfiguration-navBar-outSet').style.display = 'inline-block';
				document.getElementById('RackConfiguration_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isShow = true;
				document.getElementById('RackConfiguration-navBar-outSet').style.display = 'none';
				document.getElementById('RackConfiguration_right').style.left = this.leftOfRightView + "px";
			},
			//左右拖拽调整左侧的树的大小
			reSizeWin() {
				var _t = this;
				var inSet = document.getElementById("RackConfiguration-navBar-inSet");
				var left = document.getElementById("RackConfiguration_left");
				var resize = document.getElementById("resize-navBar");
				var right = document.getElementById("RackConfiguration_right");
				//var box = document.getElementById("box-all");

				/*//设置左侧导航折叠面板打开后面板内容的最大高度
				var collapseItems = document.querySelectorAll(".systemSettings-navBar");
				collapseItems.forEach((item) => {
					// 目前有两个折叠项，每个高度 49，内容区底部有个margin-bottom 25
					item.style.maxHeight = (left.clientHeight -28) + "px";
				});*/
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
			//获取机房目录
			getLeftData() {
				var _t = this;
				_t.$api.get('asset/serverRoom/getDataRoomTree', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var resData = JSON.parse(res.data);
								_t.leftData = resData.children == null ? [] : resData.children;
								// 默认取出第一个数据中心
								if (_t.leftData.length !== 0) {
									if (_t.leftData[0].children.length !== 0) {
										_t.cliiapswClick(_t.leftData[0].children[0], 0);
										_t.isPageShow = false;
									} else {
										_t.isPageShow = true;
									}
								} else {
									_t.isPageShow = true;
								}
							} else {
								_t.isPageShow = true;
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
			//点击添加编辑弹出层取消按钮
			AddRackConfigurationDialogQx() {
				var _t = this;
				_t.AddRackConfigurationDialogBg = false;
				_t.errorTip.chargeByFirstFlag = false;
				document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#DCDFE6';
				document.getElementById('rackName').style.borderColor = '#DCDFE6';
				_t.queryItem.nameVerify = '';
				document.getElementById('rackCode').style.borderColor = '#DCDFE6';
				_t.queryItem.noVerify = '';
				document.getElementById('rackRow').style.borderColor = '#DCDFE6';
				_t.queryItem.rowColVerify = '';
				document.getElementById('rackCol').style.borderColor = '#DCDFE6';
				_t.$refs.rackCon.resetFields(); //移除校验结果并重置字段值
				_t.restRackConfiguration();
				_t.getData();
			},
			//点击添加按钮
			AddRackConfiguration() {
				var _t = this;
				_t.AddRackConfigurationDialogBg = true;
				var maxRowList = [];
				for (var i = 0; i < _t.queryItem.maxRow; i++) {
					var obj = new Object();
					obj.label = i + 1;
					obj.value = i + 1;
					maxRowList.push(obj);
				}
				_t.maxRowList = maxRowList;
				var maxColList = [];
				for (var i = 0; i < _t.queryItem.maxCol; i++) {
					var obj = new Object();
					obj.label = i + 1;
					obj.value = i + 1;
					maxColList.push(obj);
				}
				_t.maxColList = maxColList;
				_t.getchargeBy();
			},
			//负责人接口
			getchargeBy() {
				var _t = this;
				_t.$api.get('system/organization/getOrgRoleUserTree', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var resData = JSON.parse(res.data);
								_t.chargeByData = resData.children === null ? [] : resData.children;
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
			// 点击负责人1下拉框节点
			clickTypeNode(val) {
				var _t = this;
				if (val.level === 3) {
					_t.formItem.chargeById = val.nodeId;
					_t.formItem.chargeBy = val.nodeName;
					_t.isShowTypePopover = false;
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#DCDFE6';
				}
			},
			// 点击负责人2下拉框节点
			clickTypeNodeTwo(val) {
				var _t = this;
				if (val.level === 3) {
					_t.formItem.chargeBy2Id = val.nodeId;
					_t.formItem.chargeBy2 = val.nodeName;
					_t.isShowTypePopoverTwo = false;
				}
			},
			// 点击所属机房下拉框节点
			clickTypeNodeRoom(val) {
				var _t = this;
				if (val.level === 2) {
					_t.formItem.roomId = val.nodeId;
					_t.formItem.roomName = val.nodeName;
					_t.isShowTypePopoverRoom = false;
				}
			},
			//点击添加弹出层确定按钮
			getAddRackConfiguration(rackCon) {
				var _t = this;
				// 校验责任人1是否为空
				if (_t.formItem.chargeById === null || _t.formItem.chargeById === '') {
					_t.errorTip.chargeByFirstFlag = true;
					document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#DCDFE6';
				}
				_t.$refs[rackCon].validate((valid) => {
					if (valid && _t.errorTip.chargeByFirstFlag === false) {
						_t.$api.post('asset/assetRack/', {
							assetRack: {
								/*机架名称*/
								name: _t.formItem.name === null ? null : (_t.formItem.name.trim() === '' ? null : _t.formItem.name.trim()),
								/*机架编号*/
								code: _t.formItem.code === null ? null : (_t.formItem.code.trim() === '' ? null : _t.formItem.code.trim()),
								/*所属在机房ID*/
								roomId: _t.formItem.roomId === null ? null : (_t.formItem.roomId.trim() === '' ? null : _t.formItem.roomId.trim()),
								/*厂商*/
								manufacturer: _t.formItem.manufacturer === null ? null : (_t.formItem.manufacturer.trim() === '' ? null : _t.formItem.manufacturer.trim()),
								/*型号*/
								model: _t.formItem.model === null ? null : (_t.formItem.model.trim() === '' ? null : _t.formItem.model.trim()),
								/*U数*/
								ucount: _t.formItem.ucount === null ? null : _t.formItem.ucount,
								/*所在行*/
								rackRow: _t.formItem.rackRow === null ? null : _t.formItem.rackRow,
								/*所在列*/
								rackColumn: _t.formItem.rackColumn === null ? null : _t.formItem.rackColumn,
								/*主要供电来源*/
								mpowerSource: _t.formItem.mpowerSource === null ? null : (_t.formItem.mpowerSource.trim() === '' ? null : _t.formItem.mpowerSource.trim()),
								/*备用供电来源*/
								spowerSource: _t.formItem.spowerSource === null ? null : (_t.formItem.spowerSource.trim() === '' ? null : _t.formItem.spowerSource.trim()),
								/*电源功耗*/
								powerCapacity: _t.formItem.powerCapacity === null ? null : _t.formItem.powerCapacity,
								/*最大电压*/
								voltageUc: _t.formItem.voltageUc === null ? null : _t.formItem.voltageUc,
								/*最大电流*/
								currentUc: _t.formItem.currentUc === null ? null : _t.formItem.currentUc,
								/*用途*/
								rackUsage: _t.formItem.rackUsage === null ? null : (_t.formItem.rackUsage.trim() === '' ? null : _t.formItem.rackUsage.trim()),
								/*负责人1Id*/
								chargeBy: _t.formItem.chargeById === null ? null : (_t.formItem.chargeById.trim() === '' ? null : _t.formItem.chargeById.trim()),
								/*负责人2Id*/
								chargeBy2: _t.formItem.chargeBy2Id === null ? null : (_t.formItem.chargeBy2Id.trim() === '' ? null : _t.formItem.chargeBy2Id.trim()),
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.AddRackConfigurationDialogBg = false;
									_t.restRackConfiguration();
									_t.getData();
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 2400://所在行列是否重复
									var isMsg = JSON.parse(res.message);
									var nameVerify = isMsg.nameVerify;
									_t.queryItem.nameVerify = nameVerify;
									var noVerify = isMsg.noVerify;
									_t.queryItem.noVerify = noVerify;
									var rowColVerify = isMsg.rowColVerify;
									_t.queryItem.rowColVerify = rowColVerify;
									if (nameVerify == '0') {
										document.getElementById('rackName').style.borderColor = '#fb6041';
									}
									if (noVerify == '0') {
										document.getElementById('rackCode').style.borderColor = '#fb6041';
									}
									if (rowColVerify == '0') {
										document.getElementById('rackRow').style.borderColor = '#fb6041';
										document.getElementById('rackCol').style.borderColor = '#fb6041';
									}
									break;
								default:
									break;
							}
						})
					}
				});
			},
			//点击编辑按钮 回显数据接口
			EditRackConfiguration() {
				var _t = this;
				var maxRowList = [];
				for (var i = 0; i < _t.queryItem.maxRow; i++) {
					var obj = new Object();
					obj.label = i + 1;
					obj.value = i + 1;
					maxRowList.push(obj);
				}
				_t.maxRowList = maxRowList;
				var maxColList = [];
				for (var i = 0; i < _t.queryItem.maxCol; i++) {
					var obj = new Object();
					obj.label = i + 1;
					obj.value = i + 1;
					maxColList.push(obj);
				}
				_t.maxColList = maxColList;
				var id = _t.formItem.rackId;
				_t.$api.get('asset/assetRack/' + id, {}, function (res) {
					switch (res.status) {
						case 200:
							// 机架名称
							_t.formItem.name = res.data.name;
							// 机架编号
							_t.formItem.code = res.data.code;
							// 所属在机房ID
							_t.formItem.roomId = res.data.roomId;
							_t.formItem.roomName = res.data.roomName;
							// 厂商
							_t.formItem.manufacturer = res.data.manufacturer;
							// 型号
							_t.formItem.model = res.data.model;
							// U数
							_t.formItem.ucount = res.data.ucount;
							// 所在行
							_t.formItem.rackRow = res.data.rackRow;
							// 所在列
							_t.formItem.rackColumn = res.data.rackColumn;
							// 主要供电来源
							_t.formItem.mpowerSource = res.data.mpowerSource;
							// 备用供电来源
							_t.formItem.spowerSource = res.data.spowerSource;
							// 电源功耗
							_t.formItem.powerCapacity = res.data.powerCapacity;
							// 最大电压
							_t.formItem.voltageUc = res.data.voltageUc;
							// 最大电流
							_t.formItem.currentUc = res.data.currentUc;
							// 用途
							_t.formItem.rackUsage = res.data.rackUsage;
							// 负责人1
							_t.formItem.chargeBy = res.data.chargeByName1;
							_t.formItem.chargeById = res.data.chargeBy;
							// 负责人2
							_t.formItem.chargeBy2 = res.data.chargeByName2;
							_t.formItem.chargeBy2Id = res.data.chargeBy2;
							_t.getchargeBy();
							_t.AddRackConfigurationDialogBg = true;
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
			//点击编辑弹出层确定按钮
			getEditRackConfiguration(rackCon) {
				var _t = this;
				// 校验责任人1是否为空
				if (_t.formItem.chargeById === null || _t.formItem.chargeById === '') {
					_t.errorTip.chargeByFirstFlag = true;
					document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst_rack').style.borderColor = '#DCDFE6';
				}
				_t.$refs[rackCon].validate((valid) => {
					if (valid && _t.errorTip.chargeByFirstFlag === false) {
						_t.$api.put('asset/assetRack/', {
							assetRack: {
								id: _t.formItem.rackId === null ? null : (_t.formItem.rackId.trim() === '' ? null : _t.formItem.rackId.trim()),
								/*机架名称*/
								name: _t.formItem.name === null ? null : (_t.formItem.name.trim() === '' ? null : _t.formItem.name.trim()),
								/*机架编号*/
								code: _t.formItem.code === null ? null : (_t.formItem.code.trim() === '' ? null : _t.formItem.code.trim()),
								/*所属在机房ID*/
								roomId: _t.formItem.roomId === null ? null : (_t.formItem.roomId.trim() === '' ? null : _t.formItem.roomId.trim()),
								/*厂商*/
								manufacturer: _t.formItem.manufacturer === null ? null : (_t.formItem.manufacturer.trim() === '' ? null : _t.formItem.manufacturer.trim()),
								/*型号*/
								model: _t.formItem.model === null ? null : (_t.formItem.model.trim() === '' ? null : _t.formItem.model.trim()),
								/*U数*/
								ucount: _t.formItem.ucount === null ? null : _t.formItem.ucount,
								/*所在行*/
								rackRow: _t.formItem.rackRow === null ? null : _t.formItem.rackRow,
								/*所在列*/
								rackColumn: _t.formItem.rackColumn === null ? null : _t.formItem.rackColumn,
								/*主要供电来源*/
								mpowerSource: _t.formItem.mpowerSource === null ? null : (_t.formItem.mpowerSource.trim() === '' ? null : _t.formItem.mpowerSource.trim()),
								/*备用供电来源*/
								spowerSource: _t.formItem.spowerSource === null ? null : (_t.formItem.spowerSource.trim() === '' ? null : _t.formItem.spowerSource.trim()),
								/*电源功耗*/
								powerCapacity: _t.formItem.powerCapacity === null ? null : _t.formItem.powerCapacity,
								/*最大电压*/
								voltageUc: _t.formItem.voltageUc === null ? null : _t.formItem.voltageUc,
								/*最大电流*/
								currentUc: _t.formItem.currentUc === null ? null : _t.formItem.currentUc,
								/*用途*/
								rackUsage: _t.formItem.rackUsage === null ? null : (_t.formItem.rackUsage.trim() === '' ? null : _t.formItem.rackUsage.trim()),
								/*负责人1Id*/
								chargeBy: _t.formItem.chargeById === null ? null : (_t.formItem.chargeById.trim() === '' ? null : _t.formItem.chargeById.trim()),
								/*负责人2Id*/
								chargeBy2: _t.formItem.chargeBy2Id === null ? null : (_t.formItem.chargeBy2Id.trim() === '' ? null : _t.formItem.chargeBy2Id.trim()),
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.AddRackConfigurationDialogBg = false;
									_t.restRackConfiguration();
									_t.getData();
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 2400: //数据重复
									var isMsg = JSON.parse(res.message);
									var nameVerify = isMsg.nameVerify;
									_t.queryItem.nameVerify = nameVerify;
									var noVerify = isMsg.noVerify;
									_t.queryItem.noVerify = noVerify;
									var rowColVerify = isMsg.rowColVerify;
									_t.queryItem.rowColVerify = rowColVerify;
									if (nameVerify == '0') {
										document.getElementById('rackName').style.borderColor = '#fb6041';
									}
									if (noVerify == '0') {
										document.getElementById('rackCode').style.borderColor = '#fb6041';
									}
									if (rowColVerify == '0') {
										document.getElementById('rackRow').style.borderColor = '#fb6041';
										document.getElementById('rackCol').style.borderColor = '#fb6041';
									}
									break;
								default:
									break;
							}
						})
					}
				});

			},
			//删除—机柜接口 批量删除机柜
			getDeleteTheCabinet() {
				var _t = this;
				var id = _t.rackString === null ? null : (_t.rackString.trim() === '' ? null : _t.rackString.trim());
				_t.$confirm(_t.$t('RackConfiguration.dialogDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.cancel'),
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn',
					type: 'warning'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('asset/assetRack/' + id, {}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('RackConfiguration.dialogDeleteTheSuccess'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
								}).catch(() => {
									_t.getData();
								});
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 2007:// 机柜关联着设备，不允许删除
								_t.$alert(_t.$t('RackConfiguration.TheCabinetIsAssociatedWithTheDeviceDeletionIsNotAllowed'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								});
								break;
							default:
								break;
						}
					})
				}).catch(() => {
					return;
				});
			},
			//重置添加编辑弹出层中的内容
			restRackConfiguration() {
				var _t = this;
				_t.isAdd = true;
				//弹出层表单
				_t.formItem = {
					// 机架名称
					name: '',
					// 机架编号
					code: '',
					// 所属在机房ID
					roomId: '',
					// 厂商
					manufacturer: '',
					// 型号
					model: '',
					// U数
					ucount: '',
					// 所在行
					rackRow: '',
					// 所在列
					rackColumn: '',
					// 主要供电来源
					mpowerSource: '',
					// 备用供电来源
					spowerSource: '',
					// 电源功耗
					powerCapacity: '',
					// 最大电压
					voltageUc: '',
					// 最大电流
					currentUc: '',
					// 用途
					rackUsage: '',
					// 负责人1
					chargeBy: '',
					// 负责人1Id
					chargeById: '',
					// 负责人2
					chargeBy2: '',
					// 负责人2Id
					chargeBy2Id: '',
				};
			},
			//机柜查询--分页
			getData() {
				var _t = this;
				_t.$api.get('asset/assetRack/pagelist', {
					jsonString: JSON.stringify({
						assetRack: {
							roomId: _t.queryItem.roomId === null ? null : (_t.queryItem.roomId.trim() === '' ? null : _t.queryItem.roomId.trim()),
							code: _t.queryItem.code === null ? null : (_t.queryItem.code.trim() === '' ? null : _t.queryItem.code.trim())
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var resData = res.data.list === null ? [] : res.data.list;
								resData.forEach((item) => {
									/*电源功耗*/
									item.powerCapacity = item.powerCapacity === null ? '' : item.powerCapacity.toString();
									/*设备总数*/
									item.assetDeviceCount = item.assetDeviceCount === null ? '' : item.assetDeviceCount.toString();
									/*U数*/
									item.ucount = item.ucount === null ? '' : item.ucount.toString();
									/*所在行*/
									item.rackRow = item.rackRow === null ? '' : item.rackRow.toString();
									/*所在列*/
									item.rackColumn = item.rackColumn === null ? '' : item.rackColumn.toString();
									/*用途*/
									item.chargeBy = item.chargeBy === null ? '' : item.chargeBy.toString();
									/*剩余U数*/
									item.residueUcount = item.residueUcount === null ? '' : item.residueUcount.toString();
								});
								_t.tableData = resData;
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
							break;
					}
				})
			},
			//根据机架编号筛选
			getItemCode() {
				var _t = this;
				_t.getData();
			},
			//重置表单
			formReset() {
				var _t = this;
				_t.queryItem.code = null;
				_t.getData();
			},
			//机柜名称=》机柜编号
			FocusStartIp(val) {
				var _t = this;
				_t.formItem.code = val;
			},
			/*-----------------------导入excel-------------------------------------*/
			// 打开导入excel窗口
			toImportData() {
				var _t = this;
				_t.assetDeviceImportDialogVisible = true;
				_t.fileList = [];
			},
			//上传的文件个数超出设定时触发的函数
			onExceedHandle() {
				var _t = this;
				_t.$message({
					message: '抱歉，一次最多只能上传一个Excel文件！',
					type: 'warning',
					duration: 6000
				});
			},
			//删除文件列表中的文件时触发
			onRemoveHandle() {
				var _t = this;
				//删除当前选中的文件
				//_t.$refs.upload.handleRemove(file);
				//将上传按钮先置为启用
				_t.submitUploadButtonDisabled = false;
			},
			//上传前校验
			beforeUploadHandle(file) {
				var _t = this;
				var testReg = /(xls|xlsx)$/.test(file.name.toLowerCase());
				var isLt4M = file.size / 1024 / 1024 <= 4; //大小不超过4MB
				if (!testReg) {
					_t.$message.error(_t.$t('computerRoomManagement.dialog.import.selectExcelError'));
					return false;
				}
				if (!isLt4M) {
					_t.$message.error(_t.$t('computerRoomManagement.dialog.import.importErrorSize'));
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
						message: _t.$t('computerRoomManagement.dialog.import.selectExcel'),
						duration: 3000,
						type: 'error'
					});
				}
			},
			//上传结果
			uploadSuccessHandle(res) {
				var _t = this;
				// 200 全部成功
				if (res.status === 200) {
					//先置空原有表格的数据
					_t.excelAnalyzeResultDataList = [];
					//置空解析文件的错误数据集合的下载路径
					_t.excelAnalyzeResultFilePathForError = null;
					//解析文件的文件校验Key
					_t.excelAnalyzeResultValidateKey = null;
					_t.saveExcelContent_loading = false;
					_t.saveExcelContentBtn_disable = false;
					// 接口返回的导入有数据
					if (res.data !== null && res.data.listMap !== null) {
						// 上传成功 显示解析结果 弹出层
						_t.excelAnalyzeResultDialogVisible = true;
						// 导入文件窗口隐藏
						_t.assetDeviceImportDialogVisible = false;
						// 接收表格数据集合
						_t.excelAnalyzeResultDataList = res.data.listMap;
					}
					if (res.data !== null && res.data.validateKey !== null) {
						_t.excelAnalyzeResultValidateKey = res.data.validateKey;
					}
					if (res.data !== null && res.data.correctNumber !== null) {
						if (res.data.correctNumber == 0) {
							_t.saveExcelContentBtn_disable = true;
						} else {
							_t.saveExcelContentBtn_disable = false;
							_t.validateCorrectNumber = "格式校验正确数：" + res.data.correctNumber;
							//去后台开启与数据库校验
							_t.toStartValidateData();
						}
					}
					if (res.data !== null && res.data.errorNumber !== null) {
						_t.validateErrorNumber = "错误数：" + res.data.errorNumber;
					}
					_t.$message({
						message: _t.$t('computerRoomManagement.dialog.import.importSuccess'),
						duration: 3000,
						type: 'success'
					});
				} else if (res.status === 2300) {
					// 2300 数据不合规定 显示解析结果弹出层
					_t.excelAnalyzeResultDialogVisible = true;
					if (res.data !== null && res.data.listMap !== null) {
						// 导入文件窗口隐藏
						_t.assetDeviceImportDialogVisible = false;
						// 接收表格数据集合
						_t.excelAnalyzeResultDataList = res.data.listMap;
					}
					if (res.data !== null && res.data.validateKey !== null) {
						_t.excelAnalyzeResultValidateKey = res.data.validateKey;
					}
					if (res.data !== null && res.data.errorFilePath !== null) {
						// 缓存下 错误数据表格下载路径
						_t.excelAnalyzeResultFilePathForError = _t.rootUrl + res.data.errorFilePath;
					}
					if (res.data !== null && res.data.correctNumber !== null) {
						if (res.data.correctNumber == 0) {
							_t.saveExcelContentBtn_disable = true;
						} else {
							_t.saveExcelContentBtn_disable = false;
							_t.validateCorrectNumber = "格式校验正确数：" + res.data.correctNumber;
							//去后台开启与数据库校验
							_t.toStartValidateData();
						}
					}
					if (res.data !== null && res.data.errorNumber !== null) {
						_t.validateErrorNumber = "错误数：" + res.data.errorNumber;
					}
					_t.$message({
						message: _t.$t('computerRoomManagement.dialog.import.checkImportExcel'),
						duration: 3000,
						type: 'error'
					});
				} else {
					// 文件解析失败
					_t.$message({
						message: _t.$t('computerRoomManagement.dialog.import.parseExcelError'),
						duration: 3000,
						type: 'error'
					});
				}
			},
			//上传失败
			uploadErrorHandle() {
				var _t = this;
				_t.$message.error(_t.$t('computerRoomManagement.dialog.import.importError'));
				_t.submitUploadButtonDisabled = false;
			},
			// 下载 校验出错的数据表格
			downloadErrorData() {
				var _t = this;
				if (_t.excelAnalyzeResultFilePathForError !== null) {
					window.location.href = _t.excelAnalyzeResultFilePathForError;
				}
			},
			//去后台开启与数据库校验
			toStartValidateData() {
				var _t = this;
				_t.$api.get('asset/assetRack/toStartValidateData', {
					jsonString: JSON.stringify({
						validateKey: _t.excelAnalyzeResultValidateKey
					})
				}, function (res) {
				});
			},
			//导入正常解析结果
			toSaveExcelData() {
				var _t = this;
				_t.saveExcelContent_loading = true;
				_t.saveExcelContentBtn_disable = true;
				_t.saveExcelContent_loadingText = _t.$t('public.loading');
				// 定时器防止密集访问
				var validateTimer = setInterval(() => {
					_t.$api.get('asset/assetRack/toSaveExcelData', {
						jsonString: JSON.stringify({
							validateKey: _t.excelAnalyzeResultValidateKey
						})
					}, function (res) {
						switch (res.status) {
							case 200:
								if (null != res.data && undefined != res.data) {
									_t.showExcelContent_dialogTitle = _t.$t('assetDevice.dialog.excelAnalyzeResult.dialogSaveResultTitle');
									_t.showExcelContent_closeBtn = _t.$t('public.close');
									var resData = res.data;
									if (0 === resData.validatedNumber) {
										_t.saveExcelContent_loadingText = "数据准备中";
									} else if (resData.validatedNumber === resData.totalNumber) {
										_t.excelAnalyzeResultDataList = resData.list;
										_t.validateCorrectNumber = "已更新记录数：" + resData.correctNumber;
										_t.validateErrorNumber = "错误数：" + resData.errorNumber;
										if (null != res.data.errorFilePath) {
											_t.excelAnalyzeResultFilePathForError = _t.rootUrl + res.data.errorFilePath;
										} else {
											_t.excelAnalyzeResultFilePathForError = null;
										}
										_t.saveExcelContent_loading = false;
										//销毁定时器
										clearInterval(validateTimer);
										_t.excelAnalyzeResultDialogVisible = false;
									} else {
										_t.saveExcelContent_loadingText = "（已处理记录）" + resData.validatedNumber + "   /   " + resData.totalNumber + "（总记录数）";
									}
								}
								_t.getData();
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
			closeExcelAnalyzeContentDialog() {
				var _t = this;
				//关掉窗口
				_t.excelAnalyzeResultDialogVisible = false;
				//重新分页查询表格数据
				_t.getData();
			},
			/*----------------------------------导入excel结束------------------------------------*/
			/*----------------------------------导出模板---------------------------------------*/
			//导出机柜模板
			download() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetRack/toDownloadExcel', {
					jsonString: JSON.stringify({
						assetRack: {
							roomId: _t.queryItem.roomId === null ? null : (_t.queryItem.roomId.trim() === '' ? null : _t.queryItem.roomId.trim()),
							code: _t.queryItem.code === null ? null : (_t.queryItem.code.trim() === '' ? null : _t.queryItem.code.trim())
						}
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
			/*----------------------------------导出模板over---------------------------------------*/
			//跳转到机柜视图页面
			jumpToRackPage(rackId) {
				var _t = this;
				if (rackId !== null) {
					_t.$router.push({
						name: 'equipmentDistribution', params: {
							rackId: rackId
						}
					});
					localStorage.setItem('hy-rack-id', rackId);
				}
			}
		}
	}
</script>

<style scoped>
	.RackConfiguration {
		overflow: hidden;
	}

	.RackConfiguration_left {
		width: 174px;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		overflow: auto;
	}

	.RackConfiguration_left_head {
		line-height: 48px;
		background-color: #f2f2f2;
		font-size: 14px;
		overflow: hidden;
	}

	.RackConfiguration_left_head_oneSpan {
		padding-left: 10px;
		display: inline-block;
	}

	.RackConfiguration_left_main {
		text-align: center;
		font-size: 12px;
		color: #666;
		cursor: pointer;
	}

	.RackConfiguration_right {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
		padding-top: 0;
	}

	.isPageShowClass {
		width: auto;
		position: absolute;
		top: 45%;
		left: 45%;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
		padding-top: 0;
		font-size: 16px;
	}

	.RackConfiguration_right_head {
		line-height: 40px;
		padding-left: 20px;
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

	#RackConfiguration-navBar-inSet,
	#RackConfiguration-navBar-outSet {
		height: 40px;
		width: 14px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}

	#RackConfiguration-navBar-inSet {
		left: 214px;
		border-radius: 15px 0 0 15px;
	}

	#RackConfiguration-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}

	.RackConfiguration_left_collapse {
		border-bottom: #f2f2f2 solid 1px;
		text-align: left;
		padding-left: 30px;
		height: 36px;
	}

	.RackConfiguration_left_collapse:nth-last-child {
		border: 0;
	}

	/*必填项不能为空*/
	.isNotNull_rack {
		line-height: 1;
		font-size: 12px;
		margin-top: 4px;
		position: absolute;
		color: #ff2222;
		top: 30px;
		left: 0;
	}

	.RackConfiguration_btn {
		padding-left: 20px;
	}
</style>
<style>
	.RackConfiguration_left_main .el-collapse-item__header {
		padding-left: 10px;
		height: 45px;
	}

	.RackConfiguration_left_main .el-collapse-item__content {
		line-height: 30px;
		padding-bottom: 0;
	}

	.RackConfiguration_form .el-form-item {
		margin: 10px;
	}

	.AddRackConfiguration_dialog .el-dialog {
		width: 800px;
		height: 440px;
	}

	.group_append .el-input-group__append {
		border: none;
		padding: 0 10px;
	}

	.RackConfigImport-dialog .el-dialog {
		width: 500px;
		height: 300px;
	}

	.RackConfigExcelContent-dialog .el-dialog {
		width: 950px;
		height: 550px;
	}

	.RackConfigExcelContent-dialog .excelAnalyzeResult .el-loading-spinner .el-loading-text {
		font-size: 16px;
		color: white;
	}

	.RackConfiguration_left_main .el-collapse-item__content .RackConfiguration_left_collapse:last-child {
		border-bottom: none;
	}

	.RackConfigExcelContent-dialog .el-dialog__body {
		padding: 0px;
		max-height: 455px;
		z-index: 10000;
	}

	.RackConfigExcelContent-dialog .excelAnalyzeResult tr td,
	.RackConfigExcelContent-dialog .excelAnalyzeResult thead tr th {
		height: 35px !important;
		line-height: 35px !important;
	}
</style>
