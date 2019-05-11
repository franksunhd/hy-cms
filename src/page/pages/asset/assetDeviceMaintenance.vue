<template>
	<Box>
		<!-- 左侧导航 -->
		<div id="assetDevice_left" class="assetDevice-navBar" v-show="isLeftShow">
			<div>
				sssssssss
			</div>
			<a href="javascript:;" @click="clickInset" id="assetDevice-navBar-inSet">
				<span class="iconfont">&#xe613;</span>
			</a>
		</div>
		<!-- 点击进行左侧导航的显示隐藏 -->
		<a href="javascript:;" @click="clickOutset" id="assetDevice-navBar-outSet">
			<span class="iconfont">&#xe614;</span>
		</a>
		<!-- 右侧内容 -->
		<div id="assetDevice_right" class="assetDevice-routerView">
			<Box>
				<!--面包屑区域-->
				<div class="Breadcrumb">
					<el-breadcrumb>
						<el-breadcrumb-item>{{$t('breadcrumb.assetManage')}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{$t('breadcrumb.assetDevice')}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="padding20 borderBottom borderBottom_formItem">
					<!--表单-->
					<el-form :model="formItem" inline label-width="120px">

					</el-form>
					<div>dddddddddddd</div>
				</div>
			</Box>
		</div>
	</Box>
</template>

<script>
	import Box from '../../../components/Box';
	import {dateFilterDay, dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

	export default {
		name: "assetDeviceMaintenance",
		components: {Box},
		data() {
			return {
				//左侧导航是否展示
				isLeftShow: true,
				// 查询表单
				formItem: {
					part: null,
					path: null
				},
				// 全局按钮启用禁用判断
				disableBtn: {
					more: true
				},
				// 表格数据
				tableData: [],
				// 缓存表格数据用于纯前端筛选
				tableDataAll: [],
				// 表格数据字典
				dictionaryMap: {
					AlarmSeverity: {},
					MonitorRate: {},
					WorkStatus: {}
				},
				// 表单数据字典
				formBaseData: {
					MonitorRateList: [],
					AlarmSeverityList: []
				},
				checkValueList: [], // 表格选中的数据集合
				// 分页
				options: {
					total: 0, // 总条数
					currentPage: 1, // 当前页码
					pageSize: 10, // 显示条数
				}
			}
		},
		methods: {
			// 重置筛选表单数据
			resetData() {
				var _t = this;
				_t.formItem.part = null;
				_t.formItem.path = null;
			},
			// 收缩
			clickInset() {
				this.isLeftShow = false;
				document.getElementById('assetDevice-navBar-outSet').style.display = 'inline-block';
				document.getElementById('assetDevice_right').style.left = '0';
			},
			// 展开
			clickOutset() {
				this.isLeftShow = true;
				document.getElementById('assetDevice-navBar-outSet').style.display = 'none';
				document.getElementById('assetDevice_right').style.left = '174px';
			},
			// 表格选中的值
			selectTableLine(data) {
				//data 每次传进来的都是当前表格选中的行
				var _t = this;
				if (data.length !== 0) {
					_t.disableBtn.more = false;
				} else {
					_t.disableBtn.more = true;
				}

				var checkValueList = new Array();
				data.forEach((item) => {
					checkValueList.push(item.id);
				});
				_t.checkValueList = checkValueList;
			},
			// 查询表格数据
			getData() {

			},
			// 查询字典集合
			getBaseDataList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/maplist', {
					languageMark: localStorage.getItem('hy-language'),
					dictionaryTypes: ['MonitorRate', 'AlarmSeverity', "WorkStatus"]
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							_t.formBaseData.AlarmSeverityList = res.data.AlarmSeverity;
							_t.formBaseData.MonitorRateList = res.data.MonitorRate;
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.formBaseData.AlarmSeverityList = [];
							_t.formBaseData.MonitorRateList = [];
							break;
					}
				});
			},
			// 查询表格中用于翻译的字典
			getDictionaryMapList() {
				var _t = this;
				_t.$store.commit('setLoading', true);
				_t.$api.post('system/basedata/map', {
					dictionaryTypes: ["MonitorRate", "AlarmSeverity", "WorkStatus"],
					languageMark: localStorage.getItem("hy-language")
				}, function (res) {
					_t.$store.commit('setLoading', false);
					switch (res.status) {
						case 200:
							//设置表格的字典翻译
							_t.dictionaryMap.MonitorRate = res.data.MonitorRate;
							_t.dictionaryMap.AlarmSeverity = res.data.AlarmSeverity;
							_t.dictionaryMap.WorkStatus = res.data.WorkStatus;
							//分页查询表格数据
							_t.getData();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						default:
							_t.dictionaryMap.MonitorRate = {};
							_t.dictionaryMap.AlarmSeverity = {};
							_t.dictionaryMap.WorkStatus = {};
							break;
					}
				});
			},
			// 导出excel数据
			downloadData() {
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
			}
		},
		created() {
			this.$store.commit('setLoading', true);
			//获取查询表单中的相关下拉框的值
			this.getBaseDataList();
			//获取分页表格中的需要用于翻译的字典值
			this.getDictionaryMapList();
		}
	}
</script>

<style scoped>
	.assetDevice-navBar {
		width: 174px;
		position: absolute;
		border-right: 1px solid #eaedf1;
		top: 0;
		left: 0;
		bottom: 0;
	}

	.assetDevice-routerView {
		width: auto;
		position: absolute;
		top: 0;
		left: 174px;
		bottom: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
	}

	#assetDevice-navBar-inSet,
	#assetDevice-navBar-outSet {
		height: 40px;
		width: 20px;
		top: 50%;
		text-align: center;
		line-height: 40px;
		position: fixed;
	}

	#assetDevice-navBar-inSet {
		left: 210px;
		border-radius: 15px 0 0 15px;
	}

	#assetDevice-navBar-outSet {
		left: 56px;
		display: none;
		z-index: 1001;
		border-radius: 0 15px 15px 0;
	}
</style>
