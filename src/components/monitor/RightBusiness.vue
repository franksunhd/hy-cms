<template>
	<div>
		<!--新增业务分组-->
		<el-dialog
			class="EquipmentMonitoringGrid"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			append-to-body
			:title="dialogBatchToAddBusinessTitle"
			:before-close="getAddAssetGroupQx"
			:visible.sync="dialogGrouping">
			<div style="overflow: hidden" @click.stop="CancelEjectlayer">
			<div class="padding20" style="padding-top:0;">
				<label style="padding-right:10px ;">{{$t('BusinessMonitoring.dialog.assetBusiness.dialogTheParentNode')}}</label>
				<el-popover
					trigger="click"
					placement="bottom-start"
					v-model="isShowComputerPopoversss"
					ref="popover">
					<el-tree
						:data="treeData"
						highlight-current
						:expand-on-click-node="true"
						@node-click="clickRoomNodess"
						:props="defaultPropsssa"/>
					<el-input
						v-model="addEditss.nodeName"
						class="width200"
						suffix-icon="el-icon-arrow-down"
						readonly slot="reference"/>
				</el-popover>
				<!--导入-->
				<el-button type="primary" style="margin-left: 50px;" @click="toImportData">
					<span class="iconfont fs14">&#xe6af; </span>{{$t('BusinessMonitoring.dialog.assetBusiness.dialogImportBtn')}}
				</el-button>
				<!--导出-->
				<el-button @click="toDownloadData">
					<span class="iconfont fs14">&#xe6a8; </span>{{$t('BusinessMonitoring.dialog.assetBusiness.dialogExportBtn')}}
				</el-button>
			</div>
			<el-table
				:data="assetBusinessList"
				@row-contextmenu="openDetails"
				border
				align="center"
				indent
				style="width: 100%">
				<el-table-column
					:label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheLineNumbers')"
					align="center" width="50">
					<template slot-scope="scope">
						{{scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogCheck')"
								 align="center" width="50px">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">
								<pre>{{scope.row.verifyMsg}}</pre>
							</div>
							<div style="display: inline-block;">
								<span v-if="scope.row.verify==='error'"
									  style="display: inline-block;" class="iconfont iconfontError">&#xe64e;</span>
								<span v-if="scope.row.verify==='pass'"
									  class="iconfont iconfontSuccess">&#xe648;</span>
							</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheFirst')" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.amount0"
							:placeholder="$t('BusinessMonitoring.dialog.assetBusiness.dialogPleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheSecond')" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.amount1"
								  :placeholder="$t('BusinessMonitoring.dialog.assetBusiness.dialogPleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheThird')" align="center">
					<template slot-scope="scope">
						<el-input size="small"
								  v-model="scope.row.amount2"
								  :placeholder="$t('BusinessMonitoring.dialog.assetBusiness.dialogPleaseEnterContent')">
						</el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheFourth')" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.amount3"
							:placeholder="$t('BusinessMonitoring.dialog.assetBusiness.dialogPleaseEnterContent')">
						</el-input>
					</template>
				</el-table-column>
			</el-table>
			</div>
			<div v-show="dialogGroupingNei">
				<ul id="menu1" class="menu1">
					<li class="menu1__item  cursorPointer">
						<span>{{$t('BusinessMonitoring.dialog.assetBusiness.dialogInsertAbove')}}</span>
						<el-input v-model="aboveAddNum" style="width:50px"/>
						<span> {{$t('BusinessMonitoring.dialog.assetBusiness.dialogLine')}} </span>
						<el-button @click="getClick('above')"> {{$t('public.confirm')}}</el-button>
					</li>
					<li class="menu1__item  cursorPointer">
						<span>{{$t('BusinessMonitoring.dialog.assetBusiness.dialogBelowTheInsert')}}</span>
						<el-input v-model="belowAddNum" style="width:50px"/>
						<span> {{$t('BusinessMonitoring.dialog.assetBusiness.dialogLine')}} </span>
						<el-button @click="getClick('below')"> {{$t('public.confirm')}}</el-button>
					</li>
					<li class="menu1__item  cursorPointer">
						<span style="display: block;" @click="delClick()">
							{{$t('BusinessMonitoring.dialog.assetBusiness.dialogDeleteTheBank')}}
						</span>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getAddBusinessGroup">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="getAddAssetGroupQx">{{$t('public.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--编辑业务分组-->
		<el-dialog class="EquipmentMonitoringBj" :close-on-click-modal="false"
			:close-on-press-escape="false"
			:before-close="getEditDeviceQx"
			append-to-body
			:title="$t('BusinessMonitoring.dialog.assetBusiness.dialogEditDeviceGrouping')"
			:visible.sync="dialogGroupingBj">
			<el-form :model="formItem" inline label-width="150px" :rules="rules" ref="roleName">
				<el-form-item :label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheParentNode') + '：'">
					<el-popover
						trigger="click" placement="bottom-start"
						v-model="isShowComputerPopoverss" ref="popover">
						<el-tree :data="treeData" highlight-current :expand-on-click-node="false"
								 @node-click="clickRoomNodes" :props="defaultPropsss"/>
						<el-input v-model="addEdits.nodeName" style="width: 200px;"
								  suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item
					class="star" prop="catalogName"
					:label="$t('BusinessMonitoring.dialog.assetBusiness.dialogTheNameOfTheNode') + '：'">
					<el-input v-model="formItem.catalogName" class="width200" clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getEditDevice('roleName')">
					{{$t('public.confirm')}}
				</el-button>
				<el-button class="alertBtn" @click="getEditDeviceQx">{{$t('public.cancel')}}
				</el-button>
			</div>
		</el-dialog>
		<!--删除业务分组-->
		<el-dialog class="EquipmentMonitoringSc"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:title="$t('BusinessMonitoring.dialogConfirmation')"
			:visible.sync="dialogGroupingSc" append-to-body
			:before-close="getRemoveQx" width="30%">
			<span>{{$t('BusinessMonitoring.dialog.assetBusiness.dialogAreYouSureYouWantToDeleteTheCurrentRecord')}}?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="alertBtn" @click="getRemove">{{$t('public.confirm')}}</el-button>
				<el-button class="alertBtn" @click="getRemoveQx">{{$t('public.cancel')}}</el-button>
			</span>
		</el-dialog>
		<!-- 导入Excel -->
		<el-dialog
			class="Import-dialog"
			append-to-body
			:title="$t('BusinessMonitoring.dialog.assetBusiness.import.dialogTitle')"
			:visible.sync="importDialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-upload
				ref="upload"
				name="excel"
				accept=".xls,.xlsx"
				:headers="uploadHeaders"
				:auto-upload="false"
				:multiple="false"
				:limit="1"
				:file-list="fileList"
				:on-exceed="onExceedHandle"
				:on-remove="onRemoveHandle"
				:before-upload="beforeUploadHandle"
				:on-success="uploadSuccessHandle"
				:on-error="uploadErrorHandle"
				:action="rootUrl + '/asset/assetBusiness/toImportExcel'">
				<el-button size="small" type="primary">{{$t('public.pickUpFile')}}</el-button>
			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					@click="submitUpload"
					:disabled="submitUploadButtonDisabled"
					size="small">{{$t('public.submitUpload')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {isNotNull, isIpNumber, isIpNumbers} from "../../assets/js/validator";

	export default {
		name: "RightBusiness",
		props: {
			dialogGrouping: {
				type: Boolean,
				default: false,
			},
			dialogGroupingBj: {
				type: Boolean,
				default: false,
			},
			dialogGroupingSc: {
				type: Boolean,
				default: false,
			},
			object: {
				type: Object,
				default: {},
			},
			deleteId: {
				type: String,
				default: null,
			},
		},
		data() {
			return {
				rootUrl: this.$api.root(),
				uploadHeaders: {
					'token': localStorage.getItem('hy-token') || ''
				},
				dialogBatchToAddBusinessTitle: this.$t('BusinessMonitoring.dialog.assetBusiness.dialogNewDeviceGrouping'),
				isShowComputerPopoversss: false, //控制新增设备分组父级节点下拉框的显示隐藏
				isShowComputerPopoverss: false, // 控制父级节点下拉框的显示隐藏
				dialogGroupingNei: false, //控制增加设备分组内层弹出层
				//树形控件模拟数据
				treeData: [],
				/*上方插入行数*/
				aboveAddNum: '1',
				/*下方插入行数*/
				belowAddNum: '1',
				/*右键行的下标*/
				currentRowIndex: '',
				/*点击删除按钮得到当前的ID*/
				/*deleteId: '',*/
				/*节点名称*/
				nameOfTheNode: '',
				/*新增设备分组父级节点树形下拉框*/
				defaultPropsssa: {
					parentId: 'parentNodeId', // 父级唯一标识
					value: 'nodeId', // 唯一标识
					label: 'nodeName', // 标签显示
					children: 'children', // 子级
				},
				/*批量创建分组的数据封装*/
				packagingGroupData: {
					all: [],
					firstObj: {},
					secondGroup: [],
					secondObj: {},
					thirdGroup: [],
					thirdObj: {},
					fourthGroup: []
				},
				/*编辑设备分组父级节点tree*/
				defaultPropsss: {
					children: 'children',
					label: 'nodeName',
				},
				// 查询表单
				formItem: {
					/*设备类型*/
					equipmentType: 'ALL',
					equipmentTypeId: null,
					/*设备名称/资产信息*/
					equipmentName: null,
					/*序列号*/
					serialNumber: null,
					computerRoom: null,
					/*机房ID*/
					computerRoomId: null,
					/*机架ID*/
					rackNameId: null,
					/*业务ID*/
					businessId: null,
					businessName: null,
					/*状态*/
					equipmentStatus: null,
					/*厂商*/
					manufacturer: null,
					/*目录ID 左侧树形控件*/
					catalogId: null,
					/*目录节点名称 左侧树形控件*/
					catalogName: null,
					/*目录节点获取nodeCode*/
					catalogPath: null,
					/*编辑设备分组父级节点名称*/
					prentcatalogName: '无',
				},
				//新增设备分组
				assetBusinessList: [{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount0Id: '',
					amount1: '',
					amount1Id: '',
					amount2: '',
					amount2Id: '',
					amount3: '',
					amount3Id: ''
				},{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount0Id: '',
					amount1: '',
					amount1Id: '',
					amount2: '',
					amount2Id: '',
					amount3: '',
					amount3Id: ''
				},{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount0Id: '',
					amount1: '',
					amount1Id: '',
					amount2: '',
					amount2Id: '',
					amount3: '',
					amount3Id: ''
				},{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount0Id: '',
					amount1: '',
					amount1Id: '',
					amount2: '',
					amount2Id: '',
					amount3: '',
					amount3Id: ''
				}],
				addEdits: {
					nodeName: '无父节点',
					nodeId: null,
					parentId: null,
				},
				addEditss: {
					nodeId: '',
					parentId: '',
					nodeName: '',
					nodeCode: ''
				},
				rules: {
					catalogName: [{
						validator: isNotNull,
						trigger: ['blur']
					}],
					ips: [{
						validator: isIpNumber,
						trigger: ['blur']
					}],
					ip: [{
						validator: isIpNumbers,
						trigger: ['blur']
					}],
					ipp: [{
						validator: isIpNumbers,
						trigger: ['blur']
					}]
				},
				//导入excel弹窗是否显示
				importDialogVisible: false,
				//上传按钮是否禁用
				submitUploadButtonDisabled: false,
				//上传文件列表
				fileList: []
			}
		},
		methods: {
			/*-------------------------------新增设备分组------------------------------*/
			//点击取消内层弹出层
			CancelEjectlayer(){
				var _t=this;
				_t.dialogGroupingNei = false;
			},
			// 新增设备分组点击父级结点下拉框的节点
			clickRoomNodess(val) {
				var _t = this;
				_t.addEditss.nodeId = val.nodeId;
				_t.addEditss.nodeName = val.nodeName;
				_t.addEditss.nodeCode = val.nodeCode;
				_t.isShowComputerPopoversss = false;
			},
			//新增设备分组弹出框点击取消按钮
			getAddAssetGroupQx() {
				var _t = this;
				_t.addEditss.nodeId = null;
				_t.addEditss.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
				_t.$emit('dialogGrouping', false); // 取消弹出层
				_t.dialogGroupingNei = false;

				//新增设备分组重置表格数据
				_t.resetAssetBusinessList();
			},
			//重置业务目录列表
			resetAssetBusinessList(){
				var _t = this;

				var assetBusinessList = new Array();
				for (var i = 0; i < 4; i++) {
					assetBusinessList.push({
						verify: '',
						verifyMsg: '',
						amount0: '',
						amount0Id: '',
						amount1: '',
						amount1Id: '',
						amount2: '',
						amount2Id: '',
						amount3: '',
						amount3Id: ''
					});
				}
				_t.assetBusinessList = assetBusinessList;
			},
			//新增设备分组弹出框点击确定按钮接口
			getAddBusinessGroup() {
				var _t = this;

				var isPass = _t.verifyBusinessGroup();
				if (isPass) {
					_t.$message({
						message: '恭喜你，数据校验通过正在保存，请稍后！',
						type: 'success'
					});
					_t.$api.post('asset/assetBusiness/', {
						parentId: _t.addEditss.nodeId,
						assetBusinessList: _t.packagingGroupData.all
					}, function (res) {
						_t.getDataTree();
						_t.$bus.emit('getDataTreeXz', true); // 刷新设备导航树
						_t.addEditss.nodeId = null;
						_t.addEditss.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
						/*_t.dialogGrouping = false;*/
						_t.$emit('dialogGrouping', false); // 取消弹出层
						_t.addEdits.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
						_t.addEdits.nodeId = null;
						_t.$message({
							message: '恭喜你，数据保存成功！',
							type: 'success'
						});

						//新增设备分组重置表格数据
						_t.resetAssetBusinessList();
					})
				} else {
					_t.$alert("数据校验未通过，请完善数据！", "提示!");
				}
			},
			//校验表格中录入的业务目录
			verifyBusinessGroup() {
				var _t = this;
				_t.dialogGroupingNei = false;
				//方法一开始就重新定义每个级别的数组、对象
				_t.packagingGroupData = {
					all: [],
					firstObj: {},
					secondGroup: [],
					secondObj: {},
					thirdGroup: [],
					thirdObj: {},
					fourthGroup: []
				};
				//记录是否全部校验通过
				var isPass = true;
				//当输入的table记录存在且行数大于0时才执行
				if (undefined != _t.assetBusinessList && null != _t.assetBusinessList && _t.assetBusinessList.length > 0) {
					for (var i = 0; i < _t.assetBusinessList.length; i++) {
						var _one = _t.assetBusinessList[i].amount0.trim();
						var _oneId = _t.assetBusinessList[i].amount0Id;
						var _two = _t.assetBusinessList[i].amount1.trim();
						var _twoId = _t.assetBusinessList[i].amount1Id;
						var _three = _t.assetBusinessList[i].amount2.trim();
						var _threeId = _t.assetBusinessList[i].amount2Id;
						var _four = _t.assetBusinessList[i].amount3.trim();
						var _fourId = _t.assetBusinessList[i].amount3Id;
						_t.assetBusinessList[i].verify = "";
						_t.assetBusinessList[i].verifyMsg = "";
						if (_one.length == 0 && _two.length == 0 && _three.length == 0 && _four.length == 0) {
							_t.assetBusinessList[i].verify = "error";
							_t.assetBusinessList[i].verifyMsg = _t.$t('BusinessMonitoring.dialog.assetBusiness.JsAllCellsInThisLineHaveNotBeenEnteredPleaseDelete') + '！';

							//记录校验不通过
							//isPass = false; //空行不做控制  fpg 2019年5月30日

							//直接进行下一行校验
							continue;
						}
						if (_one.length > 0) {
							//一级不为空，则说明上一个一级结束，先封装上一个一级的内容到all中
							_t.packagingGroupDataFun(1);

							_t.assetBusinessList[i].verify = "pass";
							_t.assetBusinessList[i].verifyMsg = _t.$t('BusinessMonitoring.dialog.assetBusiness.JsCheckBy') + '！';

							//开始记录新一个一级
							_t.packagingGroupData.firstObj = {
								id: _oneId,
								name: _one
							};
						}
						if (_two.length > 0) {
							//二级不为空，则说明上一个二级结束，先封装上一个二级的内容到secondGroup中
							_t.packagingGroupDataFun(2);

							//检查是否存在可挂靠的父级
							var firstObj = _t.packagingGroupData.firstObj;
							if (undefined == firstObj.name || '' == firstObj.name) {
								_t.assetBusinessList[i].verify = "error";
								if (undefined != _t.assetBusinessList[i].verifyMsg && '' != _t.assetBusinessList[i].verifyMsg) {
									_t.assetBusinessList[i].verifyMsg += "\n";
								}
								_t.assetBusinessList[i].verifyMsg += _t.$t('BusinessMonitoring.dialog.assetBusiness.JsTheSecondLevelOfTheBankDidNotFindAnyAttachedFirstLevelRecordsPleaseCheck') + '！';

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetBusinessList[i].verify = "pass";
								_t.assetBusinessList[i].verifyMsg = _t.$t('BusinessMonitoring.dialog.assetBusiness.JsCheckBy') + '！';

								//开始记录新一个二级
								_t.packagingGroupData.secondObj = {
									id: _twoId,
									name: _two
								};
							}
						}
						if (_three.length > 0) {
							//三级不为空，则说明上一个三级结束，先封装上一个三级的内容到thirdGroup中
							_t.packagingGroupDataFun(3);

							//检查是否存在可挂靠的父级
							var secondObj = _t.packagingGroupData.secondObj;
							if (undefined == secondObj.name || '' == secondObj.name) {
								_t.assetBusinessList[i].verify = "error";
								if (undefined != _t.assetBusinessList[i].verifyMsg && '' != _t.assetBusinessList[i].verifyMsg) {
									_t.assetBusinessList[i].verifyMsg += "\n";
								}
								_t.assetBusinessList[i].verifyMsg += _t.$t('BusinessMonitoring.dialog.assetBusiness.JsLevel3OfThisBankDidNotFindAnyAttachedLevel2RecordsPleaseCheck') + '！';

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetBusinessList[i].verify = "pass";
								_t.assetBusinessList[i].verifyMsg = _t.$t('BusinessMonitoring.dialog.assetBusiness.JsCheckBy') + '！';

								//开始记录新一个三级
								_t.packagingGroupData.thirdObj = {
									id: _threeId,
									name: _three
								};
							}
						}
						if (_four.length > 0) {
							//检查是否存在可挂靠的父级
							var thirdObj = _t.packagingGroupData.thirdObj;
							if (undefined == thirdObj.name || '' == thirdObj.name) {
								_t.assetBusinessList[i].verify = "error";
								if (undefined != _t.assetBusinessList[i].verifyMsg && '' != _t.assetBusinessList[i].verifyMsg) {
									_t.assetBusinessList[i].verifyMsg += "\n";
								}
								_t.assetBusinessList[i].verifyMsg += _t.$t('BusinessMonitoring.dialog.assetBusiness.JsTheBankSLevel4DidNotFindAnyAttachedLevel3RecordsPleaseCheck') + '！';

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetBusinessList[i].verify = "pass";
								_t.assetBusinessList[i].verifyMsg = _t.$t('BusinessMonitoring.dialog.assetBusiness.JsCheckBy') + '！';

								//将四级的内容封装到fourthGroup中
								_t.packagingGroupData.fourthGroup.push({
									name: _fourId,
									name: _four
								});
							}
						}
					}
					//将最后一个一级的内容到all中
					_t.packagingGroupDataFun(1);
				} else {
					//记录校验不通过
					isPass = false;
				}

				return isPass;
			},
			//封装批量新增的设备分组的集合
			packagingGroupDataFun(level) {
				var _t = this.packagingGroupData;
				if (level <= 3 && undefined != _t.thirdObj.name && '' != _t.thirdObj.name) {
					if (_t.fourthGroup.length > 0) {
						_t.thirdObj.assetBusinessList = _t.fourthGroup;
						_t.fourthGroup = [];
					}
					_t.thirdGroup.push(_t.thirdObj);
					_t.thirdObj = {};
				}
				if (level <= 2 && undefined != _t.secondObj.name && '' != _t.secondObj.name) {
					if (_t.thirdGroup.length > 0) {
						_t.secondObj.assetBusinessList = _t.thirdGroup;
						_t.thirdGroup = [];
					}
					_t.secondGroup.push(_t.secondObj);
					_t.secondObj = {};
				}
				if (level <= 1 && undefined != _t.firstObj.name && '' != _t.firstObj.name) {
					if (_t.secondGroup.length > 0) {
						_t.firstObj.assetBusinessList = _t.secondGroup;
						_t.secondGroup = [];
					}
					_t.all.push(_t.firstObj);
					_t.firstObj = {};
				}
			},
			// 打开导入excel窗口
			toImportData() {
				var _t = this;
				//打开上传窗口
				_t.importDialogVisible = true;
				//清空上传列表，以防有文件残留
				_t.fileList = [];
				//将上传按钮先置为启用
				_t.submitUploadButtonDisabled = false;
			},
			//选择导入文件
			importHandleChange(file, fileList) {
				var _t = this;
				return _t.beforeUploadHandle(file);
			},
			//上传的文件个数超出设定时触发的函数
			onExceedHandle(files, fileList) {
				var _t = this;
				_t.$message({
					message: '抱歉，一次最多只能上传一个Excel文件！',
					type: 'warning',
					duration: 6000
				});
			},
			//删除文件列表中的文件时触发
			onRemoveHandle(file, fileList) {
				var _t = this;
				//将上传按钮先置为启用
				_t.submitUploadButtonDisabled = false;
			},
			//上传前校验
			beforeUploadHandle(file) {
				var _t = this;
				var testReg = /(xls|xlsx)$/.test(file.name.toLowerCase());
				var isLt4M = file.size / 1024 / 1024 <= 4; //图片大小不超过4MB
				if (!testReg) {
					_t.$message.error('抱歉，只能上传Excel文件！');
					return false;
				}
				if (!isLt4M) {
					_t.$message.error('抱歉，上传文件大小不能超过 4M!');
					return false;
				}
				return testReg && isLt4M;
			},
			//开始上传
			submitUpload() {
				var _t = this;
				//校验必须选择了文件才能开始上传
				if (_t.$refs.upload.$children[0].fileList.length >= 1) {
					//开始上传
					_t.$refs.upload.submit();
					//将上传按钮置为禁用，以防重复点击上传
					_t.submitUploadButtonDisabled = true;
				} else {
					_t.$message({
						message: '请选择一个Excel文件!',
						duration: 3000,
						type: 'error'
					});
				}
				;
			},
			//上传结果
			uploadSuccessHandle(res, file, fileList) {
				var _t = this;
				if (res.status === 200) {
					_t.dialogBatchToAddBusinessTitle = _t.$t('BusinessMonitoring.dialog.assetBusiness.excelAnalyzeResult.dialogTitle');
					if (null != res.data) {
						if (null != res.data.list) {
							//清空上传列表
							_t.$refs.upload.clearFiles();
							//关闭上传窗口
							_t.importDialogVisible = false;

							_t.assetBusinessList = res.data.list;

							_t.addEditss.nodeId = res.data.parentNodeId;
							_t.addEditss.nodeName = res.data.parentNodeName;

							//渲染完成后
							_t.$nextTick(function () {
								//执行校验
								_t.verifyBusinessGroup();
							})
						}
					}
					_t.$message({
						message: '上传成功！',
						duration: 3000,
						type: 'success'
					});
				} else {
					var resData = res.data;
					var resMessage = res.message;
					if (null != resData) {
						var msg = resData.title;
						var content = resData.content;
						if (null != content) {
							msg += "</br></br>";
							msg += "<span style='color:red;'>" + content + "</span>";
						}
						_t.$message({
							message: msg,
							dangerouslyUseHTMLString: true,
							showClose: true,
							duration: 0,
							type: 'error'
						});
					} else if (null != resMessage) {
						_t.$message({
							message: resMessage,
							duration: 3000,
							type: 'error'
						});
					} else {
						_t.$message({
							message: '非常抱歉，文件解析失败，请稍后再尝试上传！',
							duration: 3000,
							type: 'error'
						});
					}
				}
			},
			//上传失败
			uploadErrorHandle(err, file) {
				this.$message.error('上传失败');
				this.submitUploadButtonDisabled = false;
			},
			// 导出excel数据
			toDownloadData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetBusiness/toDownloadExcel', {
					jsonString: JSON.stringify({
						id : _t.addEditss.nodeId == null ? null : (_t.addEditss.nodeId === '' ? null : _t.addEditss.nodeId),
						name : _t.addEditss.nodeName == null ? null : (_t.addEditss.nodeName === '' ? null : _t.addEditss.nodeName),
						businessPath : _t.addEditss.nodeCode == null ? null : (_t.addEditss.nodeCode === '' ? null : _t.addEditss.nodeCode)
					})
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							window.location.href = _t.rootUrl + res.data.filePath;
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
			/*----------------------------------结束新增设备分组---------------------------------*/
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('asset/assetBusiness/all', {
					jsonString: JSON.stringify({
						isTree: true
					})
				}, function (res) {
					switch (res.status) {
						case 200:
							_t.treeData = res.data.children === null ? [] : res.data.children;
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
			//内层框确认行数
			getClick(val) {
				var _t = this;
				_t.dialogGroupingNei = false;
				var addNum = 1; //增加的行数
				var addToIndex; //加到哪个下标后边
				if ('above' == val) {
					addNum = _t.aboveAddNum;
					addToIndex = _t.currentRowIndex;

				} else {
					addNum = _t.belowAddNum;
					addToIndex = _t.currentRowIndex + 1;

				}
				//在当前行的后面插入行
				for (var i = 0; i < addNum; i++) {
					var newValue = {
						verify: '',
						verifyMsg: '',
						amount0: '',
						amount1: '',
						amount2: '',
						amount3: ''
					};
					_t.assetBusinessList.splice(addToIndex, 0, newValue);
				}
			},
			//根据下标删除当前行
			delClick() {
				var _t = this;
				if (_t.assetBusinessList.length < 2) {
					_t.dialogGroupingNei = false;
					_t.$alert(_t.$t('BusinessMonitoring.dialog.assetBusiness.JsOnlyTheLastLineCantBeDeleted'), _t.$t('public.confirmTip')+'！');
				} else {
					_t.assetBusinessList.splice(_t.currentRowIndex, 1);
					//删掉一行后要关闭，以防一直用该下标进行删除导致数组越界
					_t.dialogGroupingNei = false;
				}

			},

			/*添加右键行事件*/
			openDetails(row, object, MouseEvent) { // 鼠标右击触发事件
				var _t = this;
				MouseEvent.preventDefault();
				_t.dialogGroupingNei = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
				_t.dialogGroupingNei = true; // 显示模态窗口，跳出自定义菜单栏
				var clientWidth = document.body.clientWidth //屏幕可用宽度
				var clientHeight = document.body.clientHeight; //屏幕可用高度
				var menu = document.querySelector('#menu1');
				menu.style.left = MouseEvent.clientX + 'px';
				document.addEventListener('click', this.foo1); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
				menu.style.top = MouseEvent.clientY + 'px';
				//获取右键行的下标
				var index = this.assetBusinessList.indexOf(row);
				this.currentRowIndex = index;
			},
			foo1() { // 取消鼠标监听事件 菜单栏
				/*this.dialogGroupingNei = false;*/
				document.removeEventListener('click', this.foo1) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
			},
			/*----------------------------编辑设备分组----------------------------------*/
			// 编辑设备分组点击父级结点下拉框的节点
			clickRoomNodes(val) {
				var _t = this;
				_t.addEdits.parentId = val.nodeId;
				_t.addEdits.nodeName = val.nodeName;
				_t.isShowComputerPopoverss = false;
			},
			/*编辑设备分组点击取消按钮*/
			getEditDeviceQx() {
				var _t = this;
				_t.$emit('dialogGroupingBj', false); // 取消弹出层
				_t.addEdits.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
				_t.addEditss.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
			},
			/*外层新增按钮*/
			getXztree(){
				var _t=this;
				_t.addEditss.nodeName =  '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
			},
			/*点击设备编辑按钮查询接口*/
			getBjtree() {
				var _t = this;
				var obj = _t.object;
				_t.addEditss.nodeName = obj.nodeName;
				_t.addEditss.nodeId = obj.nodeId;
				_t.formItem.catalogId = obj.nodeId;
				var id = _t.formItem.catalogId == undefined ? '' : _t.formItem.catalogId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetBusiness/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formItem.catalogName = res.data.name;
							_t.formItem.catalogId = res.data.id;
							_t.addEdits.parentId = res.data.parentId;
							if (_t.addEdits.parentId != null) {
								_t.getBjtreeF();
							} else if (_t.addEdits.parentId == null) {
								_t.addEdits.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-'
							};
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
			},
			/*根据parentId查询父级节点*/
			getBjtreeF() {
				var _t = this;
				var id = _t.addEdits.parentId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetBusiness/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.addEdits.nodeName = res.data.name;
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
			},
			/*编辑设备分组点击保存按钮接口*/
			getEditDevice(formName) {
				var _t = this;
				_t.$refs[formName].validate((valid) => {
					if (valid) {
						var id = _t.addEdits.parentId;
						_t.$store.commit('setLoading', true);
						_t.$api.put('asset/assetBusiness/', {
							assetBusiness: {
								id: _t.formItem.catalogId,
								name: _t.formItem.catalogName
							}
						}, function (res) {
							_t.$store.commit('setLoading', false);
							switch (res.status) {
								case 200:
									_t.$emit('dialogGroupingBj', false); // 取消弹出层
									_t.getDataTree();
									_t.$bus.emit('getDataTreeBj', true); // 刷新设备导航树
									_t.$emit('getTableData',true);
									_t.addEdits.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
									_t.addEdits.nodeId = null;
									_t.addEditss.nodeName = '-'+_t.$t('BusinessMonitoring.dialog.assetBusiness.JsNoARentNode')+'-';
									_t.addEditss.nodId = null;
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

			/*----------------------------结束编辑设备分组------------------------------*/
			getRemoveQx() {
				var _t = this;
				_t.$emit('dialogGroupingSc', false); // 取消弹出层
			},
			//确定删除按钮
			getRemove() {
				var _t = this;
				var catalogId = _t.deleteId;
				_t.$emit('deleteId', null); // 置空deleteId
				_t.$api.delete('asset/assetBusiness/' + catalogId, {}, function (res) {
					switch (res.status) {
						case 200:
							_t.$emit('dialogGroupingSc', false); // 取消弹出层
							_t.$emit('deleteId', null); // 置空deleteId
							_t.addEditss.nodeId = null;
							_t.addEditss.nodeName = null;
							_t.formItem.catalogId = null;
							_t.formItem.catalogName = null;
							_t.getDataTree();
							_t.$bus.emit('getDataTreeSc', true); // 刷新设备导航树

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
			},
		}
	}
</script>

<style scoped>

	.menu1 {
		overflow: hidden;
		width: 180px;
		position: fixed;
		border-radius: 6px;
		border: 1px solid #999999;
		background-color: #f4f4f4;
		z-index: 9999;
	}

	.menu1 li:hover {
		background-color: #1790ff;
		color: white;
	}

	.menu1 .menu1__item {
		display: block;
		color: #252A2F;
		font-size: 12px;
		line-height: 25px;
		border-bottom: 1px solid #ccc;
		text-align: center;
	}

</style>
<style>
	.EquipmentMonitoringGrid .el-dialog {
		width: 812px;
		height: 525px;
	}

	.EquipmentMonitoringBj .el-dialog {
		width: 501px;
		height: 325px;
	}

	.EquipmentMonitoringSc .el-dialog {
		width: 200px;
		height: 180px;
	}
	.Import-dialog .el-dialog {
		width: 500px;
		height: 300px;
	}
</style>
