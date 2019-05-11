<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmSettings')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.basicSettings')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmRuleSettings')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--表单-->
		<div class="padding20 borderBottom">
			<el-form :model="formItem" inline>
			<el-form-item :label="$t('alarmRuleSettings.formGroupName') + '：'">
				<el-input v-model="formItem.groupName" clearable/>
			</el-form-item>
			<el-form-item :label="$t('alarmRuleSettings.formIpName') + '：'">
				<el-input v-model="formItem.ip" clearable/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
				<el-button type="reset" class="queryBtn" @click="resetData">{{$t('public.reset')}}</el-button>
			</el-form-item>
			</el-form>
		</div>
		<div class="padding20">
			<!--全局操作-->
			<div class="marBottom16">
				<el-button type="warning" @click="addDataBtn" class="queryBtn">
					<i class="el-icon-circle-plus-outline"></i> {{$t('public.add')}}
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="editDataBtn" class="queryBtn">
					<i class="el-icon-edit-outline"></i> {{$t('public.edit')}}
				</el-button>
				<el-button :disabled="disableBtn.more" @click="deleteData" class="queryBtn">
					<i class="el-icon-delete"></i> {{$t('public.delete')}}
				</el-button>
			</div>
			<el-table :data="tableData" stripe border ref="table" @selection-change="selectTableNum">
				<el-table-column type="selection" fixed header-align="left" align="left"/>
				<el-table-column fixed width="60px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
							{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed min-width="100px" prop="noticeGroupName" label="告警组名称" header-align="left" align="left"/>
				<el-table-column width="100px" label="告警级别" header-align="center" align="center">
					<el-table-column width="50px" label="紧急" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.alarmLevelSerious === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="警告" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.alarmLevelGeneral === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="通知内容" header-align="center" align="center">
					<el-table-column width="50px" label="告警" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeContentAlarm === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="告警确认" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeContentConfirm === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="告警评注" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeContentCommentary === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="告警报修" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeContentRepair === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="告警关闭" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeContentClose === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="通知方式" header-align="center" align="center">
					<el-table-column width="50px" label="邮件" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWayEmail === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="短信" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWaySMS === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="微信" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWayWeChat === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="播放声音" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWayVoice === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="页面弹窗" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWayDialog === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
					<el-table-column width="50px" label="Syslog" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeWaySyslog === true" class="el-icon-check"></span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column width="50px" label="通知值班人" header-align="center" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.noticeObjectDuty === true" class="el-icon-check"></span>
					</template>
				</el-table-column>
				<el-table-column width="50px" label="通知设备责任人" header-align="center" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.noticeObjectDevice === true" class="el-icon-check"></span>
					</template>
				</el-table-column>
				<el-table-column width="50px" label="通知业务责任人" header-align="center" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.noticeObjectBusiness === true" class="el-icon-check"></span>
					</template>
				</el-table-column>
				<el-table-column prop="noticeUserCount" width="90px" label="通知用户数" header-align="left" align="left"/>
				<el-table-column width="100px" prop="createBy" label="创建人" header-align="left" align="left"/>
				<el-table-column width="160px" label="创建时间" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px" prop="lastModifyBy" label="更新人" header-align="left" align="left"/>
				<el-table-column width="160px" label="更新时间" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.lastModifyTime | dateFilter}}</span>
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
		<!--新增编辑-->
		<el-dialog
			class="alarmRuleSettings-dialog"
			append-to-body
			title="新增/编辑告警规则"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="addEdit" :rules="rules" ref="ruleForm" label-width="100px">
				<el-form-item label="告警组：" prop="groupId">
					<el-select v-model="addEdit.groupId" clearable>
						<el-option v-for="(item,index) in alarmGroupList" :key="index" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="告警级别：">
					<el-checkbox-group v-model="addEdit.alarmLevel">
						<el-checkbox class="alarmRule-checkedBox" v-for="(item,index) in alarmLevelList" :key="index"  :label="item.type">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="通知内容：">
					<el-checkbox-group v-model="addEdit.NoticeContent">
						<el-checkbox class="alarmRule-checkedBox" v-for="(item,index) in NoticeContent" :key="index"  :label="item.type">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="通知方式：">
					<el-checkbox-group v-model="addEdit.NoticeFun" @change="changeNoticeFun(addEdit.NoticeFun)">
						<el-checkbox class="alarmRule-checkedBox" v-for="(item,index) in NoticeFun" :key="index"  :label="item.type">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="通知规则：">
					<div class="alarmRuleSettings-borderColor">
						<div class="alarmRuleSettings-first alarmRuleSettings-padding">
							<span>1、同一设备在第</span>
							<div class="positionRelative displayInlineBlock">
								<el-input id="noticeRuleFirst" class="width50 contentCenter" v-model="addEdit.noticeRuleFirst" @input="changeInputNumber(1,addEdit.noticeRuleFirst)" @keyup.native="inputNumber(1,addEdit.noticeRuleFirst)"/>
								<span v-if="errorTip.noticeRuleFirst" class="isNotNull width200">必须大于0</span>
							</div>
							<span>次告警时进行首次发送</span>
						</div>
						<div class="alarmRuleSettings-second alarmRuleSettings-padding">
							<p>2、后续发送策略</p>
							<el-radio-group @change="changeNoticeRuleNextType(addEdit.noticeRuleNextType)" v-model="addEdit.noticeRuleNextType">
								<el-radio label="0">不发送</el-radio>
								<el-radio label="1">每次发送</el-radio>
								<el-radio label="2">
									<span>每隔</span>
									<div class="positionRelative displayInlineBlock">
										<el-input id="noticeRuleNextEvery" class="width50 contentCenter" v-model="addEdit.noticeRuleNextEvery" @input="changeInputNumber(2,addEdit.noticeRuleNextEvery)" @keyup.native="inputNumber(2,addEdit.noticeRuleNextEvery)" />
										<span v-if="errorTip.noticeRuleNextEvery" class="isNotNull width200">必须大于0</span>
									</div>
									<span>次发送一次</span>
								</el-radio>
							</el-radio-group>
						</div>
						<!--告警升级-->
						<div class="alarmRuleSettings-third alarmRuleSettings-padding">
							<el-checkbox @change="changeAlarmUpgrade(addEdit.isAlarmUpgrade)" class="alarmRule-checkedBox iconfontError" v-model="addEdit.isAlarmUpgrade">告警升级</el-checkbox>
						</div>
						<div v-if="addEdit.isAlarmUpgrade" class="alarmRuleSettings-borderTop">
							<div class="alarmRuleSettings-padding marBottom10">
								<span>1、发送次数超过</span>
								<div class="positionRelative displayInlineBlock">
									<el-input id="alarmNotconfirmDuration" class="width50 contentCenter" v-model="addEdit.alarmNotconfirmDuration" @input="changeInputNumber(3,addEdit.alarmNotconfirmDuration)" @keyup.native="inputNumber(3,addEdit.alarmNotconfirmDuration)" />
									<span v-if="errorTip.alarmNotconfirmDuration" class="isNotNull width200">必须大于0</span>
								</div>
								<span>次依然没有处理，则给下列人员发送告警</span>
							</div>
							<div class="alarmRuleSettings-padding">
								<el-form-item label-width="120px" label="邮箱地址(分号隔开)：">
									<el-input
										id="upgradeNoticeEmail"
										v-model="addEdit.upgradeNoticeEmail"
										class="width410 fs12"
										type="textarea"
										@input="ruleEmails('AlarmUpgrade',addEdit.upgradeNoticeEmail,'upgradeNoticeEmail')"
										:autosize="{minRows:2,maxRows:5}" />
									<span v-if="errorTip.isNotAllNull" class="isNotNullTip iconfontError">邮箱地址,短信号码,微信号码中至少一项不能为空</span>
									<div style="height: 20px;line-height: 20px;">
										<span v-if="errorTip.upgradeNoticeEmail" class="iconfontError">邮箱格式有误</span>
									</div>
								</el-form-item>
								<el-form-item label-width="120px" label="短信号码(分号隔开)：">
									<el-input
										id="upgradeNoticeMobile"
										v-model="addEdit.upgradeNoticeMobile"
										class="width410 fs12"
										type="textarea"
										@input="ruleMobile('AlarmUpgrade',addEdit.upgradeNoticeMobile,'upgradeNoticeMobile')"
										:autosize="{minRows:2,maxRows:5}" />
									<div style="height: 20px;line-height: 20px;">
										<span v-if="errorTip.upgradeNoticeMobile" class="iconfontError">短信号码格式有误</span>
									</div>
								</el-form-item>
								<el-form-item label-width="120px" label="微信号码(分号隔开)：">
									<el-input v-model="addEdit.upgradeNoticeWeixin" @input="changeInputWechat(addEdit.upgradeNoticeWeixin)" class="width410 fs12" type="textarea" :autosize="{minRows:2,maxRows:5}" />
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="发送时间：">
					<el-checkbox-group v-model="addEdit.DayOfWeek">
						<el-checkbox class="alarmRule-checkedBox" v-for="(item,index) in DayOfWeek" :key="index"  :label="item.type">{{item.name}}</el-checkbox>
					</el-checkbox-group>
					<label>起始时间(HH)：</label>
					<el-select v-model="addEdit.dayBeginTime" class="width68 marginRight20">
						<el-option v-for="(item,index) in dayBeginTime" :key="index" :label="item.label" :value="item.value"/>
					</el-select>
					<label>截止时间(HH)：</label>
					<el-select v-model="addEdit.dayEndTime" class="width68">
						<el-option v-for="(item,index) in dayEndTime" :key="index" :label="item.label" :value="item.value"/>
					</el-select>
				</el-form-item>
				<el-form-item label="通知用户对象：">
					<el-checkbox-group v-model="addEdit.noticeObject">
						<el-checkbox class="alarmRule-checkedBox" v-for="(item,index) in NoticeUserObj" :key="index"  :label="item.type">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="额外发送的用户：">
					<div class="marBottom10">
						<el-button type="primary" class="queryBtn" size="small" @click="selectUserBtn">选择用户</el-button>
					</div>
					<el-tag class="marBottom10"
						v-for="(tag,index) in addEdit.noticeUserIds"
						:key="index"
						closable
						@close="handleCloseUser(tag)">
						{{tag.nodeName}}
					</el-tag>
				</el-form-item>
				<el-form-item style="margin-bottom: 0;" class="elFormLabelPadRight" label="额外发送的邮箱(分号隔开)：">
					<el-input
						id="noticeOtherEmail"
						class="fs12"
						v-model="addEdit.noticeOtherEmail"
						@input="ruleEmails('noticeOther',addEdit.noticeOtherEmail,'noticeOtherEmail')"
						type="textarea"
						:autosize="{minRows:2,maxRows:5}" />
					<div style="height: 20px;line-height: 20px;">
						<span v-if="errorTip.noticeOtherEmail" class="iconfontError">邮箱格式有误</span>
					</div>
				</el-form-item>
				<el-form-item style="margin-bottom: 0;" class="elFormLabelPadRight" label="额外发送的短信号码(分号隔开)：">
					<el-input
						id="noticeOtherMobile"
						class="fs12"
						v-model="addEdit.noticeOtherMobile"
						@input="ruleMobile('noticeOther',addEdit.noticeOtherMobile,'noticeOtherMobile')"
						type="textarea"
						:autosize="{minRows:2,maxRows:5}" />
					<div style="height: 20px;line-height: 20px;">
						<span v-if="errorTip.noticeOtherMobile" class="iconfontError">短信号码格式有误</span>
					</div>
				</el-form-item>
				<el-form-item class="elFormLabelPadRight" label="额外发送的微信号码(分号隔开)：">
					<el-input
						id="noticeOtherWeixin"
						class="fs12"
						v-model="addEdit.noticeOtherWeixin"
						type="textarea"
						:autosize="{minRows:2,maxRows:5}" />
				</el-form-item>
			</el-form>
			<!--选择用户内层弹出层-->
			<el-dialog
				class="alarmRuleSettings-innerUserDialog"
				append-to-body
				title="选择用户"
				:visible.sync="dialogVisibleUser"
				:close-on-click-modal="false"
				:close-on-press-escape="false">
				<el-tree
					class="alarmRuleSettings-selectUser"
					ref="userTree"
					check-strictly
					:data="userTreeData"
					:default-expanded-keys="defaultExpandedKeys"
					node-key="nodeId"
					show-checkbox
					:props="defaultPropsUser"/>
				<div slot="footer">
					<el-button type="primary" class="alertBtn" @click="submitUser">
						{{$t('public.confirm')}}
					</el-button>
					<el-button class="alertBtn" @click="resetUser">{{$t('public.cancel')}}</el-button>
				</div>
			</el-dialog>
			<!--选择播放声音-->
			<el-dialog
				class="alarmRuleSettings-innerDialog"
				append-to-body
				:before-close="resetSound"
				title="选择播放的声音"
				:visible.sync="dialogVisibleSound"
				:close-on-click-modal="false"
				:close-on-press-escape="false">
				<el-table :data="alarmSoundData" :row-key="getRowKeys" ref="soundTable" stripe border class="alarmSoundData-table" @select="changeTableSound">
					<el-table-column class="alarmSoundData-selection" type="selection" header-align="left" align="left"/>
					<el-table-column fixed width="60px" :label="$t('public.index')" header-align="left" align="left">
						<template slot-scope="scope">
							<span>
								{{scope.$index+(alarmSoundOptions.currentPage - 1) * alarmSoundOptions.pageSize + 1}}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="displayName" label="音频文件" header-align="left" align="left"/>
					<el-table-column width="50px" label="操作" header-align="left" align="left">
						<template slot-scope="scope">
							<el-button v-show="scope.row.isPlay === false" type="text" @click="submitSound(scope.row)">
								<span class="iconfont fs12" title="试听">&#xe645;</span>
							</el-button>
							<el-button v-show="scope.row.isPlay === true" type="text" @click="closeSound(scope.row)">
								<span class="iconfont fs12" title="暂停">&#xe651;</span>
							</el-button>
							<audio style="display: none;" :id="scope.row.id" controls="controls">
								<source :src="rootUrl + scope.row.filePath" :type="scope.row.fileType" />
							</audio>
						</template>
					</el-table-column>
				</el-table>
				<!--分页-->
				<pages
					:total='alarmSoundOptions.total'
					:currentPage='alarmSoundOptions.currentPage'
					:page-size="alarmSoundOptions.pageSize"
					@handleSizeChangeSub="handleSizeAlarmSoundOptionsChangeSub"
					@handleCurrentChangeSub="handleAlarmSoundOptionsCurrentChange"/>
				<div slot="footer">
					<el-button type="primary" class="alertBtn" @click="dialogVisibleSound = false;">
						{{$t('public.confirm')}}
					</el-button>
					<el-button class="alertBtn" @click="resetSound">{{$t('public.cancel')}}</el-button>
				</div>
			</el-dialog>
			<div slot="footer">
				<el-button type="primary" class="alertBtn" v-if="ifAdd === true" @click="addData('ruleForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button type="primary" class="alertBtn" v-if="ifAdd === false" @click="editData('ruleForm')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/Box';
	import {dateFilter} from "../../../../assets/js/filters";
	import {isNotNull,isGreaterThanZero} from "../../../../assets/js/validator";

	export default{
		name:'alarm-rule-settings',
		components:{Box},
		data(){
			return {
				rootUrl:this.$api.root(),
				// 查询表单
				formItem:{
					groupName:null,
					ip:null
				},
				// 新增编辑
				addEdit:{
					groupId:'',
					alarmLevel:['99'], // 告警级别
					NoticeContent:['0'], // 通知内容
					NoticeFun:['0'], // 通知方式
					DayOfWeek:['1'], // 发送时间 周
					noticeObject:['0'], // 通知用户对象
					noticeRuleFirst:1, // 同一设备告警次数
					noticeRuleNextType:'1', // 后续发送策略
					noticeRuleNextEvery:1, // 每隔次数
					alarmNotconfirmDuration:10, // 超出次数
					isAlarmUpgrade:false, // 告警升级
					upgradeNoticeEmail:'', // 升级邮箱地址
					upgradeNoticeMobile:'', // 升级短信
					upgradeNoticeWeixin:'', // 升级微信
					dayBeginTime:0, // 起始时间
					dayEndTime:24, // 截止时间
					noticeUserIds:[], // 额外用户
					noticeOtherEmail:'', // 额外邮件地址
					noticeOtherMobile:'', // 额外短信号码
					noticeOtherWeixin:'', // 额外微信号码
					alarmSound:null, // 告警声音文件
				},
				// 校验错误提示
				errorTip:{
					noticeRuleFirst:false, // 首次发送
					noticeRuleNextEvery:false, // 每隔几次
					alarmNotconfirmDuration:false, // 超出几次
					isNotAllNull:false, // 三项不能全部为空
					upgradeNoticeEmail:false, // 告警升级邮箱地址
					upgradeNoticeMobile:false, // 告警升级短信号码
					noticeOtherMobile:false, // 额外短信号码
					noticeOtherEmail:false, // 额外邮箱
				},
				// 启用禁用操作
				disableBtn: {
					edit: true,
					more: true
				},
				// 选择用户树
				defaultPropsUser:{
					label:'nodeName',
					children:'children',
					disabled:function (data) {
						if (data.level === 1 || data.level === 2) {
							return true;
						} else {
							return false;
						}
					}
				},
				// 分页
				options: {
					currentPage: 1,
					total: 0,
					pageSize: 10
				},
				// 播放声音分页
				alarmSoundOptions:{
					currentPage: 1,
					total: 0,
					pageSize: 10
				},
				checkIdsList:[], // 选中行的id集合
				alarmGroupList:[], // 告警组集合
				tableData:[], // 表格数据
				alarmLevelList:[], // 告警级别数据
				DayOfWeek:[], // 发送时间集合
				NoticeContent:[], // 通知内容集合
				NoticeFun:[], // 通知方式集合
				NoticeUserObj:[], // 通知用户对象
				alarmSoundData:[], // 播放声音表格数据
				userTreeData:[], // 选择用户树形
				defaultExpandedKeys:[], // 选择用户树默认展开第一个节点
				dayBeginTime:[],
				dayEndTime:[],
				ifAdd:true, // 是否新增
				dialogVisible:false, // 新增编辑弹出层
				dialogVisibleSound:false, // 播放声音弹出层
				dialogVisibleUser:false, // 选择用户弹出层
				// 校验
				rules:{
					groupId:[
						{validator: isNotNull, trigger: ['blur','change']}
					],

				}
			}
		},
		methods:{
			getRowKeys(row){
				return row.id;
			},
			// 添加按钮
			addDataBtn(){
				var _t = this;
				_t.ifAdd = true;
				_t.getAlarmGroupList();
				_t.getTime();
				_t.dialogVisible = true;
			},
			// 新增提交
			addData(formName){
				var _t = this;
				// 校验 首次发送 数字
				_t.changeInputNumber(1,_t.addEdit.noticeRuleFirst);
				// 校验后续发送策略数字
				if (_t.addEdit.noticeRuleNextType === '2') {
					_t.changeInputNumber(2,_t.addEdit.noticeRuleNextEvery);
				}
				// 勾选了告警升级
				if (_t.addEdit.isAlarmUpgrade === true) {
					// 1. 校验超出次数
					_t.changeInputNumber(3,_t.addEdit.alarmNotconfirmDuration);

					// 2. 校验 告警升级 三个多行输入是否都为空
					if (_t.addEdit.upgradeNoticeEmail.trim() === '' && _t.addEdit.upgradeNoticeMobile.trim() === '' && _t.addEdit.upgradeNoticeWeixin.trim() === '') {
						_t.errorTip.isNotAllNull = true;
					} else {
						_t.errorTip.isNotAllNull = false;
					}
					// 3. 校验 邮件格式是否正确 AlarmUpgrade: 告警升级
					_t.ruleEmails('AlarmUpgrade',_t.addEdit.upgradeNoticeEmail,'upgradeNoticeEmail');
					// 4. 校验 手机号码格式 是否正确 1 告警升级
					_t.ruleMobile('AlarmUpgrade',_t.addEdit.upgradeNoticeMobile,'upgradeNoticeMobile');
				}

				// 统计自定义 校验
				var isCommit = false;
				if (_t.errorTip.noticeRuleFirst === false
					&& _t.errorTip.noticeRuleNextEvery === false
					&& _t.errorTip.alarmNotconfirmDuration === false
					&& _t.errorTip.isNotAllNull === false
					&& _t.errorTip.upgradeNoticeEmail === false
					&& _t.errorTip.upgradeNoticeMobile === false
					&& _t.errorTip.noticeOtherMobile === false
					&& _t.errorTip.noticeOtherEmail === false) {
					isCommit = true;
				} else {
					isCommit = false;
				}
				_t.$refs[formName].validate((valid) => {
					if (valid && isCommit) {
						// 提交的时候 分号正则转换
						var upgradeNoticeEmailArr = new Array();
						var upgradeNoticeMobileArr = new Array();
						var upgradeNoticeWeixinArr = new Array();
						var noticeOtherEmailArr = new Array();
						var noticeOtherMobileArr = new Array();
						var noticeOtherWeixinArr = new Array();
						var reg = /；/gi;
						var upgradeNoticeEmail = _t.addEdit.upgradeNoticeEmail.replace(reg,';'); // 告警升级邮件
						// 告警升级邮件分割去除为空的
						if (upgradeNoticeEmail.trim() !== '') {

							upgradeNoticeEmail.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeEmailArr.push(val);
								}
							});
						}
						// 告警升级 短信 过滤为空
						var upgradeNoticeMobile = _t.addEdit.upgradeNoticeMobile.replace(reg,';');
						if (upgradeNoticeMobile.trim() !== '') {
							upgradeNoticeMobile.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeMobileArr.push(val);
								}
							});
						}
						// 告警升级 微信 过滤为空
						var upgradeNoticeWeixin = _t.addEdit.upgradeNoticeWeixin.replace(reg,';');
						if (upgradeNoticeWeixin.trim() !== '') {
							upgradeNoticeWeixin.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeWeixinArr.push(val);
								}
							});
						}
						// 额外用户 过滤邮件为空
						var noticeOtherEmail = _t.addEdit.noticeOtherEmail.replace(reg,';');
						if (noticeOtherEmail.trim() !== '') {
							noticeOtherEmail.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherEmailArr.push(val);
								}
							});
						}
						// 额外用户 过滤短信为空
						var noticeOtherMobile = _t.addEdit.noticeOtherMobile.replace(reg,';');
						if (noticeOtherMobile.trim() !== '') {
							noticeOtherMobile.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherMobileArr.push(val);
								}
							});
						}
						// 额外用户 过滤微信为空
						var noticeOtherWeixin = _t.addEdit.noticeOtherWeixin.replace(reg,';');
						if (noticeOtherWeixin.trim() !== '') {
							noticeOtherWeixin.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherWeixinArr.push(val);
								}
							});
						}
						// 额外用户
						var noticeUserIds = new Array();
						if (_t.addEdit.noticeUserIds.length !== 0) {
							_t.addEdit.noticeUserIds.forEach((item)=>{
								noticeUserIds.push(item.nodeId);
							});
						}
						_t.$api.post('alarm/noticeRule/',{
							alarmNoticeRule:{
								groupId:_t.addEdit.groupId, // 告警组
								alarmLevel:_t.addEdit.alarmLevel.join(','), // 告警级别
								noticeContent:_t.addEdit.NoticeContent.join(','), // 通知内容
								noticeWay:_t.addEdit.NoticeFun.join(','), // 通知方式
								noticeRuleFirst:_t.addEdit.noticeRuleFirst, // 首次发送次数
								noticeRuleNextType:_t.addEdit.noticeRuleNextType, // 后续发送类型
								noticeRuleNextEvery:_t.addEdit.noticeRuleNextEvery, // 每隔次数
								isAlarmUpgrade:_t.addEdit.isAlarmUpgrade, // 是否升级
								alarmNotconfirmDuration:_t.addEdit.alarmNotconfirmDuration, // 超出次数
								upgradeNoticeEmail:upgradeNoticeEmailArr.join(';'), // 告警升级邮件
								upgradeNoticeMobile:upgradeNoticeMobileArr.join(';'), // 告警升级短信
								upgradeNoticeWeixin:upgradeNoticeWeixinArr.join(';'), // 告警升级微信
								daysOfWeek:_t.addEdit.DayOfWeek.join(','), // 发送时间
								dayBeginTime:Number(_t.addEdit.dayBeginTime),
								dayEndTime:Number(_t.addEdit.dayEndTime),
								noticeObject:_t.addEdit.noticeObject.join(','),
								noticeUserIds:noticeUserIds.join(','),
								noticeUserCount:noticeUserIds.length,
								noticeOtherEmail:noticeOtherEmailArr.join(';'),
								noticeOtherMobile:noticeOtherMobileArr.join(';'),
								noticeOtherWeixin:noticeOtherWeixinArr.join(';'),
								alarmSound:_t.addEdit.alarmSound === null ? null : (_t.addEdit.alarmSound === '' ? null : _t.addEdit.alarmSound)
							}
						},function (res) {
							switch (res.status) {
								case 200:
									_t.getData();
									_t.resetFormData();
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
					}
				});
			},
			// 编辑按钮
			editDataBtn(){
				var _t = this;
				_t.ifAdd = false;
				_t.getAlarmGroupList();
				_t.getTime();
				_t.dialogVisible = true;
			},
			// 编辑提交
			editData(formName){
				var _t = this;
				// 校验 首次发送 数字
				_t.changeInputNumber(1,_t.addEdit.noticeRuleFirst);
				// 校验后续发送策略数字
				if (_t.addEdit.noticeRuleNextType === '2') {
					_t.changeInputNumber(2,_t.addEdit.noticeRuleNextEvery);
				}
				// 勾选了告警升级
				if (_t.addEdit.isAlarmUpgrade === true) {
					// 1. 校验超出次数
					_t.changeInputNumber(3,_t.addEdit.alarmNotconfirmDuration);

					// 2. 校验 告警升级 三个多行输入是否都为空
					if (_t.addEdit.upgradeNoticeEmail.trim() === '' && _t.addEdit.upgradeNoticeMobile.trim() === '' && _t.addEdit.upgradeNoticeWeixin.trim() === '') {
						_t.errorTip.isNotAllNull = true;
					} else {
						_t.errorTip.isNotAllNull = false;
					}
					// 3. 校验 邮件格式是否正确 AlarmUpgrade: 告警升级
					_t.ruleEmails('AlarmUpgrade',_t.addEdit.upgradeNoticeEmail,'upgradeNoticeEmail');
					// 4. 校验 手机号码格式 是否正确 1 告警升级
					_t.ruleMobile('AlarmUpgrade',_t.addEdit.upgradeNoticeMobile,'upgradeNoticeMobile');
				}

				// 统计自定义 校验
				var isCommit = false;
				if (_t.errorTip.noticeRuleFirst === false
					&& _t.errorTip.noticeRuleNextEvery === false
					&& _t.errorTip.alarmNotconfirmDuration === false
					&& _t.errorTip.isNotAllNull === false
					&& _t.errorTip.upgradeNoticeEmail === false
					&& _t.errorTip.upgradeNoticeMobile === false
					&& _t.errorTip.noticeOtherMobile === false
					&& _t.errorTip.noticeOtherEmail === false) {
					isCommit = true;
				} else {
					isCommit = false;
				}
				_t.$refs[formName].validate((valid) => {
					if (valid && isCommit) {
						// 提交的时候 分号正则转换
						var upgradeNoticeEmailArr = new Array();
						var upgradeNoticeMobileArr = new Array();
						var upgradeNoticeWeixinArr = new Array();
						var noticeOtherEmailArr = new Array();
						var noticeOtherMobileArr = new Array();
						var noticeOtherWeixinArr = new Array();
						var reg = /；/gi;
						var upgradeNoticeEmail = _t.addEdit.upgradeNoticeEmail.replace(reg,';'); // 告警升级邮件
						// 告警升级邮件分割去除为空的
						if (upgradeNoticeEmail.trim() !== '') {

							upgradeNoticeEmail.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeEmailArr.push(val);
								}
							});
						}
						// 告警升级 短信 过滤为空
						var upgradeNoticeMobile = _t.addEdit.upgradeNoticeMobile.replace(reg,';');
						if (upgradeNoticeMobile.trim() !== '') {
							upgradeNoticeMobile.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeMobileArr.push(val);
								}
							});
						}
						// 告警升级 微信 过滤为空
						var upgradeNoticeWeixin = _t.addEdit.upgradeNoticeWeixin.replace(reg,';');
						if (upgradeNoticeWeixin.trim() !== '') {
							upgradeNoticeWeixin.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									upgradeNoticeWeixinArr.push(val);
								}
							});
						}
						// 额外用户 过滤邮件为空
						var noticeOtherEmail = _t.addEdit.noticeOtherEmail.replace(reg,';');
						if (noticeOtherEmail.trim() !== '') {
							noticeOtherEmail.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherEmailArr.push(val);
								}
							});
						}
						// 额外用户 过滤短信为空
						var noticeOtherMobile = _t.addEdit.noticeOtherMobile.replace(reg,';');
						if (noticeOtherMobile.trim() !== '') {
							noticeOtherMobile.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherMobileArr.push(val);
								}
							});
						}
						// 额外用户 过滤微信为空
						var noticeOtherWeixin = _t.addEdit.noticeOtherWeixin.replace(reg,';');
						if (noticeOtherWeixin.trim() !== '') {
							noticeOtherWeixin.split(';').forEach((val)=>{
								if(val.trim() !== '') {
									noticeOtherWeixinArr.push(val);
								}
							});
						}
						// 额外用户
						var noticeUserIds = new Array();
						if (_t.addEdit.noticeUserIds.length !== 0) {
							_t.addEdit.noticeUserIds.forEach((item)=>{
								noticeUserIds.push(item.nodeId);
							});
						}
						_t.$api.put('alarm/noticeRule/',{
							alarmNoticeRule:{
								id:_t.checkIdsList.join(','), // id
								groupId:_t.addEdit.groupId, // 告警组
								alarmLevel:_t.addEdit.alarmLevel.join(','), // 告警级别
								noticeContent:_t.addEdit.NoticeContent.join(','), // 通知内容
								noticeWay:_t.addEdit.NoticeFun.join(','), // 通知方式
								noticeRuleFirst:_t.addEdit.noticeRuleFirst, // 首次发送次数
								noticeRuleNextType:_t.addEdit.noticeRuleNextType, // 后续发送类型
								noticeRuleNextEvery:_t.addEdit.noticeRuleNextEvery, // 每隔次数
								isAlarmUpgrade:_t.addEdit.isAlarmUpgrade, // 是否升级
								alarmNotconfirmDuration:_t.addEdit.alarmNotconfirmDuration, // 超出次数
								upgradeNoticeEmail:upgradeNoticeEmailArr.join(';'), // 告警升级邮件
								upgradeNoticeMobile:upgradeNoticeMobileArr.join(';'), // 告警升级短信
								upgradeNoticeWeixin:upgradeNoticeWeixinArr.join(';'), // 告警升级微信
								daysOfWeek:_t.addEdit.DayOfWeek.join(','), // 发送时间
								dayBeginTime:Number(_t.addEdit.dayBeginTime),
								dayEndTime:Number(_t.addEdit.dayEndTime),
								noticeObject:_t.addEdit.noticeObject.join(','),
								noticeUserIds:noticeUserIds.join(','),
								noticeUserCount:noticeUserIds.length,
								noticeOtherEmail:noticeOtherEmailArr.join(';'),
								noticeOtherMobile:noticeOtherMobileArr.join(';'),
								noticeOtherWeixin:noticeOtherWeixinArr.join(';'),
								alarmSound:_t.addEdit.alarmSound === null ? null : (_t.addEdit.alarmSound === '' ? null : _t.addEdit.alarmSound)
							}
						},function (res) {
							switch (res.status) {
								case 200:
									_t.getData();
									_t.resetFormData();
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
					}
				});
			},
			// 删除按钮
			deleteData(){
				var _t = this;
				_t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('alarm/noticeRule/', {
						jsonString: JSON.stringify({
							id: _t.checkIdsList.join(',')
						})
					}, function(res) {
						_t.$store.commit('setLoading', false);
						switch(res.status) {
							case 200:
								_t.$alert('删除成功!', _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
								});
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 2007: // 删除失败
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
								});
								break;
							default:
								_t.getData();
								break;
						}
						_t.disableBtn.edit = true;
						_t.disableBtn.more = true;
					});
				}).catch(() => {
					return;
				});
			},
			// 输入微信号时 校验三项不能为空
			changeInputWechat(data){
				var _t = this;
				if (data.trim() !== '') {
					_t.errorTip.isNotAllNull = false;
				}
			},
			// 改变后续发送策略的单选按钮组
			changeNoticeRuleNextType(data){
				var _t = this;
				// 没有选中 每隔次数项 该项取消校验 置为0
				if (data !== '2') {
					_t.addEdit.noticeRuleNextEvery = 1;
					_t.errorTip.noticeRuleNextEvery = false;
					document.getElementById('noticeRuleNextEvery').style.borderColor = '#DCDFE6';
				}
			},
			// 改变告警升级复选框
			changeAlarmUpgrade(val){
				var _t = this;
				// 取消勾选
				if (val === false) {
					// 不正常超出次数 恢复为0
					if (_t.addEdit.alarmNotconfirmDuration == '') {
						_t.addEdit.alarmNotconfirmDuration = 10;
					}
					// 取消 告警升级的 校验
					document.getElementById('alarmNotconfirmDuration').style.borderColor = '#DCDFE6';
					_t.errorTip.alarmNotconfirmDuration = false;
					_t.errorTip.upgradeNoticeEmail = false; // 邮箱地址
					_t.errorTip.isNotAllNull = false; // 三项不能全部为空
					_t.errorTip.upgradeNoticeMobile = false; // 短信
				}
			},
			// 改变输入数字的输入框
			changeInputNumber(val,data){
				var _t = this;
				// 首次告警
				data = Number(data);
				if (val === 1) {
					if (data > 0) {
						_t.errorTip.noticeRuleFirst = false;
						document.getElementById('noticeRuleFirst').style.borderColor = '#DCDFE6';
					} else {
						_t.errorTip.noticeRuleFirst = true;
						document.getElementById('noticeRuleFirst').style.borderColor = '#fb6041';
					}
				} else if (val === 2 && _t.addEdit.noticeRuleNextType === '2') {
					// 每隔
					if (data > 0) {
						_t.errorTip.noticeRuleNextEvery = false;
						document.getElementById('noticeRuleNextEvery').style.borderColor = '#DCDFE6';
					} else {
						_t.errorTip.noticeRuleNextEvery = true;
						document.getElementById('noticeRuleNextEvery').style.borderColor = '#fb6041';
					}
				} else if (val === 3) {
					// 超出
					if (data > 0) {
						_t.errorTip.alarmNotconfirmDuration = false;
						document.getElementById('alarmNotconfirmDuration').style.borderColor = '#DCDFE6';
					} else {
						_t.errorTip.alarmNotconfirmDuration = true;
						document.getElementById('alarmNotconfirmDuration').style.borderColor = '#fb6041';
					}
				}
			},
			// 选择用户按钮
			selectUserBtn(){
				var _t = this;
				_t.dialogVisibleUser = true;
				_t.getSelectUser();
			},
			// 选择用户提交按钮
			submitUser(){
				var _t = this;
				var selectedUserArr = _t.$refs.userTree.getCheckedNodes();
				if (selectedUserArr.length !== 0) {
					_t.addEdit.noticeUserIds = selectedUserArr;
				}
				// 重置
				_t.resetUser();
			},
			// 取消选择用户弹出层
			resetUser(){
				var _t = this;
				_t.dialogVisibleUser = false;
				_t.$refs.userTree.setCheckedKeys([]);
			},
			// 删除用户
			handleCloseUser(val){
				var _t = this;
				_t.addEdit.noticeUserIds.splice(_t.addEdit.noticeUserIds.indexOf(val.nodeId),1);
			},
			// 输入数字校验 只能输入数字
			inputNumber(val,data){
				var _t = this;
				data = Number(data);
				if (val === 1) {
					_t.addEdit.noticeRuleFirst = _t.addEdit.noticeRuleFirst.replace(/[^\d]/g,'');
				} else if (val === 2) {
					_t.addEdit.noticeRuleNextEvery = _t.addEdit.noticeRuleNextEvery.replace(/[^\d]/g,'');
				} else {
					_t.addEdit.alarmNotconfirmDuration = _t.addEdit.alarmNotconfirmDuration.replace(/[^\d]/g,'');
				}
			},
			// 校验邮箱 格式是否正确
			ruleEmails(val,data,domId){
				var _t = this;
				var reg = /；/gi;
				var ruleEmail = _t.$api.emailRegular();
				// 告警升级
				if (val === 'AlarmUpgrade') {
					if (data.trim() !== '') {
						// 中英文分号转换 统一转为英文分号
						var upgradeNoticeEmail = data.trim().replace(reg,';');
						// 分号分割转为 数组数据
						var upgradeNoticeEmailArr = upgradeNoticeEmail.split(';');
						upgradeNoticeEmailArr.forEach((val)=>{
							if (val.trim() !== '') {
								if (ruleEmail.test(val.trim()) === false) {
									_t.errorTip.upgradeNoticeEmail = true;
									document.getElementById(domId).style.borderColor = '#fb6041';
								} else {
									_t.errorTip.upgradeNoticeEmail = false;
									document.getElementById(domId).style.borderColor = '#DCDFE6';
								}
							}
						});
						// 输入告警升级 邮箱输入不为空 取消 三项不为空的提示
						_t.errorTip.isNotAllNull = false;
					} else {
						_t.errorTip.upgradeNoticeEmail = false;
						document.getElementById(domId).style.borderColor = '#DCDFE6';
					}
				} else {
					// 额外邮箱
					if (data.trim() !== '') {
						// 中英文分号转换 统一转为英文分号
						var upgradeNoticeEmail = data.trim().replace(reg,';');
						// 分号分割转为 数组数据
						var upgradeNoticeEmailArr = upgradeNoticeEmail.split(';');
						upgradeNoticeEmailArr.forEach((val)=>{
							if (val.trim() !== '') {
								if (ruleEmail.test(val.trim()) === false) {
									_t.errorTip.noticeOtherEmail = true;
									document.getElementById(domId).style.borderColor = '#fb6041';
								} else {
									_t.errorTip.noticeOtherEmail = false;
									document.getElementById(domId).style.borderColor = '#DCDFE6';
								}
							}
						});
					} else {
						_t.errorTip.noticeOtherEmail = false;
						document.getElementById(domId).style.borderColor = '#DCDFE6';
					}
				}

			},
			// 校验手机号是否正确
			ruleMobile(val,data,domId){
				var _t = this;
				var reg = /；/gi;
				var ruleMobile = _t.$api.mobileRegular();
				// 告警升级
				if (val === 'AlarmUpgrade') {
					if (data.trim() !== '') {
						// 中英文分号转换 统一转为英文分号
						var upgradeNoticeMobile = data.trim().replace(reg,';');
						// 分号分割转为 数组数据
						var upgradeNoticeMobileArr = upgradeNoticeMobile.split(';');
						upgradeNoticeMobileArr.forEach((val)=>{
							if (val.trim() !== '') {
								if (ruleMobile.test(val.trim()) === false) {
									_t.errorTip.upgradeNoticeMobile = true;
									document.getElementById(domId).style.borderColor = '#fb6041';
								} else {
									_t.errorTip.upgradeNoticeMobile = false;
									document.getElementById(domId).style.borderColor = '#DCDFE6';
								}
							}
						});
						// 输入告警升级 邮箱输入不为空 取消 三项不为空的提示
						_t.errorTip.isNotAllNull = false;
					} else {
						_t.errorTip.upgradeNoticeMobile = false;
						document.getElementById(domId).style.borderColor = '#DCDFE6';
					}
				} else {
					// 额外手机号校验
					if (data.trim() !== '') {
						// 中英文分号转换 统一转为英文分号
						var upgradeNoticeMobile = data.trim().replace(reg,';');
						// 分号分割转为 数组数据
						var upgradeNoticeMobileArr = upgradeNoticeMobile.split(';');
						upgradeNoticeMobileArr.forEach((val)=>{
							if (val.trim() !== '') {
								if (ruleMobile.test(val.trim()) === false) {
									_t.errorTip.noticeOtherMobile = true;
									document.getElementById(domId).style.borderColor = '#fb6041';
								} else {
									_t.errorTip.noticeOtherMobile = false;
									document.getElementById(domId).style.borderColor = '#DCDFE6';
								}
							}
						});
					} else {
						_t.errorTip.noticeOtherMobile = false;
						document.getElementById(domId).style.borderColor = '#DCDFE6';
					}
				}
			},
			// 重置表单
			resetFormData(){
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = false;
				// 重置表单字段
				_t.addEdit.groupId = '';
				_t.addEdit.alarmLevel = ['99']; // 告警级别
				_t.addEdit.NoticeContent = ['0']; // 通知内容
				_t.addEdit.NoticeFun = ['0']; // 通知方式
				_t.addEdit.DayOfWeek = ['1']; // 发送时间 周
				_t.addEdit.noticeObject = ['0']; // 通知用户对象
				_t.addEdit.noticeRuleFirst = 1; // 同一设备告警次数
				_t.addEdit.noticeRuleNextType = '1'; // 后续发送策略
				_t.addEdit.noticeRuleNextEvery = 1; // 每隔次数
				_t.addEdit.alarmNotconfirmDuration = 10; // 超出次数
				_t.addEdit.isAlarmUpgrade = true; // 告警升级
				_t.addEdit.upgradeNoticeEmail = ''; // 升级邮箱地址
				_t.addEdit.upgradeNoticeMobile = ''; // 升级短信
				_t.addEdit.upgradeNoticeWeixin = ''; // 升级微信
				_t.addEdit.dayBeginTime = 0; // 起始时间
				_t.addEdit.dayEndTime = 24; // 截止时间
				_t.addEdit.noticeUserIds = []; // 额外用户
				_t.addEdit.noticeOtherEmail = ''; // 额外邮件地址
				_t.addEdit.noticeOtherMobile = ''; // 额外短信号码
				_t.addEdit.noticeOtherWeixin = ''; // 额外微信号码
				_t.addEdit.alarmSound = null; // 告警声音文件
				// 重置校验提示
				_t.errorTip.noticeRuleFirst = false; // 首次发送
				_t.errorTip.noticeRuleNextEvery = false; // 每隔几次
				_t.errorTip.alarmNotconfirmDuration = false; // 超出几次
				_t.errorTip.isNotAllNull = false; // 三项不能全部为空
				_t.errorTip.upgradeNoticeEmail = false; // 告警升级邮箱地址
				_t.errorTip.upgradeNoticeMobile = false; // 告警升级短信号码
				_t.errorTip.noticeOtherMobile = false; // 额外短信号码
				_t.errorTip.noticeOtherEmail = false; // 额外邮箱
				_t.$refs.table.clearSelection();
				// _t.$refs.ruleForm.clearValidate(); //移除校验结果
				_t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
			},
			// 当前选中条数
			selectTableNum(data) {
				var _t = this;
				switch (data.length) {
					case 0: // 未选中
						_t.disableBtn.edit = true;
						_t.disableBtn.more = true;
						break;
					case 1: // 单选
						_t.disableBtn.edit = false;
						_t.disableBtn.more = false;
						var checkListIds = new Array();
						data.forEach((item)=>{
							checkListIds.push(item.id);
						});
						_t.checkIdsList = checkListIds;
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.disableBtn.more = false;
						var checkListIds = new Array();
						data.forEach((item)=>{
							checkListIds.push(item.id);
						});
						_t.checkIdsList = checkListIds;
						break;
				}
				// 选中的表格集合
				_t.checkListValue = data;
			},
			// 重置查询表单
			resetData(){
				var _t = this;
				_t.formItem.groupName = null;
				_t.formItem.ip = null;
			},
			// 查询列表数据
			getData(){
				var _t = this;
				_t.$store.commit('setLoading',true);
				_t.$api.get('alarm/noticeRule/pagelist',{
					jsonString:JSON.stringify({
						alarmNoticeRule: {
							noticeGroupName: _t.formItem.groupName == null ? null : (_t.formItem.groupName.trim() == '' ? null : _t.formItem.groupName.trim()),
							assetName: _t.formItem.ip == null ? null : (_t.formItem.ip.trim() == '' ? null : _t.formItem.ip.trim())
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				},function (res) {
					_t.$store.commit('setLoading',false);
					switch (res.status) {
						case 200:
							var tableData = res.data.list;
							tableData.forEach((item)=>{
								// 拆分并初始化字段 默认false
								item.alarmLevelSerious = false; // 告警级别-紧急
								item.alarmLevelGeneral = false; // 告警级别-告警
								item.noticeContentAlarm = false; // 通知内容-告警
								item.noticeContentConfirm = false; // 通知内容-告警确认
								item.noticeContentCommentary = false; // 通知内容-告警评注
								item.noticeContentRepair = false; // 通知内容-告警报修
								item.noticeContentClose = false; // 通知内容-告警关闭
								item.noticeWayEmail = false; // 通知方式-邮件
								item.noticeWaySMS = false; // 通知方式-短信
								item.noticeWayWeChat = false; // 通知方式-微信
								item.noticeWayVoice = false; // 通知方式-声音
								item.noticeWayDialog = false; // 通知方式-弹窗
								item.noticeWaySyslog = false; // 通知方式-syslog
								item.noticeObjectDuty = false; // 通知对象-值班人
								item.noticeObjectDevice = false; // 通知对象-设备责任人
								item.noticeObjectBusiness = false; // 通知对象-业务责任人
								// 转告警级别
								if (item.alarmLevel !== null) {
									var alarmLevel = item.alarmLevel.split(',');
									alarmLevel.forEach((val)=>{
										// 紧急
										if (val == 99) {
											item.alarmLevelSerious = true;
										} else if (val == 66) {
											//
											item.alarmLevelGeneral = true;
										}
									})
								}
								// 转通知内容
								if (item.noticeContent !== null) {
									var noticeContent = item.noticeContent.split(',');
									noticeContent.forEach((val)=>{
										// 告警
										if (val == 0) {
											item.noticeContentAlarm = true;
										} else if (val == 1) {
											// 告警确认
											item.noticeContentConfirm = true;
										} else if (val == 2) {
											// 告警评注
											item.noticeContentCommentary = true;
										} else if (val == 3) {
											// 告警保修
											item.noticeContentRepair = true;
										} else if (val == 4) {
											// 告警关闭
											item.noticeContentClose = true;
										}
									});
								}
								// 转通知方式
								if (item.noticeWay !== null) {
									var noticeWay = item.noticeWay.split(',');
									noticeWay.forEach((val)=>{
										// 邮件
										if (val == 0) {
											item.noticeWayEmail = true;
										} else if (val == 1) {
											// 短信
											item.noticeWaySMS = true;
										} else if (val == 2) {
											// 微信
											item.noticeWayWeChat = true;
										} else if (val == 3) {
											// 播放声音
											item.noticeWayVoice = true;
										} else if (val == 4) {
											// 页面弹窗
											item.noticeWayDialog = true;
										} else if (val == 5) {
											// Syslog
											item.noticeWaySyslog = true;
										}
									});
								}
								// 转通知对象
								if (item.noticeObject !== null) {
									var noticeObject = item.noticeObject.split(',');
									noticeObject.forEach((val)=>{
										// 值班人
										if (val == 0) {
											item.noticeObjectDuty = true;
										} else if (val == 1) {
											// 设备责任人
											item.noticeObjectDevice = true;
										} else if (val == 2) {
											// 业务责任人
											item.noticeObjectBusiness = true;
										}
									});
								}
							});
							_t.tableData = tableData;
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
			// 改变当前页码
			handleAlarmSoundOptionsCurrentChange(val) {
				var _t = this;
				_t.alarmSoundOptions.currentPage = val;
				_t.getAlarmSoundData();
			},
			// 改变每页显示条数
			handleSizeAlarmSoundOptionsChangeSub(val) {
				var _t = this;
				_t.alarmSoundOptions.pageSize = val;
				_t.getAlarmSoundData();
			},
			// 查询告警组list集合
			getAlarmGroupList(){
				var _t = this;
				_t.$api.get('alarm/noticeGroup/all',{
					jsonString: JSON.stringify({
						alarmNoticeGroup:{}
					})
				},function (res) {
					switch (res.status) {
						case 200:
							_t.alarmGroupList = res.data.list;
							// 编辑时调取数据回显接口
							if (_t.ifAdd === false) {
								_t.getEditDataWithId(_t.checkIdsList.join(','));
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.alarmGroupList = [];
							break;
					}
				});
			},
			// 获取数据字典集合
			getBaseData(){
				var _t = this;
				_t.$api.post('system/basedata/maplist',{
					dictionaryTypes:['AlarmSeverity','NoticeContent','NoticeFun','DayOfWeek','NoticeUserObj'],
					languageMark:localStorage.getItem('hy-language')
				},function (res) {
					switch (res.status) {
						case 200:
							var alarmLevelList = new Array(); // 告警级别数据
							res.data.AlarmSeverity.forEach((item)=>{
								if (item.type == 66 || item.type == 99) {
									alarmLevelList.push(item);
								}
							});
							_t.alarmLevelList = alarmLevelList;
							_t.DayOfWeek = res.data.DayOfWeek; // 发送时间集合
							_t.NoticeContent = res.data.NoticeContent; // 通知内容集合
							_t.NoticeFun = res.data.NoticeFun; // 通知方式集合
							_t.NoticeUserObj = res.data.NoticeUserObj; // 通知用户对象
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
			// 获取播放声音
			getAlarmSoundData(){
				var _t = this;
				_t.$api.get('system/systemAttachments/pagelist',{
					systemAttachments:{},
					pageSize:_t.alarmSoundOptions.pageSize,
					currentPage:_t.alarmSoundOptions.currentPage,
				},function (res) {
					switch (res.status) {
						case 200:
							var alarmSoundData = res.data.list;
							alarmSoundData.forEach((item)=>{
								item.isPlay = false;
							});
							_t.alarmSoundData = alarmSoundData;
							_t.alarmSoundOptions.currentPage = res.data.currentPage;
							_t.alarmSoundOptions.total = res.data.count;
							if(_t.alarmSoundData[0]) {
								_t.$nextTick(function () {
									_t.$refs.soundTable.toggleRowSelection(_t.alarmSoundData[0],true);
									_t.addEdit.alarmSound = _t.alarmSoundData[0].id;
								});
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.alarmSoundData = [];
							_t.alarmSoundOptions.currentPage = 1;
							_t.alarmSoundOptions.total = 0;
							break;
					}
				});
			},
			// 判断是否勾选播放声音
			changeNoticeFun(val){
				var _t = this;
				val.forEach((item)=>{
					if (item == 3) {
						// 调用获取播放声音的接口
						_t.getAlarmSoundData();
						_t.dialogVisibleSound = true;
					} else {
						_t.dialogVisibleSound = false;
						_t.addEdit.alarmSound = null;
					}
				});
			},
			// 试听声音文件
			submitSound(row){
				var _t = this;
				// 暂停所有的播放
				_t.alarmSoundData.forEach((item)=>{
					item.isPlay = false;
					document.getElementById(item.id).pause();
				});
				// 启动当前播放
				document.getElementById(row.id).play();
				row.isPlay = true;
			},
			// 暂停试听
			closeSound(row){
				var _t = this;
				row.isPlay = false;
				document.getElementById(row.id).pause();
			},
			// 改变播放声音的复选框
			changeTableSound(selection,row){
				var _t = this;
				selection.forEach((item)=>{
					_t.$refs.soundTable.toggleRowSelection(item,false);
					_t.addEdit.alarmSound = null;
				});
				_t.$refs.soundTable.toggleRowSelection(row,true);
				_t.addEdit.alarmSound = row.id;
			},
			// 重置选择的声音文件 val: true 关闭蒙版的 false 提交按钮 关闭蒙版
			resetSound(){
				var _t = this;
				if (_t.addEdit.NoticeFun.indexOf('3') !== -1) {
					_t.addEdit.NoticeFun.splice(_t.addEdit.NoticeFun.indexOf('3'),1);
				}
				_t.addEdit.alarmSound = null;
				_t.dialogVisibleSound = false;
			},
			// 获取选择用户
			getSelectUser(){
				var _t = this;
				_t.$api.get('system/organization/getOrgRoleUserTree',{},function (res) {
					switch (res.status) {
						case 200:
							var jsonTree = JSON.parse(res.data);
							_t.userTreeData = jsonTree.children;
							// 默认展开第一个节点
							if (_t.userTreeData[0]) {
								_t.defaultExpandedKeys[0] = _t.userTreeData[0].nodeId;
							}
							// 判断当前额外用户是否为空 来回显数据
							if (_t.addEdit.noticeUserIds.length !== 0) {
								var selectUser = new Array();
								_t.addEdit.noticeUserIds.forEach((item)=>{
									selectUser.push(item.nodeId);
								});
								_t.$refs.userTree.setCheckedKeys(selectUser);
								_t.defaultExpandedKeys = selectUser;
							} else {
								if (_t.userTreeData[0]) {
									_t.defaultExpandedKeys[0] = _t.userTreeData[0].nodeId;
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
							break;
					}
				});
			},
			// 起止时间
			getTime(){
				var _t = this;
				//开始时间
				var dayBeginTime = new Array();
				for (var i = 0;i < 24;i++) {
					var obj = new Object();
					obj.value = i;
					obj.label = i < 10 ? '0' + i : i;
					dayBeginTime.push(obj);
				}
				_t.dayBeginTime = dayBeginTime;
				//截止时间
				var dayEndTime = new Array();
				for (var i = 1;i <= 24;i++) {
					var obj = new Object();
					obj.value = i;
					obj.label = i < 10 ? '0' + i : i;
					dayEndTime.push(obj);
				}
				_t.dayEndTime = dayEndTime;
			},
			// 编辑回显数据
			getEditDataWithId(val){
				var _t = this;
				_t.$api.get('alarm/noticeRule/' + val,{},function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data;
							_t.addEdit.groupId = resData.groupId; // 告警组
							_t.addEdit.alarmLevel = resData.alarmLevel.split(','); // 告警级别
							_t.addEdit.NoticeContent = resData.noticeContent.split(','); // 通知内容
							_t.addEdit.NoticeFun = resData.noticeWay.split(','); // 通知方式
							_t.addEdit.noticeRuleFirst = resData.noticeRuleFirst; // 首次告警次数
							_t.addEdit.noticeRuleNextType = resData.noticeRuleNextType.toString(); // 后续发送策略
							_t.addEdit.noticeRuleNextEvery = resData.noticeRuleNextEvery.toString(); // 每隔次数
							_t.addEdit.isAlarmUpgrade = resData.isAlarmUpgrade; // 是否告警升级
							_t.addEdit.alarmNotconfirmDuration = resData.alarmNotconfirmDuration.toString(); // 超出次数
							_t.addEdit.upgradeNoticeEmail = resData.upgradeNoticeEmail; // 告警升级邮件
							_t.addEdit.upgradeNoticeMobile = resData.upgradeNoticeMobile; // 告警升级短信
							_t.addEdit.upgradeNoticeWeixin = resData.upgradeNoticeWeixin; // 告警升级微信
							_t.addEdit.DayOfWeek = resData.daysOfWeek.split(','); // 发送时间
							_t.addEdit.dayBeginTime = Number(resData.dayBeginTime); // 开始时间
							_t.addEdit.dayEndTime = Number(resData.dayEndTime); // 结束时间
							_t.addEdit.noticeObject = resData.noticeObject.split(','); // 通知对象
							_t.addEdit.noticeOtherEmail = resData.noticeOtherEmail; // 额外用户邮箱
							_t.addEdit.noticeOtherMobile = resData.noticeOtherMobile; // 额外用户短信
							_t.addEdit.noticeOtherWeixin = resData.noticeOtherWeixin; // 额外用户微信
							_t.addEdit.alarmSound = resData.alarmSound; // 播放声音文件
							// 通知额外的用户
							var noticeUserIdsArr = JSON.parse(resData.noticeUserIds); // 额外用户集合
							noticeUserIdsArr.forEach((item)=>{
								item.nodeId = item.id;
								item.nodeName = item.displayName;
							});
							_t.addEdit.noticeUserIds = noticeUserIdsArr;
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
			}
		},
		created(){
			this.$store.commit('setLoading',true);
			this.getData();
			// 新增编辑弹出层数据字典
			this.getBaseData();
		}
	}
</script>

<style scoped>
	.alarmRuleSettings-padding {
		padding: 5px 10px;
	}

	.isNotNullTip {
		width: 160px;
		display: inline-block;
		line-height: 15px;
	}
</style>
<style>
	.alarmRuleSettings-dialog .el-dialog {
		width: 880px;
		height: 500px;
	}

	.alarmRuleSettings-innerDialog .el-dialog {
		width: 610px;
		height: 424px;
	}

	.alarmRuleSettings-innerUserDialog .el-dialog {
		width: 500px;
		height: 424px;
	}

	.alarmRule-checkedBox {
		margin-right: 15px;
	}

	.alarmRule-checkedBox .el-checkbox__label {
		font-size: 12px;
	}

	.contentCenter .el-input__inner {
		text-align: center;
		padding: 0 5px;
	}

	.elFormLabelPadRight .el-form-item__label {
		padding-right: 5px;
		line-height: 20px;
	}

	.alarmRuleSettings-selectUser .el-checkbox__input.is-disabled {
		display: none;
	}

	.alarmSoundData-table .el-table__header tr th .el-checkbox {
		display: none;
	}

	.alarmSoundData-table .el-table__body tr td .el-checkbox .el-checkbox__inner {
		border-radius: 50%;
	}

	.alarmSoundData-table .el-table__body tr td .el-checkbox.is-checked .el-checkbox__inner:after {
		width: 4px;
		height: 4px;
		top: 4px;
		left: 3px;
	}
</style>
