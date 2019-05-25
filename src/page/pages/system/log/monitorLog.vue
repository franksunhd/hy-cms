<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<el-tree-->
    <!--style="width: 300px;"-->
    <!--:data="treeData"-->
    <!--node-key="id"-->
    <!--show-checkbox-->
    <!--ref="tree"-->
    <!--@check-change="currentChange"-->
    <!--:default-expand-all="true"-->
    <!--:props="defaultProps"-->
    <!--:default-checked-keys="keys"-->
    <!--:check-strictly="true"/>-->
<!--    <div class="padding20 borderBottom">-->
<!--      <el-tag-->
<!--        v-for="(tag,index) in tags"-->
<!--        :key="index"-->
<!--        closable-->
<!--        @close="handleClose(tag)">-->
<!--        {{tag.displayName}}-->
<!--      </el-tag>-->
<!--    </div>-->
<!--    <div class="padding20">-->
<!--      <el-button @click="checkTable(1)">上一页</el-button>-->
<!--      <el-button @click="checkTable(2)">下一页</el-button>-->
<!--      <el-button @click="addData">点击</el-button>-->
<!--      <el-table-->
<!--        ref="table"-->
<!--				stripe-->
<!--				border-->
<!--        @select="selectHandle"-->
<!--        :row-key="getRowKeys"-->
<!--        @select-all="selectHandleAll"-->
<!--        :data="tableData">-->
<!--        <el-table-column :reserve-selection="true" type="selection" fixed/>-->
<!--        <el-table-column prop="displayName" label="姓名"/>-->
<!--        <el-table-column prop="age" label="年龄"/>-->
<!--      </el-table>-->
<!--    </div>-->
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import orgRole from '../../../../assets/js/orga_role';
  import {getParent, uniqArr, getChildren,unique} from '../../../../assets/js/recursive';

  export default {
    name: "monitorLog",
    components: {Box},
    data() {
      return {
        treeData: orgRole.orgRole,
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        keys: [],
        tags: [
          {id: 2, displayName: '李四', age: 28,status:true},
          {id: 6, displayName: '嗯嗯', age: 30,status:true},
          {id: 1, displayName: '王文英', age: 29,status:true},
        ],
        tableData: [],
        tableData1: [
          {id: 1, displayName: '王文英', age: 29,status:false},
          {id: 2, displayName: '李四', age: 28,status:false},
          {id: 3, displayName: '赵柳', age: 30,status:false},
          {id: 4, displayName: '哈哈', age: 29,status:false},

        ],
        tableData2: [
          {id: 5, displayName: '看看', age: 28,status:false},
          {id: 6, displayName: '嗯嗯', age: 30,status:false},
        ]
      }
    },
    methods: {
      addData(){
        var _t = this;
        _t.tags.forEach((item)=>{
        });
      },
      getRowKeys(row){
        return row.id;
      },
      // 点击单行
      selectHandle(selection,row) {
        var _t = this;
        var tags = _t.tags.length === 0 ? [] : _t.tags;
        row.status = row.status == true ? false : true;
        _t.$refs.table.toggleRowSelection(row,row.status);
        if (row.status) {
          _t.tags = _t.uniqArr(_t.hashPushData(selection,tags,'id'));
        } else {
          _t.tags.forEach((item,index)=>{
            if (item.id === row.id) {
              _t.tags.splice(index, 1);
              _t.$refs.table.toggleRowSelection(row,false);
            }
          });
        }
      },
      // 全选
      selectHandleAll(selection){
        var _t = this;
        var tags = _t.tags.length === 0 ? [] : _t.tags;
        if (selection.length !== 0) {
          // 添加
          selection.forEach((item)=>{
            item.status = item.status == false ? true : true;
            _t.$refs.table.toggleRowSelection(item,item.status);
            if (item.status) {
              _t.tags = _t.uniqArr(_t.hashPushData(selection,tags,'id'));
            }
          });
        } else {
          // 删除
          _t.tableData.forEach((item)=>{
            item.status = false;
          });
          _t.tags = unique(_t.tableData,_t.tags);
        }
      },

      // 对比两个数组 没有就添加
      hashPushData(newArr,oldArr,id){
        var _t = this;
        var arr = newArr.concat(oldArr);
        var hash = [];//一定要在这里置空啊
        for (var i = 0; i < arr.length; i++) {
          for (var j = i+1; j < arr.length; j++) {
            if(arr[i][id] === arr[j][id]){
              arr[i].status = true;
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
        for(var i = 0; i < arr.length; i++){
          if(!obj[arr[i].id]){
            result.push(arr[i]);
            obj[arr[i].id] = true;
          }
        }
        return result;
      },
      // 树节点的点击
      currentChange(node, status) {
        var _t = this;
        var nodeChildrenArr = [];
        var keys = new Array();
        var uniqArrKeys = new Array();
        if (status) {
          var parent = getParent(_t.treeData, node.id, 'id', 'children', 'parentId');
          parent.forEach(function (item) {
            keys.push(item.id);
          });
          uniqArrKeys = uniqArr(keys);
          _t.keys = uniqArrKeys;
        } else {
          _t.keys.forEach(function (item, index) {
            if (item === node.id) {
              _t.keys.splice(index, 1);
            }
          });
          // 获取勾选带子级的节点
          nodeChildrenArr = getChildren(_t.treeData, node.id, 'id', 'children');
          // 循环设置取消勾选节点子集的所有节点
          nodeChildrenArr.forEach(function (item) {
            // item key值, false: 不勾选
            _t.$refs.tree.setChecked(item, false, true);
          });
        }
      },
      // 关闭标签
      handleClose(tag) {
        var _t = this;
        _t.tags.splice(_t.tags.indexOf(tag), 1);
        _t.tableData.forEach((item)=>{
          if (item.id === tag.id) {
            item.status = false;
            _t.$refs.table.toggleRowSelection(item,false);
          }
        });
      },
      // 换页
      checkTable(val) {
        var _t = this;
        if (val == 1) {
          _t.tableData = _t.tableData1;
        } else {
          _t.tableData = _t.tableData2;
        }
        _t.$nextTick(()=>{
          _t.tags.forEach((item)=>{
            _t.tableData.forEach((data)=>{
              if (item.id == data.id) {
                data.status = true;
                _t.$refs.table.toggleRowSelection(data,true);
              }
            })
          });
        })
      },
      // 获取数据
      getData(){
        var _t = this;
        _t.$nextTick(()=>{
          _t.tableData = _t.tableData1;
          _t.tags.forEach((item)=>{
            _t.tableData.forEach((data)=>{
              if (item.id == data.id) {
                data.status = true;
                _t.$refs.table.toggleRowSelection(data,true);
              }
            })
          });
        })
      },
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>

</style>
