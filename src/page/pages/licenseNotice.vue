<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.licenseNotice')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form label-width="200px">
      <el-form-item label="License到期提醒时间：">
        <el-radio-group v-model="radio" @change="changeTime">
          <el-radio label="3">3个月</el-radio>
          <el-radio label="2">2个月</el-radio>
          <el-radio label="1">1个月</el-radio>
          <el-radio label="15">15天</el-radio>
          <el-radio label="10">10天</el-radio>
          <el-radio label="7">7天</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="通知的相关用户：">
        <el-button size="small" @click="dialogVisible = true">{{$t('licenseNotice.selectUser')}}</el-button>
      </el-form-item>
      <el-form-item label="通知的形式：">
        <el-radio-group v-model="noticeWay" @change="changeWay">
          <el-radio label="1">站内信</el-radio>
          <el-radio label="2">手机短信</el-radio>
          <el-radio label="3">电子邮件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="small">{{$t('public.save')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="$t('licenseNotice.selectUser')" :visible.sync="dialogVisible">
      <el-tree
        :data="treeData"
        show-checkbox />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">{{$t('public.confirm')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "lisence-notice",
    components:{Box},
    data(){
      return {
        radio:'',
        noticeWay:'',
        dialogVisible:true,
        treeData:[
          {
            id:1,
            label:'集团亚洲总部',
            children:[
              {
                id:2,
                label:'上海分部',
                children:[
                  {
                    id:4,
                    label:'张三'
                  },
                  {
                    id:5,
                    label:'李四'
                  },
                  {
                    id:6,
                    label:'王五'
                  },
                ]
              },
              {
                id:3,
                label:'北京分部',
                children:[
                  {
                    id:7,
                    label:'赵六'
                  }
                ]
              }
            ]
          },
          {
            id:8,
            label:'集团欧洲总部'
          },
          {
            id:9,
            label:'集团美洲总部'
          }
        ]
      }
    },
    methods:{
      changeTime(){
        console.log(this.radio);
      },
      changeWay(){
        console.log(this.noticeWay);
      }
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
