<template>
	<div class="tabs-Box">
		<el-tabs
			v-if="isShowTabBoxTitle"
			v-model="editableTabsValue"
			type="card"
			ref="alarmHistoryTabs"
			class="whiteBg"
			id="tabs-Box-tabs"
			tab-position="bottom"
			closable
			@tab-click="clickTabs"
			@tab-remove="removeTab">
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
						<div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentInfo')}}</strong></div>
						<!--设备基本信息-->
						<el-form label-width="96px" label-position="right" class="administration-info-box">
							<el-form-item v-for="(item,index) in equipmentInfoList" :key="index" :label="item.label + '：'"
														:title="item.value">
								{{item.value}}
							</el-form-item>
						</el-form>
						<div class="grayBg administration-title"><strong>{{$t('administrationTabs.equipmentAllStatus')}}</strong>
						</div>
						<!--设备整体状态-->
						<el-form label-width="96px" label-position="right" class="administration-info-box">
							<el-form-item v-for="(item,index) in equipmentAllStatus" :key="index" :label="item.name + '：'" :title="item.status">
								<span :class="item.level == '33' ? 'iconfontSuccess' :(item.level == '66' ? 'iconfontWarn':(item.level == '99' ? 'iconfontError':''))">{{item.status}}</span>
							</el-form-item>
						</el-form>
					</div>
					<!--内部标签页-->
					<el-tabs
						v-model="activeNameTabs"
						@tab-click="clickTabsTopTitle"
						class="monitoringDetails-header"
						type="card">
						<!--监测详情-->
						<el-tab-pane :label="$t('administrationTabs.monitorDetail')" name="one">
							<div class="clearfix" style="padding-top: 10px;">
								<el-form inline class="fl marginBottom10">
									<el-form-item v-if="AlarmSeverity[item.key] !== undefined"
																v-for="(item,index) in monitorStatusArr" :key="index">
										<el-tooltip effect="dark" :content="AlarmSeverity[item.key]" placement="top-start">
											<el-button type="text" style="color: #666;" @click="screenAlarmStatus(item.key)">
												<span v-if="item.key == 11" class="iconfont iconfontDisable">&#xe64b;</span>
												<span v-if="item.key == 22" class="iconfont iconfontLightBlue">&#xe64f;</span>
												<span v-if="item.key == 66" class="iconfont iconfontWarn">&#xe649;</span>
												<span v-if="item.key == 99" class="iconfont iconfontError">&#xe64a;</span>
												<span>{{item.value}}</span>
											</el-button>
										</el-tooltip>
									</el-form-item>
									<!--不显示到页面 从批量操作获取-->
									<el-form-item v-if="item.key == 38" v-for="(item,index) in monitorStatusArr" :key="index">
										<el-tooltip effect="dark" :content="WorkStatus['38']" placement="top-start">
											<el-button type="text" style="color: #666;" @click="screenAlarmStatus('38')">
												<span class="iconfont iconfontPrimary">&#xe650;</span>
												<span>{{item.value}}</span>
											</el-button>
										</el-tooltip>
									</el-form-item>
								</el-form>
								<el-form :model="formItem" inline class="fr marginBottom10">
									<el-form-item>
										<el-checkbox class="monitoringDetails-checkedBox" v-model="formItem.checked"
																 @change="changeChecked(formItem.checked)">
											{{$t('administrationTabs.tableOneExpend')}}
										</el-checkbox>
									</el-form-item>
									<el-form-item style="margin-bottom: 10px;margin-right: 5px;">
										<!--监测详情批量操作-->
										<el-tooltip type="dark" placement="top-start">
											<div slot="content">
												<span v-if="monitorWorkStatus == 11">{{$t('administrationTabs.formMonitorPauseTip')}}</span>
												<span
													v-else-if="monitorWorkStatus == 22">{{$t('administrationTabs.formMonitorIgnoreTip')}}</span>
												<span v-else>{{$t('administrationTabs.formMonitorSuccessTip')}}</span>
											</div>
											<el-select
												:disabled="monitorWorkStatus == 11 || monitorWorkStatus == 22"
												v-model="formItem.operation"
												@change="changeOperation(formItem.operation)">
												<el-option v-for="(item,index) in operationList" :key="index" :label="item.name"
																	 :value="item.type"/>
											</el-select>
										</el-tooltip>
									</el-form-item>
								</el-form>
							</div>
							<!--监测详情表格-->
							<el-table
								:data="monitoringDetailsData"
								:row-key="getMonitoringDetailsRowKey"
								:expand-row-keys="expandChange"
								@expand-change="expandChangeKeys"
								ref="table"
								@cell-click="cellClickColumnTable"
								stripe
								border
								:row-class-name="getClassName"
								@selection-change="monitoringChange">
								<el-table-column type="expand" header-align="left" align="left">
									<!--展开行-->
									<template slot-scope="scope">
										<el-table :data="scope.row.deviceMonitorListArr" border stripe
															class="monitoringDetails-innerTable" @cell-click="cellClickColumn">
											<el-table-column width="50px" :label="$t('administrationTabs.status')"
																			 header-align="center" align="center">
												<template slot-scope="scopeInset">
													<el-tooltip v-if="scopeInset.row.status == 11" effect="dark"
																			:content="AlarmSeverity[scopeInset.row.status]"
																			placement="top-start">
														<span class="iconfont iconfontDisable">&#xe64b;</span>
													</el-tooltip>
													<el-tooltip v-if="scopeInset.row.status == 22" effect="dark"
																			:content="AlarmSeverity[scopeInset.row.status]"
																			placement="top-start">
														<span class="iconfont iconfontLightBlue">&#xe64f;</span>
													</el-tooltip>
													<el-tooltip v-if="scopeInset.row.status == 33" effect="dark"
																			:content="AlarmSeverity[scopeInset.row.status]"
																			placement="top-start">
														<span class="iconfont iconfontSuccess">&#xe648;</span>
													</el-tooltip>
													<el-tooltip v-if="scopeInset.row.status == 66" effect="dark"
																			:content="AlarmSeverity[scopeInset.row.status]"
																			placement="top-start">
														<span class="iconfont iconfontWarn">&#xe649;</span>
													</el-tooltip>
													<el-tooltip v-if="scopeInset.row.status == 99" effect="dark"
																			:content="AlarmSeverity[scopeInset.row.status]"
																			placement="top-start">
														<span class="iconfont iconfontError">&#xe64a;</span>
													</el-tooltip>
												</template>
											</el-table-column>
											<el-table-column min-width="70px" prop="name"
																			 :label="$t('administrationTabs.resourceName')" header-align="left"
																			 align="left"/>
											<el-table-column min-width="150px" prop="statusText"
																			 :label="$t('administrationTabs.latestState')" header-align="left"
																			 align="left">
												<template slot-scope="scopeInset">
													<el-tooltip effect="dark" placement="left-start">
														<div slot="content" style="max-width: 200px">{{scopeInset.row.statusText}}
														</div>
														<span>{{scopeInset.row.statusText}}</span>
													</el-tooltip>
												</template>
											</el-table-column>
											<el-table-column width="160px" :label="$t('administrationTabs.updateTime')"
																			 header-align="center" align="center">
												<template slot-scope="scopeInset">
													<span>{{scopeInset.row.monitorTime | dateFilter}}</span>
												</template>
											</el-table-column>
											<el-table-column width="60px" :label="$t('public.operation')" header-align="center"
																			 align="center">
												<template slot-scope="scopeInset">
													<el-button type="text" @click="getMonitorThreshold(scopeInset.row)">
														{{$t('administrationTabs.threshold')}}
													</el-button>
												</template>
											</el-table-column>
										</el-table>
									</template>
								</el-table-column>
								<el-table-column width="50px" :label="$t('administrationTabs.status')" header-align="center"
																 align="center">
									<template slot-scope="scope">
										<el-tooltip v-if="scope.row.status == 11" effect="dark"
																:content="AlarmSeverity[scope.row.status]"
																placement="top-start">
											<span class="iconfont iconfontDisable">&#xe64b;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.status == 22" effect="dark"
																:content="AlarmSeverity[scope.row.status]"
																placement="top-start">
											<span class="iconfont iconfontLightBlue">&#xe64f;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.status == 33" effect="dark"
																:content="AlarmSeverity[scope.row.status]"
																placement="top-start">
											<span class="iconfont iconfontSuccess">&#xe648;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.status == 66" effect="dark"
																:content="AlarmSeverity[scope.row.status]"
																placement="top-start">
											<span class="iconfont iconfontWarn">&#xe649;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.status == 99" effect="dark"
																:content="AlarmSeverity[scope.row.status]"
																placement="top-start">
											<span class="iconfont iconfontError">&#xe64a;</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column width="200px" prop="name" :label="$t('administrationTabs.resourceName')"
																 header-align="left" align="left"/>
								<el-table-column :label="$t('administrationTabs.latestState')" header-align="left" align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" placement="left-start">
											<!--弹出提示区域-->
											<div slot="content" style="max-width: 200px">
												<!--根据工作状态判断 已暂停11 已忽略22 -->
												<div v-if="monitorWorkStatus == 11 || monitorWorkStatus == 22">
													<!--全部暂停或忽略-->
													<div v-if="scope.row.resultConcentStatus == 1">
														{{scope.row.resultConcent}} {{AlarmSeverity[scope.row.status]}}
													</div>
													<!--多种状态-->
													<div v-else-if="scope.row.resultConcentStatus == 2">
														<!--具体判断-->
														<span v-for="(x,y) in scope.row.resultConcent" :key="y">
												<!--key为null全部对象-->
												<span v-if="x.key == null">{{x.value}}</span>
												<span v-else-if="x.key !== '33'">{{x.value}}{{$t('administrationTabs.tableNum')}}</span>
												<span v-if="x.key == null">{{$t('administrationTabs.tableObjectNum')}}</span>
												<span v-else-if="x.key !== '33'">{{AlarmSeverity[scope.row.status]}}</span>
												&nbsp;<!--空格-->
											</span>
													</div>
													<!--没有判断直接显示-->
													<div v-else>{{scope.row.statusText}}</div>
												</div>
												<!--根据工作状态判断 非暂停和忽略 -->
												<div v-else>
													<!--全部正常-->
													<div v-if="scope.row.resultConcentStatus == 1">
														{{scope.row.resultConcent}} {{AlarmSeverity['33']}}
													</div>
													<!--多种状态-->
													<div v-else-if="scope.row.resultConcentStatus == 2">
														<!--具体判断-->
														<span v-for="(x,y) in scope.row.resultConcent" :key="y">
												<span v-if="x.key == null">{{x.value}}</span>
												<span v-else-if="x.key !== '33'">{{x.value}}{{$t('administrationTabs.tableNum')}}</span>
												<span v-if="x.key == null">{{$t('administrationTabs.tableObjectNum')}}</span>
												<span v-else-if="x.key !== '33'">{{AlarmSeverity[x.key]}}</span>
												&nbsp;<!--空格-->
											</span>
													</div>
													<!--没有判断直接显示-->
													<div v-else>{{scope.row.statusText}}</div>
												</div>
											</div>
											<!--表格显示区域-->
											<div>
												<!--根据工作状态判断 已暂停11 已忽略22 -->
												<div v-if="monitorWorkStatus == 11 || monitorWorkStatus == 22">
													<!--全部暂停或忽略-->
													<div v-if="scope.row.resultConcentStatus == 1"
															 :class="monitorWorkStatus == 11 ? 'iconfontDisable':(monitorWorkStatus == 22 ? 'iconfontLightBlue':'iconfontError')">
														{{scope.row.resultConcent}} {{AlarmSeverity[scope.row.status]}}
													</div>
													<!--多种状态-->
													<div v-else-if="scope.row.resultConcentStatus == 2">
														<!--具体判断-->
														<span v-for="(x,y) in scope.row.resultConcent" :key="y">
												<!--key为null全部对象-->
												<span class="iconfontSuccess" v-if="x.key == null">{{x.value}}</span>
												<span
													:class="scope.row.status == 11 ? 'iconfontDisable':(scope.row.status == 22 ? 'iconfontLightBlue':'iconfontError')"
													v-else-if="x.key !== '33'">{{x.value}}{{$t('administrationTabs.tableNum')}}</span>
												<span class="iconfontSuccess"
															v-if="x.key == null">{{$t('administrationTabs.tableObjectNum')}}</span>
												<span
													:class="scope.row.status == 11 ? 'iconfontDisable':(scope.row.status == 22 ? 'iconfontLightBlue':'iconfontError')"
													v-else-if="x.key !== '33'">{{AlarmSeverity[scope.row.status]}}</span>
												&nbsp;<!--空格-->
											</span>
													</div>
													<!--没有判断直接显示-->
													<div v-else>{{scope.row.statusText}}</div>
												</div>
												<!--根据工作状态判断 非暂停和忽略 -->
												<div v-else>
													<!--全部正常-->
													<div v-if="scope.row.resultConcentStatus == 1" class="iconfontSuccess">
														{{scope.row.resultConcent}} {{AlarmSeverity['33']}}
													</div>
													<!--多种状态-->
													<div v-else-if="scope.row.resultConcentStatus == 2">
														<!--具体判断-->
														<span v-for="(x,y) in scope.row.resultConcent" :key="y">
												<span class="iconfontSuccess" v-if="x.key == null">{{x.value}}</span>
												<span class="iconfontDisable" v-else-if="x.key !== '33'">{{x.value}}{{$t('administrationTabs.tableNum')}}</span>
												<span class="iconfontSuccess"
															v-if="x.key == null">{{$t('administrationTabs.tableObjectNum')}}</span>
												<span class="iconfontDisable" v-else-if="x.key !== '33'">{{AlarmSeverity[x.key]}}</span>
												&nbsp;<!--空格-->
											</span>
													</div>
													<!--没有判断直接显示-->
													<div v-else>{{scope.row.statusText}}</div>
												</div>
											</div>
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column width="160px" :label="$t('administrationTabs.updateTime')" header-align="center"
																 align="center">
									<template slot-scope="scope">
										<span>{{scope.row.monitorTime | dateFilter}}</span>
									</template>
								</el-table-column>
								<el-table-column width="60px" :label="$t('public.operation')" header-align="center" align="center">
									<template slot-scope="scope">
										<el-button type="text" @click="getMonitorThreshold(scope.row)">
											{{$t('administrationTabs.threshold')}}
										</el-button>
									</template>
								</el-table-column>
								<el-table-column type="selection" header-align="center" align="center"/>
							</el-table>
						</el-tab-pane>
						<!--告警事件-->
						<el-tab-pane :label="$t('administrationTabs.alarmEvent')" name="two">
							<el-form :model="alarmEvent" inline style="padding-top: 10px;">
								<el-form-item style="margin-right: 40px;">
									<el-radio-group v-model="alarmEvent.alarmIsHistory" @change="getAlarmListDataRadio">
										<el-radio :label="false">{{$t('administrationTabs.formAlarmCurrent')}}</el-radio>
										<el-radio :label="true">{{$t('administrationTabs.formAlarmHistory')}}</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item :label="$t('alarmCurrent.alarmLevelText') + '：'">
									<el-select v-model="alarmEvent.status" class="width200">
										<el-option v-for="(item,index) in alarmEventList" :key="index" :label="item.label"
															 :value="item.value"/>
									</el-select>
								</el-form-item>
								<el-form-item :label="$t('public.happenTime') + '：'">
									<el-date-picker
										v-model="alarmEvent.dateTime"
										type="daterange"
										:range-separator="$t('public.to')"
										:start-placeholder="$t('public.startTime')"
										:end-placeholder="$t('public.endTime')"
										:placeholder="$t('public.selectDate')"/>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" class="queryBtn" @click="getAlarmListData">{{$t('public.query')}}
									</el-button>
								</el-form-item>
							</el-form>
							<el-table :data="alarmListData" border stripe @row-click="alarmEventTableRow">
								<el-table-column width="60px" :label="$t('administrationTabs.level')" header-align="center"
																 align="center">
									<template slot-scope="scope">
										<el-tooltip v-if="scope.row.alarmLevel == 11" effect="dark"
																:content="AlarmSeverity[scope.row.alarmLevel]"
																placement="top-start">
											<span class="iconfont iconfontDisable">&#xe64b;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.alarmLevel == 22" effect="dark"
																:content="AlarmSeverity[scope.row.alarmLevel]"
																placement="top-start">
											<span class="iconfont iconfontLightBlue">&#xe64f;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.alarmLevel == 33" effect="dark"
																:content="AlarmSeverity[scope.row.alarmLevel]"
																placement="top-start">
											<span class="iconfont iconfontSuccess">&#xe648;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.alarmLevel == 66" effect="dark"
																:content="AlarmSeverity[scope.row.alarmLevel]"
																placement="top-start">
											<span class="iconfont iconfontWarn">&#xe649;</span>
										</el-tooltip>
										<el-tooltip v-if="scope.row.alarmLevel == 99" effect="dark"
																:content="AlarmSeverity[scope.row.alarmLevel]"
																placement="top-start">
											<span class="iconfont iconfontError">&#xe64a;</span>
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column prop="alarmNo" width="140px" :label="$t('administrationTabs.alarmNo')"
																 header-align="center" align="center"/>
								<el-table-column width="160px" :label="$t('administrationTabs.alarmStatus')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<span>{{AlarmHandleStatus[scope.row.status]}}</span>
									</template>
								</el-table-column>
								<el-table-column width="160px" :label="$t('administrationTabs.happenTime')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<span>{{scope.row.occurrenceTime | dateFilter}}</span>
									</template>
								</el-table-column>
								<el-table-column min-width="100px" prop="part" :label="$t('administrationTabs.alarmObject')"
																 header-align="left" align="left"/>
								<el-table-column min-width="200px" :label="$t('administrationTabs.latestState')" header-align="left"
																 align="left">
									<template slot-scope="scope">
										<el-tooltip effect="dark" placement="left-start">
											<div slot="content" style="max-width: 200px;">{{scope.row.currentStatus}}</div>
											<span>{{scope.row.currentStatus}}</span>
										</el-tooltip>
									</template>
								</el-table-column>
							</el-table>
							<!--分页-->
							<pages
								:total='optionsAlarm.total'
								:currentPage='optionsAlarm.currentPage'
								:page-size="optionsAlarm.pageSize"
								@handleSizeChangeSub="handleSizeChangeSubAlarm"
								@handleCurrentChangeSub="handleCurrentChangeAlarm"/>
						</el-tab-pane>
						<!--硬件配置-->
						<el-tab-pane :label="$t('administrationTabs.hardware')" name="three">
							<div class="padding10">
								<el-tabs v-model="activeHardWareName" class="hardWare-tabsBox" tab-position="left">
									<el-tab-pane :label="$t('administrationTabs.formHardwareCpuTab')" name="cpuCard">
										<!--循环cpu集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoCpuList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10">
														<span>{{$t('administrationTabs.formHardwareCpuType')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareCpuFrequency')}}：</span>
														<span>{{item.frequency}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareCpuManufacturer')}}：</span>
														<span>{{item.manufacturer}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareCpuPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareCpuSerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareCpuIndex')}}：</span>
														<span>{{item.cpuIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareMemoryTab')" name="memory">
										<!--循环内存集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoMemoryList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemoryType')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemoryFrequency')}}：</span>
														<span>{{item.frequency}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemorySize')}}：</span>
														<span>{{item.size}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemoryManufacturer')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemoryVersion')}}：</span>
														<span>{{item.firmwareVersion}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemoryPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareMemorySerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareMemoryIndex')}}：</span>
														<span>{{item.memoryIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareDiskTab')" name="disk">
										<!--循环磁盘集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoDiskList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskModel')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskBus')}}：</span>
														<span>{{item.bus}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskMedia')}}：</span>
														<span>{{item.media}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskSize')}}：</span>
														<span>{{item.size}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskFactor')}}：</span>
														<span>{{item.formfactor}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskManufacturer')}}：</span>
														<span>{{item.manufacturer}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskSerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskSpeed')}}：</span>
														<span>{{item.speed}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareDiskVersion')}}：</span>
														<span>{{item.firmwareVersion}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareDiskIndex')}}：</span>
														<span>{{item.diskIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareSupplyTab')" name="Supply">
										<!--循环电源集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoSupplyList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplyModel')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplyPower')}}：</span>
														<span>{{item.outputPower}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplyManufacturer')}}：</span>
														<span>{{item.manufacturer}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplyPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplySerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareSupplyVersion')}}：</span>
														<span>{{item.firmwareVersion}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareSupplyIndex')}}：</span>
														<span>{{item.supplyIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareNicTab')" name="nic">
										<!--循环网卡集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoNicList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicModel')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicIp')}}：</span>
														<span>{{item.ip}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicMac')}}：</span>
														<span>{{item.mac}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicManufacturer')}}：</span>
														<span>{{item.manufacturer}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicVersion')}}：</span>
														<span>{{item.firmwareVersion}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicSerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareNicSpeed')}}：</span>
														<span>{{item.speed}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareNicIndex')}}：</span>
														<span>{{item.nicIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareRaidTab')" name="raid">
										<!--循环阵列卡集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoRaidList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidModel')}}：</span>
														<span>{{item.model}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidCacheSize')}}：</span>
														<span>{{item.cacheSize}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidSpeed')}}：</span>
														<span>{{item.speed}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidManufacturer')}}：</span>
														<span>{{item.manufacturer}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidVersion')}}：</span>
														<span>{{item.firmwareVersion}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10 fl widthHalf">
														<span>{{$t('administrationTabs.formHardwareRaidSerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareRaidIndex')}}：</span>
														<span>{{item.raidIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
									<el-tab-pane :label="$t('administrationTabs.formHardwareFanTab')" name="fan">
										<!--循环风扇集合区域-->
										<el-row :gutter="50" class="hardWare-tabsRow">
											<el-col class="marginBottom20" :span="12" v-for="(item,index) in hardInfoFanList" :key="index">
												<ul class="hardWare-borderGray clearfix padding20">
													<li class="fontWeightBold fs14 marBottom10">{{item.name}}</li>
													<li class="marBottom10">
														<span>{{$t('administrationTabs.formHardwareFanPartNumber')}}：</span>
														<span>{{item.partNumber}}</span>
													</li>
													<li class="marBottom10">
														<span>{{$t('administrationTabs.formHardwareFanSerialNumber')}}：</span>
														<span>{{item.serialNumber}}</span>
													</li>
													<li>
														<span>{{$t('administrationTabs.formHardwareFanIndex')}}：</span>
														<span>{{item.fanIndex}}</span>
													</li>
												</ul>
											</el-col>
										</el-row>
									</el-tab-pane>
								</el-tabs>
							</div>
						</el-tab-pane>
						<!--网络配置-->
						<!--
						<el-tab-pane :label="$t('administrationTabs.network')" name="four">
							<div class="netWorkContent-padding">
								<div class="netWorkContent-BorderBottom">
									<el-form inline label-width="96px" label-position="right">
										<el-form-item class="netWorkContent-marginBottom" label="带外网IP：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="网关：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="子网掩码：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<br>
										<el-form-item label="Mac地址：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<el-form-item label="连接的交换机：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<el-form-item label="端口：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
									</el-form>
								</div>
								<div class="netWorkContent-contentBottom">
									<el-form inline label-width="96px" label-position="right">
										<el-form-item class="netWorkContent-marginBottom" label="生产网IP：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="网关：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="子网掩码：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<br>
										<el-form-item class="netWorkContent-marginBottom" label="Mac地址：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="连接的交换机：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="交换机端口：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<br>
										<el-form-item class="netWorkContent-marginBottom" label="操作系统：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="远程连接：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<el-form-item class="netWorkContent-marginBottom" label="远程连接端口：">
											<span class="netWorkContent-contentWidth">191.168.0.19</span>
										</el-form-item>
										<br>
										<el-form-item label="远程桌面：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
										<el-form-item label="远程桌面端口：">
											<span class="netWorkContent-contentWidth">EC:F4:BB:C1:0C:CB</span>
										</el-form-item>
									</el-form>
								</div>
							</div>
						</el-tab-pane>
						-->
						<!--管理信息-->
						<el-tab-pane :label="$t('administrationTabs.manageInformation')" name="five">
							<div class="padding10">
								<!--基本信息-->
								<p class="fsBold14 marBottom10">{{$t('administrationTabs.formHardManageInformation')}}</p>
								<el-row class="marginTop20 marBottom16">
									<el-col :span="4" class="paddingLeft-30">
										<span>{{$t('administrationTabs.formHardManageInformationIndex')}}：</span>
										<span>{{managementInfoMap.accessCode}}</span>
									</el-col>
									<el-col :span="4">
										<span>{{$t('administrationTabs.formHardManageInformationShutDown')}}：</span>
										<span>{{managementInfoMap.shutdownLevel}}</span>
									</el-col>
									<el-col :span="4">
										<span>{{$t('administrationTabs.formHardManageInformationEquip')}}：</span>
										<span>{{managementInfoMap.chargeBy}}</span>
									</el-col>
								</el-row>
								<p class="fsBold14 marBottom10">{{$t('administrationTabs.formHardManageInformationOrgName')}}</p>
								<el-row class="marginTop20 marBottom16">
									<el-col :span="4" class="paddingLeft-30">
										<span>{{$t('administrationTabs.formHardManageInformationBusiness')}}：</span>
										<span>{{managementInfoMap.businessChargeBy}}</span>
									</el-col>
								</el-row>
								<p class="fsBold14 marBottom10">{{$t('administrationTabs.formHardManageInformationService')}}</p>
								<el-row class="marginTop20 marBottom16">
									<el-col :span="4" class="paddingLeft-30">
										<span>{{$t('administrationTabs.formHardManageInformationServiceName')}}：</span>
										<span>{{managementInfoMap.manufacturer}}</span>
									</el-col>
								</el-row>
							</div>
						</el-tab-pane>
						<!--位置信息-->
						<!--
						<el-tab-pane :label="$t('administrationTabs.locationInformation')" name="six">
							<div class="locationContent-padding">
								<el-form>
									<el-form-item class="locationContent-marginBottom" label="所属机房："></el-form-item>
									<el-form-item class="locationContent-marginBottom" label="所属机柜："></el-form-item>
									<el-form-item class="locationContent-marginBottom" label="机柜位置："></el-form-item>
									<el-form-item class="locationContent-marginBottom" label="位置状态："></el-form-item>
									<el-form-item class="locationContent-marginBottom" label="位置描述："></el-form-item>
								</el-form>
							</div>
						</el-tab-pane>
						-->
						<!--维保信息-->
						<!--
						<el-tab-pane :label="$t('administrationTabs.maintenanceInformation')" name="seven">
							<div class="maintenanceContent-padding">
								<div class="maintenanceContent-formBox">
									<el-form inline label-width="96px" label-position="right">
										<el-form-item class="maintenanceContent-marginBottom" label="维保类型：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
										<el-form-item class="maintenanceContent-marginBottom" label="维保商：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
										<el-form-item class="maintenanceContent-marginBottom" label="开始日期：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
										<br>
										<el-form-item label="结束日期：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
										<el-form-item label="联系人：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
										<el-form-item label="联系电话：">
											<span class="maintenanceContent-contentWidth"></span>
										</el-form-item>
									</el-form>
								</div>
								<div class="maintenanceContent-tableBox">
									<p class="fsBold14 maintenanceContent-marginBottom">维保服务</p>
									<el-table>
										<el-table-column label="服务项" header-align="left" align="left"></el-table-column>
										<el-table-column label="服务对象" header-align="left" align="left"></el-table-column>
										<el-table-column label="服务截止日期" header-align="left" align="left"></el-table-column>
									</el-table>
								</div>
							</div>
						</el-tab-pane>
						-->
						<!--变更信息-->
						<!--
						<el-tab-pane :label="$t('administrationTabs.changeInformation')" name="eight">
							<div class="changeContent-padding">
								<el-form inline>
									<el-form-item label="变更日期：">
										<el-date-picker
											type="daterange"
											range-separator="至"
											start-placeholder="开始日期"
											end-placeholder="结束日期">
										</el-date-picker>
									</el-form-item>
									<el-form-item label="确认状态：">
										<el-select class="width200" clearable>
											<el-option></el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<el-button class="queryBtn" type="primary">{{$t('public.query')}}</el-button>
										<el-button class="queryBtn">{{$t('public.reset')}}</el-button>
										<el-button>导出Excel</el-button>
									</el-form-item>
								</el-form>

								<el-table>
									<el-table-column label="变更日期" header-align="left" align="left"></el-table-column>
									<el-table-column label="变更事项" header-align="left" align="left"></el-table-column>
									<el-table-column label="变更前" header-align="left" align="left"></el-table-column>
									<el-table-column label="变更后" header-align="left" align="left"></el-table-column>
									<el-table-column label="变更说明" header-align="left" align="left"></el-table-column>
									<el-table-column label="确认状态" header-align="left" align="left"></el-table-column>
									<el-table-column label="变更人" header-align="left" align="left"></el-table-column>
									<el-table-column label="确认人" header-align="left" align="left"></el-table-column>
								</el-table>
								<pages
									:total='optionsAlarm.total'
									:currentPage='optionsAlarm.currentPage'
									:page-size="optionsAlarm.pageSize"
									@handleSizeChangeSub="handleSizeChangeSub"
									@handleCurrentChangeSub="handleCurrentChange"/>
							</div>
						</el-tab-pane>
						-->
					</el-tabs>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!--设备告警详情弹出层-->
		<equipmentAlarmDetail
			ref="alarmDialog"
			:dialogVisible="dialogVisible"
			:AssetType="AssetType"
			:AlarmSeverity="AlarmSeverity"
			:AlarmHandleStatus="AlarmHandleStatus"
			@dialogVisibleStatus="dialogVisibleStatus"/>
		<!--设备状态信息-->
		<el-dialog
			class="alarmAdministrationTabs-dialog"
			:title="$t('administrationTabs.dialogEquipmentTitle')"
			append-to-body
			:before-close="resetMonitorEqStatus"
			:visible.sync="dialogVisible_info"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<div v-loading="monitorLoading">
				<el-table :data="informationInfoList" border stripe :show-header="false">
					<el-table-column prop="key"/>
					<el-table-column prop="value"/>
				</el-table>
			</div>
			<div slot="footer">
				<el-button type="primary" class="alertBtn" @click="getStartReflash">{{$t('public.refresh')}}
				</el-button>
				<el-button type="default" class="alertBtn" @click="resetMonitorEqStatus">{{$t('public.close')}}
				</el-button>
			</div>
		</el-dialog>
		<!--监测详情表格阀值-->
		<el-dialog
			class="monitorInfo-dialog"
			:title="$t('administrationTabs.dialogThresholdTitle')"
			append-to-body
			:before-close="resetMonitorData"
			:visible.sync="dialogVisible_monitorInfo"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<!--设备信息详情-->
			<el-row style="padding: 10px 20px 0;">
				<el-col :span="2" style="max-width: 100px;">
					<div class="displayInlineBlock logoBox">
						<img v-if="equipmentInfoData.manufacturerIcon !== null" class="logo-img-tabs"
								 :src="deviceLogo + '/static/asset/logo/' + equipmentInfoData.manufacturerIcon + '.png'"/>
					</div>
				</el-col>
				<el-col :span="22">
					<el-form :model="equipmentInfoData" inline label-width="96px" label-position="right"
									 class="marginBottom10 monitorThreshold-formBox">
						<el-form-item :label="$t('administrationTabs.dialogThresholdEquipmentName') + '：'">
							{{equipmentInfoData.deviceName}}
						</el-form-item>
						<el-form-item :label="$t('administrationTabs.dialogThresholdSerialNumber') + '：'">
							{{equipmentInfoData.servicetag}}
						</el-form-item>
						<el-form-item :label="$t('administrationTabs.dialogThresholdMonitoring') + '：'">
							{{equipmentInfoData.manufacturer}}
						</el-form-item>
						<br>
						<el-form-item :label="$t('administrationTabs.dialogThresholdModel') + '：'">
							{{equipmentInfoData.model}}
						</el-form-item>
						<el-form-item :label="$t('administrationTabs.dialogThresholdEquipmentType') + '：'">
							{{AssetType[equipmentInfoData.type]}}
						</el-form-item>
						<el-form-item :label="$t('administrationTabs.dialogThresholdEquipmentIp') + '：'">
							{{equipmentInfoData.ip}}
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<!--阀值区域-->
			<div class="thresholdContent-box">
				<!--左侧树-->
				<div v-if="nodeType" class="content" id="thresholdContent-contentLeft">
					<el-tree
						class="thresholdContent-tree"
						@node-click="clickNodeTree"
						:data="thresholdContentTreeData"
						node-key="nodeId"
						ref="thresholdContentTree"
						:default-expanded-keys="thresholdContentDefaultExpanded"
						highlight-current
						:props="thresholdContentDefaultProps"/>
				</div>
				<div class="content" id="thresholdContent-contentRight">
					<el-form inline label-width="96px">
						<!--循环主阀值-->
						<div class="thresholdContent-formItemBox clearfix" v-for="(main,mainIndex) in monitorListArr"
								 :key="mainIndex">
							<el-form-item :label="$t('monitorThreshold.mainThreshold') + '：'">
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="main.domId + '_monitorClass'"
										:disabled="true"
										v-model="main.monitorClass"
										class="width170 marginRight6"
										@change="changeSelect(main,'monitorClass')"
										clearable>
										<el-option
											v-for="(val,index) in monitorMainList"
											:key="index"
											:label="val.name"
											:value="val.nodeClass"/>
									</el-select>
									<span v-if="main.monitorClassStatus === true" class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="main.domId + '_perf'"
										v-model="main.perf"
										class="width170 marginRight6"
										@change="changeSelect(main,'perf')"
										clearable>
										<el-option
											v-for="(val,index) in resultArrList"
											:key="index"
											:label="val.label"
											:value="val.value"/>
									</el-select>
									<span v-if="main.perfStatus === true"
												class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="main.domId + '_op'"
										v-model="main.op"
										class="width170 marginRight6"
										@change="changeSelect(main,'op')"
										clearable>
										<el-option
											v-for="(val,index) in baseDataThresholdOp"
											:key="index"
											:label="val.name"
											:value="val.type"/>
									</el-select>
									<span v-if="main.opStatus === true"
												class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-input
										:id="main.domId + '_threshold'"
										v-model="main.threshold"
										class="width170 marginRight6"
										@input="changeSelect(main,'threshold')"
										clearable/>
									<span v-if="main.thresholdStatus === true" class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<el-button @click="addFromMonitor(mainIndex)" class="addEditBtn">
									<span class="el-icon-plus"></span>
								</el-button>
								<span>{{$t('monitorThreshold.formThreshold')}}</span>
							</el-form-item>
							<el-form-item :label="$t('monitorThreshold.formThreshold') + '：'"
														v-for="(item,data) in main.deviceMonitorThresholdList" :key="data">
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="item.domId + '_monitorClass'"
										v-model="item.monitorClass"
										class="width170 marginRight6"
										clearable
										@change="changeMonitorSelect(item,item.monitorClass,true,'bool')">
										<el-option v-for="(value,index) in monitorMainList" :key="index"
															 :label="value.name"
															 :value="value.nodeClass"/>
									</el-select>
									<span v-if="item.monitorClassStatus === true" class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="item.domId + '_perf'"
										v-model="item.perf"
										class="width170 marginRight6"
										@change="changeSelect(item,'perf')"
										clearable>
										<el-option v-for="(val,index) in item.resultArrList" :key="index"
															 :label="val.label"
															 :value="val.value"/>
									</el-select>
									<span v-if="item.perfStatus === true"
												class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="item.domId + '_op'"
										v-model="item.op"
										class="width170 marginRight6"
										@change="changeSelect(item,'op')"
										clearable>
										<el-option
											v-for="(val,index) in baseDataThresholdOp"
											:key="index"
											:label="val.name"
											:value="val.type"/>
									</el-select>
									<span v-if="item.opStatus === true"
												class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<div class="positionRelative displayInlineBlock">
									<el-input
										:id="item.domId + '_threshold'"
										v-model="item.threshold"
										class="width170 marginRight6"
										@input="changeSelect(item,'threshold')"
										clearable/>
									<span v-if="item.thresholdStatus === true" class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<el-button @click="delFromMonitor(mainIndex,data)" class="addEditBtn">
									<span class="el-icon-minus"></span>
								</el-button>
							</el-form-item>
							<!--告警级别-->
							<el-form-item :label="$t('monitorThreshold.alarmLevel') + '：'">
								<div class="positionRelative displayInlineBlock">
									<el-select
										:id="main.domId + '_alarmLevel'"
										v-model="main.alarmLevel"
										class="width170 marginRight6"
										@change="changeSelect(main,'alarmLevel')"
										clearable>
										<el-option v-for="(val,index) in AlarmSeverityListArr" :key="index"
															 :label="val.name" :value="val.type"/>
									</el-select>
									<span v-if="main.alarmLevelStatus === true" class="isNotNull">{{$t('public.isNotNull')}}</span>
								</div>
								<el-input :id="main.domId + '_alarmText'" v-model="main.alarmText" style="width: 530px;"
													clearable
													:placeholder="$t('monitorThreshold.alarmPlaceholder')"/>
							</el-form-item>
							<el-button type="danger" class="thresholdContent-deleteBtn"
												 @click="delMainMonitor(mainIndex)">
								<span class="el-icon-delete"></span>
							</el-button>
						</div>
					</el-form>
					<div class="textAlignCenter MainMonitor">
						<!--增加主阀值-->
						<el-button @click="addMainMonitor" type="primary" style="height: 34px;line-height: 34px;">
							{{$t('administrationTabs.dialogThresholdAddMain')}}
						</el-button>
					</div>
				</div>
			</div>
			<div slot="footer">
				<!--确认按钮-->
				<el-button type="primary" class="alertBtn" @click="addMonitor">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetMonitorData">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Box from '../components/Box';
	import {dateFilter, dateFilterDay} from "../assets/js/filters";
	import equipmentAlarmDetail from './equipmentAlarmDetails';
	import {getLastNewData} from "../assets/js/recursive";

	export default {
		name: "AdministrationTabs",
		components: {Box, equipmentAlarmDetail},
		data() {
			return {
				// 顶部最大页签
				activeNameTabs: this.activeName, // 用于接收标签页序号 默认从组建接收 切换时进行数据绑定
				currentEquipmentTab: null, //记录当前正在展示的哪台设备页签
				currentContentTab: null, //记录当前正在展示设备的哪个内容页签
				// 设备信息 和 设备整体状态
				equipmentInfoList: {}, // 设备基本信息
				equipmentAllStatus: [], // 设备整体状态
				// 监测详情模块
				deviceLogo: this.$api.deviceLogo(), // 图片域名地址
				monitoringDetailsData: [], // 监测管理表格数据
				monitoringDetailsDataCache: [], // 缓存的监测管理的原始数据
				monitoringDetailsCacheData: [], // 缓存的监测管理的过滤数据 用于状态筛选的数据回显
				monitoringDetailsCheckList: [], // 监测详情表格选中数据
				monitorStatusArr: [],// 监测详情状态统计集合
				expandChange: [], // 监测详情表格手风琴默认展开单行
				informationInfoList: [], // 设备信息详情
				monitorWorkStatus: 0, // 设备工作状态
				monitorStatusId: '',
				// 监测详情 阀值弹出层
				dialogVisible_monitorInfo: false, // 监测详情阀值
				monitorThisId: '', // 当前监测器主阀值id 用于提交传值
				monitorThisThred: '', // 当前监测器主阀值字段 用于显示
				monitorListArr: [], // 阀值集合
				monitorMainList: [], // 主阀值下拉框
				resultArrList: [], // 结果下拉框
				baseDataThresholdOp: [], // 操作下拉框
				thresholdContentTreeData: [], // 监测阀值 是目录的树节点集合
				thresholdContentDefaultExpanded: [], // 监测阀值 展开的节点
				thresholdContentDefaultProps: { // 监测阀值树
					label: 'nodeName',
					children: 'children',
					parentId: 'parentNodeId'
				},
				nodeType: false, // 监测阀值弹出层左侧树 的显示隐藏
				dialogVisible_info: false, // 控制设备状态信息弹出层的显示隐藏
				statusList: [], // 监测详情表单筛选下拉框数据
				operationList: [], // 监测详情 表单筛选 操作下拉框数据
				monitorChecked: { // 监测详情筛选按钮 选中与否
					pauseBtn: false, // 暂停是否点击过
					ignoreBtn: false, // 忽略是否点击过
					warnBtn: false, // 警告是否点击过
					emergencyBtn: false, // 紧急是否点击过
					notShowBtn: false, // 页面不显示是否点击过
				},
				equipmentInfoData: {
					manufacturerIcon: '', // 厂商logo
					deviceName: '', // 设备名称
					servicetag: '', // 序列号
					manufacturer: '', // 厂商
					model: '', // 型号
					type: '', // 设备类型
					ip: '', // ip
				},
				// 监测详情表单
				formItem: {
					status: '',
					operation: null, // 批量操作
					checked: true, // 单内容是否展开
				},
				// 告警事件模块
				alarmListData: [], // 告警事件列表数据
				optionsAlarm: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				alarmEventList: [], // 告警事件 告警级别下拉框
				// 告警事件表单
				alarmEvent: {
					alarmIsHistory: false, // 区分当前告警和历史告警单选按钮
					status: null, // 告警级别筛选
					dateTime: [], // 告警发生日期
				},
				// 字典
				AlarmHandleStatus: {}, // 处理状态
				AlarmSeverity: {}, // 告警状态
				AlarmSeverityListArr: [], // 告警状态 list
				AssetType: {}, // 设备类型
				WorkStatus: {}, // 监测筛选状态集合
				dialogVisible: false, // 点击告警事件行弹出蒙版层
				// 硬件配置 模块
				activeHardWareName: '', // 标签页默认选中
				hardInfoCpuList: [], // 硬件配置 cpu
				hardInfoMemoryList: [], // 内存
				hardInfoDiskList: [], // 磁盘
				hardInfoSupplyList: [], // 电源
				hardInfoNicList: [], // 网卡
				hardInfoRaidList: [], // 阵列卡
				hardInfoFanList: [], // 风扇
				// 管理信息 模块
				managementInfoMap: {
					accessCode: '', // 资产编号,
					manufacturer: '', // 厂商
					chargeBy: '', // 设备责任人
					shutdownLevel: '', // 关机级别
					businessChargeBy: '', // 业务责任人
				},
				tabReloadLastTime: new Date().getTime(), //记录上次定时器的执行时间
				tabReloadTimer: null, //记录定时器
				// 重新封装组件
				activeDeviceId: '',
				activeDeviceName: '',
				editableTabsValue: '', // 当前页签
				editableTabs: [], // 页面集合
				tabIndex: 0, // 页签序号
				// 控制标签页内容是否显示
				isShowTabBox: false,
				// 控制标签页区域是否显示
				isShowTabBoxTitle: false,
				// 记录不同设备 对应的 小标签的选中状态
				diffDeviceStatus: {},
				// 监测器刷新接口 记录定时器
				monitorTimer:null,
				monitorLoading:false, // 监测器刷新接口 加载
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
					// 监测设备工作状态
					_t.getMonitorWorkStatus();
					// 监测详情批量操作接口数据
					_t.getOperationMap();
					// 清除定时器
					_t.clearIntervalFun();
					// 设备标签内部 开启定时器
					_t.refreshPageTab();
				} else if (tab.name === 'two') {
					_t.activeNameTabs = 'two';
					// 点击告警事件 获取表格数据
					_t.getAlarmListData();
					// 清除定时器
					_t.clearIntervalFun();
					// 设备标签内部 开启定时器
					_t.refreshPageTab();
				} else if (tab.name === 'three') {
					_t.activeNameTabs = 'three';
					// 获取硬件配置 接口数据
					_t.activeHardWareName = 'cpuCard'; // 页面刚进去 默认选中第一个 叶子标签项
					// 获取硬件配置 接口信息
					_t.getHardwareListData();
					// 清除定时器
					_t.clearIntervalFun();
				} else if (tab.name === 'five') {
					_t.activeNameTabs = 'five';
					// 获取管理信息 接口数据
					_t.getManagementMapData();
					// 清除定时器
					_t.clearIntervalFun();
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
			// 收起
			packUp() {
				var _t = this;
				_t.isShowTabBox = false;
				document.getElementById('tabs-Box-tabs').style.top = 'initial';
				// 角标收起向下 样式调整
				_t.angleToDown('#tabs-Box-tabs');
				// 恢复默认的内部标签页为监测详情
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
				_t.angleToUp('#tabs-Box-tabs');
				var styleTag = document.getElementsByTagName('style');
				for (var key in styleTag) {
					if (styleTag[key].title === 'style_down' || styleTag[key].title === 'style_up') {
						styleTag[key].remove();
					}
				}
				// 关闭本页 所有定时器
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
							_t.$emit('clearSetInterval',true);
							// 先清除定时器
							_t.clearIntervalFun();
							// 设备标签内部 开启定时器
							_t.refreshPageTab();
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
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'top:initial;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'bottom:0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'border-radius:0 0 10px 0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'box-shadow:2px 2px 0 #fff;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'top:initial;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'bottom:0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'border-radius:0 0 0 10px;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'box-shadow:-2px 2px 0 #fff;');
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
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'top:0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'bottom:initial;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'border-radius:0 10px 0 0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:before', 'box-shadow:2px -2px 0 #fff;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'top:0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'bottom:initial;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'border-radius:10px 0 0 0;');
				sheet.addRule(domId + ' .el-tabs__header.is-bottom .el-tabs__item.is-active:after', 'box-shadow:-2px -2px 0 #fff;');
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
				//销毁刷新定时器
				clearInterval(_t.tabReloadTimer);
				_t.tabReloadTimer = null;

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
				//销毁刷新定时器
				clearInterval(_t.tabReloadTimer);
				_t.tabReloadTimer = null;
			},
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
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentInfoList = {};
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
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.equipmentAllStatus = {};
							break;
					}
				});
			},
			// 监测详情 => 点击阀值按钮
			getMonitorThreshold(row) {
				var _t = this;
				// 点击阀值 暂停定时器
				_t.clearIntervalFun();
				// 显示蒙版
				_t.dialogVisible_monitorInfo = true;
				_t.monitorThisId = row.deviceId;
				_t.getInfoData(row.deviceId); // 显示设备信息
				_t.getMonitorSelectData(row.deviceId); // 获取主阀值下拉框数据
				// 根据 nodeType 判断是否点击的是 目录级别 0 设备级别 1
				if (row.nodeType === 0) {
					// 目录
					_t.nodeType = true; // 显示左侧树
					_t.getThresholdTree(row.id); // 获取左侧设备目录树
					_t.$nextTick(function () {
						if (document.getElementById('thresholdContent-contentRight') !== null) {
							document.getElementById('thresholdContent-contentRight').style.left = '244px';
						}
					});
				} else {
					// 最细一级
					_t.nodeType = false; // 隐藏左侧树
					_t.$nextTick(function () {
						if (document.getElementById('thresholdContent-contentRight') !== null) {
							document.getElementById('thresholdContent-contentRight').style.left = '0px';
						}
					});
					// 直接获取当前节点的 阀值数据
					var firstNode = new Object();
					firstNode.nodeId = row.id;
					firstNode.nodeCode = row.name;
					_t.clickNodeTree(firstNode);
				}
			},
			// 监测详情 设备状态信息 重置关闭按钮
			resetMonitorEqStatus() {
				var _t = this;
				_t.dialogVisible_info = false;
				// 销毁 监测器 刷新定时器
				clearTimeout(_t.monitorTimer);
				_t.monitorTimer = null;
				// 调取 最新监测详情数据
				_t.getMonitorWorkStatus();
				// 清除原来定时器
				_t.clearIntervalFun();
				// 启动定时器
				_t.refreshPageTab();
			},
			// 监测详情 => 获取监测阈值目录
			getThresholdTree(val) {
				var _t = this;
				_t.$api.get('monitor/deviceMonitor/all', {
					jsonString: JSON.stringify({
						deviceMonitor: {
							nodeClass: 'tree',
							id: val,
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.thresholdContentTreeData = res.data.children === null ? [] : res.data.children;
							// 拿到树之后 取出第一个节点最细一级的元素节点
							_t.getDefaultTreeFirstData(_t.thresholdContentTreeData);
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.thresholdContentTreeData = [];
							break;
					}
				});
			},
			// 监测详情 => 根据左侧的树判断拿到第一个节点的最细一级的数据作为右边的显示值
			getDefaultTreeFirstData(treeData) {
				var _t = this;
				var firstNode = getLastNewData(treeData);
				// 高亮当前节点
				_t.$nextTick(function () {
					_t.$refs.thresholdContentTree.setCurrentKey(firstNode.nodeId);
					_t.thresholdContentDefaultExpanded = [];
					_t.thresholdContentDefaultExpanded.push(firstNode.nodeId);
				});
				_t.clickNodeTree(firstNode);
			},
			// 监测详情 => 获取设备信息详情
			getInfoData(val) {
				var _t = this;
				_t.$api.get('asset/assetDevice/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.equipmentInfoData = res.data;
							_t.equipmentInfoData.manufacturerIcon = res.data.manufacturer.toLowerCase();
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
			// 监测详情 => 重置监测阀值 弹出层字段
			resetMonitorData() {
				var _t = this;
				// 调取 最新监测详情数据
				_t.getMonitorWorkStatus();
				// 清除原来的定时器
				_t.clearIntervalFun();
				// 启动 定时器
				_t.refreshPageTab();
				_t.dialogVisible_monitorInfo = false; // 关闭蒙版层
				_t.monitorThisId = ''; // 当前监测器主阀值id 用于提交传值
				_t.monitorThisThred = ''; // 当前监测器主阀值字段 用于显示
				_t.monitorListArr = []; // 阀值集合
				_t.monitorMainList = [];// 主阀值下拉框
				_t.resultArrList = []; // 结果下拉框
				_t.thresholdContentTreeData = []; // 监测阀值 是目录的树节点集合
				_t.thresholdContentDefaultExpanded = []; // 监测阀值 展开的节点
				_t.nodeType = false; // 监测阀值弹出层左侧树 的显示隐藏
			},
			// 监测详情 => 点击监测详情 左侧阀值 目录树
			clickNodeTree(data) {
				var _t = this;
				// 监测器id
				_t.monitorThisId = data.nodeId;
				// 监测器主阀值
				_t.monitorThisThred = data.nodeCode;
				_t.getResultData(data.nodeId);
			},
			// 监测详情 => 获取指标下拉框数据
			getResultData(val) {
				var _t = this;
				_t.$api.get('monitor/deviceMonitor/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							var result = JSON.parse(res.data.result);
							var resultArrList = new Array();
							for (var key in result) {
								var obj = new Object();
								obj.value = key;
								obj.label = result[key];
								resultArrList.push(obj);
							}
							_t.resultArrList = resultArrList;
							_t.getMonitorInfoData(val);
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
			// 监测详情 => 获取编辑的阀值数据
			getMonitorInfoData(data) {
				var _t = this;
				_t.$api.get('monitor/deviceMonitorThreshold/all', {
					jsonString: JSON.stringify({
						deviceMonitorThreshold: {
							monitorId: data,
							isAssocRule: false
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var monitorListArr = res.data === null ? [] : res.data;
							monitorListArr.forEach((item) => {
								// 转换 告警级别字段 类型
								if (item.alarmLevel !== null) {
									item.alarmLevel = String(item.alarmLevel);
								}
								if (item.deviceMonitorThresholdList.length !== 0) {
									item.deviceMonitorThresholdList.forEach((data) => {
										data.resultArrList = [];
										// 加入判断是否为空的字段
										data.monitorClassStatus = false;
										data.perfStatus = false;
										data.opStatus = false;
										data.thresholdStatus = false;
										data.alarmLevelStatus = false;
										data.alarmTextStatus = false;
										if (data.id && data.id !== null) {
											data.domId = data.id;
										}
										_t.changeMonitorSelect(data, data.monitorId, false);
									});
								}
								// 加入判断是否为空的字段
								item.monitorClassStatus = false;
								item.perfStatus = false;
								item.opStatus = false;
								item.thresholdStatus = false;
								item.alarmLevelStatus = false;
								item.alarmTextStatus = false;
								if (item.id && item.id !== null) {
									item.domId = item.id;
								}
							});
							// 给监测指标动态表单赋值
							_t.monitorListArr = monitorListArr;
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
			// 监测详情 => 改变从阀值下拉框时 重新获取对应的 指标下拉框数据
			changeMonitorSelect(item, val, bool, boolString) {
				var _t = this;
				if (val !== '') {
					if (boolString) {
						item.monitorClassStatus = false;
						document.getElementById(item.domId + '_monitorClass').style.borderColor = '#DCDFE6';
					}
					_t.$api.get('monitor/deviceMonitor/' + val, {}, function (res) {
						switch (res.status) {
							case 200:
								var result = JSON.parse(res.data.result);
								var resultArrList = new Array();
								for (var key in result) {
									var obj = new Object();
									obj.value = key;
									obj.label = result[key];
									resultArrList.push(obj);
								}
								var perfNumber = 0;
								resultArrList.forEach((val) => {
									if (val.value !== item.perf) {
										perfNumber += 1;
									}
								});
								if (bool === true && perfNumber !== 0) {
									item.perf = '';
								}
								item.resultArrList = resultArrList;
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
				} else {
					item.perf = '';
					item.resultArrList = [];
					if (item.monitorClass === '') {
						item.monitorClassStatus = true;
						document.getElementById(item.domId + '_monitorClass').style.borderColor = '#fb6041';
					} else {
						item.monitorClassStatus = false;
						document.getElementById(item.domId + '_monitorClass').style.borderColor = '#DCDFE6';
					}
					_t.changeSelect(item, 'perf');
				}
			},
			// 监测详情 => 获取阀值 下拉框数据
			getMonitorSelectData(val) {
				var _t = this;
				_t.$api.get('monitor/deviceMonitor/all', {
					jsonString: JSON.stringify({
						deviceMonitor: {
							nodeType: 1,
							deviceId: val
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.monitorMainList = res.data === null ? [] : res.data;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.monitorMainList = [];
							break;
					}
				});
			},
			// 监测详情 => 添加主阀值
			addMainMonitor() {
				var _t = this;
				let monitorMain = {
					domId: new Date().getTime(),
					monitorId: _t.monitorThisId, // 监测器id
					monitorClass: _t.monitorThisThred,// 主从阀值字段
					perf: '', // 阀值指标名称
					op: '', // 阀值比较符
					threshold: '', // 阀值
					alarmLevel: null, // 告警级别
					alarmText: '', // 附加告警内容
					// 从阀值集合
					deviceMonitorThresholdList: [],
					monitorClassStatus: false,
					opStatus: false,
					perfStatus: false,
					thresholdStatus: false,
					alarmLevelStatus: false
				};
				_t.monitorListArr.push(monitorMain);
			},
			// 监测详情 => 删除主阀值
			delMainMonitor(index) {
				var _t = this;
				_t.monitorListArr.splice(index, 1);
			},
			// 监测详情 => 添加从阀值
			addFromMonitor(index) {
				var _t = this;
				let monitorClass = {
					domId: new Date().getTime(),
					monitorClass: '', // 从阀值字段
					perf: '', // 从阀值指标名称
					op: '', // 阀值比较符
					threshold: '', // 从阀值
					resultArrList: [], // 从阀值下拉框集合
					monitorClassStatus: false,
					opStatus: false,
					perfStatus: false,
					thresholdStatus: false,
				};
				_t.monitorListArr[index].deviceMonitorThresholdList.push(monitorClass);
			},
			// 监测详情 => 删除从阀值
			delFromMonitor(index, i) {
				var _t = this;
				_t.monitorListArr[index].deviceMonitorThresholdList.splice(i, 1);
			},
			// 监测详情 => 下拉框数据改变的时候
			changeSelect(data, val) {
				if (val !== 'alarmLevel') {
					if (data[val] === '') {
						data[val + 'Status'] = true;
						document.getElementById(data.domId + '_' + val).style.borderColor = '#fb6041';
					} else {
						data[val + 'Status'] = false;
						document.getElementById(data.domId + '_' + val).style.borderColor = '#DCDFE6';
					}
				} else {
					data[val] = data[val] === '' ? null : data[val];
					if (data[val] === null) {
						data[val + 'Status'] = true;
						document.getElementById(data.domId + '_' + val).style.borderColor = '#fb6041';
					} else {
						data[val + 'Status'] = false;
						document.getElementById(data.domId + '_' + val).style.borderColor = '#DCDFE6';
					}
				}
			},
			// 监测详情 => 保存阀值
			addMonitor() {
				var _t = this;
				var isErrorNum = 0;
				_t.monitorListArr = _t.monitorListArr === null ? [] : _t.monitorListArr;
				_t.monitorListArr.forEach((item) => {
					// 主阀值字段
					if (item.monitorClass === '') {
						isErrorNum += 1;
						item.monitorClassStatus = true;
						document.getElementById(item.domId + '_monitorClass').style.borderColor = '#fb6041';
					} else {
						item.monitorClassStatus = false;
						document.getElementById(item.domId + '_monitorClass').style.borderColor = '#DCDFE6';
					}
					// 主阀值perf字段
					if (item.perf === '') {
						isErrorNum += 1;
						item.perfStatus = true;
						document.getElementById(item.domId + '_perf').style.borderColor = '#fb6041';
					} else {
						item.perfStatus = false;
						document.getElementById(item.domId + '_perf').style.borderColor = '#DCDFE6';
					}
					// 主阀值 op字段
					if (item.op === '') {
						isErrorNum += 1;
						item.opStatus = true;
						document.getElementById(item.domId + '_op').style.borderColor = '#fb6041';
					} else {
						item.opStatus = false;
						document.getElementById(item.domId + '_op').style.borderColor = '#DCDFE6';
					}
					// 主阀值 threshold字段
					if (item.threshold === '') {
						isErrorNum += 1;
						item.thresholdStatus = true;
						document.getElementById(item.domId + '_threshold').style.borderColor = '#fb6041';
					} else {
						item.thresholdStatus = false;
						document.getElementById(item.domId + '_threshold').style.borderColor = '#DCDFE6';
					}
					// 主阀值 alarmLevel字段
					if (item.alarmLevel === null) {
						isErrorNum += 1;
						item.alarmLevelStatus = true;
						document.getElementById(item.domId + '_alarmLevel').style.borderColor = '#fb6041';
					} else {
						item.alarmLevelStatus = false;
						document.getElementById(item.domId + '_alarmLevel').style.borderColor = '#DCDFE6';
					}
					item.deviceMonitorThresholdList.forEach((val) => {
						// 从阀值
						if (val.monitorClass === '') {
							isErrorNum += 1;
							val.monitorClassStatus = true;
							document.getElementById(val.domId + '_monitorClass').style.borderColor = '#fb6041';
						} else {
							val.monitorClassStatus = false;
							document.getElementById(val.domId + '_monitorClass').style.borderColor = '#DCDFE6';
						}
						// 从阀值perf字段
						if (val.perf === '') {
							isErrorNum += 1;
							val.perfStatus = true;
							document.getElementById(val.domId + '_perf').style.borderColor = '#fb6041';
						} else {
							val.perfStatus = false;
							document.getElementById(val.domId + '_perf').style.borderColor = '#DCDFE6';
						}
						// 从阀值 op字段
						if (val.op === '') {
							isErrorNum += 1;
							val.opStatus = true;
							document.getElementById(val.domId + '_op').style.borderColor = '#fb6041';
						} else {
							val.opStatus = false;
							document.getElementById(val.domId + '_op').style.borderColor = '#DCDFE6';
						}
						// 从阀值 threshold字段
						if (val.threshold === '') {
							isErrorNum += 1;
							val.thresholdStatus = true;
							document.getElementById(val.domId + '_threshold').style.borderColor = '#fb6041';
						} else {
							val.thresholdStatus = false;
							document.getElementById(val.domId + '_threshold').style.borderColor = '#DCDFE6';
						}
					});
				});
				if (isErrorNum === 0) {
					_t.$api.post('monitor/deviceMonitorThreshold/', {
						monitorId: _t.monitorThisId,
						thresholdList: _t.monitorListArr
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$message({
									dangerouslyUseHTMLString: true,
									message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> 提交成功",
									customClass: 'messageBoxSuccess',
									duration: 2000,
									onClose: function () {
										// 关闭前回调
										_t.resetMonitorData();
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
								_t.$message({
									dangerouslyUseHTMLString: true,
									message: "<span class='iconfont iconfontError'>&#xe64e;</span> 提交失败",
									customClass: 'messageBoxError',
									duration: 2000,
									onClose: function () {
										// 关闭前回调
										_t.resetMonitorData();
									}
								});
								break;
						}
					});
				}
			},
			// 监测详情 => 点击监测详情状态筛选
			screenAlarmStatus(status) {
				var _t = this;
				// 判断筛选按钮是否点过
				if (status == 11) { // 暂停
					_t.monitorChecked.pauseBtn = !_t.monitorChecked.pauseBtn;
					_t.monitorChecked.ignoreBtn = false;
					_t.monitorChecked.warnBtn = false;
					_t.monitorChecked.emergencyBtn = false;
					_t.monitorChecked.notShowBtn = false;
					if (_t.monitorChecked.pauseBtn) {
						// 选中 需要过滤数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'status', status);
					} else {
						// 取消选中 加载全部数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', true);
					}
				} else if (status == 22) { // 忽略
					_t.monitorChecked.ignoreBtn = !_t.monitorChecked.ignoreBtn;
					_t.monitorChecked.pauseBtn = false;
					_t.monitorChecked.warnBtn = false;
					_t.monitorChecked.emergencyBtn = false;
					_t.monitorChecked.notShowBtn = false;
					if (_t.monitorChecked.ignoreBtn) {
						// 选中 需要过滤数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'status', status);
					} else {
						// 取消选中 加载全部数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', true);
					}
				} else if (status == 66) { // 警告
					_t.monitorChecked.warnBtn = !_t.monitorChecked.warnBtn;
					_t.monitorChecked.pauseBtn = false;
					_t.monitorChecked.ignoreBtn = false;
					_t.monitorChecked.emergencyBtn = false;
					_t.monitorChecked.notShowBtn = false;
					if (_t.monitorChecked.warnBtn) {
						// 选中 需要过滤数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'status', status);
					} else {
						// 取消选中 加载全部数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', true);
					}
				} else if (status == 99) { // 紧急
					_t.monitorChecked.emergencyBtn = !_t.monitorChecked.emergencyBtn;
					_t.monitorChecked.pauseBtn = false;
					_t.monitorChecked.ignoreBtn = false;
					_t.monitorChecked.warnBtn = false;
					_t.monitorChecked.notShowBtn = false;
					if (_t.monitorChecked.emergencyBtn) {
						// 选中 需要过滤数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'status', status);
					} else {
						// 取消选中 加载全部数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', true);
					}
				} else if (status == 38) { // 页面不显示
					_t.monitorChecked.notShowBtn = !_t.monitorChecked.notShowBtn;
					_t.monitorChecked.pauseBtn = false;
					_t.monitorChecked.ignoreBtn = false;
					_t.monitorChecked.warnBtn = false;
					_t.monitorChecked.emergencyBtn = false;
					if (_t.monitorChecked.notShowBtn) {
						// 选中 需要过滤数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', false);
					} else {
						// 取消选中 加载全部数据
						_t.monitoringDetailsData = _t.filterMonitorTableData(_t.monitoringDetailsDataCache, 'isAlone', true);
					}
				}
			},
			// 监测详情 => 过滤监测数据
			filterMonitorTableData(treeData, valField, val) {
				var _t = this;
				var monitorArr = new Array();
				// 遍历一级
				treeData = treeData === null ? [] : treeData;
				treeData.forEach((item) => {
					// nodeType = 1 最细一级 符合条件就添加进数组
					if (item.nodeType === 1) {
						if (item[valField] == val) {
							monitorArr.push(item);
						}
					} else {
						// nodeType = 0 目录级别 一级符合条件 先记录一级 然后遍历二级
						if (item[valField] == val) {
							// 先记录一下一级 同时查看二级有没有 符合条件的数据
							var monitorLevelFirst = item;
							var monitorLevelFirstArr = new Array();
							monitorLevelFirst.deviceMonitorList.forEach((innerData) => {
								if (innerData[valField] == val) {
									monitorLevelFirstArr.push(innerData);
								}
							});
							item.deviceMonitorListArrStart = monitorLevelFirstArr;
							monitorArr.push(item);
						} else {
							// 一级不符合条件 遍历二级 二级没有 不加 二级有符合数据 拿到二级数据集合 拿到一级 把一级存到 monitorArr
							var monitorLevelFirst = item;
							var monitorLevelFirstArr = new Array();
							monitorLevelFirst.deviceMonitorList.forEach((innerData) => {
								if (innerData[valField] == val) {
									monitorLevelFirstArr.push(innerData);
								}
							});
							item.deviceMonitorListArrStart = monitorLevelFirstArr;
							if (item.deviceMonitorListArrStart.length !== 0) {
								monitorArr.push(item);
							}
						}
					}
				});
				return _t.switchMonitoringDetailsData(monitorArr);
			},
			// 监测详情 => 转换监测详情接口json字符串 treeData 需要转换的数据
			switchMonitoringDetailsData(treeData) {
				var _t = this;
				treeData = treeData === null ? [] : treeData;
				treeData.forEach((item) => {
					// 转换一级可展开的最新状态 nodeType 0 目录 可展开
					if (item.nodeType === 0) {
						var monitorArr = new Array();
						var monitorList = JSON.parse(item.statusText);
						for (var key in monitorList) {
							var objArr = new Object();
							objArr.key = key;
							objArr.value = monitorList[key];
							monitorArr.push(objArr);
						}
						if (monitorArr.length === 1 && monitorArr[0].key === '33') {
							// 全部正常 状态为1
							item.resultConcentStatus = 1;
							item.resultConcent = monitorArr[0].value + _t.$t('administrationTabs.tableObjectAllNum');
						} else {
							// 多种状态 为2
							item.resultConcentStatus = 2;
							var monitorArrNumber = 0;
							monitorArr.forEach((val) => {
								monitorArrNumber += val.value;
							});
							monitorArr.unshift({key: null, value: monitorArrNumber});
							item.resultConcent = monitorArr;
						}
					} else {
						// nodeType == 1 最细一级 转换 result
						item.resultConcentArr = JSON.parse(item.result);
						var listArr = new Array();
						for (var key in item.resultConcentArr) {
							var obj = new Object();
							obj.key = key;
							obj.value = item.resultConcentArr[key];
							listArr.push(obj);
						}
						item.resultConcentParse = listArr;
					}
					// 转换二级 最新状态参数
					if (item.nodeType === 0) {
						// 子集循环 (二级)
						item.deviceMonitorListArrStart.forEach((val) => {
							// json串
							val.resultConcent = JSON.parse(val.result);
							var listArr = new Array();
							for (var key in val.resultConcent) {
								var obj = new Object();
								obj.key = key;
								obj.value = val.resultConcent[key];
								listArr.push(obj);
							}
							val.resultConcentParse = listArr;
						});
					}
					item.deviceMonitorListArr = item.deviceMonitorListArrStart;
				});
				return treeData;
			},
			// 监测详情 => 获取监测详情的接口数据
			getMonitorData() {
				var _t = this;
				_t.$api.get('monitor/deviceMonitor/all', {
					jsonString: JSON.stringify({
						deviceMonitor: {
							parentId: '0',
							deviceId: _t.activeDeviceId,
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data === null ? [] : res.data;
							// _t.monitorWorkStatus 当前设备状态 11 暂停 22 忽略
							if (_t.monitorWorkStatus === 11 || _t.monitorWorkStatus === '11' || _t.monitorWorkStatus === 22 || _t.monitorWorkStatus === '22') {
								// 1. 处理表格数据
								resData.forEach((t) => {
									t.status = _t.monitorWorkStatus;
									t.deviceMonitorList = t.deviceMonitorList === null ? [] : t.deviceMonitorList;
									if (t.deviceMonitorList.length !== 0) {
										t.deviceMonitorList.forEach((i) => {
											i.status = _t.monitorWorkStatus;
										});
									}
								});
							}
							// 缓存接口全部数据 用于前端筛选
							_t.monitoringDetailsDataCache = resData;
							// 过滤不显示的数据 返回显示的数据
							_t.monitoringDetailsData = _t.filterMonitorTableData(resData, 'isAlone', true);
							_t.monitoringDetailsCacheData = _t.monitoringDetailsData;
							// 状态统计
							_t.getMonitoringDetail(_t.activeDeviceId);
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.monitoringDetailsData = [];
							break;
					}
				});
			},
			// 监测详情 => 监测详情最细一级单元格的点击 第一层
			cellClickColumnTable(row, column) {
				var _t = this;
				// 点击状态
				// if (column.label === _t.$t('administrationTabs.status') || column.label === _t.$t('administrationTabs.latestState')) {
				//   // 第一层 id不为空 非正常状态 !33 nodeType:1 非目录不可展开
				//   if (row.id !== null && row.status != '33' && row.nodeType === 1) {
				//     _t.dialogVisible = true;
				//     // 父组件调用 子组件 获取数据的方法
				//     _t.$refs.alarmDialog.getData(row.id,false);
				//   }
				// }
				// 点击资源名称
				if (column.label === _t.$t('administrationTabs.resourceName')) {
					// 最细一级 nodeType 不能展开
					if (row.nodeType === 1) {
						// 点击阀值 暂停定时器
						_t.clearIntervalFun();
						_t.monitorStatusId = row.id;
						_t.dialogVisible_info = true;
						_t.informationInfoList = row.resultConcentParse;
					}
				}
			},
			// 监测详情 => 监测详情最细一级单元格的点击 第二层
			cellClickColumn(row, column) {
				var _t = this;
				// 点击状态 或 最新状态
				// if (column.label === _t.$t('administrationTabs.status') || column.label === _t.$t('administrationTabs.latestState')) {
				//   // 第二层 id不为空 非正常状态 !33 nodeType:1 非目录不可展开
				//   if (row.id !== null && row.status != '33' && row.nodeType === 1) {
				//     _t.dialogVisible = true;
				//     // 父组件调用 子组件 获取数据的方法
				//     _t.$refs.alarmDialog.getData(row.id,false);
				//   }
				// }
				// 点击资源名称
				if (column.label === _t.$t('administrationTabs.resourceName')) {
					// 最细一级 nodeType 不能展开
					if (row.nodeType === 1) {
						// 点击阀值 暂停定时器
						_t.clearIntervalFun();
						_t.monitorStatusId = row.id;
						_t.dialogVisible_info = true;
						_t.informationInfoList = row.resultConcentParse;
					}
				}
			},
			// 监测详情 => 监测详情列表设置 行id
			getMonitoringDetailsRowKey(row) {
				return row.id;
			},
			// 监测详情 => 控制监测详情是否单行展开
			expandChangeKeys(row) {
				var _t = this;
				if (_t.formItem.checked) {
					if (_t.expandChange.length === 0) {
						// 展开
						_t.expandChange = [];
						_t.expandChange[0] = row.id;
					} else if (_t.expandChange.length !== 0 && row.id === _t.expandChange[0]) {
						// 关闭 当前
						_t.expandChange = [];
					} else {
						// 关闭其他 展开当前
						_t.expandChange = [];
						_t.expandChange[0] = row.id;
					}
				}
			},
			// 监测详情 => 单内容展开 改为true 清空展开的
			changeChecked(val) {
				var _t = this;
				if (val === true) {
					_t.expandChange = [];
				}
			},
			// 监测详情 => 监测详情批量操作提交
			changeOperation(val) {
				var _t = this;
				// 选中非 批量操作的 项
				if (val !== null && _t.monitoringDetailsCheckList.length !== 0) {
					_t.$api.post('monitor/deviceMonitorAttr/execute', {
						option: val,
						isDevice: false,
						ids: _t.monitoringDetailsCheckList
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.getMonitorData();
								_t.formItem.operation = null;
								_t.$message({
									dangerouslyUseHTMLString: true,
									message: "<span class='iconfont iconfontSuccess'>&#xe648;</span> 提交成功",
									customClass: 'messageBoxSuccess',
									duration: 2000
								});
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							default:
								_t.formItem.operation = null;
								_t.$message({
									dangerouslyUseHTMLString: true,
									message: "<span class='iconfont iconfontError'>&#xe64e;</span> 提交失败",
									customClass: 'messageBoxError',
									duration: 2000
								});
								break;
						}
					});
				} else {
					_t.$alert(_t.$t('administrationTabs.dialogSelectTip'), _t.$t('public.confirmTip'), {
						confirmButtonText: _t.$t('public.confirm'),
						confirmButtonClass: 'alertBtn'
					});
				}
			},
			// 监测详情 => 获取监测详情表格选中的数据
			monitoringChange(data) {
				var _t = this;
				data = data === null ? [] : data;
				var dataList = new Array();
				data.forEach((item) => {
					if (item.deviceId !== null) {
						dataList.push(item.id);
					}
				});
				_t.monitoringDetailsCheckList = dataList;
			},
			// 监测详情 => 接受设备信息蒙版层返回的状态
			dialogVisibleStatus(val) {
				var _t = this;
				_t.dialogVisible = val;

				if (val === false) {
					// 清除原来的定时器
					_t.clearIntervalFun();
					// 关闭了蒙版层 启动定时器
					_t.refreshPageTab();
				}

				// 告警关闭 当前告警重新 调取表格数据
				if (_t.alarmEvent.alarmIsHistory === false) {
					// 调取告警事件接口
					_t.getAlarmListData();
				}
			},
			// 监测详情 => 控制某些状态下的表格不展开行
			getClassName({row, rowIndex}) {
				return row.nodeType === 1 ? 'expendTable' : '';
			},
			// 监测详情 => 获取监测详情状态统计
			getMonitoringDetail(val) {
				var _t = this;
				_t.$api.get('monitor/deviceMonitor/countStatus/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							var monitorStatusArr = new Array();
							var resData = res.data;
							if (_t.monitorWorkStatus === 11 || _t.monitorWorkStatus === '11' || _t.monitorWorkStatus === 22 || _t.monitorWorkStatus === '22') {
								// 已忽略 或者 已暂停 只显示 (38不显示到页面)
								for (var key in resData) {
									if (key === 38 || key === '38') {
										var obj = new Object();
										obj.key = key;
										obj.value = res.data[key];
										monitorStatusArr.push(obj);
									}
								}
							} else {
								// 其他 不包含 正常
								for (var key in resData) {
									if (key != '33') {
										var obj = new Object();
										obj.key = key;
										obj.value = res.data[key];
										monitorStatusArr.push(obj);
									}
								}
							}
							_t.monitorStatusArr = monitorStatusArr;
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
			// 监测详情 => 获取监测管理批量操作数据接口 map
			getOperationMap() {
				var _t = this;
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ['WorkStatus'],
					languageMark: localStorage.getItem('hy-language')
				}, function (res) {
					switch (res.status) {
						case 200:
							// 转换 list map
							var WorkStatus = new Array();
							for (var key in res.data.WorkStatus) {
								if (key == '47' || key == '48') {
								} else {
									WorkStatus.push({name: res.data.WorkStatus[key], type: key})
								}
							}
							WorkStatus.unshift({name: _t.$t('administrationTabs.formAllOperation'), type: null});
							_t.operationList = WorkStatus;
							// 字典key:value
							_t.WorkStatus = res.data.WorkStatus;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.WorkStatus = {};
							_t.operationList = [{name: _t.$t('administrationTabs.formAllOperation'), type: null}];
							break;
					}
				});
			},
			// 监测详情 => 获取设备工作状态
			getMonitorWorkStatus() {
				var _t = this;
				_t.$api.get('monitor/deviceMonitorAttr/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.monitorWorkStatus = res.data.workStatus;
							_t.getMonitorData();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.WorkStatus = {};
							_t.operationList = [{name: _t.$t('administrationTabs.formAllOperation'), type: null}];
							break;
					}
				});
			},
			// 监测详情设备状态信息 刷新 开启后台
			getStartReflash(){
				var _t = this;
				_t.monitorLoading = true; // 加载中
				_t.$api.get('asset/discovery/startReflash/' + _t.monitorStatusId, {}, function (res) {
					switch (res.status) {
						case 200:
							// 返回成功 启动调用 数据的接口定时器
							_t.monitorTimer = setTimeout(()=>{
								_t.getNewStatusMonitor();
							},2000);
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
			// 监测详情设备状态信息 刷新
			getNewStatusMonitor() {
				var _t = this;
				_t.$api.get('asset/discovery/reflash/' + _t.monitorStatusId, {}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data.finish === true) {
								_t.monitorLoading = false; // 加载结束
								// 销毁定时器
								clearTimeout(_t.monitorTimer);
								_t.monitorTimer = null;
								// 表格赋值
								var resDataResult = res.data.result;
								var resDataList = new Array();
								for (var key in resDataResult) {
									resDataList.push({key:key,value:resDataResult[key]});
								}
								_t.informationInfoList = resDataList;
							} else if (res.data.finish === false) {
								// 销毁定时器
								clearTimeout(_t.monitorTimer);
								_t.monitorTimer = null;
								// 启动定时器
								_t.setTimeout(()=>{
									_t.getNewStatusMonitor();
								},2000);
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.informationInfoList = [];
							break;
					}
				});
			},
			// 告警事件 => 改变当前页码
			handleCurrentChangeAlarm(val) {
				var _t = this;
				_t.optionsAlarm.currentPage = val;
				_t.getAlarmListData();
			},
			// 告警事件 => 改变每页显示条数
			handleSizeChangeSubAlarm(val) {
				var _t = this;
				_t.optionsAlarm.pageSize = val;
				_t.getAlarmListData();
			},
			// 告警事件 => 点击告警事件 行
			alarmEventTableRow(row) {
				var _t = this;
				_t.dialogVisible = true;
				// 点击告警行 暂停定时器
				_t.clearIntervalFun();
				// 父组件调用 子组件 获取数据的方法
				_t.$refs.alarmDialog.getData(row.id, _t.alarmEvent.alarmIsHistory);
			},
			getAlarmListDataRadio() {
				var _t = this;
				_t.getAlarmListData();
			},
			// 告警事件 => 获取告警事件列表的接口数据
			getAlarmListData() {
				var _t = this;
				var url = 'alarm/alarmHistory/pagelist';
				if (_t.alarmEvent.alarmIsHistory) {
					// 历史告警
					url = 'alarm/alarmHistory/pagelist';
				} else {
					// 当前告警
					url = 'alarm/alarm/pagelist'
				}
				_t.$api.get(url, {
					jsonString: JSON.stringify({
						alarm: {
							deviceId: _t.activeDeviceId,
							alarmLevel: _t.alarmEvent.status,
							ocrStartTime: _t.alarmEvent.dateTime == null ? null : dateFilterDay(_t.alarmEvent.dateTime[0].getTime()),
							ocrEndTime: _t.alarmEvent.dateTime == null ? null : dateFilterDay(_t.alarmEvent.dateTime[1].getTime()),
						},
						page: {
							currentPage: _t.optionsAlarm.currentPage,
							pageSize: _t.optionsAlarm.pageSize
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.alarmListData = res.data.list === null ? [] : res.data.list;
							_t.optionsAlarm.total = res.data.page.totalResultSize;
							_t.optionsAlarm.currentPage = res.data.page.currentPage;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.alarmListData = [];
							break;
					}
				});
			},
			// 硬件配置 => 获取硬件配置接口信息
			getHardwareListData() {
				var _t = this;
				_t.$api.get('asset/assetDevice/hardinfo/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.hardInfoCpuList = res.data.cpu === null ? [] : res.data.cpu; // cpu
							_t.hardInfoMemoryList = res.data.memory === null ? [] : res.data.memory; // 内存
							_t.hardInfoDiskList = res.data.disk === null ? [] : res.data.disk; // 磁盘
							_t.hardInfoSupplyList = res.data.supply === null ? [] : res.data.supply; // 电源
							_t.hardInfoNicList = res.data.nic === null ? [] : res.data.nic; // 网卡
							_t.hardInfoRaidList = res.data.raid === null ? [] : res.data.raid; // 阵列卡
							_t.hardInfoFanList = res.data.fan === null ? [] : res.data.fan; // 风扇
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.hardInfoCpuList = []; // cpu
							_t.hardInfoMemoryList = []; // 内存
							_t.hardInfoDiskList = []; // 磁盘
							_t.hardInfoSupplyList = []; // 电源
							_t.hardInfoNicList = []; // 网卡
							_t.hardInfoRaidList = []; // 阵列卡
							_t.hardInfoFanList = []; // 风扇
							break;
					}
				});
			},
			// 管理信息 => 获取管理信息 接口数据
			getManagementMapData() {
				var _t = this;
				_t.$api.get('asset/assetDevice/' + _t.activeDeviceId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.managementInfoMap = res.data;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.managementInfoMap = {};
							break;
					}
				});
			},
			// 字典 => 获取状态字典 map
			getStatusDataBase() {
				var _t = this;
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["AlarmHandleStatus", "AssetType", "AlarmSeverity"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.AlarmHandleStatus = res.data.AlarmHandleStatus;
							_t.AssetType = res.data.AssetType;
							_t.AlarmSeverity = res.data.AlarmSeverity;
							// 给告警事件中告警级别下拉框加数据
							_t.alarmEventList.unshift({
								value: null,
								label: _t.$t('public.all')
							});
							for (var key in _t.AlarmSeverity) {
								if (key == '66' || key == '99') {
									_t.alarmEventList.push({
										value: key,
										label: _t.AlarmSeverity[key]
									});
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
							_t.AlarmHandleStatus = {};
							_t.AssetType = {};
							_t.AlarmSeverity = {};
							break;
					}
				});
			},
			// 字典 => 获取list数据字典
			getBaseDataList() {
				var _t = this;
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['ThresholdOp', 'AlarmSeverity']
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.baseDataThresholdOp = res.data.ThresholdOp;
							var AlarmSeverity = new Array();
							res.data.AlarmSeverity.forEach((item) => {
								if (item.type == 66 || item.type == 99) {
									AlarmSeverity.push(item);
								}
							});
							AlarmSeverity.unshift({name: '-请选择告警级别-', type: null});
							_t.AlarmSeverityListArr = AlarmSeverity;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.baseDataThresholdOp = [];
							break;
					}
				});
			},
			// 获取明天的日期
			getNextDay(time) {
				if (!time) {
					return '';
				} else {
					const date = new Date(time);
					const dateNumFun = (num) => num < 10 ? `0${num}` : num;
					const [Y, M, D] = [
						date.getFullYear(),
						dateNumFun(date.getMonth() + 1),
						dateNumFun(date.getDate() + 1),
					];
					return `${Y}-${M}-${D}`;
				}
			},
			//浮窗的页签定时刷新
			refreshPageTab() {
				var _t = this;
				var rate = 5 * 60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-FloatingWindow'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
						}
					}
				}
				// 定时器防止密集访问
				_t.tabReloadTimer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.tabReloadLastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.tabReloadLastTime = nowTime;
						// 左侧 => 获取设备整体状态列表
						_t.getEquipmentAllStatusData();
						//获取当前展现的设备以及打开的tab
						var currentContentTab = _t.activeNameTabs;
						//根据打开的Tab进行定向刷新
						if (currentContentTab === "one" ) { //监测详情Tab
							_t.getMonitorWorkStatus();
						} else if (currentContentTab === "two") { //告警事件Tab
							_t.getAlarmListData();
						}
					}
				}, rate * 1000);
			}
		},
		created() {
			var _t = this;
			// 加载数据字典 map
			_t.getStatusDataBase();
			// 加载数据字典 maplist
			_t.getBaseDataList();
			// 左侧设备基本信息
			// _t.getEquipmentInfoData();
			// 左侧设备整体状态
			// _t.getEquipmentAllStatusData();
			/*
			 * 监测详情 接口数据 修改 先获取设备状态
			 * 1. 设备状态为 已暂停(11) 或者 已忽略(22)
			 * 2. 监测详情对应的状态改为已暂停 或者 已忽略
			 * 3. 以上两种状态 统计接口 返回只显示 不显示在页面
			 */
			// _t.getMonitorWorkStatus();
			// 监测详情批量操作接口数据
			// _t.getOperationMap();
			// 设置 告警事件 发生时间 的默认值
			var beginTime = new Date();
			var endTime = _t.getNextDay(new Date());
			_t.alarmEvent.dateTime[0] = beginTime;
			_t.alarmEvent.dateTime[1] = new Date(endTime);
		},
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
						// 有页签 点击调取数据 蒙版并 改变设备id
						_t.clickTabs();
						// 有页签 获取对应的设备标签下的小标签
						if (_t.diffDeviceStatus[_t.editableTabsValue]) {
							_t.activeNameTabs = _t.diffDeviceStatus[_t.editableTabsValue]
						}
					} else {
						// 没有这个页签 添加该页签
						_t.addTab(_t.activeDeviceName, _t.activeDeviceId);

						// 判断选中标签设备id 对应的 name
						_t.editableTabs.forEach((t) => {
							if (t.dataId === _t.activeDeviceId) {
								if (_t.diffDeviceStatus[t.name] === undefined) {
									// 首页进入 告警事件
									if (_t.activeName === 'two') {
										_t.activeNameTabs = 'two';
									}
									_t.diffDeviceStatus[t.name] = _t.activeNameTabs;
								}
							}
						});
					}
					// 更新设备基本信息
					_t.getEquipmentInfoData();
					// 更新设备整体状态
					_t.getEquipmentAllStatusData();

					// 标签页 默认显示 这里默认调用 告警事件
					if (_t.activeNameTabs === 'one') {
						// 监测设备工作状态  (3,设备工作状态,监测表格数据,监测状态统计)
						_t.getMonitorWorkStatus();
						// 监测详情批量操作接口数据
						_t.getOperationMap();
						// 清除原来的定时器
						_t.clearIntervalFun();
						//定时刷新页面
						_t.refreshPageTab();
					} else if (_t.activeNameTabs === 'two') {
						// 告警事件接口
						_t.getAlarmListData();
						// 清除原来的定时器
						_t.clearIntervalFun();
						//定时刷新页面
						_t.refreshPageTab();
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

	.logo-img-tabs {
		width: 90px;
		height: 90px;
	}

	.thresholdContent-box {
		position: absolute;
		top: 130px;
		left: 20px;
		right: 20px;
		bottom: 0;
		z-index: 10;
	}

	.thresholdContent-box #thresholdContent-contentLeft,
	.thresholdContent-box #thresholdContent-contentRight {
		position: absolute;
		top: 0;
		bottom: 0;
		overflow: auto;
	}

	.thresholdContent-box #thresholdContent-contentLeft {
		width: 234px;
		left: 0;
		border: 1px solid #eaeef2;
		border-bottom: 0;
	}

	.thresholdContent-box #thresholdContent-contentRight {
		left: 244px;
		right: 0;
	}

	.thresholdContent-formItemBox {
		margin-bottom: 10px;
		padding-top: 10px;
		position: relative;
	}

	.addEditBtn {
		width: 30px;
		height: 30px;
		padding: 0;
		line-height: 30px;
		text-align: center;
	}

	.thresholdContent-deleteBtn {
		position: absolute;
		top: 10px;
		right: 10px;
		display: none;
	}

	.thresholdContent-formItemBox:hover .thresholdContent-deleteBtn {
		display: inline-block;
	}

	.MainMonitor {
		margin: 50px auto;
	}

	.netWorkContent-padding {
		padding: 30px 20px;
	}

	.netWorkContent-BorderBottom {
		border-bottom: 1px solid #e1e1e1;
	}

	.netWorkContent-marginBottom {
		margin-bottom: 10px;
	}

	.netWorkContent-contentWidth {
		width: 150px;
		display: inline-block;
	}

	.netWorkContent-contentBottom {
		padding: 20px 0;
	}

	.locationContent-padding {
		padding: 30px 20px;
	}

	.locationContent-marginBottom {
		margin-bottom: 10px;
	}

	.changeContent-padding {
		padding: 30px 20px;
	}

	.maintenanceContent-padding {
		padding: 30px 20px;
	}

	.maintenanceContent-marginBottom {
		margin-bottom: 10px;
	}

	.maintenanceContent-contentWidth {
		width: 150px;
		display: inline-block;
	}
</style>
<style>
	.administration-box .box-wrap {
		padding: 30px 10px 0 10px;
		position: absolute;
	}

	.administration-info-box .el-form-item {
		font-size: 12px;
		margin-bottom: 0;
	}

	.expendTable .el-table__expand-column .cell {
		display: none;
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

	.alarmAdministrationTabs-dialog .el-dialog {
		width: 700px;
		height: 500px;
	}

	.administration-info-box .el-form-item .el-form-item__content {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.monitorInfo-dialog .el-dialog {
		width: 1250px;
		height: 600px;
	}

	.thresholdContent-tree .el-tree-node__content {
		height: 36px;
		line-height: 36px;
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
	}

	.hardWare-borderGray {
		border: 1px solid #eaedf1;
	}

	.hardWare-borderGray:hover {
		background-color: #f4f4f4;
	}

	.hardWare-tabsRow.el-row {
		margin-left: 25px !important;
		margin-right: 25px !important;
	}
</style>
