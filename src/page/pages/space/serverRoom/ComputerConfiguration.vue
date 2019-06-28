<template>
	<Box>
		<!--左侧-->
		<div class="ComputerConfiguration_left" v-show="isShow" id="ComputerConfiguration_left">
			<div class="ComputerConfiguration_left_head">
					<span class="paddingLeft-10">
						{{$t('computerRoomManagement.treeDataCenterDirectory')}}
					</span>
				<!--点击新增数据中心按钮-->
				<span @click="dataCenterBtn" class="ComputerConfiguration_left_head_click">
						<span class="iconfont fs14">&#xe689;</span>
						<span class="ComputerConfiguration_left_head_title">{{$t('computerRoomManagement.treeNewBtn')}}</span>
					</span>
			</div>
			<!--左侧数据中心集合-->
			<div
				@click="clickNodeDataCenter(item,index)"
				@contextmenu.prevent="contextmenuTree($event,item)"
				class="ComputerConfiguration_left_main"
				v-for="(item,index) in rootMenuData" :key="index">
				{{item.name}}
			</div>
			<!--编辑删除按钮-->
			<ul v-if="dataCenterMenuShow" id="dataCenterMenu" class="dataCenterMenu">
				<li class="dataCenterMenu__item cursorPointer" @click="modifyDataCenter">
					<i class="el-icon-edit"></i>
					<span>{{$t('computerRoomManagement.dialogFormMenuEdit')}}</span>
				</li>
				<li class="dataCenterMenu__item cursorPointer" @click="deleteDataCenter">
					<i class="el-icon-delete"></i>
					<span>{{$t('computerRoomManagement.dialogFormMenuDelete')}}</span>
				</li>
			</ul>
			<!--收起-->
			<a href="javascript:;" @click="clickInset" id="ComputerConfiguration-navBar-inSet">
				<span class="iconfont">&#xe68b;</span>
			</a>
		</div>
		<!--展开-->
		<a href="javascript:;" @click="clickOutset" id="ComputerConfiguration-navBar-outSet">
			<span class="iconfont">&#xe69d;</span>
		</a>
		<div id="ComputerConfiguration_resize-navBar" v-show="isShow"></div>
		<!--右侧-->
		<div class="ComputerConfiguration_right" id="ComputerConfiguration_right">
			<!--面包屑区域-->
			<div class="Breadcrumb">
				<el-breadcrumb>
					<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
					<el-breadcrumb-item>{{$t('breadcrumb.ComputerConfiguration')}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div v-if="rootMenuData.length !== 0" class="marginTop50 ComputerConfiguration_contentPadding">
				<div class="clearfix paddingRight-20">
					<div class="fl">
						<span class="fsBold14">{{dataCenterForm.name}}</span>
						<span class="paddingLeft-10">{{dataCenterForm.address}}</span>
						<span class="paddingLeft-20">{{$t('computerRoomManagement.formTitleText')}}：</span>
						<span>{{dataCenterForm.chargeBy}}</span>
						<span v-if="dataCenterForm.chargeByMobile !== null">
							【{{dataCenterForm.chargeByMobile}}】
						</span>
					</div>
					<div class="fr">
						<!--添加机房按钮-->
						<el-button class="fl" type="primary" @click="addTheRoomBtn">
							<span class="iconfont fs14">&#xe689;</span>
							{{$t('computerRoomManagement.formAddTheRoom')}}
						</el-button>
						<!--批量导入按钮-->
						<el-button @click="toImportData">
							<span class="iconfont fs14">&#xe6af;</span>
							<span>{{$t('computerRoomManagement.formImport')}}</span>
						</el-button>
						<!--导出模板-->
						<el-button @click="download">
							<span class="iconfont fs14">&#xe6a8;</span>
							{{$t('RackConfiguration.BtnImportTheTemplate')}}
						</el-button>
					</div>
				</div>
				<!--机房集合-->
				<ul class="marginTop10 ComputerConfiguration_roomList">
					<li v-for="(item,index) in dataCenterRoomList" :key="index" @click.stop="getRackInfo(item)">
						<div class="ComputerConfiguration_roomList_box">
							<div class="ComputerConfiguration_roomList_imgBox">
								<img class="imgBg" src="./../../../../../static/room/01.png" alt="">
								<div class="ComputerConfiguration_roomList_imgText">
									<div class="marginRight20">
										<p class="ComputerConfiguration_roomList_imgNum">{{item.assetDeviceCount}}</p>
										<p>{{$t('computerRoomManagement.formRoomEquipmentNum')}}</p>
									</div>
									<div>
										<p class="ComputerConfiguration_roomList_imgNum">{{item.assetRackCount}}</p>
										<p>{{$t('computerRoomManagement.formRoomRackNum')}}</p>
									</div>
								</div>
							</div>
							<div class="ComputerConfiguration_roomList_textBox">
								<div class="ComputerConfiguration_roomList_contentTop">
									<div style="max-width: 70%;" class="textOverHidden">
										<span :title="item.name">{{item.name}}</span>
									</div>
									<div style="max-width: 30%;" class="textOverHidden">
										<span>{{$t('computerRoomManagement.formRoomUser')}}：</span>
										<span :title="item.chargeByName1">{{item.chargeByName1}}</span>
									</div>
								</div>
								<div class="ComputerConfiguration_roomList_contentTop">
									<div style="max-width: 80%;" class="textOverHidden">
										<span>{{$t('computerRoomManagement.formRoomAddress')}}:</span>
										<span :title="item.floor">{{item.floor}}</span>
									</div>
									<div>
										<el-button type="text" @click.stop="editTheRoomBtn(item)" :title="$t('public.edit')">
											<i class="el-icon-edit fs14 iconfontDisable"></i>
										</el-button>
										<el-button type="text" @click.stop="deleteTheRoom(item)" :title="$t('public.delete')">
											<i class="el-icon-delete fs14 iconfontDisable"></i>
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<!--数据中心为空-->
			<div v-else class="ComputerConfiguration_right_head_isNull">
				{{$t('computerRoomManagement.dialogFormDataCenterIsNullTip')}}
			</div>
		</div>
		<!--添加数据中心弹出层-->
		<el-dialog
			class="NewDataCenter_dialog"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			append-to-body
			:before-close="resetDataCenter"
			:title="$t('computerRoomManagement.dialogDataCenterTitle')"
			:visible.sync="dialogVisible_dataCenter">
			<el-form :model="addDataCenterForm" label-width="120px" inline :rules="rules" ref="ruleForm">
				<!--数据中心名称-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormDataCenterName')+'：'">
					<el-input @blur="blurDataCenter" id="dateCenter_name" v-model="addDataCenterForm.name" class="width200" clearable></el-input>
					<span v-if="errorTip.dataCenterFlag === true" class="isNotNull">{{errorTip.dataCenterTip}}</span>
				</el-form-item>
				<!--所在城市-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormDataCenterCity')+'：'">
					<el-input v-model="addDataCenterForm.city" class="width200" clearable></el-input>
				</el-form-item>
				<!--详细地址-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormDataCenterAddress')+'：'">
					<el-input v-model="addDataCenterForm.address" class="width200" clearable></el-input>
				</el-form-item>
				<!--负责人1-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormDataCenterPersonFirst')+'：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowPopoverChargeByFirst"
						ref="popover">
						<el-tree
							:data="responsibleList"
							node-key="nodeId"
							highlight-current
							@node-click="clickChargeByFirst"
							:props="defaultProps"/>
						<el-input
							id="dataCenter_chargeByFirst"
							v-model="addDataCenterForm.chargeByFirst"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
					<span v-if="errorTip.chargeByFirstFlag" class="isNotNull">{{$t('public.isNotNull')}}</span>
				</el-form-item>
				<!--负责人2-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormDataCenterPersonSecond')+'：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowPopoverChargeBySecond"
						ref="popover">
						<el-tree
							:data="responsibleList"
							node-key="nodeId"
							highlight-current
							@node-click="clickChargeBySecond"
							:props="defaultProps"/>
						<el-input
							v-model="addDataCenterForm.chargeBySecond"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
				</el-form-item>
				<!--备注-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormDataCenterNote')+'：'" style="display: block">
					<el-input class="ComputerConfiguration_textNote" v-model="addDataCenterForm.description"
							  type="textarea" clearable
							  :autosize="{minRows:3,maxRows:6}"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button v-if="ifAdd === true" class="alertBtn" type="primary" @click="addDataCenter('ruleForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button v-if="ifAdd === false" class="alertBtn" type="primary" @click="editDataCenter('ruleForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" @click="resetDataCenter">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--添加机房弹出层-->
		<el-dialog
			class="ComputerRoomManagement_dialog"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			append-to-body
			:before-close="resetRoomForm"
			:title="$t('computerRoomManagement.dialogFormRoomTitle')"
			:visible.sync="dialogVisible_roomName">
			<el-form :model="addRoomForm" label-width="120px" inline :rules="rules" ref="roomForm">
				<!--机房名称-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomName')+'：'">
					<el-input id="roomName" @blur="blurRoomName" v-model="addRoomForm.roomName" class="width200" clearable/>
					<span v-if="errorTip.roomNameFlag" class="isNotNull">{{errorTip.roomNameTip}}</span>
				</el-form-item>
				<!--机房编号-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomCode')+'：'">
					<el-input id="roomNo" @focus="focusRoomNo" @blur="blurRoomNo" v-model="addRoomForm.roomNo" class="width200" clearable/>
					<span v-if="errorTip.roomNoFlag" class="isNotNull">{{errorTip.roomNoTip}}</span>
				</el-form-item>
				<!--所属数据中心-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomDataCenter')+'：'" prop="centerId">
					<el-select :disabled="true" v-model="addRoomForm.centerId" class="width200" clearable>
						<el-option v-for="(item,index) in rootMenuData" :key="index" :value="item.id" :label="item.name"/>
					</el-select>
				</el-form-item>
				<!--位置信息-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomLocation')+'：'" prop="floor">
					<el-input v-model="addRoomForm.floor" class="width200" clearable/>
				</el-form-item>
				<!--电源容量-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomRatedPower')+'：'" prop="powerCapacity">
					<el-input v-model="addRoomForm.powerCapacity" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
							  class="width200 group_append" clearable>
						<span slot="append" class="inputGroup">W</span>
					</el-input>
				</el-form-item>
				<!--电源阈值-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomVoltage')+'：'" prop="powerUc">
					<el-input v-model="addRoomForm.powerUc" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
							  class="width200 group_append" clearable>
						<span slot="append" class="inputGroup">W</span>
					</el-input>
				</el-form-item>
				<!--电流-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomCurrent')+'：'" prop="current">
					<el-input v-model="addRoomForm.current" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
							  class="width200 group_append" clearable>
						<span slot="append" class="inputGroup">A</span>
					</el-input>
				</el-form-item>
				<!--电流阈值-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomCurrentVoltage')+'：'" prop="currentUc">
					<el-input v-model="addRoomForm.currentUc" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
							  class="width200 group_append" clearable>
						<span slot="append" class="inputGroup">A</span>
					</el-input>
				</el-form-item>
				<!--最大行数-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomRows')+'：'" prop="maxRow">
					<el-input v-model="addRoomForm.maxRow" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
							  class="width200" clearable/>
				</el-form-item>
				<!--最大列数-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomColumns')+'：'" prop="maxCol">
					<el-input v-model="addRoomForm.maxCol" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
							  class="width200" clearable/>
				</el-form-item>
				<!--负责人1-->
				<el-form-item class="star" :label="$t('computerRoomManagement.dialogFormRoomChargeByFirst')+'：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowPopoverChargeByRoomFirst"
						ref="popover">
						<el-tree
							:data="responsibleList"
							node-key="nodeId"
							highlight-current
							@node-click="clickChargeByRoomFirst"
							:props="defaultProps"/>
						<el-input
							id="roomForm_chargeByFirst"
							v-model="addRoomForm.chargeByFirst"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
					<span v-if="errorTip.chargeByRoomFirstFlag" class="isNotNull">{{$t('public.isNotNull')}}</span>
				</el-form-item>
				<!--负责人2-->
				<el-form-item :label="$t('computerRoomManagement.dialogFormRoomChargeBySecond')+'：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowPopoverChargeByRoomSecond"
						ref="popover">
						<el-tree
							:data="responsibleList"
							node-key="nodeId"
							highlight-current
							@node-click="clickChargeByRoomSecond"
							:props="defaultProps"/>
						<el-input
							v-model="addRoomForm.chargeBySecond"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button class="alertBtn" v-if="ifAddRoom === true" type="primary" @click="addTheRoom('roomForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" v-if="ifAddRoom === false" type="primary" @click="editTheRoom('roomForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" @click="resetRoomForm">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--导入excel-->
		<el-dialog
			class="computerRoomManagementImport-dialog"
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
				:action="rootUrl + '/asset/serverRoom/toImportExcel'">
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
			class="ComShowExcelContent-dialog"
			:title="$t('computerRoomManagement.dialog.excelAnalyzeResult.dialogTitle')"
			append-to-body
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
				<!-- 机房名称 -->
				<el-table-column width="100px" align="left" fixed="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnName')">
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
				<!-- 机房编号 -->
				<el-table-column width="100px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnCode')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.roomNoVerify">{{scope.row.roomNo}}</span>
								<span v-else>{{scope.row.roomNoVerifyMsg}}</span>
							</div>
							<span :class="scope.row.roomNoVerify === false ? 'iconfontError':''">{{scope.row.roomNo}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 所属数据中心 -->
				<el-table-column width="100px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnCenterId')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.centerIdVerify">{{scope.row.centerId}}</span>
								<span v-else>{{scope.row.centerIdVerifyMsg}}</span>
							</div>
							<span :class="scope.row.centerIdVerify === false ? 'iconfontError':''">{{scope.row.centerId}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 位置信息 -->
				<el-table-column width="100px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnFloor')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.floorVerify">{{scope.row.floor}}</span>
								<span v-else>{{scope.row.floorVerifyMsg}}</span>
							</div>
							<span :class="scope.row.floorVerify === false ? 'iconfontError':''">{{scope.row.floor}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 电源容量 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnPowerCapacity')">
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
				<!-- 电源阈值 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnPowerUc')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.powerUcVerify">{{scope.row.powerUc}}</span>
								<span v-else>{{scope.row.powerUcVerifyMsg}}</span>
							</div>
							<span :class="scope.row.powerUcVerify === false ? 'iconfontError':''">{{scope.row.powerUc}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 电流 -->
				<el-table-column width="50px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnCurrent')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.currentVerify">{{scope.row.current}}</span>
								<span v-else>{{scope.row.currentVerifyMsg}}</span>
							</div>
							<span :class="scope.row.currentVerify === false ? 'iconfontError':''">{{scope.row.current}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 电流阈值 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnCurrentUc')">
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
				<!-- 最大行数 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnMaxRow')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.maxRowVerify">{{scope.row.maxRow}}</span>
								<span v-else>{{scope.row.maxRowVerifyMsg}}</span>
							</div>
							<span :class="scope.row.maxRowVerify === false ? 'iconfontError':''">{{scope.row.maxRow}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 最大列数 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnMaxCol')">
					<template slot-scope="scope">
						<el-tooltip type="dark" placement="left">
							<div slot="content">
								<span v-if="scope.row.maxColVerify">{{scope.row.maxCol}}</span>
								<span v-else>{{scope.row.maxColVerifyMsg}}</span>
							</div>
							<span :class="scope.row.maxColVerify === false ? 'iconfontError':''">{{scope.row.maxCol}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<!-- 负责人1 -->
				<el-table-column width="80px" align="left"
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnChargeBy')">
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
								 :label="$t('computerRoomManagement.dialog.excelAnalyzeResult.columnChargeBySecond')">
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
				<el-button type="danger" plain v-if="excelAnalyzeResultFilePathForError != null" @click="downloadErrorData">
					{{$t('computerRoomManagement.dialog.excelAnalyzeResult.downloadErrorBtn')}}
				</el-button>
				<el-button type="primary" @click="toSaveExcelData" :disabled="saveExcelContentBtn_disable">
					<template>
						<el-tooltip :content="$t('computerRoomManagement.dialog.excelAnalyzeResult.confirmBtnTip')" placement="top"
									type="dark">
							<span>{{$t('computerRoomManagement.dialog.excelAnalyzeResult.confirmBtn')}}</span>
						</el-tooltip>
					</template>
				</el-button>
				<el-button class="alertBtn" @click="closeExcelAnalyzeContentDialog">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull, isIntNumber, isDoubleNumber} from "../../../../assets/js/validator";

	export default {
		name: "ComputerConfiguration",
		components: {Box},
		data() {
			return {
				//校验通过与错误的数量
				validateCorrectNumber:"格式校验正确数：0",
				validateErrorNumber:"错误数：0",
				//解析接口返回的文件校验的key
				excelAnalyzeResultValidateKey: null,
				saveExcelContent_loading:false,
				saveExcelContent_loadingText:"拼命加载中",
				saveExcelContentBtn_disable:true,
				//导入excel弹窗是否显示
				assetDeviceImportDialogVisible: false,
				submitUploadButtonDisabled: false,
				fileList:[],
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
				isShow: true,
				//右侧内容区默认的left值
				leftOfRightView: 172,
				rootMenuData: [], //  数据中心目录
				dialogVisible_dataCenter: false, // 数据中心弹出层
				dialogVisible_roomName: false, // 机房弹出层
				dataCenterMenuShow: false, // 数据中心右键弹出层
				isShowPopoverChargeByFirst: false, // 数据中心责任人1
				isShowPopoverChargeBySecond: false, // 数据中心责任人2
				isShowPopoverChargeByRoomFirst: false, // 机房责任人1
				isShowPopoverChargeByRoomSecond: false, // 机房责任人2
				ifAdd: true, // 是否新增数据中心
				ifDataCenter: true, // 是否数据中心
				ifAddRoom: true, // 是否新增机房
				// 添加机房
				addRoomForm: {
					id: '',
					roomName: '', // 机房名称
					roomNo: '', // 机房编号
					centerId: '', // 数据中心id
					floor: '', // 位置
					powerCapacity: '', // 电源容量
					powerUc: '', // 电源阈值
					current: '', // 电流
					currentUc: '', // 电流阈值
					maxRow: '', // 最大行数
					maxCol: '', // 最大列数
					chargeByFirstId: '', // 责任人1 id
					chargeByFirst: '', // 责任人1
					chargeBySecondId: '', // 责任人2 id
					chargeBySecond: '', // 责任人2
				},
				// 添加数据中心
				addDataCenterForm: {
					name: '', // 数据中心名称
					city: '', // 城市
					address: '', // 详细地址
					chargeByFirstId: '', // 责任人1
					chargeByFirst: '', // 责任人1
					chargeBySecondId: '', // 责任人2
					chargeBySecond: '', // 责任人2
					description: '', // 备注
				},
				// 数据中心详情
				dataCenterForm: {
					id: '',
					name: '',
					address: '',
					chargeBy: '',
					chargeByMobile: ''
				},
				responsibleList: [], // 责任人集合
				dataCenterRoomList: [], // 数据中心下机房集合
				// 责任人
				defaultProps: {
					nodeId: 'nodeId',
					label: 'nodeName',
					children: 'children'
				},
				errorTip: {
					chargeByFirstFlag: false, // 数据中心责任人1
					chargeByRoomFirstFlag: false, // 机房责任人1
					dataCenterFlag: false, // 数据中心名称显示与否
					dataCenterTip: '', // 数据中心校验错误提示
					roomNameFlag:false,// 新增编辑机房名称校验提示显示与否
					roomNameTip:'', // 新增编辑机房名称校验提示
					roomNoFlag:false, // 新增编辑机房编号
					roomNoTip:'', // 新增编辑机房编号提示
				},
				rules: {
					// 数据中心 表单校验
					name: [
						{validator: isNotNull, trigger: ['blur']}
					],
					chargeByFirst: [
						{validator: isNotNull, trigger: ['blur', 'change']}
					],
					// 机房表单校验
					roomName: [
						{validator: isNotNull, trigger: ['blur']}
					],
					floor: [
						{validator: isNotNull, trigger: ['blur']}
					],
					maxRow: [
						{validator: isNotNull, trigger: ['blur']},
						{validator: isIntNumber, trigger: ['blur']}
					],
					maxCol: [
						{validator: isNotNull, trigger: ['blur']},
						{validator: isIntNumber, trigger: ['blur']}
					],
					centerId: [
						{validator: isNotNull, trigger: ['blur']}
					],
					powerCapacity: [
						{validator: isDoubleNumber, trigger: ['blur']}
					],
					powerUc: [
						{validator: isDoubleNumber, trigger: ['blur']}
					],
					current: [
						{validator: isDoubleNumber, trigger: ['blur']}
					],
					currentUc: [
						{validator: isDoubleNumber, trigger: ['blur']}
					]
				}
			}
		},
		methods: {
			// 打开导入excel窗口
			toImportData() {
				var _t = this;
				//打开上传窗口
				_t.assetDeviceImportDialogVisible = true;
				_t.fileList = [];
			},
			//上传的文件个数超出设定时触发的函数
			onExceedHandle() {
				var _t = this;
				_t.$message({
					message: _t.$t('computerRoomManagement.dialog.import.importOnceNum'),
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
			/*--------*/
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
						//清空上传列表，以防有文件残留
						_t.$refs.upload.clearFiles();
						// 导入文件窗口隐藏
						_t.assetDeviceImportDialogVisible = false;
						// 接收表格数据集合
						_t.excelAnalyzeResultDataList = res.data.listMap;
					}
					if (res.data!==null&&res.data.validateKey!==null) {
						_t.excelAnalyzeResultValidateKey = res.data.validateKey;
					}
					if(res.data !== null && res.data.correctNumber !== null){
						if(res.data.correctNumber==0){
							_t.saveExcelContentBtn_disable = true;
						}else{
							_t.saveExcelContentBtn_disable = false;
							_t.validateCorrectNumber = "格式校验正确数：" + res.data.correctNumber;
							//去后台开启与数据库校验
							_t.toStartValidateData();
						}
					}
					if (res.data!==null&&res.data.errorNumber!==null) {
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
					if (res.data!==null&&res.data.validateKey!==null) {
						_t.excelAnalyzeResultValidateKey = res.data.validateKey;
					}
					if (res.data !== null && res.data.errorFilePath !== null) {
						// 缓存下 错误数据表格下载路径
						_t.excelAnalyzeResultFilePathForError = _t.rootUrl + res.data.errorFilePath;
					}
					if(res.data !== null && res.data.correctNumber !== null){
						if(res.data.correctNumber==0){
							_t.saveExcelContentBtn_disable = true;
						}else{
							_t.saveExcelContentBtn_disable = false;
							_t.validateCorrectNumber = "格式校验正确数：" + res.data.correctNumber;
							//去后台开启与数据库校验
							_t.toStartValidateData();
						}
					}
					if (res.data!==null&&res.data.errorNumber!==null) {
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
			/*---------*/
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
				_t.$api.get('asset/serverRoom/toStartValidateData', {
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
				_t.saveExcelContent_loadingText = "拼命加载中";
				// 定时器防止密集访问
				var validateTimer = setInterval(() => {
					_t.$api.get('asset/serverRoom/toSaveExcelData', {
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
										_t.excelAnalyzeResultDialogVisible = false;
									}else{
										_t.saveExcelContent_loadingText = "（已处理记录）" + resData.validatedNumber + "   /   " + resData.totalNumber + "（总记录数）";
									}
								}
								_t.getRoomListByDataCenter();
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
				_t.getRoomListByDataCenter();
			},
			//导出机房数据模板
			download(){
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/serverRoom/toDownloadExcel', {
					jsonString: JSON.stringify({
						assetServerRoom: {
							centerId: _t.dataCenterForm.id,
							dataCenterName: _t.dataCenterForm.name
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
			// 数据中心责任人1
			clickChargeByFirst(val) {
				var _t = this;
				// level 2 用户
				if (val.level === 3) {
					_t.addDataCenterForm.chargeByFirstId = val.nodeId;
					_t.addDataCenterForm.chargeByFirst = val.nodeName;
					_t.isShowPopoverChargeByFirst = false;
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#DCDFE6';
				}
			},
			// 数据中心责任人2
			clickChargeBySecond(val) {
				var _t = this;
				// level 2 用户
				if (val.level === 3) {
					_t.addDataCenterForm.chargeBySecondId = val.nodeId;
					_t.addDataCenterForm.chargeBySecond = val.nodeName;
					_t.isShowPopoverChargeBySecond = false;
				}
			},
			// 机房责任人1
			clickChargeByRoomFirst(val) {
				var _t = this;
				// level 2 用户
				if (val.level === 3) {
					_t.addRoomForm.chargeByFirstId = val.nodeId;
					_t.addRoomForm.chargeByFirst = val.nodeName;
					_t.isShowPopoverChargeByRoomFirst = false;
					_t.errorTip.chargeByRoomFirstFlag = false;
					document.getElementById('roomForm_chargeByFirst').style.borderColor = '#DCDFE6';
				}
			},
			// 机房责任人2
			clickChargeByRoomSecond(val) {
				var _t = this;
				// level 2 用户
				if (val.level === 3) {
					_t.addRoomForm.chargeBySecondId = val.nodeId;
					_t.addRoomForm.chargeBySecond = val.nodeName;
					_t.isShowPopoverChargeByRoomSecond = false;
				}
			},
			// 获取责任人树形数据
			getChargeByList() {
				var _t = this;
				_t.$api.get('system/organization/getOrgRoleUserTree', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								var resData = JSON.parse(res.data);
								if (resData.children && resData.children.length !== 0) {
									_t.responsibleList = resData.children;
								}
								// 编辑数据中心时
								if (_t.ifDataCenter === true && _t.ifAdd === false) {
									_t.getEditDataCenter();
								}
								// 编辑机房时
								if (_t.ifDataCenter === false && _t.ifAddRoom === false) {
									_t.getEditRoom();
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 点击数据中心获取数据中心详情
			clickNodeDataCenter(val, index) {
				var _t = this;
				// 隐藏右键显示层
				_t.dataCenterMenuShow = false;
				_t.$api.get('asset/dataCenter/' + val.id, {}, function (res) {
					switch (res.status) {
						case 200:
							// 返回值有数据
							if (res.data !== null) {
								_t.dataCenterForm.id = res.data.id;
								if (res.data.name) {
									_t.dataCenterForm.name = res.data.name;
								}
								if (res.data.chargeByName1) {
									_t.dataCenterForm.chargeBy = res.data.chargeByName1;
								}
								if (res.data.mobile1) {
									_t.dataCenterForm.chargeByMobile = res.data.mobile1;
								}
								// 拼接地址
								var address = '';
								if (res.data.city && res.data.city !== null) {
									address += res.data.city + ' ';
								}
								if (res.data.address && res.data.address !== null) {
									address += res.data.address;
								}
								_t.dataCenterForm.address = address;
							}
							_t.$nextTick(function () {
								var listClassName = document.getElementsByClassName('ComputerConfiguration_left_main');
								if (listClassName.length !== 0) {
									for (var i = 0; i < listClassName.length; i++) {
										// 清除全部的is-active 类名
										if (listClassName[i].classList[0] === 'is-active' || listClassName[i].classList[1] === 'is-active') {
											listClassName[i].classList.remove('is-active');
										}
									}
								}
								// 给点击的元素添加is-active类名
								document.getElementsByClassName('ComputerConfiguration_left_main')[index].classList.add('is-active');
								// 获取数据中心底下的机房列表
								_t.getRoomListByDataCenter();
							});
							break;
						default:
							break;
					}
				});
			},
			// 获取数据中心对应的 机房列表
			getRoomListByDataCenter() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/serverRoom/all', {
					jsonString: JSON.stringify({
						assetServerRoom: {
							centerId: _t.dataCenterForm.id
						}
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								_t.dataCenterRoomList = res.data.list === null ? [] : res.data.list;
							}
							break;
						default:
							_t.dataCenterRoomList = [];
							break;
					}
				});
			},
			// 右键事件
			contextmenuTree(e, val) {
				var _t = this;
				// 显示右键菜单
				_t.dataCenterMenuShow = true;
				// 取消默认事件
				e.preventDefault();
				// 节点加载完成后进行定位
				_t.$nextTick(function () {
					document.getElementById('dataCenterMenu').style.left = e.clientX + 'px';
					document.getElementById('dataCenterMenu').style.top = e.clientY + 'px';
					var widthList = document.getElementById('ComputerConfiguration_left').style.width.split('px');
					// 拖动过
					if (widthList[0] !== '') {
						// 拖拽线 居左距离
						var leftWidth = 56 + Number(widthList[0]);
						if (e.clientX > leftWidth - 60) {
							document.getElementById('dataCenterMenu').style.left = leftWidth - 60 + 'px';
						}
					} else {
						// 没有拖动过 width 175
						if (e.clientX > 165) {
							document.getElementById('dataCenterMenu').style.left = '165px';
						}
					}
				});
				// 节点数据相关
				_t.dataCenterForm.id = val.id;
			},
			// 编辑数据中心
			modifyDataCenter() {
				var _t = this;
				_t.ifAdd = false;
				_t.ifDataCenter = true;
				_t.dialogVisible_dataCenter = true;
				_t.getChargeByList();
			},
			// 编辑数据中心 回显
			getEditDataCenter() {
				var _t = this;
				_t.$api.get('asset/dataCenter/' + _t.dataCenterForm.id, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addDataCenterForm.name = res.data.name; // 数据中心名称
							_t.addDataCenterForm.city = res.data.city; // 城市
							_t.addDataCenterForm.address = res.data.address; // 详细地址
							_t.addDataCenterForm.chargeByFirstId = res.data.chargeby; // 责任人1
							_t.addDataCenterForm.chargeByFirst = res.data.chargeByName1; // 责任人1
							_t.addDataCenterForm.chargeBySecondId = res.data.chargeby2; // 责任人2
							_t.addDataCenterForm.chargeBySecond = res.data.chargeByName2; // 责任人2
							_t.addDataCenterForm.description = res.data.description; // 备注
							break;
						default:
							_t.addDataCenterForm.name = ''; // 数据中心名称
							_t.addDataCenterForm.city = ''; // 城市
							_t.addDataCenterForm.address = ''; // 详细地址
							_t.addDataCenterForm.chargeByFirstId = ''; // 责任人1
							_t.addDataCenterForm.chargeByFirst = ''; // 责任人1
							_t.addDataCenterForm.chargeBySecondId = ''; // 责任人2
							_t.addDataCenterForm.chargeBySecond = ''; // 责任人2
							_t.addDataCenterForm.description = ''; // 备注
							break;
					}
				});
			},
			// 删除数据中心
			deleteDataCenter() {
				var _t = this;
				_t.$confirm(_t.$t('computerRoomManagement.dialogFormMenuDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('asset/dataCenter/' + _t.dataCenterForm.id, {}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('computerRoomManagement.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getDataCenter();
								}).catch(()=>{
									_t.getDataCenter();
								});
								break;
							case 2200: // 数据中心关联机房
								_t.$alert(_t.$t('computerRoomManagement.deleteDataCenter'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getDataCenter();
								}).catch(()=>{
									_t.getDataCenter();
								});
								break;
							default:
								break;
						}
						_t.dataCenterMenuShow = false; // 右键弹出层隐藏
					});
				}).catch(() => {
					return;
				});
			},
			// 新增数据中心按钮
			dataCenterBtn() {
				var _t = this;
				_t.ifAdd = true;
				_t.ifDataCenter = true;
				_t.getChargeByList();
				_t.dialogVisible_dataCenter = true;
			},
			// 校验数据中心名称,机房名称,机房编号等字段
			ruleNameAndRoomNo(value,flag,tip,tipVal,domId){
				var _t = this;
				if (value === null || value.trim() === '') {
					_t.errorTip[flag] = true;
					_t.errorTip[tip] = tipVal;
					document.getElementById(domId).style.borderColor = '#fb6041';
				} else {
					_t.errorTip[flag] = false;
					_t.errorTip[tip] = '';
					document.getElementById(domId).style.borderColor = '#DCDFE6';
				}
			},
			// 数据中心名称失去焦点时触发
			blurDataCenter(){
				var _t = this;
				_t.ruleNameAndRoomNo(_t.addDataCenterForm.name,'dataCenterFlag','dataCenterTip',_t.$t('public.isNotNull'),'dateCenter_name');
			},
			// 新增数据中心提交按钮
			addDataCenter(formName) {
				var _t = this;
				// 校验 数据中心名称不能为空
				_t.blurDataCenter();
 				// 校验责任人1是否为空
				if (_t.addDataCenterForm.chargeByFirstId === null || _t.addDataCenterForm.chargeByFirstId === '') {
					_t.errorTip.chargeByFirstFlag = true;
					document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#DCDFE6';
				}
				_t.$refs[formName].validate((valid) => {
					if (valid
						&& _t.errorTip.chargeByFirstFlag === false
						&& _t.errorTip.dataCenterFlag === false) {
						_t.$api.post('asset/dataCenter/', {
							assetDataCenter: {
								name: _t.addDataCenterForm.name === null ? null : (_t.addDataCenterForm.name.trim() === '' ? null : _t.addDataCenterForm.name.trim()),
								city: _t.addDataCenterForm.city === null ? null : (_t.addDataCenterForm.city.trim() === '' ? null : _t.addDataCenterForm.city.trim()),
								address: _t.addDataCenterForm.address === null ? null : (_t.addDataCenterForm.address.trim() === '' ? null : _t.addDataCenterForm.address.trim()),
								chargeby: _t.addDataCenterForm.chargeByFirstId === null ? null : (_t.addDataCenterForm.chargeByFirstId.trim() === '' ? null : _t.addDataCenterForm.chargeByFirstId.trim()),
								chargeby2: _t.addDataCenterForm.chargeBySecondId === null ? null : (_t.addDataCenterForm.chargeBySecondId.trim() === '' ? null : _t.addDataCenterForm.chargeBySecondId.trim()),
								description: _t.addDataCenterForm.description === null ? null : (_t.addDataCenterForm.description.trim() === '' ? null : _t.addDataCenterForm.description.trim())
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									// 保存成功 加载左侧数据中心 数据
									_t.getDataCenter();
									_t.resetDataCenter();
									break;
								case 2005: // 添加失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getDataCenter();
										_t.resetDataCenter();
									}).catch(()=>{
										_t.getDataCenter();
										_t.resetDataCenter();
									});
									break;
								case 2400: // 数据名称重复
									_t.errorTip.dataCenterFlag = true;
									_t.errorTip.dataCenterTip = _t.$t('computerRoomManagement.ruleDataCenterName');
									document.getElementById('dateCenter_name').style.borderColor = '#fb6041';
									break;
								default:
									_t.resetDataCenter();
									break;
							}
						});
					}
				});
			},
			// 编辑数据中心提交按钮
			editDataCenter(formName) {
				var _t = this;
				// 校验 数据中心名称不能为空
				_t.blurDataCenter();
				// 校验责任人1是否为空
				if (_t.addDataCenterForm.chargeByFirstId === null || _t.addDataCenterForm.chargeByFirstId === '') {
					_t.errorTip.chargeByFirstFlag = true;
					document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByFirstFlag = false;
					document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#DCDFE6';
				}
				_t.$refs[formName].validate((valid) => {
					if (valid
						&& _t.errorTip.chargeByFirstFlag === false
						&& _t.errorTip.dataCenterFlag === false) {
						_t.$api.put('asset/dataCenter/', {
							assetDataCenter: {
								id: _t.dataCenterForm.id,
								name: _t.addDataCenterForm.name === null ? null : (_t.addDataCenterForm.name.trim() === '' ? null : _t.addDataCenterForm.name.trim()),
								city: _t.addDataCenterForm.city === null ? null : (_t.addDataCenterForm.city.trim() === '' ? null : _t.addDataCenterForm.city.trim()),
								address: _t.addDataCenterForm.address === null ? null : (_t.addDataCenterForm.address.trim() === '' ? null : _t.addDataCenterForm.address.trim()),
								chargeby: _t.addDataCenterForm.chargeByFirstId === null ? null : (_t.addDataCenterForm.chargeByFirstId.trim() === '' ? null : _t.addDataCenterForm.chargeByFirstId.trim()),
								chargeby2: _t.addDataCenterForm.chargeBySecondId === null ? null : (_t.addDataCenterForm.chargeBySecondId.trim() === '' ? null : _t.addDataCenterForm.chargeBySecondId.trim()),
								description: _t.addDataCenterForm.description === null ? null : (_t.addDataCenterForm.description.trim() === '' ? null : _t.addDataCenterForm.description.trim())
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.$alert(_t.$t('computerRoomManagement.dialogFormDataCenterSuccessTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getDataCenter();
										_t.resetDataCenter();
									}).catch(()=>{
										_t.getDataCenter();
										_t.resetDataCenter();
									});
									break;
								case 2006: // 修改失败
									_t.dialogVisible_dataCenter = false;
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getDataCenter();
										_t.resetDataCenter();
									}).catch(()=>{
										_t.getDataCenter();
										_t.resetDataCenter();
									});
									break;
								case 2400: // 数据中心重复
									_t.errorTip.dataCenterFlag = true;
									_t.errorTip.dataCenterTip = _t.$t('computerRoomManagement.ruleDataCenterName');
									document.getElementById('dateCenter_name').style.borderColor = '#fb6041';
									break;
								default:
									break;
							}
						});
					}
				});
			},
			// 重置数据中心表单
			resetDataCenter() {
				var _t = this;
				_t.ifAdd = true;
				_t.ifDataCenter = true;
				_t.dialogVisible_dataCenter = false;
				_t.addDataCenterForm.name = ''; // 数据中心名称
				_t.addDataCenterForm.city = ''; // 城市
				_t.addDataCenterForm.address = ''; // 详细地址
				_t.addDataCenterForm.chargeByFirstId = ''; // 责任人1
				_t.addDataCenterForm.chargeByFirst = ''; // 责任人1
				_t.addDataCenterForm.chargeBySecondId = ''; // 责任人2
				_t.addDataCenterForm.chargeBySecond = ''; // 责任人2
				_t.addDataCenterForm.description = ''; // 备注
				_t.errorTip.chargeByFirstFlag = false;
				_t.errorTip.dataCenterFlag = false;
				document.getElementById('dataCenter_chargeByFirst').style.borderColor = '#DCDFE6';
				document.getElementById('dateCenter_name').style.borderColor = '#DCDFE6';
				// _t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
				// _t.$refs.ruleForm.clearValidate(); //移除校验结果
				_t.dataCenterMenuShow = false; // 右键弹出层隐藏
			},
			// 添加机房按钮
			addTheRoomBtn() {
				var _t = this;
				_t.addRoomForm.centerId = _t.dataCenterForm.id;
				_t.ifDataCenter = false;
				_t.ifAddRoom = true;
				_t.dialogVisible_roomName = true;
				_t.getChargeByList();
			},
			// 机房名称失去焦点时
			blurRoomName(){
				var _t = this;
				_t.ruleNameAndRoomNo(_t.addRoomForm.roomName,'roomNameFlag','roomNameTip',_t.$t('public.isNotNull'),'roomName');
			},
			// 机房编号获取焦点
			focusRoomNo(){
				var _t = this;
				if (_t.addRoomForm.roomName !== null && _t.addRoomForm.roomName.trim() !== '') {
					_t.addRoomForm.roomNo = _t.addRoomForm.roomName;
				}
			},
			// 机房编号失去焦点
			blurRoomNo(){
				var _t = this;
				if (_t.addRoomForm.roomNo !== null || _t.addRoomForm.roomNo.trim() !== '') {
					_t.errorTip.roomNoFlag = false;
					_t.errorTip.roomNoTip = '';
					document.getElementById('roomNo').style.borderColor = '#DCDFE6';
				}
			},
			// 新增机房 提交按钮
			addTheRoom(formName) {
				var _t = this;
				// 校验机房名称
				_t.blurRoomName();
				// 校验 负责人1 非空
				if (_t.addRoomForm.chargeByFirstId === '' || _t.addRoomForm.chargeByFirstId === null) {
					_t.errorTip.chargeByRoomFirstFlag = true;
					document.getElementById('roomForm_chargeByFirst').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByRoomFirstFlag = false;
					document.getElementById('roomForm_chargeByFirst').style.borderColor = '#DCDFE6';
				}
				_t.$refs[formName].validate((valid) => {
					if (valid
						&& _t.errorTip.chargeByRoomFirstFlag === false
						&& _t.errorTip.roomNameFlag === false
						&& _t.errorTip.roomNoFlag === false) {
						_t.$api.post('asset/serverRoom/', {
							assetServerRoom: {
								name: _t.addRoomForm.roomName === null ? null : (_t.addRoomForm.roomName.trim() === '' ? null : _t.addRoomForm.roomName.trim()),
								roomNo: _t.addRoomForm.roomNo === null ? null : (_t.addRoomForm.roomNo.trim() === '' ? null : _t.addRoomForm.roomNo.trim()),
								centerId: _t.addRoomForm.centerId === null ? null : (_t.addRoomForm.centerId.trim() === '' ? null : _t.addRoomForm.centerId.trim()),
								floor: _t.addRoomForm.floor === null ? null : (_t.addRoomForm.floor.trim() === '' ? null : _t.addRoomForm.floor.trim()),
								powerCapacity: _t.addRoomForm.powerCapacity === null ? null : (_t.addRoomForm.powerCapacity.trim() === '' ? null : _t.addRoomForm.powerCapacity.trim()),
								powerUc: _t.addRoomForm.powerUc === null ? null : (_t.addRoomForm.powerUc.trim() === '' ? null : _t.addRoomForm.powerUc.trim()),
								current: _t.addRoomForm.current === null ? null : (_t.addRoomForm.current.trim() === '' ? null : _t.addRoomForm.current.trim()),
								currentUc: _t.addRoomForm.currentUc === null ? null : (_t.addRoomForm.currentUc.trim() === '' ? null : _t.addRoomForm.currentUc.trim()),
								maxRow: _t.addRoomForm.maxRow === null ? null : (_t.addRoomForm.maxRow.trim() === '' ? null : _t.addRoomForm.maxRow.trim()),
								maxCol: _t.addRoomForm.maxCol === null ? null : (_t.addRoomForm.maxCol.trim() === '' ? null : _t.addRoomForm.maxCol.trim()),
								chargeBy: _t.addRoomForm.chargeByFirstId === null ? null : (_t.addRoomForm.chargeByFirstId.trim() === '' ? null : _t.addRoomForm.chargeByFirstId.trim()),
								chargeBy2: _t.addRoomForm.chargeBySecondId === null ? null : (_t.addRoomForm.chargeBySecondId.trim() === '' ? null : _t.addRoomForm.chargeBySecondId.trim())
							}
						}, function (res) {
							switch (res.status) {
								case 200: // 添加成功
									_t.getRoomListByDataCenter();
									_t.resetRoomForm();
									break;
								case 2005: // 添加失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									}).catch(()=>{
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									});
									break;
								case 2400: // 同一数据中心 下机房重复
									var verify = JSON.parse(res.message);
									// 机房名称重复
									if (verify.nameVerify && verify.nameVerify === '0') {
										_t.errorTip.roomNameFlag = true;
										_t.errorTip.roomNameTip = _t.$t('computerRoomManagement.ruleRoomName');
										document.getElementById('roomName').style.borderColor = '#fb6041';
									}
									// 机房编号重复
									if (verify.noVerify && verify.noVerify === '0') {
										_t.errorTip.roomNoFlag = true;
										_t.errorTip.roomNoTip= _t.$t('computerRoomManagement.ruleRoomNo');
										document.getElementById('roomNo').style.borderColor = '#fb6041';
									}
									break;
								default:
									_t.resetRoomForm();
									break;
							}
						});
					}
				});
			},
			// 编辑机房 按钮
			editTheRoomBtn(item) {
				var _t = this;
				_t.addRoomForm.id = item.id;
				_t.ifDataCenter = false;
				_t.ifAddRoom = false;
				_t.dialogVisible_roomName = true;
				_t.getChargeByList();
			},
			// 编辑机房数据回显
			getEditRoom() {
				var _t = this;
				_t.$api.get('asset/serverRoom/' + _t.addRoomForm.id, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addRoomForm.roomName = res.data.name;
							_t.addRoomForm.roomNo = res.data.roomNo;
							_t.addRoomForm.centerId = res.data.centerId;
							_t.addRoomForm.floor = res.data.floor;
							_t.addRoomForm.powerCapacity = res.data.powerCapacity === null ? '' : res.data.powerCapacity.toString();
							_t.addRoomForm.powerUc = res.data.powerUc === null ? '' : res.data.powerUc.toString();
							_t.addRoomForm.current = res.data.current === null ? '' : res.data.current.toString();
							_t.addRoomForm.currentUc = res.data.currentUc === null ? '' : res.data.currentUc.toString();
							_t.addRoomForm.maxRow = res.data.maxRow === null ? '' : res.data.maxRow.toString();
							_t.addRoomForm.maxCol = res.data.maxCol === null ? '' : res.data.maxCol.toString();
							_t.addRoomForm.chargeByFirstId = res.data.chargeBy;
							_t.addRoomForm.chargeByFirst = res.data.chargeByName1;
							_t.addRoomForm.chargeBySecondId = res.data.chargeBy2;
							_t.addRoomForm.chargeBySecond = res.data.chargeByName2;
							break;
						default:
							break;
					}
				});
			},
			// 编辑机房 提交按钮
			editTheRoom(formName) {
				var _t = this;
				// 校验机房名称
				_t.blurRoomName();
				// 校验 负责人1 非空
				if (_t.addRoomForm.chargeByFirstId === '' || _t.addRoomForm.chargeByFirstId === null) {
					_t.errorTip.chargeByRoomFirstFlag = true;
					document.getElementById('roomForm_chargeByFirst').style.borderColor = '#fb6041';
				} else {
					_t.errorTip.chargeByRoomFirstFlag = false;
					document.getElementById('roomForm_chargeByFirst').style.borderColor = '#DCDFE6';
				}
				_t.$refs[formName].validate((valid) => {
					if (valid
						&& _t.errorTip.chargeByRoomFirstFlag === false
						&& _t.errorTip.roomNameFlag === false
						&& _t.errorTip.roomNoFlag === false) {
						_t.$api.put('asset/serverRoom/', {
							assetServerRoom: {
								id: _t.addRoomForm.id,
								name: _t.addRoomForm.roomName === null ? null : (_t.addRoomForm.roomName.trim() === '' ? null : _t.addRoomForm.roomName.trim()),
								roomNo: _t.addRoomForm.roomNo === null ? null : (_t.addRoomForm.roomNo.trim() === '' ? null : _t.addRoomForm.roomNo.trim()),
								centerId: _t.addRoomForm.centerId === null ? null : (_t.addRoomForm.centerId.trim() === '' ? null : _t.addRoomForm.centerId.trim()),
								floor: _t.addRoomForm.floor === null ? null : (_t.addRoomForm.floor.trim() === '' ? null : _t.addRoomForm.floor.trim()),
								powerCapacity: _t.addRoomForm.powerCapacity === null ? null : (_t.addRoomForm.powerCapacity.trim() === '' ? null : _t.addRoomForm.powerCapacity.trim()),
								powerUc: _t.addRoomForm.powerUc === null ? null : (_t.addRoomForm.powerUc.trim() === '' ? null : _t.addRoomForm.powerUc.trim()),
								current: _t.addRoomForm.current === null ? null : (_t.addRoomForm.current.trim() === '' ? null : _t.addRoomForm.current.trim()),
								currentUc: _t.addRoomForm.currentUc === null ? null : (_t.addRoomForm.currentUc.trim() === '' ? null : _t.addRoomForm.currentUc.trim()),
								maxRow: _t.addRoomForm.maxRow === null ? null : (_t.addRoomForm.maxRow.trim() === '' ? null : _t.addRoomForm.maxRow.trim()),
								maxCol: _t.addRoomForm.maxCol === null ? null : (_t.addRoomForm.maxCol.trim() === '' ? null : _t.addRoomForm.maxCol.trim()),
								chargeBy: _t.addRoomForm.chargeByFirstId === null ? null : (_t.addRoomForm.chargeByFirstId.trim() === '' ? null : _t.addRoomForm.chargeByFirstId.trim()),
								chargeBy2: _t.addRoomForm.chargeBySecondId === null ? null : (_t.addRoomForm.chargeBySecondId.trim() === '' ? null : _t.addRoomForm.chargeBySecondId.trim())
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.$alert(_t.$t('computerRoomManagement.dialogFormDataCenterSuccessTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									}).catch(()=>{
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									});
									break;
								case 2006: // 修改失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									}).catch(()=>{
										_t.getRoomListByDataCenter();
										_t.resetRoomForm();
									});
									break;
								case 2400: // 同一数据中心 下机房重复
									var verify = JSON.parse(res.message);
									// 机房名称重复
									if (verify.nameVerify && verify.nameVerify === '0') {
										_t.errorTip.roomNameFlag = true;
										_t.errorTip.roomNameTip = _t.$t('computerRoomManagement.ruleRoomName');
										document.getElementById('roomName').style.borderColor = '#fb6041';
									}
									// 机房编号重复
									if (verify.noVerify && verify.noVerify === '0') {
										_t.errorTip.roomNoFlag = true;
										_t.errorTip.roomNoTip= _t.$t('computerRoomManagement.ruleRoomNo');
										document.getElementById('roomNo').style.borderColor = '#fb6041';
									}
									break;
								default:
									_t.resetRoomForm();
									break;
							}
						});
					}
				});
			},
			// 删除机房 按钮
			deleteTheRoom(val) {
				var _t = this;
				_t.$confirm(_t.$t('computerRoomManagement.dialogFormRoomDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('asset/serverRoom/' + val.id, {}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('computerRoomManagement.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getRoomListByDataCenter();
								}).catch(()=>{
									_t.getRoomListByDataCenter();
								});
								break;
							case 2200: // 数据中心关联机房
								_t.$alert(_t.$t('computerRoomManagement.deleteRoom'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getRoomListByDataCenter();
								}).catch(()=>{
									_t.getRoomListByDataCenter();
								});
								break;
							default:
								break;
						}
						_t.dataCenterMenuShow = false; // 右键弹出层隐藏
					});
				}).catch(() => {
					return;
				});
			},
			// 重置机房表单
			resetRoomForm() {
				var _t = this;
				_t.ifDataCenter = false;
				_t.ifAddRoom = true;
				_t.dialogVisible_roomName = false;
				_t.addRoomForm.roomName = ''; // 机房名称
				_t.addRoomForm.roomNo = ''; // 机房编号
				_t.addRoomForm.centerId = ''; // 数据中心id
				_t.addRoomForm.floor = ''; // 位置
				_t.addRoomForm.powerCapacity = ''; // 电源容量
				_t.addRoomForm.powerUc = ''; // 电源阈值
				_t.addRoomForm.current = ''; // 电流
				_t.addRoomForm.currentUc = ''; // 电流阈值
				_t.addRoomForm.maxRow = ''; // 最大行数
				_t.addRoomForm.maxCol = ''; // 最大列数
				_t.addRoomForm.chargeByFirstId = ''; // 责任人1 id
				_t.addRoomForm.chargeByFirst = ''; // 责任人1
				_t.addRoomForm.chargeBySecondId = ''; // 责任人2 id
				_t.addRoomForm.chargeBySecond = ''; // 责任人2
				_t.errorTip.chargeByRoomFirstFlag = false;
				document.getElementById('roomForm_chargeByFirst').style.borderColor = '#DCDFE6';
				_t.$refs.roomForm.resetFields(); //移除校验结果并重置字段值
				// _t.$refs.roomForm.clearValidate(); //移除校验结果
				_t.errorTip.roomNameFlag = false;
				_t.errorTip.roomNameTip = '';
				_t.errorTip.roomNoFlag = false;
				_t.errorTip.roomNoTip = '';
				document.getElementById('roomName').style.borderColor = '#DCDFE6';
				document.getElementById('roomNo').style.borderColor = '#DCDFE6';
			},
			// 获取数据中心目录
			getDataCenter() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/dataCenter/all', {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null){
								_t.rootMenuData = res.data.list === null ? [] : res.data.list;
								// 默认取出第一个数据中心
								if (_t.rootMenuData.length !== 0) {
									_t.$store.commit('setLoading', true);
									_t.clickNodeDataCenter(_t.rootMenuData[0], 0);
								} else {
									_t.$store.commit('setLoading', false);
								}
							}
							break;
						default:
							_t.rootMenuData = [];
							break;
					}
				});
			},
			// 收缩
			clickInset() {
				var _t = this;
				_t.isShow = false;
				// 隐藏右键显示层
				_t.dataCenterMenuShow = false;
				document.getElementById('ComputerConfiguration-navBar-outSet').style.display = 'inline-block';
				document.getElementById('ComputerConfiguration_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				var _t = this;
				_t.isShow = true;
				document.getElementById('ComputerConfiguration-navBar-outSet').style.display = 'none';
				document.getElementById('ComputerConfiguration_right').style.left = this.leftOfRightView + "px";
			},
			//左右拖拽调整左侧的树的大小
			reSizeWin() {
				var _t = this;
				var inSet = document.getElementById("ComputerConfiguration-navBar-inSet");
				var left = document.getElementById("ComputerConfiguration_left");
				var resize = document.getElementById("ComputerConfiguration_resize-navBar");
				var right = document.getElementById("ComputerConfiguration_right");
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
			// 点击机房区域
			getRackInfo(item) {
				var _t = this;
				_t.$router.push({
					name: 'rackRoomDistribution', params: {
						roomId: item.id
					}
				});
				localStorage.setItem('hy-room-id', item.id);
			},
		},
		mounted() {
			var _t = this;
			//调整左侧树形区宽度
			_t.reSizeWin();
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getDataCenter();
		}
	}
