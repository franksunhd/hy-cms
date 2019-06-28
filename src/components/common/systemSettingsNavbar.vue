<template>
  <div class="systemSettings-navBarBox">
    <p class="systemSettings-title" :title="titleName">{{titleName}}</p>
    <div id="systemSettings-navBarContent" class="systemSettings-navBarContent">
      <el-menu id="system-menu" :default-active="current" :router="true" :unique-opened="false" menu-trigger="click">
        <el-submenu v-for="(item,index) in navBarArr" :index="item.id" :key="index">
          <template slot="title" v-if="item.systemMenuAndLanguageRelationChildList == null">
            <i class="el-icon-minus"></i>
            <router-link class="systemSettings-oddRouter" :to="item.menuHref" :title="item.menuName">{{item.menuName}}
            </router-link>
          </template>
          <template v-else>
            <template slot="title">
              <span style="display: flex;" :title="item.menuName">
                <i class="el-icon-plus"></i>
                <span style="flex: 1" class="systemSettings-oddRouter">{{item.menuName}}</span>
              </span>
            </template>
            <el-menu-item v-for="(i,index2) in item.systemMenuAndLanguageRelationChildList" :key="index2"
                          :index="i.menuHref">
              <span style="display: flex;" class="treeBorder" :title="i.menuName">
                <span class="treeBorderLine">--- &nbsp;</span>
                <span style="flex: 1;" class="systemSettings-oddRouter">{{i.menuName}}</span>
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
    data() {
      return {
        titleName: '',
        navBarArr: [],
      }
    },
    methods: {
      // 请求菜单数据
      getData(item) {
        var _t = this;
        _t.$api.get('system/menu/', {
          jsonString: JSON.stringify({
            menuId: item,
            menuLevel: '3_4',
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              var navBarArr = res.data.rootMenu === null ? [] : res.data.rootMenu;
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
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.navBarArr = [];
              break;
          }
        });
      },
			// 点击菜单的时候
      clickNode() {
        var node = document.querySelectorAll('#system-menu li.el-submenu');
        for (var i = 0; i < node.length; i++) {
          var classArr = node[i].getAttribute('class').split(' ');
          for (var j = 0; j < classArr.length; j++) {
            if (classArr[j] === 'is-opened') {
              node[i].childNodes[0].childNodes[0].childNodes[0].className = 'el-icon-minus';
            }
          }
        }
        // 点击菜单
        var titleMenu = document.querySelectorAll('#system-menu li.el-submenu .el-submenu__title');
        for (var k = 0; k < titleMenu.length; k++) {
          titleMenu[k].onclick = function () {
            if (this.childNodes[0].className !== 'el-icon-minus') {
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
      var _t = this;
      var menuId = this.$route.query.id || localStorage.getItem('hy-menu-id');
      switch (menuId) {
        case 'menu_001_001':
          _t.titleName = _t.$t('system.systemSetting');
          break;
        case 'menu_001_002':
          _t.titleName = _t.$t('system.systemMonitoring');
          break;
        case 'menu_005_004':
        	_t.titleName = _t.$t('system.alarmSettings');
        default:
          break;
      }
      _t.getData(menuId);
      _t.$bus.on('getMenuData',(val)=>{
        if (val){
          _t.getData(menuId);
        }
      });
    }
  }
</script>

<style>
  .systemSettings-title {
    height: 50px;
    line-height: 50px;
    padding: 0 0 0 20px;
    font-size: 14px;
    font-weight: bold;
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
    font-size: 12px !important;
    color: #252a2f;
    line-height: 36px;
  }

  .systemSettings-oddRouter {
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 140px;
  }

  .systemSettings-navBarBox .el-submenu .el-menu-item,
  .systemSettings-navBarBox .el-submenu .el-submenu__title {
    height: 36px;
    line-height: 36px;
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
    height: 100%;
    padding-left: 10px;
    display: inline-block;
  }

  #systemSettings-navBarContent::-webkit-scrollbar {
    display: none;
  }
</style>
