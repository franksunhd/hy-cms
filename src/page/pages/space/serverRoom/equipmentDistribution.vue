<template>
	<Box>
		<!--面包屑区域-->
		<div class="Breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerRoomManagement')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.ComputerConfiguration')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.rackRoomDistribution')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('breadcrumb.equipmentDistribution')}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="bigBox">
			<!--内容区域-->
			<div class="borderRightColorGray equipmentDistribution_leftBox">
				<div class="rack-box">
					<div class="rack-top">
						<img src="./../../../../../static/rack/rack-top.png" alt="">
					</div>
					<div class="rack-middle">
						<div class="rack-position" v-for="(item,index) in rackPositionCount">
							<div class="position-left clearfix">
								<span>{{rackPositionCount - index}}</span>
							</div>
							<div class="position-asset clearfix">
								<img v-if="(rackPositionCount - index)%10 == 0" src="./../../../../../static/rack/rack-interlayer.png">
							</div>
							<div class="position-right clearfix">
							</div>
						</div>
					</div>
					<!--定位表层-->
					<div class="rack-middle_pos">
						<ul v-if="item.rackPosition !==null" v-for="(item,index) in tableData"
							:key="index"
							:id="'rack_'+index"
							@mouseover="OverMouse(item,$event)"
							@mouseout="OutMouse"
							@click="rackClick(item)"
							class="rack_posClass">
							<li>
								<img src="./../../../../../static/rack/arrow.png" alt="">
							</li>
							<li>
								<img v-if="item.imgPath!==null"
									 :src="rootUrl+item.imgPath"
									 :height="(14*(item.occupyUcount)) + 'px'" alt="">
								<img v-else
									 :src="rootUrl+'/static/asset/pictures/common/'+item.occupyUcount+'U.png'"
									 :height="(14*(item.occupyUcount)) + 'px'" alt="">
							</li>
							<li>
								<span v-if="item.status == 99" class="iconfont fs14 iconfontError">&#xe64a;</span>
								<span v-if="item.status == 66" class="iconfont fs14 iconfontWarn">&#xe649;</span>
								<span v-if="item.status == 22" class="iconfont fs14 iconfontLightBlue">&#xe64f;</span>
								<span v-if="item.status == 11" class="iconfont fs14 iconfontDisable">&#xe64b;</span>
								<span v-if="item.status == 33" class="iconfont fs14 iconfontSuccess">&#xe648;</span>
							</li>
							<li>
								<img src="./../../../../../static/rack/set.png" alt="">
							</li>
						</ul>
						<div class="form_pos" v-if="isshow" id="rackCol">
							<el-form label-width="100px" initial>
								<el-form-item :label="$t('equipmentDistribution.formDeviceName') + '：'">
									<span>{{forsItem.deviceName}}</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formRackManufacturer') + '：'">
									<span>{{forsItem.manufacturer}}</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formModel') + '：'">
									<span>{{forsItem.model}}</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formServiceTag') + '：'">
									<span>{{forsItem.servicetag}}</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formRackPosition') + '：'">
									<span>{{forsItem.rackPosition}}U</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formIP') + '：'">
									<span>{{forsItem.ip}}</span>
								</el-form-item>
								<el-form-item :label="$t('equipmentDistribution.formCreateBy') + '：'">
									<span>{{forsItem.createBy}}</span>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<div class="rack-bottom">
						<img src="./../../../../../static/rack/rack-bottom.png" alt="">
					</div>
				</div>
			</div>
			<div class="equipmentDistribution_rightBox">
				<div class="padding20">
					<!--表单-->
					<el-form inline :model="formItem">
						<el-form-item :label="$t('equipmentDistribution.formDataCenterName') + '：'">
							<span class="marginRight20">{{formItem.dataCenterName}}</span>
						</el-form-item>
						<el-form-item :label="$t('equipmentDistribution.formDataCenterRoomName') + '：'">
							<span class="marginRight20">{{formItem.roomName}}</span>
						</el-form-item>
						<el-form-item :label="$t('equipmentDistribution.formDataCenterUser') + '：'">
							<span>{{formItem.chargeBy}}</span>
							<span class="marginRight20" v-if="formItem.mobile !== null">({{formItem.mobile}})</span>
						</el-form-item>
						<el-form-item class="fr" style="margin-right: 0;">
							<el-button type="primary" class="alertBtn" @click="goBack">{{$t('public.goBack')}}</el-button>
						</el-form-item>
					</el-form>
					<!--机柜表单-->
					<div class="equipmentDistribution_borderBox">
						<el-form inline :model="formItem">
							<el-row>
								<el-col :span="6">
									<el-form-item :label="$t('equipmentDistribution.formRackName') + '：'">
										<span>{{formItem.name}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item :label="$t('equipmentDistribution.formRackRowCol') + '：'">
										<span>{{formItem.rackRow}}{{$t('equipmentDistribution.formRow')}}</span>
										<span>,{{formItem.rackColumn}}{{$t('equipmentDistribution.formColumn')}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item :label="$t('equipmentDistribution.formRackManufacturer') + '：'">
										<span>{{formItem.manufacturer}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item :label="$t('equipmentDistribution.formRackUNum') + '：'">
										<span>{{formItem.ucount}}</span>
										<span v-if="formItem.ucount !== null">U</span>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<p class="columnTitle marBottom16">{{$t('equipmentDistribution.columnTitle')}}</p>
					<el-table :data="tableData" stripe border  @row-click="openDetails">
						<!-- 纳管状态 -->
						<el-table-column
							:label="$t('equipmentDistribution.columnStatus')"
							align="center" header-align="center" width="100px">
							<template slot-scope="scope">
								<span v-if="scope.row.monitorStatus === 1"
									  class="iconfontSuccess">{{$t('equipmentDistribution.columnStatusIsTrue')}}</span>
								<span v-else
									  class="iconfontError">{{$t('equipmentDistribution.columnStatusIsFalse')}}</span>
							</template>
						</el-table-column>
						<!-- 所在位置 -->
						<el-table-column
							:label="$t('equipmentDistribution.columnLocation')"
							align="left" header-align="left" width="130px">
							<template slot-scope="scope">
								<span>{{scope.row.rackPosition}}</span>
								<span v-if="scope.row.rackPosition !== null">U</span>
							</template>
						</el-table-column>
						<!-- 设备信息 -->
						<el-table-column
							:label="$t('equipmentDistribution.columnEquipment')"
							align="left" header-align="left" width="300px">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="left-start">
									<div slot="content">
										<span>{{scope.row.deviceName}}</span>
										<span v-if="scope.row.ip !== null">({{scope.row.ip}})</span>
									</div>
									<div>
										<span>{{scope.row.deviceName}}</span>
										<span v-if="scope.row.ip !== null">({{scope.row.ip}})</span>
									</div>
								</el-tooltip>
							</template>
						</el-table-column>
						<!-- U数 -->
						<el-table-column
							align="left" header-align="left" width="100px"
							label="U数">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="left-start">
									<div slot="content">{{scope.row.occupyUcount}}</div>
									<span>{{scope.row.occupyUcount}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!-- 厂商 -->
						<el-table-column
							align="left" header-align="left" width="120px"
							:label="$t('equipmentDistribution.columnManufacturer')">
							<template slot-scope="scope">
								<el-tooltip :content="scope.row.manufacturer" effect="dark" placement="left-start">
									<span>{{scope.row.manufacturer}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!-- 型号 -->
						<el-table-column
							align="left" header-align="left"
							:label="$t('equipmentDistribution.columnModel')">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="left-start" :content="scope.row.model">
									<span v-if="scope.row.model!==null">{{scope.row.model}}</span>
									<span v-else>N/A</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!-- 设备类型 -->
						<el-table-column
							:label="$t('equipmentDistribution.columnType')" align="left"
							header-align="left">
							<template slot-scope="scope">
								<el-tooltip
									:content="AssetType[scope.row.type]"
									effect="dark" placement="left-start">
									<span>{{AssetType[scope.row.type]}}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<!-- 负责人 -->
						<el-table-column :label="$t('equipmentDistribution.columnChargeBy')" align="left" width="100px" header-align="left">
							<template slot-scope="scope">
								<el-tooltip effect="dark" placement="left-start">
									<div slot="content">
										<span v-if="scope.row.chargeBy!==null&&scope.row.chargeBy!==''">{{scope.row.chargeBy}}</span>
										<span v-else>N/A</span>
									</div>
									<span v-if="scope.row.chargeBy!==null&&scope.row.chargeBy!==''">{{scope.row.chargeBy}}</span>
									<span v-else>N/A</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!--标签页-->
		<AdministrationTags
			@changePageDeviceId="changePageDeviceId"
			:page-device-name="pageDeviceName"
			:page-device-id="pageDeviceId"/>
	</Box>
</template>

<script>
	import Box from '../../../../components/common/Box';
	import AdministrationTags from '../../../../components/monitor/AdministrationTabs';

	export default {
		name: "equipmentDistribution",
		components: {Box,AdministrationTags},
		data() {
			return {
				isshow:false,
				//ul默认高度
				/*UlHeights:'14',*/
				formItem: {
					rackId: '',
					dataCenterName: '',
					roomName: '',
					chargeBy: '',
					mobile: null,
					name: '',
					rackRow: null,
					rackColumn: null,
					manufacturer: '',
					ucount: null
				},
				tableData: [], // 表格数据
				AssetType: {},
				rackPositionCount: 42, //当前机柜的U数
				rootUrl: this.$api.root(),
				forsItem:{
					servicetag:null,
					manufacturer:null,
					model:null,
					ip:null,
					rackPosition:null,
					deviceName:null,
					createBy:null,
				},
				timer: null, //记录定时器
				pageDeviceId: '',
				pageDeviceName: '',
			}
		},
		methods: {
			//鼠标移入事件
			OverMouse(item,event){
				//屏幕可用高度
				var clientHeight = event.path[12].clientHeight;
				var clientY = event.clientY;
				var _t=this;
				_t.isshow=true;
				//序列号
				_t.forsItem.servicetag= item.servicetag;
				//厂商
				_t.forsItem.manufacturer= item.manufacturer;
				//型号
				_t.forsItem.model= item.model;
				//ip
				_t.forsItem.ip= item.ip;
				//所在位置
				_t.forsItem.rackPosition= item.rackPosition;
				//设备名称
				_t.forsItem.deviceName= item.deviceName;
				//负责人
				_t.forsItem.createBy= item.createBy;
				_t.$nextTick(function(){
					var posTop = document.getElementById("rackCol");
					if(clientY+300>=clientHeight){
						posTop.style.top = clientHeight-310+'px';
					}else {
						posTop.style.top = clientY-50+'px';
					}
				})
			},
			//鼠标移出事件
			OutMouse(){
				var _t=this;
				_t.isshow=false;
				//序列号
				_t.forsItem.servicetag= null;
				//厂商
				_t.forsItem.manufacturer= null;
				//型号
				_t.forsItem.model= null;
				//ip
				_t.forsItem.ip= null;
				//所在位置
				_t.forsItem.rackPosition= null;
				//设备名称
				_t.forsItem.deviceName= null;
				//负责人
				_t.forsItem.createBy= null;
			},
			//点击机柜分布图
			rackClick(item){
				var _t=this;
				if (item.id !== null) {
					_t.pageDeviceId = item.id;
					_t.pageDeviceName = item.deviceName;
				}
			},
			//点击表格行事件
			openDetails (row) {
				var _t=this;
				if (row.id !== null) {
					_t.pageDeviceId = row.id;
					_t.pageDeviceName = row.deviceName;
				}
			},
			// 接收组件中传回的设备id
			changePageDeviceId(val) {
				var _t = this;
				_t.pageDeviceId = val;
			},
			//动态修改样式
			changeFixed() {
				var _t = this;
				for (var i = 0; i < _t.tableData.length; i++) {
					var btm = document.getElementById('rack_' + i);
					if (_t.tableData[i].occupyUcount && _t.tableData[i].occupyUcount !== null) {
						_t.tableData[i].occupyUcount = _t.tableData[i].occupyUcount.toString();
					} else {
						_t.tableData[i].occupyUcount = '';
					}
					if (_t.tableData[i].rackPosition !== null) {
						btm.style.bottom = (_t.tableData[i].rackPosition) * 14 + 'px';
					}
				}
			},
			// 获取
			getData() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.get('asset/assetRack/' + _t.formItem.rackId, {}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							if (res.data !== null) {
								_t.formItem.dataCenterName = res.data.dataCenterName; // 数据中心
								_t.formItem.roomName = res.data.roomName; // 机房名称
								_t.formItem.chargeBy = res.data.chargeByName1; // 责任人
								_t.formItem.mobile = res.data.mobile1; // 责任人手机
								_t.formItem.name = res.data.name; // 机柜名称
								_t.formItem.rackRow = res.data.rackRow; // 所在行
								_t.formItem.rackColumn = res.data.rackColumn; // 所在列
								_t.formItem.manufacturer = res.data.manufacturer; // 机柜厂商
								_t.formItem.ucount = res.data.ucount; // u数
								_t.tableData = res.data.assetDeviceList === null ? [] : res.data.assetDeviceList;
								_t.rackPositionCount = res.data.ucount === null ? 19 : res.data.ucount; // 若U数为空则默认构建一个19U的机柜视图
							}
							_t.$nextTick(function () {
								_t.changeFixed();
							});
							break;
						default:
							_t.formItem.rackId = '';
							_t.formItem.dataCenterName = '';
							_t.formItem.roomName = '';
							_t.formItem.chargeBy = '';
							_t.formItem.mobile = null;
							_t.formItem.name = '';
							_t.formItem.rackRow = null;
							_t.formItem.rackColumn = null;
							_t.formItem.manufacturer = '';
							_t.formItem.ucount = null;
							_t.tableData = [];
							break;
					}
				});
			},
			// 获取字典
			getBaseData() {
				var _t = this;
				_t.$api.post('system/basedata/map', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['AssetType', 'DeviceMonitorStatus', 'AlarmHandleStatus', 'AlarmSeverity']
				}, function (res) {
					switch (res.status) {
						case 200:
							if (res.data !== null && res.data.AssetType !== null) {
								_t.AssetType = res.data.AssetType;
								_t.getData();
							}
							break;
						default:
							_t.AssetType = {};
							break;
					}
				});
			},
			// 返回上一级
			goBack() {
				this.$router.go(-1);
			}
		},
		created() {
			var _t = this;
			_t.$store.commit('setLoading', true);
			_t.formItem.rackId = _t.$route.params.rackId ? _t.$route.params.rackId : localStorage.getItem('hy-rack-id');
			_t.getBaseData();
		}
	}
</script>
<style scoped>
	.bigBox {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: visible;
	}

	/*左侧内容区*/
	.equipmentDistribution_leftBox {
		width: 230px;
		overflow-y: auto;
	}

	/*机柜区域*/
	.equipmentDistribution_leftBox .rack-box {
		position: relative;
		width: 191px;
		left:17px;
		border: none;
	}

	/*机柜的头部*/
	.equipmentDistribution_leftBox .rack-box .rack-top {
		border: none;
	}

	/*机柜的U位区*/
	.equipmentDistribution_leftBox .rack-box .rack-middle {
		border: none;
		background-color: #000;
	}

	/*机柜的单个U位*/
	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position {
		border: none;
		height: 14px;
	}

	/*机柜单个U位左侧*/
	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position .position-left {
		border: none;
		float: left;
		background: url("./../../../../../static/rack/rack-left.png");
		width: 32px;
		height: 14px;
	}

	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position .position-left span {
		float: right;
		width: 28px;
		margin-right: 3px;
		display: inline-block;
		color: white;
		font-size: 12px;
		text-align: right;
		vertical-align: middle;
	}

	/*机柜单个U位中间设备区*/
	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position .position-asset {
		border: none;
		float: left;
		vertical-align: top;
		width: 127px;
		height: 14px;
	}

	/*机柜单个U位右侧*/
	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position .position-right {
		border: none;
		float: left;
		background: url("./../../../../../static/rack/rack-right.png");
		width: 32px;
		height: 14px;
	}

	.equipmentDistribution_leftBox .rack-box .rack-middle .rack-position .position-right span {
		font-size: 12px;
		margin-left: 3px;
	}

	/*表层*/
	.rack-middle_pos {
		position: absolute;
		top: 27px;
		left: 0;
		right: 0;
		bottom: 24px;
	}

	.rack-middle_pos ul {
		position: absolute;
		left: 0;
		right: 0;
		top: initial;
		overflow: hidden;
		cursor: pointer;
	}

	.rack-middle_pos ul li:first-child {
		width: 32px;
		font-size: 0;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.rack-middle_pos ul li:first-child img {
		width: 14px;
		height: 14px;
		display: none;
	}

	.rack-middle_pos > ul:hover > li:nth-child(1) > img {
		display: block;
	}

	.rack-middle_pos ul li:nth-child(2) {
		width: 127px;
		margin-left: 32px;

	}

	.rack-middle_pos ul li:nth-child(2) img {
		width: 127px;
	}

	.rack-middle_pos ul li:nth-child(3) {
		width: 14px;
		position: absolute;
		bottom: -2px;
		right: 15px;
	}

	.rack-middle_pos ul li:nth-child(3) span {
		cursor: pointer;
	}
	.rack-middle_pos ul li:nth-child(4) {
		width: 14px;
		position: absolute;
		bottom: 0;
		right: 0;
	}
	.rack-middle_pos ul li:nth-child(4) img {
		width: 14px;
		height: 14px;
		display: none;
	}

	.rack-middle_pos > ul:hover > li:nth-child(4) > img {
		display: block;
	}
	.form_pos {
		width: 250px;
		height: 300px;
		position: fixed;
		left:264px;
		z-index: 9999;
		color: #000;
		background-color: #f6f8fa;
		border-radius: 10px;
		box-shadow: 4px 4px 8px #8F8F8F;
	}

	.equipmentDistribution_rightBox {
		position: absolute;
		top: 50px;
		left: 226px;
		right: 0;
		bottom: 0;
		overflow: auto;
	}

	.equipmentDistribution_borderBox {
		border: 1px solid #e1e1e1;
		padding: 10px 20px;
	}

	.equipmentDistribution_rightBox .columnTitle {
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		color: #252a2f;
	}
</style>
<style>
	.equipmentDistribution_borderBox .el-form--inline .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
	}
	.form_pos .el-form-item{
		margin-bottom: 0;
		margin-top: 10px;
	}
	.form_pos .el-form-item:first-child{
		margin-bottom: 0;
		margin-top: 15px;
	}

</style>
