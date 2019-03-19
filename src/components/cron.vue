<template>
  <el-form :model="options" label-width="100px">
    <el-form-item :label="$t('dataBaseRestore.setTime') + '：'">
      <el-select v-model="options.year" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">年</span>
      <el-select v-model="options.month" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in monthList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">月</span>
      <el-select v-model="options.week" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in weekList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">周</span>
      <el-select v-model="options.day" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in dayList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">日</span>
      <el-select v-model="options.hour" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in hourList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">时</span>
      <el-select v-model="options.minute" class="selectWidth-cron" placeholder="">
        <el-option v-for="(item,index) in minuteList" :key="index" :label="item" :value="item" />
      </el-select>
      <span class="selectWidth-cron-interval">分</span>
    </el-form-item>
    <el-form-item :label="$t('dataBaseRestore.timeRule') + '：'">
      <el-input v-model="timeRule" />
    </el-form-item>
    <el-form-item :label="$t('dataBaseRestore.ruleDes') + '：'">
      <span>{{timeRuleDes}} 触发</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "cron",
    data() {
      return {
        timeRule:'* * * * * ? *',
        timeRuleDes:'每分钟',
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
      }
    },
    methods: {
      // 加载数据
      getData(){
        this.getYearData();
        this.getMonthData();
        this.getWeekData();
        this.getDayData();
        this.getHourData();
        this.getMinuteData();
      },
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
      getMonthData(){
        this.monthList = this.getReturnFor(12,1);
      },
      // 加载周
      getWeekData(){
        this.weekList = this.getReturnFor(7,1);
      },
      // 加载日
      getDayData(){
        this.dayList = this.getReturnFor(31,1);
      },
      // 加载时
      getHourData(){
        this.hourList = this.getReturnFor(23,1);
      },
      // 加载分
      getMinuteData(){
        this.minuteList = this.getReturnFor(59,1);
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
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>
  .selectWidth-cron {
    width: 70px;
  }

  .selectWidth-cron-interval {
    margin: 0 5px;
  }
</style>
