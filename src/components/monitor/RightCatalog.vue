<template>
	<div>
		<!--新增设备分组-->
		<el-dialog
			class="EquipmentMonitoringGrid"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			append-to-body
			:title="$t('EquipmentMonitoring.NewDeviceGrouping')"
			:before-close="getAddAssetGroupQx"
			:visible.sync="dialogGrouping">
			<div style="overflow: hidden" @click.stop="CancelEjectlayer">
			<div class="padding20" style="padding-top:0;">
				<label style="padding-right:10px ;">{{$t('EquipmentMonitoring.TheParentNode')}}</label>
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
						readonly slot="reference"
						clearable/>
				</el-popover>
			</div>
			<el-table
				:data="assetCatalogList"
				@row-contextmenu="openDetails"
				border
				align="center"
				indent
				style="width: 100%">
				<el-table-column
					:label="$t('EquipmentMonitoring.TheLineNumbers')" align="center" width="50">
					<template slot-scope="scope">
						{{scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column :label="$t('EquipmentMonitoring.check')" align="center" width="50px">
					<template slot-scope="scope">
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">
								<pre>{{scope.row.verifyMsg}}</pre>
							</div>
							<div style="display: inline-block;">
								<span v-if="scope.row.verify==='error'" style="display: inline-block;" class="iconfont iconfontError">&#xe64e;</span>
								<span v-if="scope.row.verify==='pass'" class="iconfont iconfontSuccess">&#xe648;</span>
							</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column :label="$t('EquipmentMonitoring.TheFirst')" align="center">
					<template slot-scope="scope">
						<el-input
							size="small" v-model="scope.row.amount0"
							:placeholder="$t('EquipmentMonitoring.PleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('EquipmentMonitoring.TheSecond')" align="center">
					<template slot-scope="scope">
						<el-input
							size="small" v-model="scope.row.amount1"
							:placeholder="$t('EquipmentMonitoring.PleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('EquipmentMonitoring.TheThird')" align="center">
					<template slot-scope="scope">
						<el-input
							size="small" v-model="scope.row.amount2"
							:placeholder="$t('EquipmentMonitoring.PleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="$t('EquipmentMonitoring.TheFourth')" align="center">
					<template slot-scope="scope">
						<el-input
							size="small" v-model="scope.row.amount3"
							:placeholder="$t('EquipmentMonitoring.PleaseEnterContent')"></el-input>
					</template>
				</el-table-column>
			</el-table>
			</div>
			<div v-show="dialogGroupingNei">
				<ul id="menu1" class="menu1">
					<li class="menu1__item  cursorPointer">
						<span>{{$t('EquipmentMonitoring.InsertAbove')}}</span>
						<el-input v-model="aboveAddNum" style="width:50px"/>
						<span> {{$t('EquipmentMonitoring.line')}} </span>
						<el-button @click="getClick('above')"> {{$t('EquipmentMonitoring.determine')}}</el-button>
					</li>
					<li class="menu1__item  cursorPointer">
						<span>{{$t('EquipmentMonitoring.BelowTheInsert')}}</span>
						<el-input v-model="belowAddNum" style="width:50px"/>
						<span> {{$t('EquipmentMonitoring.line')}} </span>
						<el-button @click="getClick('below')"> {{$t('EquipmentMonitoring.determine')}}</el-button>
					</li>
					<li class="menu1__item  cursorPointer">
						<span style="display: block;" @click="delClick">{{$t('EquipmentMonitoring.DeleteTheBank')}}</span>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getAddAssetGroup">{{$t('EquipmentMonitoring.determine')}}</el-button>
				<el-button class="alertBtn" @click="getAddAssetGroupQx">{{$t('EquipmentMonitoring.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--编辑设备分组-->
		<el-dialog
			class="EquipmentMonitoringBj" :close-on-click-modal="false"
				:close-on-press-escape="false"
				:before-close="getEditDeviceQx"
				append-to-body
				:title="$t('EquipmentMonitoring.EditDeviceGrouping')"
				:visible.sync="dialogGroupingBj">
			<el-form :model="formItem" inline label-width="150px" :rules="rules" ref="roleName">
				<el-form-item :label="$t('EquipmentMonitoring.TheParentNode') + '：'">
					<el-popover
						trigger="click" placement="bottom-start"
						v-model="isShowComputerPopoverss" ref="popover">
						<el-tree
							highlight-current :expand-on-click-node="false"
							:data="treeData" @node-click="clickRoomNodes" :props="defaultPropsss"/>
						<el-input
							v-model="addEdits.nodeName" style="width: 200px;"
							suffix-icon="el-icon-arrow-down" readonly slot="reference"/>
					</el-popover>
				</el-form-item>
				<el-form-item
					class="star" prop="catalogName"
					:label="$t('EquipmentMonitoring.TheNameOfTheNode') + '：'">
					<el-input v-model="formItem.catalogName" class="width200" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getEditDevice('roleName')">{{$t('EquipmentMonitoring.determine')}}</el-button>
				<el-button class="alertBtn" @click="getEditDeviceQx">{{$t('EquipmentMonitoring.cancel')}}</el-button>
			</div>
		</el-dialog>
		<!--删除设备分组-->
		<el-dialog
			class="EquipmentMonitoringSc"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:title="$t('EquipmentMonitoring.confirmation')"
			:visible.sync="dialogGroupingSc" append-to-body
			:before-close="getRemoveQx" width="30%">
			<span>{{$t('EquipmentMonitoring.AreYouSureYouWantToDeleteTheCurrentRecord')}}?</span>
			<span slot="footer" class="dialog-footer">
				<el-button class="alertBtn" type="primary" @click="getRemove">{{$t('EquipmentMonitoring.determine')}}</el-button>
				<el-button class="alertBtn" @click="getRemoveQx">{{$t('EquipmentMonitoring.cancel')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {isNotNull, isIpNumber, isIpNumbers} from "../../assets/js/validator";

	export default {
		name: "RightClickTheControl",
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
					label: 'nodeName'
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
				assetCatalogList: [{
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}, {
					verify: '',
					verifyMsg: '',
					amount0: '',
					amount1: '',
					amount2: '',
					amount3: ''
				}],
				addEdits: {
					nodeName: '',
					nodeId: '',
					parentId: '',
				},
				addEditss: {
					nodeName: '',
					nodeId: '',
					parentId: '',

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
				_t.isShowComputerPopoversss = false;
			},
			//新增设备分组弹出框点击取消按钮
			getAddAssetGroupQx() {
				var _t = this;
				_t.addEditss.nodeId = '';
				_t.addEditss.nodeName = '-无父级节点-';
				_t.$emit('dialogGrouping', false); // 取消弹出层
				_t.dialogGroupingNei = false;
				//新增设备分组重置表格数据
				var assetCatalogList = new Array();
				for (var i = 0; i < 4; i++) {
					assetCatalogList.push({
						verify: '',
						verifyMsg: '',
						amount0: '',
						amount1: '',
						amount2: '',
						amount3: ''
					});
				}
				_t.assetCatalogList = assetCatalogList;
			},
			//新增设备分组弹出框点击确定按钮接口
			getAddAssetGroup() {
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
				if (undefined != _t.assetCatalogList && null != _t.assetCatalogList && _t.assetCatalogList.length > 0) {
					for (var i = 0; i < _t.assetCatalogList.length; i++) {
						var _one = _t.assetCatalogList[i].amount0.trim();
						var _two = _t.assetCatalogList[i].amount1.trim();
						var _three = _t.assetCatalogList[i].amount2.trim();
						var _four = _t.assetCatalogList[i].amount3.trim();
						_t.assetCatalogList[i].verify = "";
						_t.assetCatalogList[i].verifyMsg = "";
						if (_one.length == 0 && _two.length == 0 && _three.length == 0 && _four.length == 0) {
							_t.assetCatalogList[i].verify = "error";
							_t.assetCatalogList[i].verifyMsg = "该行所有单元格均未录入数据，请删除！";

							//记录校验不通过
							//isPass = false; //空行不做控制  fpg 2019年5月30日

							//直接进行下一行校验
							continue;
						}
						if (_one.length > 0) {
							//一级不为空，则说明上一个一级结束，先封装上一个一级的内容到all中
							_t.packagingGroupDataFun(1);

							_t.assetCatalogList[i].verify = "pass";
							_t.assetCatalogList[i].verifyMsg = "校验通过！";

							//开始记录新一个一级
							_t.packagingGroupData.firstObj = {
								catalogName: _one
							};
						}
						if (_two.length > 0) {
							//二级不为空，则说明上一个二级结束，先封装上一个二级的内容到secondGroup中
							_t.packagingGroupDataFun(2);

							//检查是否存在可挂靠的父级
							var firstObj = _t.packagingGroupData.firstObj;
							if (undefined == firstObj.catalogName || '' == firstObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "\n";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第二级未找到任何可挂靠的第一级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//开始记录新一个二级
								_t.packagingGroupData.secondObj = {
									catalogName: _two
								};
							}
						}
						if (_three.length > 0) {
							//三级不为空，则说明上一个三级结束，先封装上一个三级的内容到thirdGroup中
							_t.packagingGroupDataFun(3);

							//检查是否存在可挂靠的父级
							var secondObj = _t.packagingGroupData.secondObj;
							if (undefined == secondObj.catalogName || '' == secondObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "\n";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第三级未找到任何可挂靠的第二级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//开始记录新一个三级
								_t.packagingGroupData.thirdObj = {
									catalogName: _three
								};
							}
						}
						if (_four.length > 0) {
							//检查是否存在可挂靠的父级
							var thirdObj = _t.packagingGroupData.thirdObj;
							if (undefined == thirdObj.catalogName || '' == thirdObj.catalogName) {
								_t.assetCatalogList[i].verify = "error";
								if (undefined != _t.assetCatalogList[i].verifyMsg && '' != _t.assetCatalogList[i].verifyMsg) {
									_t.assetCatalogList[i].verifyMsg += "\n";
								}
								_t.assetCatalogList[i].verifyMsg += "该行的第四级未找到任何可挂靠的第三级记录，请检查！";

								//记录校验不通过
								isPass = false;
							} else {
								_t.assetCatalogList[i].verify = "pass";
								_t.assetCatalogList[i].verifyMsg = "校验通过！";

								//将四级的内容封装到fourthGroup中
								_t.packagingGroupData.fourthGroup.push({
									catalogName: _four
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
				if (isPass) {
					_t.$message({
						message: '恭喜你，数据校验通过正在保存，请稍后！',
						type: 'success'
					});
					_t.$api.post('/asset/assetCatalog/', {
						parentId: _t.addEditss.nodeId,
						assetCatalogList: _t.packagingGroupData.all
					}, function (res) {
						_t.getDataTree();
						_t.$bus.emit('getDataTreeXz', true); // 刷新设备导航树
						_t.addEditss.nodeId = '';
						_t.addEditss.nodeName = '-无父级节点-';
						/*_t.dialogGrouping = false;*/
						_t.$emit('dialogGrouping', false); // 取消弹出层

						_t.$message({
							message: '恭喜你，数据保存成功！',
							type: 'success'
						});

						//新增设备分组重置表格数据
						var assetCatalogList = new Array();
						for (var i = 0; i < 4; i++) {
							assetCatalogList.push({
								verify: '',
								verifyMsg: '',
								amount0: '',
								amount1: '',
								amount2: '',
								amount3: ''
							});
						}
						_t.assetCatalogList = assetCatalogList;
					})
				} else {
					_t.$alert("数据校验未通过，请完善数据！", "提示!");
				}
			},
			//封装批量新增的设备分组的集合
			packagingGroupDataFun(level) {
				var _t = this.packagingGroupData;
				if (level <= 3 && undefined != _t.thirdObj.catalogName && '' != _t.thirdObj.catalogName) {
					if (_t.fourthGroup.length > 0) {
						_t.thirdObj.assetCatalogList = _t.fourthGroup;
						_t.fourthGroup = [];
					}
					_t.thirdGroup.push(_t.thirdObj);
					_t.thirdObj = {};
				}
				if (level <= 2 && undefined != _t.secondObj.catalogName && '' != _t.secondObj.catalogName) {
					if (_t.thirdGroup.length > 0) {
						_t.secondObj.assetCatalogList = _t.thirdGroup;
						_t.thirdGroup = [];
					}
					_t.secondGroup.push(_t.secondObj);
					_t.secondObj = {};
				}
				if (level <= 1 && undefined != _t.firstObj.catalogName && '' != _t.firstObj.catalogName) {
					if (_t.secondGroup.length > 0) {
						_t.firstObj.assetCatalogList = _t.secondGroup;
						_t.secondGroup = [];
					}
					_t.all.push(_t.firstObj);
					_t.firstObj = {};
				}
			},

			/*----------------------------------结束新增设备分组---------------------------------*/
			//左侧树形数据获取
			getDataTree() {
				var _t = this;
				_t.$api.get('/asset/assetCatalog/all', {}, function (res) {
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
					_t.assetCatalogList.splice(addToIndex, 0, newValue);
				}
			},
			//根据下标删除当前行
			delClick() {
				var _t = this;
				if (_t.assetCatalogList.length < 2) {
					_t.dialogGroupingNei = false;
					_t.$alert("仅剩最后一行不能删除", "提示!");
				} else {
					_t.assetCatalogList.splice(_t.currentRowIndex, 1);
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
				var index = this.assetCatalogList.indexOf(row);
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
				_t.addEdits.nodeName = null;
				_t.addEditss.nodeName = null;
			},
			/*外层新增按钮*/
			getXztree(){
				var _t=this;
				_t.addEditss.nodeName =  '-'+_t.$t('EquipmentMonitoring.JsNoARentNode')+'-';
			},
			/*点击设备编辑按钮查询接口*/
			getBjtree() {
				var _t = this;
				var obj = _t.object;
				_t.addEditss.nodeName = obj.nodeName;
				_t.addEditss.nodeId = obj.nodeId;
				_t.formItem.catalogId = obj.nodeId;
				var id = _t.formItem.catalogId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formItem.catalogName = res.data.catalogName;
							_t.formItem.catalogId = res.data.id;
							_t.addEdits.parentId = res.data.parentId;

							if (_t.addEdits.parentId != null) {
								_t.getBjtreeF();
							} else if (_t.addEdits.parentId == null) {
								_t.addEdits.nodeName = "-无父级节点-"
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
				})
				//业务监测左侧编辑接口



			},
			/*根据parentId查询父级节点*/
			getBjtreeF() {
				var _t = this;
				var id = _t.addEdits.parentId;
				_t.$store.commit('setLoading', true);
				_t.$api.get('/asset/assetCatalog/' + id, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.addEdits.nodeName = res.data.catalogName;
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
						_t.$api.put('/asset/assetCatalog/', {
							catalog: {
								id: _t.formItem.catalogId,
								catalogName: _t.formItem.catalogName
							}
						}, function (res) {
							_t.$store.commit('setLoading', false);
							switch (res.status) {
								case 200:
									_t.$emit('dialogGroupingBj', false); // 取消弹出层
									_t.getDataTree();
									_t.$bus.emit('getDataTreeBj', true); // 刷新设备导航树
									_t.addEdits.nodeName = null;
									_t.addEdits.nodeId = null;
									_t.addEditss.nodeName = null;
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
				_t.$api.delete('/asset/assetCatalog/' + catalogId, {}, function (res) {
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
</style>
