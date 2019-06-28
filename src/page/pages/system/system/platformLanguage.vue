<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.platformLanguage')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20 borderBottom">
			<!--表单-->
			<el-form inline :model="formItem">
				<el-form-item :label="$t('platformLanguage.languageCode') + '：'">
					<el-input
						class="width200" v-model="formItem.languageCode"
						@keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('platformLanguage.languageName') + '：'">
					<el-input
						class="width200" v-model="formItem.languageName"
						@keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('platformLanguage.status') + '：'">
					<el-select v-model="formItem.status" class="width200" clearable>
						<el-option
							v-for="item in statusList"
							:value="item.value"
							:key="item.key"
							:label="item.label"/>
					</el-select>
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
				<el-button type="warning" class="queryBtn" @click="addDataBtn">
					<span class="iconfont fs14">&#xe689;</span>
					{{$t('public.add')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
					<span class="iconfont fs14">&#xe641;</span>
					{{$t('public.edit')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
					<span class="iconfont fs14">&#xe645;</span>
					{{$t('public.enable')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
					<span class="iconfont fs14">&#xe646;</span>
					{{$t('public.disable')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
					<span class="iconfont fs14">&#xe647;</span>
					{{$t('public.delete')}}
				</el-button>
				<el-button @click="setDefault" :disabled="disableBtn.default">
					<span class="iconfont fs14">&#xe6a4;</span>
					{{$t('platformLanguage.setDefault')}}
				</el-button>
				<!--
				<el-button @click="importFunction" :disabled="disableBtn.edit">
					<span class="iconfont fs14">&#xe6a3;</span>
					{{$t('platformLanguage.importFunction')}}
				</el-button>
				<el-button @click="importData" :disabled="disableBtn.edit">
					<span class="iconfont fs14">&#xe6a5;</span>
					{{$t('platformLanguage.importData')}}
				</el-button>
				-->
			</div>
			<!--表格-->
			<el-table :data="tableData" border stripe ref="table" @selection-change="selectTableNum">
				<el-table-column type="selection" fixed header-align="left" align="left"/>
				<el-table-column :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
            			<span>
							{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="languageCode"  header-align="left" align="left"
					:label="$t('platformLanguage.languageCodes')" />
				<el-table-column
					prop="languageName"  header-align="left" align="left"
					:label="$t('platformLanguage.languageName')" />
				<el-table-column
					prop="description" header-align="left" align="left"
					:label="$t('platformLanguage.description')" />
				<el-table-column :label="$t('platformLanguage.sort')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-button :disabled="scope.$index == 0" type="text" @click="moveUp(scope.row)">
							{{$t('public.moveUp')}}
						</el-button>
						<el-button :disabled="scope.$index == tableData.length - 1" type="text"
								   @click="moveDown(scope.row)">{{$t('public.moveDown')}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column :label="$t('platformLanguage.isDefault')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.isDefault == true">{{$t('public.YES')}}</span>
						<span v-if="scope.row.isDefault == false" class="disabledStatusColor">{{$t('public.NO')}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('platformLanguage.status')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.enable === true">{{$t('public.enable')}}</span>
						<span v-if="scope.row.enable === false"
							  class="disabledStatusColor">{{$t('public.disable')}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="createBy" header-align="left" align="left"
					:label="$t('platformLanguage.createName')"/>
				<el-table-column :label="$t('platformLanguage.createTime')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<pages
				:total='options.total'
				:currentPage='options.currentPage'
				:pageSize='options.pageSize'
				@handleSizeChangeSub="handleSizeChangeSub"
				@handleCurrentChangeSub="handleCurrentChange"/>
		</div>
		<!--新增/编辑-->
		<el-dialog
			class="platformLanguage-dialog"
			append-to-body
			:title="$t('platformLanguage.createUpdateLanguage')"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form label-width="150px" inline :model="addEdit" :rules="rules" ref="roleForm">
				<el-form-item class="star" :label="$t('platformLanguage.languageCodes') + '：'" prop="languageCode">
					<el-input class="width200" v-model="addEdit.languageCode" clearable/>
				</el-form-item>
				<el-form-item class="star" :label="$t('platformLanguage.languageName') + '：'" prop="languageName">
					<el-input class="width200" v-model="addEdit.languageName" clearable/>
				</el-form-item>
				<el-form-item :label="$t('platformLanguage.descriptionAlert') + '：'">
					<el-input class="width200" v-model="addEdit.description" clearable/>
				</el-form-item>
				<!--<el-form-item class="star" :label="$t('platformLanguage.Order') + '：'" prop="orderIndex">-->
				<!--<el-input class="width200" v-model="addEdit.orderIndex" clearable/>-->
				<!--</el-form-item>-->
				<el-form-item class="star" :label="$t('platformLanguage.isDefault') + '：'" prop="isDefault">
					<el-radio-group class="width200" v-model="addEdit.isDefault">
						<el-radio :label="1">{{$t('public.YES')}}</el-radio>
						<el-radio :label="0">{{$t('public.NO')}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item class="star" :label="$t('platformLanguage.isEnable') + '：'" prop="isEnable">
					<el-radio-group class="width200" v-model="addEdit.isEnable">
						<el-radio :label="1">{{$t('public.enable')}}</el-radio>
						<el-radio :label="0">{{$t('public.disable')}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer">
        <el-button type="primary" class="alertBtn" v-if="ifAdd == true" @click="addData('roleForm')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="alertBtn" v-if="ifAdd == false" @click="editData('roleForm')">{{$t('public.confirm')}}</el-button>
        <el-button class="queryBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull} from "../../../../assets/js/validator";

	export default {
		name: "platformLanguage",
		components: {Box},
		data() {
			return {
				// 查询表单
				formItem: {
					languageCode: null,
					languageName: null,
					status: null
				},
				// 新增编辑表单
				addEdit: {
					id: null,
					languageCode: '',
					languageName: '',
					description: '',
					orderIndex: '',
					isDefault: 0,
					isEnable: 1
				},
				// 按钮禁用启用
				disableBtn: {
					edit: true,
					enable: true,
					disable: true,
					more: true,
					default: true
				},
				// 状态列表
				statusList: [
					{label: this.$t('public.enable'), value: 1},
					{label: this.$t('public.disable'), value: 0},
				],
				dialogVisible: false, // 新增编辑弹出层
				ifAdd: true, // 新增编辑判断
				tableData: [], // 表格数据
				checkListIds: [], // 获取选中的表格数据id
				editDataList: {}, // 选中的单条的数据集合
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				// 校验规则
				rules: {
					languageCode: [
						{validator: isNotNull, trigger: ['blur']}
					],
					languageName: [
						{validator: isNotNull, trigger: ['blur']}
					],
					// orderIndex: [
					//   {validator: isNotNull, trigger: ['blur']}
					// ],
					isDefault: [
						{validator: isNotNull, trigger: ['blur', 'change']}
					],
					isEnable: [
						{validator: isNotNull, trigger: ['blur', 'change']}
					]
				}
			}
		},
		methods: {
			// 重置筛选表单
			resetData() {
				var _t = this;
				_t.formItem.languageCode = null;
				_t.formItem.languageName = null;
				_t.formItem.status = null;
			},
			// 重置表单
			resetFormData() {
				var _t = this;
				_t.dialogVisible = false;
				_t.addEdit.id = null;
				_t.addEdit.languageCode = '';
				_t.addEdit.languageName = '';
				_t.addEdit.description = '';
				// _t.addEdit.orderIndex = '';
				_t.addEdit.isDefault = 0;
				_t.addEdit.isEnable = 1;
				_t.$refs.table.clearSelection();
				_t.$refs.roleForm.resetFields(); //移除校验结果并重置字段值
				_t.$refs.roleForm.clearValidate(); //移除校验结果
			},
			// 新增按钮
			addDataBtn() {
				var _t = this;
				_t.dialogVisible = true;
				_t.ifAdd = true;
			},
			// 编辑按钮
			editDataBtn() {
				var _t = this;
				// 新增编辑判断
				_t.ifAdd = false;
				_t.addEdit.id = _t.editDataList.id;
				_t.getEditData(_t.addEdit.id)
			},
			// 根据语言id获取最新数据
			getEditData(data) {
				var _t = this;
				_t.$api.get('system/language/' + data, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addEdit.languageCode = res.data.languageCode;
							_t.addEdit.languageName = res.data.languageName;
							// _t.addEdit.orderIndex = res.data.orderMark;
							_t.addEdit.description = res.data.description;
							_t.addEdit.isDefault = res.data.isDefault == true ? 1 : 0;
							_t.addEdit.isEnable == res.data.isEnable == true ? 1 : 0;
							_t.dialogVisible = true;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
							break;
						default:
							break;
					}
				});
			},
			// 编辑提交数据
			editData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.put('system/language/', {
							systemLanguage: {
								id: _t.addEdit.id,
								languageCode: _t.addEdit.languageCode == null ? null : (_t.addEdit.languageCode.trim() === '' ? null : _t.addEdit.languageCode.trim()),
								languageName: _t.addEdit.languageName == null ? null : (_t.addEdit.languageName.trim() === '' ? null : _t.addEdit.languageName.trim()),
								description: _t.addEdit.description == null ? null : (_t.addEdit.description.trim() === '' ? null : _t.addEdit.description.trim()),
								isDefault: _t.addEdit.isDefault == 1 ? true : false,
								enable: _t.addEdit.isEnable == 1 ? true : false,
								// orderMark: Number(_t.addEdit.orderIndex.toString().trim()),
								languageIcon: null, // 语言图标 国旗
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									//关闭编辑窗
									_t.dialogVisible = false;
									//重新加载数据
									_t.getData();
									_t.resetFormData();
									// 编辑语言列表成功之后刷新顶部导航语言列表
									_t.$bus.emit('getLanguage', true);
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 2006: //修改失败
									_t.$message.error(res.message);
									break;
								default:
									break;
							}
							_t.disableBtn.edit = true;
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
							_t.disableBtn.more = true;
							_t.disableBtn.default = true;
						});
					}
				})
			},
			// 新增语言请求
			addData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.post('system/language/', {
							systemLanguage: {
								id: null,
								languageCode: _t.addEdit.languageCode == null ? null : _t.addEdit.languageCode.trim(),
								languageName: _t.addEdit.languageName == null ? null : _t.addEdit.languageName.trim(),
								description: _t.addEdit.description == null ? null : _t.addEdit.description.trim(),
								isDefault: _t.addEdit.isDefault == 1 ? true : false,
								enable: _t.addEdit.isEnable == 1 ? true : false,
								// orderMark: Number(_t.addEdit.orderIndex.toString().trim()),
								languageIcon: null, // 语言图标国旗
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									//关闭编辑窗
									_t.dialogVisible = false;
									//重新加载数据
									_t.getData();
									_t.resetFormData();
									// 新增语言之后重新获取 顶部导航语言列表数据
									_t.$bus.emit('getLanguage', true);
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 2005: //修改失败
									_t.$message.error(res.message);
									break;
								default:
									break;
							}
							_t.disableBtn.edit = true;
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
							_t.disableBtn.more = true;
							_t.disableBtn.default = true;
						});
					}
				});
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
						_t.disableBtn.default = true;
						break;
					case 1: // 单选
						_t.disableBtn.edit = false;
						_t.disableBtn.more = false;
						var checkListIds = new Array();
						data.forEach(function (item) {
							_t.editDataList = item;
							checkListIds.push(item.id);
							// 启用禁用判断
							if (item.enable === false) {
								_t.disableBtn.enable = false;
							} else if (item.enable === true) {
								_t.disableBtn.disable = false;
							}
							// 设为默认判断
							if (item.isDefault == false) {
								_t.disableBtn.default = false;
							} else {
								_t.disableBtn.default = true;
							}
						});
						_t.checkListIds = checkListIds;
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.disableBtn.more = false;
						_t.disableBtn.default = true;
						var disableFlag = 0, enableFlag = 0;
						var checkListIds = new Array();
						for (var i = 0; i < data.length; i++) {
							// 启用禁用判断
							if (data[i].enable === false) {
								disableFlag++;
							} else if (data[i].enable === true) {
								enableFlag++;
							}
							// 获取id集合
							checkListIds.push(data[i].id);
						}
						_t.checkListIds = checkListIds;
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
				_t.$confirm(_t.$t('platformLanguage.confirmEnableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					cancelButtonClass: 'alertBtn',
					confirmButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/language/', {
						systemLanguage: {
							id: _t.checkListIds.join(','),
							enable: true
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('platformLanguage.confirmEnableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									// 启用语言之后刷新顶部导航语言列表
									_t.$bus.emit('getLanguage', true);
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
					_t.disableBtn.edit = true;
					_t.disableBtn.enable = true;
					_t.disableBtn.disable = true;
					_t.disableBtn.more = true;
					_t.disableBtn.default = true;
					_t.$refs.table.clearSelection();
				}).catch(() => {
					return;
				});
			},
			// 禁用
			disableData() {
				var _t = this;
				_t.$confirm(_t.$t('platformLanguage.confirmDisableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/language/', {
						systemLanguage: {
							id: _t.checkListIds.join(','),
							enable: false
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('platformLanguage.confirmDisableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn',
								}).then(() => {
									_t.getData();
									_t.$bus.emit('getLanguage', true);
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
					_t.disableBtn.edit = true;
					_t.disableBtn.enable = true;
					_t.disableBtn.disable = true;
					_t.disableBtn.more = true;
					_t.disableBtn.default = true;
					_t.$refs.table.clearSelection();
				}).catch(() => {
					return;
				});
			},
			// 删除
			deleteData() {
				var _t = this;
				_t.$confirm(_t.$t('platformLanguage.confirmDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$api.delete('system/language/', {
						jsonString: JSON.stringify({
							ids: _t.checkListIds.join(',')
						})
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('platformLanguage.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$bus.emit('getLanguage', true);
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
								});
								_t.getData();
								break;
							default:
								_t.getData();
								break;
						}
						_t.disableBtn.edit = true;
						_t.disableBtn.enable = true;
						_t.disableBtn.disable = true;
						_t.disableBtn.more = true;
						_t.disableBtn.default = true;
						_t.$refs.table.clearSelection();
					});
				}).catch(() => {
					return;
				});
			},
			// 设为默认
			setDefault() {
				var _t = this;
				_t.$confirm(_t.$t('platformLanguage.confirmSetDefaultTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/language/', {
						systemLanguage: {
							id: _t.checkListIds.join(','),
							isDefault: true
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('platformLanguage.confirmSetDefaultSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$bus.emit('getLanguage', true);
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
					_t.disableBtn.edit = true;
					_t.disableBtn.enable = true;
					_t.disableBtn.disable = true;
					_t.disableBtn.more = true;
					_t.disableBtn.default = true;
					_t.$refs.table.clearSelection();
				}).catch(() => {
					return;
				});
			},
			// 导入功能菜单
			importFunction() {
				var _t = this;
				_t.$confirm(_t.$t('platformLanguage.confirmImportMenuTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.disableBtn.edit = true;
					_t.disableBtn.enable = true;
					_t.disableBtn.disable = true;
					_t.disableBtn.more = true;
					_t.disableBtn.default = true;
					_t.$refs.table.clearSelection();
				}).catch(() => {
					return;
				});
			},
			// 导入数据字典菜单
			importData() {
				var _t = this;
				_t.$confirm(_t.$t('platformLanguage.confirmImportDataBaseTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.disableBtn.edit = true;
					_t.disableBtn.enable = true;
					_t.disableBtn.disable = true;
					_t.disableBtn.more = true;
					_t.disableBtn.default = true;
					_t.$refs.table.clearSelection();
				}).catch(() => {
					return;
				});
			},
			// 获取表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/language/pagelist', {
					jsonString: JSON.stringify({
						systemLanguage: {
							languageCode: _t.formItem.languageCode == null ? null : (_t.formItem.languageCode.trim() == '' ? null : _t.formItem.languageCode.trim()),
							languageName: _t.formItem.languageName == null ? null : (_t.formItem.languageName.trim() == '' ? null : _t.formItem.languageName.trim()),
							enable: _t.formItem.status == null ? null : (_t.formItem.status == 1 ? true : false)
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.tableData = res.data.list === null ? [] : res.data.list;
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
			// 上移
			moveUp(data) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				var dataIdArr = new Array();
				dataIdArr.push(data.id);
				_t.tableData = _t.tableData === null ? [] : _t.tableData;
				_t.tableData.forEach(function (item, index) {
					if (item.id === data.id) {
						dataIdArr.push(_t.tableData[index - 1].id)
					}
				});
				_t.$api.put('system/language/order', {
					ids: dataIdArr.join(',')
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.getData();
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
			// 下移
			moveDown(data) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				var dataIdArr = new Array();
				dataIdArr.push(data.id);
				_t.tableData = _t.tableData === null ? [] : _t.tableData;
				_t.tableData.forEach(function (item, index) {
					if (item.id === data.id) {
						dataIdArr.push(_t.tableData[index + 1].id)
					}
				});
				_t.$api.put('system/language/order', {
					ids: dataIdArr.join(',')
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.getData();
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
		created() {
			this.$store.commit('setLoading', true);
			this.getData();
		}
	}
</script>
<style>
	.platformLanguage-dialog .el-dialog {
		width: 600px;
		height: 440px;
	}
</style>
