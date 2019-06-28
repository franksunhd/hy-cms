<template>
	<Box>
		<div class="licenseExpired-Box">
			<el-form class="licenseExpired-Content">
				<el-form-item :label="$t('license.dialogFormInfo') + '：'">
					<span>{{addEdit.sn}}</span>
				</el-form-item>
				<el-form-item>
					<div class="licenseExpired-Content-box">
						<!--license文件1-->
						<el-upload
							class="licenseExpired-Content-upload"
							:action="rootUrl + '/uploadLicense'"
							:data="dataObjectLicense"
							:headers="uploadHeaders"
							name="uploadFile"
							accept=".txt"
							:limit="limitLicenseNum"
							:on-success="licenseTextFirstSuccess"
							:before-upload="beforeAvatarUpload">
							<img src="../assets/img/license_upload.png" alt="">
							<div class="licenseExpired-title">{{$t('license.dialogFormTextFirst')}}</div>
							<div class="license-upload-tip" slot="tip">{{$t('license.dialogFormUploadTip')}}</div>
							<span v-if="addEdit.licenseFirstFlag" class="fs12 iconfontError isNotNullTip">{{$t('public.isNotNull')}}</span>
						</el-upload>
						<!--license文件2-->
						<el-upload
							class="licenseExpired-Content-upload"
							:action="rootUrl + '/uploadLicense'"
							:data="dataObjectLicense"
							:headers="uploadHeaders"
							name="uploadFile"
							accept=".txt"
							:limit="limitLicenseNum"
							:on-success="licenseTextSecondSuccess"
							:before-upload="beforeAvatarUpload">
							<img src="../assets/img/license_upload.png" alt="">
							<div class="licenseExpired-title">{{$t('license.dialogFormTextSecond')}}</div>
							<div class="license-upload-tip" slot="tip">{{$t('license.dialogFormUploadTip')}}</div>
							<span v-if="addEdit.licenseSecondFlag" class="fs12 iconfontError isNotNullTip">{{$t('public.isNotNull')}}</span>
						</el-upload>
					</div>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" class="alertBtn" @click="uploadLicense">{{$t('public.confirm')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
	</Box>
</template>

<script>
	import Box from '../components/common/Box';

	export default {
		name: "licenseExpired",
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
				limitLicenseNum: 1, // 限制license上传
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
										localStorage.setItem('hy-license', true);
										_t.$router.push({name: 'Login'});
									});
								} else {
									_t.$alert(_t.$t('license.confirmSaveErrorTip'), _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
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
								break;
						}
					});
				}
			},
			// 获取序列号
			getLicenseInfo() {
				var _t = this;
				_t.$api.get('system/license/statusInfo', {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if (res.data.status === true) {
								localStorage.setItem('hy-license', true);
								_t.$router.push({name: 'Login'});
							} else {
								localStorage.setItem('hy-license', false);
								_t.addEdit.sn = res.data.sn;
							}
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
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getLicenseInfo();
		}
	}
</script>

<style scoped>
	.licenseExpired-Box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url("../assets/img/license_bg.png") repeat;
	}

	.licenseExpired-Content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.licenseExpired-Content-box {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-around;
	}

	.licenseExpired-Content-upload {
		width: 264px;
		height: 264px;
		text-align: center;
		border-radius: 5px;
		position: relative;
	}

	.licenseExpired-Content-upload:nth-child(1) {
		margin-right: 20px;
	}

	.isNotNullTip {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 10px;
	}

	.licenseExpired-title {
		font-size: 14px;
		margin-top: 10px;
	}
</style>

<style>
	.licenseExpired-Content-upload .el-upload {
		display: inline-block;
		width: 264px;
		height: 264px;
	}

	.licenseExpired-Content-upload .el-upload > img {
		margin-top: 50px;
	}

	.licenseExpired-Content-upload .license-upload-tip {
		position: absolute;
		top: 145px;
		left: 0;
		right: 0;
	}

	.licenseExpired-Content-upload .el-upload-list {
		position: absolute;
		top: 160px;
		left: 0;
		right: 0;
	}
</style>
