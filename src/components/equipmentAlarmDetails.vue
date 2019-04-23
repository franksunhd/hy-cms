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
        <el-input type="textarea" :autosize="{minRows: 3}" />
      </el-form-item>
    </el-form>
    <span slot="footer">
        <!--<el-button v-if="formItem.status == 0" type="primary" class="alertBtn">{{$t('public.confirm')}}</el-button>-->
        <el-button @click="confirmAlarm(formItem.status)" v-if="formItem.status == 0" type="primary" class="alertBtn">确认告警</el-button>
        <el-button @click="confirmAlarm(formItem.status)" v-if="formItem.status == 1" type="primary" class="alertBtn">告警评注</el-button>
        <el-button @click="confirmAlarm(formItem.status)" v-if="formItem.status == 2" type="primary" class="alertBtn">告警保修</el-button>
        <el-button @click="confirmAlarm(formItem.status)" v-if="formItem.status == 3" type="primary" class="alertBtn">告警关闭</el-button>
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
          status:0,
          checked:false,
          statusTip:this.$t('alarmCurrent.confirmOpinions')
        },
        // 表单集合
        alarmDetailDataAlarm:{
          deviceName:'',
          ip:'',
          servicetag:'',
          type:'',
          model:'',
          alarmLevel:'',
          alarmTimes:'',
          frameName:'',
          roomName: '',
          framePosition: '',
          manufacturer:''
        },
        alarmDetailDataComment:[]
      }
    },
    props:{
      dialogVisible:{
        type:Boolean,
        default: false
      },
      data:{
        type:String,
        default:''
      },
      AlarmHandleStatus:{
        type:Object
      },
      AssetType:{
        type:Object
      },
      AlarmSeverity:{
        type:Object
      }
    },
    methods: {
      // 获取设备告警详情弹出层
      getData(val){
        var _t = this;
        _t.$api.get('alarm/alarm/' + val,{},function (res) {
          switch (res.status) {
            case 200:
              _t.alarmDetailDataAlarm = res.data.alarm;
              var resData = res.data.commentList;
              // 处理之后的评注列表数据
              var alarmDetailData = new Array();
              // 需要对比的时间
              var timeLine = '';
              if (resData.length == 0) {
                _t.alarmDetailData = [];
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
        if (val == 0) {
          _t.formItem.statusTip = _t.$t('alarmCurrent.confirmOpinions');
        } else if (val == 1) {
          _t.formItem.statusTip = _t.$t('alarmCurrent.addDescription');
        } else if (val == 2) {
          _t.formItem.statusTip = _t.$t('alarmCurrent.warrantyOpinions');
        } else {
          _t.formItem.statusTip = _t.$t('alarmCurrent.closeOpinions');
        }
      },
      // 点击取消按钮或关闭按钮时 给父组件传值 取消蒙版
      cancelBtn(){
        this.$emit('dialogVisibleStatus',false);
      },
      // 确认按钮
      confirmAlarm(val){
        var _t = this;
        // 0 确认告警 1 告警评注 2 告警保修 3告警关闭
        if (val === 0) {

        } else if (val === 1) {

        } else if (val === 2) {

        } else if (val === 3) {

        }
      },
      // 确认告警提交提交
      confirmAlarm(){
        var _t = this;
      },
      // 告警评注提交
      alarmDescription(){
        var _t = this;
      },
      // 告警保修提交
      alarmWarranty(){
        var _t = this;
      },
      // 告警关闭提交
      alarmClose(){
        var _t = this;
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
