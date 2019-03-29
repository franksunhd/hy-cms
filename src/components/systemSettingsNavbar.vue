<template>
  <div class="systemSettings-navBarBox">
    <p class="systemSettings-title" :title="titleName">{{titleName}}</p>
    <div v-loading="navBarArr.length === 0" class="systemSettings-navBarContent">
      <el-menu id="system-menu" :default-active="current" :router="true" :unique-opened="false" menu-trigger="click">
        <el-submenu v-for="(item,index) in navBarArr" :index="item.id" :key="index">
          <template slot="title" v-if="item.systemMenuAndLanguageRelationChildList == null">
            <i class="el-icon-minus"></i>
            <router-link class="systemSettings-oddRouter" :to="item.menuHref" :title="item.menuName">{{item.menuName}}
            </router-link>
          </template>
          <template v-else>
            <template slot="title">
              <span :title="item.menuName">
                <i class="el-icon-plus"></i>
                {{item.menuName}}
              </span>
            </template>
            <el-menu-item v-for="(i,index2) in item.systemMenuAndLanguageRelationChildList" :key="index2"
                          :index="i.menuHref">
              <span class="treeBorder" :title="i.menuName">
                <span class="treeBorderLine">--- &nbsp;</span>
                 {{i.menuName}}
              </span>
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
        titleName:'',
        navBarArr:[],
        navBarArrList1:[
          {id:'1',name:'许可证信息维护',children:null,url:'/YUser/systemSettings/licenseInformation'},
          {id:'2',name:'系统管理',children:[
              {id:'2-1',name:'平台信息设置',url:'/YUser/systemSettings/platformInformation'},
              {id:'2-2',name:'平台语言设置',url:'/YUser/systemSettings/platformLanguage'},
              {id:'2-3',name:'数据字典管理',url:'/YUser/systemSettings/dataDictionary'},
              {id:'2-4',name:'License到期通知',url:'/YUser/systemSettings/licenseNotice'},
              {id:'2-5',name:'接口访问测试',url:'/YUser/systemSettings/interfaceTest'},
            ]
          },
          {id:'3',name:'用户管理',children:[
              {id:'3-1',name:'用户维护',url:'/YUser/systemSettings/userMaintenance'},
              {id:'3-2',name:'角色维护',url:'/YUser/systemSettings/roleMaintenance'},
              {id:'3-3',name:'组织维护',url:'/YUser/systemSettings/organizeMaintenance'},
              {id:'3-4',name:'功能菜单维护',url:'/YUser/systemSettings/functionMenuMaintenance'}
            ]
          },
          {id:'4',name:'数据库管理',children:[
              {id:'4-1',name:'数据库备份',url:'/YUser/systemSettings/dataBaseBackUp'},
              {id:'4-2',name:'备份定时器',url:'/YUser/systemSettings/backUpTimer'},
              {id:'4-3',name:'数据库还原',url:'/YUser/systemSettings/dataBaseRestore'}
            ]
          },
          {id:'5',name:'设备采集设置',children:[
              {id:'5-1',name:'节点组维护',url:'/YUser/systemSettings/nodeGroupMaintenance'},
              {id:'5-2',name:'采集节点管理',url:'/YUser/systemSettings/acquisitionNodeManagement'},
              {id:'5-3',name:'采集任务分配',url:'/YUser/systemSettings/collectionTaskAssignment'},
              {id:'5-4',name:'采集节点状态',url:'/YUser/systemSettings/acquisitionNodeState'}
            ]
          },
          {id:'6',name:'日志管理',children:[
              {id:'6-1',name:'登录日志',url:'/YUser/systemSettings/loginLog'},
              {id:'6-2',name:'操作日志',url:'/YUser/systemSettings/operationLog'},
              {id:'6-3',name:'任务日志',url:'/YUser/systemSettings/jobLog'},
              {id:'6-4',name:'通知日志',url:'/YUser/systemSettings/notificationLog'},
              {id:'6-5',name:'检测日志',url:'/YUser/systemSettings/testLog'}
            ]
          },
        ],
        navBarArrList2:[
          {id:'1',name:'WEB应用',children:null,url:'/YUser/systemSettingsMonitoring/WebApplication'},
          {id:'2',name:'数据库应用',children:null,url:'/YUser/systemSettingsMonitoring/DatabaseApplication'},
          {id:'3',name:'采集器应用',children:null,url:'/YUser/systemSettingsMonitoring/CollectorApplication'},
        ]
      }
    },
    methods: {
      // 请求菜单数据
      getData(item) {
        var _t = this;
        _t.$api.get('system/menu/', _t.getCookie('hy-token'), {
          menuId: item,
          menuLevel: '3_4',
          languageMark: localStorage.getItem('hy-language')
        }, function (res) {
          switch (res.status) {
            case 200:
              var navBarArr = res.data.rootMenu;
              if (navBarArr) {
                navBarArr.forEach(function (item) {
                  if (item.systemMenuAndLanguageRelationChildList.length === 0) {
                    item.systemMenuAndLanguageRelationChildList = null;
                  }
                });
                _t.navBarArr = navBarArr;
                _t.$nextTick(() => {
                  _t.clickNode();
                });
              }
              break;
            case 1004: // token 失效
            case 1005: // token 为 null
            case 1006: // token 不一致
              _t.exclude(_t, res.message);
              break;
            default:
              _t.navBarArr = [];
              break;
          }
        });
      },
      clickNode() {
        var node = document.querySelectorAll('#system-menu li.el-submenu');
        for (var i = 0;i < node.length;i++) {
          var classArr = node[i].getAttribute('class').split(' ');
          for (var j = 0;j < classArr.length;j++){
            if (classArr[j] === 'is-opened') {
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
    created() {
      var menuId = this.$route.query.id || localStorage.getItem('hy-menu-id');
      switch (menuId) {
        case 'menu_01_01':
          this.titleName = this.$t('system.systemSetting');
          break;
        case 'menu_01_02':
          this.titleName = this.$t('system.systemMonitoring');
          break;
        default:
          break;
      }
      this.getData(menuId);
    }
  }
</script>

<style>
  .systemSettings-title {
    height: 50px;
    line-height: 50px;
    padding: 0 0 0 20px;
    font-size: 14px;
  }

  .systemSettings-navBarContent {
    width: auto;
    position: absolute;
    top: 50px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .systemSettings-navBarContent .el-submenu__title {
    font-size: 12px;
  }

  .systemSettings-navBarContent .el-menu-item {
    font-size: 12px;
  }

  .systemSettings-navBarContent .el-submenu i {
    font-size: 14px !important;
  }

  .systemSettings-oddRouter {
    display: inline-block;
  }

  .systemSettings-navBarBox .el-submenu .el-menu-item,
  .systemSettings-navBarBox .el-submenu .el-submenu__title {
    height: 30px;
    line-height: 30px;
    min-width: auto;
  }

  .systemSettings-navBarBox .el-submenu__title {
    padding: 0 !important;
  }

  .systemSettings-navBarBox .el-menu-item {
    min-width: 100%;
    padding: 0 0 0 10px !important;
  }

  .systemSettings-navBarBox .treeBorder {
    width: 100%;
    padding-left: 10px;
    display: inline-block;
  }
</style>
