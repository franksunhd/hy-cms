<template>
  <div class="systemSettings-navBarBox">
    <p class="systemSettings-title">{{$t('system.systemSetting')}}</p>
    <div class="systemSettings-navBarContent">
      <el-menu :default-active="current" :router="true" :unique-opened="true">
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
              {id:'2-1',name:'平台信息设置1',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-2',name:'平台信息设置2',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-3',name:'平台信息设置3',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-4',name:'平台信息设置4',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-5',name:'平台信息设置5',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-6',name:'平台信息设置6',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-7',name:'平台信息设置7',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-8',name:'平台信息设置8',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-9',name:'平台信息设置9',url:'/YUser/systemSettings/platformInformation'},
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
