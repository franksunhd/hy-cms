<template>
  <el-dialog
    class="alarmCurrentBox-dialog"
    :title="$t('alarmCurrent.addUpdateAlarm')"
    append-to-body
    :show-close="false"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <!--设备基本信息-->
    <div class="dialogTitle">{{$t('alarmCurrent.equipmentInfo')}}</div>
    <el-form class="alarmMessageBox-formItem" v-model="alarmDetailDataAlarm" label-position="right" label-width="76px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('alarmCurrent.equipmentName') + '：'">{{alarmDetailDataAlarm.deviceName || ''}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.equipmentIp') + '：'">{{alarmDetailDataAlarm.ip}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.serialNumber') + '：'">{{alarmDetailDataAlarm.servicetag}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('alarmCurrent.equipmentType') + '：'">{{AssetType[alarmDetailDataAlarm.type]}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.equipmentVendor') + '：'">{{alarmDetailDataAlarm.manufacturer}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.equipmentModel') + '：'">{{alarmDetailDataAlarm.model}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('alarmCurrent.computerRoomName') + '：'">{{alarmDetailDataAlarm.roomName}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.location') + '：'">
            <span>{{alarmDetailDataAlarm.frameName}}</span>
            <span v-if="alarmDetailDataAlarm.framePosition !== null">,{{alarmDetailDataAlarm.framePosition}}U</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!--告警信息字段-->
      <div class="dialogTitle">{{$t('alarmCurrent.alarmInfo')}}</div>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('alarmCurrent.severityLevel') + '：'">
            <span v-if="alarmDetailDataAlarm.alarmLevel == 33" class="iconfontSuccess">{{AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
            <span v-if="alarmDetailDataAlarm.alarmLevel == 66" class="iconfontWarn">{{AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
            <span v-if="alarmDetailDataAlarm.alarmLevel == 99" class="iconfontError">{{AlarmSeverity[alarmDetailDataAlarm.alarmLevel]}}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmCurrent.alarmNumber') + '：'">
            <span class="iconfontError">{{alarmDetailDataAlarm.alarmTimes}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('alarmCurrent.createTime') + '：'">{{alarmDetailDataAlarm.occurrenceTime | dateFilter}}</el-form-item>
          <el-form-item :label="$t('alarmCurrent.lastTime') + '：'">{{alarmDetailDataAlarm.updateTime | dateFilter}}</el-form-item>
        </el-col>
      </el-row>
      <!--处理状态-->
      <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.processStatus')}}</strong></p>
      <el-form-item :label="$t('alarmCurrent.status') + '：'">
        <span v-if="alarmDetailDataAlarm.status == 0" class="iconfontError">{{AlarmHandleStatus[alarmDetailDataAlarm.status]}}</span>
        <span v-else>{{AlarmHandleStatus[alarmDetailDataAlarm.status]}}</span>
      </el-form-item>
      <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.alarmContent')}}</strong></p>
      <el-form-item :label="$t('alarmCurrent.part') + '：'">
        {{alarmDetailDataAlarm.part}}
      </el-form-item>
      <el-form-item :label="$t('alarmCurrent.alarmInfo') + '：'">
        {{alarmDetailDataAlarm.currentStatus}}
      </el-form-item>
      <p class="paddingLeft-10 marginTop10 fsBold12"><strong>{{$t('alarmCurrent.alarmDescription')}}</strong></p>
      <el-form-item label=" ">
        <el-timeline class="alarmDetailDataComment">
          <el-timeline-item
            :size="item.titleStatus == true ? 'large' : 'normal'"
            v-for="(item,index) in alarmDetailDataComment"
            :key="index">
            <div dot="timestamp" v-if="item.titleStatus == true">
              <span class="fsBold14">{{item.title}}</span>
            </div>
            <div dot="timestamp" class="fs12" v-if="item.titleStatus == false">
              <span class="col666">{{$t('alarmCurrent.descriptionUser')}}</span>
              <span class="col666 marginRight20">{{item.commUser}}</span>
              <span class="col666">{{item.createTime | dateFilter}}</span>
              <p>{{item.commContent}}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-form-item>
      <el-form-item class="marginTop10" :label="$t('alarmCurrent.dealWithWays') + '：'">
        <el-radio-group v-model="formItem.status" @change="changeDealWithStatus(formItem.status)">
          <el-radio :label="0">{{$t('public.confirmAlarm')}}</el-radio>
          <el-radio :label="1">{{$t('alarmCurrent.alarmDescription')}}</el-radio>
          <el-radio :label="2">{{$t('alarmCurrent.alarmWarranty')}}</el-radio>
          <el-radio :label="3">{{$t('alarmCurrent.alarmClose')}}</el-radio>
        </el-radio-group>
        <el-checkbox v-if="formItem.status == 3" v-model="formItem.checked" class="closeCheckBox">{{$t('alarmCurrent.alarmCloseIgnore')}}</el-checkbox>
      </el-form-item>
      <el-form-item class="marginTop10" :label="formItem.statusTip + '：'">
        <el-input
          id="textContent"
          type="textarea"
          :disabled="formItem.isDisabledTextArea"
          @input="inputTextContent(formItem.status,formItem.textContent)"
          v-model="formItem.textContent"
          :autosize="{minRows: 3}" />
        <div class="positionRelative" v-if="formItem.textStatus">
          <span class="isNotNull" style="top: 0;">{{$t('public.isNotNull')}}</span>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer">
        <el-button :disabled="formItem.isDisabledAlarm" @click="confirmAlarm(formItem.status)" v-if="formItem.status == 0" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button :disabled="formItem.isDisabledDescription" @click="confirmAlarm(formItem.status)" v-if="formItem.status == 1" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button :disabled="formItem.isDisabledWarranty" @click="confirmAlarm(formItem.status)" v-if="formItem.status == 2" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button :disabled="formItem.isDisabledClose" @click="confirmAlarm(formItem.status)" v-if="formItem.status == 3" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>
        <el-button type="default" class="alertBtn" @click="cancelBtn">{{$t('public.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {dateFilter,dateFilterDayCN} from "../assets/js/filters";

  export default {
    name: "equipmentAlarmDetails",
    data() {
      return {
        // 表单
        formItem:{
          status:0, // 处理状态 单选按钮组的绑定值
          checked:false, // 关闭并忽略告警 复选框是否选中
          statusTip:this.$t('alarmCurrent.confirmOpinions'), // 默认多行输入label
          textContent:'', // 多行文本输入内容
          textStatus:false, // 多行输入为空判断状态
          id:'', // 缓存接口id
          isDisabledTextArea:false, // 输入框 是否禁用
          isDisabledAlarm:false, // 确认告警是否禁用
          isDisabledDescription:false, // 告警评注 是否禁用
          isDisabledWarranty:false, // 告警保修 是否禁用
          isDisabledClose:false, // 告警关闭 是否禁用
          isAlarmHistory:false, // 是否 历史告警
        },
        // 表单集合
        alarmDetailDataAlarm:{
          deviceName:null, // 设备名称
          ip:null, // ip
          servicetag:'', // 序列号
          type:null, // 设备类型
          model:null, // 型号
          alarmLevel:null, // 告警级别
          alarmTimes:null, // 告警次数
          frameName:null, // 机架
          roomName: null, // 机房
          framePosition: null, // 位置
          manufacturer:null, // 设备厂商
        },
        // 告警评注列表
        alarmDetailDataComment:[],
      }
    },
    // 接收子组件的传值
    props:{
      // 蒙版的显示隐藏
      dialogVisible:{
        type:Boolean,
        default: false
      },
      // 处理状态字典
      AlarmHandleStatus:{
        type:Object
      },
      // 设备类型字典
      AssetType:{
        type:Object
      },
      // 告警状态字典
      AlarmSeverity:{
        type:Object
      },
    },
    methods: {
      // 接收是否历史告警
      getAlarmIsHistory(val){
        var _t = this;
        if (val) {
          // 历史告警
          _t.formItem.isAlarmHistory = val;
          _t.formItem.isDisabledTextArea = val;
          _t.formItem.isDisabledAlarm = val;
          _t.formItem.isDisabledDescription = val;
          _t.formItem.isDisabledWarranty = val;
          _t.formItem.isDisabledClose = val;
        } else if (val === false && _t.alarmDetailDataAlarm.status === 1) {
          // 当前告警 并且 确认告警内容不可提交
          _t.formItem.isAlarmHistory = val;
          _t.formItem.isDisabledTextArea = true;
          _t.formItem.isDisabledAlarm = true;
          _t.formItem.isDisabledDescription = val;
          _t.formItem.isDisabledWarranty = val;
          _t.formItem.isDisabledClose = val;
          _t.formItem.textContent = _t.alarmDetailDataAlarm.confirmComment;
        } else {
          // 当前告警 并且 确认告警内容可提交
          _t.formItem.isAlarmHistory = val;
          _t.formItem.isDisabledTextArea = val;
          _t.formItem.isDisabledAlarm = val;
          _t.formItem.isDisabledDescription = val;
          _t.formItem.isDisabledWarranty = val;
          _t.formItem.isDisabledClose = val;
          _t.formItem.textContent = '';
        }
      },
      // 获取设备告警详情弹出层
      getData(val,item){
        var _t = this;
        _t.$api.get('alarm/alarm/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              if (res.data.alarm !== null) {
                _t.alarmDetailDataAlarm = res.data.alarm;
              }
              _t.getAlarmIsHistory(item);
              // 存入告警id
              _t.formItem.id = val;
              // 调用告警评注
              _t.getAlarmComment(val);
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
      // 获取告警评注列表数据
      getAlarmComment(val){
        var _t = this;
        _t.$api.get('alarm/alarmComment/all' ,{
          jsonString:JSON.stringify({
            alarmComment:{
              alarmId:val
            }
          })
        },function (res) {
          switch (res.status) {
            case 200:
              var resData = res.data;
              // 处理之后的评注列表数据
              var alarmDetailData = new Array();
              // 需要对比的时间
              var timeLine = '';
              if (resData.length === 0) {
                _t.alarmDetailDataComment = [];
              } else {
                resData.forEach(function (item) {
                  var time = new Date(item.createTime);
                  var timeNew = time.getFullYear().toString() + (time.getMonth() + 1).toString() + time.getDate().toString();
                  if (timeNew !== timeLine) {
                    // 没有本日数据
                    timeLine = timeNew;
                    var obj = new Object();
                    obj.titleStatus = true;
                    obj.title = dateFilterDayCN(item.createTime);
                    alarmDetailData.push(obj);
                    alarmDetailData.push(item);
                  } else {
                    // 有本日的数据
                    alarmDetailData.push(item);
                  }
                  item.titleStatus = false;
                  item.title = '';
                });
              }
              _t.alarmDetailDataComment = alarmDetailData;
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
      // 处理方式不同时 多行输入label值得切换
      changeDealWithStatus(val){
        var _t = this;
        // 多行输入样式恢复
        _t.formItem.textStatus = false;
        _t.formItem.textContent = '';
        if (document.getElementById('textContent')) {
          document.getElementById('textContent').style.borderColor = '#DCDFE6';
        }
        if (val === 0) {
          // 确认告警
          if (_t.formItem.isAlarmHistory) {
            // 历史告警
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else if (_t.formItem.isAlarmHistory === false && _t.alarmDetailDataAlarm.status === 1) {
            // 当前告警 已处理
            _t.formItem.textContent = _t.alarmDetailDataAlarm.confirmComment;
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else {
            _t.formItem.isDisabledTextArea = false;
            _t.formItem.isDisabledAlarm = false;
          }
          _t.formItem.statusTip = _t.$t('alarmCurrent.confirmOpinions');
        } else if (val === 1) {
          // 告警评注
          if (_t.formItem.isAlarmHistory) {
            // 历史告警
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledDescription = true;
          } else {
            // 当前告警
            _t.formItem.isDisabledTextArea = false;
            _t.formItem.isDisabledDescription = false;
          }
          _t.formItem.statusTip = _t.$t('alarmCurrent.addDescription');
        } else if (val === 2) {
          // 告警保修
          if (_t.formItem.isAlarmHistory) {
            // 历史告警
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else if (_t.formItem.isAlarmHistory === false && _t.alarmDetailDataAlarm.status === 1) {
            // 当前告警 已处理
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else {
            _t.formItem.isDisabledTextArea = false;
            _t.formItem.isDisabledAlarm = false;
          }
          _t.formItem.statusTip = _t.$t('alarmCurrent.warrantyOpinions');
        } else {
          // 告警关闭
          if (_t.formItem.isAlarmHistory) {
            // 历史告警
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else if (_t.formItem.isAlarmHistory === false && _t.alarmDetailDataAlarm.status === 1) {
            // 当前告警 已处理
            _t.formItem.isDisabledTextArea = true;
            _t.formItem.isDisabledAlarm = true;
          } else {
            _t.formItem.isDisabledTextArea = false;
            _t.formItem.isDisabledAlarm = false;
          }
          _t.formItem.statusTip = _t.$t('alarmCurrent.closeOpinions');
        }
      },
      // 点击取消按钮或关闭按钮时 给父组件传值 取消蒙版
      cancelBtn(){
        var _t = this;
        _t.$emit('dialogVisibleStatus',false);
        _t.formItem.isAlarmHistory = false;
        _t.formItem.isDisabledTextArea = false;
        _t.formItem.isDisabledAlarm = false;
        _t.formItem.isDisabledDescription = false;
        _t.formItem.isDisabledWarranty = false;
        _t.formItem.isDisabledClose = false;
        _t.formItem.status = 0;
      },
      // 确认按钮 点击
      confirmAlarm(val){
        var _t = this;
        // 0 确认告警 1 告警评注 2 告警保修 3告警关闭
        if (val === 0) {
          _t.confirmAlarmBtn();
        } else if (val === 1) {
          _t.alarmDescription();
        } else if (val === 2) {
          _t.alarmWarranty();
        } else if (val === 3) {
          _t.alarmClose();
        }
      },
      // 确认告警提交提交
      confirmAlarmBtn(){
        var _t = this;
        var alarmIds = new Array();
        alarmIds.push(_t.formItem.id);
        _t.$api.post('alarm/alarm/batchconfirm',{
          confirmComment:_t.formItem.textContent,
          alarmIds:alarmIds
        },function (res) {
          switch (res.status) {
            case 200:
              _t.alarmDetailDataAlarm.status = res.data.count;
              // 清空多行输入
              _t.formItem.textContent = '';
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
      // 告警评注提交
      alarmDescription(){
        var _t = this;
        if (_t.formItem.textContent.trim() === '') {
          _t.formItem.textStatus = true;
          document.getElementById('textContent').style.borderColor = '#fb6041';
        } else {
          if (_t.formItem.id !== '') {
            _t.$api.post('alarm/alarmComment/',{
              alarmComment:{
                alarmId:_t.formItem.id,
                commContent:_t.formItem.textContent
              }
            },function (res) {
              switch (res.status) {
                case 200:
                  _t.formItem.textContent = '';
                  _t.getAlarmComment(_t.formItem.id);
                  break;
                case 1003: // 无操作权限
                case 1004: // 登录过期
                case 1005: // token过期
                case 1006: // token不通过
                  _t.exclude(_t, res.message);
                  break;
                default:
                  _t.formItem.textContent = '';
                  break;
              }
            });
          }
        }
      },
      // 告警保修提交
      alarmWarranty(){
        var _t = this;
      },
      // 告警关闭提交
      alarmClose(){
        var _t = this;
        var alarmIds = new Array();
        alarmIds.push(_t.formItem.id);
        _t.$api.post('alarm/alarm/batchdelete',{
          alarmIgnore:_t.formItem.checked,
          confirmComment:_t.formItem.textContent,
          alarmIds:alarmIds
        },function (res) {
          switch (res.status) {
            case 200:
              _t.$emit('dialogVisibleStatus',false);
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.formItem.textContent = '';
              break;
          }
        });
      },
      // 多行输入校验
      inputTextContent(status,text){
        var _t = this;
        // if (status === 1 && text.trim() !== '') {
        //   // 告警评注输入框 内容不为空
        //   _t.formItem.textStatus = false;
        //   document.getElementById('textContent').style.borderColor = '#DCDFE6';
        // } else if (status === 1 && text.trim() === '') {
        //   // 告警评注输入框 内容为空
        //   _t.formItem.textStatus = true;
        //   document.getElementById('textContent').style.borderColor = '#fb6041';
        // } else {
        //   _t.formItem.textStatus = false;
        //   document.getElementById('textContent').style.borderColor = '#DCDFE6';
        // }
      }
    }
  }
</script>

<style>
  .alarmCurrentBox-dialog .el-dialog {
    width: 930px;
    height: 560px;
  }

  .closeCheckBox {
    margin-left: 30px;
  }

  .closeCheckBox .el-checkbox__label {
    font-size: 12px;
  }
</style>
