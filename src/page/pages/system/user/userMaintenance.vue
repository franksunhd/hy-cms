<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.userMaintenance')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20 borderBottom">
			<!--表单-->
			<el-form inline v-model="formItem">
				<el-form-item :label="$t('userMaintenance.account') + '：'">
					<el-input v-model="formItem.username" class="width200" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item id="selectTreeBox" class="positionRelative" :label="$t('userMaintenance.organization') + '：'">
					<i class="el-icon-error el-input__clear selectTreeBox_close"></i>
					<el-popover trigger="click" v-model="isShowFormPopover" placement="bottom-start" ref="popover">
						<el-tree :data="organizationList" highlight-current :expand-on-click-node="false" @node-click="clickNode"
										 :props="defaultProps"/>
						<el-input v-model="formItem.organization" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly
											slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item :label="$t('userMaintenance.status') + '：'">
					<el-select v-model="formItem.status" class="width200" clearable>
						<el-option v-for="(item,index) in statusList" :value="item.value" :key="index" :label="item.label"/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
					<el-button type="reset" class="queryBtn" @click="resetFormData">{{$t('public.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="padding20">
			<!--全局操作-->
			<div class="marBottom16">
				<el-button type="warning" @click="AddDataBtn" class="queryBtn">
					<span class="iconfont fs14">&#xe689;</span> <span>{{$t('public.add')}}</span>
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="editDataBtn" class="queryBtn">
					<span class="iconfont fs14">&#xe641;</span> {{$t('public.edit')}}
				</el-button>
				<el-button :disabled="disableBtn.more" @click="resetPassword">
					<span class="iconfont fs14">&#xe653;</span> {{$t('public.resets')}}
				</el-button>
				<el-button :disabled="disableBtn.enable" @click="enableData" class="queryBtn">
					<span class="iconfont fs14">&#xe645;</span> {{$t('public.enable')}}
				</el-button>
				<el-button :disabled="disableBtn.disable" @click="disableData" class="queryBtn">
					<span class="iconfont fs14">&#xe646;</span> {{$t('public.disable')}}
				</el-button>
				<el-button :disabled="disableBtn.more" @click="deleteData" class="queryBtn">
					<span class="iconfont fs14">&#xe647;</span> {{$t('public.delete')}}
				</el-button>
			</div>
			<el-table :data="tableData" border stripe ref="table" @selection-change="selectTableNum">
				<el-table-column type="selection" fixed header-align="left" align="left"/>
				<el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
					</template>
				</el-table-column>
				<el-table-column prop="displayName" :label="$t('userMaintenance.username')" header-align="left" align="left"/>
				<el-table-column prop="username" :label="$t('userMaintenance.loginAccount')" header-align="left" align="left"/>
				<el-table-column :label="$t('userMaintenance.organization')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.organizationName" placement="left-start">
							<span>{{scope.row.organizationName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('userMaintenance.userRole')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.roleName" placement="left-start">
							<span>{{scope.row.roleName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="mobile" :label="$t('userMaintenance.mobile')" header-align="left" align="left"/>
				<el-table-column :label="$t('userMaintenance.email')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.email" placement="top-start">
							<span>{{scope.row.email}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('userMaintenance.status')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.status === 1">{{$t('public.enable')}}</span>
						<span v-if="scope.row.status === 0" class="disabledStatusColor">{{$t('public.disable')}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createByUser.displayName" :label="$t('userMaintenance.createName')" header-align="left"
												 align="left"/>
				<el-table-column width="160px" :label="$t('userMaintenance.createTime')" header-align="left" align="left">
					<template slot-scope="scope">
						{{scope.row.createTime | dateFilter}}
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize"
						 @handleSizeChangeSub="handleSizeChangeSub" @handleCurrentChangeSub="handleCurrentChange"/>
		</div>
		<!--新增-->
		<el-dialog
			class="userMaintenance-dialog"
			append-to-body
			:title="$t('userMaintenance.createUpdateUserInfo')"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="addEdit" autocomplete="off" inline label-width="116px">
				<el-form-item class="star" :label="$t('userMaintenance.organization') + '：'">
					<el-popover
						trigger="click"
						placement="bottom-start"
						v-model="isShowEditPopover"
						ref="popover">
						<el-tree
							:data="organizationList"
							highlight-current
							:expand-on-click-node="false"
							@node-click="clickNodeAlert"
							:props="defaultProps"/>
						<el-input
							id="user_id"
							v-model="addEdit.organization"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
					<span class="isNotNull" v-if="errorTip.organizationFlag">{{errorTip.organizationTip}}</span>
				</el-form-item>
				<!--用户名称-->
				<el-form-item :label="$t('userMaintenance.username') + '：'">
					<el-input id="user_displayName" @blur="isBlurNull('name')" v-model="addEdit.username" class="width200"/>
					<span class="isNotNull" v-if="errorTip.displayNameFlag">{{errorTip.displayNameTip}}</span>
				</el-form-item>
				<!--登录账号-->
				<el-form-item class="star" :label="$t('userMaintenance.loginAccount') + '：'">
					<el-input
						id="user_username"
						@blur="isBlurNull('user')"
						v-model="addEdit.loginAccount"
						class="width200"
						autocomplete="off"/>
					<span class="isNotNull" v-if="errorTip.userNameFlag">{{errorTip.userNameTip}}</span>
				</el-form-item>
				<!--密码-->
				<el-form-item
					v-if="ifAdd === true"
					class="star"
					:label="$t('userMaintenance.loginPassword') + '：'"
					prop="loginPassword">
					<el-input id="user_password" @blur="isBlurNull('pwd')" type="password" v-model="addEdit.loginPassword"
										auto-complete="new-password" class="width200"/>
					<span class="isNotNull" v-if="errorTip.passwordFlag">{{errorTip.passwordTip}}</span>
				</el-form-item>
				<!--手机号-->
				<el-form-item :label="$t('userMaintenance.mobileNum') + '：'">
					<el-input id="user_mobile" @blur="isRuleMobile(addEdit.mobileNum)" v-model="addEdit.mobileNum" maxlength="11"
										class="width200"/>
					<span class="isNotNull" v-if="errorTip.mobileFlag">{{errorTip.mobileTip}}</span>
				</el-form-item>
				<!--邮箱-->
				<el-form-item :label="$t('userMaintenance.emails') + '：'">
					<el-input id="user_emails" @blur="isRuleEmail(addEdit.emails)" v-model="addEdit.emails" class="width200"/>
					<span class="isNotNull" v-if="errorTip.emailsFlag">{{errorTip.emailsTip}}</span>
				</el-form-item>
				<!--状态-->
				<el-form-item class="star" :label="$t('userMaintenance.statusAlert') + '：'">
					<el-radio-group v-model="addEdit.status" class="width200">
						<el-radio :label="1">{{$t('public.enable')}}</el-radio>
						<el-radio :label="0">{{$t('public.disable')}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<br/>
				<!--分配角色-->
				<el-form-item class="star assignRole-form" :label="$t('userMaintenance.assignRole') + '：'">
					<p v-if="assignRoleList.length === 0" class="iconfontError">{{$t('userMaintenance.placeSelectOrg')}}</p>
					<div v-else class="assignRole-box">
						<el-checkbox-group class="assignRole-group-box" v-model="assignRoleListSelected">
							<el-checkbox-button v-for="(item,index) in assignRoleList" :label="item.id" :key="index">
								{{item.roleName}}
							</el-checkbox-button>
						</el-checkbox-group>
					</div>
					<span v-if="roleErrorTip" class="iconfontError">{{$t('public.isNotNull')}}</span>
				</el-form-item>
			</el-form>
			<span slot="footer">
        <el-button class="alertBtn" v-if="ifAdd === true" type="primary" @click="addData">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" v-if="ifAdd === false" type="primary" @click="editData">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormAdd">{{$t('public.cancel')}}</el-button>
      </span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull, isMobilePhone, isEmail} from "../../../../assets/js/validator";
	import {orgBreadcrumb} from "../../../../assets/js/recursive";

	export default {
		name: "user-maintenance",
		components: {Box},
		data() {
			return {
				// 查询表单
				formItem: {
					organization: null,
					status: null,
					username: null,
					organizationId: null,
					rotateStatus: true
				},
				// 新增 编辑表单
				addEdit: {
					id: '',
					organization: '',
					organizationId: '',
					username: '',
					loginAccount: '',
					loginPassword: '',
					mobileNum: '',
					emails: '',
					status: 1,
					assignRole: []
				},
				errorTip: {
					organizationFlag: false, // 是否显示
					displayNameFlag: false, // 用户名称
					userNameFlag: false, // 登录账号
					passwordFlag: false, // 密码
					mobileFlag: false, // 手机号
					emailsFlag: false, // 邮箱
					organizationTip: '', // 所属组织提示
					displayNameTip: '', // 用户名称提示
					userNameTip: '', // 登录账号提示
					passwordTip: '', // 登录密码提示
					emailsTip: '', // 邮箱提示
					mobileTip: '',// 手机提示
				},
				// 控制全局按钮 是否禁用
				disableBtn: {
					edit: true,
					enable: true,
					disable: true,
					more: true
				},
				// 新增弹出层
				dialogVisible: false,
				// 判断弹出层是新增还是编辑
				ifAdd: true,
				// 表单所属组织下拉区域
				isShowFormPopover: false,
				// 新增所属组织下拉区域
				isShowEditPopover: false,
				roleErrorTip: false, // 分配角色不能为空
				// 表格数据
				tableData: [],
				statusList: [
					{label: this.$t('public.enable'), value: 1},
					{label: this.$t('public.disable'), value: 0},
				],
				// 表格选中之后数据接收
				checkListValue: [],
				// 删除数据传参
				checkRoleIds: [],
				// 编辑数据集合
				editDataList: {},
				// 角色列表集合
				assignRoleList: [],
				// 选中的角色列表集合
				assignRoleListSelected:[],
				// 组织层级
				organizationName: [],
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				},
				// 数据默认字段
				defaultProps: {
					parent: 'parentId', // 父级唯一标识
					value: 'id', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				organizationList: [],
			}
		},
		methods: {
			// 重置筛选表单
			resetFormData() {
				var _t = this;
				_t.formItem.organization = null;
				_t.formItem.organizationId = null;
				_t.formItem.status = null;
				_t.formItem.username = null;
				_t.getData();
				_t.roleErrorTip = false;
			},
			// 新增按钮弹出层
			AddDataBtn() {
				var _t = this;
				_t.dialogVisible = true;
				_t.ifAdd = true;
				_t.getRoleList();
			},
			// 查询表单所属组织下拉框
			clickNode(val) {
				var _t = this;
				_t.formItem.organization = val.nodeName;
				_t.formItem.organizationId = val.nodeId;
				_t.isShowFormPopover = false;
			},
			// 新增编辑弹出层所属组织下拉框
			clickNodeAlert(val) {
				var _t = this;
				_t.addEdit.organization = val.nodeName;
				_t.addEdit.organizationId = val.nodeId;
				_t.isShowEditPopover = false;
				_t.roleErrorTip = false;
				// 校验 所属组织
				_t.isNotNullRule(_t.addEdit.organizationId === '' || _t.addEdit.organization === '', 'organizationFlag', 'organizationTip', _t.$t('public.isNotNull'), 'user_id');
			},
			// 重置新增表单数据
			resetFormAdd() {
				var _t = this;
				_t.dialogVisible = false;
				_t.ifAdd = true;
				_t.addEdit.organizationId = '';
				_t.addEdit.organization = '';
				_t.addEdit.username = '';
				_t.addEdit.loginAccount = '';
				_t.addEdit.loginPassword = '';
				_t.addEdit.mobileNum = '';
				_t.addEdit.status = 1;
				_t.addEdit.emails = '';
				_t.assignRoleListSelected = [];
				_t.$refs.table.clearSelection();
				// 重置表单手动校验
				_t.roleErrorTip = false;
				_t.errorTip.organizationFlag = false; // 是否显示
				_t.errorTip.displayNameFlag = false;// 用户名称
				_t.errorTip.userNameFlag = false; // 登录账号
				_t.errorTip.passwordFlag = false; // 密码
				_t.errorTip.mobileFlag = false; // 手机号
				_t.errorTip.emailsFlag = false; // 邮箱
				_t.errorTip.organizationTip = ''; // 所属组织提示
				_t.errorTip.displayNameTip = ''; // 用户名称提示
				_t.errorTip.userNameTip = ''; // 登录账号提示
				_t.errorTip.passwordTip = ''; // 登录密码提示
				_t.errorTip.emailsTip = ''; // 邮箱提示
				_t.errorTip.mobileTip = '';// 手机提示
				document.getElementById('user_id').style.borderColor = '#DCDFE6'; // 所属组织
				document.getElementById('user_displayName').style.borderColor = '#DCDFE6'; // 用户名称
				document.getElementById('user_username').style.borderColor = '#DCDFE6'; // 账号
				document.getElementById('user_mobile').style.borderColor = '#DCDFE6'; // 手机
				document.getElementById('user_emails').style.borderColor = '#DCDFE6'; // 邮箱
				if (document.getElementById('user_password')) {
					document.getElementById('user_password').style.borderColor = '#DCDFE6'; // 密码
				}
			},
			// 当前选中条数
			selectTableNum(data) {
				var _t = this;
				switch (data.length) {
					case 0: // 未选中
						_t.disableBtn.disable = true;
						_t.disableBtn.edit = true;
						_t.disableBtn.enable = true;
						_t.disableBtn.more = true;
						break;
					case 1: // 单选
						_t.disableBtn.edit = false;
						data.forEach(function (item) {
							_t.editDataList = item;
							// 先判断是否选中自己 再判断禁用还是启用
							if (item.id !== localStorage.getItem('hy-user-id')) {
								if (item.status === 0) {
									_t.disableBtn.enable = false;
								} else if (item.status === 1) {
									_t.disableBtn.disable = false;
								}
								// 不可重置自己的密码
								_t.disableBtn.more = false;
							} else {
								_t.$message({
									message: _t.$t('userMaintenance.whetherOrNot'),
									customClass: 'messageBoxError',
									duration: 3000
								});
							}
						});
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.editDataList = {};
						var disableFlag = 0,
							enableFlag = 0,
							resetFlag = 0;
						for (var i = 0; i < data.length; i++) {
							if (data[i].status === 0) {
								disableFlag++;
							} else if (data[i].status === 1) {
								enableFlag++;
							}
							if (data[i].id == localStorage.getItem('hy-user-id')) {
								resetFlag++;
							}
						}
						// 重置密码判断
						if (resetFlag > 0) {
							_t.disableBtn.more = true;
						} else {
							_t.disableBtn.more = false;
						}
						// 启用禁用判断
						if (disableFlag > 0 && enableFlag > 0) {
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
						} else if (disableFlag === 0 && enableFlag > 0) {
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = false;
						} else if (disableFlag > 0 && enableFlag === 0) {
							_t.disableBtn.enable = false;
							_t.disableBtn.disable = true;
						}
						break;
				}
				// 选中数据 获取id 存储
				var checkValue = new Array();
				var checkRoleIds = new Array();
				data.forEach(function (item) {
					checkValue.push(item.id);
					var obj = new Object();
					obj.roleId = item.roleList;
					obj.userId = item.id;
					checkRoleIds.push(obj);
				});
				_t.checkRoleIds = checkRoleIds;
				_t.checkListValue = checkValue;
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
			// 启用
			enableData() {
				var _t = this;
				_t.$confirm(_t.$t('userMaintenance.confirmEnableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					cancelButtonClass: 'alertBtn',
					confirmButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/user/updateSystemUserStatus', {
						systemUser: {
							id: _t.checkListValue.join(','),
							status: 1
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('userMaintenance.confirmEnableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$refs.table.clearSelection();
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
				}).catch(() => {
					return;
				});
			},
			// 禁用
			disableData() {
				var _t = this;
				_t.$confirm(_t.$t('userMaintenance.confirmDisableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					cancelButtonClass: 'alertBtn',
					confirmButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/user/updateSystemUserStatus', {
						systemUser: {
							status: 0,
							id: _t.checkListValue.join(',')
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('userMaintenance.confirmDisableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn',
								}).then(() => {
									_t.$refs.table.clearSelection();
									_t.getData();
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
				}).catch(() => {
					return;
				});
			},
			// 删除
			deleteData() {
				var _t = this;
				_t.$confirm(_t.$t('userMaintenance.confirmDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					var checkRoleIds = new Array();
					_t.checkRoleIds.forEach(function (item) {
						checkRoleIds.push(item.userId);
					});
					_t.$api.delete('system/user/', {
						jsonString: JSON.stringify({
							userId: checkRoleIds.join(',')
						})
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('userMaintenance.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.$refs.table.clearSelection();
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
							case 3005: //
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.$refs.table.clearSelection();
									_t.getData();
								});
								break;
							default:
								_t.getData();
								break;
						}
						_t.disableBtn.edit = true;
						_t.disableBtn.enable = true;
						_t.disableBtn.disable = true;
						_t.disableBtn.more = true;
					});
				}).catch(() => {
					return;
				});
			},
			// 重置密码
			resetPassword() {
				var _t = this;
				_t.$confirm(_t.$t('userMaintenance.confirmResetPasswordTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/user/resetPassword', {
						systemUser: {
							id: _t.checkListValue.join(',')
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('userMaintenance.confirmResetPasswordSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.resetFormAdd();
									_t.getData();
								});
								break;
							case 1004: // token 失效
							case 1005: // token 为 null
							case 1006: // token 不一致
								_t.exclude(_t, res.message);
								break;
							default:
								break;
						}
					});
				}).catch(() => {
					return;
				});
			},
			// 查询数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/user/pagelist', {
					jsonString: JSON.stringify({
						systemUser: {
							username: _t.formItem.username === null ? null : (_t.formItem.username.trim() === '' ? null : _t.formItem.username.trim()),
							organizationId: _t.formItem.organizationId === null ? null : (_t.formItem.organizationId === '' ? null : _t.formItem.organizationId),
							status: _t.formItem.status === null ? null : (_t.formItem.status === '' ? null : _t.formItem.status),
							languageMark: localStorage.getItem('hy-language')
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200: // 查询成功
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.count;
							var lists = res.data.list === null ? [] : res.data.list;
							lists.forEach(function (item) {
								if (item.roleList !== null) {
									if (item.roleList.length !== 0) {
										var roleName = new Array();
										var roleIds = new Array();
										item.roleList.forEach(function (data) {
											roleName.push(data.roleName);
											roleIds.push(data.id);
										});
										item.roleName = roleName.join(',');
										item.roleListIds = roleIds.join(',');
									} else {
										item.roleName = '';
										item.roleListIds = null;
									}
								} else {
									item.roleName = '';
									item.roleListIds = null;
								}
							});
							_t.tableData = res.data.list;
							_t.disableBtn.edit = true;
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
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
							_t.disableBtn.edit = true;
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
							_t.disableBtn.more = true;
							break;
					}
				});
			},
			// 不为空校验判断
			isNotNullRule(condition, errorTipFlag, errorTip, errorTipText, domId) {
				var _t = this;
				if (condition) {
					_t.errorTip[errorTipFlag] = true;
					_t.errorTip[errorTip] = errorTipText;
					document.getElementById(domId).style.borderColor = '#fb6041';
				} else {
					_t.errorTip[errorTipFlag] = false;
					_t.errorTip[errorTip] = '';
					document.getElementById(domId).style.borderColor = '#DCDFE6';
				}
			},
			// 失去输入框失去焦点不能为空
			isBlurNull(val) {
				var _t = this;
				if (val === 'user') {
					_t.isNotNullRule(_t.addEdit.loginAccount === null || _t.addEdit.loginAccount.trim() === '', 'userNameFlag', 'userNameTip', _t.$t('public.isNotNull'), 'user_username');
				} else if (val === 'pwd') {
					_t.isNotNullRule(_t.addEdit.loginPassword === null || _t.addEdit.loginPassword.trim() === '', 'passwordFlag', 'passwordTip', _t.$t('public.isNotNull'), 'user_password');
				} else if (val === 'name') {
					_t.errorTip.displayNameFlag = false;
					_t.errorTip.displayNameTip = '';
					document.getElementById('user_displayName').style.borderColor = '#DCDFE6';
				}
			},
			// 手机号输入格式校验
			isRuleMobile(val) {
				var _t = this;
				// 为空不做操作
				if (val === null || val.trim() === '') {
					_t.errorTip.mobileFlag = false;
					_t.errorTip.mobileTip = '';
					document.getElementById('user_mobile').style.borderColor = '#DCDFE6';
				} else {
					// 输入有值
					if (!val.toString().match(_t.$api.mobileRegular())) {
						_t.errorTip.mobileFlag = true;
						_t.errorTip.mobileTip = _t.$t('public.mobileFormatTip');
						document.getElementById('user_mobile').style.borderColor = '#fb6041';
					} else {
						_t.errorTip.mobileFlag = false;
						_t.errorTip.mobileTip = '';
						document.getElementById('user_mobile').style.borderColor = '#DCDFE6';
					}
				}
			},
			// 邮箱输入格式校验
			isRuleEmail(val) {
				var _t = this;
				// 为空不做操作
				if (val === null || val.trim() === '') {
					_t.errorTip.emailsFlag = false;
					_t.errorTip.emailsTip = '';
					document.getElementById('user_emails').style.borderColor = '#DCDFE6';
				} else {
					// 输入有值
					if (_t.$api.emailRegular().test(val.trim()) === false) {
						_t.errorTip.emailsFlag = true;
						_t.errorTip.emailsTip = _t.$t('public.emailFormatTip');
						document.getElementById('user_emails').style.borderColor = '#fb6041';
					} else {
						_t.errorTip.emailsFlag = false;
						_t.errorTip.emailsTip = '';
						document.getElementById('user_emails').style.borderColor = '#DCDFE6';
					}
				}
			},
			// 新增数据
			addData() {
				var _t = this;
				// 校验所属组织
				_t.isNotNullRule(_t.addEdit.organizationId === '' || _t.addEdit.organization === '', 'organizationFlag', 'organizationTip', _t.$t('public.isNotNull'), 'user_id');
				// 校验登录账号
				_t.isNotNullRule(_t.addEdit.loginAccount === null || _t.addEdit.loginAccount.trim() === '', 'userNameFlag', 'userNameTip', _t.$t('public.isNotNull'), 'user_username');
				// 校验密码
				_t.isNotNullRule(_t.addEdit.loginPassword === null || _t.addEdit.loginPassword.trim() === '', 'passwordFlag', 'passwordTip', _t.$t('public.isNotNull'), 'user_password');
				// 获取 分配角色 集合
				if (_t.assignRoleListSelected.length === 0) {
					_t.roleErrorTip = true;
				} else {
					_t.roleErrorTip = false;
				}
				// 没有错误提示就可以提交
				if (_t.errorTip.organizationFlag === false
					&& _t.errorTip.displayNameFlag === false
					&& _t.errorTip.userNameFlag === false
					&& _t.errorTip.passwordFlag === false
					&& _t.errorTip.mobileFlag === false
					&& _t.errorTip.emailsFlag === false
					&& _t.roleErrorTip === false) {
					_t.$api.post('system/user/', {
						systemUser: {
							organizationId: _t.addEdit.organizationId == null ? null : _t.addEdit.organizationId,
							username: _t.addEdit.loginAccount == null ? null : (_t.addEdit.loginAccount.trim() == '' ? null : _t.addEdit.loginAccount.trim()),
							password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.addEdit.loginPassword.trim())),
							displayName: _t.addEdit.username == null ? null : (_t.addEdit.username.trim() == '' ? null : _t.addEdit.username.trim()),
							email: _t.addEdit.emails == null ? null : (_t.addEdit.emails.trim() == '' ? null : _t.addEdit.emails.trim()),
							mobile: _t.addEdit.mobileNum == null ? null : (_t.addEdit.mobileNum.trim() == '' ? null : _t.addEdit.mobileNum.trim()),
							status: _t.addEdit.status,
							createBy: localStorage.getItem('hy-user-name'),
							languageMark: localStorage.getItem('hy-language')
						},
						roleId: _t.assignRoleListSelected.join(',')
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.dialogVisible = false;
								_t.getData();
								_t.resetFormAdd();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 2005: // 添加失败
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.resetFormAdd();
									_t.getData();
								});
								break;
							case 2100: // 字段重复处理
								var jsonParams = JSON.parse(res.message);
								if (jsonParams.displayName && jsonParams.displayName === '0') {
									_t.fieldRepeat('displayNameFlag', 'displayNameTip', '用户名称重复', 'user_displayName');
								}
								if (jsonParams.userName && jsonParams.userName === '0') {
									_t.fieldRepeat('userNameFlag', 'userNameTip', '登录账号重复', 'user_username');
								}
								if (jsonParams.mobile && jsonParams.mobile === '0') {
									_t.fieldRepeat('mobileFlag', 'mobileTip', '手机号码重复', 'user_mobile');
								}
								if (jsonParams.email && jsonParams.email === '0') {
									_t.fieldRepeat('emailsFlag', 'emailsTip', '邮箱重复', 'user_emails');
								}
								break;
							default:
								break;
						}
					});
				}
			},
			// 添加编辑字段重复
			fieldRepeat(errorTipFlag, errorTip, errorTipText, domId) {
				var _t = this;
				_t.errorTip[errorTipFlag] = true;
				_t.errorTip[errorTip] = errorTipText;
				document.getElementById(domId).style.borderColor = '#fb6041';
			},
			// 查询所属组织
			getOrganization() {
				var _t = this;
				_t.$api.get('system/organization/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.organizationList = JSON.parse(res.data).children;
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
			// 查询全部 角色列表
			getRoleList(editRoleList) {
				var _t = this;
				_t.$api.get('system/role/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.assignRoleList = res.data.list === null ? [] : res.data.list;
							if (_t.ifAdd === false) {
								if (editRoleList.roleList) {
									var roleList = editRoleList.roleList === null ? [] : editRoleList.roleList;
									if (roleList.length !== 0) {
										var roleSelectedArr = new Array();
										roleList.forEach((t)=>{
											roleSelectedArr.push(t.id);
										});
										_t.assignRoleListSelected = roleSelectedArr;
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
							_t.assignRoleList = [];
							break;
					}
				});
			},
			// 编辑数据按钮
			editDataBtn() {
				var _t = this;
				// 新增编辑类型判断
				_t.ifAdd = false;
				_t.addEdit.id = _t.editDataList.id;
				_t.getEditDataById(_t.addEdit.id);
			},
			// 编辑时通过id重新请求数据 防止数据滞后
			getEditDataById(val) {
				var _t = this;
				_t.$api.get('system/user/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addEdit.organization = res.data.organizationName;
							_t.addEdit.organizationId = res.data.organizationId;
							_t.addEdit.username = res.data.displayName;
							_t.addEdit.loginAccount = res.data.username;
							_t.addEdit.mobileNum = res.data.mobile;
							_t.addEdit.emails = res.data.email;
							_t.addEdit.status = res.data.status;
							_t.getRoleList(res.data);
							_t.dialogVisible = true;
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
			// 编辑数据
			editData() {
				var _t = this;
				// 校验所属组织
				_t.isNotNullRule(_t.addEdit.organizationId === '' || _t.addEdit.organization === '', 'organizationFlag', 'organizationTip', _t.$t('public.isNotNull'), 'user_id');
				// 校验登录账号
				_t.isNotNullRule(_t.addEdit.loginAccount === null || _t.addEdit.loginAccount.trim() === '', 'userNameFlag', 'userNameTip', _t.$t('public.isNotNull'), 'user_username');
				// 获取 分配角色 集合
				if (_t.assignRoleListSelected.length === 0) {
					_t.roleErrorTip = true;
				} else {
					_t.roleErrorTip = false;
				}
				// 没有错误提示就可以提交
				if (_t.errorTip.organizationFlag === false
					&& _t.errorTip.displayNameFlag === false
					&& _t.errorTip.userNameFlag === false
					&& _t.errorTip.passwordFlag === false
					&& _t.errorTip.mobileFlag === false
					&& _t.errorTip.emailsFlag === false
					&& _t.roleErrorTip === false) {
					_t.$api.put('system/user/', {
						systemUser: {
							id: _t.addEdit.id,
							organizationId: _t.addEdit.organizationId == null ? null : _t.addEdit.organizationId,
							username: _t.addEdit.loginAccount == null ? null : (_t.addEdit.loginAccount.trim() == '' ? null : _t.addEdit.loginAccount.trim()),
							// password: _t.$md5('begin1$2%3=4#5$6end' + _t.$md5(_t.addEdit.loginPassword.trim())),
							displayName: _t.addEdit.username == null ? null : (_t.addEdit.username.trim() == '' ? null : _t.addEdit.username.trim()),
							email: _t.addEdit.emails == null ? null : (_t.addEdit.emails.trim() == '' ? null : _t.addEdit.emails.trim()),
							mobile: _t.addEdit.mobileNum == null ? null : (_t.addEdit.mobileNum.trim() == '' ? null : _t.addEdit.mobileNum.trim()),
							status: _t.addEdit.status,
							createBy: localStorage.getItem('hy-user-name'),
							languageMark: localStorage.getItem('hy-language')
						},
						roleId: _t.assignRoleListSelected.join(',')
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.dialogVisible = false;
								_t.getData();
								_t.resetFormAdd();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 2006: // 操作失败
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.resetFormAdd();
									_t.getData();
								});
								break;
							case 2100: // 字段重复处理
								var jsonParams = JSON.parse(res.message);
								if (jsonParams.displayName && jsonParams.displayName === '0') {
									_t.fieldRepeat('displayNameFlag', 'displayNameTip', _t.$t('userMaintenance.alertDisplayNameRepeatTip'), 'user_displayName');
								}
								if (jsonParams.userName && jsonParams.userName === '0') {
									_t.fieldRepeat('userNameFlag', 'userNameTip', _t.$t('userMaintenance.alertUserNameRepeatTip'), 'user_username');
								}
								if (jsonParams.mobile && jsonParams.mobile === '0') {
									_t.fieldRepeat('mobileFlag', 'mobileTip', _t.$t('userMaintenance.alertMobileRepeatTip'), 'user_mobile');
								}
								if (jsonParams.email && jsonParams.email === '0') {
									_t.fieldRepeat('emailsFlag', 'emailsTip', _t.$t('userMaintenance.alertEmailsRepeatTip'), 'user_emails');
								}
								break;
							default:
								break;
						}
					});
				}
			},
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getData();
			this.getOrganization();
		}
	}
</script>

<style>
	.assignRole-box {
		min-height: 72px;
		width: 100%;
		padding: 10px 0 0 10px;
		position: relative;
	}

	.assignRole-group-box .el-checkbox-button {
		margin-right: 10px;
		margin-bottom: 10px;
		min-width: 100px;
		height: 30px;
		text-align: center;
		line-height: 30px;
	}

	.assignRole-group-box .el-checkbox-button span {
		font-size: 12px;
	}

	.assignRole-group-box .el-checkbox-button__inner {
		border-radius: 2px !important;
		padding: 0 20px;
		display: inline-block;
		width: 100%;
		height: 30px;
		line-height: 30px;
	}

	.userMaintenance-dialog .el-dialog {
		width: 700px;
		height: 400px;
	}

	.userMaintenance-dialog .el-form-item {
		margin-right: 0 !important;
		width: 49%;
	}

	.assignRole-form {
		width: 94% !important;
		display: flex !important;
	}

	.assignRole-form .el-form-item__content {
		flex: 1;
	}
</style>
