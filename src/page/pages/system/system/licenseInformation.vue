<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.license')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20">
			<el-form inline label-width="200px" class="marginBottom10">
				<el-form-item :label="$t('license.formCustomerName') + '：'">
					<span>{{licenseForm.company}}</span>
				</el-form-item>
				<br>
				<el-form-item :label="$t('license.formBeginTime') + '：'">
					<span style="width: 100px;display: inline-block;">{{licenseForm.startTime | dateFilterDayCN}}</span>
				</el-form-item>
				<el-form-item :label="$t('license.formEndTime') + '：'">
					<span>{{licenseForm.endTime | dateFilterDayCN}}</span>
				</el-form-item>
				<br>
				<el-form-item :label="$t('license.formAllNumber') + '：'">
					<span style="width: 100px;display: inline-block;">{{licenseForm.nodeCount}}</span>
				</el-form-item>
				<el-form-item :label="$t('license.formHasNumber') + '：'">
					<span>{{licenseForm.useNodeCount}}</span>
				</el-form-item>
				<br>
				<el-form-item :label="$t('license.formEffectiveModule') + '：'">
					<span style="width: 100px;display: inline-block;">{{licenseForm.module}}</span>
				</el-form-item>
				<el-form-item :label="$t('license.formKvmModule') + '：'">
					<el-checkbox :disabled="true" v-model="licenseForm.kvmFlag"></el-checkbox>
				</el-form-item>
			</el-form>
		</div>
		<div class="padding20 borderBottom licensenInfo-btn-box">
			<el-button size="small" @click="uploadLicenseBtn">{{$t('license.formUploadLicense')}}</el-button>