</script>

<style scoped>
	.ComputerConfiguration_left {
		width: 174px;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		overflow: auto;
	}

	.ComputerConfiguration_left_head {
		line-height: 48px;
		font-size: 14px;
		overflow: hidden;
	}

	.ComputerConfiguration_left_head_click {
		cursor: pointer;
		display: inline-block;
		float: right;
		padding-right: 10px;
	}

	.ComputerConfiguration_left_main {
		line-height: 36px;
		text-align: left;
		font-size: 12px;
		cursor: pointer;
		padding-left: 20px;
	}

	.ComputerConfiguration_right {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}

	#ComputerConfiguration_resize-navBar {
		width: 2px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 172px;
		cursor: col-resize;
		z-index: 1002;
	}

	#ComputerConfiguration-navBar-inSet,
	#ComputerConfiguration-navBar-outSet {
		height: 40px;
		width: 14px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}

	#ComputerConfiguration-navBar-inSet {
		left: 214px;
		border-radius: 15px 0 0 15px;
	}

	#ComputerConfiguration-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}

	.ComputerConfiguration_right_head_isNull {
		margin-top: 50px;
		font-size: 18px;
		text-align: center;
		position: absolute;
		top: 45%;
		left: 0;
		right: 0;
		bottom: 0;
	}

	#dataCenterMenu {
		position: fixed;
		top: 0;
		left: 0;
	}

	.ComputerConfiguration_textNote {
		width: 540px;
		display: block;
	}

	.ComputerConfiguration_roomList {
		display: flex;
		align-items: stretch;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.ComputerConfiguration_roomList li {
		width: 416px;
		height: 298px;
		padding-right: 18px;
		margin-bottom: 20px;
		cursor: pointer;
	}

	.ComputerConfiguration_roomList_imgBox {
		width: 100%;
		height: 198px;
		overflow: hidden;
		position: relative;
	}

	.ComputerConfiguration_roomList_imgBox > img.imgBg {
		width: 100%;
	}

	.ComputerConfiguration_contentPadding {
		padding: 20px 0 20px 20px;
	}

	.ComputerConfiguration_roomList_textBox {
		padding: 20px 20px 10px;
	}

	.ComputerConfiguration_roomList_contentTop {
		display: flex;
		flex-wrap: nowrap;
		align-items: stretch;
		justify-content: space-between;
	}

	.textOverHidden {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 30px;
		line-height: 30px;
	}

	.ComputerConfiguration_roomList_imgText {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.ComputerConfiguration_roomList_imgNum {
		font-size: 48px;
		line-height: 48px;
	}
</style>
<style>
	.ComputerRoomManagement_dialog .el-dialog {
		width: 750px;
		height: 450px;
	}

	.NewDataCenter_dialog .el-dialog {
		width: 750px;
		height: 450px;
	}

	.group_append .el-input-group__append {
		border: none;
		padding: 0 10px;
	}

	.computerRoomManagementImport-dialog .el-dialog {
		width: 500px;
		height: 300px;
	}

	.ComShowExcelContent-dialog .el-dialog {
		width: 950px;
		height: 550px;
	}

	.ComShowExcelContent-dialog .el-dialog__body {
		padding: 0px;
		max-height: 455px;
		z-index: 10000;
	}

	.ComShowExcelContent-dialog .excelAnalyzeResult tr td,
	.ComShowExcelContent-dialog .excelAnalyzeResult thead tr th {
		height: 35px !important;
		line-height: 35px !important;
	}
</style>
