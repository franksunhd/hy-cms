<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.userManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.roleMaintenance')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20 borderBottom">
			<!--表单-->
			<el-form inline v-model="formItem">
				<el-form-item :label="$t('roleMaintenance.roleName') + '：'">
					<el-input v-model="formItem.roleName" class="width200" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('roleMaintenance.roleDate') + '：'">
					<el-date-picker
						v-model="formItem.dateTime"
						type="daterange"
						:range-separator="$t('public.to')"
						:start-placeholder="$t('public.startTime')"
						:end-placeholder="$t('public.endTime')"
						:placeholder="$t('public.selectDate')"/>
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
				<el-button type="warning" class="queryBtn" @click="addRoleDataBtn">
					<span class="iconfont fs14">&#xe689;</span> {{$t('public.add')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.edit" @click="editRoleDatBtn">
					<span class="iconfont fs14">&#xe641;</span> {{$t('public.edit')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
					<span class="iconfont fs14">&#xe645;</span> {{$t('public.enable')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
					<span class="iconfont fs14">&#xe646;</span> {{$t('public.disable')}}
				</el-button>
				<el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
					<span class="iconfont fs14">&#xe647;</span> {{$t('public.delete')}}
				</el-button>
				<el-button :disabled="disableBtn.one" @click="authorizationData">
					<span class="iconfont fs14">&#xe652;</span> {{$t('roleMaintenance.userAuthorization')}}
				</el-button>
				<el-button :disabled="disableBtn.one" @click="functionData">
					<span class="iconfont fs14">&#xe658;</span> {{$t('roleMaintenance.functionLimit')}}
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="infoData">
					<span class="iconfont fs14">&#xe654;</span> {{$t('roleMaintenance.dataLimit')}}
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="infoKvm">
					<span class="iconfont fs14">&#xe654;</span> {{$t('roleMaintenance.kvmLimit')}}
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="businessLimitBtn">
					<span class="iconfont fs14">&#xe654;</span> {{$t('roleMaintenance.businessLimit')}}
				</el-button>
			</div>
			<!--表格-->
			<el-table :data="tableData" ref="table" border stripe @selection-change="selectTableNum">
				<el-table-column type="selection" fixed header-align="left" align="left"/>
				<el-table-column prop="roleName" :label="$t('roleMaintenance.roleName')" header-align="left" align="left"/>
				<!-- 所属组织
				<el-table-column :label="$t('roleMaintenance.organization')" header-align="left" align="left">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="scope.row.organizationName" placement="left-start">
							<span>{{scope.row.organizationName}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				-->
				<el-table-column prop="userCount" :label="$t('roleMaintenance.userNum')" header-align="left" align="left"/>
				<el-table-column :label="$t('roleMaintenance.status')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.enable === true">{{$t('public.enable')}}</span>
						<span v-if="scope.row.enable === false" class="disabledStatusColor">{{$t('public.disable')}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createByUser" :label="$t('roleMaintenance.createName')" header-align="left"
												 align="left"/>
				<el-table-column :label="$t('roleMaintenance.createTime')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="lastModifyByUser" :label="$t('roleMaintenance.updateName')" header-align="left"
												 align="left"/>
				<el-table-column :label="$t('roleMaintenance.updateTime')" width="200" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.lastModifyTime | dateFilter}}</span>
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
			class="roleMaintenance-dialog"
			:title="$t('roleMaintenance.addUpdateRole')"
			append-to-body
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="addEdit" label-width="96px" :rules="rules" ref="ruleForm">
				<!-- 所属组织
				<el-form-item class="star" :label="$t('roleMaintenance.organization') +'：'" prop="organization">
					<el-popover trigger="click" placement="bottom-start" v-model="isShowEditPopover" ref="popover">
						<el-tree :data="organizationList" highlight-current :expand-on-click-node="false"
										 @node-click="clickNodeAlert" :props="defaultProps"/>
						<el-input v-model="addEdit.organization" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly
											slot="reference"/>
					</el-popover>
				</el-form-item>
				-->
				<el-form-item class="star" :label="$t('roleMaintenance.roleName') +'：'" prop="roleName">
					<el-input v-model="addEdit.roleName" class="width200" clearable/>
				</el-form-item>
				<el-form-item class="star" :label="$t('roleMaintenance.isEnable') +'：'" prop="status">
					<el-radio-group v-model="addEdit.status" class="width200">
						<el-radio :label="1">{{$t('public.enable')}}</el-radio>
						<el-radio :label="0">{{$t('public.disable')}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="$t('roleMaintenance.organizationDes') +'：'">
					<el-input style="width: 400px" type="textarea" :autosize="{ minRows: 3 }" v-model="addEdit.description"/>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button class="alertBtn" type="primary" v-if="ifAdd === true" @click="addRoleData('ruleForm')">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" type="primary" v-if="ifAdd === false" @click="editRoleData('ruleForm')">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
			</span>
		</el-dialog>
		<!--用户授权-->
		<el-dialog
			class="role-setUserName-dialog"
			append-to-body
			:title="$t('roleMaintenance.setUserName')"
			:visible.sync="outerVisible"
			:before-close="resetUserDataForm"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<!--
			<el-form label-width="150px">
				<el-form-item :label="$t('roleMaintenance.roleOrganization') + '：'">
					<template v-for="(item,index) in organizationName">
						<span>{{item}}</span>
						<i v-if="index !== organizationName.length - 1" class="el-icon-arrow-right"></i>
					</template>
				</el-form-item>
				<el-form-item :label="$t('roleMaintenance.pleaseSelectUser') + '：'">
					<el-tag
						v-for="(tag,index) in tags"
						:key="index"
						closable
						:disable-transitions="true"
						style="margin-right: 10px;margin-bottom: 10px;"
						@close="handleClose(tag)">
						{{tag.displayName}}
					</el-tag>
				</el-form-item>
			</el-form>
			<div style="height: 15px;border-top: 1px solid #e0e0e0;"></div>
			-->
			<el-form inline :model="userLimit">
				<el-form-item :label="$t('roleMaintenance.organization') +'：'">
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
							v-model="userLimit.organization"
							class="width200"
							suffix-icon="el-icon-arrow-down"
							readonly
							slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item :label="$t('roleMaintenance.username') +'：'">
					<el-input v-model="userLimit.username"/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="queryBtn" @click="selectRole">{{$t('public.query')}}</el-button>
					<el-button class="queryBtn" @click="resetUserLimit">{{$t('public.reset')}}</el-button>
				</el-form-item>
			</el-form>
			<el-table ref="tableUser" :data="innerTableData" :row-key="getRowKeys" border stripe @select="selectHandle"
								@select-all="selectHandleAll">
				<el-table-column :reserve-selection="true" type="selection" fixed header-align="left" align="left"/>
				<el-table-column prop="displayName" :label="$t('public.name')" header-align="left" align="left"/>
				<el-table-column prop="username" :label="$t('roleMaintenance.account')" header-align="left" align="left"/>
				<el-table-column :label="$t('roleMaintenance.registerDate')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<pages
				:total='innerOptions.total'
				:currentPage='innerOptions.currentPage'
				:pageSize='innerOptions.pageSize'
				@handleSizeChangeSub="innerOptionsHandleSizeChange"
				@handleCurrentChangeSub="innerOptionsHandleCurrentChange"/>
			<div slot="footer">
				<el-button class="alertBtn" type="primary" @click="userDataForm">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetUserDataForm">{{$t('public.close')}}</el-button>
			</div>
		</el-dialog>
		<!--功能权限-->
		<el-dialog
			append-to-body
			class="role-setRoleLimit-dialog"
			:title="$t('roleMaintenance.roleLimit')"
			:visible.sync="dialogVisibleFunction"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form>
				<!--				:default-checked-keys="defaultCheckedMenuKeys"-->
				<el-form-item>
					<el-tree
						:data="selectArr"
						node-key="nodeId"
						show-checkbox
						ref="tree"

						@check-change="currentChangeMenuTree"
						:props="menuProps"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="clearfix">
				<div class="fl">
					<el-checkbox
						@change="changeMenuTree(allCheckedMenu)"
						class="allCheckedMenu"
						v-model="allCheckedMenu">{{$t('public.allChecked')}}
					</el-checkbox>
				</div>
				<el-button class="alertBtn" type="primary" @click="commitMenuData">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="dialogVisibleFunction = false;">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--数据权限-->
		<el-dialog
			class="role-setDateLimit-dialog"
			append-to-body
			:title="$t('roleMaintenance.setDateLimit')"
			:visible.sync="dialogVisibleData"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="resourceForm">
				<el-form-item :label="$t('roleMaintenance.setDateLimit') + '：'">
					<el-radio-group v-model="resourceForm.status">
						<el-radio :label="1" border>{{$t('roleMaintenance.resourceView')}}</el-radio>
						<!--						<el-radio :label="2" border>{{$t('roleMaintenance.businessView')}}</el-radio>-->
						<!--						<el-radio :label="3" border>{{$t('roleMaintenance.roomView')}}</el-radio>-->
					</el-radio-group>
				</el-form-item>
				<div class="role-setDateLimit-dialog-line">
					<div class="line"></div>
				</div>
				<el-form-item style="margin-bottom: 10px;">
					<el-input v-model="filterText" class="width200 role-input-search" :placeholder="$t('roleMaintenance.tip')"/>
				</el-form-item>
				<el-form-item>
					<el-checkbox
						class="role-setDateLimit-dialog-checkout"
						v-model="allcheckedData"
						@change="checkedAllData(allcheckedData)">
						{{$t('public.allChecked')}}
					</el-checkbox>
					<el-tree
						id="dataLimit-box"
						node-key="nodeId"
						:data="dataInfoResourceTree"
						:props="dataInfoTreeProps"
						show-checkbox
						:default-expanded-keys="['tree_other']"
						@check-change="currentChangeTree"
						:filter-node-method="filterNode"
						ref="vueTree">
						<div slot-scope="{node,data}" :class="data.orderNum == 2 ? 'treeBox activeColor' : 'treeBox'">
							<span v-if="data.orderNum === 2" class="iconfont">&#xe663;</span>
							<span>{{data.nodeName}}</span>
							<span v-if="data.orderNum === 2">({{data.ip}})</span>
						</div>
					</el-tree>
					<p class="iconfontError">
						<span>{{$t('roleMaintenance.selectedDevice')}}</span>
						<span>{{resourceForm.isSelectNum}}</span>
						<span>{{$t('roleMaintenance.stand')}}</span>
					</p>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button class="alertBtn" type="primary" @click="addDataLimit">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetDataLimit">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--KVM授权-->
		<el-dialog
			class="kvmPermissions-dialog"
			:title="$t('roleMaintenance.dialog.kvmPermissions.windowTitle')"
			append-to-body
			:visible.sync="dialogVisibleKvm"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form :model="kvmLimit" label-width="180px">
				<el-form-item class="star" :label="$t('roleMaintenance.dialog.kvmPermissions.formRoleName') +'：'">
					<el-input v-model="kvmLimit.roleName" class="width200" disabled/>
				</el-form-item>
				<el-form-item :label="$t('roleMaintenance.dialog.kvmPermissions.formKvmPermissions') +'：'">
					<div>
						<el-checkbox v-model="kvmLimit.RemoteConsole">
							{{$t('roleMaintenance.dialog.kvmPermissions.formRemoteConsole')}}
						</el-checkbox>
					</div>
					<div>
						<el-checkbox v-model="kvmLimit.PowerConsole">
							{{$t('roleMaintenance.dialog.kvmPermissions.formPowerConsole')}}
						</el-checkbox>
					</div>
					<div>
						<el-checkbox v-model="kvmLimit.WebOutOfBand">
							{{$t('roleMaintenance.dialog.kvmPermissions.formWebOutOfBand')}}
						</el-checkbox>
					</div>
					<div>
						<el-checkbox v-model="kvmLimit.RemoteTerminal">
							{{$t('roleMaintenance.dialog.kvmPermissions.formRemoteTerminal')}}
						</el-checkbox>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button class="alertBtn" type="primary" @click="saveKvmLimit">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetKvmLimit">{{$t('public.cancel')}}</el-button>
			</span>
		</el-dialog>
		<!--业务权限-->
		<el-dialog
			class="role-setBusiness-dialog"
			append-to-body
			:before-close="resetBusinessData"
			:title="$t('roleMaintenance.dialog.businessLimit.windowTitle')"
			:visible.sync="dialogVisibleData_Business"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-tree
				:data="businessLimitTree"
				node-key="nodeId"
				show-checkbox
				ref="businessLimitTree"
				:default-expanded-keys="defaultExpandedBusinessKeys"
				@check-change="checkChangeBusinessTree"
				:props="dataInfoTreeProps"/>
			<div slot="footer" class="clearfix">
				<div class="fl lineHeightBusiness">
					<el-checkbox
						@change="businessLimitAllChecked(allCheckedBusiness)"
						class="allCheckedMenu"
						v-model="allCheckedBusiness">{{$t('public.allChecked')}}
					</el-checkbox>
				</div>
				<el-button class="alertBtn" type="primary" @click="saveBusinessData">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="resetBusinessData">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull} from "../../../../assets/js/validator";
	import {dateFilter} from '../../../../assets/js/filters';
	import {returnIsNotData, getObjectById} from "../../../../assets/js/recursive";

	export default {
		name: "role-maintenance",
		components: {Box},
		data() {
			return {
				// 查询表单
				formItem: {
					roleName: null,
					dateTime: null,
					username: null
				},
				// 新增编辑表单
				addEdit: {
					id: '',
					organization: '',
					roleName: '',
					organizationId: '',
					status: 1,
					description: ''
				},
				// 用户授权表单
				userLimit: {
					organization: this.$t('public.all'), // 所属组织名
					organizationId: null, // 所属组织id
					username: '', // 姓名
				},
				// 数据权限
				resourceForm: {
					status: 1,
					isSelectNum: 0
				},
				// Kvm授权表单
				kvmLimit: {
					id: '',
					roleName: '',
					RemoteConsole: false,
					PowerConsole: true,
					WebOutOfBand: true,
					RemoteTerminal: false
				},
				filterText: '', // 数据权限前端过滤
				// 全局按钮 是否禁用
				disableBtn: {
					edit: true,
					enable: true,
					disable: true,
					more: true,
					one: true,
				},
				// 判断视图下全选按钮 是否选中
				checked: false,
				// 新增编辑弹出层
				dialogVisible: false,
				// 用户授权外层
				outerVisible: false,
				// 用户授权内层
				innerVisible: false,
				// 功能权限
				dialogVisibleFunction: false,
				// 数据权限
				dialogVisibleData: false,
				// KVM权限
				dialogVisibleKvm: false,
				// 业务权限 弹出层
				dialogVisibleData_Business: false,
				// 所属组织下拉框
				isShowEditPopover: false,
				// 是否新增
				ifAdd: true,
				// 是否首次勾选用户授权
				tagsLength: false,
				// 是否提交功能权限
				selectMenuMark: false,
				// 功能菜单权限全选
				allCheckedMenu: false,
				// 数据权限全选
				allcheckedData: false,
				// 业务权限全选
				allCheckedBusiness: false,
				// 表格数据
				tableData: [],
				// 内层表格数据
				innerTableData: [],
				// 组织结构名
				organizationName: [],
				menuExpanded: [], // 功能权限
				defaultCheckedMenuKeys: [], // 默认勾选的功能权限
				businessLimitTree: [],// 业务权限树
				defaultExpandedBusinessKeys: [], // 业务权限树默认展开节点
				dataInfoResourceTree: [], // 资源视图树
				deviceListArr: [], // 资源视图全选数据集合
				// 外层分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				// 内层分页
				innerOptions: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				// 标签
				tags: [],
				// 数据默认字段
				defaultProps: {
					parent: 'parentId', // 父级唯一标识
					value: 'id', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				menuProps: {
					label: 'nodeName',
					children: 'children'
				},
				dataInfoTreeProps: {
					label: 'nodeName',
					children: 'children'
				},
				// 所属组织列表
				organizationList: [],
				checkListIds: [], // 选中表格的数据id集合
				checkListOrg: [], // 选中表格的数据组织id集合
				selectArr: [], // 功能菜单集合
				cacheMenuList: [], // 缓存没有勾选的菜单集合 id
				editDataList: {}, // 编辑选中的集合
				rules: {
					organization: [
						{validator: isNotNull, trigger: ['blur', 'change']}
					],
					roleName: [
						{validator: isNotNull, trigger: ['blur']}
					],
					status: [
						{validator: isNotNull, trigger: ['blur']}
					],
					description: [
						{validator: isNotNull, trigger: ['blur']}
					],
					tags: [
						{validator: isNotNull, trigger: ['blur']}
					]
				},
			}
		},
		// 监听 前端过滤树
		watch: {
			filterText(val) {
				this.$refs.vueTree.filter(val);
			}
		},
		methods: {
			/**
			 * 功能权限
			 */
			// 点击功能权限按钮获取
			functionData() {
				var _t = this;
				_t.dialogVisibleFunction = true;
				_t.getFunctionDataByRoleId(_t.checkListIds.join(','))
			},
			// 获取已授权的功能权限菜单
			getFunctionDataByRoleId(val) {
				var _t = this;
				_t.$api.get('system/menu/getImpowerMenuById', {
					jsonString: JSON.stringify({
						systemRole: {
							id: val
						},
						languageMark: localStorage.getItem('hy-language')
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								// 本用户具有的角色权限
								if (res.data.menuListjsonString && res.data.menuListjsonString !== null) {
									var menuListData = JSON.parse(res.data.menuListjsonString);
									if (menuListData.children && menuListData.children !== null) {
										// 赋值渲染树形展示
										_t.selectArr = menuListData.children;
										// 勾选已授权的菜单
										if (res.data.menuIdList && res.data.menuIdList !== null) {
											// 页面渲染完毕利用树节点判断树上有没有本节点
											// _t.defaultCheckedMenuKeys = menuIdList;

											_t.$nextTick(function () {
												var menuIdList = res.data.menuIdList;
												_t.$refs.tree.setCheckedKeys(menuIdList);
												var canNotSelectMenuList = new Array(); // 找不到对应的菜单id集合
												menuIdList.forEach((item) => {
													var isSelectMenu = _t.$refs.tree.getNode(item);
													if (isSelectMenu === null) {
														canNotSelectMenuList.push(item);
													}
												});
												// 判断是否全选 获取选中的节点数组
												var firstArr = _t.$refs.tree.getCheckedKeys();
												var number = 0; // 计数
												firstArr.forEach((val) => {
													_t.selectArr.forEach((t) => {
														if (val === t.nodeId) {
															number += 1; // 第一层选中计数加1
														}
													});
												});
												// 计数的值和树节点上第一级的数量一样 全选勾选
												if (number === _t.selectArr.length) {
													_t.allCheckedMenu = true;
												} else {
													// 取消勾选
													_t.allCheckedMenu = false;
												}
												_t.cacheMenuList = canNotSelectMenuList; // 缓存没有勾选的菜单集合
											});
										}
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
							break;
					}
				});
			},
			// 功能权限菜单改变的时候
			currentChangeMenuTree() {
				var _t = this;
				var firstArr = _t.$refs.tree.getCheckedKeys();
				var number = 0; // 计数
				firstArr.forEach((val) => {
					_t.selectArr.forEach((t) => {
						if (val === t.nodeId) {
							number += 1; // 第一层选中计数加1
						}
					});
				});
				// 计数的值和树节点上第一级的数量一样 全选勾选
				if (number === _t.selectArr.length) {
					_t.allCheckedMenu = true;
				} else {
					// 取消勾选
					_t.allCheckedMenu = false;
				}
			},
			// 功能菜单权限全选功能
			changeMenuTree(val) {
				var _t = this;
				if (val) {
					// 全选
					_t.$refs.tree.setCheckedNodes(_t.selectArr);
				} else {
					// 取消全选
					_t.$refs.tree.setCheckedKeys([]);
				}
			},
			// 提交授权菜单
			commitMenuData() {
				var _t = this;
				var selectMenuList = new Array();
				var getCheckedArr = _t.$refs.tree.getCheckedKeys();
				var getHalfCheckedArr = _t.$refs.tree.getHalfCheckedKeys();
				getCheckedArr.forEach((item) => {
					var obj = new Object();
					obj.menuId = item;
					obj.isChecked = true;
					selectMenuList.push(obj);
				});
				getHalfCheckedArr.forEach((item) => {
					var obj = new Object();
					obj.menuId = item;
					obj.isChecked = false;
					selectMenuList.push(obj);
				});
				// 补充过滤出来没有选中的数据
				if (_t.cacheMenuList.length !== 0) {
					_t.cacheMenuList.forEach((item) => {
						var obj = new Object();
						obj.menuId = item;
						obj.isChecked = true;
						selectMenuList.push(obj);
					});
				}
				_t.$api.post('system/role/impowerRoleByMenu', {
					systemRole: {
						id: _t.checkListIds.join(',')
					},
					menuList: selectMenuList
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.dialogVisibleFunction = false;
							_t.$refs.tree.setCheckedKeys([]);
							_t.$bus.emit('getMenuData', true);
							_t.$refs.table.clearSelection();
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
			/**
			 * 业务权限
			 */
			// 业务权限全选和取消全选
			businessLimitAllChecked(val) {
				var _t = this;
				if (val) {
					// 全选
					_t.$refs.businessLimitTree.setCheckedNodes(_t.businessLimitTree);
				} else {
					// 取消全选
					_t.$refs.businessLimitTree.setCheckedKeys([]);
				}
			},
			// 改变业务权限树单个复选框触发
			checkChangeBusinessTree() {
				var _t = this;
				var firstArr = _t.$refs.businessLimitTree.getCheckedKeys();
				var number = 0; // 计数
				firstArr.forEach((val) => {
					_t.businessLimitTree.forEach((t) => {
						if (val === t.nodeId) {
							number += 1; // 第一层选中计数加1
						}
					});
				});
				// 计数的值和树节点上第一级的数量一样 全选勾选
				if (number === _t.businessLimitTree.length) {
					_t.allCheckedBusiness = true;
				} else {
					// 取消勾选
					_t.allCheckedBusiness = false;
				}
			},
			// 点击业务权限按钮
			businessLimitBtn() {
				var _t = this;
				_t.dialogVisibleData_Business = true;
				_t.getBusinessTreeData();
			},
			// 获取业务权限树目录
			getBusinessTreeData() {
				var _t = this;
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								_t.businessLimitTree = res.data.children;
							} else {
								_t.businessLimitTree = [];
							}
							_t.getRoleLimitBusiness(_t.editDataList.id);
							break;
						default:
							break;
					}
				});
			},
			// 获取角色关联的业务权限
			getRoleLimitBusiness(val) {
				var _t = this;
				_t.$api.get('system/roleBusiness/all', {
					jsonString: JSON.stringify({
						onlyBusinessIdList: true,
						systemRoleBusiness: {
							roleId: val
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data && res.data !== null) {
								if (res.data.list && res.data.list !== null) {
									var listData = res.data.list;
									_t.$nextTick(function () {
										_t.$refs.businessLimitTree.setCheckedKeys(listData);
										_t.defaultExpandedBusinessKeys = listData;
									});
								}
							}
							break;
						default:
							break;
					}
				});
			},
			// 保存业务权限
			saveBusinessData() {
				var _t = this;
				var selectMenuList = new Array(); // 全部需要传的数据
				var getCheckedArr = _t.$refs.businessLimitTree.getCheckedKeys(); // 全选节点
				var getHalfCheckedArr = _t.$refs.businessLimitTree.getHalfCheckedKeys(); // 半选节点
				// 给全选节点添加选中状态
				getCheckedArr.forEach((item) => {
					var obj = new Object();
					obj.businessId = item;
					obj.isChecked = true;
					selectMenuList.push(obj);
				});
				// 给半选中节点添加未选中状态
				getHalfCheckedArr.forEach((item) => {
					var obj = new Object();
					obj.businessId = item;
					obj.isChecked = false;
					selectMenuList.push(obj);
				});
				_t.$api.post('system/roleBusiness/', {
					roleId: _t.editDataList.id,
					systemRoleBusinessList: selectMenuList
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.$alert(_t.$t('roleMaintenance.confirmSaveSuccessTip'), _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm'),
								confirmButtonClass: 'alertBtn'
							}).then(() => {
								//重新加载列表数据
								_t.getData();
								_t.resetBusinessData();
							}).catch(() => {
								//重新加载列表数据
								_t.getData();
								_t.resetBusinessData();
							});
							break;
						case 2006: // 修改失败
							_t.$message.error({
								message: res.message,
								duration: 3000
							});
							break;
						default:
							//重新加载列表数据
							_t.getData();
							_t.resetBusinessData();
							break;
					}
				});
			},
			// 重置业务权限
			resetBusinessData() {
				var _t = this;
				_t.dialogVisibleData_Business = false;
				_t.$refs.businessLimitTree.setCheckedKeys([]);
				_t.businessLimitTree = [];
				_t.defaultExpandedBusinessKeys = [];
				_t.cacheMenuList = [];
				_t.allCheckedBusiness = false;
			},
			// 重置用户授权
			resetUserLimit() {
				var _t = this;
				_t.userLimit.organization = _t.$t('public.all'); // 所属组织名
				_t.userLimit.organizationId = null; // 所属组织id
				_t.userLimit.username = ''; // 姓名
			},
			// 保存数据权限
			addDataLimit() {
				var _t = this;
				var deviceIdArrList = _t.$refs.vueTree.getCheckedNodes();
				var deviceIdArr = new Array();
				deviceIdArrList.forEach((item) => {
					if (item.orderNum === 2) {
						deviceIdArr.push(item.nodeId);
					}
				});
				_t.$api.post('system/systemRoleDevice/', {
					systemRoleDevice: {
						roleId: _t.checkListIds.join(','),
						deviceId: deviceIdArr.join(',') === '' ? null : deviceIdArr.join(',')
					}
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.$alert(_t.$t('roleMaintenance.confirmSaveSuccessTip'), _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm'),
								confirmButtonClass: 'alertBtn'
							}).then(() => {
								_t.resetDataLimit();
							});
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
								_t.resetDataLimit();
							});
							break;
						default:
							break;
					}
					_t.$refs.table.clearSelection();
					_t.disableBtn.enable = true;
					_t.disableBtn.disabled = true;
					_t.disableBtn.edit = true;
					_t.disableBtn.more = true;
				});
			},
			// 重置数据权限表单
			resetDataLimit() {
				var _t = this;
				_t.resourceForm.status = 1;
				_t.resourceForm.isSelectNum = 0;
				_t.filterText = '';
				_t.$refs.vueTree.setCheckedKeys([]);
				_t.dialogVisibleData = false;
				_t.allcheckedData = false;
				_t.dialogVisibleKvm = false;
			},
			// 树节点状态改变的时候 判断是否勾选全选按钮
			currentChangeTree() {
				var _t = this;
				var selectTreeList = _t.$refs.vueTree.getCheckedNodes();
				var selectTreeArr = new Array();
				var selectFirstLevel = new Array();
				selectTreeList.forEach((t) => {
					if (t.orderNum === 2) {
						selectTreeArr.push(t.nodeId);
					}
					// 获取选中目录集合
					if (t.orderNum === 1) {
						selectFirstLevel.push(t.nodeId);
					}
				});
				// 给选中多少台设备赋值
				_t.resourceForm.isSelectNum = selectTreeArr.length;
				// 判断树节点是否全部勾选 一级的节点全部选中 代表全选
				var firstLevelNum = 0;
				if (_t.dataInfoResourceTree !== null) {
					_t.dataInfoResourceTree.forEach((item) => {
						selectFirstLevel.forEach((val) => {
							if (item.nodeId === val) {
								firstLevelNum++;
							}
						})
					});
				}
				// 判断 一级节点个数不为0 并且
				if (firstLevelNum !== 0 && firstLevelNum === _t.dataInfoResourceTree.length) {
					_t.allcheckedData = true;
				} else {
					_t.allcheckedData = false;
				}
			},
			// 数据权限 全选
			checkedAllData() {
				var _t = this;
				if (_t.allcheckedData) {
					// 全选
					_t.$refs.vueTree.setCheckedNodes(_t.dataInfoResourceTree);
				} else {
					// 取消全选
					_t.$refs.vueTree.setCheckedKeys([]);
				}
			},
			// 过滤树
			filterNode(value, data) {
				if (!value) return true;
				return data.nodeName.indexOf(value) !== -1;
			},
			// 数据权限按钮
			infoData() {
				var _t = this;
				_t.dialogVisibleData = true;
				_t.getInfoDataTree();
			},
			/**
			 * KVM权限
			 */
			// KVM权限按钮
			infoKvm() {
				var _t = this;
				_t.dialogVisibleKvm = true;
				_t.kvmLimit.id = _t.editDataList.id;
				_t.$api.get('system/role/' + _t.kvmLimit.id, {}, function (res) {
					switch (res.status) {
						case 200:
							if (null != res.data && undefined != res.data) {
								_t.kvmLimit.id = res.data.id;
								_t.kvmLimit.roleName = res.data.roleName;
								var kvmPermissions = res.data.kvmPermissions;
								if (null != kvmPermissions && undefined != kvmPermissions) {
									var kvmPermissionsJson = JSON.parse(kvmPermissions);
									_t.kvmLimit.RemoteConsole = kvmPermissionsJson.RemoteConsole;
									_t.kvmLimit.PowerConsole = kvmPermissionsJson.PowerConsole;
									_t.kvmLimit.WebOutOfBand = kvmPermissionsJson.WebOutOfBand;
									_t.kvmLimit.RemoteTerminal = kvmPermissionsJson.RemoteTerminal;
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
			// 保存Kvm权限
			saveKvmLimit() {
				var _t = this;
				_t.$api.put('system/role/updateKvmPermissions', {
					roleId: _t.kvmLimit.id,
					kvmPermissions: {
						RemoteConsole: _t.kvmLimit.RemoteConsole,
						PowerConsole: _t.kvmLimit.PowerConsole,
						WebOutOfBand: _t.kvmLimit.WebOutOfBand,
						RemoteTerminal: _t.kvmLimit.RemoteTerminal
					}
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.$alert(_t.$t('roleMaintenance.confirmSaveSuccessTip'), _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm'),
								confirmButtonClass: 'alertBtn'
							}).then(() => {
								//重新加载列表数据
								_t.getData();
								_t.resetKvmLimit();
							});
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						case 2006: // 修改失败
							_t.$message.error({
								message: res.message,
								duration: 3000
							});
							break;
						default:
							break;
					}
					_t.$refs.table.clearSelection();
					_t.disableBtn.enable = true;
					_t.disableBtn.disabled = true;
					_t.disableBtn.edit = true;
					_t.disableBtn.more = true;
					_t.disableBtn.one = true;
				});
			},
			// 重置Kvm权限表单
			resetKvmLimit() {
				var _t = this;
				_t.kvmLimit.id = '';
				_t.kvmLimit.roleName = '';
				_t.kvmLimit.RemoteConsole = false;
				_t.kvmLimit.PowerConsole = false;
				_t.kvmLimit.WebOutOfBand = false;
				_t.kvmLimit.RemoteTerminal = false;
				//隐藏弹窗
				_t.dialogVisibleKvm = false;
			},
			// 获取数据权限 监测目录树
			getInfoDataTree() {
				var _t = this;
				_t.$api.get('asset/assetCatalog/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var dataInfoResourceTree = res.data.children;
							dataInfoResourceTree.unshift({
								nodeId: 'tree_other',
								orderNum: 1,
								nodeName: _t.$t('roleMaintenance.isNotDirectory'),
								children: []
							});
							_t.getDeviceTreeData(dataInfoResourceTree);
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
			// 获取设备列表
			getDeviceTreeData(tree) {
				var _t = this;
				_t.$api.get('asset/assetDevice/getDeviceList', {
					jsonString: JSON.stringify({
						assetDevice: {
							monitorStatus: 1
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var deviceList = res.data.list === null ? [] : res.data.list;
							var deviceListObject = new Object();
							deviceList.forEach((item) => {
								item.nodeId = item.id;
								item.parentId = item.catalogId;
								item.nodeName = item.deviceName;
								item.orderNum = 2;
								item.class = 1;
								if (item.children === undefined) {
									item.children = [];
								}
								// 未发现设备
								if (item.catalogId === null) {
									if (deviceListObject['tree_other'] !== undefined) {
										deviceListObject['tree_other'].push(item);
									} else {
										deviceListObject['tree_other'] = [];
										deviceListObject['tree_other'].push(item);
									}
								} else {
									// 已发现的设备
									if (deviceListObject[item.catalogId] !== undefined) {
										deviceListObject[item.catalogId].push(item);
									} else {
										deviceListObject[item.catalogId] = [];
										deviceListObject[item.catalogId].push(item);
									}
								}
							});
							// 将键值存到数组中 用于遍历
							var keyArr = new Array();
							for (var key in deviceListObject) {
								keyArr.push(key);
							}
							keyArr.forEach((item) => {
								var nodeList = getObjectById(tree, item, 'nodeId', 'children');
								if (nodeList[0] && nodeList[0].nodeId === item) {
									if (nodeList[0].children.length !== 0) {
										deviceListObject[item].forEach((data) => {
											nodeList[0].children.unshift(data);
										});
									} else {
										nodeList[0].children = deviceListObject[item];
									}
								}
							});
							var deviceListArr = new Array();
							deviceList.forEach((item) => {
								deviceListArr.push(item);
							});
							// 树节点拥有的全部设备节点id 用于全选
							_t.deviceListArr = deviceListArr;
							// 数据权限数据回显
							_t.getDataLimit(tree);
							_t.dataInfoResourceTree = tree;
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
			// 数据权限数据回显
			getDataLimit(treeData) {
				var _t = this;
				_t.$api.get('system/systemRoleDevice/resourceViewDataEcho', {
					jsonString: JSON.stringify({
						systemRoleDevice: {
							roleId: _t.checkListIds.join(',')
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.$refs.vueTree.setCheckedKeys(res.data.list);
							_t.resourceForm.isSelectNum = res.data.count;
							if (res.data.count === _t.deviceListArr.length && _t.deviceListArr.length !== 0) {
								_t.allcheckedData = true;
							} else {
								_t.allcheckedData = false;
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
			// 重置关闭用户授权表格
			resetUserDataForm() {
				var _t = this;
				_t.$refs.tableUser.clearSelection();
				_t.outerVisible = false;
				_t.tags = [];
				_t.tagsLength = false;
				_t.resetUserLimit();
			},
			// 重置筛选表单
			resetData() {
				var _t = this;
				_t.formItem.roleName = null;
				_t.formItem.dateTime = null;
				_t.getData();
			},
			// 重置表单
			resetFormData() {
				var _t = this;
				_t.ifAdd = true;
				_t.addEdit.id = '';
				_t.addEdit.organization = '';
				_t.addEdit.roleName = '';
				_t.addEdit.organizationId = '';
				_t.addEdit.status = 1;
				_t.addEdit.description = '';
				_t.dialogVisible = false;
				_t.$refs.table.clearSelection();
				_t.$refs.ruleForm.resetFields(); //移除校验结果并重置字段值
				// _t.$refs.ruleForm.clearValidate(); //移除校验结果
			},
			// 提交授权用户
			userDataForm() {
				var _t = this;
				if (_t.tags.length !== 0) {
					var userIds = new Array();
					_t.tags.forEach(function (item) {
						userIds.push(item.id);
					});
					_t.$api.post('system/role/impowerRoleByUser', {
						systemRole: {
							id: _t.checkListIds.join(',')
						},
						userId: userIds.join(',')
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.outerVisible = false;
								_t.tags = [];
								_t.getData();
								_t.resetUserDataForm();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							default:
								_t.outerVisible = false;
								_t.tags = [];
								_t.getData();
								_t.resetUserDataForm();
								break;
						}
					});
				}
			},
			// 对比两个数组 没有就添加
			hashPushData(newArr, oldArr, id) {
				var _t = this;
				var arr = newArr.concat(oldArr);
				var hash = []; //一定要在这里置空啊
				for (var i = 0; i < arr.length; i++) {
					for (var j = i + 1; j < arr.length; j++) {
						if (arr[i][id] === arr[j][id]) {
							arr[i].statusTags = true;
						}
					}
					hash.push(arr[i]);
				}
				return hash;
			},
			// 数组对象去重
			uniqArr(arr) {
				var result = [];
				var obj = {};
				for (var i = 0; i < arr.length; i++) {
					if (!obj[arr[i].id]) {
						result.push(arr[i]);
						obj[arr[i].id] = true;
					}
				}
				return result;
			},
			// 获取已授权的用户
			getAuthorizationData(val) {
				var _t = this;
				_t.$api.get('system/user/getImpowerRoleById', {
					jsonString: JSON.stringify({
						systemRole: {
							id: val
						}
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							var tags = new Array();
							var resData = res.data === null ? [] : res.data;
							resData.forEach(function (item) {
								var obj = new Object();
								obj.id = item.id;
								obj.displayName = item.displayName;
								tags.push(obj);
							});
							_t.tags = tags;
							_t.selectRole();
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
			// 选中用户授权当行时
			selectHandle(selection, row) {
				var _t = this;
				var tags = _t.tags.length === 0 ? [] : _t.tags;
				// 行已经选中
				if (row.statusTags) {
					// 取消选中
					row.statusTags = false;
					_t.tags.forEach((item, index) => {
						if (item.id === row.id) {
							_t.tags.splice(index, 1);
							_t.$refs.tableUser.toggleRowSelection(row, false);
						}
					});
				} else {
					// 行未选中 把行选中
					row.statusTags = true;
					_t.tags = _t.uniqArr(_t.hashPushData(selection, tags, 'id'));
					_t.$refs.tableUser.toggleRowSelection(row, row.statusTags);
				}
			},
			// 选中用户授权全部时
			selectHandleAll(selection) {
				var _t = this;
				var tags = _t.tags.length === 0 ? [] : _t.tags;
				if (selection.length !== 0) {
					// 添加
					selection.forEach((item) => {
						item.statusTags = true;
						_t.$refs.tableUser.toggleRowSelection(item, true);
						if (item.statusTags) {
							_t.tags = _t.uniqArr(_t.hashPushData(selection, tags, 'id'));
						}
					});
				} else {
					// 删除
					_t.innerTableData.forEach((item) => {
						item.statusTags = false;
					});
					_t.tags = returnIsNotData(_t.innerTableData, _t.tags, 'id');
				}
			},
			// 根据组织id查询用户列表
			selectRole() {
				var _t = this;
				_t.$api.get('/system/user/pagelist/', {
					jsonString: JSON.stringify({
						systemUser: {
							username: _t.userLimit.username == null ? null : _t.userLimit.username.trim(),
							organizationId: _t.userLimit.organizationId === null ? null : _t.userLimit.organizationId,
							languageMark: localStorage.getItem('hy-language')
						},
						currentPage: _t.innerOptions.currentPage,
						pageSize: _t.innerOptions.pageSize
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.$nextTick(() => {
								var innerTableData = res.data.list === null ? [] : res.data.list;
								innerTableData.forEach((val) => {
									val.statusTags = false;
								});
								_t.tags.forEach((item) => {
									innerTableData.forEach((data) => {
										if (item.id == data.id) {
											data.statusTags = true;
											_t.$refs.tableUser.toggleRowSelection(data, true);
										}
									});
								});
								_t.innerTableData = innerTableData;
							});
							_t.innerOptions.total = res.data.count;
							_t.innerOptions.currentPage = res.data.currentPage;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.innerTableData = [];
							_t.innerOptions.total = 0;
							_t.innerOptions.currentPage = 1;
							break;
					}
				});
			},
			// 获取行id
			getRowKeys(row) {
				return row.id;
			},
			// 查询表格数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/role/pagelist', {
					jsonString: JSON.stringify({
						systemRole: {
							roleName: _t.formItem.roleName == null ? null : _t.formItem.roleName.trim(),
							createTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[0].getTime()),
							lastModifyTime: _t.formItem.dateTime == null ? null : dateFilter(_t.formItem.dateTime[1].getTime()),
							languageMark: localStorage.getItem('hy-language')
						},
						currentPage: _t.options.currentPage,
						pageSize: _t.options.pageSize
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200: // 查询成功
							_t.tableData = res.data.list === null ? [] : res.data.list;
							_t.options.currentPage = res.data.currentPage;
							_t.options.total = res.data.count;
							_t.disableBtn.edit = true;
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
							_t.disableBtn.more = true;
							_t.disableBtn.one = true;
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
							_t.disableBtn.one = true;
							break;
					}
				});
			},
			// 启用
			enableData() {
				var _t = this;
				_t.$confirm(_t.$t('roleMaintenance.confirmEnableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/role/enableRole', {
						systemRole: {
							id: _t.checkListIds.join(','),
							enable: 1
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('roleMaintenance.confirmEnableSuccessTip'), _t.$t('public.resultTip'), {
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
				_t.$confirm(_t.$t('roleMaintenance.confirmDisableTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.put('system/role/enableRole', {
						systemRole: {
							enable: 0,
							id: _t.checkListIds.join(',')
						}
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('roleMaintenance.confirmDisableSuccessTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$refs.table.clearSelection();
								});
								break;
							case 3006: // 不能禁用本用户所属角色
								_t.$alert(_t.$t('roleMaintenance.confirmDisabledTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$refs.table.clearSelection();
								}).catch(()=>{
									_t.getData();
									_t.$refs.table.clearSelection();
								});
								break;
							default:
								break;
						}
					});
				}).catch(() => {
					return;
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
						_t.disableBtn.one = true;
						break;
					case 1: // 单选
						_t.disableBtn.edit = false;
						_t.disableBtn.more = false;
						_t.disableBtn.one = false;
						var checkListIds = new Array();
						var checkListOrg = new Array();
						data.forEach(function (item) {
							_t.editDataList = item;
							// 判断启用禁用
							if (item.enable === false) {
								_t.disableBtn.enable = false;
							} else if (item.enable === true) {
								_t.disableBtn.disable = false;
							}
							// 获取选中的 id
							checkListIds.push(item.id);
							checkListOrg.push(item.organizationId);
							if (item.id === "role_admin") {
								_t.disableBtn.edit = true;
								_t.disableBtn.more = true;
								_t.disableBtn.disable = true;
							}
						});
						_t.checkListIds = checkListIds;
						_t.checkListOrg = checkListOrg;
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.disableBtn.one = true;
						_t.disableBtn.more = false;
						_t.editDataList = {};
						var disableFlag = 0, enableFlag = 0;
						var checkListIds = new Array();
						var checkListOrg = new Array();
						var isHasAdmin = false;
						for (var i = 0; i < data.length; i++) {
							if (data[i].id === 'role_admin') {
								isHasAdmin = true;
							}
							// 根据选中条数中的状态值判断 启用禁用数量
							if (data[i].enable === false) {
								disableFlag++;
							} else if (data[i].enable === true) {
								enableFlag++;
							}
							// 获取选中的数据的id值
							checkListIds.push(data[i].id);
							checkListOrg.push(data[i].organizationId);
						}
						_t.checkListIds = checkListIds;
						_t.checkListOrg = checkListOrg;
						if (disableFlag > 0 && enableFlag > 0) {
							// 有禁用 有启用
							_t.disableBtn.enable = true;
							_t.disableBtn.disable = true;
							if (isHasAdmin === true) {
								_t.disableBtn.more = true;
							} else {
								_t.disableBtn.more = false;
							}
						} else if (disableFlag === 0 && enableFlag > 0) {
							// 只有启用
							_t.disableBtn.enable = true;
							if (isHasAdmin === true) {
								// 有admin
								_t.disableBtn.disable = true;
								_t.disableBtn.more = true;
							} else {
								_t.disableBtn.disable = false;
								_t.disableBtn.more = false;
							}
						} else if (disableFlag > 0 && enableFlag === 0) {
							// 只有禁用
							_t.disableBtn.enable = false;
							_t.disableBtn.disable = true;
						}
						break;
				}
			},
			// 外层 改变当前页码
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
			// 内层 改变当前页码
			innerOptionsHandleCurrentChange(val) {
				var _t = this;
				_t.innerOptions.currentPage = val;
				_t.selectRole();
			},
			// 改变每页显示条数
			innerOptionsHandleSizeChange(val) {
				var _t = this;
				_t.innerOptions.pageSize = val;
				_t.selectRole();
			},
			// 用户授权 数据回显
			authorizationData() {
				var _t = this;
				_t.outerVisible = true;
				// 查询 用户授权 表格信息
				_t.getAuthorizationData(_t.checkListIds.join(','));
				// 查询所属组织
				_t.getOrganization();
			},
			// 关闭标签
			handleClose(tag) {
				var _t = this;
				_t.tags.splice(_t.tags.indexOf(tag), 1);
				_t.innerTableData.forEach((item) => {
					if (item.id === tag.id) {
						item.status = false;
						_t.$refs.tableUser.toggleRowSelection(item, false);
					}
				});
			},
			// 点击所属组织节点
			clickNodeAlert(val) {
				var _t = this;
				_t.userLimit.organization = val.nodeName;
				_t.userLimit.organizationId = val.nodeId;
				_t.isShowEditPopover = false;
			},
			// 查询所属组织
			getOrganization() {
				var _t = this;
				_t.$api.get('system/organization/all', {}, function (res) {
					switch (res.status) {
						case 200:
							var organizationList = JSON.parse(res.data).children;
							var objAll = {
								nodeId: null,
								nodeName: _t.$t('public.all'),
								level: 1,
								orderNum: 1,
								parentNodeId: '0',
								children: []
							};
							organizationList.unshift(objAll);
							_t.organizationList = organizationList;
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
			/**
			 * 新增、编辑、删除角色
			 */
			// 新增角色按钮
			addRoleDataBtn() {
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = true;
			},
			// 新增角色
			addRoleData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.post('system/role/', {
							systemRole: {
								// organizationId: _t.addEdit.organizationId,
								roleName: _t.addEdit.roleName === null ? null : _t.addEdit.roleName.trim(),
								enable: _t.addEdit.status,
								description: _t.addEdit.description === null ? null : _t.addEdit.description.trim(),
								createBy: localStorage.getItem('hy-user-name'),
								languageMark: localStorage.getItem('hy-language')
							}
						}, function (res) {
							_t.dialogVisible = false;
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
								case 2005:
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getData();
										_t.resetFormData();
									});
									break;
								default:
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getData();
										_t.resetFormData();
									});
									break;
							}
						});
					}
				});
			},
			// 编辑角色按钮
			editRoleDatBtn() {
				var _t = this;
				// 新增编辑判断
				_t.ifAdd = false;
				_t.addEdit.id = _t.editDataList.id;
				_t.getEditRoleListById(_t.addEdit.id);
			},
			// 编辑时根据id查询数据
			getEditRoleListById(val) {
				var _t = this;
				_t.$api.get('system/role/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addEdit.roleName = res.data.roleName;
							_t.addEdit.organization = res.data.organizationName;
							_t.addEdit.organizationId = res.data.organizationId;
							_t.addEdit.status = res.data.enable == true ? 1 : 0;
							_t.addEdit.description = res.data.description;
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
			// 编辑角色
			editRoleData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.put('system/role/', {
							systemRole: {
								id: _t.addEdit.id,
								// organizationId: _t.addEdit.organizationId,
								roleName: _t.addEdit.roleName === null ? null : _t.addEdit.roleName.trim(),
								enable: _t.addEdit.status,
								description: _t.addEdit.description === null ? null : _t.addEdit.description.trim(),
								lastModified: localStorage.getItem('hy-user-name'),
								languageMark: localStorage.getItem('hy-language')
							}
						}, function (res) {
							_t.dialogVisible = false;
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
								case 2006:
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getData();
										_t.resetFormData();
									});
									break;
								default:
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.getData();
										_t.resetFormData();
									});
									break;
							}
						});
					}
				});
			},
			// 删除
			deleteData() {
				var _t = this;
				_t.$confirm(_t.$t('roleMaintenance.confirmDeleteTip'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					type: 'warning',
					confirmButtonClass: 'alertBtn',
					cancelButtonClass: 'alertBtn'
				}).then(() => {
					_t.$api.delete('system/role/', {
						jsonString: JSON.stringify({
							roleId: _t.checkListIds.join(',')
						})
					}, function (res) {
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('roleMaintenance.confirmDeleteSuccessTip'), _t.$t('public.resultTip'), {
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
							case 2007: // 删除失败
							case 3005: // 角色关联用户不能删除
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$refs.table.clearSelection();
								});
								break;
							case 3006: // 不能删除本用户所属角色
								_t.$alert(_t.$t('roleMaintenance.confirmDeletedTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
									_t.$refs.table.clearSelection();
								}).catch(()=>{
									_t.getData();
									_t.$refs.table.clearSelection();
								});
								break;
							default:
								break;
						}
						_t.disableBtn.edit = true;
						_t.disableBtn.enable = true;
						_t.disableBtn.disable = true;
						_t.disableBtn.more = true;
						_t.disableBtn.one = true;
					});
				}).catch(() => {
					return;
				});
			},
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getData();
		},
	}
</script>

<style scoped>
	.lineHeightBusiness {
		line-height: 30px;
	}
</style>
<style>
	.roleMaintenance-dialog .el-dialog {
		width: 600px;
		height: 400px;
	}

	.role-setUserName-dialog .el-dialog {
		width: 820px;
		height: 500px;
	}

	.role-setRoleLimit-dialog .el-dialog {
		width: 700px;
		height: 450px;
	}

	.role-setDateLimit-dialog .el-dialog {
		width: 700px;
		height: 450px;
	}

	.role-setBusiness-dialog .el-dialog {
		width: 600px;
		height: 400px;
	}

	.role-setDateLimit-dialog-checkout .el-checkbox__label {
		font-size: 12px;
	}

	.role-setDateLimit-dialog-line {
		position: relative;
	}

	.role-setDateLimit-dialog-line div.line {
		position: absolute;
		top: -10px;
		left: -20px;
		right: -20px;
		height: 1px;
		border-bottom: 1px solid #eaedf1;
	}

	.kvmPermissions-dialog .el-dialog {
		width: 600px;
		height: 400px;
	}

	.role-input-search .el-input__inner {
		height: 32px;
	}

	.allCheckedMenu .el-checkbox__label {
		font-size: 12px;
	}
</style>