<!--			<el-button type="primary" size="small" @click="isShowTable = true">{{$t('license.formViewHistory')}}</el-button>-->
		</div>
		<!--更新许可证书-->
		<el-dialog
			append-to-body
			class="licenseInformation-dialog"
			:title="$t('license.dialogTitle')"
			:before-close="resetLicenseFormData"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="dialogVisible">
			<el-form label-width="150px">
				<el-form-item :label="$t('license.dialogFormInfo') + '：'">
					<span>{{addEdit.sn}}</span>
				</el-form-item>
				<el-form-item :label="$t('license.dialogFormTextFirst') + '：'">
					<!--license文件1-->
					<el-upload
						:action="rootUrl + '/uploadLicense'"
						:data="dataObjectLicense"
						:headers="uploadHeaders"
						name="uploadFile"
						accept=".txt"
						:limit="limitLicenseNum"
						:on-success="licenseTextFirstSuccess"
						:before-upload="beforeAvatarUpload">
						<el-button type="primary">{{$t('license.dialogFormUpload')}}</el-button>
						<div class="license-upload-tip" slot="tip">{{$t('license.dialogFormUploadTip')}}</div>
					</el-upload>
					<span v-if="addEdit.licenseFirstFlag" class="fs12 iconfontError">{{$t('public.isNotNull')}}</span>
				</el-form-item>
				<el-form-item :label="$t('license.dialogFormTextSecond') + '：'">
					<!--license文件2-->
					<el-upload
						:action="rootUrl + '/uploadLicense'"
						:data="dataObjectLicense"
						:headers="uploadHeaders"
						name="uploadFile"
						accept=".txt"
						:limit="limitLicenseNum"
						:on-success="licenseTextSecondSuccess"
						:before-upload="beforeAvatarUpload">
						<el-button type="primary">{{$t('license.dialogFormUpload')}}</el-button>
						<div class="license-upload-tip" slot="tip">{{$t('license.dialogFormUploadTip')}}</div>
					</el-upload>
					<span v-if="addEdit.licenseSecondFlag" class="fs12 iconfontError">{{$t('public.isNotNull')}}</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" class="alertBtn" @click="uploadLicense">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetLicenseFormData">{{$t('public.cancel')}}</el-button>
      </span>
		</el-dialog>
		<!--查看证书历史-->
		<div class="padding20">
			<el-table :data="tableData" v-if="isShowTable" border stripe class="indexTableBox">
				<el-table-column width="90px" :label="$t('public.index')" type="index" header-align="left" align="left"/>
				<el-table-column :label="$t('license.columnCustomerName')" header-align="left" align="left"/>
				<el-table-column :label="$t('license.columnAllNumber')" header-align="left" align="left"/>
				<el-table-column :label="$t('license.columnStartTime')" header-align="left" align="left"/>
				<el-table-column :label="$t('license.columnModule')" header-align="left" align="left"/>
				<el-table-column :label="$t('license.columnEndTime')" header-align="left" align="left"/>
			</el-table>
		</div>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {dateFilterDayCN} from "../../../../assets/js/filters";

	export default {
		name: "license-information",
		components: {Box},
		data() {
			return {
				rootUrl: this.$api.root(),
				uploadHeaders: {
					'token': localStorage.getItem('hy-token') || ''
				},
				dataObjectLicense: {
					module: 'system',
					business: 'icsmessage',
					joinTimestamp: true
				},
				dialogVisible: false, // 更新授权弹出层
				isShowTable: false, // 是否显示表格
				limitLicenseNum: 1, // 限制license上传
				tableData: [], // 表格集合
				licenseForm: {
					company: '', // 客户名称
					module: '', //授权模块
					kvmFlag: '', // KVM授权
					useNodeCount: '', //已用节点数
					nodeCount: '', // 节点数
					startTime: '', // 起始时间
					endTime: '', // 过期时间
				},
				addEdit: {
					sn: '', // 序列号
					license1: '', // license文件1
					license2: '', // license文件2
					licenseFirstFlag: false, // license1为空提示
					licenseSecondFlag: false, // license2为空提示
				}
			}
		},
		methods: {
			// 提交更新license 授权
			uploadLicense() {
				var _t = this;
				// 校验license1是否为空
				if (_t.addEdit.license1 === '') {
					_t.addEdit.licenseFirstFlag = true;
				} else {
					_t.addEdit.licenseFirstFlag = false;
				}
				// 校验license2是否为空
				if (_t.addEdit.license2 === '') {
					_t.addEdit.licenseSecondFlag = true;
				} else {
					_t.addEdit.licenseSecondFlag = false;
				}
				// 都不为空可以提交
				if (_t.addEdit.licenseFirstFlag === false && _t.addEdit.licenseSecondFlag === false) {
					_t.$api.post('system/license/update', {
						license1: _t.addEdit.license1,
						license2: _t.addEdit.license2
					}, function (res) {
						switch (res.status) {
							case 200:
								if (res.data.status === true) {
									_t.$alert(_t.$t('license.confirmSaveSuccessTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getLicenseFormData();
										_t.resetLicenseFormData();
									});
								} else {
									_t.$alert(_t.$t('license.confirmSaveErrorTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {});
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
				}
			},
			// 重置license更新表单
			resetLicenseFormData(){
				var _t = this;
				_t.dialogVisible = false;
				_t.addEdit.license1 = '';
				_t.addEdit.license2 = '';
				_t.addEdit.licenseFirstFlag = false;
				_t.addEdit.licenseSecondFlag = false;
			},
			// license文件上传之前
			beforeAvatarUpload(file) {
				var _t = this;
				var isTxt = file.type === 'text/plain';
				if (!isTxt) {
					_t.$message.error(_t.$t('license.dialogFormUploadTip'));
				}
				return isTxt;
			},
			// license文件1上传成功
			licenseTextFirstSuccess(res) {
				var _t = this;
				if (res.status === 200) {
					_t.addEdit.license1 = res.data.filePath;
					_t.addEdit.licenseFirstFlag = false;
				}
			},
			// license文件2上传成功
			licenseTextSecondSuccess(res) {
				var _t = this;
				if (res.status === 200) {
					_t.addEdit.license2 = res.data.filePath;
					_t.addEdit.licenseSecondFlag = false;
				}
			},
			// 获取license表单数据
			getLicenseFormData() {
				var _t = this;
				_t.$api.get('system/license/info', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.licenseForm.company = res.data.company;
							_t.licenseForm.startTime = res.data.startTime;
							_t.licenseForm.endTime = res.data.endTime;
							_t.licenseForm.nodeCount = res.data.nodeCount;
							_t.licenseForm.useNodeCount = res.data.useNodeCount;
							_t.licenseForm.kvmFlag = res.data.kvmFlag;
							_t.licenseForm.module = res.data.module;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.licenseForm.company = '';
							_t.licenseForm.startTime = '';
							_t.licenseForm.endTime = '';
							_t.licenseForm.nodeCount = '';
							_t.licenseForm.useNodeCount = '';
							_t.licenseForm.kvmFlag = '';
							_t.licenseForm.module = '';
							break;
					}
				});
			},
			// 获取序列号
			getLicenseInfo() {
				var _t = this;
				_t.$api.get('system/license/statusInfo', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addEdit.sn = res.data.sn;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.added.sn = '';
							break;
					}
				});
			},
			// 更新许可证 按钮数据回显 获取序列号
			uploadLicenseBtn() {
				var _t = this;
				_t.dialogVisible = true;
				_t.getLicenseInfo();
			},
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getLicenseFormData();
		}
	}
</script>

<style scoped>
	.license-upload-tip {
		height: 20px;
		line-height: 20px;
		font-size: 12px;
	}
</style>
<style>
	.licenseInformation-dialog .el-dialog {
		width: 640px;
		height: 434px;
	}
</style>
