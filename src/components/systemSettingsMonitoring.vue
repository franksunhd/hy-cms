<template>
  <el-container class="systemSettingsMonitoring-box">
    <div>
      <el-aside v-show="isShow" class="systemSettingsMonitoring-navBar" width="174px">
        <systemSettingsNavBar />
        <a href="javascript:;"  @click="clickInset" id="systemSettingsMonitoring-navBar-inSet">内</a>
      </el-aside>
      <a href="javascript:;" @click="clickOutset" id="systemSettingsMonitoring-navBar-outSet">外</a>
    </div>
    <div id="systemSettingsMonitoring-routerView" class="systemSettingsMonitoring-routerView">
      <div style="padding: 0 20px;">
        <router-view/>
      </div>
    </div>
  </el-container>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';
  export default {
    name: "systemSettingsMonitoring",
    components:{systemSettingsNavBar},
    data(){
      return {
        isShow:true,
        levelList: null,
        navBarArr:[
          {id:'1',name:'许可证信息维护',children:null,url:'/YUser/systemSettings/licenseInformation'},
          {id:'2',name:'系统管理',children:[
              {id:'2-1',name:'平台信息设置',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-2',name:'平台语言设置',url:'/YUser/systemSettings/platformLanguage'},
              {id:'2-3',name:'数据字典管理',url:'/YUser/systemSettings/dataDictionary'},
              {id:'2-4',name:'License到期通知',url:'/YUser/systemSettings/licenseNotice'},
              {id:'2-5',name:'接口访问测试',url:'/YUser/systemSettings/interfaceTest'},
            ]
          },
        ]
      }
    },
    methods: {
      // 收缩
      clickInset() {
        this.isShow = false;
        document.getElementById('systemSettingsMonitoring-navBar-outSet').style.display = 'inline-block';
        document.getElementById('systemSettingsMonitoring-navBar-outSet').style.left = '60px';
        document.getElementById('systemSettingsMonitoring-routerView').style.paddingLeft = '0px';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('systemSettingsMonitoring-navBar-outSet').style.display = 'none';
        document.getElementById('systemSettingsMonitoring-navBar-outSet').style.left = '235px';
        document.getElementById('systemSettingsMonitoring-routerView').style.paddingLeft = '174px';
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
    mounted() {
      this.$nextTick(()=>{
        var node = document.querySelectorAll('#system-menu li.el-submenu');
        for (var i = 0;i < node.length;i++) {
          var classArr = node[i].getAttribute('class').split(' ');
          for (var j = 0;j < classArr.length;j++){
            if (classArr[j] === 'is-active') {
              node[i].childNodes[0].childNodes[0].childNodes[0].className = 'el-icon-minus';
            }
          }
        }
        // 点击菜单
        var titleMenu = document.querySelectorAll('#system-menu li.el-submenu .el-submenu__title');
        for (var k = 0;k < titleMenu.length;k++){
          titleMenu[k].onclick = function () {
            if (this.childNodes[0].className !== 'el-icon-minus')  {
              this.childNodes[0].childNodes[0].className = this.childNodes[0].childNodes[0].className === 'el-icon-plus' ? 'el-icon-minus' : 'el-icon-plus';
            }
          }
        }
      });
    },
    created() {
    }
  }
</script>

<style>
  .systemSettingsMonitoring-routerView {
    width: 100%;
    padding-left: 174px;
  }

  .systemSettingsMonitoring-navBar {
    position: absolute;
    top: 53px;
    left: 56px;
    bottom: 0;
  }

  #systemSettingsMonitoring-navBar-inSet {
    position: fixed;
    top: 50%;
    left: 210px;
  }

  #systemSettingsMonitoring-navBar-outSet {
    position: fixed;
    top: 50%;
    left: 60px;
    display: none;
    z-index: 1001;
  }

  .systemSettingsMonitoring-navBarBox {
    position: relative;
  }

  .systemSettingsMonitoring-title {
    height: 50px;
    line-height: 50px;
    padding: 0 0 0 20px;
    font-size: 14px;

  }

  .systemSettingsMonitoring-navBarContent .el-submenu__title {
    font-size: 12px;
  }

  .systemSettingsMonitoring-navBarContent .el-menu-item {
    font-size: 12px;
  }

  .systemSettingsMonitoring-navBarContent .el-submenu i {
    font-size: 14px !important;
  }

  .systemSettingsMonitoring-oddRouter {
    display: inline-block;
  }

  .systemSettingsMonitoring-navBarBox .el-menu-item,
  .systemSettingsMonitoring-navBarBox .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }

  .systemSettingsMonitoring-navBarBox .el-submenu__title {
    padding: 0 !important;
  }

  .systemSettingsMonitoring-navBarBox .el-menu-item {
    min-width: 100%;
    padding: 0 0 0 10px !important;
  }

  .systemSettingsMonitoring-navBarBox .treeBorder {
    width: 100%;
    padding-left: 10px;
    display: inline-block;
  }
</style>
