<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorManage')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.equipmentMonitoring')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.monitorThreshold')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--返回上一级-->
    <div class="padding20" style="padding-bottom: 10px;">
      <div class="grayBg clearfix">
        <div class="fl middle monitor-returnBtn">
          <span class="iconfont">&#xe65a;</span>
          <span>返回设备监测</span>
        </div>
        <el-button class="fr queryBtn" type="primary">{{$t('public.save')}}</el-button>
      </div>
    </div>
    <!--设备信息展示-->
    <div class="clearfix" style="padding:0 20px;">
      <img class="fl" src="../../../assets/img/default.jpg" height="90" width="90"/>
      <div class="fl">
        <el-form inline label-width="96px" label-position="right" class="marginBottom10 monitorThreshold-formBox">
          <el-form-item label="设备名称：">{{equipmentInfoData.deviceName}}</el-form-item>
          <el-form-item label="序列号：">{{equipmentInfoData.servicetag}}</el-form-item>
          <el-form-item label="设备品牌：">{{equipmentInfoData.manufacturer}}</el-form-item>
          <el-form-item label="设备型号：">{{equipmentInfoData.model}}</el-form-item>
          <br>
          <el-form-item label="设备类型：">{{AssetType[equipmentInfoData.type]}}</el-form-item>
          <el-form-item label="带外IP：">{{equipmentInfoData.ip}}</el-form-item>
          <el-form-item label="所在机房：">{{equipmentInfoData.roomName}}</el-form-item>
          <el-form-item label="机架位置：">
            <span>{{equipmentInfoData.frameName}}</span>
            <span v-if="equipmentInfoData.framePosition !== null">,{{equipmentInfoData.framePosition}}U</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--监测指标-->
    <div style="padding: 10px 20px;">
      <div class="grayBg monitorThreshold-title clearfix">
        <div class="fl">
          <span class="title">监测指标</span>
          <span class="title">指标阈值</span>
        </div>
        <div class="fr paddingRight-10">
          <el-button type="text" class="middle marRight10">
            <span class="iconfont verticalAlignMiddle">&#xe64a;</span>
            <span class="verticalAlignMiddle">添加主阈值</span>
          </el-button>
          <el-button type="text" class="middle marRight10">
            <span class="iconfont verticalAlignMiddle">&#xe64a;</span>
            <span class="verticalAlignMiddle">查看默认值</span>
          </el-button>
          <el-button type="text" class="middle">
            <span class="iconfont verticalAlignMiddle">&#xe64a;</span>
            <span class="verticalAlignMiddle">恢复默认值</span>
          </el-button>
        </div>
      </div>
      <!--内容区域-->
      <div class="monitorThreshold-content">
        <!--左侧树形框-->
        <div class="content">
          <el-tree
            class="monitorThreshold-tree"
            @node-click="clickNodeTree"
            :data="treeData"
            node-key="nodeId"
            highlight-current
            :props="defaultProps"/>
        </div>
        <!--右侧表单区-->
        <div class="content">

        </div>
      </div>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  export default {
    name: "monitorThresholdValue",
    components:{Box},
    data() {
      return {
        // 设备基本信息
        equipmentInfoData:{
          deviceName:null,
          servicetag:null,
          manufacturer:null,
          model:null,
          type:null,
          roomName:null,
          ip:null,
          frameName:null,
          framePosition:null
        },
        deviceId:null, // 设备id
        AssetType:{}, // 设备类型字典集合
        treeData:[], // 左侧树形控件
        defaultProps:{
          label:'nodeName',
          children:'children',
          parentId:'parentNodeId'
        }
      }
    },
    methods: {
      // 点击左侧树形节点
      clickNodeTree(data){
        var _t = this;
        _t.$api.get('monitor/deviceMonitorThreshold/all',{
          jsonString: JSON.stringify({
            deviceMonitorThreshold:{
              monitorId:data.nodeId
            }
          })
        },function (res) {
          switch (res.status) {
            case 200:
              console.log(res.data);
              break;
          }
        });
      },
      // 获取设备信息详情
      getInfoData(val){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('asset/assetDevice/' + val,{},function (res) {
          _t.$store.commit('setLoading',false);
          switch(res.status){
            case 200:
              _t.equipmentInfoData = res.data;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      },
      // 获取数据字典
      getBaseData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/map',{
          languageMark:localStorage.getItem('hy-language'),
          dictionaryTypes:['AssetType']
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch(res.status) {
            case 200:
              _t.AssetType = res.data.AssetType;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      },
      // 获取监测阈值目录
      getThresholdTree(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitor/all',{
          jsonString:JSON.stringify({
            deviceMonitor:{
              nodeClass:'tree'
            }
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch(res.status) {
            case 200:
              _t.treeData = res.data.children;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.treeData = [];
              break;
          }
        });
      }
    },
    created() {
      var _t = this;
      _t.$store.commit('setLoading',true);
      _t.deviceId = _t.$route.params.deviceId ? _t.$route.params.deviceId : localStorage.getItem('hy-deviceId');
      this.getInfoData('15608f0bc8be409c979a32b7035d4f98');
      this.getBaseData();
      this.getThresholdTree();
    },
    beforeDestroy() {
      localStorage.removeItem('hy-deviceId');
    }
  }
</script>

<style scoped>
  .monitor-returnBtn {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
  }

  .monitor-returnBtn span {
    vertical-align: middle;
  }

  .monitorThreshold-title {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
  }

  .monitorThreshold-title span.title {
    width: 234px;
    display: inline-block;
    font-weight: bold;
  }

  .monitorThreshold-content {
    position: fixed;
    top: 300px;
    left: 76px;
    right: 20px;
    bottom: 20px;
    z-index: 1;
  }

  .monitorThreshold-content > div.content {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
  }

  .monitorThreshold-content > div.content:nth-child(1) {
    width: 234px;
    left: 0;
  }

  .monitorThreshold-content > div.content:nth-child(2) {
    left: 244px;
    right: 0;
  }
</style>
