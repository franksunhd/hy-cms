<!-- 树状选择器 -->
<template>
	<Box>
		<div class="box">
      <!-- <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :render-content="renderContent"> -->
       <!--:title="title"-->
        <!--@addBtn="add"
       @removeBtn="remove"-->
      <transferExtend
        :from_data="fromData"
        :to_data="toData"
        :defaultProps="{ label: 'name', children: 'children' }"
        :defaultCheckedKeys="defaultCheckedKeys"
        :mode="mode"
        filter
        open-all
        default-transfer
        height="540px"
        node_key="id"
        @left-check-change="leftCheckChange"
        @right-check-change="rightCheckChange">
        <span
          slot="title-right"
          class="my-title-right"
          @click="handleTitleRight">自定义内容</span>
      </transferExtend>
    </div>
	</Box>

</template>

<script>
	import transferExtend from './transferExtend';
	import Box from './Box';
	export default {
		name: 'selectTree',
		components: {
			Box,
			transferExtend
		},
		data() {
			return {
				mode: "transfer", // transfer addressList
      fromData: [
        {
          id: 1,
          pid: 0,
          name: "测试左侧",
          children: [
            {
              id: 2,
              pid: 1,
              name: "水电费是打发斯蒂芬斯蒂芬gas噶水电费噶地方死光光",
              // disabled: true,
              children: []
            },
            {
              id: 3,
              pid: 1,
              name: "11-3",
              children: []
            }
            /*    {
              id: 4,
              pid: 1,
              name: "11-4",
              children: [
                {
                  id: 5,
                  pid: 4,
                  name: "11-5",
                  children: [
                    {
                      id: 111,
                      pid: 5,
                      name: "11-111"
                    }
                  ]
                },
                {
                  id: 6,
                  pid: 4,
                  name: "11-6",
                  children: []
                }
              ]
            } */
          ]
        },
        {
          id: 7127,
          pid: 0,
          name: "debug",
          children: [
            {
              id: 71272,
              pid: 7127,
              name: "debug22",
              // disabled: true,
              children: []
            },
            {
              id: 71273,
              pid: 7127,
              name: "debug11",
              children: []
            }
          ]
        }
      ], // 穿梭框 - 源数据 - 树形
      toData: [
        /*  {
          id: 1,
          pid: 0,
          name: "测试左侧",
          children: [
            {
              id: 2,
              pid: 1,
              name: "水电费是打发斯蒂芬斯蒂芬gas噶水电费噶地方死光光",
              children: [
                {
                  id: 22222222,
                  pid: 2,
                  name: "2222222222"
                }
              ]
            }
          ]
        } */
      ], // 穿梭框 - 目标数据 - 树形
      fromArray: [
        {
          id: "1",
          name: "1",
          pid: "0"
        },
        {
          id: "2",
          name: "2",
          pid: "0"
        },
        {
          id: "1-1",
          name: "1-1",
          pid: "1"
        },
        {
          id: "1-2",
          name: "1-2",
          pid: "1"
        },
        {
          id: "1-1-1",
          name: "1-1-1",
          pid: "1-1"
        },
        {
          id: "1-1-1-1",
          name: "1-1-1-1",
          pid: "1-1-1"
        },
        {
          id: "2-1",
          name: "2-1",
          pid: "2"
        },
        {
          id: "2-2",
          name: "2-2",
          pid: "2"
        }
      ],
      toArray: [],
      defaultCheckedKeys: [] // 左侧默认选中数据
			};
		},

		methods: {
			// 左侧源数据选中事件
    leftCheckChange(nodeObj, treeObj) {},
    // 右侧目标数据选中事件
    rightCheckChange(nodeObj, treeObj) {},
    // 自定义节点 仅树形结构支持
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}>
              Append
            </el-button>
            <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>
              Delete
            </el-button>
          </span>
        </span>
      );
    },
    // 标题自定义区点击事件
    handleTitleRight() {
      alert("标题自定义区点击事件");
    }
		},
		computed: {
 
  
 },
		created() {
			this.fromData = [
      {
        id: 1,
        pid: 0,
        name: "关键字",
        children: [
          {
            id: 11,
            pid: 1,
            name: "财务报表",
            disabled: true   //是否禁用
          },
          {
            id: 12,
            pid: 1,
            name: "工资奖金"
          },
          {
            id: 13,
            pid: 1,
            name: "会议纪要"
          }
        ]
      },
      {
        id: 2,
        pid: 0,
        name: "正则",
        children: [
          {
            id: 22,
            pid: 2,
            name: "Email地址"
          },
          {
            id: 23,
            pid: 2,
            name: "MAC地址"
          },
          {
            id: 24,
            pid: 2,
            name: "IPv6地址"
          }
        ]
      },
      {
        id: 3,
        pid: 0,
        name: "标识符",
        children: [
          {
            id: 32,
            pid: 3,
            name: "包含确切数据过滤器模板"
          },
          {
            id: 33,
            pid: 3,
            name: "包含前缀过滤器模板"
          },
          {
            id: 34,
            pid: 3,
            name: "包含后缀过滤器模板"
          }
        ]
      }
    ];
		}
	}
</script>

<style>

</style>
