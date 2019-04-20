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
      :check-strictly="true"
    />
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import orgRole from '../../../../assets/js/orga_role';
  import menu from '../../../../assets/js/menuData';
  import {valInDeep,flattenDeepParents,flattenDeep,regDeepParents} from "../../../../assets/js/array";
  import {getMenuWithId,getParent,uniqArr,getChildren} from '../../../../assets/js/recursive';

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
        if (status) {
          var parent = getParent(_t.treeData,node.id,'id','children','parentId');
          parent.forEach(function (item) {
            _t.keys.push(item.id);
          });
          _t.$refs.tree.setCheckedKeys(uniqArr(_t.keys));
        } else {
          _t.keys.forEach(function (item,index) {
            if (item === node.id) {
              _t.keys.splice(index,1);
            }
          });
          var aaa = getChildren(_t.treeData,node.id,'id','children');
          _t.$refs.tree.setChecked(aaa,false);
          // console.log(aaa);
        }
        // console.log(uniqArr(_t.keys));
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
