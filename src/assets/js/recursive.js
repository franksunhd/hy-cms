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

/*
 * 根据传入的菜单id集合,返回带父节点id的集合
 */
export function getMenuWithParentIdByMenuId(allNodes,allSelectedNodes) {
  var selectWithParentIdArr = new Array(); // 返回带父节点id 的集合
  if (allSelectedNodes.length !== 0) {
    allSelectedNodes.forEach(function (item) {
      selectWithParentIdArr.push(item);
      var list = new Array();
      // 以父id为参数
      buildParentList(allNodes);
      findParent(item);

      // 递归找到 id 所对应的 父 id
      function buildParentList(arr) {
        arr.forEach(g => {
          if (g.parentId != undefined) {
            // by ssy
            let oid = g['id']
            // by ssy
            list[oid] = g['parentId'];
          }
          if (g.systemMenuAndLanguageRelationChildList != undefined) {
            buildParentList(g['systemMenuAndLanguageRelationChildList'])
          }
        });
      }
      // 在新数组中找出
      function findParent(idx) {
        if (list[idx] != undefined) {
          let pid = list[idx];
          // 根节点id 为0
          if (pid != null) {
            selectWithParentIdArr.push(pid);
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
          if (typeof result == 'undefined' && temp['systemMenuAndLanguageRelationChildList']) {
            result = recursive(temp['systemMenuAndLanguageRelationChildList'], node, index);
          }
        }
        return result;
      }
    });
  } else {
    selectWithParentIdArr = [];
  }
  // 数组去重 得到去重后的数组
  selectWithParentIdArr = uniq(selectWithParentIdArr);

  function uniq(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  }
  return selectWithParentIdArr;
}


// 根据 id 遍历树节点的所有组节点
export function getParent(treeData, val, id, children, parent) {
  var arrRes = [];
  if (treeData.length === 0) {
    if (!!val) {
      arrRes.unshift(treeData)
    }
    return arrRes;
  }
  let rev = (dataArr, nodeId) => {
    for (var i = 0, length = dataArr.length; i < length; i++) {
      let node = dataArr[i];
      if (node[id] === nodeId) {
        arrRes.unshift(node);
        rev(treeData, node[parent]);
        break;
      }
      else {
        if (!!node[children]) {
          rev(node[children], nodeId);
        }
      }
    }
    return arrRes;
  };
  arrRes = rev(treeData, val);
  return arrRes;
}

// 数组去重
export function uniqArr(arr = []) {
  return arr.filter(function(element,index,self){
    return self.indexOf(element) === index;
  });
}

// 根据 id 遍历树节点的所有子节点
export function getChildren(treeData, val, id, children) {
  var arrRes = new Array();
  var thisArr = valInDeep(treeData, val, id, children);
  var newArr = new Array();
  if (thisArr[0][children] !== undefined) {
    newArr = serverArray(thisArr[0][children],id,children);
    newArr.forEach((item)=>{
      arrRes.push(item[id]);
    });
  }
  return arrRes;
}

// 遍历寻找id 所对饮的集合
function valInDeep(arr = [], val, id, children) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[id] === val ? item : valInDeep(item[children] || [], val, id, children)
    );
  }, []);
}

function serverArray(arr,id,children,newArr = []){
  arr.forEach((item)=>{
    if (item[children]) {
      serverArray(item[children],id,children,newArr);
    }
    newArr.push(item);
  });
  return newArr;
}

// 两个数组做对比 删除相同部分, 返回剩余部分
export function unique (obj, ary) {
  return obj.filter(function(item){
    return ary.indexOf(item) === -1;
  })
}

// 遍历寻找id 所对饮的集合
export function getObjectById(arr = [], val, id, children) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[id] === val ? item : getObjectById(item[children] || [], val, id, children)
    );
  }, []);
}
