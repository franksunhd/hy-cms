<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.alarmSettings')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.noticeWaySettings')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.emailSettings')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="paddingContent">
			<!--表单-->
			<el-form :model="formData" label-width="150px">
				<el-form-item :label="$t('emailSettings.formSMTPServer') + '：'">
					<span>{{formData.host}}</span>
				</el-form-item>
				<el-form-item class="formWidthEmail fl" :label="$t('emailSettings.formUserAddress') + '：'">
					<span>{{formData.user}}</span>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.formIsSSL') + '：'">
					<el-checkbox :disabled="true" v-model="formData.sslEnable">
						{{$t('emailSettings.formSSL')}}
					</el-checkbox>
				</el-form-item>
				<el-form-item class="formWidthEmail fl" :label="$t('emailSettings.formPassword') + '：'">
					<span>{{formData.password | passWordString}}</span>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.formSMTPPort') + '：'">
					<span>{{formData.port}}</span>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.formEmailUserName') + '：'">
					<span>{{formData.userName}}</span>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.formEmailSignature') + '：'">
					<quill-editor v-model="formData.signature" class="emailSettings-formQuill" :options="editorOptions" ref="myQuillEditor"></quill-editor>
<!--					<el-input class="textAreaBox" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.signature"/>-->
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="alertBtn" @click="editDataBtn">{{$t('emailSettings.formBtnModify')}}
					</el-button>
					<el-button class="height34" @click="dialogVisible_test = true">{{$t('emailSettings.formBtnTestSend')}}</el-button>
					<el-button class="height34" @click="isShowTableClick">{{$t('emailSettings.formBtnUserSettings')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--表格-->
		<div class="padding20" v-if="isShowTable">
			<el-table :data="tableData" stripe border class="indexTableBox">
				<el-table-column width="90px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
						  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="displayName" :label="$t('emailSettings.columnUserName')"/>
				<el-table-column prop="username" :label="$t('emailSettings.columnLoginAccount')"/>
				<el-table-column prop="organizationName" :label="$t('emailSettings.columnOrganization')"/>
				<el-table-column :label="$t('emailSettings.columnUserRole')">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.roleName" placement="left-start">
							<span>{{scope.row.roleName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="mobile" :label="$t('emailSettings.columnMobile')"/>
				<el-table-column prop="email" :label="$t('emailSettings.columnEmail')"/>
				<el-table-column prop="wechat" :label="$t('emailSettings.columnWeChat')"/>
				<el-table-column prop="status" :label="$t('emailSettings.columnStatus')">
					<template slot-scope="scope">
						<span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
						<span v-else-if="scope.row.status === 0">{{$t('public.disable')}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createByUser.displayName" :label="$t('emailSettings.columnCreateBy')"/>
				<el-table-column :label="$t('emailSettings.columnCreateTime')">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
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
		<!--修改-->
		<el-dialog
			class="emailSettings-dialog"
			:title="$t('emailSettings.dialogModifyTitle')"
			append-to-body
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="addEdit" label-width="120px" :rules="rules" ref="ruleForm">
				<el-form-item :label="$t('emailSettings.formSMTPServer') + '：'" prop="host">
					<el-input v-model="addEdit.host" class="width200"/>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="$t('emailSettings.formUserAddress') + '：'" prop="user">
							<el-input v-model="addEdit.user" class="width200"/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('emailSettings.formIsSSL') + '：'">
							<el-checkbox v-model="addEdit.sslEnable">{{$t('emailSettings.formSSL')}}</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item :label="$t('emailSettings.formPassword') + '：'" prop="password">
							<el-input v-model="addEdit.password" class="width200"/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('emailSettings.formSMTPPort') + '：'" prop="port">
							<el-input v-model="addEdit.port" class="width200"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item :label="$t('emailSettings.formEmailUserName') + '：'" prop="userName">
					<el-input v-model="addEdit.userName" class="width200"/>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.formEmailSignature') + '：'">
					<el-input class="textAreaBox" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="addEdit.signature"/>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" class="alertBtn" @click="editData('ruleForm')">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetData">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--测试发送-->
		<el-dialog
			class="emailSettings-dialog"
			:title="$t('emailSettings.dialogTestTitle')"
			append-to-body
			:before-close="resetTestData"
			:visible.sync="dialogVisible_test"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="testForm" label-width="150px" :rules="rules" ref="testRuleForm">
				<el-form-item :label="$t('emailSettings.dialogUserEmailAddress') + '：'" prop="emailAddress">
					<el-input v-model="testForm.emailAddress" class="width200"/>
				</el-form-item>
				<el-form-item :label="$t('emailSettings.dialogUserEmailContent') + '：'" prop="emailContent">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="testForm.emailContent"/>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" class="height34" @click="testSend('testRuleForm')">{{$t('emailSettings.formBtnTestSend')}}</el-button>
				<el-button class="height34 alertBtn" @click="resetTestData">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/Box';
	import {dateFilter, passWordString} from "../../../../assets/js/filters";
	import {isNotNull,isEmail} from "../../../../assets/js/validator";

	export default {
		name: "emailSettinds",
		components: {Box},
		data() {
			return {
				// 显示表单
				formData: {
					host: '',
					user: '',
					userName: '',
					signature: '',
					port: '',
					password: '',
					sslEnable: false
				},
				isShowTable: false,
				tableData: [], // 表格数据
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				dialogVisible: false, // 修改邮件设置弹出层
				addEdit: {
					id: '', // id
					host: '', // smtp服务器
					user: '', // 发件人地址
					sslEnable: false, // 是否加密
					password: '', // 密码 授权码
					port: '', // 端口
					userName: '', // 邮件显示名称
					signature: '', // 签名
				},
				dialogVisible_test:false, // 测试发送
				// 测试发送表单
				testForm:{
					emailAddress:'',
					emailContent:'',
				},
				// 表单部分 富文本编辑器配置
				editorOptions:{
					modules:{
						toolbar: [
							['bold', 'italic','underline','strike'],
							[{'color':[]},{'background':[]}],
							[{'header':[1,2,3,4,5,6,false]}],
							[{'size': ['12px', '14px', '16px' ,'18px', '20px', '22px', '24px']}],
						]
					},
					theme:'snow'
				},
				rules: {
					host: [
						{validator: isNotNull, trigger: ['blur']}
					],
					user: [
						{validator: isNotNull, trigger: ['blur']}
					],
					password: [
						{validator: isNotNull, trigger: ['blur']}
					],
					port: [
						{validator: isNotNull, trigger: ['blur']}
					],
					userName: [
						{validator: isNotNull, trigger: ['blur']}
					],
					emailAddress:[
						{validator: isNotNull, trigger: ['blur']},
						{validator: isEmail, trigger: ['blur']}
					],
					emailContent:[
						{validator: isNotNull, trigger: ['blur']}
					]
				}
			}
		},
		methods: {
			// 获取表单数据
			getFormData() {
				var _t = this;
				_t.$api.get('system/noticeConf/all', {
					jsonString: JSON.stringify({
						systemNoticeConf: {
							noticeWay: 0
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var listData = res.data.list === null ? [] : res.data.list;
							// 表单只有一条数据
							if (listData[0]) {
								_t.addEdit.id = listData[0].id;
								if (JSON.parse(listData[0].confContents)) {
									_t.formData = JSON.parse(listData[0].confContents);
									if (_t.formData.sslEnable === true || _t.formData.sslEnable === 'true') {
										_t.formData.sslEnable =  true;
									} else {
										_t.formData.sslEnable =  false;
									}
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
							_t.formData = {};
							break;
					}
				});
			},
			// 监测未设置列表
			isShowTableClick() {
				var _t = this;
				_t.isShowTable = true;
				_t.getData();
			},
			// 表格数据
			getData() {
				var _t = this;
				_t.$api.get('system/user/pagelist', {
					jsonString: JSON.stringify({
						systemUser: {
							email: 'true',
							languageMark: localStorage.getItem('hy-language'),
							status: 1
						},
						pageSize: _t.options.pageSize,
						currentPage: _t.options.currentPage
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var resData = res.data.list === null ? [] : res.data.list;
							resData.forEach(function (item) {
								if (item.roleList !== null) {
									if (item.roleList.length !== 0) {
										var roleName = new Array();
										item.roleList.forEach(function (data) {
											roleName.push(data.roleName);
										});
										item.roleName = roleName.join(',');
									} else {
										item.roleName = '';
									}
								} else {
									item.roleName = '';
								}
							});
							_t.tableData = resData;
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
			// 修改按钮
			editDataBtn() {
				var _t = this;
				_t.dialogVisible = true;
				_t.getEditData(_t.addEdit.id);
			},
			// 编辑数据回显
			getEditData(val){
				var _t = this;
				_t.$api.get('system/noticeConf/' + val,{},function (res) {
					switch (res.status) {
						case 200:
							var listData = res.data;
							// 表单只有一条数据
							if (listData) {
									var confContents = JSON.parse(listData.confContents);
									_t.addEdit.host = confContents.host;
									_t.addEdit.user = confContents.user;
									if (confContents.sslEnable === true || confContents.sslEnable === 'true') {
										_t.addEdit.sslEnable = true;
									} else {
										_t.addEdit.sslEnable = false;
									}
									_t.addEdit.password = confContents.password;
									_t.addEdit.userName = confContents.userName;
									_t.addEdit.port = confContents.port;
									_t.addEdit.signature = confContents.signature;
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
			// 修改提交
			editData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.put('system/noticeConf/',{
							systemNoticeConf:{
								id:_t.addEdit.id,
								confSource:'userDefined',
								noticeWay:0, // 邮件
								confContents:JSON.stringify(_t.addEdit),
							}
						},function (res) {
							switch (res.status) {
								case 200:
									_t.$alert(_t.$t('roleMaintenance.confirmSaveSuccessTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(()=>{
										_t.getFormData();
										_t.resetData();
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
						})
					}
				});
			},
			// 重置表单
			resetData() {
				var _t = this;
				_t.dialogVisible = false;
				_t.addEdit.host = ''; // smtp服务器
				_t.addEdit.user = ''; // 发件人地址
				_t.addEdit.sslEnable = false; // 是否加密
				_t.addEdit.password = ''; // 密码 授权码
				_t.addEdit.port = ''; // 端口
				_t.addEdit.userName = ''; // 邮件显示名称
				_t.addEdit.signature = ''; // 签名
				// _t.$refs.ruleForm.clearValidate(); //移除校验结果
				_t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
			},
			// 测试发送提交按钮
			testSend(formName){
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.post('system/noticeConf/sendEmail',{
							emailAddress:_t.testForm.emailAddress,
							emailContent:_t.testForm.emailContent,
						},function (res) {
							switch (res.status) {
								case 200:
									_t.$alert(_t.$t('emailSettings.dialogConfirmSuccessTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(()=>{
										_t.resetTestData();
									});
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 2005:
									_t.$alert(_t.$t('emailSettings.dialogConfirmErrorTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(()=>{
									}).catch(()=>{});
									break;
								default:
									break;
							}
						});
					}
				});
			},
			// 测试重置
			resetTestData(){
				var _t = this;
				_t.dialogVisible_test = false;
				_t.testForm.emailAddress = '';
				_t.testForm.emailContent = '';
				// _t.$refs.testRuleForm.clearValidate(); //移除校验结果
				_t.$refs.testRuleForm.resetFields(); //移除校验结果并重置字段值
			}
		},
		created() {
			this.getFormData();
		},
		computed:{
			editor(){
				return this.$refs.myQuillEditor.quill;
			}
		},
	}
</script>

<style scoped>
	.paddingContent {
		padding: 30px 30px 0;
	}

	.formWidthEmail {
		width: 400px;
		margin-bottom: 0;
	}

	.dialogWidthEmail {
		margin-bottom: 0;
	}

	.textAreaBox {
		width: 550px;
	}

	.height34 {
		padding: 0 10px;
		height: 34px;
		line-height: 34px;
	}
</style>
<style>
	.emailSettings-dialog .el-dialog {
		width: 750px;
		height: 468px;
	}

	.emailSettings-formQuill {
		width: 550px;
	}

	.emailSettings-formQuill .ql-container.ql-snow {
		min-height: 100px;
	}
</style>
