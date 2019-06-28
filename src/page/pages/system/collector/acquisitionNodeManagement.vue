<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.acquisitionNodeManagement')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="padding20 borderBottom">
			<!--表单-->
			<el-form inline label-width="96px" :model="formItem">
				<el-form-item :label="$t('acquisitionNodeManagement.nodeName') + '：'" style="margin-bottom: 16px;">
					<el-input class="width200" v-model="formItem.collectorName" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('acquisitionNodeManagement.nodeIp') + '：'" style="margin-bottom: 16px;">
					<el-input class="width200" v-model="formItem.IP" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('acquisitionNodeManagement.nodePort') + '：'" style="margin-bottom: 16px;">
					<el-input class="width200" v-model="formItem.port" @keyup.enter.native="getData()" clearable/>
				</el-form-item>
				<el-form-item :label="$t('acquisitionNodeManagement.groupName') + '：'">
					<el-select class="width200" v-model="formItem.groupIp" clearable
										 @change="formItem.groupIp = formItem.groupIp == '' ? '0':formItem.groupIp">
						<el-option :label="$t('acquisitionNodeManagement.all')" value="0"/>
						<el-option v-for="(item,index) in groupIpList" :key="index" :label="item.groupName" :value="item.id"/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('acquisitionNodeManagement.status') + '：'">
					<el-select class="width200" v-model="formItem.status" clearable>
						<el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value"/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button class="queryBtn" type="primary" @click="getData">{{$t('public.query')}}</el-button>
					<el-button class="queryBtn" type="reset" @click="resetData">{{$t('public.reset')}}</el-button>
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
				<el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
					<span class="iconfont fs14">&#xe647;</span>
					{{$t('public.delete')}}
				</el-button>
			</div>
			<!--表格-->
			<el-table :data="tableData" ref="table" border stripe @selection-change="selectTableNum">
				<el-table-column type="selection" fixed header-align="left" align="left"/>
				<el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
            <span>{{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
            </span>
					</template>
				</el-table-column>
				<el-table-column width="100px" prop="collectorName" :label="$t('acquisitionNodeManagement.nodeName')"
												 header-align="left" align="left"/>
				<el-table-column prop="ip" :label="$t('acquisitionNodeManagement.ip')" header-align="left" align="left"/>
				<el-table-column prop="port" :label="$t('acquisitionNodeManagement.port')" header-align="left" align="left"/>
				<el-table-column :label="$t('acquisitionNodeManagement.nodeRunStatus')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 1" class="iconfontSuccess">{{$t('acquisitionNodeManagement.normal')}}</span>
						<span v-else class="iconfontError">{{$t('acquisitionNodeManagement.abnormal')}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="groupName" :label="$t('acquisitionNodeManagement.nodeGroup')" header-align="left"
												 align="left"/>
				<el-table-column prop="description" :label="$t('acquisitionNodeManagement.description')" header-align="left"
												 align="left"/>
				<el-table-column width="150px" :label="$t('acquisitionNodeManagement.detailNode')" header-align="left"
												 align="left">
					<template slot-scope="scope">
						<a href="javascript:;" @click="clickSeeDetail(scope.row)" class="acquisitionNode-detail">
							<span class="iconfontSuccess">{{$t('acquisitionNodeManagement.normal')}}</span>
							<span class="iconfontError">{{$t('acquisitionNodeManagement.abnormal')}}</span>
						</a>
					</template>
				</el-table-column>
				<el-table-column prop="createByUser" :label="$t('acquisitionNodeManagement.createName')" header-align="left"
												 align="left"/>
				<el-table-column width="160px" :label="$t('acquisitionNodeManagement.createTime')" header-align="left"
												 align="left">
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
		<!--新增编辑-->
		<el-dialog
			append-to-body
			class="acquisitionNode-dialog"
			:title="$t('acquisitionNodeManagement.createUpdateNode')"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<div v-loading="loading">
				<el-form label-width="96px" inline :model="addEdit" :rules="rules" ref="formName">
					<el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeName') + '：'" prop="collectorName">
						<el-input class="width200" v-model="addEdit.collectorName"/>
					</el-form-item>
					<el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeIp') + '：'" prop="ip">
						<el-input class="width200" v-model="addEdit.ip"/>
					</el-form-item>
					<el-form-item class="star" :label="$t('acquisitionNodeManagement.nodeGroup') + '：'" prop="groupId">
						<el-select v-model="addEdit.groupId" class="width200" clearable>
							<el-option v-for="(item,index) in groupIpList" :key="index" :label="item.groupName" :value="item.id"/>
						</el-select>
					</el-form-item>
					<el-form-item class="star" :label="$t('acquisitionNodeManagement.nodePort') + '：'" prop="port">
						<el-input class="width200" v-model="addEdit.port"/>
					</el-form-item>
				</el-form>
				<el-form :model="addEdit" label-width="96px">
					<el-form-item :label="$t('acquisitionNodeManagement.ruleDes') + '：'">
						<el-input class="acquisitionNode-description" type="textarea" v-model="addEdit.description"
											:autosize="{minRows:3}"/>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer">
        <el-button type="primary" class="alertBtn" @click="testPort('formName')">{{$t('acquisitionNodeManagement.testPort')}}</el-button>
        <el-button type="primary" v-if="ifAdd == true" class="alertBtn" @click="addData('formName')">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" v-if="ifAdd == false" class="alertBtn" @click="editData('formName')">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="resetFormData">{{$t('public.cancel')}}</el-button>
      </span>
		</el-dialog>
		<el-dialog
			append-to-body
			class="acquisitionNodeDetail-dialog"
			:title="statusDetail.label + ' ' + $t('acquisitionNodeManagement.detailNode')"
			:visible.sync="dialogVisibleDetail"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-table :data="statusDetailData" stripe border>
				<el-table-column :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
            <span>{{scope.$index+(optionsDetail.currentPage - 1) * optionsDetail.pageSize + 1}}
            </span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('acquisitionNodeManagement.IPList')" header-align="left" align="left"/>
				<el-table-column :label="$t('acquisitionNodeManagement.gatewayIp')" header-align="left" align="left"/>
				<el-table-column :label="$t('acquisitionNodeManagement.status')" header-align="left" align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 1" class="iconfontSuccess">{{$t('acquisitionNodeManagement.normal')}}</span>
						<span v-if="scope.row.status == -1"
									class="iconfontError">{{$t('acquisitionNodeManagement.abnormal')}}</span>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer">
      </span>
		</el-dialog>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import {isNotNull, isIpNumber, isNumber} from "../../../../assets/js/validator";
	import {dateFilter} from "../../../../assets/js/filters";

	export default {
		name: "acquisitionNodeManagement",
		components: {Box},
		data() {
			return {
				// 带外通讯状态
				statusDetail: {
					id: '',
					label: ''
				},
				// 查询表单
				formItem: {
					collectorName: null, // 名称
					groupIp: '0', // 节点组id
					IP: null,
					port: null,
					status: null
				},
				// 新增编辑表单
				addEdit: {
					id: '',
					collectorName: '',
					ip: '',
					status: 0,
					groupId: '',
					port: '',
					description: ''
				},
				// 全局按钮判断
				disableBtn: {
					edit: true,
					more: true
				},
				statusList: [
					{label: this.$t('acquisitionNodeManagement.normal'), value: 1},
					{label: this.$t('acquisitionNodeManagement.abnormal'), value: 0}
				],
				tableData: [], // 表格数据集合
				checkListIds: [], // 选中的数据id集合
				groupIpList: [], // 节点组列表
				statusDetailData: [], // 带外通讯详情表格数据
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				optionsDetail: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 每页显示条数
				},
				dialogVisible: false, // 新增编辑弹出层
				dialogVisibleDetail: false, // 带外通讯状态弹出层
				loading:false,
				ifAdd: true, // 判断新增编辑
				lastTime: new Date().getTime(), //记录上次定时器的执行时间
				timer: null, //记录定时器
				rules: {
					collectorName: [
						{validator: isNotNull, trigger: ['blur']}
					],
					ip: [
						{validator: isNotNull, trigger: ['blur']},
						{validator: isIpNumber, trigger: ['blur']}
					],
					groupId: [
						{validator: isNotNull, trigger: ['blur','change']}
					],
					port: [
						{validator: isNotNull, trigger: ['blur']},
						{validator: isNumber, trigger: ['blur']}
					]
				}
			}
		},
		methods: {
			// 重置查询表单
			resetData() {
				var _t = this;
				_t.formItem.collectorName = null; // 名称
				_t.formItem.groupIp = '0'; // 节点组id
				_t.formItem.IP = null;
				_t.formItem.port = null;
				_t.formItem.status = null;
			},
			// 查看带外通讯状态
			clickSeeDetail(data) {
				var _t = this;
				_t.dialogVisibleDetail = true;
				_t.statusDetail.id = data.id;
				_t.statusDetail.label = data.collectorName;
			},
			// 测试端口
			testPort(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.loading = true;
						var collectId = -1;
						if (_t.ifAdd === true) {
							collectId = -1;
						} else {
							collectId = _t.addEdit.id;
						}
						_t.$api.get('asset/discovery/checkCollect/' + collectId,{
							jsonString:JSON.stringify({
								collectorName: _t.addEdit.collectorName === null ? null : (_t.addEdit.collectorName.trim() === '' ? null : _t.addEdit.collectorName.trim()),
								ip: _t.addEdit.ip === null ? null : (_t.addEdit.ip.trim() === '' ? null : _t.addEdit.ip.trim()),
								groupId: _t.addEdit.groupId,
								port: _t.addEdit.port === null ? null : (_t.addEdit.port.trim() === '' ? null : _t.addEdit.port.trim()),
								status: _t.addEdit.status,
								description: _t.addEdit.description === null ? null : (_t.addEdit.description.trim() === '' ? null : _t.addEdit.description.trim()),
							})
						},function (res) {
							switch (res.status) {
								case 200:
									_t.loading = false;
									if (res.data.Status === 'OK') {
										_t.addEdit.status = 1;
										_t.$message({
											message: _t.$t('acquisitionNodeManagement.dialogTestPortSuccess'),
											type: 'success'
										});
									} else {
										_t.addEdit.status = 0;
										_t.$message({
											message: _t.$t('acquisitionNodeManagement.dialogTestPortError'),
											type: 'error'
										});
									}
									break;
								default:
									_t.loading = false;
									_t.addEdit.status = 0;
									_t.$message({
										message: _t.$t('acquisitionNodeManagement.dialogTestPortError'),
										type: 'error'
									});
									break;
							}
						});
					}
				});
			},
			// 重置表单
			resetFormData() {
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = false;
				_t.addEdit.id = '';
				_t.addEdit.collectorName = '';
				_t.addEdit.ip = '';
				_t.addEdit.status = 0;
				_t.addEdit.groupId = '';
				_t.addEdit.port = '';
				_t.addEdit.description = '';
				_t.$refs.table.clearSelection();
				_t.$refs.formName.resetFields(); //移除校验结果并重置字段值
				// _t.$refs.formName.clearValidate(); //移除校验结果
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
						break;
					default: // 多选
						_t.disableBtn.edit = true;
						_t.disableBtn.more = false;
						break;
				}
				var checkListIds = new Array();
				data.forEach(function (item) {
					checkListIds.push(item.id);
				});
				_t.checkListIds = checkListIds;
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
			// 删除
			deleteData() {
				var _t = this;
				_t.$confirm(_t.$t('acquisitionNodeManagement.dialogDeleteTipText'), _t.$t('public.confirmTip'), {
					confirmButtonText: _t.$t('public.confirm'),
					cancelButtonText: _t.$t('public.close'),
					cancelButtonClass: "alertBtn",
					confirmButtonClass: 'alertBtn',
					type: 'warning'
				}).then(() => {
					_t.$store.commit('setLoading', true);
					_t.$api.delete('system/collector/', {
						jsonString: JSON.stringify({
							systemCollector: {
								id: _t.checkListIds.join(',')
							}
						})
					}, function (res) {
						_t.$store.commit('setLoading', false);
						switch (res.status) {
							case 200:
								_t.$alert(_t.$t('acquisitionNodeManagement.dialogDeleteTip'), _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								});
								_t.getData();
								break;
							case 1003: // 无操作权限
							case 1004: // 登录过期
							case 1005: // token过期
							case 1006: // token不通过
								_t.exclude(_t, res.message);
								break;
							case 2007: // 删除失败
							case 3005: // 节点组关联角色不能删除
								_t.$alert(res.message, _t.$t('public.resultTip'), {
									confirmButtonText: _t.$t('public.confirm'),
									confirmButtonClass: 'alertBtn'
								}).then(() => {
									_t.getData();
								});
								break;
							default:
								break;
						}
					});
					_t.disableBtn.edit = true;
					_t.disableBtn.more = true;
				}).catch(() => {
					return;
				});
			},
			// 查询列表数据
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('system/collector/pagelist', {
					jsonString: JSON.stringify({
						systemCollector: {
							collectorName: _t.formItem.collectorName == null ? null : (_t.formItem.collectorName.trim() == '' ? null : _t.formItem.collectorName.trim()),
							ip: _t.formItem.IP == null ? null : (_t.formItem.IP.trim() == '' ? null : _t.formItem.IP.trim()),
							groupId: _t.formItem.groupIp == '0' ? null : (_t.formItem.groupIp.trim() == '' ? null : _t.formItem.groupIp.trim()),
							port: _t.formItem.port == null ? null : (_t.formItem.port.trim() == '' ? null : _t.formItem.port.trim()),
							status: _t.formItem.status,
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
			// 新增按钮
			addDataBtn() {
				var _t = this;
				_t.ifAdd = true;
				_t.dialogVisible = true;
			},
			// 新增提交
			addData(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.post('system/collector/', {
							systemCollector: {
								collectorName: _t.addEdit.collectorName === null ? null : (_t.addEdit.collectorName.trim() === '' ? null : _t.addEdit.collectorName.trim()),
								ip: _t.addEdit.ip === null ? null : (_t.addEdit.ip.trim() === '' ? null : _t.addEdit.ip.trim()),
								groupId: _t.addEdit.groupId,
								port: _t.addEdit.port === null ? null : (_t.addEdit.port.trim() === '' ? null : _t.addEdit.port.trim()),
								status: _t.addEdit.status,
								description: _t.addEdit.description === null ? null : (_t.addEdit.description.trim() === '' ? null : _t.addEdit.description.trim()),
								createBy: localStorage.getItem('hy-user-name'),
								languageMark: localStorage.getItem('hy-language')
							}
						}, function (res) {
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
								case 3004: // 操作失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.resetFormData();
									});
									break;
								default:
									_t.resetFormData();
									break;
							}
						});
					}
				});
			},
			// 编辑按钮
			editDataBtn() {
				var _t = this;
				_t.ifAdd = false;
				_t.dialogVisible = true;
				_t.addEdit.id = _t.checkListIds.join(',');
				_t.getEditDataById(_t.addEdit.id);
			},
			// 根据选中的id获取编辑的数据
			getEditDataById(val) {
				var _t = this;
				_t.$api.get('system/collector/' + val, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.addEdit.id = res.data.id;
							_t.addEdit.collectorName = res.data.collectorName;
							_t.addEdit.ip = res.data.ip;
							_t.addEdit.port = res.data.port;
							_t.addEdit.status = res.data.status;
							_t.addEdit.description = res.data.description;
							_t.addEdit.groupId = res.data.groupId;
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
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						_t.$api.put('system/collector/', {
							systemCollector: {
								id: _t.addEdit.id,
								collectorName: _t.addEdit.collectorName === null ? null : (_t.addEdit.collectorName.trim() === '' ? null : _t.addEdit.collectorName.trim()),
								ip: _t.addEdit.ip === null ? null : (_t.addEdit.ip.trim() === '' ? null : _t.addEdit.ip.trim()),
								groupId: _t.addEdit.groupId,
								port: _t.addEdit.port === null ? null : (_t.addEdit.port.trim() === '' ? null : _t.addEdit.port.trim()),
								status: _t.addEdit.status,
								description: _t.addEdit.description === null ? null : (_t.addEdit.description.trim() === '' ? null : _t.addEdit.description.trim()),
								createBy: localStorage.getItem('hy-user-name'),
								languageMark: localStorage.getItem('hy-language')
							}
						}, function (res) {
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
								case 3004: // 操作失败
									_t.$alert(res.message, _t.$t('public.resultTip'), {
										confirmButtonText: _t.$t('public.confirm'),
										confirmButtonClass: 'alertBtn'
									}).then(() => {
										_t.resetFormData();
									});
									break;
								default:
									_t.resetFormData();
									break;
							}
						});
					}
				});
			},
			// 查询节点组数据
			getGroupData() {
				var _t = this;
				_t.$api.get('system/collectorGroup/all', {}, function (res) {
					switch (res.status) {
						case 200:
							_t.groupIpList = res.data.list === null ? [] : res.data.list;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.groupIpList = [];
							break;
					}
				});
			},
			//页面定时刷新
			refreshPage() {
				var _t = this;
				var rate = 5 * 60; //默认5分钟
				//从缓存中获取设备资产页面刷新频率map
				var refreshRateMap = localStorage.getItem('RefreshRateMap');
				if (null != refreshRateMap && undefined != refreshRateMap) {
					var refreshRateJson = JSON.parse(refreshRateMap);
					var rateMap = refreshRateJson['RefreshRate-SysCollector'];
					if (null != rateMap && undefined != rateMap) {
						rate = rateMap.dictionaryCode;
						if (null == rate || '' == rate || undefined == rate) {
							rate = 5 * 60; //都为空时默认5分钟
						}
					}
				}
				// 定时器防止密集访问
				_t.timer = setInterval(() => {
					var nowTime = new Date().getTime();
					//允许 10 毫秒的误差
					if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
						//记录当前执行的时间
						_t.lastTime = nowTime;
						//分页查询表格数据
						_t.getData();
					}
				}, rate * 1000);
			}
		},
		created() {
			this.$store.commit('setLoading', true);
			this.getData();
			this.getGroupData();
		},
		mounted() {
			var _t = this;
			//定时刷新页面
			_t.refreshPage();
		},
		beforeDestroy() {
			var _t = this;
			//销毁刷新定时器
			clearInterval(_t.timer);
			_t.timer = null;
		}
	}
</script>

<style>
	.acquisitionNode-dialog .el-dialog {
		width: 660px;
		height: 456px;
	}

	.acquisitionNode-dialog .el-form-item {
		width: 49%;
		margin-bottom: 20px;
		margin-right: 0;
	}

	.acquisitionNode-description {
		width: 505px;
	}

	.acquisitionNode-detail {
		display: inline-block;
	}

	.acquisitionNodeDetail-dialog .el-dialog {
		width: 700px;
		height: 450px;
	}
</style>
