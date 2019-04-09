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
    <el-row>
      <el-col :span="4">
        <p class="dataDictionary-title">
          <a href="javascript:;" @click="clickNode">{{formItem.menuName}}</a>
        </p>
        <el-tree style="width: 200px;" :data="treeData.children" @node-click="getCurrentNode" :props="defaultProps"
                 :expand-on-click-node="false" :default-expand-all="false"/>
      </el-col>
      <el-col :span="20">
        <div class="padding20 borderBottom">
          <!--表单-->
          <el-form :model="formItem" inline>
            <el-form-item :label="$t('dataDictionary.businessCode') + '：'">
              <el-input class="width200" v-model="formItem.businessCode"/>
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
              <el-input class="width200" v-model="formItem.dictionaryName"/>
            </el-form-item>
            <el-form-item :label="$t('dataDictionary.status') + '：'">
              <el-select v-model="formItem.status" class="width200">
                <el-option v-for="item in statusList" :value="item.value" :key="item.key" :label="item.label"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="queryBtn" @click="getData">{{$t('public.query')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="padding20">
          <!--全局操作-->
          <div class="marBottom16">
            <el-button type="warning" class="queryBtn" @click="addDataBtn">
              <i class="el-icon-circle-plus-outline"></i> {{$t('public.add')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.edit" @click="editDataBtn">
              <i class="el-icon-edit-outline"></i> {{$t('public.edit')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.enable" @click="enableData">
              <i class="el-icon-circle-check-outline"></i> {{$t('public.enable')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.disable" @click="disableData">
              <i class="el-icon-circle-close-outline"></i> {{$t('public.disable')}}
            </el-button>
            <el-button class="queryBtn" :disabled="disableBtn.more" @click="deleteData">
              <i class="el-icon-delete"></i> {{$t('public.delete')}}
            </el-button>
          </div>
          <!--表格-->
          <el-table :data="tableData" stripe @select="selectTableNum" @select-all="selectTableNum">
            <el-table-column type="selection" fixed header-align="center" align="center"/>
            <el-table-column :label="$t('public.index')" header-align="center" align="center">
              <template slot-scope="scope">
								<span>
                  {{scope.$index+(options.currentPage - 1) * options.pageSize + 1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="dictionaryType" :label="$t('dataDictionary.dictionaryType')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="basedataName" :label="$t('dataDictionary.dictionaryName')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="dictionaryCode" :label="$t('dataDictionary.businessCode')" width="150"
                             header-align="center" align="center"/>
            <el-table-column prop="level" :label="$t('dataDictionary.directoryLevel')" width="150" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('dataDictionary.sort')" width="150" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="moveUp(scope.row)">上移</el-button>
                <el-button type="text" @click="moveDown(scope.row)">下移</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('dataDictionary.status')" width="150" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enable === true">启用</span>
                <span v-if="scope.row.enable === false" class="disabledStatusColor">禁用</span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" :label="$t('dataDictionary.createName')" width="150" header-align="center"
                             align="center"/>
            <el-table-column :label="$t('dataDictionary.createTime')" width="155" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | dateFilter}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <pages :total='options.total' :currentPage='options.currentPage' :pageSize='options.pageSize'
                 @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    <!--新增编辑-->
    <el-dialog append-to-body :title="$t('dataDictionary.createUpdateDictionary')" :visible.sync="dialogVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="addEdit" inline label-width="150px" :rules="addEdit" ref="ruleForm">
        <el-form-item :label="$t('dataDictionary.parentDictionary') + '：'">
          <el-popover trigger="click" placement="bottom-start" v-model="isShowEditPopover" ref="popover">
            <el-tree :data="treeData.children" highlight-current :expand-on-click-node="false"
                     @node-click="clickNodeAlert" :props="defaultProps"/>
            <el-input v-model="addEdit.nodeName" style="width: 200px;" suffix-icon="el-icon-arrow-down" readonly
                      slot="reference"/>
          </el-popover>

        </el-form-item>
        <el-form-item :label="$t('dataDictionary.dictionaryType') + '：'">
          <el-input v-model="addEdit.dictionaryType"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.businessCode') + '：'">
          <el-input v-model="addEdit.dictionaryCode"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.dictionaryName') + '：'">
          <el-input v-model="addEdit.systemBasedataLanguageList[0].basedataName"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.directoryLevel') + '：'">
          <el-input v-model="addEdit.level"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.orderIndex') + '：'">
          <el-input v-model="addEdit.orderMark"/>
        </el-form-item>
        <el-form-item :label="$t('dataDictionary.statusAlert') + '：'">
          <el-radio-group v-model="addEdit.enable">
            <el-radio :label="1">{{$t('public.enable')}}</el-radio>
            <el-radio :label="0">{{$t('public.disable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="addData" v-if="ifAdd == true">{{$t('public.confirm')}}</el-button>
         <el-button type="primary" class="queryBtn" v-if="ifAdd == false" @click="editData('roleName')">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>import Box from '../../components/Box';
import selectTree from '../../components/selectTree';

export default {
	name: "dataDictionary",
	components: {
		Box,
		selectTree
	},
	data() {
		return {
			ifAdd:false,
			formItem: {
				parentId: '',
				nodeId: null,
				businessCode: null,
				dictionaryName: null,
				status: null,
				menuName: ''
			},
			// 数据默认字段
			defaultProps: {
				parentId: 'parentId', // 父级唯一标识
				value: 'id', // 唯一标识
				label: 'nodeName', // 标签显示
				children: 'children', // 子级
			},
			// 新增 编辑表单
			addEdit: {
			
				nodeName: '', //字典名称
				parentId: "", //父级Id
				nodeId: '', //字典项ID
				level: '', //目录级别
				dictionaryCode: '', //字典项编码
				dictionaryType: '', //字典项类型
				orderMark: '', //顺序
				//状态
				enable:'',
				//status: null,
				systemBasedataLanguageList: [{
					id: "", //字典语言项的ID
					basedataId: "", //字典项的语言ID
					basedataName: "", //字典语言项的语言名称
					languageMark: "zh_CN", //字典语言项的语言标识
					orderMark: 2 //字典语言项的显示顺序
				}]
			},

			// 全局按钮禁用启用
			disableBtn: {
				edit: true,
				enable: true,
				disable: true,
				more: true
			},
			dialogVisible: false,
			isShowEditPopover: false,
			organizationList: [],
			statusList: [{
					label: '启用',
					value: 1
				},
				{
					label: '禁用',
					value: 0
				},
			],
			status: '',

			treeData: {}, // 左侧导航数据
			tableData: [], // 表格数据
			// 表格选中之后数据接收
			checkListValue: [],
			checkListIds: [], // 表格选中的数据id集合
			// 删除数据传参
			checkRoleIds: [],
			assignRoleList: [],
			options: {
				total: 0, // 总条数
				currentPage: 1, // 当前页码
				pageSize: 10, // 每页显示条数
			},
			/*
			                defaultProps: {
			                  label: 'nodeName',
			                  children: 'children'
			                }*/

		}
	},
	methods: {
		// 当前选中条数
		selectTableNum(data) {
			var _t = this;
			switch(data.length) {
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
					data.forEach(function(item) {
						// 启用禁用判断
						if(item.enable === false) {
							_t.disableBtn.enable = false;
						} else if(item.enable === true) {
							_t.disableBtn.disable = false;
						}
						checkListIds.push(item.id);
					});
					_t.checkListIds = checkListIds;
					break;
				default: // 多选
					_t.disableBtn.edit = true;
					_t.disableBtn.more = false;
					var disableFlag = 0,
						enableFlag = 0;
					var checkListIds = new Array();
					for(var i = 0; i < data.length; i++) {
						// 启用禁用判断
						if(data[i].enable === false) {
							disableFlag++;
						} else if(data[i].enable === true) {
							enableFlag++;
						}
						// 选中条数id集合
						checkListIds.push(data[i].id);
					}
					_t.checkListIds = checkListIds;
					if(disableFlag > 0 && enableFlag > 0) {
						_t.disableBtn.enable = true;
						_t.disableBtn.disable = true;
					} else if(disableFlag === 0 && enableFlag > 0) {
						_t.disableBtn.enable = true;
						_t.disableBtn.disable = false;
					} else if(disableFlag > 0 && enableFlag === 0) {
						_t.disableBtn.enable = false;
						_t.disableBtn.disable = true;
					}
					break;
			}
		},
		// 改变当前页码
		handleCurrentChange(val) {
			this.options.currentPage = val;
			this.getData();
		},
		// 启用
		enableData() {
			var _t = this;
			_t.$confirm('请问是否确认启用当前的记录?', _t.$t('public.confirmTip'), {
				confirmButtonText: _t.$t('public.confirm'),
				cancelButtonText: _t.$t('public.close'),
				type: 'warning'
			}).then(() => {
				_t.$store.commit('setLoading', true);
				_t.$api.put('system/basedata/', {
					systemBasedata: {
						id: _t.checkListIds.join(','),
						enable: "true"
					}
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.$alert('恭喜你,当前记录启用成功!', _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm')
							});
							_t.getData();
							_t.getMenuData();
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
			_t.$confirm('请问是否确认禁用当前的记录?', _t.$t('public.confirmTip'), {
				confirmButtonText: _t.$t('public.confirm'),
				cancelButtonText: _t.$t('public.close'),
				type: 'warning'
			}).then(() => {
				_t.$store.commit('setLoading', true);
				_t.$api.put('system/basedata/', {
					systemBasedata: {
						id: _t.checkListIds.join(','),
						enable: false
					}
				}, function(res) {
					switch(res.status) {
						case 200:
							_t.$alert('恭喜你,当前记录禁用成功!', _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm')
							});
							_t.getData();
							_t.getMenuData();
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
			//debugger;
			var _t = this;
			console.log(_t.checkListIds);
			_t.$confirm('请问是否确认删除当前的记录?', _t.$t('public.confirmTip'), {
				confirmButtonText: _t.$t('public.confirm'),
				cancelButtonText: _t.$t('public.close'),
				type: 'warning'
			}).then(() => {
				_t.$store.commit('setLoading', true);
				_t.$api.delete('system/basedata/', {
					jsonString: JSON.stringify({
						basedataIds: _t.checkListIds
					})
				}, function(res) {
					_t.$store.commit('setLoading', false);
					switch(res.status) {
						case 200:
							_t.$alert('删除成功!', _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm')
							});
							_t.getData();
							_t.getMenuData();
							break;
						case 1003: // 无操作权限
						case 1004: // 登录过期
						case 1005: // token过期
						case 1006: // token不通过
							_t.exclude(_t, res.message);
							break;
						case 2007: // 删除失败
							_t.$alert(res.message, _t.$t('public.resultTip'), {
								confirmButtonText: _t.$t('public.confirm')
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
			this.formItem.nodeId = data.nodeId;
			this.getData();
		},
		// 点击系统功能菜单节点
		clickNode() {
			var _t = this;
			_t.formItem.nodeId = _t.treeData.nodeId;
			_t.getData();
		},
		// 获取左侧树状菜单数据
		getMenuData() {
			var _t = this;
			_t.$api.get('system/basedata/all', {
				jsonString: JSON.stringify({
					systemBasedata: {
						/*dictionaryType:"",*/
						languageMark: localStorage.getItem('hy-language')
					},
					currentPage: _t.options.currentPage,
					pageSize: _t.options.pageSize
				})
			}, function(res) {
				console.log(res);
				_t.$store.commit('setLoading', false);
				switch(res.status) {
					case 200:
						_t.treeData = res.data.treeNode;
						_t.formItem.nodeId = res.data.treeNode.nodeId;
						_t.formItem.menuName = res.data.treeNode.nodeName;
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
		// 新增编辑弹出层所属字典下拉框
		clickNodeAlert(val) {
			//console.log(val)
			console.log(val)
			var _t = this;
			_t.addEdit.parentId = val.nodeId;
			_t.addEdit.nodeName = val.nodeName;
			console.log(val.nodeId);
			_t.addEdit.level = val.level + 1;
			_t.isShowEditPopover = false;
		},
		 // 新增按钮
      addDataBtn() {
        var _t = this;
        _t.ifAdd = true;
        _t.dialogVisible = true;
      },
		//新增表格数据
		addData() {
			var _t = this;
			_t.$api.post('system/basedata/', {
				"systemBasedata": {
					"id": null,
					"parentId": _t.addEdit.parentId,
					"dictionaryCode": _t.addEdit.dictionaryCode,
					"dictionaryType": _t.addEdit.dictionaryType,
					"orderMark": _t.addEdit.orderMark,
					'level': _t.addEdit.level,
					"enable": _t.addEdit.enable == null ? null : (_t.addEdit.enable == 1 ? true : false),
					"systemBasedataLanguageList": [{
						"id": null,
						"basedataId": null,
						"basedataName": _t.addEdit.systemBasedataLanguageList[0].basedataName == null ? null : _t.addEdit.systemBasedataLanguageList[0].basedataName.trim(),
						"languageMark": localStorage.getItem('hy-language'),
						"orderMark": 2
					}]
				}
			}, function(res) {
				_t.dialogVisible = false;
				switch(res.status) {
					case 200:
						_t.getMenuData();
						console.log(res);
						_t.tableData = res.data.list;
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
			})
		},
		// 获取表格数据
		getData() {
			var _t = this;
			_t.$api.get('system/basedata/pagelist', {
				jsonString: JSON.stringify({
					systemBasedata: {
						parentId: _t.formItem.nodeId,
						basedataName: _t.formItem.dictionaryName == null ? null : _t.formItem.dictionaryName.trim(),
						dictionaryCode: _t.formItem.businessCode == null ? null : _t.formItem.businessCode.trim(),
						enable: _t.formItem.status == null ? null : (_t.formItem.status == 1 ? true : false),
						languageMark: localStorage.getItem('hy-language')
					},
					currentPage: _t.options.currentPage,
					pageSize: _t.options.pageSize
				})
			}, function(res) {

				switch(res.status) {
					case 200:
						//console.log(res);
						_t.tableData = res.data.list;
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
		// 上移
		moveUp() {

		},
		// 下移
		moveDown() {

		},

		//点击编辑按钮查询接口
		editDataBtn() {
			var _t = this;
			var id = _t.checkListIds;
			_t.$api.get('system/basedata/' + id, {}, function(res) {
				switch(res.status) {
					case 200:
						console.log(res);
						_t.ifAdd = false;
						_t.dialogVisible = true;
						_t.addEdit.nodeId = res.data.id;
						_t.addEdit.parentId = res.data.parentId;
						_t.addEdit.nodeName=_t.addEdit.nodeName;
						_t.addEdit.dictionaryCode = res.data.dictionaryCode;
						_t.addEdit.dictionaryType = res.data.dictionaryType;
						_t.addEdit.orderMark = res.data.orderMark;
						_t.addEdit.level = res.data.level;
						_t.addEdit.enable == null ? null : (_t.addEdit.enable== 1 ? true : false);

						_t.addEdit.systemBasedataLanguageList[0].id = res.data.systemBasedataLanguageList[0].id;
						_t.addEdit.systemBasedataLanguageList[0].basedataName = res.data.systemBasedataLanguageList[0].basedataName;
						_t.addEdit.systemBasedataLanguageList[0].languageMark = res.data.systemBasedataLanguageList[0].languageMark;
						_t.addEdit.systemBasedataLanguageList[0].orderMark = res.data.systemBasedataLanguageList[0].orderMark;

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
		// 编辑提交
		editData() {
			var _t = this;
			_t.$api.put('system/basedata/', {
				"systemBasedata": {
					"id": _t.addEdit.nodeId,
					"parentId": _t.addEdit.parentId,
					"dictionaryCode": _t.addEdit.dictionaryCode,
					"dictionaryType": _t.addEdit.dictionaryType,
					"orderMark": _t.addEdit.orderMark,
					'level': _t.addEdit.level,
					"enable": _t.addEdit.enable == null ? null : (_t.addEdit.enable == 1 ? true : false),
					"systemBasedataLanguageList": [{
						"id": null,
						"basedataId": null,
						"basedataName": _t.addEdit.systemBasedataLanguageList[0].basedataName == null ? null : _t.addEdit.systemBasedataLanguageList[0].basedataName.trim(),
						"languageMark": _t.addEdit.systemBasedataLanguageList[0].languageMark==null?null:localStorage.getItem('hy-language'),
						"orderMark": _t.addEdit.systemBasedataLanguageList[0].orderMark
					}]
				}
			}, function(res) {
				switch(res.status) {
					case 200:
						_t.dialogVisible = false;
						_t.getMenuData();
						//_t.getData();
						break;
					case 1003: // 无操作权限
					case 1004: // 登录过期
					case 1005: // token过期
					case 1006: // token不通过
						_t.exclude(_t, res.message);
						break;
					case 2006:
						_t.$alert(res.message);
						break;
					default:
						_t.dialogVisible = false;
						break;
				}
			});
		},
		
	},

	created() {
		this.$store.commit('setLoading', true);
		this.getMenuData();
	}
}</script>

<style scoped>.dataDictionary-title {
	height: 35px;
	line-height: 35px;
	font-size: 14px;
}

.dataDictionary-title a {
	line-height: 35px;
	display: inline-block;
}</style>
