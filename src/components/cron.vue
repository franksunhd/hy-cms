<template>
  <el-form v-model="options" label-width="100px">
    <slot name="header"></slot>
    <el-form-item :label="$t('dataBaseRestore.setTime') + '：'">
      <el-select v-model="options.year" @change="changeYear" style="width: 80px;" placeholder="">
        <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">年</span>
      <el-select v-model="options.month" @change="changeMonth" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in monthList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">月</span>
      <el-select v-model="options.week" @change="changeWeek" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in weekList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">周</span>
      <el-select v-model="options.day" @change="changeDay" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in dayList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">日</span>
      <el-select v-model="options.hour" @change="changeHour" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in hourList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">时</span>
      <el-select v-model="options.minute" @change="changeMinute" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in minuteList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">分</span>
    </el-form-item>
    <el-form-item :label="$t('dataBaseRestore.timeRule') + '：'">
      <el-input v-model="timeRule" />
    </el-form-item>
    <el-form-item :label="$t('dataBaseRestore.ruleDes') + '：'">
      <span>{{timeRuleDes}}</span>
    </el-form-item>
    <slot name="footers"></slot>
  </el-form>
</template>

<script>
  export default {
    name: "cron",
    data() {
      return {
        timeRule:'',
        timeRuleDes:'',
        options:{
          year:'每',
          month:'每',
          week:'每',
          day:'每',
          hour:'每',
          minute:'每'
        },
        yearList:[],
        monthList:[],
        weekList:[],
        dayList:[],
        hourList:[],
        minuteList:[],
        jointNum:{
          year:'',
          month:'',
          week:'',
          day:'',
          hour:'',
          minute:''
        },
        every:'每'
      }
    },
    methods: {
      // 加载年 从当前年份加载到以后7年
      getYearData(){
        var year = new Date();
        var yearArr = new Array();
        yearArr.push('每');
        for (var i = 0;i < 7;i++) {
          yearArr.push(year.getFullYear() + i);
        }
        this.yearList = yearArr;
      },
      // 加载月
      getMonthData(month,start){
        this.monthList = this.getReturnFor(month,start);
      },
      // 加载周
      getWeekData(week,start){
        this.weekList = this.getReturnFor(week,start);
      },
      // 加载日
      getDayData(day,start){
        this.dayList = this.getReturnFor(day,start);
      },
      // 加载时
      getHourData(hour,start){
        this.hourList = this.getReturnFor(hour,start);
      },
      // 加载分
      getMinuteData(minute,start){
        this.minuteList = this.getReturnFor(minute,start);
      },
      // for循环
      getReturnFor(length,val){
        var arr = new Array();
        arr.push('每');
        for (var i = 0;i < length;i++){
          arr.push(i + val);
        }
        return arr;
      },
      // 改变年
      changeYear(year){
        // 加载日下拉框数据
        if (year !== this.every) {
          var cond1 = year % 4 == 0;
          var cond2 = year % 100 != 0;
          var cond3 = year % 400 ==0;
          var cond = cond1 && cond2 || cond3;
          if(cond && this.options.month === 2) { // 是闰年
            this.getDayData(29,1);
          } else {
            this.getDayData(28,1);
          }
        }

        // 只有 指定年份
        if (this.jointNum.year !== this.every
          && this.jointNum.month == this.every
          && this.jointNum.day == this.every
          && this.jointNum.week == this.every
          && this.jointNum.hour == this.every
          && this.jointNum.minute == this.every) {

        }


        this.joint();
      },
      // 改变月
      changeMonth(val){
        // 加载日下拉框数据
        var cond = false;
        if (this.options.year !== this.every)  {
          var cond1 = this.options.year % 4 == 0;
          var cond2 = this.options.year % 100 != 0;
          var cond3 = this.options.year % 400 ==0;
          cond = cond1 && cond2 || cond3;
        }
        // 按照月份加载 部分日
        if (val === this.every || val === 1 || val === 3 || val === 5 || val === 7 || val === 8 || val === 10 || val === 12) {
          this.getDayData(31,1);
        } else if (val === 4 || val === 6 || val === 9 || val === 11) {
          this.getDayData(30,1);
        } else if (val === 2 && cond === true) {
          this.getDayData(29,1);
        } else if (val === 2 && cond === false) {
          this.getDayData(28,1);
        }

        this.joint();
      },
      // 改变周
      changeWeek(val){
        if (this.options.day !== this.every) {
          this.options.day = this.every;
        }
        this.joint();
      },
      // 改变天
      changeDay(val){
        this.joint();
      },
      // 改变小时
      changeHour(val){
        this.joint();
      },
      // 改变分钟
      changeMinute(val){
        this.joint();
      },
      // 拼接时间规则 和 说明规则
      joint(){
        var minute = this.options.minute === this.every ? '*' : this.options.minute;
        var hour = this.options.hour === this.every ? '*' : this.options.hour;
        var day = this.options.day === this.every ? '*' : this.options.day;
        var month = this.options.month === this.every ? '*' : this.options.month;
        var week = this.options.week === this.every ? '?' : this.options.week;
        var weekNum = '?';
        switch (week) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
            weekNum = week + 1;
            break;
          case 7:
            weekNum = 1;
            break;
          default:
            break;
        }

        var year = this.options.year === this.every ? '' : this.options.year;
        if (year !== '') {
          this.timeRule = '0' + ' ' + minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + weekNum + ' ' + year;
        } else {
          this.timeRule = '0' + ' ' + minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + weekNum;
        }

        var yearText = '',monthText = '',dayText = '',weekText = '',hourText = '', minuteText = '';
        if (year !== '') {
          yearText = year + '年';
        }
        if (month !== '*') {
          monthText = month + '月';
        }
        if (week !== '?') {
          switch (week) {
            case 1:
              weekText = '周一';
              break;
            case 2:
              weekText = '周二';
              break;
            case 3:
              weekText = '周三';
              break;
            case 4:
              weekText = '周四';
              break;
            case 5:
              weekText = '周五';
              break;
            case 6:
              weekText = '周六';
              break;
            case 7:
              weekText = '周日';
              break;
            default:
              break;
          }
        }
        if (day !== '*') {
          dayText = day + '日';
        }
        if (hour !== '*') {
          hourText = hour + '时';
        }
        if (minute !== '*') {
          minuteText = minute + '分';
        } else {
          minuteText = '每分钟';
        }
        this.timeRuleDes = yearText + monthText + weekText + dayText + hourText + minuteText + '触发';
      }
    },
    created() {
      this.getYearData();
      this.getMonthData(12,1);
      this.getWeekData(7,1);
      this.getDayData(31,1);
      this.getHourData(23,1);
      this.getMinuteData(59,1);
      this.joint();
    }
  }
</script>

<style scoped>
  .selectWidth-cron {
    width: 65px;
  }

  .selectWidth-cron-interval {
    margin: 0 1px;
  }
</style>
