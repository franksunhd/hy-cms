<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.licenseNotice')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <el-form label-width="200px">
        <el-form-item :label="$t('licenseNotice.licenseTime') + '：'">
          <el-radio-group v-model="radio" @change="changeTime">
            <el-radio label="3">3 {{$t('public.months')}}</el-radio>
            <el-radio label="2">2 {{$t('public.months')}}</el-radio>
            <el-radio label="1">1 {{$t('public.month')}}</el-radio>
            <el-radio label="15">15 {{$t('public.days')}}</el-radio>
            <el-radio label="10">10 {{$t('public.days')}}</el-radio>
            <el-radio label="7">7 {{$t('public.days')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('licenseNotice.licenseUser') + '：'">
          <el-button class="queryBtn" type="success" @click="dialogVisible = true">{{$t('licenseNotice.selectUser')}}
          </el-button>
          <!--展示选择的用户数据-->
          <div v-for="(item,index) in listData"> <!--第一层 数据条数的循环-->
            <p>
              <span>{{item.headName}}</span>
              <span v-if="item.branchName !== null">></span>
              <span v-if="item.branchName !== null">{{item.branchName}}</span>
            </p>
            <el-tag
              v-for="(tag,index) in item.headChildren"
              :key="tag.id"
              @close="handleClose(tag)"
              :disable-transitions="true"
              closable>
              {{tag.label}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item :label="$t('licenseNotice.licenseWay') + '：'">
          <el-radio-group v-model="noticeWay" @change="changeWay">
            <el-radio label="1">{{$t('public.message')}}</el-radio>
            <el-radio label="2">{{$t('public.sms')}}</el-radio>
            <el-radio label="3">{{$t('public.email')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="queryBtn">{{$t('public.save')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--选择用户-->
    <el-dialog
      class="licenseNotice-dialog"
      append-to-body
      :title="$t('licenseNotice.selectUser')"
      :visible.sync="dialogVisible">
      <el-tree
        class="licenseNotice-tree"
        :data="treeData"
        show-checkbox
        :props="defaultProps"
        ref="tree" />
      <span slot="footer" class="dialog-footer">
        <el-button class="alertBtn" type="primary" @click="getCheckedNodes">{{$t('public.confirm')}}</el-button>
        <el-button class="alertBtn" @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';

  export default {
    name: "lisence-notice",
    components: {Box},
    data() {
      return {
        radio: '',
        noticeWay: '',
        dialogVisible: false,
        listData: [],
        defaultProps:{
          label:'label',
          children:'children'
        },
        treeData: [
          {
            id: 1,
            label: '集团亚洲总部',
            type: 'branch',
            parentId: null,
            level: 1,
            children: [
              {
                id: 2,
                label: '上海分部',
                type: 'branch',
                parentId: 1,
                level: 2,
                children: [
                  {
                    id: 4,
                    label: '张三',
                    type: 'user',
                    parentId: 2,
                    level: 3,
                  },
                  {
                    id: 5,
                    label: '李四',
                    type: 'user',
                    parentId: 2,
                    level: 3,
                  },
                  {
                    id: 6,
                    label: '王五',
                    type: 'user',
                    parentId: 2,
                    level: 3,
                  },
                ]
              },
              {
                id: 3,
                label: '北京分部',
                type: 'branch',
                parentId: 1,
                level: 2,
                children: [
                  {
                    id: 7,
                    label: '赵六',
                    type: 'user',
                    parentId: 3,
                    level: 3,
                  }
                ]
              },
              {
                id: 10,
                label: '孙强',
                type: 'user',
                parentId: 1,
                level: 2,
              },
              {
                id: 13,
                label: '金流福',
                type: 'user',
                parentId: 1,
                level: 2,
              }
            ]
          },
          {
            id: 8,
            label: '集团欧洲总部',
            type: 'branch',
            parentId: null,
            level: 1,
            children: [
              {
                id: 11,
                label: '雅玛',
                type: 'user',
                parentId: 8,
                level: 2,
              },
              {
                id: 14,
                label: '罗马分部',
                type: 'branch',
                parentId: 8,
                level: 2,
                children: []
              },
              {
                id: 15,
                label: '英国分部',
                type: 'branch',
                parentId: 8,
                level: 2,
                children: [
                  {
                    id: 16,
                    label: '伦敦',
                    type: 'user',
                    parentId: 15,
                    level: 3
                  }
                ]
              }
            ]
          },
          {
            id: 9,
            label: '集团美洲总部',
            type: 'branch',
            parentId: null,
            level: 1,
            children: [
              {
                id: 12,
                label: '三丝',
                type: 'user',
                parentId: 9,
                level: 2
              },
              {
                id: 17,
                label: '美国分部',
                type: 'branch',
                parentId: 9,
                level: 2,
                children: []
              },
              {
                id: 18,
                label: '墨西哥分部',
                type: 'branch',
                parentId: 9,
                level: 2,
                children: [
                  {
                    id: 19,
                    label: '摩卡',
                    type: 'user',
                    parentId: 18,
                    level: 3
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    methods: {
      changeTime() {
        console.log(this.radio);
      },
      changeWay() {
        console.log(this.noticeWay);
      },
      // 获取节点显示数据
      getCheckedNodes() {
        this.dialogVisible = false;
        var listData = new Array(); // 总数据集合
        var allNodes = this.$refs.tree.getCheckedNodes(); // 选中的节点
        if (allNodes.length !== 0) {
          var headOffice = new Array(); // 全体总部人员集合
          var branchOffice = new Array(); // 全体分部人员集合
          // 判断是否 隶属总部 level 2总部 3分部
          for (var i = 0; i < allNodes.length; i++) {
            if (allNodes[i].level === 2 && allNodes[i].type === 'user') {
              headOffice.push(allNodes[i]);
            } else if (allNodes[i].level === 3 && allNodes[i].type === 'user') {
              branchOffice.push(allNodes[i]);
            }
          }
          // 总部
          for (var j = 0; j < this.treeData.length; j++) {
            var obj = new Object();
            var headOfficeArr = new Array();
            for (var k = 0; k < headOffice.length; k++) {
              if (headOffice[k].parentId === this.treeData[j].id) {
                // 拼接各总部直属人员数组
                headOfficeArr.push(headOffice[k]);
              }
            }
            obj.headName = this.treeData[j].label;
            obj.headChildren = headOfficeArr;
            obj.branchName = null;
            obj.branchId = null;
            // 过滤总部下属人员为空的情况
            if (obj.headChildren.length !== 0) {
              listData.push(obj);
            }
          }
          // 分部
          // 查询原数组中所有的分部集合
          var branchNameArr = new Array();
          for (var m = 0; m < this.treeData.length; m++) {
            if (this.treeData[m].children.length !== 0) {
              for (var n = 0; n < this.treeData[m].children.length; n++) {
                if (this.treeData[m].children[n].type !== 'user') {
                  branchNameArr.push(this.treeData[m].children[n]);
                }
              }
            }
          }
          // 拼接各总部下属各分部的数据
          for (var p = 0; p < branchNameArr.length; p++) {
            var objBranch = new Object();
            var branchOfficeArr = new Array();
            // 拼接各分部人员数据
            for (var q = 0; q < branchOffice.length; q++) {
              if (branchOffice[q].parentId === branchNameArr[p].id) {
                branchOfficeArr.push(branchOffice[q]);
              }
            }
            // 各分部 id
            objBranch.branchId = branchNameArr[p].id;
            // 各分部名称
            objBranch.branchName = branchNameArr[p].label;
            // 各分部人员集合
            objBranch.headChildren = branchOfficeArr;
            // 查找该条数据对应的 总部
            for (var x = 0; x < this.treeData.length; x++) {
              if (branchNameArr[p].parentId === this.treeData[x].id) {
                objBranch.headName = this.treeData[x].label;
              }
            }
            // 过滤分部人员为空的情况
            if (branchOfficeArr.length !== 0) {
              listData.push(objBranch);
            }
          }
          this.listData = listData;
          this.result();
        }
      },
      // 删除标签
      handleClose(item) {
        for (var i = 0; i < this.listData.length; i++) {
          var headChildren = this.listData[i].headChildren;
          if (headChildren.length > 1) {
            // 删除本标签
            for (var j = 0; j < headChildren.length; j++) {
              if (item.id === headChildren[j].id) {
                headChildren.splice(j, 1);
                this.result();
                return false;
              }
            }
          } else {
            // 删除本标签之后删除该区域
            // console.log(2);
            for (var k = 0; k < headChildren.length; k++) {
              if (item.id === headChildren[k].id) {
                headChildren.splice(k, 1);
                this.listData.splice(i, 1);
                this.result();
                return false;
              }
            }
          }
        }


      },
      // 剩余人员
      result() {
        // 所有展示的人员集合
        var allNode = new Array();
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].headChildren.length !== 0) {
            for (var j = 0; j < this.listData[i].headChildren.length; j++) {
              allNode.push(this.listData[i].headChildren[j]);
            }
          }
        }
        console.log(allNode);
      }
    },
    created() {

    }
  }
</script>

<style>
  .licenseNotice-dialog .el-dialog {
    width: 700px;
    height: 500px;
  }

  .licenseNotice-tree .el-tree-node__content {
    height: 30px;
    line-height: 30px;
  }
</style>
