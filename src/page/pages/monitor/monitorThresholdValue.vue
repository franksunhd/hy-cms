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
    <!--设备信息展示-->
    <el-row style="padding: 10px 20px 0;">
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
          <el-button type="text" class="middle marRight10 positionRelative">
            <span class="iconfont verticalAlignMiddle">&#xe64a;</span>
            <span class="verticalAlignMiddle" @mouseenter="isShowDefaultBox = true" @mouseleave="isShowDefaultBox = false">查看默认值</span>
            <!--查看默认值区域-->
            <div class="showDefaultBox" v-if="isShowDefaultBox">
              <p style="text-align: left;">
                <span>指标</span>
                <span class="el-button--text">【Ping 192.168.9.27】</span>
                <span>的默认阈值</span>
              </p>
              <el-form :model="showDefault" label-width="70px" class="marginBottom10">
                <el-form-item label="主阈值：" class="textAlignLeft">
                  <el-select :disabled="isShowDefault" v-model="showDefault.monitorClass" class="width170 marginRight6" clearable>
                    <el-option v-for="(val,index) in monitorMainList" :key="index" :label="val.name" :value="val.nodeClass" />
                  </el-select>
                  <el-select :disabled="isShowDefault" v-model="showDefault.perf" class="width170 marginRight6" clearable>
                    <el-option v-for="(val,index) in resultArrList" :key="index" :label="val.label" :value="val.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="" class="textAlignLeft">
                  <el-select :disabled="isShowDefault" v-model="showDefault.op" class="width170 marginRight6" clearable>
                    <el-option v-for="(val,index) in baseDataThresholdOp" :key="index" :label="val.name" :value="val.type" />
                  </el-select>
                  <el-input :disabled="isShowDefault" v-model="showDefault.threshold" class="width170 marginRight6" clearable />
                </el-form-item>
                <el-form-item label="告警级别：" class="textAlignLeft">
                  <el-select :disabled="isShowDefault" v-model="showDefault.alarmLevel" class="width170 marginRight6" clearable>
                    <el-option v-for="(val,index) in AlarmSeverity" :key="index" :label="val.name" :value="val.type" />
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-input :disabled="isShowDefault" v-model="showDefault.alarmText" placeholder="告警的附加内容..." />
                </el-form-item>
              </el-form>
            </div>
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
            ref="tree"
            :default-expanded-keys="defaultExpandedKeys"
            highlight-current
            :props="defaultProps"/>
        </div>
        <!--右侧表单区-->
        <div class="content">
          <el-form inline label-width="96px">
            <!--循环主阀值-->
            <div class="monitor-formItemBox clearfix" v-for="(main,mainIndex) in monitorListArr" :key="mainIndex">
              <el-form-item label="主阈值：">
                <el-select :disabled="true" v-model="main.monitorClass" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in monitorMainList" :key="index" :label="val.name" :value="val.nodeClass" />
                </el-select>
                <el-select v-model="main.perf" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in resultArrList" :key="index" :label="val.label" :value="val.value" />
                </el-select>
                <el-select v-model="main.op" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in baseDataThresholdOp" :key="index" :label="val.name" :value="val.type" />
                </el-select>
                <el-input v-model="main.threshold" class="width170 marginRight6" clearable />
                <el-button @click="addFromMonitor(mainIndex)" class="addEditBtn">
                  <span class="el-icon-plus"></span>
                </el-button>
                <span>从阈值</span>
              </el-form-item>
              <el-form-item label="从阀值：" v-for="(item,data) in main.deviceMonitorThresholdList" :key="data">
                <el-select v-model="item.monitorClass" class="width170 marginRight6" clearable @change="changeMonitorSelect(item,item.monitorClass,true)">
                  <el-option v-for="(value,index) in monitorMainList" :key="index" :label="value.name" :value="value.nodeClass" />
                </el-select>
                <el-select v-model="item.perf" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in item.resultArrList" :key="index" :label="val.label" :value="val.value" />
                </el-select>
                <el-select v-model="item.op" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in baseDataThresholdOp" :key="index" :label="val.name" :value="val.type" />
                </el-select>
                <el-input v-model="item.threshold" class="width170 marginRight6" clearable />
                <el-button @click="delFromMonitor(mainIndex,data)" class="addEditBtn"><span class="el-icon-minus"></span></el-button>
              </el-form-item>
              <!--告警级别-->
              <el-form-item label="告警级别：">
                <el-select v-model="main.alarmLevel" class="width170 marginRight6" clearable>
                  <el-option v-for="(val,index) in AlarmSeverity" :key="index" :label="val.name" :value="val.type" />
                </el-select>
                <el-input v-model="main.alarmText" style="width: 530px;" clearable placeholder="请输入告警的附加内容..." />
              </el-form-item>
              <el-button type="danger" v-if="mainIndex !== 0" class="monitor-deleteBtn" @click="delMainMonitor(mainIndex)">
                <span class="el-icon-delete"></span>
              </el-button>
            </div>
          </el-form>
          <div class="textAlignCenter marginTop20">
            <el-button class="middle marRight10" @click="addMainMonitor">
              <span class="iconfont verticalAlignMiddle">&#xe64a;</span>
              <span class="verticalAlignMiddle">添加主阈值</span>
            </el-button>
            <el-button class="queryBtn" type="primary" @click="addMonitor">{{$t('public.save')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../components/Box';
  import {getLastNewData} from "../../../assets/js/recursive";
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
        defaultExpandedKeys:[], // 左侧树默认展开的key
        isShowDefaultBox:false,
        isShowDefault:true, // 是否禁用 查看默认值的文本框
        defaultProps:{
          label:'nodeName',
          children:'children',
          parentId:'parentNodeId'
        },
        monitorThisId:'', // 当前监测器id
        monitorThisThred:'', // 当前监测器主阀值
        // 阀值集合
        monitorListArr:[],
        monitorMainList:[], // 主阀值下拉框
        resultArrList:[], // 结果下拉框
        baseDataThresholdOp:[], // 操作下拉框
        AlarmSeverity:[], // 告警级别
        showDefault:{ // 查看默认值
          monitorClass:'',
          perf:'',
          op:'',
          threshold:'',
          alarmLevel:'',
          alarmText:''
        }
      }
    },
    methods: {
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
              // 拿到树之后 取出第一个节点最细一级的元素节点
              _t.getDefaultTreeFirstData(_t.treeData);
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
      // 根据左侧的树判断拿到第一个节点的最细一级的数据作为右边的显示值
      getDefaultTreeFirstData(treeData){
        var _t = this;
        var firstNode = getLastNewData(treeData);
        // 高亮当前节点
        _t.$nextTick(function () {
          _t.$refs.tree.setCurrentKey(firstNode.nodeId);
          _t.defaultExpandedKeys = [];
          _t.defaultExpandedKeys.push(firstNode.nodeId);
        });
        _t.clickNodeTree(firstNode);
      },
      // 点击左侧树形节点 获取阀值目录数据
      clickNodeTree(data){
        var _t = this;
        // 监测器id
        _t.monitorThisId = data.nodeId;
        // 监测器主阀值
        _t.monitorThisThred = data.nodeCode;
        _t.getResultData(data.nodeId);
      },
      // 获取指标下拉框数据
      getResultData(val){
        var _t = this;
        _t.$api.get('monitor/deviceMonitor/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              var result = JSON.parse(res.data.result);
              var resultArrList = new Array();
              for (var key in result) {
                var obj = new Object();
                obj.value = key;
                obj.label = result[key];
                resultArrList.push(obj);
              }
              _t.resultArrList = resultArrList;
              _t.getMonitorData(val);
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
      // 获取编辑的阀值数据
      getMonitorData(data){
        var _t = this;
        _t.$api.get('monitor/deviceMonitorThreshold/all',{
          jsonString: JSON.stringify({
            deviceMonitorThreshold:{
              monitorId:data,
              isAssocRule:false
            }
          })
        },function (res) {
          switch (res.status) {
            case 200:
              var monitorListArr = res.data;
              monitorListArr.forEach((item)=>{
                // 转换 告警级别字段 类型
                if (item.alarmLevel !== null) {
                  item.alarmLevel = String(item.alarmLevel);
                }
                if (item.deviceMonitorThresholdList.length !== 0) {
                  item.deviceMonitorThresholdList.forEach((data)=>{
                    data.resultArrList = [];
                    _t.changeMonitorSelect(data,data.monitorId,false);
                  });
                }
              });
              // 给监测指标动态表单赋值
              _t.monitorListArr = monitorListArr;
              // 设备查看默认值
              var showDefault = monitorListArr[0];
              if (showDefault) {
                _t.showDefault = showDefault;
              } else {
                _t.showDefault = {
                  monitorClass:'',
                  perf:'',
                  op:'',
                  threshold:'',
                  alarmLevel:'',
                  alarmText:''
                }
              }
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
      // 改变从阀值下拉框时 重新获取对应的 指标下拉框数据
      changeMonitorSelect(item,val,bool){
        var _t = this;
        if (val !== '') {
          _t.$api.get('monitor/deviceMonitor/' + val,{},function (res) {
            switch (res.status) {
              case 200:
                var result = JSON.parse(res.data.result);
                var resultArrList = new Array();
                for (var key in result) {
                  var obj = new Object();
                  obj.value = key;
                  obj.label = result[key];
                  resultArrList.push(obj);
                }
                var perfNumber = 0;
                resultArrList.forEach((val)=>{
                  if (val.value !== item.perf) {
                    perfNumber += 1;
                  }
                });
                if (bool === true && perfNumber !== 0) {
                  item.perf = '';
                }
                item.resultArrList = resultArrList;
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
        } else {
          item.perf = '';
          item.resultArrList = [];
        }
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
      // 获取list数据字典
      getBaseDataList(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('system/basedata/maplist',{
          languageMark:localStorage.getItem('hy-language'),
          dictionaryTypes:['ThresholdOp','AlarmSeverity']
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch(res.status) {
            case 200:
              _t.baseDataThresholdOp = res.data.ThresholdOp;
              var AlarmSeverity = new Array();
              res.data.AlarmSeverity.forEach((item)=>{
                if (item.type == 66 || item.type == 99) {
                  AlarmSeverity.push(item);
                }
              });
              AlarmSeverity.unshift({name:'-请选择告警级别-',type:null});
              _t.AlarmSeverity = AlarmSeverity;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.baseDataThresholdOp = [];
              break;
          }
        });
      },
      // 获取阀值 下拉框数据
      getMonitorSelectData(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.get('monitor/deviceMonitor/all',{
          jsonString:JSON.stringify({
            deviceMonitor:{
              nodeType:1
            }
          })
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch(res.status) {
            case 200:
              _t.monitorMainList = res.data;
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.monitorMainList = [];
              break;
          }
        });
      },
      // 添加从阀值
      addFromMonitor(index){
        var _t = this;
        let monitorClass = {
          monitorClass:'', // 从阀值字段
          perf:'', // 从阀值指标名称
          op:'', // 阀值比较符
          threshold:'', // 从阀值
          resultArrList:[], // 从阀值下拉框集合
        };
        _t.monitorListArr[index].deviceMonitorThresholdList.push(monitorClass);
      },
      // 添加主阀值
      addMainMonitor(){
        var _t = this;
        let monitorMain = {
          monitorId:_t.monitorThisId, // 监测器id
          monitorClass:_t.monitorThisThred,// 主从阀值字段
          perf:'', // 阀值指标名称
          op:'', // 阀值比较符
          threshold:'', // 阀值
          alarmLevel:null, // 告警级别
          alarmText:'', // 附加告警内容
          // 从阀值集合
          deviceMonitorThresholdList:[]
        };
        _t.monitorListArr.push(monitorMain);
      },
      // 删除从阀值
      delFromMonitor(index,i){
        var _t = this;
        _t.monitorListArr[index].deviceMonitorThresholdList.splice(i, 1);
      },
      // 删除主阀值
      delMainMonitor(index) {
        var _t = this;
        _t.monitorListArr.splice(index,1);
      },
      // 保存阀值
      addMonitor(){
        var _t = this;
        _t.$store.commit('setLoading',true);
        _t.$api.post('monitor/deviceMonitorThreshold/',{
          monitorId:_t.monitorThisId,
          thresholdList: _t.monitorListArr
        },function (res) {
          _t.$store.commit('setLoading',false);
          switch (res.status) {
            case 200:
              _t.getResultData(_t.monitorThisId);
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
      }
    },
    created() {
      var _t = this;
      _t.$store.commit('setLoading',true);
      _t.deviceId = _t.$route.params.deviceId ? _t.$route.params.deviceId : localStorage.getItem('hy-deviceId');
      this.getInfoData();
      this.getBaseData();
      this.getThresholdTree();
      this.getBaseDataList();
      this.getMonitorSelectData();
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
    top: 250px;
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

  .showDefaultBox {
    position: absolute;
    z-index: 10;
    top: 35px;
    right: 0px;
    width: 454px;
    height: 236px;
    padding: 0 10px;
  }

  .showDefaultBox:after {
    content: '';
    display: inline-block;
    position: absolute;
    z-index: 11;
    top: -5px;
    right: 40px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px;
  }
</style>
