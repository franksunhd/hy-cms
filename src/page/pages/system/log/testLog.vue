<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.testLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tree
      style="width: 300px;"
      :data="treeData"
      node-key="id"
      show-checkbox
      ref="tree"
      @check-change="currentChange"
      :default-expand-all="true"
      :props="defaultProps"
      :default-checked-keys="keys"
      :check-strictly="true"
    />
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import orgRole from '../../../../assets/js/orga_role';
  import menu from '../../../../assets/js/menuData';
  import {valInDeep,flattenDeepParents,flattenDeep,regDeepParents} from "../../../../assets/js/array";
  import {getMenuWithId,getParent,uniqArr,getChildren,unique} from '../../../../assets/js/recursive';

  export default {
    name: "testLog",
    components:{Box},
    data() {
      return {
        treeData:orgRole.orgRole,
        defaultProps:{
          label:'label',
          children:'children'
        },
        keys:[]
      }
    },
    methods: {
      currentChange(node,status){
        var _t = this;
        var nodeChildrenArr = [];
        var keys = new Array();
        var uniqArrKeys = new Array();
        if (status) {
          var parent = getParent(_t.treeData,node.id,'id','children','parentId');
          parent.forEach(function (item) {
            keys.push(item.id);
          });
          uniqArrKeys = uniqArr(keys);
          _t.keys = uniqArrKeys;
        } else {
          _t.keys.forEach(function (item,index) {
            if (item === node.id) {
              _t.keys.splice(index,1);
            }
          });
          // 获取勾选带子级的节点
          nodeChildrenArr = getChildren(_t.treeData,node.id,'id','children');
          // 循环设置取消勾选节点子集的所有节点
          nodeChildrenArr.forEach(function (item) {
            // item key值, false: 不勾选
            _t.$refs.tree.setChecked(item,false,true);
          });
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
