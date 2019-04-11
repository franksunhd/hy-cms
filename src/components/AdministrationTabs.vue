<template>
  <Box class="administration-box">
    <!--设备信息-->
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grayBg administration-title"><strong>设备基本信息</strong></div>
        <el-form inline label-width="96px" label-position="right" class="administration-info-box">
          <el-form-item label="设备名称:">MININT-LF81PCF-惠普</el-form-item>
          <el-form-item label="产品名称:">ProLiant DL360 G7</el-form-item>
          <el-form-item label="设备IP:">192.168.8.36</el-form-item>
          <el-form-item label="UUID:">33323137-3731-4336-5534-343</el-form-item>
          <el-form-item label="设备厂商:">HP</el-form-item>
          <el-form-item label="序列号:">6CU4473LL0</el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="grayBg administration-title"><strong>设备整体状态</strong></div>
        <el-form inline label-width="96px" label-position="right" class="administration-info-box">
          <el-form-item label="硬盘状态:">OK</el-form-item>
          <el-form-item label="CPU状态:">OK</el-form-item>
          <el-form-item label="内存状态:">Redundant</el-form-item>
          <el-form-item label="电源状态:">OK</el-form-item>
          <el-form-item label="风扇状态:">Not Redundant</el-form-item>
          <el-form-item label="温度状态:">OK</el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--标签页-->
    <ul class="clearfix" id="administration-tabs-title">
      <li :class="tabsActive == (index + 1) ? 'active' :''"
          v-for="(item,index) in tabsList"
          :key="index"
          @click="clickTabsNode(item)">
        <span>{{item.label}}</span>
      </li>
    </ul>
    <!--标签页具体内容-->
    <div>
      <el-table :data="monitoringDetailsData" ref="table" stripe :row-key="getRowKeys">
        <el-table-column type="expand" header-align="center" align="center" />
        <el-table-column label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status == 1" effect="dark" content="紧急" placement="top-start">
              <span class="iconfont iconfontError">&#xe609;</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == 2" effect="dark" content="紧急" placement="top-start">
              <span class="iconfont iconfontSuccess">&#xe618;</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </Box>
</template>

<script>
  import Box from '../components/Box';
  export default {
    name: "AdministrationTabs",
    components:{Box},
    data() {
      return {
        // 当前激活标签页序号
        tabsActive:1,
        // 标签页渲染列表
        tabsList:[
          {id:1,label:'监测详情'},
          {id:2,label:'告警事件'},
          {id:3,label:'硬件配置'},
          {id:4,label:'网络配置'},
          {id:5,label:'管理信息'},
          {id:6,label:'位置信息'},
          {id:7,label:'维保信息'},
          {id:8,label:'变更信息'}
        ],
        monitoringDetailsData:[
          {
            id:1,
            status:1
          },
          {
            id:2,
            status:2
          },
          {
            id:3,
            status:2
          }
        ], // 监测管理表格数据
      }
    },
    props:{
      // 页面类型 监测管理(1) 和 告警管理(2) 共用
      // tagType:{
      //   type:Number
      // },
      // 页面Id 用于接口请求数据
      pagesId:{
        type:String
      }
    },
    methods: {
      // 点击标签页节点
      clickTabsNode(item){
        console.log(item.id);
        this.tabsActive = item.id;
      },
      getRowKeys(row){
        return row.id;
      },
      getData(){
        this.$refs.table.toggleRowExpansion(this.monitoringDetailsData[0],true);
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>
  .administration-title {
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    padding-left: 10px;
  }

  #administration-tabs-title {
    padding: 5px 10px 0;
    margin-bottom: 16px;
  }

  #administration-tabs-title li {
    width: 100px;
    text-align: center;
    height: 34px;
    line-height: 34px;
    float: left;
    cursor: pointer;
  }

  #administration-tabs-title li > span {
    width: 100%;
    display: inline-block;
    line-height: 20px;
    height: 20px;
    border-right: 1px solid #ddd;
  }

  #administration-tabs-title li.active > span {
    border-right: 0;
  }

  #administration-tabs-title li.active {
    color: #409EFF;
    background-color: #fff;
    border-radius: 10px 10px 0 0;
    position: relative;
  }

  #administration-tabs-title li.active::before,
  #administration-tabs-title li.active::after {
    display: inline-block;
    width: 10px;
    height: 10px;
    content: '';
    position: absolute;
    bottom: 0;
    overflow: hidden;
  }

  #administration-tabs-title li.active::before {
    left: -10px;overflow: hidden;
    border-radius: 0 0 10px 0;
  }

  #administration-tabs-title li.active::after {
    right: -10px;
    border-radius: 0 0 0 10px;
  }
</style>
<style>
  .administration-box .box-wrap {
    padding: 30px 10px 0 10px;
  }

  .administration-info-box .el-form-item {
    width: 49%;
    box-sizing: border-box;
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .administration-info-box .el-form-item .el-form-item__content,
  .administration-info-box .el-form-item .el-form-item__label {
    font-size: 12px;
  }
</style>
