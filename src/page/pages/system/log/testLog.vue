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
    <div v-if="false">
      <el-row :gutter="30">
        <el-col :span="12">
          <div style="border: 1px solid red;padding: 20px;margin-right: 20px;margin-bottom: 20px;">
            <el-tree
              ref="orgList"
              node-key="nodeId"
              @node-click="clickNodeAlert"
              default-expand-all
              :expand-on-click-node="false"
              :props="orgList"
              :data="organizationList"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="border: 1px solid red;padding: 20px;margin-right: 20px;margin-bottom: 20px;">
            <p style="font-size: 16px;">
              <template v-for="(item,index) in organizationName">
                <span>{{item}}</span>
                <i v-if="index !== organizationName.length - 1" class="el-icon-arrow-right"></i>
              </template>
            </p>
          </div>
        </el-col>
      </el-row>
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
    </div>
    <!--动态编辑标签页-->
    <el-button @click="addTab(editableTabsValue2)">点击</el-button>

    <el-tabs v-model="editableTabsValue2" type="card" tab-position="bottom" closable @tab-remove="removeTab">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in editableTabs2"
        :label="item.title"
        :name="item.name">
        <AdministrationTags :pages-id="item.content" />
      </el-tab-pane>
    </el-tabs>
  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import orgArr from '../../../../assets/js/orga_role';
  import {queryOrgWithRole, orgBreadcrumb} from "../../../../assets/js/recursive";
  import AdministrationTags from '../../../../components/AdministrationTabs';

  export default {
    name: "testLog",
    components:{Box,AdministrationTags},
    data() {
      return {
        treeData: orgArr.orgRole[0].childrenNode,
        defaultProps: {
          label: 'nodeName',
          children: 'childrenNode'
        },
        orgList: {
          label: 'nodeName',
          children: 'children',
        },
        selectArr: [], // 选中组织角色的结构
        organizationList: orgArr.organizationList.children, // 所属组织下拉列表
        organizationName: [],


        editableTabsValue2: '2',
        editableTabs2: [{
          title: 'Tab 1',
          name: '1',
          content: '1'
        }, {
          title: 'Tab 2',
          name: '2',
          content: '2'
        }],
        tabIndex: 2
      }
    },
    methods: {
      // 点击获取节点
      clickNode() {
        var _t = this;
        _t.selectArr = queryOrgWithRole(orgArr.orgRole, this.$refs.tree.getCheckedNodes(), 1);
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
      },
      // 点击树节点
      clickNodeAlert(val) {
        var _t = this;
        _t.organizationName = orgBreadcrumb(orgArr.organizationList.children, val.nodeId);
      },

      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs2.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue2 = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
