<template>
	<div class="edit-tabs-box">
		<el-tabs
			v-if="isShowTabBoxTitle"
			v-model="editableTabsValue"
			type="card"
			class="whiteBg"
			id="tabs-Box-tabs"
			tab-position="bottom"
			closable
			@tab-click="clickTabs"
			@tab-remove="removeTab">
			<!--底部设备页签-->
			<el-tab-pane
				:key="item.name"
				stretch
				v-for="(item, index) in editableTabs"
				:name="item.name"
				:label="item.title">
				<div class="administration-btn">
					<!--收起-->
					<span @click="packUp" class="iconfont cursorPointer" :title="$t('public.packUp')">&#xe686;</span>
					<!--关闭弹出层-->
					<span @click="closeTab" class="iconfont cursorPointer" :title="$t('public.close')">&#xe687;</span>
				</div>
				<!--头部关闭按钮-->
				<div class="administration-allBtn">
					<!--关闭弹出层-->
					<span @click="closeTab" class="iconfont cursorPointer" :title="$t('public.close')">&#xe687;</span>
				</div>
				<!--标签页内容区域-->
				<div v-if="isShowTabBox" class="administration-box">
					<!--设备信息-->
					<div class="equipmentDetail-info-box">
						<div class="grayBg administration-title"><strong>{{$t('editAdministrationTabs.equipmentInfo')}}</strong>
						</div>
						<!--设备基本信息-->
						<el-form label-width="96px" label-position="right" class="administration-info-box">
							<el-form-item v-for="(item,index) in equipmentInfoList" :key="index" :label="item.label + '：'"
														:title="item.value">
								{{item.value}}
							</el-form-item>
						</el-form>
						<div class="grayBg administration-title">
							<strong>{{$t('editAdministrationTabs.equipmentAllStatus')}}</strong>
						</div>
						<!--设备整体状态-->
						<el-form label-width="96px" label-position="right" class="administration-info-box">
							<el-form-item v-for="(item,index) in equipmentAllStatus" :key="index" :label="item.name + '：'"
														:title="item.status">
								<span
									:class="item.level == '33' ? 'iconfontSuccess' :(item.level == '66' ? 'iconfontWarn':(item.level == '99' ? 'iconfontError':''))">{{item.status}}</span>
							</el-form-item>
						</el-form>
					</div>
					<!--内部标签页-->
					<el-tabs
						v-model="activeNameTabs"
						@tab-click="clickTabsTopTitle"
						class="monitoringDetails-header"
						type="card">
						<!--基本信息-->
						<el-tab-pane :label="$t('editAdministrationTabs.baseInfoMessage')" name="one" v-loading="baseInfo_loading">
							<el-form :model="formBaseInfo" label-width="120px">
								<p class="titleBgBox grayBg">{{$t('editAdministrationTabs.formBaseInfoEquipmentTitle')}}</p>
								<!--基本信息表单分左右-->
								<el-row class="paddingRight-20">
									<el-col :span="12">
										<!--带外IP-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formBaseInfoIp') + '：'">
											<el-input @blur="blurRuleBaseInfoIp(formBaseInfo.ip)" v-model="formBaseInfo.ip"
																class="inputMaxWidth"/>
											<span class="isNotNull" v-if="errorBaseInfoError.ipFlag">{{errorBaseInfoError.ipFlagTip}}</span>
										</el-form-item>
										<!--序列号-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formBaseInfoSerialNumber') + '：'">
											<el-input
												@blur="blurIsNotNull(formBaseInfo.servicetag,errorBaseInfoError,'serviceTagFlag')"
												v-model="formBaseInfo.servicetag"
												class="inputMaxWidth"/>
											<span class="isNotNull" v-if="errorBaseInfoError.serviceTagFlag">{{errorBaseInfoError.serviceTagFlagTip}}</span>
										</el-form-item>
										<!--用户名-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoUserName') + '：'">
											<el-input v-model="formBaseInfo.username" class="inputMaxWidth"/>
										</el-form-item>
										<!--厂商-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formBaseInfoManufacturer') + '：'">
											<el-select
												v-model="formBaseInfo.manufacturer"
												class="inputMaxWidth selectBlock"
												clearable
												@change="changeManufacturer(formBaseInfo.manufacturer,errorBaseInfoError,'manufacturerFlag')"
												:placeholder="$t('editAdministrationTabs.formBaseInfoSelectManufacturer')">
												<el-option v-for="(item,index) in manufacturerList" :key="index" :label="item" :value="item"/>
											</el-select>
											<span class="isNotNull" v-if="errorBaseInfoError.manufacturerFlag">{{errorBaseInfoError.manufacturerFlagTip}}</span>
										</el-form-item>
										<!--外形结构-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoType') + '：'">
											<el-input v-model="formBaseInfo.shapeStructure" :disabled="true" class="inputMaxWidth"/>
										</el-form-item>
										<!--设备责任人-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoChargeByFirst') + '：'">
											<el-popover
												trigger="click"
												placement="bottom-start"
												v-model="isShowPopoverChargeBy"
												ref="popover">
												<el-tree
													class="inputMaxWidth"
													:data="chargeByList"
													node-key="nodeId"
													ref="equipmentTree"
													highlight-current
													@node-click="clickChargeByFirst"
													:props="defaultProps"/>
												<el-input
													v-model="formBaseInfo.chargeByName"
													class="inputMaxWidth"
													:placeholder="$t('editAdministrationTabs.formBaseInfoSelectChargeBy')"
													suffix-icon="el-icon-arrow-down"
													readonly
													slot="reference"/>
											</el-popover>
										</el-form-item>
										<!--备注-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoNote') + '：'">
											<el-input v-model="formBaseInfo.description" type="textarea" class="inputMaxWidth"/>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<!--操作系统-->
										<el-form-item v-if="formBaseInfo.type == 1 || formBaseInfo.type == 4"
																	:label="$t('editAdministrationTabs.formBaseInfoOperatingSystem') + '：'">
											<el-input v-model="formBaseInfo.os" class="inputMaxWidth"/>
										</el-form-item>
										<!--操作系统在 type1或者 4时展示 否则不显示 此处用于不显示时的占位-->
										<el-form-item v-else>
											<el-input style="visibility: hidden;" class="inputMaxWidth"/>
										</el-form-item>
										<!--设备名称-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoDeviceName') + '：'">
											<el-input v-model="formBaseInfo.deviceName" class="inputMaxWidth"/>
										</el-form-item>
										<!--密码-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoPassword') + '：'">
											<el-input v-model="formBaseInfo.password" type="password" class="inputMaxWidth"/>
										</el-form-item>
										<!--型号-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formBaseInfoModel') + '：'">
											<el-select
												v-model="formBaseInfo.model"
												class="inputMaxWidth selectBlock"
												clearable
												@change="changeModel(formBaseInfo.model,modelList,errorBaseInfoError,'modelFlag')"
												:placeholder="$t('editAdministrationTabs.formBaseInfoSelectModel')">
												<el-option v-for="(item,index) in modelList" :key="index" :label="item.model"
																	 :value="item.model"/>
											</el-select>
											<span class="isNotNull"
														v-if="errorBaseInfoError.modelFlag">{{errorBaseInfoError.modelFlagTip}}</span>
										</el-form-item>
										<!--U数-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoUNum') + '：'">
											<el-input :disabled="true" v-model="formBaseInfo.uCount" class="inputMaxWidth"/>
										</el-form-item>
										<!--业务责任人-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoBusinessFirst') + '：'">
											<el-popover
												trigger="click"
												placement="bottom-start"
												v-model="isShowPopoverBusinessChargeBy"
												ref="popover">
												<el-tree
													class="inputMaxWidth"
													:data="chargeByList"
													ref="businessTree"
													node-key="nodeId"
													highlight-current
													@node-click="clickBusinessChargeByFirst"
													:props="defaultProps"/>
												<el-input
													v-model="formBaseInfo.businessChargeByName"
													class="inputMaxWidth"
													:placeholder="$t('editAdministrationTabs.formBaseInfoSelectChargeBy')"
													suffix-icon="el-icon-arrow-down"
													readonly
													slot="reference"/>
											</el-popover>
										</el-form-item>
										<!--关联业务-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoBusiness') + '：'">
											<div style="display: flex;">
												<el-input readonly v-model="formBaseInfo.businessId" class="inputMaxWidthBusiness"
																	style="flex: 1"/>
												<el-button @click="selectBusinessBtn" type="primary" size="small" class="queryBtn"
																	 style="margin-left: 10px;">
													<span>{{$t('editAdministrationTabs.formBaseInfoSelectBusiness')}}</span>
												</el-button>
											</div>
										</el-form-item>
									</el-col>
								</el-row>
								<p class="titleBgBox grayBg">{{$t('editAdministrationTabs.formBaseInfoEquipmentLocation')}}</p>
								<el-row class="paddingRight-20">
									<el-col :span="12">
										<!--所在机房-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoRoom') + '：'">
											<el-select
												v-model="formBaseInfo.roomId"
												class="inputMaxWidth selectBlock selectGroupList"
												clearable
												@change="changeRoomList(formBaseInfo.roomId,true)"
												:placeholder="$t('editAdministrationTabs.formBaseInfoSelectRoom')">
												<el-option-group
													v-for="(data,i) in roomList"
													:label="data.name"
													:key="i">
													<el-option v-for="(item,index) in data.centerRooms" :key="index" :label="item.name"
																		 :value="item.id"/>
												</el-option-group>
											</el-select>
											<span class="isNotNull"
														v-if="errorBaseInfoError.roomFlag">{{errorBaseInfoError.roomFlagTip}}</span>
										</el-form-item>
										<!--机架位置-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoRackLocation') + '：'">
											<el-select clearable @change="ruleRackLocation(formBaseInfo.rackPosition,true)"
																 v-model="formBaseInfo.rackPosition" class="inputMaxWidth selectBlock">
												<el-option v-for="(item,i) in uCount" :key="i" :label="(i+1) + 'U'" :value="(i+1)"/>
											</el-select>
											<span class="isNotNull" v-if="errorBaseInfoError.rackPositionFlag">{{errorBaseInfoError.rackPositionFlagTip}}</span>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<!--所在机架-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoRack') + '：'">
											<el-select @change="changeRackList(formBaseInfo.rackId)" v-model="formBaseInfo.rackId"
																 class="inputMaxWidth selectBlock" clearable
																 :placeholder="$t('editAdministrationTabs.formBaseInfoSelectRack')">
												<el-option v-for="(item,index) in rackList" :key="index" :label="item.name" :value="item.id"/>
											</el-select>
											<span class="isNotNull"
														v-if="errorBaseInfoError.rackFlag">{{errorBaseInfoError.rackFlagTip}}</span>
										</el-form-item>
										<!--位置描述-->
										<el-form-item :label="$t('editAdministrationTabs.formBaseInfoLocationDescription') + '：'">
											<el-input v-model="formBaseInfo.positionDesc" class="inputMaxWidth"/>
										</el-form-item>
									</el-col>
								</el-row>
								<!--按钮-->
								<el-form-item class="textAlignCenter" label-width="0">
									<el-button type="primary" class="alertBtn" @click="saveBaseInfoData">
										{{$t('public.save')}}
									</el-button>
								</el-form-item>
								<!--隐藏树勿删 根据业务id去树上找到对应节点 避免使用递归-->
								<el-tree
									style="display: none;"
									:data="businessTreeData"
									node-key="nodeId"
									ref="businessTreeOut"
									highlight-current
									show-checkbox
									:check-strictly="true"
									:default-expanded-keys="defaultExpandedKeys"
									:props="defaultProps"/>
							</el-form>
						</el-tab-pane>
						<!--硬件配置-->
						<el-tab-pane :label="$t('editAdministrationTabs.hardwareTitle')" name="two">
							<el-tabs v-model="activeHardWareName" class="hardWare-tabsBox" tab-position="left"
											 v-loading="hardware_loading">
								<!--处理器-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareCpuTab')" name="cpuCard">
									<div v-for="(item,index) in hardWareCpuList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareCpuTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteCPUMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareCpuName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareCPU_')" v-model="item.name" class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuFrequency') + '：'">
												<el-input v-model="item.frequency" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuIndex') + '：'">
												<el-input v-model="item.cpuIndex" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareCpuSerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveCPUList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addCPUList">{{$t('public.addData')}}</el-button>
									</div>
								</el-tab-pane>
								<!--内存-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareMemoryTab')" name="memory">
									<div v-for="(item,index) in hardWareMemoryList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareMemoryTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteMemoryMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareMemoryName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareMemory_')" v-model="item.name"
																	class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryFrequency') + '：'">
												<el-input v-model="item.frequency" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemorySize') + '：'">
												<el-input v-model="item.size" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemorySerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryVersion') + '：'">
												<el-input v-model="item.firmwareVersion" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareMemoryIndex') + '：'">
												<el-input v-model="item.memoryIndex" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveMemoryList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addMemoryList">{{$t('public.addData')}}
										</el-button>
									</div>
								</el-tab-pane>
								<!--磁盘-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareDiskTab')" name="disk">
									<div v-for="(item,index) in hardWareDiskList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareDiskTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteDiskMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareDiskName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareDisk_')" v-model="item.name" class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskBusType') + '：'">
												<el-input v-model="item.bus" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskMedia') + '：'">
												<el-input v-model="item.media" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskSize') + '：'">
												<el-input v-model="item.size" class="width200 group_append"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskSerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskSpeed') + '：'">
												<el-input v-model="item.speed" class="width200 group_append">
													<div slot="append">RPM</div>
												</el-input>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskIndex') + '：'">
												<el-input v-model="item.diskIndex" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskFormFactor') + '：'">
												<el-input v-model="item.formfactor" class="width200 group_append">
													<div slot="append">Inch</div>
												</el-input>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareDiskVersion') + '：'">
												<el-input v-model="item.firmwareVersion" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveDiskList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addDiskList">{{$t('public.addData')}}</el-button>
									</div>
								</el-tab-pane>
								<!--电源-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareSupplyTab')" name="Supply">
									<div v-for="(item,index) in hardWareSupplyList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareSupplyTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteSupplyMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareSupplyTitle') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareSupply_')" v-model="item.name"
																	class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyType') + '：'">
												<el-input v-model="item.supplyType" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyPower') + '：'">
												<el-input v-model="item.outputPower" class="width200 group_append">
													<div slot="append">W</div>
												</el-input>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplySerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyVersion') + '：'">
												<el-input v-model="item.firmwareVersion" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareSupplyIndex') + '：'">
												<el-input v-model="item.supplyIndex" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveSupplyList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addSupplyList">{{$t('public.addData')}}
										</el-button>
									</div>
								</el-tab-pane>
								<!--网卡-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareNicTab')" name="nic">
									<div v-for="(item,index) in hardWareNicList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareNicTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteNicMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareNicName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareNic_')" v-model="item.name" class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicIP') + '：'">
												<el-input @blur="blurHardWareIP(item,'hardWareNicIp_')" v-model="item.ip" class="width200"/>
												<span class="isNotNull" v-if="item.ipFlag">{{$t('public.ipFormatTip')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicMac') + '：'">
												<el-input v-model="item.mac" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicSerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicSpeed') + '：'">
												<el-input v-model="item.speed" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicVersion') + '：'">
												<el-input v-model="item.firmwareVersion" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareNicIndex') + '：'">
												<el-input v-model="item.nicIndex" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveNicList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addNicList">{{$t('public.addData')}}
										</el-button>
									</div>
								</el-tab-pane>
								<!--阵列卡-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareRaidTab')" name="raid">
									<div v-for="(item,index) in hardWareRaidList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareRaidTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteRaidMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareRaidName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareRaid_')" v-model="item.name" class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidModel') + '：'">
												<el-input v-model="item.model" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidCacheSize') + '：'">
												<el-input v-model="item.cacheSize" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidSpeed') + '：'">
												<el-input v-model="item.speed" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidManufacturer') + '：'">
												<el-input v-model="item.manufacturer" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidSerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidVersion') + '：'">
												<el-input v-model="item.firmwareVersion" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareRaidIndex') + '：'">
												<el-input v-model="item.raidIndex" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveRaidList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addRaidList">{{$t('public.addData')}}
										</el-button>
									</div>
								</el-tab-pane>
								<!--风扇-->
								<el-tab-pane :label="$t('editAdministrationTabs.formHardwareFanTab')" name="fan">
									<div v-for="(item,index) in hardWareFanList" :key="item.id" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formHardwareFanTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteFanMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form inline label-width="96px">
											<el-form-item class="star" :label="$t('editAdministrationTabs.formHardwareFanName') + '：'">
												<el-input @blur="blurHardWareName(item,'hardWareFan_')" v-model="item.name" class="width200"/>
												<span class="isNotNull" v-if="item.nameFlag">{{$t('public.isNotNull')}}</span>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareFanPartNumber') + '：'">
												<el-input v-model="item.partNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareFanSerialNumber') + '：'">
												<el-input v-model="item.serialNumber" class="width200"/>
											</el-form-item>
											<el-form-item :label="$t('editAdministrationTabs.formHardwareFanIndex') + '：'">
												<el-input v-model="item.fanIndex" class="width200"/>
											</el-form-item>
										</el-form>
									</div>
									<div class="textAlignCenter marginTop20 marBottom50">
										<el-button type="primary" class="alertBtn" @click="saveFanList">{{$t('public.save')}}</el-button>
										<el-button type="primary" class="alertBtn" @click="addFanList">{{$t('public.addData')}}
										</el-button>
									</div>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
						<!--网络配置-->
						<el-tab-pane :label="$t('editAdministrationTabs.networkTitle')" name="three" v-loading="network_loading">
							<div class="paddingTop10">
								<!--带外网信息-->
								<div v-if="netWorkAssetDevice.type === 1 || netWorkAssetDevice.type === 4">
									<div class="grayBg clearfix networkTitleBox">
										<span class="fl">{{$t('editAdministrationTabs.formNetworkOOBTitle')}}</span>
										<el-button class="fr" type="primary" @click="addNetworkOOB">
											<i class="el-icon-plus"></i>
											<span>{{$t('editAdministrationTabs.formNetworkOOBAdd')}}</span>
										</el-button>
									</div>
									<!--带外IP-->
									<div v-for="(item,index) in networkOOBIpList" :key="index" class="hardWareCpu_hoverBox">
										<div class="middle hardWareCpuBox">
											<span class="title">{{$t('editAdministrationTabs.formNetworkOOBIpTitle')}} {{index + 1}}</span>
											<span class="line"></span>
											<el-button type="danger" @click="deleteOOBMap(index)">
												<span class="el-icon-delete"></span>
											</el-button>
										</div>
										<el-form label-width="90px">
											<el-row>
												<!--第一列-->
												<el-col :span="6">
													<!--带外网IP-->
													<el-form-item class="star" :label="$t('editAdministrationTabs.formNetworkOOBIp') + '：'">
														<el-input @blur="blurNetworkOOBRule(item)" v-model="item.ip" class="inputMaxWidth240"/>
														<span class="isNotNull" v-if="item.ipFlag">{{item.ipFlagTip}}</span>
													</el-form-item>
													<!--交换机-->
													<el-form-item :label="$t('editAdministrationTabs.formNetworkOOBInterChanger') + '：'">
														<el-select v-model="item.ethernetSwitch" class="inputMaxWidth240 selectBlock">
															<el-option v-for="(i) in networkSwitchList" :key="i.id" :label="i.deviceNameWithIP"
																				 :value="i.id"/>
														</el-select>
													</el-form-item>
												</el-col>
												<!--第二列-->
												<el-col :span="6">
													<!--子网掩码-->
													<el-form-item :label="$t('editAdministrationTabs.formNetworkOOBIpSubnetMask') + '：'">
														<el-input @blur="blurNetWorkIP(item,'netmask')" v-model="item.netmask"
																			class="inputMaxWidth240"/>
														<span class="isNotNull" v-if="item.netmaskFlag">{{$t('public.ipFormatTip')}}</span>
													</el-form-item>
													<!--对应端口-->
													<el-form-item :label="$t('editAdministrationTabs.formNetworkOOBPort') + '：'">
														<el-input @blur="blurNetWorkPort(item,'swithPort')" v-model="item.swithPort"
																			class="inputMaxWidth240"/>
														<span class="isNotNull" v-if="item.swithPortFlag">{{$t('public.formatTip')}}</span>
													</el-form-item>
												</el-col>
												<!--第三列-->
												<el-col :span="6">
													<!--网关-->
													<el-form-item :label="$t('editAdministrationTabs.formNetworkOOBGateWay') + '：'">
														<el-input @blur="blurNetWorkIP(item,'gateway')" v-model="item.gateway"
																			class="inputMaxWidth240"/>
														<span class="isNotNull" v-if="item.gatewayFlag">{{$t('public.ipFormatTip')}}</span>
													</el-form-item>
												</el-col>
												<!--第四列-->
												<el-col :span="6">
													<!--MAC地址-->
													<el-form-item :label="$t('editAdministrationTabs.formNetworkOOBMAC') + '：'">
														<el-input @blur="blurNetworkMac(item,'mac')" v-model="item.mac" class="inputMaxWidth240"/>
														<span class="isNotNull" v-if="item.macFlag">{{$t('public.formatTip')}}</span>
													</el-form-item>
												</el-col>
											</el-row>
										</el-form>
									</div>
								</div>
								<!--生产IP信息-->
								<div class="grayBg clearfix networkTitleBox">
									<span class="fl">{{$t('editAdministrationTabs.formNetworkProductionIpTitle')}}</span>
									<el-button class="fr" type="primary" @click="addNetWorkProduction">
										<i class="el-icon-plus"></i>
										<span>{{$t('editAdministrationTabs.formNetworkOOBAdd')}}</span>
									</el-button>
								</div>
								<!--生产IP-->
								<div v-for="(item,index) in networkProductionIPList" :key="item.id" class="hardWareCpu_hoverBox">
									<div class="middle hardWareCpuBox">
										<span class="title">{{$t('editAdministrationTabs.formNetworkProductionTitle')}} {{index + 1}}</span>
										<span class="line"></span>
										<el-button type="danger" @click="deleteProductionMap(index)">
											<span class="el-icon-delete"></span>
										</el-button>
									</div>
									<el-form label-width="90px">
										<el-row>
											<!--第一列-->
											<el-col :span="6">
												<!--生产IP-->
												<el-form-item class="star" :label="$t('editAdministrationTabs.formNetworkProductionIp') + '：'">
													<el-input @blur="blurNetworkOOBRule(item)" v-model="item.ip" class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.ipFlag">{{item.ipFlagTip}}</span>
												</el-form-item>
												<!--操作系统-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionOS') + '：'">
													<el-input v-model="item.os" class="inputMaxWidth240"/>
												</el-form-item>
												<!--连接方式-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionConnectWay') + '：'">
													<el-select v-model="item.remoteType" class="inputMaxWidth240 selectBlock">
														<el-option v-for="(k,j) in netWorkRemoteTypeList" :key="j" :label="k" :value="k"/>
													</el-select>
												</el-form-item>
												<!--交换机-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionInterChanger') + '：'">
													<el-select v-model="item.ethernetSwitch" class="inputMaxWidth240 selectBlock">
														<el-option v-for="(i) in networkSwitchList" :key="i.id" :label="i.deviceNameWithIP"
																			 :value="i.id"/>
													</el-select>
												</el-form-item>
											</el-col>
											<!--第二列-->
											<el-col :span="6">
												<!--子网掩码-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionSubnetMask') + '：'">
													<el-input @blur="blurNetWorkIP(item,'netmask')" v-model="item.netmask"
																		class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.netmaskFlag">{{$t('public.ipFormatTip')}}</span>
												</el-form-item>
												<!--用户名-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionUserName') + '：'">
													<el-input v-model="item.remoteUsername" class="inputMaxWidth240"/>
												</el-form-item>
												<!--端口-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionPort') + '：'">
													<el-input @blur="blurNetWorkPort(item,'remotePort')" v-model="item.remotePort"
																		class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.remotePortFlag">{{$t('public.formatTip')}}</span>
												</el-form-item>
												<!--对应端口-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionThatPort') + '：'">
													<el-input @blur="blurNetWorkPort(item,'swithPort')" v-model="item.swithPort"
																		class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.swithPortFlag">{{$t('public.formatTip')}}</span>
												</el-form-item>
											</el-col>
											<!--第三列-->
											<el-col :span="6">
												<!--网关-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionGateWay') + '：'">
													<el-input @blur="blurNetWorkIP(item,'gateway')" v-model="item.gateway"
																		class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.gatewayFlag">{{$t('public.ipFormatTip')}}</span>
												</el-form-item>
												<!--密码-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionPassword') + '：'">
													<el-input v-model="item.remotePassword" type="password" class="inputMaxWidth240"/>
												</el-form-item>
											</el-col>
											<!--第四列-->
											<el-col :span="6">
												<!--MAC地址-->
												<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionMAC') + '：'">
													<el-input @blur="blurNetworkMac(item,'mac')" v-model="item.mac" class="inputMaxWidth240"/>
													<span class="isNotNull" v-if="item.macFlag">{{$t('public.formatTip')}}</span>
												</el-form-item>
											</el-col>
										</el-row>
									</el-form>
								</div>
								<!--光纤交换机-->
								<div class="grayBg networkTitleBox">
									<span>{{$t('editAdministrationTabs.formNetworkProductionFiber')}}</span>
								</div>
								<!--光纤交换机表单-->
								<el-form label-width="90px" v-model="networkSwitchListMap">
									<div class="middle hardWareCpuBox">
										<span class="title">{{$t('editAdministrationTabs.formNetworkProductionFiberMain')}}</span>
									</div>
									<el-row>
										<el-col :span="6">
											<!--HBA卡名-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionHBA') + '：'">
												<el-input v-model="networkSwitchListMap.name" class="inputMaxWidth240"/>
											</el-form-item>
											<!--交换机-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberName') + '：'">
												<el-select v-model="networkSwitchListMap.fcSwitch" class="inputMaxWidth240 selectBlock">
													<el-option v-for="(i) in networkSwitchList" :key="i.id" :label="i.deviceNameWithIP"
																		 :value="i.id"/>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<!--wwnn-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberWWNN') + '：'">
												<el-input v-model="networkSwitchListMap.wwnn" class="inputMaxWidth240"/>
											</el-form-item>
											<!--端口-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberPort') + '：'">
												<el-input @blur="blurNetWorkPort(networkSwitchListMap,'switchPort')"
																	v-model="networkSwitchListMap.switchPort" class="inputMaxWidth240"/>
												<span class="isNotNull"
															v-if="networkSwitchListMap.switchPortFlag">{{$t('public.formatTip')}}</span>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<!--wwpn-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberWWPN') + '：'">
												<el-input v-model="networkSwitchListMap.wwpn" class="inputMaxWidth240"/>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
								<el-form label-width="90px" v-model="networkSwitchItemMap">
									<div class="middle hardWareCpuBox">
										<span class="title">{{$t('editAdministrationTabs.formNetworkProductionFiberReady')}}</span>
									</div>
									<el-row>
										<el-col :span="6">
											<!--HBA卡名-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionHBA') + '：'">
												<el-input v-model="networkSwitchItemMap.name" class="inputMaxWidth240"/>
											</el-form-item>
											<!--交换机-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberName') + '：'">
												<el-select v-model="networkSwitchItemMap.fcSwitch" class="inputMaxWidth240 selectBlock">
													<el-option v-for="(i) in networkSwitchList" :key="i.id" :label="i.deviceNameWithIP"
																		 :value="i.id"/>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<!--wwnn-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberWWNN') + '：'">
												<el-input v-model="networkSwitchItemMap.wwnn" class="inputMaxWidth240"/>
											</el-form-item>
											<!--端口-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberPort') + '：'">
												<el-input @blur="blurNetWorkPort(networkSwitchItemMap,'switchPort')"
																	v-model="networkSwitchItemMap.switchPort" class="inputMaxWidth240"/>
												<span class="isNotNull"
															v-if="networkSwitchItemMap.switchPortFlag">{{$t('public.formatTip')}}</span>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<!--wwpn-->
											<el-form-item :label="$t('editAdministrationTabs.formNetworkProductionFiberWWPN') + '：'">
												<el-input v-model="networkSwitchItemMap.wwpn" class="inputMaxWidth240"/>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
								<!--按钮-->
								<div class="textAlignCenter marginTop20 marBottom50">
									<el-button type="primary" class="alertBtn" @click="saveNetWorkList">{{$t('public.save')}}</el-button>
								</div>
							</div>
						</el-tab-pane>
						<!--采购与维保-->
						<el-tab-pane :label="$t('editAdministrationTabs.maintenanceTitle')" name="four"
												 v-loading="maintenance_loading">
							<el-form label-width="96px" :model="maintenanceFormMap">
								<p class="titleBgBox grayBg">{{$t('editAdministrationTabs.formMaintenanceTitleFirst')}}</p>
								<el-row>
									<el-col :span="12">
										<!--维保类型-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formMaintenanceType') + '：'">
											<el-select
												v-model="maintenanceFormMap.warrantyType"
												clearable
												@change="changeSelectWarrantyType(maintenanceFormMap.warrantyType)"
												class="inputMaxWidth selectBlock">
												<el-option
													v-for="(item,index) in maintenanceForm"
													:key="index"
													:label="item.label"
													:value="item.value"/>
											</el-select>
											<span class="isNotNull" v-if="errorMaintenanceError.warrantyTypeFlag">{{errorMaintenanceError.warrantyTypeFlagTip}}</span>
										</el-form-item>
										<!--开始日期-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formMaintenanceStartTime') + '：'">
											<el-date-picker
												v-model="maintenanceFormMap.startTime"
												class="inputMaxWidth" type="date"
												@change="changeStartTime(maintenanceFormMap.startTime,maintenanceFormMap.endTime)"
												:placeholder="$t('editAdministrationTabs.formMaintenanceSelectPlaceholder')"/>
											<span class="isNotNull" v-if="errorMaintenanceError.startTimeFlag">{{errorMaintenanceError.startTimeFlagTip}}</span>
										</el-form-item>
										<!--维保期限-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceTimeLength') + '：'">
											<el-input :disabled="true" v-model="maintenanceFormMap.timeLength"
																class="inputMaxWidth group_append">
												<div slot="append">{{$t('editAdministrationTabs.formMaintenanceMonth')}}</div>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<!--维保商-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceUser') + '：'">
											<el-input v-model="maintenanceFormMap.serviceAgent" class="inputMaxWidth"/>
										</el-form-item>
										<!--结束日期-->
										<el-form-item class="star" :label="$t('editAdministrationTabs.formMaintenanceEndTime') + '：'">
											<el-date-picker
												v-model="maintenanceFormMap.endTime"
												class="inputMaxWidth" type="date"
												@change="changeEndTime(maintenanceFormMap.startTime,maintenanceFormMap.endTime)"
												:placeholder="$t('editAdministrationTabs.formMaintenanceSelectPlaceholder')"/>
											<span class="isNotNull" v-if="errorMaintenanceError.endTimeFlag">{{errorMaintenanceError.endTimeFlagTip}}</span>
										</el-form-item>
										<!--出厂日期-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceFactorTime') + '：'">
											<el-date-picker v-model="maintenanceFormMap.factorTime" class="inputMaxWidth" type="date"
																			:placeholder="$t('editAdministrationTabs.formMaintenanceSelectPlaceholder')"/>
										</el-form-item>
									</el-col>
								</el-row>
								<!--维保服务 暂时隐藏-->
								<!--								<el-form-item :label="$t('editAdministrationTabs.formMaintenanceServer') + '：'">-->
								<!--									&lt;!&ndash;边框&ndash;&gt;-->
								<!--									<div class="FormBorderColor">-->
								<!--										&lt;!&ndash;表单头部&ndash;&gt;-->
								<!--										<el-row>-->
								<!--											<el-col :span="12">-->
								<!--												<span class="iconfontPrimary">{{$t('editAdministrationTabs.formMaintenanceSelected')}}</span>-->
								<!--											</el-col>-->
								<!--											<el-col :span="6">-->
								<!--												<span class="iconfontPrimary">{{$t('editAdministrationTabs.formMaintenanceObject')}}</span>-->
								<!--											</el-col>-->
								<!--											<el-col :span="6">-->
								<!--												<span class="iconfontPrimary">{{$t('editAdministrationTabs.formMaintenanceLastEndTime')}}</span>-->
								<!--											</el-col>-->
								<!--										</el-row>-->
								<!--										&lt;!&ndash;表单内容区域&ndash;&gt;-->
								<!--										<el-row>-->
								<!--											<el-col :span="12">-->
								<!--												<span class="iconfontPrimary">-->
								<!--													<el-checkbox></el-checkbox>-->
								<!--												</span>-->
								<!--											</el-col>-->
								<!--											<el-col :span="6">-->
								<!--												<span>整机</span>-->
								<!--											</el-col>-->
								<!--											<el-col :span="6">-->
								<!--												<el-date-picker class="inputMaxWidth" type="date" :placeholder="$t('editAdministrationTabs.formMaintenanceSelectPlaceholder')" />-->
								<!--											</el-col>-->
								<!--										</el-row>-->
								<!--									</div>-->
								<!--								</el-form-item>-->
								<div class="grayBg clearfix network_TitleBox">
									<p class="fl">{{$t('editAdministrationTabs.formMaintenanceTitleSecond')}}</p>
									<!--按钮 暂时隐藏-->
									<!--
                                  <div class="fr">
                                      <el-button type="primary">{{$t('editAdministrationTabs.formMaintenanceSelectOrder')}}</el-button>
                                      <el-button type="primary">{{$t('editAdministrationTabs.formMaintenanceClear')}}</el-button>
                                  </div>
                                  -->
								</div>
								<el-row>
									<el-col :span="12">
										<!--订单编号-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceOrderNum') + '：'">
											<el-input v-model="maintenanceFormMap.orderNum" class="inputMaxWidth"/>
										</el-form-item>
										<!--供应商-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceSupplier') + '：'">
											<el-input v-model="maintenanceFormMap.purchaseSupply" class="inputMaxWidth"/>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<!--采购金额-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenancePurchaseAmount') + '：'">
											<el-input @blur="blurMoneyRule(maintenanceFormMap.purchasePrice)"
																v-model="maintenanceFormMap.purchasePrice" class="inputMaxWidth"/>
											<span class="isNotNull" v-if="errorMaintenanceError.purchasePriceFlag">{{errorMaintenanceError.purchasePriceFlagTip}}</span>
										</el-form-item>
										<!--订单名称-->
										<!--										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceOrderName') + '：'">-->
										<!--											<el-input class="inputMaxWidth"/>-->
										<!--										</el-form-item>-->
										<!--采购日期-->
										<el-form-item :label="$t('editAdministrationTabs.formMaintenanceOrderTime') + '：'">
											<el-date-picker v-model="maintenanceFormMap.purchaseTime" class="inputMaxWidth" type="date"
																			:placeholder="$t('editAdministrationTabs.formMaintenanceSelectPlaceholder')"/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
							<!--相关合同-->
							<!--
							<div class="grayBg clearfix network_TitleBox">
								<p class="fl">{{$t('editAdministrationTabs.formMaintenanceTitleThird')}}</p>
								<div class="fr">
									<el-button type="primary">{{$t('editAdministrationTabs.formMaintenanceContractTitle')}}</el-button>
								</div>
							</div>
							<div>
								<el-table border stripe>
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractIndex')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractNum')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractName')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractType')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractTime')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractSupplier')" />
									<el-table-column :label="$t('editAdministrationTabs.columnMaintenanceContractOperation')" />
								</el-table>
							</div>
							-->
							<!--采购和维保 保存按钮-->
							<div class="textAlignCenter marginTop20 marBottom50">
								<el-button type="primary" class="alertBtn" @click="saveMaintenanceList">{{$t('public.save')}}
								</el-button>
							</div>
						</el-tab-pane>
						<!--管理信息-->
						<!--						<el-tab-pane :label="$t('editAdministrationTabs.managementTitle')" name="five" v-loading="management_loading"></el-tab-pane>-->
						<!--变更信息-->
						<!--						<el-tab-pane :label="$t('editAdministrationTabs.changeInformationTitle')" name="six" v-loading="changeInformation_loading"></el-tab-pane>-->
					</el-tabs>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!--基本信息 选择业务-->
		<el-dialog
			class="baseInfo_businessDialog"
			:title="$t('editAdministrationTabs.formBaseInfoBusinessDialogTitle')"
			append-to-body
			:before-close="resetBusiness"
			:visible.sync="dialogVisible_info"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-tree
				:data="businessTreeData"
				node-key="nodeId"
				ref="businessTree"
				highlight-current
				show-checkbox
				:check-strictly="true"
				:default-expanded-keys="defaultExpandedKeys"
				:props="defaultProps"/>
			<div slot="footer">
				<el-button class="alertBtn" type="primary" @click="selectBusiness">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetBusiness">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {dateFilterDay} from "../../assets/js/filters";

	export default {
		name: "editAdministrationTabs",
		data() {
			return {
				// 顶部最大页签 用于接收标签页序号 默认从组建接收 切换时进行数据绑定
				activeNameTabs: this.activeName,
				// 控制标签页内容是否显示
				isShowTabBox: false,
				// 控制标签页区域是否显示
				isShowTabBoxTitle: false,
				activeDeviceId: '',
				activeDeviceName: '',
				editableTabsValue: '', // 当前页签
				editableTabs: [], // 页面集合
				tabIndex: 0, // 页签序号
				// 记录不同设备 对应的 小标签的选中状态
				diffDeviceStatus: {},
				equipmentInfoList: [], // 设备基本信息
				equipmentAllStatus: [], // 设备整体状态
				// 基本信息表单
				formBaseInfo: {
					type: '',// 类型
					ip: '',
					deviceName: '', // 设备名称
					servicetag: '', // 序列号
					status: '', // 设备状态
					username: '', // 用户名
					password: '', // 密码
					manufacturer: '',// 厂商
					model: '', // 型号
					shapeStructure: '',//外形结构
					uCount: '', // u数
					chargeBy: '', // 设备责任人id
					chargeByName: '', // 设备责任人
					businessChargeBy: '',// 业务责任人id
					businessChargeByName: '', // 业务责任人
					os: '', // 操作系统
					businessId: '', // 关联业务
					businessData: [], // 关联业务集合
					description: '',// 备注
					roomId: null, // 机房id
					rackId: '', // 机架id
					rackPosition: '', // 机架位置
					positionDesc: '', // 位置描述
				},
				// 基本信息 校验
				errorBaseInfoError: {
					ipFlag: false, // ip校验标识
					ipFlagTip: '', // ip校验提示
					serviceTagFlag: false, // 序列号校验标识
					serviceTagFlagTip: '', // 序列号校验提示
					manufacturerFlag: false, // 厂商校验标识
					manufacturerFlagTip: '', // 厂商校验提示
					modelFlag: false, // 型号校验标识
					modelFlagTip: '', // 型号校验提示
					roomFlag: false, // 机房校验标识
					roomFlagTip: '', // 机房校验提示
					rackFlag: false, // 机柜校验标识
					rackFlagTip: '', // 机柜校验提示
					rackPositionFlag: false, // 所在位置 校验标识
					rackPositionFlagTip: '', // 所在位置 提示
				},
				manufacturerList: [], // 厂商下拉框集合
				modelList: [], // 型号下拉框集合
				chargeByList: [],//设备责任人集合 业务责任人集合
				roomList: [], // 所在机房集合
				rackList: [], // 所在机架集合
				osList: [], // 操作系统集合
				businessTreeData: [], // 关联业务树集合
				defaultExpandedKeys: [], // 关联业务树默认展开的集合
				baseInfo_loading: false, // 基本信息loading
				hardware_loading: false, // 硬件配置loading
				network_loading: false, // 网络配置loading
				maintenance_loading: false, // 采购与维保loading
				management_loading: false, // 管理信息loading
				changeInformation_loading: false, // 变更信息loading
				isShowPopoverChargeBy: false, // 设备责任人
				isShowPopoverBusinessChargeBy: false, // 业务责任人
				dialogVisible_info: false, // 选择关联业务弹出层
				manufacturerMap: {}, // 全部的厂商集合
				modelMap: {}, // 全部的型号集合
				shapeMap: {}, // 全部的外形结构集合
				defaultProps: {
					label: 'nodeName',
					children: 'children'
				},
				// 硬件配置
				activeHardWareName: '',
				hardWareCpuList: [], // cpu处理器集合
				hardWareMemoryList: [], // 内存集合
				hardWareDiskList: [],// 磁盘集合
				hardWareSupplyList: [],// 电源集合
				hardWareNicList: [],//网卡集合
				hardWareRaidList: [], // 阵列卡集合
				hardWareFanList: [], // 风扇集合
				hardWareAssetDevice: {
					id: '', // 硬件配置 id
				}, //
				// 采购和维保 表单集合
				maintenanceFormMap: {
					deviceId: '', // 从接口中读出来
					warrantyType: '', // 维保类型
					serviceAgent: '', // 维保商
					startTime: '', // 显示开始日期
					endTime: '', // 显示结束日期
					timeLength: '', // 显示维保期限
					factorTime: '', // 出厂日期
					orderNum: '', // 订单号
					orderName: '', // 订单名称
					purchaseSupply: '', // 供应商
					purchaseTime: '', // 采购日期
					purchasePrice: '', // 采购金额
					warrantyStartTime: '', // 原厂维保开始日期
					warrantyEndTime: '', // 原厂维保结束日期
					warrantyPeriod: '', // 原厂维保 维保期限
					otherWarrantyStartTime: '', // 第三方维保 开始日期
					otherWarrantyExpireTime: '', // 第三方维保 结束日期
					otherWarrantyPeriod: '', // 第三方维保 维保期限
				},
				// 维保类型下拉框数据
				maintenanceForm: [
					{value: 0, label: this.$t('editAdministrationTabs.formMaintenanceLast')},
					{value: 1, label: this.$t('editAdministrationTabs.formMaintenanceNew')}
				],
				// 维保类型校验表单
				errorMaintenanceError: {
					warrantyTypeFlag: false, // 维保类型校验标识
					warrantyTypeFlagTip: '', // 维保类型校验提示
					purchasePriceFlag: false, // 采购金额校验标识
					purchasePriceFlagTip: '', // 采购金额校验提示
					startTimeFlag: false, // 开始日期提示标识
					startTimeFlagTip: '', // 开始日期提示文案
					endTimeFlag: false, //  结束日期提示标识
					endTimeFlagTip: '', // 结束日期提示文案
				},
				// 网络配置 表单
				networkOOBIpList: [], // 带外信息集合
				networkProductionIPList: [], // 生产IP集合
				networkSwitchList: [], // 交换机下拉框数据
				// 主光纤交换机集合
				networkSwitchListMap: {
					id: null, // id
					deviceId: this.activeDeviceId, // 设备id
					name: '', // hba卡名
					wwnn: '', // wwnn
					wwpn: '', //wwpn
					fcSwitch: '', // 交换机
					switchPort: '', // 端口
					switchPortFlag: false // 端口校验标识
				},
				// 备光纤交换机集合
				networkSwitchItemMap: {
					id: null, // id
					deviceId: this.activeDeviceId, // 设备id
					name: '', // hba卡名
					wwnn: '', // wwnn
					wwpn: '', // wwpn
					fcSwitch: '', // 交换机
					switchPort: '', // 端口
					switchPortFlag: false, // 端口 校验标识
				},
				netWorkRemoteTypeList: ['telnet', 'ssh'], // 远程连接方式下拉框数据 前端写死
				netWorkAssetDevice: {
					type: '', // 类型 1或4显示带外网信息
				},
				uCountMap: {}, // 机柜U位map
				uCount: '', // U位循环值
			}
		},
		props: {
			// 接收设备Id 用于接口请求数据
			pageDeviceId: {
				type: String
			},
			// 接收设备名称 用于tab页的标题
			pageDeviceName: {
				type: String
			},
			// 接收标签页激活序号
			activeName: {
				type: String,
				default: 'one'
			}
		},
		methods: {
			/**
			 * 标签页相关
			 */
			// 标签页 =>  点击页签时
			clickTabsTopTitle(tab) {
				var _t = this;
				//记录当前正在展示设备的哪个内容页签
				_t.editableTabs.forEach((t) => {
					if (t.dataId === _t.activeDeviceId) {
						_t.diffDeviceStatus[t.name] = _t.activeNameTabs;
					}
				});
				if (tab.name === 'one') {
					_t.activeNameTabs = 'one';
					// 依次获取 厂商型号 设备责任人 机房机架 数据回显
					_t.getManufacturerAndModelData();
				} else if (tab.name === 'two') {
					_t.activeNameTabs = 'two';
					_t.activeHardWareName = 'cpuCard';
					// 调取硬件配置接口信息
					_t.getHardwareData();
				} else if (tab.name === 'three') {
					// 网络配置接口
					_t.getNetWorkListData();
				} else if (tab.name === 'four') {
					// 采购和维保接口
					_t.getMaintenanceList();
				}
			},
			// 添加页签
			addTab(title, id) {
				var _t = this;
				var newTabName = ++_t.tabIndex + '';
				_t.editableTabs.push({
					title: title,
					name: newTabName,
					content: id,
					dataId: id
				});
				_t.editableTabsValue = newTabName;
				_t.isShowTabBox = true;
				_t.isShowTabBoxTitle = true;
				if (_t.editableTabs.length > 1) {
					document.getElementById('tabs-Box-tabs').style.top = '52px';
				}
				if (document.querySelector('#tabs-Box-tabs .el-tabs__header.is-bottom .el-tabs__item.is-active') !== null) {
					_t.angleToUp('#tabs-Box-tabs');
				}
			},
			// 删除页签
			removeTab(targetName) {
				var _t = this;
				// 获取页面集合
				var tabs = _t.editableTabs;
				// 获取当前选中的页签
				var activeName = _t.editableTabsValue;
				// 删除的是当前的 标签页
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							var nextTab = tabs[index + 1] || tabs[index - 1];
							// 还有页签
							if (nextTab) {
								// 切换页签
								activeName = nextTab.name;
								if (_t.diffDeviceStatus[targetName] !== undefined) {
									// 删除标签页 清除 缓存记录的 内标签
									delete _t.diffDeviceStatus[targetName];
								}
								// 先修改 设备id 给父组件传值
								_t.$emit('changePageDeviceId', nextTab.dataId);
							} else {
								// 没有页签
								_t.isShowTabBoxTitle = false;
								// 清除定时器
								_t.setInterVal();
							}
						}
					});
				} else {
					if (_t.diffDeviceStatus[targetName] !== undefined) {
						// 删除标签页 清除 缓存记录的 内标签
						delete _t.diffDeviceStatus[targetName];
					}
				}
				// 删除之后的页签
				_t.editableTabsValue = activeName;
				_t.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('tabs-Box-tabs').style.top = 'initial';
				// 角标收起向下 样式调整
				_t.angleToDown('#tabs-Box-tabs');
				// 恢复默认的内部标签页为基本信息
				_t.activeNameTabs = 'one';
				// 单纯清除 本页的定时器 不清除标签
				_t.packUpClearInterval();
			},
			// 关闭标签页
			closeTab() {
				var _t = this;
				_t.isShowTabBoxTitle = false;
				document.getElementById('tabs-Box-tabs').style.top = 'initial';
				_t.editableTabsValue = '';
				_t.editableTabs = [];
				_t.tabIndex = 0;
				_t.activeNameTabs = 'one';
				_t.angleToUp('#tabs-Box-tabs');
				var styleTag = document.getElementsByTagName('style');
				for (var key in styleTag) {
					if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
						styleTag[key].remove();
					}
				}
				// 关闭本页 启动父级定时器
				_t.setInterVal();
			},
			// 点击标签页 底部设备 标签
			clickTabs() {
				var _t = this;
				_t.isShowTabBox = true; // 内容区显示
				document.getElementById('tabs-Box-tabs').style.top = '52px'; // 顶部定位
				_t.angleToUp('#tabs-Box-tabs'); // 底部页签向上

				// 遍历 标签页数组 查找设备id
				if (_t.editableTabs.length !== 0) {
					_t.editableTabs.forEach((item) => {
						if (item.name === _t.editableTabsValue) {
							// 先修改 设备id 给父组件传值
							_t.$emit('changePageDeviceId', item.dataId);
							// 清除 收起之后 点击标签 清除定时器
							_t.$emit('clearSetInterval', true);
						}
					});
				}
			},
			// 角标收起圆角向下
			angleToDown(domId) {
				var styleTag = document.getElementsByTagName('style');
				for (var key in styleTag) {
					if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
						styleTag[key].remove();
					}
				}
				// 改变父节点padding
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__nav-scroll').style.paddingTop = '5px';
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__nav-scroll').style.paddingBottom = '0';
				// 改变圆角化
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active').style.borderRadius = '10px 10px 0 0';
				// 改变 伪类样式
				var style = document.createElement('style');
				style.title = 'style_down';
				document.body.appendChild(style);
				var sheet = style.sheet;
				// addRule 存在
				if (sheet.addRule) {
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'top:initial;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'bottom:0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'border-radius:0 0 10px 0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'box-shadow:2px 2px 0 #fff;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'top:initial;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'bottom:0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'border-radius:0 0 0 10px;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'box-shadow:-2px 2px 0 #fff;');
				} else {
					// addRule 不存在 用 insertRule
					var styleSheets = document.styleSheets;
					for (var key = 0; key < styleSheets.length; key++) {
						if (styleSheets[key].title === 'style_down' || styleSheets[key].title === 'style_up') {
							// 找到了 添加伪类样式的 css规则集合
							styleSheets[key].insertRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before' + '{top:initial;bottom:0;border-radius:0 0 10px 0;box-shadow:2px 2px 0 #fff;}',0);
							styleSheets[key].insertRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after' + '{top:initial;bottom:0;border-radius:0 0 0 10px;box-shadow:-2px 2px 0 #fff;}',0);
						}
					}
				}
			},
			// 角标收起圆角向上
			angleToUp(domId) {
				var styleTag = document.getElementsByTagName('style');
				for (var key in styleTag) {
					if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
						styleTag[key].remove();
					}
				}
				// 改变父节点padding
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__nav-scroll').style.paddingTop = '0';
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__nav-scroll').style.paddingBottom = '5px';
				// 改变圆角化
				document.querySelector(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active').style.borderRadius = '0 0 10px 10px';
				// 改变 伪类样式
				var style = document.createElement('style');
				style.title = 'style_up';
				document.body.appendChild(style);
				var sheet = style.sheet;
				// addRule 存在
				if (sheet.addRule) {
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'top:0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'bottom:initial;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'border-radius:0 10px 0 0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'box-shadow:2px -2px 0 #fff;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'top:0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'bottom:initial;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'border-radius:10px 0 0 0;');
					sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'box-shadow:-2px -2px 0 #fff;');
				} else {
					// addRule 不存在 用insertRule
					var styleSheets = document.styleSheets;
					for (var key = 0; key < styleSheets.length; key++) {
						if (styleSheets[key].title === 'style_down' || styleSheets[key].title === 'style_up') {
							// 找到了 添加伪类样式的 css规则集合
							styleSheets[key].insertRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before' + '{top:0;bottom:initial;border-radius:0 10px 0 0;box-shadow:2px -2px 0 #fff;}',0);
							styleSheets[key].insertRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after' + '{top:0;bottom:initial;border-radius:10px 0 0 0;box-shadow:-2px -2px 0 #fff;}',0);
						}
					}
				}
			},
			// 公用的清除本页定时器,开启父组件调取数据的方法
			setInterVal() {
				var _t = this;
				_t.$emit('changePageDeviceId', '');
				// 设备标签页集合清空
				_t.tabIndex = 0;
				_t.editableTabs = [];
				_t.editableTabsValue = '';
				// 恢复默认的内部标签页为监测详情
				// _t.activeNameTabs = 'one';
				// 清空 关于设备下的标签页的信息
				_t.diffDeviceStatus = {};
				// 调用父组件表格刷新数据
				_t.$emit('refreshSetInterval', true);
			},
			// 本页内标签页之间切换 清除定时器
			clearIntervalFun() {
				var _t = this;
				//销毁刷新定时器
				clearInterval(_t.tabReloadTimer);
				_t.tabReloadTimer = null;
			},
			// 标签页收起 清除定时器
			packUpClearInterval() {
				var _t = this;
				_t.$emit('changePageDeviceId', '');
				// 调用父组件表格刷新数据
				_t.$emit('refreshSetInterval', true);
			},
			/**
			 * 标签页左侧 设备基本信息和设备整体状态
			 */
			// 左侧 => 请求设备基本信息
			getEquipmentInfoData() {
				var _t = this;
				_t.$api.get('monitor/deviceMonitorAttr/baseinfo/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							var result = new Array();
							if (null != res.data) {
								for (var key in res.data) {
									var obj = new Object();
									obj.label = key;
									obj.value = res.data[key];
									result.push(obj);
								}
							}
							_t.equipmentInfoList = result;
							break;
						default:
							_t.equipmentInfoList = [];
							break;
					}
				});
			},
			// 左侧 => 获取设备整体状态列表
			getEquipmentAllStatusData() {
				var _t = this;
				_t.$api.get('monitor/deviceMonitorAttr/overallstatus/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.equipmentAllStatus = res.data;
							break;
						default:
							_t.equipmentAllStatus = [];
							break;
					}
				});
			},
			/**
			 * 基本信息 页签
			 */
			// 根据设备id 回显设备基本信息
			getBaseInfoData() {
				var _t = this;
				// 调取信息之前先重置校验信息字段
				_t.resetBaseInfoData();
				_t.$api.get('asset/assetDevice/editInfo/' + _t.activeDeviceId, {}, function (res) {
					_t.baseInfo_loading = false;
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								if (res.data.assetDevice !== null) {
									_t.formBaseInfo.ip = res.data.assetDevice.ip === null ? '' : res.data.assetDevice.ip; // ip
									_t.formBaseInfo.deviceName = res.data.assetDevice.deviceName === null ? '' : res.data.assetDevice.deviceName; // 设备名称
									_t.formBaseInfo.servicetag = res.data.assetDevice.servicetag === null ? '' : res.data.assetDevice.servicetag; // 序列号
									// 处理设备责任人
									var chargeBy = res.data.assetDevice.chargeBy === null ? '' : res.data.assetDevice.chargeBy; // 设备责任人
									if (_t.$refs.equipmentTree[0].getNode(chargeBy) !== null) {
										_t.formBaseInfo.chargeBy = _t.$refs.equipmentTree[0].getNode(chargeBy).key;
										_t.formBaseInfo.chargeByName = _t.$refs.equipmentTree[0].getNode(chargeBy).label;
									}
									// 处理业务责任人
									var businessChargeBy = res.data.assetDevice.businessChargeBy === null ? '' : res.data.assetDevice.businessChargeBy; // 业务责任人
									if (_t.$refs.businessTree[0].getNode(businessChargeBy) !== null) {
										_t.formBaseInfo.businessChargeBy = _t.$refs.businessTree[0].getNode(businessChargeBy).key;
										_t.formBaseInfo.businessChargeByName = _t.$refs.businessTree[0].getNode(businessChargeBy).label;
									}
									_t.formBaseInfo.description = res.data.assetDevice.description === null ? '' : res.data.assetDevice.description; // 备注
									_t.formBaseInfo.roomId = res.data.assetDevice.roomId === null ? '' : res.data.assetDevice.roomId; // 所在机房
									// 改变机房下拉框的值
									_t.changeRoomList(_t.formBaseInfo.roomId, false);
									_t.formBaseInfo.rackId = res.data.assetDevice.rackId === null ? '' : res.data.assetDevice.rackId; // 所在机架
									// 改变机柜下拉框的值
									_t.changeRackList(_t.formBaseInfo.rackId);
									_t.formBaseInfo.rackPosition = res.data.assetDevice.rackPosition === null ? '' : res.data.assetDevice.rackPosition.toString(); // 机架位置
									if (_t.formBaseInfo.rackPosition !== '') {
										_t.formBaseInfo.rackPosition = Number(_t.formBaseInfo.rackPosition);
									}
									// 改变机柜位置下拉框的值
									_t.ruleRackLocation(_t.formBaseInfo.rackPosition, false);
									_t.formBaseInfo.positionDesc = res.data.assetDevice.positionDesc === null ? '' : res.data.assetDevice.positionDesc; // 位置秒速
									// 获取设备类型
									if (res.data.assetDevice.type !== null) {
										_t.formBaseInfo.type = res.data.assetDevice.type;
									}
									// 处理厂商
									if (_t.formBaseInfo.type !== '') {
										// 当前厂商集合
										var manufacturerCurrent = _t.manufacturerMap[_t.formBaseInfo.type];
										if (manufacturerCurrent && manufacturerCurrent !== null) {
											_t.manufacturerList = manufacturerCurrent;
											// 给厂商赋值
											var manufacturerThis = res.data.assetDevice.manufacturer === null ? '' : res.data.assetDevice.manufacturer; // 厂商
											if (_t.manufacturerList !== null) {
												var manufacturerFlag = false; // 回显的厂商是否有的标志位
												_t.manufacturerList.forEach((item) => {
													// 转小写判断
													if (manufacturerThis.toLowerCase() === item.toLowerCase()) {
														manufacturerFlag = true;
														_t.formBaseInfo.manufacturer = item;
													}
												});
												// 判断然后赋值
												if (manufacturerFlag === false) {
													_t.formBaseInfo.manufacturer = '';
												}
											}
										}
										// 当前型号集合
										var modelCurrentMap = _t.modelMap[_t.formBaseInfo.type];
										if (modelCurrentMap && modelCurrentMap !== null) {
											if (_t.formBaseInfo.manufacturer[0] && _t.formBaseInfo.manufacturer !== null) {
												var manufacturer = _t.formBaseInfo.manufacturer.toLowerCase();
												for (var key in modelCurrentMap) {
													// 型号集合 厂商字典转小写判断
													if (manufacturer === key.toLowerCase()) {
														var modelCurrent = modelCurrentMap[key];
														if (modelCurrent) {
															// 给型号集合赋值
															_t.modelList = modelCurrent;
														}
													}
												}
												// 型号回显值 转小写判断
												var modelStr = res.data.assetDevice.model === null ? '' : res.data.assetDevice.model; // 型号
												var modelFlag = false; // 判断型号是否对应标志位
												_t.modelList.forEach((item) => {
													if (item.model.toLowerCase() === modelStr.toLowerCase()) {
														// 给型号选中的值赋值
														_t.formBaseInfo.model = item.model;
														modelFlag = true;
														// 获取item 中的 shape
														if (item.shape !== null && _t.shapeMap !== null) {
															// 获取字典中 uCount 所对应的值
															if (_t.shapeMap[item.shape]) {
																// 给外形结构赋值
																_t.formBaseInfo.shapeStructure = _t.shapeMap[item.shape];
															} else {
																_t.formBaseInfo.shapeStructure = '';
															}
														} else {
															_t.formBaseInfo.shapeStructure = '';
														}
														// 获取u数 uCount
														if (item.uCount !== null) {
															_t.formBaseInfo.uCount = item.uCount;
														} else {
															_t.formBaseInfo.uCount = '';
														}
													}
												});
												// 没有对应的型号 型号置为空 外形结构为空 uCount为空
												if (modelFlag === false) {
													_t.formBaseInfo.model = '';
													_t.formBaseInfo.shapeStructure = '';
													_t.formBaseInfo.uCount = '';
												}
											}
										}
									}
								}
								if (res.data.assetServer !== null) {
									_t.formBaseInfo.os = res.data.assetServer.os === null ? '' : res.data.assetServer.os; // 操作系统
								}
								if (res.data.attr !== null) {
									_t.formBaseInfo.username = res.data.attr.username === null ? '' : res.data.attr.username; // 用户名
									_t.formBaseInfo.password = res.data.attr.password === null ? '' : res.data.attr.password; // 密码
								}
								// 关联业务
								if (res.data.business && res.data.business !== null) {
									var businessData = new Array();
									var businessName = new Array();
									res.data.business.forEach((item) => {
										var labelMap = _t.$refs.businessTreeOut[0].getNode(item);
										if (labelMap.label) {
											businessData.push(labelMap.key);
											businessName.push(labelMap.label);
										}
									});
									// name 逗号分隔 显示在 关联业务输入框
									_t.formBaseInfo.businessId = businessName.join(',');
									// 数组形式存储 id
									_t.formBaseInfo.businessData = businessData;
								} else {
									_t.businessId = '';
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 调取设备 基本信息之前先重置 基本信息校验
			resetBaseInfoData() {
				var _t = this;
				_t.errorBaseInfoError.ipFlag = false; // ip校验标识
				_t.errorBaseInfoError.ipFlagTip = ''; // ip校验提示
				_t.errorBaseInfoError.serviceTagFlag = false; // 序列号校验标识
				_t.errorBaseInfoError.serviceTagFlagTip = ''; // 序列号校验提示
				_t.errorBaseInfoError.manufacturerFlag = false; // 厂商校验标识
				_t.errorBaseInfoError.manufacturerFlagTip = ''; // 厂商校验提示
				_t.errorBaseInfoError.modelFlag = false; // 型号校验标识
				_t.errorBaseInfoError.modelFlagTip = ''; // 型号校验提示
				_t.errorBaseInfoError.roomFlag = false; // 机房校验标识
				_t.errorBaseInfoError.roomFlagTip = ''; // 机房校验提示
				_t.errorBaseInfoError.rackFlag = false; // 机柜校验标识
				_t.errorBaseInfoError.rackFlagTip = ''; // 机柜校验提示
				_t.errorBaseInfoError.rackPositionFlag = false; // 所在位置 校验标识
				_t.errorBaseInfoError.rackPositionFlagTip = ''; // 所在位置 提示
			},
			// 调取机房机架接口数据
			getRoomRackData() {
				var _t = this;
				_t.$api.get('asset/serverRoom/maplist', {}, function (res) {
					switch (res.status) {
						case 200:
							// 接口有数据 且 机房不为空
							if (res.data !== null && res.data.dataCenter !== null) {
								// 缓存机房机柜map
								var rackMap = new Object();
								if (res.data.racks && res.data.racks !== null) {
									rackMap = res.data.racks;
								}
								// 第一层先把 数据中心下的 机房map转为 机房list
								var dataCenterList = res.data.dataCenter === null ? [] : res.data.dataCenter;
								// 第一层循环 数据中心
								dataCenterList.forEach((center) => {
									// 判断机房集合字段是否存在
									if (center.centerRooms && center.centerRooms !== null) {
										center.centerRooms.forEach((t) => {
											t.rackList = rackMap[t.id] ? rackMap[t.id] : [];
										});
									}
								});
								_t.roomList = dataCenterList;
								// 缓存机柜所对应的 u位值的 map
								if (res.data.ucountMap && res.data.ucountMap !== null) {
									_t.uCountMap = res.data.ucountMap;
								}
								// 调取关联业务树数据
								_t.getBusinessList();
							}
							break;
						default:
							_t.roomList = [];
							break
					}
				});
			},
			// 改变机房下拉框
			changeRoomList(val, flag) {
				var _t = this;
				if (val !== '') {
					// 加载对应的机柜下拉框数据
					_t.roomList.forEach((item) => {
						if (item.centerRooms && item.centerRooms !== null) {
							item.centerRooms.forEach((t) => {
								if (t.id === val) {
									_t.formBaseInfo.rackId = '';
									_t.rackList = t.rackList;
								}
							});
						}
					});
					// flag true 页面加载完毕 手动改变  false 从接口读取数据 自动改变
					if (flag === true) {
						// 判断机房机柜位置 机房肯定不为空
						_t.errorBaseInfoError.roomFlag = false;
						_t.errorBaseInfoError.roomFlagTip = '';
						// 判断所在机柜
						if (_t.formBaseInfo.rackId === '') {
							_t.errorBaseInfoError.rackFlag = true;
							_t.errorBaseInfoError.rackFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRack');
						} else {
							_t.errorBaseInfoError.rackFlag = false;
							_t.errorBaseInfoError.rackFlagTip = '';
						}
						// 判断机柜位置
						if (_t.formBaseInfo.rackPosition=== '' || _t.formBaseInfo.rackPosition === null) {
							_t.errorBaseInfoError.rackPositionFlag = true;
							_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRackPosition');
						} else {
							_t.errorBaseInfoError.rackPositionFlag = false;
							_t.errorBaseInfoError.rackPositionFlagTip = '';
						}
					}
				} else {
					_t.formBaseInfo.rackId = '';
					_t.rackList = [];
					// 机房为空的情况下 U位位置为空 位置描述为空
					if (flag === true) {
						_t.formBaseInfo.rackPosition = '';
						_t.uCount = '';
						_t.formBaseInfo.positionDesc = '';
						_t.errorBaseInfoError.roomFlag = false;
						_t.errorBaseInfoError.roomFlagTip = '';
						_t.errorBaseInfoError.rackFlag = false;
						_t.errorBaseInfoError.rackFlagTip = '';
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				}
			},
			// 改变机架下拉框
			changeRackList(val) {
				var _t = this;
				// 机架为空的情况下 U位位置为空 位置描述为空
				if (val === '' || val === null) {
					_t.formBaseInfo.rackPosition = '';
					_t.formBaseInfo.positionDesc = '';
					_t.errorBaseInfoError.rackPositionFlag = false;
					_t.errorBaseInfoError.rackPositionFlagTip = '';
					// 判断一下机房有没有选中的值 有
					if (_t.formBaseInfo.roomId !== '') {
						_t.errorBaseInfoError.rackFlag = true;
						_t.errorBaseInfoError.rackFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRack');
						_t.errorBaseInfoError.rackPositionFlag = true;
						_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRackPosition');
					} else {
						_t.errorBaseInfoError.roomFlag = false;
						_t.errorBaseInfoError.roomFlagTip = '';
						_t.errorBaseInfoError.rackFlag = false;
						_t.errorBaseInfoError.rackFlagTip = '';
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				} else {
					// 机柜不为空时
					_t.errorBaseInfoError.rackFlag = false;
					_t.errorBaseInfoError.rackFlagTip = '';
					// 判断机柜位置是否为空
					if (_t.formBaseInfo.rackPosition === '') {
						_t.errorBaseInfoError.rackPositionFlag = true;
						_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRackPosition');
					} else {
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
					// 加载 U位位置 下拉框数据
					if (_t.uCountMap[val] && _t.uCountMap[val] !== null) {
						_t.uCount = Number(_t.uCountMap[val]);
						_t.formBaseInfo.rackPosition = '';
						_t.formBaseInfo.positionDesc = '';
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				}
			},
			// 数据回显调取关联业务集合
			getBusinessList() {
				var _t = this;
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								if (res.data.children && res.data.children !== null) {
									_t.businessTreeData = res.data.children;
								}
							}
							// 最后获取需要编辑回显的数据
							_t.getBaseInfoData();
							break;
						default:
							_t.businessTreeData = [];
							break;
					}
				});
			},
			// 选择关联业务按钮
			selectBusinessBtn() {
				var _t = this;
				_t.dialogVisible_info = true;
				// 默认展开树节点的第一个子节点
				if (_t.businessTreeData.length !== 0) {
					_t.defaultExpandedKeys[0] = _t.businessTreeData[0].nodeId;
				}
				// 勾选已经选中的关联业务节点
				if (_t.formBaseInfo.businessData.length !== 0) {
					_t.$nextTick(function () {
						_t.$refs.businessTree.setCheckedKeys(_t.formBaseInfo.businessData);
					});
				}
			},
			// 点击关联业务弹出层确认按钮
			selectBusiness() {
				var _t = this;
				var treeData = _t.$refs.businessTree.getCheckedNodes();
				var businessIdArr = new Array();
				var businessNameArr = new Array();
				if (treeData.length !== 0) {
					treeData.forEach((item) => {
						businessIdArr.push(item.nodeId);
						businessNameArr.push(item.nodeName);
					});
				}
				_t.formBaseInfo.businessId = businessNameArr.join(',');
				_t.formBaseInfo.businessData = businessIdArr;
				_t.resetBusiness();
			},
			// 重置关联业务树弹出层
			resetBusiness() {
				var _t = this;
				_t.dialogVisible_info = false;
				_t.$refs.businessTree.setCheckedKeys([]);
			},
			// 改变设备责任人
			clickChargeByFirst(val) {
				var _t = this;
				if (val.level === 3) {
					_t.formBaseInfo.chargeBy = val.nodeId;
					_t.formBaseInfo.chargeByName = val.nodeName;
					_t.isShowPopoverChargeBy = false;
				}
			},
			// 改变业务责任人
			clickBusinessChargeByFirst(val) {
				var _t = this;
				if (val.level === 3) {
					_t.formBaseInfo.businessChargeBy = val.nodeId;
					_t.formBaseInfo.businessChargeByName = val.nodeName;
					_t.isShowPopoverBusinessChargeBy = false;
				}
			},
			// 获取 责任人接口
			getChargeByData() {
				var _t = this;
				_t.$api.get('system/organization/getOrgRoleUserTree', {}, function (res) {
					switch (res.status) {
						case 200:
							// 获取机房机架数据
							_t.getRoomRackData();
							if (res.data !== null) {
								var resData = JSON.parse(res.data);
								if (resData.children && resData.children.length !== 0) {
									_t.chargeByList = resData.children;
								}
							}
							break;
						default:
							_t.chargeByList = [];
							break;
					}
				});
			},
			// 获取厂商型号下拉框数据
			getManufacturerAndModelData() {
				var _t = this;
				_t.baseInfo_loading = true;
				_t.$api.get('asset/assetCategory/categoryMap', {}, function (res) {
					switch (res.status) {
						case 200:
							// 获取责任人接口数据
							_t.getChargeByData();
							// 处理厂商型号数据
							if (res.data !== null) {
								// 厂商集合
								if (res.data.manufacturer && res.data.manufacturer !== null) {
									_t.manufacturerMap = res.data.manufacturer;
								} else {
									_t.manufacturerMap = {};
								}
								// 型号集合
								if (res.data.model && res.data.model !== null) {
									_t.modelMap = res.data.model;
								} else {
									_t.modelMap = {};
								}
								// 外形结构集合
								if (res.data.shape && res.data.shape !== null) {
									_t.shapeMap = res.data.shape;
								} else {
									_t.shapeMap = {};
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 改变厂商下拉框数据
			changeManufacturer(val, err, flag) {
				var _t = this;
				if (val !== '') {
					// 厂商不为空
					err[flag] = false;
					err[flag + 'Tip'] = '';
					_t.formBaseInfo.model = ''; // 选中的型号为空
					_t.formBaseInfo.shapeStructure = ''; // 选中的外形结构为空
					_t.formBaseInfo.uCount = ''; // u数为空
					// 获取型号集合中的list数据
					if (_t.formBaseInfo.type !== '') {
						var modelMap = _t.modelMap[_t.formBaseInfo.type];
						var modelFlag = false; // 是否找到 model集合判断标志
						for (var key in modelMap) {
							// key值转小写判断
							if (val.toLowerCase() === key.toLowerCase()) {
								modelFlag = true;
								_t.modelList = modelMap[key];
							}
						}
						// 没有找到型号集合置空
						if (modelFlag === false) {
							_t.modelList = [];
						}
					}
				} else {
					// 没有选中的厂商
					_t.modelList = []; // 型号集合为空
					_t.formBaseInfo.model = ''; // 选中的型号为空
					_t.formBaseInfo.shapeStructure = ''; // 选中的外形结构为空
					_t.formBaseInfo.uCount = ''; // u数为空
					// 厂商为空
					err[flag] = true;
					err[flag + 'Tip'] = _t.$t('public.isNotNull');
				}
			},
			// 改变型号下拉框数据
			changeModel(val, list, err, flag) {
				var _t = this;
				if (list !== null && list.length !== 0) {
					var modelFlag = false; // 判断是否找到对应的型号
					list.forEach((model) => {
						if (val === model.model) {
							modelFlag = true;
							// 字典获取外形结构
							if (model.shape !== null && _t.shapeMap !== null) {
								_t.formBaseInfo.shapeStructure = _t.shapeMap[model.shape]
							} else if (model.shape === null && _t.shapeMap !== null) {
								_t.formBaseInfo.shapeStructure = '';
							}
							// 获取u数
							if (model.uCount !== null) {
								_t.formBaseInfo.uCount = model.uCount;
							} else {
								_t.formBaseInfo.uCount = '';
							}
						}
					});
					// 没有找到对应的 型号集合
					if (modelFlag === false) {
						_t.formBaseInfo.shapeStructure = '';
						_t.formBaseInfo.uCount = '';
					}
				}
				// 校验判断型号是否为空
				if (val === null || val === '') {
					err[flag] = true;
					err[flag + 'Tip'] = _t.$t('public.isNotNull');
				} else {
					err[flag] = false;
					err[flag + 'Tip'] = '';
				}
			},
			// 校验机架位置信息
			ruleRackLocation(value, flag) {
				var _t = this;
				// 首先校验机架位置 输入是否有值
				if (value === null || value === '') {
					// 判断机房机架是否有值 只要有值 机柜位置不能为空
					if ((_t.formBaseInfo.roomId !== null && _t.formBaseInfo.roomId !== '') || (_t.formBaseInfo.rackId !== null && _t.formBaseInfo.rackId !== '')) {
						// 机柜位置不能为空
						_t.errorBaseInfoError.rackPositionFlag = true;
						_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRackPosition');
					} else {
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				} else {
					// flag 为true 手动改变 false 接口自动改变
					if (flag === true) {
						// 有值 判断值 的 格式是否正确
						var reg = _t.$api.isNumber();
						if (reg.test(value) === false) {
							// 格式不正确
							_t.errorBaseInfoError.rackPositionFlag = true;
							_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('public.isIntegerNumber');
						} else {
							_t.errorBaseInfoError.rackPositionFlag = false;
							_t.errorBaseInfoError.rackPositionFlagTip = '';
							// 有值 格式正确 开始校验 机房和机柜是否有值、还有厂商型号是否为空
							// 校验厂商
							_t.blurIsNotNullWithTrue(_t.formBaseInfo.manufacturer, _t.errorBaseInfoError, 'manufacturerFlag');
							// 校验型号
							_t.blurIsNotNullWithTrue(_t.formBaseInfo.model, _t.errorBaseInfoError, 'modelFlag');
							// 校验所在机房
							if (_t.formBaseInfo.roomId === null || _t.formBaseInfo.roomId === '') {
								_t.errorBaseInfoError.roomFlag = true;
								_t.errorBaseInfoError.roomFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRoom');
							} else {
								_t.errorBaseInfoError.roomFlag = false;
								_t.errorBaseInfoError.roomFlagTip = '';
							}
							// 校验所在机柜
							if (_t.formBaseInfo.rackId === null || _t.formBaseInfo.rackId === '') {
								_t.errorBaseInfoError.rackFlag = true;
								_t.errorBaseInfoError.rackFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRack');
							} else {
								_t.errorBaseInfoError.rackFlag = false;
								_t.errorBaseInfoError.rackFlagTip = '';
							}
							// 判断如果 厂商型号不为空 并且机房、机柜、位置三项都有值开始请求接口判断
							if (_t.errorBaseInfoError.manufacturerFlag === false
								&& _t.errorBaseInfoError.modelFlag === false
								&& _t.errorBaseInfoError.roomFlag === false
								&& _t.errorBaseInfoError.rackFlag === false
								&& _t.errorBaseInfoError.rackPositionFlag === false) {
								_t.getPositionRule(true);
							}
						}
					} else {
						// flag: false
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				}
			},
			// 发送所在位置请求判断 flag 判断触发类型 true 所在位置失去焦点时触发 false 保存按钮点击时触发
			getPositionRule(flag) {
				var _t = this;
				_t.$api.post('asset/assetDevice/checkDevicePosition', {
					id: _t.activeDeviceId,
					type: _t.formBaseInfo.type,
					manufacturer: _t.formBaseInfo.manufacturer === '' ? null : _t.formBaseInfo.manufacturer,
					model: _t.formBaseInfo.model === '' ? null : _t.formBaseInfo.model,
					roomId: _t.formBaseInfo.roomId === '' ? null : _t.formBaseInfo.roomId,
					rackId: _t.formBaseInfo.rackId === '' ? null : _t.formBaseInfo.rackId,
					rackPosition: _t.formBaseInfo.rackPosition === null ? null : (_t.formBaseInfo.rackPosition === '' ? null : _t.formBaseInfo.rackPosition)
				}, function (res) {
					switch (res.status) {
						case 200:
							// flag 为false 保存按钮触发
							if (flag === false) {
								_t.commitBaseInfoData();
							}
							break;
						default: // 非200就是 U位冲突
							_t.errorBaseInfoError.rackPositionFlag = true;
							_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoRackPositionHad');
							break;
					}
				});
			},
			// 校验不为空 加 正确判断 (非输入框 所以不可能有trim)
			blurIsNotNullWithTrue(val, err, flag) {
				var _t = this;
				if (val === null || val === '') {
					err[flag] = true;
					err[flag + 'Tip'] = _t.$t('public.isNotNull');
				} else {
					err[flag] = false;
					err[flag + 'Tip'] = '';
				}
			},
			// 校验带外IP
			blurRuleBaseInfoIp(val) {
				var _t = this;
				// 带外IP为空
				if (val === null || val.trim() === '') {
					_t.errorBaseInfoError.ipFlag = true;
					_t.errorBaseInfoError.ipFlagTip = _t.$t('public.isNotNull');
				} else {
					// 不为空 校验格式是否正确
					var reg = _t.$api.isIpNumber();
					if (reg.test(val) == false) {
						// 格式不正确
						_t.errorBaseInfoError.ipFlag = true;
						_t.errorBaseInfoError.ipFlagTip = _t.$t('public.ipFormatTip');
					} else {
						// 校验通过
						_t.errorBaseInfoError.ipFlag = false;
						_t.errorBaseInfoError.ipFlagTip = '';
					}
				}
			},
			// 手动校验不为空
			blurIsNotNull(val, err, flag) {
				var _t = this;
				if (val === null || val.trim() === '') {
					err[flag] = true;
					err[flag + 'Tip'] = _t.$t('public.isNotNull');
				}
			},
			// 保存基本信息
			saveBaseInfoData() {
				var _t = this;
				// 表单校验
				// 校验 带外IP字段
				_t.blurRuleBaseInfoIp(_t.formBaseInfo.ip);
				// 序列号校验
				_t.blurIsNotNull(_t.formBaseInfo.servicetag, _t.errorBaseInfoError, 'serviceTagFlag');
				// 校验厂商不能为空
				if (_t.formBaseInfo.manufacturer === null || _t.formBaseInfo.manufacturer === '') {
					_t.errorBaseInfoError.manufacturerFlag = true;
					_t.errorBaseInfoError.manufacturerFlagTip = _t.$t('public.isNotNull');
				} else {
					_t.errorBaseInfoError.manufacturerFlag = false;
					_t.errorBaseInfoError.manufacturerFlagTip = '';
				}
				// 校验型号不能为空
				if (_t.formBaseInfo.model === null || _t.formBaseInfo.model === '') {
					_t.errorBaseInfoError.modelFlag = true;
					_t.errorBaseInfoError.modelFlagTip = _t.$t('public.isNotNull');
				} else {
					_t.errorBaseInfoError.modelFlag = false;
					_t.errorBaseInfoError.modelFlagTip = '';
				}
				// 校验机房、机架、机架位置
				if (_t.formBaseInfo.roomId.trim() === '' && _t.formBaseInfo.rackId.trim() === '' && _t.formBaseInfo.rackPosition === '') {
					// 三项为空不做校验操作
				} else {
					// 三项至少一项有值 分别校验 为空的要提示
					// 判断所属机房
					if (_t.formBaseInfo.roomId === '') {
						_t.errorBaseInfoError.roomFlag = true;
						_t.errorBaseInfoError.roomFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRoom');
					} else {
						_t.errorBaseInfoError.roomFlag = false;
						_t.errorBaseInfoError.roomFlagTip = '';
					}
					// 判断所属机柜
					if (_t.formBaseInfo.rackId === '') {
						_t.errorBaseInfoError.rackFlag = true;
						_t.errorBaseInfoError.rackFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRack');
					} else {
						_t.errorBaseInfoError.rackFlag = false;
						_t.errorBaseInfoError.rackFlagTip = '';
					}
					// 判断所在位置
					if (_t.formBaseInfo.rackPosition === '' || _t.formBaseInfo.rackPosition === null) {
						_t.errorBaseInfoError.rackPositionFlag = true;
						_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoInputRackPosition');
					} else {
						_t.errorBaseInfoError.rackPositionFlag = false;
						_t.errorBaseInfoError.rackPositionFlagTip = '';
					}
				}
				// 校验判断结束 判断是否可以调用接口
				if (_t.errorBaseInfoError.ipFlag === false
					&& _t.errorBaseInfoError.serviceTagFlag === false
					&& _t.errorBaseInfoError.manufacturerFlag === false
					&& _t.errorBaseInfoError.modelFlag === false
					&& _t.errorBaseInfoError.roomFlag === false
					&& _t.errorBaseInfoError.rackFlag === false
					&& _t.errorBaseInfoError.rackPositionFlag === false) {
					_t.getPositionRule(false);
				}
			},
			// 提交 保存基本信息的 接口
			commitBaseInfoData() {
				var _t = this;
				_t.baseInfo_loading = true;
				_t.$api.post('asset/assetDevice/editInfo/save', {
					assetDevice: {
						type: _t.formBaseInfo.type,
						id: _t.activeDeviceId === null ? null : (_t.activeDeviceId.trim() === '' ? null : _t.activeDeviceId.trim()),
						ip: _t.formBaseInfo.ip === null ? null : (_t.formBaseInfo.ip.trim() === '' ? null : _t.formBaseInfo.ip.trim()),
						deviceName: _t.formBaseInfo.deviceName === null ? null : (_t.formBaseInfo.deviceName.trim() === '' ? null : _t.formBaseInfo.deviceName.trim()),
						servicetag: _t.formBaseInfo.servicetag === null ? null : (_t.formBaseInfo.servicetag.trim() === '' ? null : _t.formBaseInfo.servicetag.trim()),
						manufacturer: _t.formBaseInfo.manufacturer === null ? null : (_t.formBaseInfo.manufacturer.trim() === '' ? null : _t.formBaseInfo.manufacturer.trim()),
						model: _t.formBaseInfo.model === null ? null : (_t.formBaseInfo.model.trim() === '' ? null : _t.formBaseInfo.model.trim()),
						chargeBy: _t.formBaseInfo.chargeBy === null ? null : (_t.formBaseInfo.chargeBy.trim() === '' ? null : _t.formBaseInfo.chargeBy.trim()),
						businessChargeBy: _t.formBaseInfo.businessChargeBy === null ? null : (_t.formBaseInfo.businessChargeBy.trim() === '' ? null : _t.formBaseInfo.businessChargeBy.trim()),
						description: _t.formBaseInfo.description === null ? null : (_t.formBaseInfo.description.trim() === '' ? null : _t.formBaseInfo.description.trim()),
						roomId: _t.formBaseInfo.roomId === null ? null : (_t.formBaseInfo.roomId.trim() === '' ? null : _t.formBaseInfo.roomId.trim()),
						rackId: _t.formBaseInfo.rackId === null ? null : (_t.formBaseInfo.rackId.trim() === '' ? null : _t.formBaseInfo.rackId),
						rackPosition: _t.formBaseInfo.rackPosition === null ? null : (_t.formBaseInfo.rackPosition === '' ? null : _t.formBaseInfo.rackPosition),
						positionDesc: _t.formBaseInfo.positionDesc === null ? null : (_t.formBaseInfo.positionDesc.trim() === '' ? null : _t.formBaseInfo.positionDesc.trim())
					},
					assetServer: {
						os: _t.formBaseInfo.os === null ? null : (_t.formBaseInfo.os.trim() === '' ? null : _t.formBaseInfo.os.trim()),
						deviceId: _t.activeDeviceId === null ? null : (_t.activeDeviceId.trim() === '' ? null : _t.activeDeviceId.trim()),
					},
					attr: {
						deviceId: _t.activeDeviceId === null ? null : (_t.activeDeviceId.trim() === '' ? null : _t.activeDeviceId.trim()),
						username: _t.formBaseInfo.username === null ? null : (_t.formBaseInfo.username.trim() === '' ? null : _t.formBaseInfo.username.trim()),
						password: _t.formBaseInfo.password === null ? null : (_t.formBaseInfo.password.trim() === '' ? null : _t.formBaseInfo.password.trim())
					},
					business: _t.formBaseInfo.businessData === null ? null : (_t.formBaseInfo.businessData),
				}, function (res) {
					_t.baseInfo_loading = false;
					switch (res.status) {
						case 200:
							_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm'),
								confirmButtonClass: 'alertBtn'
							}).then(() => {
								// 更新设备基本信息
								_t.getEquipmentInfoData();
								// 修改成功之后调取最新的基本信息数据
								_t.getBaseInfoData();
							}).catch(() => {
								// 更新设备基本信息
								_t.getEquipmentInfoData();
								// 修改成功之后调取最新的基本信息数据
								_t.getBaseInfoData();
							});
							break;
						case 400:
							_t.errorBaseInfoError.rackPositionFlag = true;
							_t.errorBaseInfoError.rackPositionFlagTip = _t.$t('editAdministrationTabs.formBaseInfoRackPositionHad');
							break;
						default:
							_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoErrorTip'), _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm'),
								confirmButtonClass: 'alertBtn'
							}).then(() => {
								// 更新设备基本信息
								_t.getEquipmentInfoData();
								// 修改成功之后调取最新的基本信息数据
								_t.getBaseInfoData();
							}).catch(() => {
								// 更新设备基本信息
								_t.getEquipmentInfoData();
								// 修改成功之后调取最新的基本信息数据
								_t.getBaseInfoData();
							});
							break;
					}
				});
			},
			/**
			 * 硬件配置 页签
			 */
			// 点击硬件配置页签 获取硬件配置信息数据
			getHardwareData() {
				var _t = this;
				_t.hardware_loading = true;
				_t.$api.get('asset/assetDevice/hardinfo/' + _t.activeDeviceId, {}, function (res) {
					_t.hardware_loading = false;
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								// 设备信息
								if (res.data.assetDevice && res.data.assetDevice !== null) {
									_t.hardWareAssetDevice.id = res.data.assetDevice.id;
								}
								// cpu
								if (res.data.cpu && res.data.cpu !== null) {
									var cpuList = res.data.cpu;
									cpuList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareCpuList = cpuList;
								}
								// 内存
								if (res.data.memory && res.data.memory !== null) {
									var memoryList = res.data.memory;
									memoryList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareMemoryList = memoryList;
								}
								// 磁盘
								if (res.data.disk && res.data.disk !== null) {
									var diskList = res.data.disk;
									diskList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareDiskList = diskList;
								}
								// 电源
								if (res.data.supply && res.data.supply !== null) {
									var supplyList = res.data.supply;
									supplyList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareSupplyList = supplyList;
								}
								// 网卡
								if (res.data.nic && res.data.nic !== null) {
									var nicList = res.data.nic;
									nicList.forEach((item) => {
										item.nameFlag = false;
										item.ipFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareNicList = nicList;
								}
								// 阵列卡
								if (res.data.raid && res.data.raid !== null) {
									var raidList = res.data.raid;
									raidList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareRaidList = raidList;
								}
								// 风扇
								if (res.data.fan && res.data.fan !== null) {
									var fanList = res.data.fan;
									fanList.forEach((item) => {
										item.nameFlag = false;
										if (item.id && item.id !== null && item.id !== '') {
											item.domId = item.id;
										} else {
											item.domId = new Date().getTime();
										}
									});
									_t.hardWareFanList = fanList;
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 名称校验
			blurHardWareName(item, domName) {
				if (item.name === null) {
					item.nameFlag = true;
				} else if (item.name.trim() === '') {
					item.nameFlag = true;
				} else {
					item.nameFlag = false;
				}
			},
			// IP校验
			blurHardWareIP(item, domName) {
				var _t = this;
				if (item.ip === null) {
					item.ipFlag = false;
				} else if (item.ip.trim() === '') {
					item.ipFlag = false;
				} else {
					var reg = _t.$api.isIpNumber();
					if (reg.test(item.ip.trim()) === false) {
						item.ipFlag = true;
					} else {
						item.ipFlag = false;
					}
				}
			},
			// 添加cpu字段
			addCPUList() {
				var _t = this;
				var cpuObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					model: null, // 型号
					frequency: null, // 主频
					cpuIndex: null, // 槽位
					manufacturer: null, // 厂商
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					nameFlag: false, // name不为空校验
				};
				_t.hardWareCpuList.push(cpuObj);
			},
			// 删除cpu字段
			deleteCPUMap(index) {
				var _t = this;
				_t.hardWareCpuList.splice(index, 1);
			},
			// 保存CPU
			saveCPUList() {
				var _t = this;
				// 校验cpu名称不能为空
				var cpuNullNum = 0;
				if (_t.hardWareCpuList.length !== 0) {
					_t.hardWareCpuList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareCPU_');
						// 统计为空的数
						if (item.nameFlag === true) {
							cpuNullNum++;
						}
					});
				}
				if (cpuNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						cpu: _t.hardWareCpuList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加内存字段
			addMemoryList() {
				var _t = this;
				var memoryObj = {
					id: null, // id
					domId: new Date().getTime(),  // 节点id
					name: null, // name
					model: null, // 型号
					frequency: null, // 主频
					size: null, // 大小
					firmwareVersion: null, // 固件版本
					memoryIndex: null, // 槽位
					manufacturer: null, // 厂商
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					nameFlag: false, // name校验
				};
				_t.hardWareMemoryList.push(memoryObj);
			},
			// 删除内存字段
			deleteMemoryMap(index) {
				var _t = this;
				_t.hardWareMemoryList.splice(index, 1);
			},
			// 保存内存
			saveMemoryList() {
				var _t = this;
				// 校验内存名称不能为空
				var memoryNullNum = 0;
				if (_t.hardWareMemoryList.length !== 0) {
					_t.hardWareMemoryList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareMemory_');
						// 统计为空的数
						if (item.nameFlag === true) {
							memoryNullNum++;
						}
					});
				}
				if (memoryNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						memory: _t.hardWareMemoryList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加磁盘
			addDiskList() {
				var _t = this;
				var diskObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					bus: null, // 总线类型
					media: null, // 磁盘介质
					size: null, // 大小
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					speed: null, // 转速
					diskIndex: null, // 槽位
					manufacturer: null, // 厂商
					model: null, // 型号
					formfactor: null, // 尺寸
					firmwareVersion: null, // 固件版本
					nameFlag: false, // name不为空校验
				};
				_t.hardWareDiskList.push(diskObj);
			},
			// 删除磁盘
			deleteDiskMap(index) {
				var _t = this;
				_t.hardWareDiskList.splice(index, 1);
			},
			// 保存磁盘
			saveDiskList() {
				var _t = this;
				// 校验内存名称不能为空
				var diskNullNum = 0;
				if (_t.hardWareDiskList.length !== 0) {
					_t.hardWareDiskList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareDisk_');
						// 统计为空的数
						if (item.nameFlag === true) {
							diskNullNum++;
						}
					});
				}
				if (diskNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						disk: _t.hardWareDiskList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加电源
			addSupplyList() {
				var _t = this;
				var supplyObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					supplyType: null, // 类型
					model: null, // 型号
					outputPower: null, // 功率
					manufacturer: null, // 厂商
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					firmwareVersion: null, // 固件版本
					supplyIndex: null, // 槽位
					nameFlag: false, // name不为空校验
				};
				_t.hardWareSupplyList.push(supplyObj);
			},
			// 删除电源
			deleteSupplyMap(index) {
				var _t = this;
				_t.hardWareSupplyList.splice(index, 1);
			},
			// 保存电源
			saveSupplyList() {
				var _t = this;
				// 校验内存名称不能为空
				var supplyNullNum = 0;
				if (_t.hardWareSupplyList.length !== 0) {
					_t.hardWareSupplyList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareSupply_');
						// 统计为空的数
						if (item.nameFlag === true) {
							supplyNullNum++;
						}
					});
				}
				if (supplyNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						supply: _t.hardWareSupplyList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加网卡
			addNicList() {
				var _t = this;
				var nicObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					model: null, // 型号
					ip: null, // ip
					mac: null, // mac
					manufacturer: null, // 厂商
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					speed: null, // 速度
					firmwareVersion: null, // 固件版本
					nicIndex: null, // 槽位
					ipFlag: false, // ip不为空校验
					nameFlag: false, // name不为空校验
				};
				_t.hardWareNicList.push(nicObj);
			},
			// 删除网卡
			deleteNicMap(index) {
				var _t = this;
				_t.hardWareNicList.splice(index, 1);
			},
			// 保存网卡
			saveNicList() {
				var _t = this;
				// 校验内存名称不能为空
				var nicNullNum = 0;
				if (_t.hardWareNicList.length !== 0) {
					_t.hardWareNicList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareNic_');
						_t.blurHardWareIP(item, 'hardWareNicIp_');
						// 统计为空的数
						if (item.nameFlag === true) {
							nicNullNum++;
						}
						if (item.ipFlag === true) {
							nicNullNum++;
						}
					});
				}
				if (nicNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						nic: _t.hardWareNicList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加阵列卡
			addRaidList() {
				var _t = this;
				var raidObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					model: null, // 型号
					cacheSize: null, // 缓存大小
					speed: null, // 速度
					manufacturer: null, // 厂商
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					firmwareVersion: null, // 固件版本
					raidIndex: null, // 槽位
					nameFlag: false, // name不为空校验
				};
				_t.hardWareRaidList.push(raidObj);
			},
			// 删除阵列卡
			deleteRaidMap(index) {
				var _t = this;
				_t.hardWareRaidList.splice(index, 1);
			},
			// 保存阵列卡
			saveRaidList() {
				var _t = this;
				// 校验内存名称不能为空
				var raidNullNum = 0;
				if (_t.hardWareRaidList.length !== 0) {
					_t.hardWareRaidList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareRaid_');
						// 统计为空的数
						if (item.nameFlag === true) {
							raidNullNum++;
						}
					});
				}
				if (raidNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						raid: _t.hardWareRaidList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加风扇
			addFanList() {
				var _t = this;
				var fanObj = {
					id: null, // id
					domId: new Date().getTime(), // 节点id
					name: null, // 名称
					partNumber: null, // 部件号
					serialNumber: null, // 序列号
					raidIndex: null, // 槽位
					nameFlag: false, // name不为空校验
				};
				_t.hardWareFanList.push(fanObj);
			},
			// 删除风扇
			deleteFanMap(index) {
				var _t = this;
				_t.hardWareFanList.splice(index, 1);
			},
			// 保存风扇
			saveFanList() {
				var _t = this;
				// 校验内存名称不能为空
				var fanNullNum = 0;
				if (_t.hardWareFanList.length !== 0) {
					_t.hardWareFanList.forEach((item) => {
						_t.blurHardWareName(item, 'hardWareFan_');
						// 统计为空的数
						if (item.nameFlag === true) {
							fanNullNum++;
						}
					});
				}
				if (fanNullNum === 0) {
					_t.$api.post('asset/assetDevice/hardinfo/save', {
						assetDevice: {
							id: _t.hardWareAssetDevice.id,
						},
						fan: _t.hardWareFanList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getHardwareData();
								}).catch(() => {
									_t.getHardwareData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			/**
			 * 网络配置 页签
			 */
			// 获取网络配置接口数据
			getNetWorkListData() {
				var _t = this;
				// 调取数据之前 重置数据
				_t.resetNetWorkFormData();
				_t.$api.get('asset/assetDevice/networkInfo/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								// 记录设备type
								_t.netWorkAssetDevice.type = res.data.assetDevice.type;
								// 交换机下拉框数据
								var networkSwitchList = res.data.switchList === null ? [] : res.data.switchList;
								networkSwitchList.forEach((item) => {
									item.deviceNameWithIP = item.deviceName + '(' + item.ip + ')';
								});
								_t.networkSwitchList = networkSwitchList;
								// 带外网信息 集合
								var networkOOBIpList = res.data.oobNetworkConfig === null ? [] : res.data.oobNetworkConfig;
								if (networkOOBIpList.length !== 0) {
									networkOOBIpList.forEach((item) => {
										item.ipFlag = false; // ip校验标识
										item.ipFlagTip = ''; // ip校验提示
										item.netmaskFlag = false; // 子网掩码校验标识
										item.swithPortFlag = false; // 端口校验标识
										item.gatewayFlag = false; // 网关校验标识
										item.macFlag = false; // mac校验标识
									});
									_t.networkOOBIpList = networkOOBIpList;
								}
								// 生产网信息
								var networkProductionIPList = res.data.productNetworkConfig === null ? [] : res.data.productNetworkConfig;
								if (networkProductionIPList.length !== 0) {
									networkProductionIPList.forEach((item) => {
										item.ipFlag = false; // ip校验标识
										item.ipFlagTip = ''; // ip校验提示
										item.netmaskFlag = false; // 子网掩码校验标识
										item.remotePortFlag = false; // 连接端口校验标识
										item.swithPortFlag = false; // 交换机端口校验标识
										item.gatewayFlag = false; // 网关校验标识
										item.macFlag = false; // mac地址校验标识
									});
									_t.networkProductionIPList = networkProductionIPList;
								}
								// 光纤交换机数据 判断长度
								var serverHbaConfig = res.data.serverHbaConfig === null ? [] : res.data.serverHbaConfig;
								// 没有光纤交换机
								if (serverHbaConfig.length === 0) {
									// 初始化主备光纤交换机数据
								} else if (serverHbaConfig.length === 1) {
									// 下标为0的 作为主光纤交换机的数据
									// 下标为1 作为备光纤交换机的数据
									serverHbaConfig[0].switchPortFlag = false;
									_t.networkSwitchListMap = serverHbaConfig[0];
									_t.networkSwitchItemMap = {
										id: null,
										deviceId: _t.activeDeviceId,
										name: '',
										wwnn: '',
										wwpn: '',
										fcSwitch: '',
										switchPort: '',
										switchPortFlag: false,
									};
								} else if (serverHbaConfig.length > 1) {
									// 下标为0的 作为主光纤交换机的数据
									// 下标为1 作为备光纤交换机的数据
									serverHbaConfig[0].switchPortFlag = false; // 增加主光纤端口校验标识
									serverHbaConfig[1].switchPortFlag = false; // 增加备光纤端口校验标识
									_t.networkSwitchListMap = serverHbaConfig[0];
									_t.networkSwitchItemMap = serverHbaConfig[1];
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 获取网络配置之前重置表单数据
			resetNetWorkFormData() {
				var _t = this;
				// 带外网 信息集合 置空
				_t.networkOOBIpList = []; // 带外网信息集合
				_t.networkProductionIPList = []; // 生产网信息集合
				_t.networkSwitchList = []; // 交换机下拉框数据
				// 重置 主光纤交换机数据
				_t.networkSwitchListMap.id = null;
				_t.networkSwitchListMap.deviceId = _t.activeDeviceId;
				_t.networkSwitchListMap.name = '';
				_t.networkSwitchListMap.wwnn = '';
				_t.networkSwitchListMap.wwpn = '';
				_t.networkSwitchListMap.fcSwitch = '';
				_t.networkSwitchListMap.switchPort = '';
				_t.networkSwitchListMap.switchPortFlag = false;
				// 重置 备光纤交换机数据
				_t.networkSwitchItemMap.id = null;
				_t.networkSwitchItemMap.deviceId = _t.activeDeviceId;
				_t.networkSwitchItemMap.name = '';
				_t.networkSwitchItemMap.wwnn = '';
				_t.networkSwitchItemMap.wwpn = '';
				_t.networkSwitchItemMap.fcSwitch = '';
				_t.networkSwitchItemMap.switchPort = '';
				_t.networkSwitchItemMap.switchPortFlag = false;
				// 设备类型
				_t.netWorkAssetDevice.type = '';
			},
			// 网络配置 --> 添加带外Ip信息
			addNetworkOOB() {
				var _t = this;
				var networkOOBMap = {
					id: null,
					isOobip: true, // 是否带外IP
					deviceId: _t.activeDeviceId, // 设备id
					ip: '', // IP
					ipFlag: false, // ip校验标识
					ipFlagTip: '', // ip校验提示
					ethernetSwitch: '', // 交换机
					netmask: '', // 子网掩码
					netmaskFlag: false, // 子网掩码校验标识
					swithPort: '', // 端口
					swithPortFlag: false, // 端口校验标识
					gateway: '', // 网关
					gatewayFlag: false, // 网关校验标识
					mac: '', // mac地址
					macFlag: false, // mac校验标识
				};
				_t.networkOOBIpList.push(networkOOBMap);
			},
			// 网络配置 --> 添加生产IP信息
			addNetWorkProduction() {
				var _t = this;
				var networkProductionMap = {
					id: null,
					isOobip: false, // 是否带外IP
					deviceId: _t.activeDeviceId, // 设备id
					ip: '', // IP
					ipFlag: false, // ip校验标识
					ipFlagTip: '', // ip校验提示
					os: '', // 操作系统
					remoteType: '', // 连接方式
					ethernetSwitch: '',// 交换机
					netmask: '', // 子网掩码
					netmaskFlag: false, // 子网掩码校验标识
					remoteUsername: '', // 用户名
					remotePort: '', // 连接端口
					remotePortFlag: false, // 连接端口校验标识
					swithPort: '', // 交换机端口
					swithPortFlag: false, // 交换机端口校验标识
					gateway: '', // 网关
					gatewayFlag: false, // 网关校验标识
					remotePassword: '', // 密码
					mac: '', // MAC
					macFlag: false, // mac校验标识
				};
				_t.networkProductionIPList.push(networkProductionMap);
			},
			// 网络配置 --> 删除带外IP
			deleteOOBMap(index) {
				var _t = this;
				_t.networkOOBIpList.splice(index, 1);
			},
			// 网络配置 --> 删除生产IP
			deleteProductionMap(index) {
				var _t = this;
				_t.networkProductionIPList.splice(index, 1);
			},
			// 校验带外信息ip或者生产信息IP
			blurNetworkOOBRule(item) {
				var _t = this;
				// 为空
				if (item.ip === null || item.ip.trim() === '') {
					item.ipFlag = true;
					item.ipFlagTip = _t.$t('public.isNotNull');
				} else {
					// 不为空 开始校验 ip格式是否正确
					var reg = _t.$api.isIpNumber();
					if (reg.test(item.ip.trim()) === false) {
						item.ipFlag = true;
						item.ipFlagTip = _t.$t('public.ipFormatTip');
					} else {
						item.ipFlag = false;
						item.ipFlagTip = '';
					}
				}
			},
			// 校验输入的ip地址 是否正确 可为空
			blurNetWorkIP(item, val) {
				var _t = this;
				if (item[val] !== null && item[val].trim() !== '') {
					var reg = _t.$api.isIpNumber();
					if (reg.test(item[val].trim()) === false) {
						item[val + 'Flag'] = true;
					} else {
						item[val + 'Flag'] = false;
					}
				} else {
					item[val + 'Flag'] = false;
				}
			},
			// 校验输入的mac地址是否正确
			blurNetworkMac(item, val) {
				var _t = this;
				if (item[val] !== null && item[val].trim() !== '') {
					var reg = _t.$api.isMacNumber();
					if (reg.test(item[val].trim()) === false) {
						item[val + 'Flag'] = true;
					} else {
						item[val + 'Flag'] = false;
					}
				} else {
					item[val + 'Flag'] = false;
				}
			},
			// 校验 输入的端口 是否正确
			blurNetWorkPort(item, val) {
				var _t = this;
				if (item[val] !== null && item[val].trim() !== '') {
					var reg = _t.$api.isNumber();
					if (reg.test(item[val].trim()) === false) {
						item[val + 'Flag'] = true;
					} else {
						item[val + 'Flag'] = false;
					}
				} else {
					item[val + 'Flag'] = false;
				}
			},
			// 保存网络配置
			saveNetWorkList() {
				var _t = this;
				// 校验为空 字段个数
				var isNullRuleNumber = 0;
				// 循环带外信息IP集合中为空的条数
				_t.networkOOBIpList.forEach((item) => {
					// 判断如果ip为空
					_t.blurNetworkOOBRule(item);
					// 校验ip
					if (item.ipFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 子网掩码
					if (item.netmaskFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 网关
					if (item.gatewayFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 端口
					if (item.swithPortFlag === true) {
						isNullRuleNumber++;
					}
					// 校验mac地址
					if (item.macFlag === true) {
						isNullRuleNumber++;
					}
				});
				// 循环生产信息Ip集合中为空的条数
				_t.networkProductionIPList.forEach((item) => {
					// 判断如果ip为空
					_t.blurNetworkOOBRule(item);
					// 校验 ip
					if (item.ipFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 子网掩码
					if (item.netmaskFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 网关
					if (item.gatewayFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 交换机端口
					if (item.swithPortFlag === true) {
						isNullRuleNumber++;
					}
					// 校验 连接端口
					if (item.remotePortFlag === true) {
						isNullRuleNumber++;
					}
					// 校验mac地址
					if (item.macFlag === true) {
						isNullRuleNumber++;
					}
				});
				// 判断是否可以保存 0代表没有为空
				if (isNullRuleNumber === 0) {
					_t.network_loading = true;
					var serverHbaConfig = new Array();
					serverHbaConfig[0] = _t.networkSwitchListMap;
					serverHbaConfig[1] = _t.networkSwitchItemMap;
					_t.$api.post('asset/assetDevice/networkInfo/save', {
						assetDevice: {
							id: _t.activeDeviceId,
							type: _t.netWorkAssetDevice.type
						},
						oobNetworkConfig: _t.networkOOBIpList,
						productNetworkConfig: _t.networkProductionIPList,
						serverHbaConfig: serverHbaConfig
					}, function (res) {
						_t.network_loading = false;
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formNetworkSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getNetWorkListData();
								}).catch(() => {
									_t.getNetWorkListData();
								});
								break;
							case 400:
								_t.$alert(_t.$t('editAdministrationTabs.formNetworkErrorTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getNetWorkListData();
								}).catch(() => {
									_t.getNetWorkListData();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			/**
			 * 采购和维保 页签
			 */
			// 获取采购和维保接口数据 -- 和基本信息的接口一致
			getMaintenanceList() {
				var _t = this;
				// 获取数据之前重置 表单校验判断信息
				_t.resetMaintenanceList();
				_t.maintenance_loading = true;
				_t.$api.get('asset/assetDevice/editInfo/' + _t.activeDeviceId, {}, function (res) {
					_t.maintenance_loading = false;
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.assetDevice && res.data.assetDevice !== null) {
									var assetDevice = res.data.assetDevice;
									// 维保信息模块
									_t.maintenanceFormMap.deviceId = assetDevice.id; // 设备id
									_t.maintenanceFormMap.warrantyType = assetDevice.warrantyType === null ? '' : assetDevice.warrantyType; // 维保类型
									_t.maintenanceFormMap.serviceAgent = assetDevice.serviceAgent === null ? '' : assetDevice.serviceAgent; // 维保商
									_t.maintenanceFormMap.factorTime = assetDevice.dateManufacture === null ? '' : assetDevice.dateManufacture; // 出厂日期
									// 区分维保类型 0 原厂维保 1 第三方维保
									// 先缓存 原厂维保和第三方维保的字段信息 然后根据维保类型 给对应的输入框加载数据
									_t.maintenanceFormMap.warrantyStartTime = assetDevice.warrantyStartTime === null ? '' : assetDevice.warrantyStartTime; // 原厂维保开始日期
									_t.maintenanceFormMap.warrantyEndTime = assetDevice.warrantyEndTime === null ? '' : assetDevice.warrantyEndTime; // 原厂维保结束日期
									_t.maintenanceFormMap.warrantyPeriod = assetDevice.warrantyPeriod === null ? '' : assetDevice.warrantyPeriod; // 原厂维保期限
									_t.maintenanceFormMap.otherWarrantyStartTime = assetDevice.otherWarrantyStartTime === null ? '' : assetDevice.otherWarrantyStartTime; // 第三方维保开始日期
									_t.maintenanceFormMap.otherWarrantyExpireTime = assetDevice.otherWarrantyExpireTime === null ? '' : assetDevice.otherWarrantyExpireTime; // 第三方维保结束日期
									_t.maintenanceFormMap.otherWarrantyPeriod = assetDevice.otherWarrantyPeriod === null ? '' : assetDevice.otherWarrantyPeriod; // 第三方维保期限
									if (_t.maintenanceFormMap.warrantyType === 0) {
										_t.maintenanceFormMap.startTime = _t.maintenanceFormMap.warrantyStartTime;
										_t.maintenanceFormMap.endTime = _t.maintenanceFormMap.warrantyEndTime;
										_t.maintenanceFormMap.timeLength = _t.maintenanceFormMap.warrantyPeriod;
									} else if (_t.maintenanceFormMap.warrantyType === 1) {
										_t.maintenanceFormMap.startTime = _t.maintenanceFormMap.otherWarrantyStartTime;
										_t.maintenanceFormMap.endTime = _t.maintenanceFormMap.otherWarrantyExpireTime;
										_t.maintenanceFormMap.timeLength = _t.maintenanceFormMap.otherWarrantyPeriod;
									} else {
										// 没有维保类型
										_t.maintenanceFormMap.startTime = '';
										_t.maintenanceFormMap.endTime = '';
										_t.maintenanceFormMap.timeLength = '';
									}
									// 设备采购信息模块
									_t.maintenanceFormMap.orderNum = assetDevice.purchaseOrderNo === null ? '' : assetDevice.purchaseOrderNo; // 订单编号
									_t.maintenanceFormMap.purchasePrice = assetDevice.purchasePrice === null ? '' : assetDevice.purchasePrice.toString(); // 采购金额
									_t.maintenanceFormMap.purchaseSupply = assetDevice.purchaseSupply === null ? '' : assetDevice.purchaseSupply; // 供应商
									_t.maintenanceFormMap.purchaseTime = assetDevice.purchaseTime === null ? '' : assetDevice.purchaseTime; // 采购日期
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 重置 采购和维保 表单校验字段
			resetMaintenanceList() {
				var _t = this;
				_t.errorMaintenanceError.startTimeFlag = false; // 开始日期
				_t.errorMaintenanceError.startTimeFlagTip = '';
				_t.errorMaintenanceError.endTimeFlag = false; // 结束日期
				_t.errorMaintenanceError.endTimeFlagTip = '';
				_t.errorMaintenanceError.warrantyTypeFlag = false; // 维保类型
				_t.errorMaintenanceError.warrantyTypeFlagTip = '';
				_t.errorMaintenanceError.purchasePriceFlag = false; // 采购金额
				_t.errorMaintenanceError.purchasePriceFlagTip = '';
			},
			// 改变维保类型下拉框数据
			changeSelectWarrantyType(val) {
				var _t = this;
				if (val === '') {
					_t.errorMaintenanceError.warrantyTypeFlag = true;
					_t.errorMaintenanceError.warrantyTypeFlagTip = _t.$t('public.isNotNull');
					// 维保类型为空 取消开始日期、结束日期、维保期限的选中值
					_t.maintenanceFormMap.startTime = '';
					_t.maintenanceFormMap.endTime = '';
					_t.maintenanceFormMap.timeLength = '';
					_t.changeStartTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
					_t.changeEndTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
				} else {
					_t.errorMaintenanceError.warrantyTypeFlag = false;
					_t.errorMaintenanceError.warrantyTypeFlagTip = '';
					// 判断维保类型
					if (_t.maintenanceFormMap.warrantyType === 0) {
						// 原厂维保
						_t.maintenanceFormMap.startTime = _t.maintenanceFormMap.warrantyStartTime;
						_t.maintenanceFormMap.endTime = _t.maintenanceFormMap.warrantyEndTime;
						_t.maintenanceFormMap.timeLength = _t.maintenanceFormMap.warrantyPeriod;
					} else if (_t.maintenanceFormMap.warrantyType === 1) {
						// 第三方维保
						_t.maintenanceFormMap.startTime = _t.maintenanceFormMap.otherWarrantyStartTime;
						_t.maintenanceFormMap.endTime = _t.maintenanceFormMap.otherWarrantyExpireTime;
						_t.maintenanceFormMap.timeLength = _t.maintenanceFormMap.otherWarrantyPeriod;
					}
					_t.changeStartTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
					_t.changeEndTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
				}
			},
			// 校验采购金额格式是否正确
			blurMoneyRule(value) {
				var _t = this;
				if (value !== null && value.trim() !== '') {
					var reg = _t.$api.isMoneyNumber();
					if (reg.test(value.trim()) === false) {
						_t.errorMaintenanceError.purchasePriceFlag = true;
						_t.errorMaintenanceError.purchasePriceFlagTip = _t.$t('public.formatTip');
					} else {
						_t.errorMaintenanceError.purchasePriceFlag = false;
						_t.errorMaintenanceError.purchasePriceFlagTip = '';
					}
				}
			},
			// 保存采购和维保接口
			saveMaintenanceList() {
				var _t = this;
				// 校验维保类型 是否为空
				_t.changeSelectWarrantyType(_t.maintenanceFormMap.warrantyType);
				// 手动校验 开始日期
				_t.changeStartTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
				// 手动校验 结束日期
				_t.changeEndTime(_t.maintenanceFormMap.startTime, _t.maintenanceFormMap.endTime);
				// 校验 采购金额 校验格式是否正确
				_t.blurMoneyRule(_t.maintenanceFormMap.purchasePrice);
				// 判断是否可以提交
				if (_t.errorMaintenanceError.warrantyTypeFlag === false
					&& _t.errorMaintenanceError.purchasePriceFlag === false
					&& _t.errorMaintenanceError.startTimeFlag === false
					&& _t.errorMaintenanceError.endTimeFlag === false) {
					_t.maintenance_loading = true;
					// 处理原厂维保和第三方维保
					var warrantyStartTime = ''; // 原厂维保开始日期
					var warrantyEndTime = ''; // 原厂维保结束日期
					var warrantyPeriod = ''; // 原厂维保期限
					var otherWarrantyStartTime = ''; // 第三方维保开始日期
					var otherWarrantyExpireTime = ''; // 第三方维保结束日期
					var otherWarrantyPeriod = ''; // 第三方维保期限
					if (_t.maintenanceFormMap.warrantyType === 0) {
						// 原厂维保开始日期
						var startTime = new Date(_t.maintenanceFormMap.startTime).getTime();
						warrantyStartTime = dateFilterDay(startTime);
						// 原厂维保结束日期
						var endTime = new Date(_t.maintenanceFormMap.endTime).getTime();
						warrantyEndTime = dateFilterDay(endTime);
						// 原厂维保维保期限
						warrantyPeriod = _t.maintenanceFormMap.timeLength;
						// 第三方维保开始日期
						var otherStartTime = new Date(_t.maintenanceFormMap.otherWarrantyStartTime).getTime();
						otherWarrantyStartTime = dateFilterDay(otherStartTime);
						// 第三方维保结束日期
						var otherEndTime = new Date(_t.maintenanceFormMap.otherWarrantyExpireTime).getTime();
						otherWarrantyExpireTime = dateFilterDay(otherEndTime);
						otherWarrantyPeriod = _t.maintenanceFormMap.otherWarrantyPeriod;
					} else if (_t.maintenanceFormMap.warrantyType === 1) {
						// 第三方维保开始日期
						var startTime = new Date(_t.maintenanceFormMap.startTime).getTime();
						otherWarrantyStartTime = dateFilterDay(startTime);
						// 第三方维保结束日期
						var endTime = new Date(_t.maintenanceFormMap.endTime).getTime();
						otherWarrantyExpireTime = dateFilterDay(endTime);
						// 第三方维保维保期限
						otherWarrantyPeriod = _t.maintenanceFormMap.timeLength;
						// 原厂维保开始日期
						var otherStartTime = new Date(_t.maintenanceFormMap.warrantyStartTime).getTime();
						warrantyStartTime = dateFilterDay(otherStartTime);
						// 原厂维保结束日期
						var otherEndTime = new Date(_t.maintenanceFormMap.warrantyEndTime).getTime();
						warrantyEndTime = dateFilterDay(otherEndTime);
						warrantyPeriod = _t.maintenanceFormMap.warrantyPeriod;
					}
					// 转换采购日期
					var purchaseTime = '';
					if (_t.maintenanceFormMap.purchaseTime !== null) {
						var time = new Date(_t.maintenanceFormMap.purchaseTime).getTime();
						purchaseTime = dateFilterDay(time);
					} else {
						purchaseTime = '';
					}
					// 转换出厂日期
					var dateManufacture = '';
					if (_t.maintenanceFormMap.factorTime !== null) {
						var time = new Date(_t.maintenanceFormMap.factorTime).getTime();
						dateManufacture = dateFilterDay(time);
					} else {
						dateManufacture = '';
					}
					_t.$api.post('asset/assetDevice/editInfo/save', {
						assetDevice: {
							id: _t.maintenanceFormMap.deviceId, // 设备id
							warrantyType: _t.maintenanceFormMap.warrantyType === '' ? null : _t.maintenanceFormMap.warrantyType, // 维保类型
							serviceAgent: _t.maintenanceFormMap.serviceAgent === '' ? null : _t.maintenanceFormMap.serviceAgent, // 维保商
							warrantyStartTime: warrantyStartTime === '' ? null : warrantyStartTime, // 原厂维保开始日期
							warrantyEndTime: warrantyEndTime === '' ? null : warrantyEndTime, // 原厂维保结束日期
							warrantyPeriod: warrantyPeriod === '' ? null : warrantyPeriod, // 原厂维保期限
							otherWarrantyStartTime: otherWarrantyStartTime === '' ? null : otherWarrantyStartTime,  //  第三方维保开始时间
							otherWarrantyExpireTime: otherWarrantyExpireTime === '' ? null : otherWarrantyExpireTime, // 第三方维保结束时间
							otherWarrantyPeriod: otherWarrantyPeriod === '' ? null : otherWarrantyPeriod, // 第三方维保期限
							dateManufacture: dateManufacture === '' ? null : dateManufacture, // 出厂日期
							purchaseOrderNo: _t.maintenanceFormMap.orderNum === '' ? null : _t.maintenanceFormMap.orderNum, // 订单编号
							purchasePrice: _t.maintenanceFormMap.purchasePrice.trim() === '' ? null : Number(_t.maintenanceFormMap.purchasePrice.trim()), // 订单金额
							purchaseSupply: _t.maintenanceFormMap.purchaseSupply === '' ? null : _t.maintenanceFormMap.purchaseSupply, // 供应商
							purchaseTime: purchaseTime === '' ? null : purchaseTime, // 采购日期
						}
					}, function (res) {
						_t.maintenance_loading = false;
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('editAdministrationTabs.formBaseInfoSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									// 修改成功之后调取最新的维保数据
									_t.getMaintenanceList();
								}).catch(() => {
									// 修改成功之后调取最新的维保数据
									_t.getMaintenanceList();
								});
								break;
							default:
								break;
						}
					});
				}
			},
			// 改变开始日期
			changeStartTime(dateStart, dateEnd) {
				var _t = this;
				if (dateStart === '' || dateStart === null) {
					_t.errorMaintenanceError.startTimeFlag = true;
					_t.errorMaintenanceError.startTimeFlagTip = _t.$t('public.isNotNull');
				} else {
					// 和结束时间做对比
					if (dateEnd === '' || dateEnd === null) {
						_t.errorMaintenanceError.startTimeFlag = false;
						_t.errorMaintenanceError.startTimeFlagTip = '';
					} else {
						var start = new Date(dateStart).getTime();
						var end = new Date(dateEnd).getTime();
						if (end - start < 0) {
							_t.errorMaintenanceError.startTimeFlag = true;
							_t.errorMaintenanceError.startTimeFlagTip = _t.$t('editAdministrationTabs.formRuleStartEnd');
						} else {
							_t.errorMaintenanceError.startTimeFlag = false;
							_t.errorMaintenanceError.startTimeFlagTip = '';
							_t.errorMaintenanceError.endTimeFlag = false;
							_t.errorMaintenanceError.endTimeFlagTip = '';
							// 计算维保期限
							// 开始日期
							var startTime = new Date(_t.maintenanceFormMap.startTime).getTime();
							startTime = dateFilterDay(startTime);
							// 结束日期
							var endTime = new Date(_t.maintenanceFormMap.endTime).getTime();
							endTime = dateFilterDay(endTime);
							_t.maintenanceFormMap.timeLength = _t.calculatePeriod(startTime, endTime);
							// 改变开始日期时 开始日期有值 判断维保类型缓存
							if (_t.maintenanceFormMap.warrantyType === 0) {
								// 原厂维保
								_t.maintenanceFormMap.warrantyPeriod = _t.maintenanceFormMap.timeLength;
							} else if (_t.maintenanceFormMap.warrantyType === 1) {
								// 第三方维保
								_t.maintenanceFormMap.otherWarrantyPeriod = _t.maintenanceFormMap.timeLength;
							} else {
								// 没有维保类型
							}
						}
					}
					// 改变开始日期时 开始日期有值 判断维保类型缓存
					if (_t.maintenanceFormMap.warrantyType === 0) {
						// 原厂维保
						_t.maintenanceFormMap.warrantyStartTime = _t.maintenanceFormMap.startTime;
					} else if (_t.maintenanceFormMap.warrantyType === 1) {
						// 第三方维保
						_t.maintenanceFormMap.otherWarrantyStartTime = _t.maintenanceFormMap.startTime;
					} else {
						// 没有维保类型
					}
				}
			},
			// 改变结束日期
			changeEndTime(dateStart, dateEnd) {
				var _t = this;
				if (dateEnd === '' || dateEnd === null) {
					_t.errorMaintenanceError.endTimeFlag = true;
					_t.errorMaintenanceError.endTimeFlagTip = _t.$t('public.isNotNull');
				} else {
					// 和开始时间做对比
					if (dateStart === '' || dateStart === null) {
						_t.errorMaintenanceError.endTimeFlag = false;
						_t.errorMaintenanceError.endTimeFlagTip = '';
					} else {
						var start = new Date(dateStart).getTime();
						var end = new Date(dateEnd).getTime();
						if (end - start < 0) {
							_t.errorMaintenanceError.endTimeFlag = true;
							_t.errorMaintenanceError.endTimeFlagTip = _t.$t('editAdministrationTabs.formRuleEndStart');
						} else {
							_t.errorMaintenanceError.startTimeFlag = false;
							_t.errorMaintenanceError.startTimeFlagTip = '';
							_t.errorMaintenanceError.endTimeFlag = false;
							_t.errorMaintenanceError.endTimeFlagTip = '';
							// 计算维保期限
							// 开始日期
							var startTime = new Date(_t.maintenanceFormMap.startTime).getTime();
							startTime = dateFilterDay(startTime);
							// 结束日期
							var endTime = new Date(_t.maintenanceFormMap.endTime).getTime();
							endTime = dateFilterDay(endTime);
							_t.maintenanceFormMap.timeLength = _t.calculatePeriod(startTime, endTime);
							// 改变结束日期时 结束日期有值 判断维保类型缓存
							if (_t.maintenanceFormMap.warrantyType === 0) {
								// 原厂维保
								_t.maintenanceFormMap.warrantyPeriod = _t.maintenanceFormMap.timeLength;
							} else if (_t.maintenanceFormMap.warrantyType === 1) {
								// 第三方维保
								_t.maintenanceFormMap.otherWarrantyPeriod = _t.maintenanceFormMap.timeLength;
							} else {
								// 没有维保类型
							}
						}
					}
					// 改变结束日期时 结束日期有值 判断维保类型缓存
					if (_t.maintenanceFormMap.warrantyType === 0) {
						// 原厂维保
						_t.maintenanceFormMap.warrantyEndTime = _t.maintenanceFormMap.endTime;
					} else if (_t.maintenanceFormMap.warrantyType === 1) {
						// 第三方维保
						_t.maintenanceFormMap.otherWarrantyExpireTime = _t.maintenanceFormMap.endTime;
					} else {
						// 没有维保类型
					}
				}
			},
			// 计算维保期限 startDate开始日期,endDate结束日期
			calculatePeriod(startDate, endDate) {
				var monthCount = 0;
				startDate = startDate.replace(/-/g, "/");
				endDate = endDate.replace(/-/g, "/");
				if (startDate.length == 0 || endDate.length == 0) return;
				var startTime = new Date(startDate);
				var endTime = new Date(endDate);
				if (startTime && endTime) {
					//若开始时间比结束时间大，则对调后再比较
					if (startTime > endTime) {
						var _temp = endTime;
						endTime = startTime;
						startTime = _temp;
					}
					var startDateArr = startDate.split("/");
					var endDateArr = endDate.split("/");
					var yearNum = parseInt(endDateArr[0] - startDateArr[0]);
					var monthNum = parseInt(endDateArr[1] - startDateArr[1]);
					var dateNum = parseInt(endDateArr[2] - startDateArr[2]);
					if (dateNum >= 15) monthNum++;
					if (dateNum < -15) monthNum--;
					monthCount = yearNum * 12 + monthNum;
				}
				return monthCount;
			}
		},
		/**
		 * 监听 设备id 的变化
		 */
		watch: {
			// 监听设备id的变化
			pageDeviceId: function (newData, oldData) {
				// newData 为新传入的 设备id
				var _t = this;
				if (newData !== null && newData !== '') {
					// 给 标签页的 设备id 变量赋值
					_t.activeDeviceId = newData;
					// 标签页 设备名称页签赋值
					_t.activeDeviceName = _t.pageDeviceName;
					var indexOf = false; // 判断有没有这个页签
					var editableTabsValue = ''; // 当前页签

					_t.editableTabs.forEach((t) => {
						if (newData === t.dataId) {
							indexOf = true;
							editableTabsValue = t.name;
						}
					});
					if (indexOf) {
						// 有这个页签 跳转到这个页签
						_t.editableTabsValue = editableTabsValue;
						// 有页签 获取对应的设备标签下的小标签
						if (_t.diffDeviceStatus[_t.editableTabsValue]) {
							_t.activeNameTabs = _t.diffDeviceStatus[_t.editableTabsValue];
							if (_t.activeNameTabs === 'one') {
								// 依次获取 厂商型号 设备责任人 机房机架 数据回显
								_t.getManufacturerAndModelData();
							} else if (_t.activeNameTabs === 'two') {
								_t.activeHardWareName = 'cpuCard';
								// 调取硬件配置接口信息
								_t.getHardwareData();
							} else if (_t.activeNameTabs === 'three') {
								// 调取网络配置接口
								_t.getNetWorkListData();
							} else if (_t.activeNameTabs === 'four') {
								// 调取采购和维保接口
								_t.getMaintenanceList();
							}
						}
						// 有页签 点击调取数据 蒙版并 改变设备id
						_t.clickTabs();
					} else {
						// 没有这个页签 添加该页签
						_t.addTab(_t.activeDeviceName, _t.activeDeviceId);

						// 判断选中标签设备id 对应的 name
						_t.editableTabs.forEach((t) => {
							if (t.dataId === _t.activeDeviceId) {
								if (_t.diffDeviceStatus[t.name] === undefined) {
									_t.diffDeviceStatus[t.name] = _t.activeNameTabs;
								}
							}
						});
					}
					// 更新设备基本信息
					_t.getEquipmentInfoData();
					// 更新设备整体状态
					_t.getEquipmentAllStatusData();

					// 标签页 默认显示 这里默认调用
					if (_t.activeNameTabs === 'one') {
						// 依次获取 厂商型号 设备责任人 机房机架 数据回显
						_t.getManufacturerAndModelData();
					}
				}
			}
		}
	}
</script>

<style scoped>
	.equipmentDetail-info-box {
		width: 250px;
		position: absolute;
		top: 0;
		overflow-y: auto;
		bottom: 0;
	}

	.administration-title {
		line-height: 30px;
		height: 30px;
		font-size: 12px;
		padding-left: 10px;
	}

	.administration-box {
		position: absolute;
		top: 30px;
		left: 20px;
		right: 20px;
		bottom: 0;
	}

	.titleBgBox {
		line-height: 36px;
		height: 36px;
		padding-left: 20px;
		margin: 20px 0;
	}

	.inputMaxWidth {
		max-width: 410px;
	}

	.inputMaxWidthBusiness {
		max-width: 320px;
	}

	.inputMaxWidth240 {
		max-width: 240px;
	}

	.selectBlock {
		display: block;
	}

	.hardWareCpuBox {
		display: flex;
		margin-bottom: 10px;
	}

	.hardWareCpuBox > .title {
		vertical-align: middle;
		padding: 0 15px;
		line-height: 30px;
		height: 30px;
		color: #3F81D0;
	}

	.hardWareCpuBox > .line {
		vertical-align: middle;
		flex: 1;
		border-top: 1px dashed #ddd;
		margin-top: 15px;
		margin-right: 20px;
	}

	.hardWareCpu_hoverBox {
		padding: 10px 10px 0 0;
	}

	.hardWareCpu_hoverBox:hover {
		background-color: #f4f4f4;
	}

	.networkTitleBox {
		padding: 5px;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.networkTitleBox:nth-child(1) {
		margin-top: 0;
	}

	.networkTitleBox > span {
		line-height: 30px;
		height: 30px;
		padding-left: 10px;
		display: inline-block;
	}

	.FormBorderColor {
		max-width: 1150px;
		padding: 0 10px 20px;
		border: 1px solid #cfcfd0;
		border-radius: 5px;
	}

	.network_TitleBox {
		padding: 5px 0 5px 20px;
		line-height: 30px;
		margin: 20px 0;
	}
</style>
<style>
	.group_append .el-input-group__append {
		border: none;
		padding: 0 10px;
	}

	.administration-box .box-wrap {
		padding: 30px 10px 0 10px;
		position: absolute;
	}

	.administration-info-box .el-form-item {
		font-size: 12px;
		margin-bottom: 0;
	}

	/*标签页头部*/
	.monitoringDetails-header.el-tabs--card > .el-tabs__header {
		position: absolute;
		top: 0;
		left: 260px;
		right: 0;
		padding-top: 5px;
		margin-bottom: 0 !important;
	}

	.monitoringDetails-header.el-tabs--card > .el-tabs__content {
		position: absolute;
		top: 40px;
		bottom: 10px;
		left: 260px;
		right: 0;
		overflow-y: auto;
		padding: 0 10px;
	}

	.monitoringDetails-header > .el-tabs__header.is-top .el-tabs__nav-scroll {
		padding: 0 20px;
	}

	.monitoringDetails-header > .el-tabs__header > .el-tabs__nav-wrap.is-top .el-tabs__item.is-active {
		border-radius: 10px 10px 0 0;
		position: relative;
	}

	.monitoringDetails-header > .el-tabs__header .el-tabs__item.is-active:before,
	.monitoringDetails-header > .el-tabs__header .el-tabs__item.is-active:after {
		position: absolute;
		content: '';
		display: inline-block;
		bottom: 2px;
		width: 10px;
		height: 10px;
	}

	.monitoringDetails-header > .el-tabs__header .el-tabs__item.is-active:before {
		border-radius: 0 0 10px 0;
		left: -10px;
	}

	.monitoringDetails-header > .el-tabs__header .el-tabs__item.is-active:after {
		border-radius: 0 0 0 10px;
		right: -10px;
	}

	.monitoringDetails-header > .el-tabs__header.is-top .el-tabs__item {
		height: 35px;
		line-height: 35px;
		font-size: 12px;
	}

	.baseInfo_businessDialog .el-dialog {
		width: 500px;
		height: 350px;
	}

	/*硬件配置*/
	.hardWare-tabsBox {
		position: absolute;
		top: 20px;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 10;
	}

	.hardWare-tabsBox > .el-tabs__item.is-active {
		font-weight: bold;
	}

	.hardWare-tabsBox > .el-tabs__header.is-left {
		width: 150px;
	}

	.hardWare-tabsBox > .el-tabs__content {
		position: absolute;
		top: 0;
		left: 160px;
		right: 0;
		bottom: 0;
		z-index: 11;
		overflow: auto;
		padding-right: 10px;
	}

	.monitoringDetails-header .inputMaxWidth.el-date-editor.el-input {
		width: 100%;
	}
</style>
