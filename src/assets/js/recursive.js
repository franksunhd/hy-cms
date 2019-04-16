/*
* 功能: 返回选中组织结构下的角色列表集合
* 传入参数:
*   allNodes: [type:Array] 所有树节点
*   allSelectedNodes:[type:Array] 树选中的所有节点
*   roleType: [type:Number] 角色节点类型
* 传出参数:
*   selectArr [类型:Array] 选择的各组织结构下的角色
*/
export function queryOrgWithRole(allNodes, allSelectedNodes, roleType) {
  var selectArr = new Array(); // 最终拼接渲染的数据
  var roleListData = new Array(); // 选中的角色集合
  if (allSelectedNodes.length !== 0) { // 选中节点不为空
    allSelectedNodes.forEach(function (item) {
      // 节点过滤 过滤 组织节点
      if (item.level == roleType) { // 角色节点
        var list = new Array();
        var parentIdArr = new Array();
        var ObjTag = new Object();
        // 以父id为参数
        buildParentList(allNodes);
        findParent(item.nodeId);
        ObjTag.titleThis = parentIdArr.reverse();
        ObjTag.tagThis = item;
        // by ssy
        ObjTag.parentNodeId = recursive(allNodes, 'parentNodeId', item.parentNodeId).parentNodeId;
        roleListData.push(ObjTag);

        // 递归找到 id 所对应的 父 id
        function buildParentList(arr) {
          arr.forEach(g => {
            if (g.parentNodeId != undefined) {
              // by ssy
              let oid = g['nodeId']
              // by ssy
              list[oid] = g['parentNodeId'];
            }
            if (g.children != undefined) {
              buildParentList(g['children'])
            }
          });
        }

        // 在新数组中找出
        function findParent(idx) {
          if (list[idx] != undefined) {
            let pid = list[idx];
            // 根节点id 为0
            if (pid != '0') {
              parentIdArr.push(recursive(allNodes, 'nodeId', pid).nodeName);
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
    roleParentIdList.push(item.parentNodeId);
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
  roleListData.forEach(function (data) {
    selectArr.forEach(function (val) {
      if (data.parentNodeId == val.parentId) {
        val.tags.push(data.tagThis);
        val.title = data.titleThis;
      }
    });
  });
  return selectArr;
};

/*
 * 功能: 根据传入的组织id 返回 组织级别 面包屑
 */

export function orgBreadcrumb(allNodes, nodeId) {
  var organizationArr = new Array();
  organizationArr.push(recursive(allNodes, 'nodeId', nodeId).nodeName);
  var list = new Array();
  buildParentList(allNodes);
  findParent(nodeId);

  // 递归找到 id 所对应的 父 id
  function buildParentList(arr) {
    arr.forEach(g => {
      if (g.parentNodeId != undefined) {
        let oid = g['nodeId']
        list[oid] = g['parentNodeId'];
      }
      if (g.children != undefined) {
        buildParentList(g['children'])
      }
    });
  }

  // 在新数组中找出
  function findParent(idx) {
    if (list[idx] != undefined) {
      let pid = list[idx];
      // 根节点id 为0
      if (pid != '0') {
        organizationArr.push(recursive(allNodes, 'nodeId', pid).nodeName);
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
  return organizationArr.reverse();
}

/*
 * 传入id 找到对应的集合,并返回
 * allNodes 需要寻找的集合,
 * nodeId 需要寻找的id
 */

export function returnObjectById(allNodes, nodeId) {
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
      if (typeof result == 'undefined' && temp['systemMenuAndLanguageRelationChildList']) {
        result = recursive(temp['systemMenuAndLanguageRelationChildList'], node, index);
      }
    }
    return result;
  }
  // 返回 菜单id 对应的集合
  return recursive(allNodes, 'id', nodeId);
}
