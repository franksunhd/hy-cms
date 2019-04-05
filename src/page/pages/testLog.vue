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
          node-key="id"
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
              {{tag.label}}
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
  export default {
    name: "testLog",
    components:{Box},
    data() {
      return {
        treeData: orgArr[0].children,
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        selectArr: [], // 选中的结构
      }
    },
    methods: {
      // 点击获取节点
      clickNode() {
        var _t = this;
        var allNodes = this.$refs.tree.getCheckedNodes(); // 选中的节点
        var selectArr = new Array(); // 最终拼接渲染的数据
        var roleListData = new Array(); // 选中的角色集合
        if (allNodes.length !== 0) { // 选中节点不为空
          allNodes.forEach(function (item) {
            // 节点过滤 过滤 组织节点
            if (item.type == 1) { // 角色节点
              var list = new Array();
              var parentIdArr = new Array();
              var ObjTag = new Object();
              // 以父id为参数
              buildParentList(orgArr);
              findParent(item.id);
              ObjTag.titleThis = parentIdArr.reverse();
              ObjTag.tagThis = item;
              ObjTag.parentId = recursive(orgArr, 'parentId', item.parentId).parentId;
              roleListData.push(ObjTag);

              // 递归找到 id 所对应的 父 id
              function buildParentList(arr) {
                arr.forEach(g => {
                  if (g.parentId != undefined) {
                    let oid = g['id']
                    list[oid] = g['parentId'];
                  }
                  if (g.children != undefined)
                    buildParentList(g['children'])
                });
              }

              // 在新数组中找出
              function findParent(idx) {
                if (list[idx] != undefined) {
                  let pid = list[idx];
                  // 根节点id 为0
                  if (pid != '0') {
                    parentIdArr.push(recursive(orgArr, 'id', pid).label);
                  }
                  findParent(pid)
                }
              }

              // 递归寻找节点 recursive(要查找的集合,要匹配的字段,要匹配的值)
              function recursive(data, node, index) {
                var result, temp; // 返回值和临时变量
                for (var i = 0; i < data.length; i++) {
                  temp = data[i]; // 临时缓存
                  if (temp[node] == index) {
                    result = temp;
                    break;
                  }
                  // 没有找到 继续往下找
                  if (typeof result == 'undefined' && temp['children']) {
                    result = recursive(temp['children'], node, index);
                  }
                }
                return result;
              }
            }
          });
        }
        var roleParentIdList = new Array();
        roleListData.forEach(function (item) {
          roleParentIdList.push(item.parentId);
        });
        // 数组去重 得到去重后的数组
        roleParentIdList = uniq(roleParentIdList);

        function uniq(array) {
          var temp = []; //一个新的临时数组
          for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
              temp.push(array[i]);
            }
          }
          return temp;
        }

        roleParentIdList.forEach(function (item) {
          var titleName = new Object();
          titleName.parentId = item;
          titleName.tags = [];
          titleName.title = [];
          selectArr.push(titleName);
        });
        // console.log(selectArr)
        roleListData.forEach(function (data) {
          selectArr.forEach(function (val) {
            if (data.parentId == val.parentId) {
              val.tags.push(data.tagThis);
              val.title = data.titleThis;
            }
          });
          // console.log(item.tagThis);
        });
        _t.selectArr = selectArr;
        // console.log(selectArr);
        console.log(_t.getResultNode())
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
