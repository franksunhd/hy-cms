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
        <div class="fl middle monitor-returnBtn" @click="goBack">
          <span class="iconfont">&#xe65a;</span>
          <span>返回设备监测</span>
        </div>
        <el-button class="fr queryBtn" type="primary">{{$t('public.save')}}</el-button>
      </div>
    </div>
    <!--设备信息展示-->
    <el-row style="padding: 0 20px;">
      <el-col :span="2" style="max-width: 100px;">
        <img class="fl" src="../../../assets/img/default.jpg" height="90" width="90"/>
      </el-col>
      <el-col :span="22">
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
      </el-col>
    </el-row>
    <!--监测指标-->
    <div style="padding: 10px 20px;">
      <div class="grayBg monitorThreshold-title clearfix">
        <div class="fl">
          <span class="title">监测指标</span>
          <span class="title">指标阈值</span>
        </div>
        <div class="fr paddingRight-10">
          <el-button type="text" class="middle marRight10" @click="addMainMonitor">
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
          <el-form inline label-width="96px">
            <!--循环主阀值-->
            <div class="monitor-formItemBox clearfix" v-for="(main,mainIndex) in monitorListArr" :key="mainIndex">
              <el-form-item :label="data === 0 ? '主阈值：' :'从阈值：'" v-for="(item,data) in main.threshold" :key="data">
                <el-select v-model="item.value1" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in valueList1" :key="index" :label="val.label" :value="val.id" />
                </el-select>
                <el-select v-model="item.value2" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in valueList2" :key="index" :label="val.label" :value="val.id" />
                </el-select>
                <el-select v-model="item.value3" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in valueList3" :key="index" :label="val.label" :value="val.id" />
                </el-select>
                <el-input v-model="item.value4" class="width170 marginRight6" clearable />
                <el-button v-if="data === 0" @click="addFromMonitor(mainIndex)" class="addEditBtn">
                  <span class="el-icon-plus"></span>
                </el-button>
                <el-button v-else @click="delFromMonitor(mainIndex,data)" class="addEditBtn"><span class="el-icon-minus"></span></el-button>
                <span v-if="data === 0">从阈值</span>
              </el-form-item>
              <!--告警级别-->
              <el-form-item label="告警级别：">
                <el-select v-model="main.select" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in valueList4" :key="index" :label="val.label" :value="val.id" />
                </el-select>
                <el-input v-model="main.input" style="width: 530px;" clearable placeholder="请输入告警的附加内容..." />
              </el-form-item>
              <el-button type="danger" v-if="mainIndex !== 0" class="monitor-deleteBtn" @click="delMainMonitor(mainIndex)">
                <span class="el-icon-delete"></span>
              </el-button>
            </div>
          </el-form>
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
        },
        // 阀值集合
        monitorListArr:[
          {
            // 主从阀值字段
            threshold:[
              {
                value1:'',
                value2:'',
                value3:'',
                value4:'',
              }
            ],
            select:'',
            input:''
          }
        ],
        valueList1:[], // 阀值下拉框一
        valueList2:[], // 阀值下拉框二
        valueList3:[], // 阀值下拉框三
        valueList4:[], // 告警级别
      }
    },
    methods: {
      // 点击左侧树形节点 获取阀值目录数据
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
      // 获取设备信息详情
      getInfoData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('asset/assetDevice/' + _t.deviceId,{},function (res) {
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
      },
      // 添加从阀值
      addFromMonitor(index){
        var _t = this;
        let Fromthreshold = {
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        };
        _t.monitorListArr[index].threshold.push(Fromthreshold);
      },
      // 添加主阀值
      addMainMonitor(){
        var _t = this;
        let monitorMain = {
          // 主从阀值字段
          threshold:[
            {
              value1:'',
              value2:'',
              value3:'',
              value4:'',
            }
          ],
          select:'',
          input:''
        };
        _t.monitorListArr.push(monitorMain);
      },
      // 删除从阀值
      delFromMonitor(index,i){
        var _t = this;
        _t.monitorListArr[index].threshold.splice(i, 1);
      },
      // 删除主阀值
      delMainMonitor(index) {
        var _t = this;
        _t.monitorListArr.splice(index,1);
      },
      // 返回上一级
      goBack(){
        var _t = this;
        _t.$router.push({name:'EquipmentMonitoring'})
      }
    },
    created() {
      var _t = this;
      _t.$store.commit('setLoading',true);
      _t.deviceId = _t.$route.params.deviceId ? _t.$route.params.deviceId : localStorage.getItem('hy-deviceId');
      this.getInfoData();
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
    cursor: pointer;
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

  .monitor-formItemBox {
    margin-bottom: 10px;
    padding-top: 10px;
    position: relative;
  }

  .monitor-deleteBtn {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
  }

  .monitor-formItemBox:hover .monitor-deleteBtn {
    display: inline-block;
  }

  .addEditBtn {
    width: 30px;
    height: 30px;
    padding: 0;
    line-height: 30px;
    text-align: center;
  }
</style>
