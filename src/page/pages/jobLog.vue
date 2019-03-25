<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.jobLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button @click="addPage">增加页面</el-button>
    <el-form v-model="options" inline>
      <template v-for="(item,index) in parentList">
        <el-form-item label="ip:">
          <el-button @click="add(index)">+</el-button>
          <template v-for="(val,i) in item.ips">
            <el-input v-model="val.label"></el-input>
            <span>~</span>
            <el-input v-model="val.name"></el-input>
            <el-button>-</el-button>
          </template>
        </el-form-item>
        <br>
        <el-form-item label="1111"></el-form-item>
        <el-form-item label="2222"></el-form-item>
        <el-form-item label="3333"></el-form-item>
        <el-form-item label="4444"></el-form-item>
        <br>
      </template>
    </el-form>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "jobLog",
    components:{Box},
    data() {
      return {
        parentList:[
          {
            ips:[
              {label:'',name:''},
            ],
            port:'',
            username:'',
            password:''
          }
        ]
      }
    },
    methods: {
      add(index){
        var ips = new Object();
        ips = {label:'1',name:'2'};
        this.parentList[index].ips.push(ips);
      },
      addPage(){
        var obj = new Object();
        obj = {
          ips:[
            {label:'1',name:'2'},
          ],
          port:'',
          username:'',
          password:''
        }
        this.parentList.push(obj);
      }

    },
    created() {
    }
  }
</script>

<style scoped>

</style>
