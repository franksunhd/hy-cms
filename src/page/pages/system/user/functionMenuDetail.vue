<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.functionMenuMaintenance')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20">
			<div class="grayBg functionMenuDetail-title systemBlue" @click="goBack">
				<span class="iconfont">&#xe691;</span>
				<span>{{$t('functionMenuMaintenance.goBack')}}</span>
			</div>
		</div>
		<el-form label-width="150px" :model="addEdit" :rules="rules" ref="roleName">
			<el-form-item :label="$t('functionMenuMaintenance.parentName') + '：'">
				<el-popover
					trigger="click"
					@show="disablePopover"
					placement="bottom-start"
					v-model="isShowEditPopover"
					ref="popover">
					<el-tree
						:data="treeData"
						highlight-current
						:expand-on-click-node="false"
						@node-click="clickNodeAlert"
						:props="defaultProps"/>
					<el-input
						v-model="addEdit.parentName"
						class="width200"
						suffix-icon="el-icon-arrow-down"
						readonly
						:disabled="ifAdd == false"
						slot="reference"/>
				</el-popover>
			</el-form-item>
			<el-form-item class="star" :label="$t('functionMenuMaintenance.menuName') + '：'" style="margin-bottom: 0;">
				<div class="positionRelative" v-for="(item,index) in languageList">
					<el-input :id="item.id" @input="menuNameInput(item)" v-model="item.menuName" style="margin-bottom: 20px;"
										class="width200" :placeholder="item.languageName"/>
					<span class="isNotNull"
								v-if="item.flag == true && item.menuName.trim() == ''">{{$t('public.isNotNull')}}</span>
				</div>
			</el-form-item>
			<el-form-item :label="$t('functionMenuMaintenance.menuIcon') + '：'">
				<el-input v-model="addEdit.menuClass" :placeholder="$t('functionMenuMaintenance.className')" class="width200 marBottom10"/>
				<el-upload action="">
					<el-button size="small" type="primary">{{$t('functionMenuMaintenance.clickImport')}}</el-button>
				</el-upload>
				<el-input v-if="false" v-model="addEdit.menuIcon"/>
			</el-form-item>
			<el-form-item :label="$t('functionMenuMaintenance.menuUrl') + '：'">
				<el-input v-model="addEdit.menuHref" class="width200"/>
			</el-form-item>
			<el-form-item :label="$t('functionMenuMaintenance.jumpType') + '：'">
				<el-radio-group v-model="addEdit.jumpType">
					<el-radio label="_blank">_blank</el-radio>
					<el-radio label="_self">_self</el-radio>
					<el-radio label="_parent">_parent</el-radio>
					<el-radio label="_top">_top</el-radio>
					<el-radio label="framename">
						<el-input v-model="addEdit.jumpText" placeholder="framename" class="width170"/>
					</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item class="star" :label="$t('functionMenuMaintenance.roleMenu') + '：'">
				<el-button class="queryBtn" type="primary" @click="selectRoleBtn">
					<span class="fs12">{{$t('functionMenuMaintenance.selectUser')}}</span>
				</el-button>
				<el-radio class="systemUser-box" v-model="checked" :label="true" disabled>系统超级管理员</el-radio>
				<!--展示选择的用户数据-->
				<div v-for="(item,index) in listData" :key="index">
					<!--标题部分循环-->
					<p class="fs12">
						<template v-for="(k,i) in item.title">
							<span>{{k}}</span>
							<i v-if="i !== item.title.length - 1" class="el-icon-arrow-right"></i>
						</template>
					</p>
					<!--标签部分循环-->
					<el-tag style="margin: 0 10px 10px 0;" v-for="tag in item.tags" :key="tag.id" @close="handleClose(tag)"
									closable>
						{{tag.nodeName}}
					</el-tag>
				</div>
				<p v-if="selectUserIsNull == true" class="el-form-item__error">{{$t('public.isNotNull')}}</p>
			</el-form-item>
			<!--<el-form-item class="star" :label="$t('functionMenuMaintenance.modelLevel') + '：'" prop="menuLevel">-->
			<!--<el-input v-model="addEdit.menuLevel" class="width200" readonly/>-->
			<!--</el-form-item>-->
			<el-form-item class="star" :label="$t('functionMenuMaintenance.statusAlert') + '：'" prop="enable">
				<el-radio-group v-model="addEdit.enable">
					<el-radio :label="1">{{$t('public.enable')}}</el-radio>
					<el-radio :label="0">{{$t('public.disable')}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button v-if="ifAdd == true" type="primary" class="queryBtn" @click="addData('roleName')">
					{{$t('public.save')}}
				</el-button>
				<el-button v-if="ifAdd == false" type="primary" class="queryBtn" @click="editData('roleName')">
					{{$t('public.save')}}
				</el-button>
			</el-form-item>
		</el-form>
		<!--选择用户-->
		<el-dialog class="functionMenuDetail-dialog-selectUser" :title="$t('functionMenuMaintenance.selectUser')"
							 :visible.sync="dialogVisibleAlert" append-to-body>
			<el-tree :data="selectUser" :props="defaultPropsUser" show-checkbox node-key="nodeId"
							 :default-checked-keys="checkedKeysArr" ref="tree"/>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getCheckedNodes" class="alertBtn">{{$t('public.confirm')}}</el-button>
          <el-button @click="dialogVisibleAlert = false" class="alertBtn">{{$t('public.cancel')}}</el-button>
        </span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/Box';
	import {isNotNull, isMenuHref} from "../../../../assets/js/validator";
	import {queryOrgWithRole, returnObjectById} from "../../../../assets/js/recursive";

	export default {
		name: "functionMenuDetail",
		components: {
			Box
		},
		data() {
			return {
				// 表单集合
				addEdit: {
					id: '',
					parentId: null,
					parentName: '',
					menuLevel: 1,
					menuIcon: '',
					menuClass: '',
					menuHref: '',
					jumpType: '_blank',
					jumpText: '',
					enable: 1,
					orderMark: 1,
				},
				isShowEditPopover: false,
				ifAdd: true, // 是否新增
				selectUserIsNull: false, // 选中用户是否为空
				dialogVisibleAlert: false, // 选择用户弹出层
				checked: true, // 系统超级管理员
				treeData: [], // 父级树型下拉框
				languageList: [], // 系统支持的语言列表
				listData: [], // 授权的角色列表
				selectUser: [], // 选中的角色
				checkedKeysArr: [], // 选择用户树形控件默认选中的节点组
				defaultProps: {
					label: 'menuName',
					children: 'systemMenuAndLanguageRelationChildList'
				},
				defaultPropsUser: {
					label: 'nodeName',
					children: 'children'
				},
				// 校验规则
				rules: {
					menuLevel: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					// orderMark: [
					//   {validator: isNotNull, trigger: ['blur']}
					// ],
					enable: [{
						validator: isNotNull,
						trigger: ['blur', 'change']
					}],
					jumpType: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					menuIcon: [{
						validator: isNotNull,
						trigger: ['blur']
					}]
				}
			}
		},
		methods: {
			// 编辑时禁用显示属性下拉框
			disablePopover() {
				var _t = this;
				if (_t.ifAdd === false) {
					_t.isShowEditPopover = false;
				}
			},
			// 输入框菜单名称校验
			menuNameInput(data) {
				if (data.menuName.trim() === '') {
					data.flag = true;
					document.getElementById(data.id).style.borderColor = '#fb6041';
				} else {
					data.flag = false;
					document.getElementById(data.id).style.borderColor = '#DCDFE6';
				}
			},
			// 改变父级组织 菜单
			clickNodeAlert(val) {
				var _t = this;
				_t.addEdit.parentId = val.id;
				_t.addEdit.parentName = val.menuName;
				_t.isShowEditPopover = false;
				_t.addEdit.menuLevel = val.menuLevel + 1;
			},
			// 选择角色按钮
			selectRoleBtn() {
				var _t = this;
				_t.getOrgRoleList();
				_t.dialogVisibleAlert = true;
				// 编辑时 过滤数据
				if (_t.ifAdd == false) {
					var checkArr = new Array();
					_t.result().forEach(function (item) {
						checkArr.push(item.nodeId);
					});
					_t.checkedKeysArr = checkArr;
				}
			},
			// 删除标签
			handleClose(tag) {
				var _t = this;
				var listData = _t.listData === null ? [] : _t.listData;
				listData.forEach(function (item, index) {
					var tags = item.tags;
					if (tags.length > 1) { // 该区域删除之后还有标签
						tags.forEach(function (val, i) {
							if (tag.nodeId == tags[i].nodeId) {
								tags.splice(i, 1);
								_t.result();
								return false;
							}
						});
					} else { // 该区域删除之后没有标签了 删除该区域
						tags.forEach(function (val, i) {
							if (tag.nodeId == tags[i].nodeId) {
								tags.splice(i, 1);
								listData.splice(index, 1);
								_t.result();
								return false;
							}
						});
					}
				});
				// 删除标签之后 角色为空 显示提示
				if (_t.listData.length == 0) {
					_t.selectUserIsNull = true;
				}
			},
			// 剩余人员
			result() {
				var _t = this;
				var listData = _t.listData === null ? [] : _t.listData;
				var nodeArr = new Array();
				listData.forEach(function (item) {
					if (item.tags.length !== 0) {
						item.tags.forEach(function (val) {
							nodeArr.push(val);
						});
					}
				});
				return nodeArr;
			},
			// 获取节点显示数据
			getCheckedNodes() {
				var _t = this;
				_t.dialogVisibleAlert = false;
				_t.listData = queryOrgWithRole(_t.selectUser, _t.$refs.tree.getCheckedNodes(), 1);
				if (_t.listData.length == 0) {
					_t.selectUserIsNull = true;
				} else {
					_t.selectUserIsNull = false;
				}
				_t.$refs.tree.setCheckedKeys([]);
			},
			// 获取左侧功能菜单列表
			getMenuData() {
				var _t = this;
				_t.$api.get('system/menu/', {
					jsonString: JSON.stringify({
						menuLevel: '1_2_3_4',
						languageMark: localStorage.getItem('hy-language')
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200: // 查询成功
							_t.treeData = res.data.rootMenu === null ? [] : res.data.rootMenu;
							// 判断是新增还是编辑
							if (_t.ifAdd == true) {
								// 新增
								_t.getLanguage();
							} else {
								// 编辑
								_t.addEdit.id = _t.$route.params.functionMenuId ? _t.$route.params.functionMenuId : localStorage.getItem('functionMenuId');
								_t.getEditData(_t.addEdit.id);
								_t.getOrgRoleList();
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.treeData = [];
							break;
					}
				});
			},
			// 获取组织角色列表
			getOrgRoleList() {
				var _t = this;
				_t.$api.get('system/organization/getOrgRole', {
					jsonString: JSON.stringify({
						systemMenu: {}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var selectUser = new Array();
							selectUser.push(JSON.parse(res.data));
							_t.selectUser = selectUser[0].children;
							if (_t.ifAdd == false) {
								_t.getEditRoleData(_t.addEdit.id);
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.selectUser = [];
							break;
					}
				});
			},
			// 查询当前支持的语言
			getLanguage() {
				var _t = this;
				_t.$api.get('system/language/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var languageList = res.data.list === null ? [] : res.data.list;
							languageList.forEach(function (item) {
								item.menuName = '';
								item.languageMark = item.languageCode;
								item.flag = false;
							});
							_t.languageList = languageList;
							_t.addEdit.parentId = _t.addEdit.parentId === 'null' ? null : _t.addEdit.parentId;
							if (_t.addEdit.parentId !== null) {
								var menuNameMap = returnObjectById(_t.treeData, _t.addEdit.parentId);
								_t.addEdit.parentName = menuNameMap.menuName;
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.languageList = [];
							break;
					}
				});
			},
			// 根据菜单id查询需要编辑的数据
			getEditData(data) {
				var _t = this;
				_t.$api.get('system/menu/' + data, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.getEditLanguageData(res.data);
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
			// 根据系统支持的语言 组装菜单名称
			getEditLanguageData(resData) {
				var _t = this;
				_t.$api.get('system/language/all', {}, function (res) {
					switch (res.status) {
						case 200:
							resData.systemMenuLanguageList = resData.systemMenuLanguageList === null ? [] : resData.systemMenuLanguageList;
							var languageList = res.data.list === null ? [] : res.data.list;
							languageList.forEach(function (item) {
								item.menuName = '';
								item.flag = false;
								item.languageMark = item.languageCode;
							});
							languageList.forEach(function (item) {
								resData.systemMenuLanguageList.forEach((val) => {
									if (item.languageCode === val.languageMark) {
										item.menuName = val.menuName;
									}
								})
							});
							_t.languageList = languageList;
							_t.addEdit.parentId = resData.parentId;
							_t.addEdit.menuHref = resData.menuHref;
							_t.addEdit.jumpType = resData.menuTarget;
							// _t.addEdit.menuLevel = Number(resData.menuLevel);
							_t.addEdit.menuClass = resData.menuClass == null ? '' : resData.menuClass;
							_t.addEdit.menuIcon = resData.menuIcon == null ? '' : resData.menuIcon;
							_t.addEdit.orderMark = resData.orderMark;
							_t.addEdit.enable = resData.enable == true ? 1 : 0;
							if (_t.addEdit.parentId !== null) {
								var menuNameMap = returnObjectById(_t.treeData, _t.addEdit.parentId);
								_t.addEdit.parentName = menuNameMap.menuName;
							}
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.languageList = [];
							break;
					}
				});
			},
			// 根据菜单id 查询 需要编辑的数据下的角色列表
			getEditRoleData(data) {
				var _t = this;
				if (data !== null) {
					_t.$api.get('system/role/getRoleByMenu', {
							jsonString: JSON.stringify({
								systemMenu: {
									id: data
								}
							})
						},
						function (res) {
							switch (res.status) {
								case 200:
									var nodeIdArr = new Array();
									var resData = res.data === null ? [] : res.data;
									resData.forEach(function (item) {
										if (item !== null) {
											var obj = new Object();
											obj.children = [];
											obj.level = 1; // 类型 1代表角色类型 2代表组织类型
											obj.nodeId = item.id;
											obj.nodeName = item.roleName;
											obj.parentNodeId = item.organizationId == null ? '0' : item.organizationId;
											nodeIdArr.push(obj);
										}
									});
									_t.listData = queryOrgWithRole(_t.selectUser, nodeIdArr, 1);
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
			// 返回上一级
			goBack() {
				this.$router.go(-1);
			},
			// 新增提交
			addData(formName) {
				var _t = this;
				// 选择用户为空的情况
				if (_t.listData.length === 0) {
					_t.selectUserIsNull = true;
				} else {
					_t.selectUserIsNull = false;
				}
				// 菜单名称有为空的情况
				var isNullNum = 0;
				_t.languageList.forEach(function (item) {
					if (item.menuName == '') {
						item.flag = true;
						document.getElementById(item.id).style.borderColor = 'red';
					} else {
						isNullNum += 1;
					}
				});
				// 菜单图标判断
				var menuClass = null;
				var menuIcon = null;
				if (_t.addEdit.menuClass.trim() === '' && _t.addEdit.menuIcon.trim() === '') {
					menuClass = 'icon-gongnengquanxian';
					menuIcon = null;
				} else if (_t.addEdit.menuClass.trim() !== '' && _t.addEdit.menuIcon.trim() === '') {
					menuClass = _t.addEdit.menuClass.trim();
					menuIcon = null;
				} else if (_t.addEdit.menuClass.trim() === '' && _t.addEdit.menuIcon.trim() !== '') {
					menuClass = null;
					menuIcon = _t.addEdit.menuIcon.trim();
				} else {
					menuClass = _t.addEdit.menuClass.trim();
					menuIcon = null;
				}
				_t.$refs[formName].validate((valid) => {
					if (valid && _t.selectUserIsNull == false && isNullNum == _t.languageList.length) {
						// 角色集合
						var selectRoleList = new Array();
						var result = _t.result() === null ? [] : _t.result();
						result.forEach(function (item) {
							selectRoleList.push(item.nodeId);
						});
						// 跳转方式
						var menuTarget = '';
						if (_t.addEdit.jumpType === 'framename') {
							menuTarget = _t.addEdit.jumpText;
						} else {
							menuTarget = _t.addEdit.jumpType;
						}
						_t.$api.post('system/menu/', {
							systemMenu: {
								parentId: _t.addEdit.parentId,
								menuName: _t.languageList,
								menuTarget: menuTarget,
								menuClass: menuClass,
								menuIcon: menuIcon,
								menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
								orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
								menuLevel: _t.addEdit.menuLevel,
								enable: _t.addEdit.enable == 1 ? true : false,
								languageMark: localStorage.getItem('hy-language')
							},
							roleId: selectRoleList.join(',')
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.$router.push({
										name: 'functionMenuMaintenance'
									});
									// 新增语言之后刷新左侧导航的数据
									_t.$bus.emit('getMenu', true);
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 3004: // 操作失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									});
									break;
								default:
									break;
							}
						});
					}
				});
			},
			// 编辑提交
			editData(formName) {
				var _t = this;
				if (_t.listData.length === 0) {
					_t.selectUserIsNull = true;
				} else {
					_t.selectUserIsNull = false;
				}
				// 菜单名称有为空的情况
				var isNullNum = 0;
				_t.languageList.forEach(function (item) {
					if (item.menuName == '') {
						item.flag = true;
						document.getElementById(item.id).style.borderColor = 'red';
					} else {
						isNullNum += 1;
					}
				});
				// 菜单图标判断
				var menuClass = null;
				var menuIcon = null;
				if (_t.addEdit.menuClass.trim() === '' && _t.addEdit.menuIcon.trim() === '') {
					menuClass = 'icon-gongnengquanxian';
					menuIcon = null;
				} else if (_t.addEdit.menuClass.trim() !== '' && _t.addEdit.menuIcon.trim() === '') {
					menuClass = _t.addEdit.menuClass.trim();
					menuIcon = null;
				} else if (_t.addEdit.menuClass.trim() === '' && _t.addEdit.menuIcon.trim() !== '') {
					menuClass = null;
					menuIcon = _t.addEdit.menuIcon.trim();
				} else {
					menuClass = _t.addEdit.menuClass.trim();
					menuIcon = null;
				}
				_t.$refs[formName].validate((valid) => {
					if (valid && _t.selectUserIsNull == false && isNullNum == _t.languageList.length) {
						var selectUserList = new Array();
						// 角色集合
						var result = _t.result() === null ? [] : _t.result();
						result.forEach(function (item) {
							selectUserList.push(item.nodeId);
						});
						// 跳转方式
						var menuTarget = '';
						if (_t.addEdit.jumpType === 'framename') {
							menuTarget = _t.addEdit.jumpText;
						} else {
							menuTarget = _t.addEdit.jumpType;
						}
						_t.$api.put('system/menu/', {
							systemMenu: {
								id: _t.addEdit.id,
								parentId: _t.addEdit.parentId,
								menuName: _t.languageList,
								menuClass: menuClass,
								menuIcon: menuIcon,
								menuTarget: menuTarget,
								menuHref: _t.addEdit.menuHref == null ? null : _t.addEdit.menuHref.toString().trim(),
								orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.toString().trim(),
								menuLevel: _t.addEdit.menuLevel,
								enable: _t.addEdit.enable == 1 ? true : false,
								languageMark: localStorage.getItem('hy-language')
							},
							roleId: selectUserList.join(',')
						}, function (res) {
							switch (res.status) {
								case 200:
									_t.$router.push({
										name: 'functionMenuMaintenance'
									});
									// 编辑成功后刷新左侧导航的数据
									_t.$bus.emit('getMenu', true);
									break;
								case 1003: // 无操作权限
								case 1004: // 登录过期
								case 1005: // token过期
								case 1006: // token不通过
									_t.exclude(_t, res.message);
									break;
								case 3004: // 操作失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									});
									break;
								default:
									break;
							}
						});
					}
				});
			},
		},
		created() {
			var _t = this;
			_t.$store.commit('setLoading', true);
			// 判断是否新增
			_t.ifAdd = _t.$route.params.functionIsAdd ? _t.$route.params.functionIsAdd : localStorage.getItem('functionIsAdd');
			_t.addEdit.parentId = _t.$route.params.functionParentId ? _t.$route.params.functionParentId : localStorage.getItem('functionParentId');
			_t.addEdit.menuLevel = _t.$route.params.functionMenuLevel ? _t.$route.params.functionMenuLevel : localStorage.getItem('functionMenuLevel');
			// 获取父级菜单下拉列表
			_t.getMenuData();
			if (_t.ifAdd == true) {
				_t.ifAdd = true;
			} else {
				_t.ifAdd = false;
			}
		},
		beforeDestroy() {
			localStorage.removeItem('functionIsAdd');
			localStorage.removeItem('functionMenuId');
			localStorage.removeItem('functionMenuLevel');
			localStorage.removeItem('functionParentId');
		}
	}
</script>

<style scoped>
	.functionMenuDetail-title {
		height: 30px;
		line-height: 30px;
		padding-left: 10px;
		cursor: pointer;
	}
</style>
<style>
	.functionMenuDetail-dialog-selectUser .el-dialog {
		width: 700px;
		height: 450px;
	}

	.systemUser-box {
		margin-left: 20px;
	}
</style>
