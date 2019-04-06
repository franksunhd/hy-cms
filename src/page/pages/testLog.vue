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
    <el-button type="primary" @click="clickNode">点击</el-button>
    <el-row>
      <el-col :span="8">
        <el-tree
          ref="tree"
          show-checkbox
          node-key="nodeId"
          default-expand-all
          :props="defaultProps"
          :data="treeData">
          <!--<span slot-scope="{node,data}">-->
          <!--<span v-if="data.type == 1">{{data.roleName}}</span>-->
          <!--<span v-if="data.type == 2">{{data.nodeName}}</span>-->
          <!--</span>-->
        </el-tree>
      </el-col>
      <el-col :span="16">
        <div style="border: 1px solid red;padding: 20px;margin-right: 20px;min-height: 500px;">
          <!--循环结构-->
          <div v-for="(item,index) in selectArr" :key="index" style="margin-bottom: 40px;">
            <!--标题部分循环-->
            <p style="font-size: 16px;">
              <template v-for="(k,i) in item.title">
                <span>{{k}}</span>
                <i v-if="i !== item.title.length - 1" class="el-icon-arrow-right"></i>
              </template>
            </p>
            <!--标签部分循环-->
            <el-tag
              style="margin: 10px 10px 0 0;"
              v-for="tag in item.tags"
              :key="tag.id"
              @close="handleClose(tag)"
              closable>
              {{tag.nodeName}}
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  import orgArr from '../../assets/js/orga_role';
  import {queryOrgWithRole} from "../../assets/js/recursive";

  export default {
    name: "testLog",
    components:{Box},
    data() {
      return {
        treeData: orgArr[0].childrenNode,
        defaultProps: {
          label: 'nodeName',
          children: 'childrenNode'
        },
        selectArr: [], // 选中的结构
      }
    },
    methods: {
      // 点击获取节点
      clickNode() {
        var _t = this;
        _t.selectArr = queryOrgWithRole(orgArr, this.$refs.tree.getCheckedNodes(), 1);
      },
      // 删除节点
      handleClose(tag) {
        var _t = this;
        var selectArr = _t.selectArr;
        selectArr.forEach(function (item, index) {
          var tags = item.tags;
          if (tags.length > 1) { // 该区域删除之后还有标签
            tags.forEach(function (val, i) {
              if (tag.nodeId == tags[i].nodeId) {
                tags.splice(i, 1);
                _t.getResultNode();
                return false;
              }
            });
          } else { // 该区域删除之后没有标签了 删除该区域
            tags.forEach(function (val, i) {
              if (tag.nodeId == tags[i].nodeId) {
                tags.splice(i, 1);
                selectArr.splice(index, 1);
                _t.getResultNode();
                return false;
              }
            });
          }
        });
      },
      // 获取剩余节点
      getResultNode() {
        var _t = this;
        var selectArr = _t.selectArr;
        var nodeArr = new Array();
        selectArr.forEach(function (item) {
          if (item.tags.length !== 0) {
            item.tags.forEach(function (val) {
              nodeArr.push(val);
            });
          }
        });
        return nodeArr;
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
