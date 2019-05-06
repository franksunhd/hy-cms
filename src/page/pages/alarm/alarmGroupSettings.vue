<template>
	<Box>
		<!--面包屑区域-->
	    <div class="Breadcrumb">
	      <el-breadcrumb>
	        <el-breadcrumb-item>{{$t('breadcrumb.alarmManagement')}}</el-breadcrumb-item>
	        <el-breadcrumb-item>{{$t('breadcrumb.alarmSettings')}}</el-breadcrumb-item>
	        <el-breadcrumb-item>{{$t('breadcrumb.basicSettings')}}</el-breadcrumb-item>
	        <el-breadcrumb-item>{{$t('breadcrumb.alarmGroupSettings')}}</el-breadcrumb-item>
	      </el-breadcrumb>
	    </div>
	    <!--表单-->
	    <div class="padding20 borderBottom">
	    	<el-form inline :model="formItem">
	    		<el-form-item label="告警组名称：">
	    			<el-input v-model="formItem.groupName" clearable />
	    		</el-form-item>
	    		<el-form-item label="设备IP/名称：">
	    			<el-input v-model="formItem.ip" clearable />
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
	    		<el-button type="warning" @click="addDataBtn" class="queryBtn">
					<i class="el-icon-circle-plus-outline"></i> {{$t('public.add')}}
				</el-button>
				<el-button :disabled="disableBtn.edit" @click="editDataBtn" class="queryBtn">
					<i class="el-icon-edit-outline"></i> {{$t('public.edit')}}
				</el-button>
				<el-button :disabled="disableBtn.more" @click="deleteData" class="queryBtn">
					<i class="el-icon-delete"></i> {{$t('public.delete')}}
				</el-button>
	    	</div>
			<el-table :data="tableData" stripe ref="table">
				<el-table-column type="selection" fixed header-align="left" align="left" />
				<el-table-column width="60px" :label="$t('public.index')" header-align="left" align="left">
					<template slot-scope="scope">
						<span>
			              {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
			            </span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="告警组名称" header-align="left" align="left" />
				<el-table-column prop="assetCount" label="设备总量" header-align="left" align="left" />
				<el-table-column prop="createBy" label="创建人" header-align="left" align="left" />
				<el-table-column label="创建时间" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.createTime | dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="lastModifyBy" label="更新人" header-align="left" align="left" />
				<el-table-column label="更新时间" header-align="left" align="left">
					<template slot-scope="scope">
						<span>{{scope.row.lastModifyTime | dateFilter}}</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<pages :total='options.total' :currentPage='options.currentPage' :page-size="options.pageSize" @handleSizeChangeSub="handleSizeChangeSub" @handleCurrentChangeSub="handleCurrentChange" />
	    </div>
	</Box>
</template>

<script>
	import Box from '../../../components/Box';
	import {dateFilter} from "../../../assets/js/filters";
	export default {
		name:'alarm-group-settings',
		components:{Box},
		data(){
			return {
				// 查询表单
				formItem:{
					groupName:null,
					ip:null
				},
				// 
				disableBtn:{
					edit:true,
					more:true
				},
				// 分页
				options:{
					currentPage:1,
					total:0,
					pageSize:10
				},
				tableData:[], // 表格数据
			}
		},
		methods:{
			// 重置表单数据
			resetData(){
				var _t = this;
				_t.formItem.groupName = null;
				_t.formItem.ip = null;
			},
			// 查询列表数据
			getData(){
				var _t = this;
				_t.$store.commit('setLoading',true);
				_t.$api.get('alarm/noticeGroup/pagelist',{
					jsonString:JSON.stringify({
						alarmNoticeGroup:{
							name:_t.formItem.groupName == null ?  null : (_t.formItem.groupName.trim() == '' ? null : _t.formItem.groupName.trim()),
							assetName:_t.formItem.ip == null ? null : (_t.formItem.ip.trim() == '' ? null : _t.formItem.ip.trim())
						},
						currentPage:_t.options.currentPage,
						pageSize:_t.options.pageSize
					})
				},function(res){
					_t.$store.commit('setLoading',false);
					switch(res.status) {
						case 200:
							console.log(res.data);
							_t.tableData = res.data.list;
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
			// 添加按钮
			addDataBtn(){
				
			},
			// 编辑按钮
			editDataBtn(){
				
			},
			// 删除按钮
			deleteData(){
				
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
		},
		created(){
			this.$store.commit('setLoading',true);
			this.getData();
		}
	}
</script>

<style scoped>
</style>