<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.dataDictionary')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--左侧导航-->
		<div class="borderRightColorGray dataDictionaryMenuBox">
			<p class="dataDictionary-title">
				<a href="javascript:;" @click="clickNode">{{formItem.menuName}}</a>
			</p>
			<el-tree
				class="dataDictionary-tree"
				@node-click="getCurrentNode"
				:data="treeData"
				node-key="nodeId"
				ref="tree"
				:default-expanded-keys="defaultExpandedKeys"
				highlight-current
				:props="defaultProps"/>
		</div>
		<!--内容区域-->
		<div class="dataDictionaryMenuBox-formBox">
			<div class="padding20 borderBottom">
				<!--表单-->
				<el-form :model="formItem" inline>
					<el-form-item :label="$t('dataDictionary.businessCode') + '：'">
						<el-input class="width200" v-model="formItem.businessCode" @keyup.enter.native="getData()" clearable/>
					</el-form-item>
					<el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
						<el-input class="width200" v-model="formItem.dictionaryName" @keyup.enter.native="getData()" clearable/>
					</el-form-item>
					<el-form-item :label="$t('dataDictionary.status') + '：'">
						<el-select v-model="formItem.status" class="width200" clearable>
							<el-option v-for="item in statusList" :value="item.value" :key="item.key" :label="item.label"/>
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
				</div>
				<!--表格-->
				<el-table :data="tableData" ref="table" border stripe @selection-change="selectTableNum">
					<el-table-column type="selection" fixed header-align="left" align="left"/>
					<el-table-column width="60" :label="$t('public.index')" header-align="left" align="left">
						<template slot-scope="scope">
							<span>
                  				{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
               				</span>
						</template>
					</el-table-column>
					<el-table-column min-width="100px" prop="dictionaryType" :label="$t('dataDictionary.dictionaryType')"
													 header-align="left" align="left"/>
					<el-table-column min-width="140px" :label="$t('dataDictionary.dictionaryName')" header-align="left"
													 align="left">
						<template slot-scope="scope">
							<el-tooltip effect="dark" :content="scope.row.basedataName" placement="top-start">
								<span>{{scope.row.basedataName}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="dictionaryCode" :label="$t('dataDictionary.businessCode')" header-align="left"
													 align="left"/>
					<el-table-column prop="level" width="100px" :label="$t('dataDictionary.directoryLevel')" header-align="left"
													 align="left"/>
					<el-table-column width="140px" :label="$t('dataDictionary.sort')" header-align="left" align="left">
						<template slot-scope="scope">
							<el-button :disabled="scope.$index == 0" type="text" @click="moveUp(scope.row)">
								{{$t('public.moveUp')}}
							</el-button>
							<el-button :disabled="scope.$index == tableData.length - 1" type="text" @click="moveDown(scope.row)">
								{{$t('public.moveDown')}}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column width="100px" :label="$t('dataDictionary.status')" header-align="left" align="left">
						<template slot-scope="scope">
							<span v-if="scope.row.enable === true">{{$t('public.enable')}}</span>
							<span v-if="scope.row.enable === false" class="disabledStatusColor">{{$t('public.disable')}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="100px" prop="createBy" :label="$t('dataDictionary.createName')"
													 header-align="left" align="left"/>
					<el-table-column width="150px" :label="$t('dataDictionary.createTime')" header-align="left" align="left">
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
		</div>
		<!--新增编辑-->
		<el-dialog
			class="dataDictionary-dialog"
			append-to-body
			:title="$t('dataDictionary.createUpdateDictionary')"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form class="dataDictionary-dialog-form" :model="addEdit" inline label-width="150px" :rules="rules"
							 ref="roleName">
				<el-form-item :label="$t('dataDictionary.parentDictionary') + '：'">
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
							v-model="addEdit.nodeName"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							:disabled="ifAdd == false"
							slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item class="star" :label="$t('dataDictionary.dictionaryType') + '：'" prop="dictionaryType">
					<el-input v-model="addEdit.dictionaryType" class="width200" clearable/>
				</el-form-item>
				<!--控制业务编码-->
				<el-form-item class="star" :label="$t('dataDictionary.businessCode') + '：'" prop="dictionaryCode">
					<el-input :disabled="isDisabled" v-model="addEdit.dictionaryCode" clearable class="width200"/>
				</el-form-item>
				<br>
				<el-form-item
					:class="index === 0 ?'star':''"
					v-for="(item,index) in systemBasedataLanguageList"
					:key="index"
					:label="index == 0 ? $t('dataDictionary.dictionaryName') + '：':' '">
					<div class="positionRelative">
						<el-input
							:id="item.id"
							@input="menuNameInput(item)"
							v-model="item.basedataName"
							class="width200"
							clearable
							:placeholder="item.languageName"/>
						<span
							class="isNotNull"
							v-if="item.flag == true && item.basedataName.trim() == ''">
              {{$t('public.isNotNull')}}
            </span>
					</div>
				</el-form-item>
				<!--<br>-->
				<!--<el-form-item class="star" :label="$t('dataDictionary.directoryLevel') + '：'" prop="level">-->
				<!--<el-input v-model="addEdit.level" readonly class="width200" clearable/>-->
				<!--</el-form-item>-->
				<!--<el-form-item class="star" :label="$t('dataDictionary.orderIndex') + '：'" prop="orderMark">-->
				<!--<el-input v-model="addEdit.orderMark" class="width200" clearable />-->
				<!--</el-form-item>-->
				<el-form-item class="star" :label="$t('dataDictionary.statusAlert') + '：'" prop="enable">
					<el-radio-group v-model="addEdit.enable" class="width200">
						<el-radio :label="1">{{$t('public.enable')}}</el-radio>
						<el-radio :label="0">{{$t('public.disable')}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer">
        <el-button type="primary" class="alertBtn" v-if="ifAdd == true" @click="addData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" class="alertBtn" v-if="ifAdd == false" @click="editData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull} from "../../../../assets/js/validator";
	import {orgBreadcrumb} from "../../../../assets/js/recursive";

	export default {
		name: "dataDictionary",
		components: {Box},
		data() {
			return {
				// 查询表单
				formItem: {
					nodeId: '0',
					businessCode: null,
					dictionaryName: null,
					status: null,
					menuName: '', // 虚拟的一级菜单
				},
				// 数据默认字段
				defaultProps: {
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				// 新增 编辑表单
				addEdit: {
					parentId: null, //父级Id
					nodeName: '', // 父级名称
					id: '', //字典项ID
					level: 1, //目录级别
					dictionaryCode: '', //字典项编码
					dictionaryType: '', //字典项类型
					orderMark: '', //顺序
					enable: 1, //状态
				},
				// 全局按钮禁用启用
				disableBtn: {
					edit: true,
					enable: true,
					disable: true,
					more: true
				},
				dialogVisible: false, // 新增编辑弹出层
				isShowEditPopover: false, // 控制父级组织弹出层的显示隐藏
				ifAdd: true, // 新增编辑判断
				isDisabled:false,
				statusList: [
					{label: this.$t('public.enable'), value: 1},
					{label: this.$t('public.disable'), value: 0},
				],
				treeData: [], // 左侧导航数据
				tableData: [], // 表格数据
				checkListValue: [], // 表格选中之后数据接收
				checkListIds: [], // 表格选中的数据id集合
				checkRoleIds: [], // 删除数据传参
				systemBasedataLanguageList: [], // 字典名称集合
				defaultExpandedKeys: [], // 默认展开的树节点
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				rules: {
					dictionaryType: [
						{validator: isNotNull, trigger: ['blur']}
					],
					dictionaryCode: [
						{validator: isNotNull, trigger: ['blur']}
					],
					// level: [
					//   {validator: isNotNull, trigger: ['blur']}
					// ],
					// orderMark:[
					//   {validator: isNotNull, trigger: ['blur']}
					// ],
					enable: [
						{validator: isNotNull, trigger: ['blur']}
					]
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
			// 输入框字典名称校验
			menuNameInput(data) {
				if (data.basedataName.trim() === '') {
					data.flag = true;
					document.getElementById(data.id).style.borderColor = '#fb6041';
				} else {
					data.flag = false;
					document.getElementById(data.id).style.borderColor = '#DCDFE6';
				}
			},
			// 重置筛选表单
			resetData() {
				var _t = this;
				_t.formItem.businessCode = null;
				_t.formItem.dictionaryName = null;
				_t.formItem.status = null;
			},
			// 重置表单
			resetFormData() {
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = false;
				_t.addEdit.parentId = '';
				_t.addEdit.nodeName = '';
				_t.addEdit.id = '';
				_t.addEdit.level = 1;
				_t.addEdit.dictionaryCode = '';
				_t.addEdit.dictionaryType = '';
				_t.addEdit.orderMark = '';
				_t.addEdit.enable = 1;
				_t.$refs.table.clearSelection();
				_t.$refs.roleName.resetFields(); //移除校验结果并重置字段值
//      _t.$refs.roleName.clearValidate(); //移除校验结果
				_t.systemBasedataLanguageList.forEach((item) => {
					document.getElementById(item.id).style.borderColor = '#DCDFE6';
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
						break;
					case 1: // 单选
						_t.disableBtn.edit = false;
						_t.disableBtn.more = false;
						var checkListIds = new Array();
						data.forEach(function (item) {
							// 启用禁用判断
							if (item.enable === false) {
								_t.disableBtn.enable = false;
							} else if (item.enable === true) {
								_t.disableBtn.disable = false;
							}
							// 选中行的id集合
							checkListIds.push(item.id);
						});
						_t.checkListIds = checkListIds;
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.disableBtn.more = false;
						var disableFlag = 0, enableFlag = 0;
						var checkListIds = new Array();
						for (var i = 0; i < data.length; i++) {
							// 启用禁用判断
							if (data[i].enable === false) {
								disableFlag++;
							} else if (data[i].enable === true) {
								enableFlag++;
							}
							// 选中条数id集合
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
				_t.$confirm(_t.$t('dataDictionary.confirmEnableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/basedata/', {
						systemBasedata: {
							id: _t.checkListIds.join(','),
							enable: "true"
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('dataDictionary.confirmEnableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getMenuData(false);
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
					})
				}).catch(() => {
					return;
				});
			},
			// 禁用
			disableData() {
				var _t = this;
				_t.$confirm(_t.$t('dataDictionary.confirmDisableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/basedata/', {
						systemBasedata: {
							id: _t.checkListIds.join(','),
							enable: false
						}
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('dataDictionary.confirmDisableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getMenuData(false);
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
				_t.$confirm(_t.$t('dataDictionary.confirmDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('system/basedata/', {
						jsonString: JSON.stringify({
							basedataIds: _t.checkListIds.join(',')
						})
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('dataDictionary.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.getMenuData(false);
								});
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 400: // 删除失败
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								});
								break;
							default:
								break;
						}
					})
				}).catch(() => {
					return;
				});
			},
			// 获取选中的节点
			getCurrentNode(data) {
				var _t = this;
				_t.formItem.nodeId = data.nodeId;
				_t.addEdit.level = data.level + 1;
				_t.getData();
			},
			// 点击系统功能菜单节点
			clickNode() {
				var _t = this;
				_t.formItem.nodeId = '0';
				_t.addEdit.level = 1;
				_t.$refs.tree.setCurrentKey(null);
				_t.defaultExpandedKeys = [];
				_t.getData();
			},
			// 获取左侧树状菜单数据
			getMenuData(bool) {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/basedata/all', {
					jsonString: JSON.stringify({
						systemBasedata: {
							languageMark: localStorage.getItem('hy-language')
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							// 渲染树节点
							_t.treeData = res.data.treeNode.children === null ? [] : res.data.treeNode.children;
							if (bool) {
								// 渲染虚拟节点
								_t.formItem.nodeId = res.data.treeNode.nodeId;
								_t.formItem.menuName = res.data.treeNode.nodeName;
							} else {
								// 默认选中节点
								_t.$nextTick(function () {
									// 设置当前选中的节点 高亮
									_t.$refs.tree.setCurrentKey(_t.formItem.nodeId);
									_t.defaultExpandedKeys = [];
									_t.defaultExpandedKeys.push(_t.formItem.nodeId);
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
			},
			// 新增编辑弹出层所属字典下拉框
			clickNodeAlert(val) {
				var _t = this;
				_t.addEdit.parentId = val.nodeId;
				_t.addEdit.nodeName = val.nodeName;
				_t.addEdit.level = val.level + 1;
				_t.isShowEditPopover = false;
			},
			// 新增按钮
			addDataBtn() {
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = true;
				if (_t.ifAdd === true) {
					_t.isDisabled = false;
				}
				_t.getLanguageList();
				if (_t.formItem.nodeId !== '0') {
					_t.addEdit.parentId = _t.formItem.nodeId;
					_t.addEdit.nodeName = orgBreadcrumb(_t.treeData, _t.formItem.nodeId)[0];
				} else {
					_t.addEdit.level = 1;
				}
			},
			//新增表格数据
			addData(formName) {
				var _t = this;
				// 字典名称有为空的情况
				var isNullNum = 0;
				_t.systemBasedataLanguageList = _t.systemBasedataLanguageList === null ? [] : _t.systemBasedataLanguageList;
				_t.systemBasedataLanguageList.forEach(function (item) {
					if (item.basedataName.trim() === '') {
						item.flag = true;
						document.getElementById(item.id).style.borderColor = '#fb6041';
					} else {
						isNullNum += 1;
					}
				});
				_t.$refs[formName].validate((valid) => {
					if (valid && isNullNum === _t.systemBasedataLanguageList.length) {
						_t.$api.post('system/basedata/', {
							systemBasedata: {
								parentId: _t.addEdit.parentId == null ? null : (_t.addEdit.parentId == '' ? null : _t.addEdit.parentId),
								dictionaryCode: _t.addEdit.dictionaryCode == null ? null : _t.addEdit.dictionaryCode.trim(),
								dictionaryType: _t.addEdit.dictionaryType == null ? null : _t.addEdit.dictionaryType.trim(),
								orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark.trim(),
								level: _t.addEdit.level,
								enable: _t.addEdit.enable == 1 ? true : false,
								systemBasedataLanguageList: _t.systemBasedataLanguageList
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									//关闭编辑窗
									_t.dialogVisible = false;
									//重新加载数据
									_t.getMenuData(false);
									_t.getData();
									_t.resetFormData();
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
						});
					}
				});
			},
			// 获取表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/basedata/pagelist', {
					jsonString: JSON.stringify({
						systemBasedata: {
							parentId: _t.formItem.nodeId,
							basedataName: _t.formItem.dictionaryName == null ? null : (_t.formItem.dictionaryName.trim() == '' ? null : _t.formItem.dictionaryName.trim()),
							dictionaryCode: _t.formItem.businessCode == null ? null : (_t.formItem.businessCode.trim() == '' ? null : _t.formItem.businessCode.trim()),
							enable: _t.formItem.status == null ? null : (_t.formItem.status == 1 ? true : false),
							languageMark: localStorage.getItem('hy-language')
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.tableData = res.data.list === null ? [] : res.data.list;
							_t.options.total = res.data.count;
							_t.options.currentPage = res.data.currentPage;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.tableData = [];
							_t.options.tolal = 0;
							_t.options.currentPage = 1;
							break;
					}
				});
			},
			//点击编辑按钮查询接口
			editDataBtn() {
				var _t = this;
				_t.ifAdd = false;
				_t.dialogVisible = true;
				_t.addEdit.id = _t.checkListIds.join(',');
				// 超级管理员 业务编码不禁用 其余禁用
				var userId = localStorage.getItem('hy-user-id');
				if (userId !== 'user_superAdmin' && _t.ifAdd === false) {
					_t.isDisabled = true;
				} else {
					_t.isDisabled = false;
				}
				_t.getEditData(_t.addEdit.id);
			},
			// 根据选中的表格的数据id 查询最新的数据
			getEditData(val) {
				var _t = this;
				_t.$api.get('system/basedata/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							// 获取系统支持的语言
							_t.getEditLanguageList(res.data);
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
			// 获取当前系统支持的语言 动态渲染字典名称
			getEditLanguageList(resData) {
				var _t = this;
				_t.$api.get('system/language/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var systemBasedataLanguageList = res.data.list === null ? [] : res.data.list;
							systemBasedataLanguageList.forEach(function (item) {
								item.basedataName = '';
								item.languageMark = '';
								item.flag = false;
							});
							systemBasedataLanguageList.forEach((val) => {
								resData.systemBasedataLanguageList.forEach((data) => {
									if (val.languageCode === data.languageMark) {
										val.basedataName = data.basedataName;
										val.languageMark = val.languageCode;
									}
								});
							});
							_t.addEdit.id = resData.id;
							_t.addEdit.parentId = resData.parentId;
							_t.addEdit.dictionaryCode = resData.dictionaryCode;
							_t.addEdit.dictionaryType = resData.dictionaryType;
							_t.addEdit.orderMark = resData.orderMark;
							_t.addEdit.level = resData.level;
							_t.addEdit.enable == 1 ? true : false;
							_t.systemBasedataLanguageList = systemBasedataLanguageList;
							var parentID = resData.parentId == null ? '0' : resData.parentId;
							if (parentID !== '0') {
								_t.addEdit.nodeName = orgBreadcrumb(_t.treeData, parentID)[0];
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
			// 编辑提交
			editData(formName) {
				var _t = this;
				// 字典名称有为空的情况
				var isNullNum = 0;
				_t.systemBasedataLanguageList = _t.systemBasedataLanguageList === null ? [] : _t.systemBasedataLanguageList;
				_t.systemBasedataLanguageList.forEach(function (item) {
					if (item.basedataName.trim() == '') {
						item.flag = true;
						document.getElementById(item.id).style.borderColor = '#fb6041';
					} else {
						isNullNum += 1;
					}
				});
				_t.$refs[formName].validate((valid) => {
					if (valid && isNullNum === _t.systemBasedataLanguageList.length) {
						_t.$api.put('system/basedata/', {
							systemBasedata: {
								id: _t.addEdit.id,
								parentId: _t.addEdit.parentId == null ? null : (_t.addEdit.parentId == '' ? null : _t.addEdit.parentId),
								dictionaryCode: _t.addEdit.dictionaryCode == null ? null : _t.addEdit.dictionaryCode.trim(),
								dictionaryType: _t.addEdit.dictionaryType == null ? null : _t.addEdit.dictionaryType.trim(),
								orderMark: _t.addEdit.orderMark == null ? null : _t.addEdit.orderMark,
								level: _t.addEdit.level,
								enable: _t.addEdit.enable == 1 ? true : false,
								systemBasedataLanguageList: _t.systemBasedataLanguageList
							}
						}, function (res) {
							switch (res.status) {
								case 200:
									//关闭编辑窗
									_t.dialogVisible = false;
									//重新加载数据
									_t.getMenuData(false);
									_t.getData();
									_t.resetFormData();
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
								case 2006:
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getData();
										_t.getMenuData(false);
										_t.resetFormData();
									});
									break;
								default:
									break;
							}
						});
					}
				});
			},
			// 获取当前系统支持的语言 动态渲染字典名称
			getLanguageList() {
				var _t = this;
				_t.$api.get('system/language/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var systemBasedataLanguageList = res.data.list === null ? [] : res.data.list;
							systemBasedataLanguageList.forEach(function (item) {
								item.basedataName = '';
								item.languageMark = item.languageCode;
								item.flag = false;
							});
							_t.systemBasedataLanguageList = systemBasedataLanguageList;
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
				_t.$api.put('system/basedata/order', {
					ids: dataIdArr.join(',')
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.getMenuData(false);
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
				_t.$api.put('system/basedata/order', {
					ids: dataIdArr.join(',')
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.getMenuData(false);
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
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getMenuData(true);
			this.getData();
		}
	}</script>

<style scoped>
	.dataDictionary-title {
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		font-weight: bold;
		padding-left: 20px;
		width: 176px;
	}

	.dataDictionary-title a {
		line-height: 40px;
		display: inline-block;
	}
</style>
<style>
	.dataDictionaryMenuBox {
		position: absolute;
		top: 50px;
		left: 0;
		bottom: 0;
		width: 190px;
		overflow: auto;
	}

	.dataDictionaryMenuBox-formBox {
		position: absolute;
		top: 50px;
		left: 190px;
		right: 0;
		bottom: 0;
		overflow: auto;
	}

	.dataDictionary-dialog .el-dialog {
		width: 600px;
		height: 446px;
	}

	.dataDictionary-dialog-form .el-form-item {
		margin-bottom: 20px;
		margin-right: 0;
	}
</style>
