<template>
  <div class="systemSettings-navBarBox">
    <p class="systemSettings-title">{{$t('system.systemSetting')}}</p>
    <div class="systemSettings-navBarContent">
      <el-menu :default-active="current" :router="true" :unique-opened="false">
        <el-submenu v-for="(item,index) in navBarArr" :index="item.id" :key="index" :class="item.name">
          <template slot="title" v-if="item.children == null">
            <router-link class="systemSettings-oddRouter" :to="item.url">{{item.name}}</router-link>
          </template>
          <template v-else>
            <template slot="title">
              {{item.name}}
            </template>
            <el-menu-item v-for="(i,index2) in item.children" :key="index2" :index="i.url">
              {{i.name}}
            </el-menu-item>
          </template>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    name: "system-settings-navbar",
    data(){
      return {
        navBarArr:[
          {id:'1',name:'许可证信息维护',children:null,url:'/YUser/systemSettings/licenseInformation'},
          {id:'2',name:'系统管理',children:[
              {id:'2-1',name:'平台基础设置',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-2',name:'平台语言设置',url:'/YUser/systemSettings/platformLanguage'},
              {id:'2-3',name:'数据字典管理',url:'/YUser/systemSettings/dataDictionary'},
              {id:'2-4',name:'License到期通知',url:'/YUser/systemSettings/licenseNotice'},
              {id:'2-5',name:'接口访问测试',url:'/YUser/systemSettings/interfaceTest'},
            ]
          },
          {id:'3',name:'用户管理',children:[
              {id:'3-1',name:'用户维护',url:'/YUser/systemSettings/userMaintenance'},
              {id:'3-2',name:'角色维护',url:'/YUser/systemSettings/roleMaintenance'},
              {id:'3-3',name:'组织维护',url:'/YUser/systemSettings/organizeMaintenance'}
            ]
          },
          {id:'4',name:'数据库管理',children:[
              {id:'4-1',name:'数据库备份',url:'/YUser/systemSettings/dataBaseBackUp'},
              {id:'4-2',name:'备份定时器',url:'/YUser/systemSettings/backUpTimer'},
              {id:'4-3',name:'数据库还原',url:'/YUser/systemSettings/dataBaseRestore'}
            ]
          },
        ]
      }
    },
    computed: {
      // 监听 url 详情页面的导航
      current() {
        var arr = this.$route.path.split('/');
        if (arr.length > 4) {
          arr.pop();
          return arr.join("/");
        } else {
          return this.$route.path;
        }
      }
    },
  }
</script>

<style>
  .systemSettings-navBarBox {
    position: relative;
    overflow: auto;
  }
  .systemSettings-title {
    height: 56px;
    line-height: 56px;
    padding: 0 10px;
    font-size: 16px;

  }

  .systemSettings-oddRouter {
    width: 100%;
    display: inline-block;
  }
</style>
