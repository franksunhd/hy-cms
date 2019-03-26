<template>
  <div class="systemSettingsMonitoring-box">
    <div v-show="isShow" class="systemSettingsMonitoring-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="systemSettingsMonitoring-inSet">内</a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="systemSettingsMonitoring-outSet">外</a>
    <div id="systemSettingsMonitoring-routerView" class="systemSettingsMonitoring-routerView">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';

  export default {
    name: "systemSettingsMonitoring",
    components: {systemSettingsNavBar},
    data() {
      return {
        isShow: true,
        levelList: null,
      }
    },
    methods: {
      // 收缩
      clickInset() {
        this.isShow = false;
        document.getElementById('systemSettingsMonitoring-outSet').style.display = 'inline-block';
        document.getElementById('systemSettingsMonitoring-outSet').style.left = '60px';
        document.getElementById('systemSettingsMonitoring-routerView').style.paddingLeft = '0px';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('systemSettingsMonitoring-outSet').style.display = 'none';
        document.getElementById('systemSettingsMonitoring-outSet').style.left = '235px';
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
      this.$nextTick(() => {
        var node = document.querySelectorAll('#system-menu li.el-submenu');
        for (var i = 0; i < node.length; i++) {
          var classArr = node[i].getAttribute('class').split(' ');
          for (var j = 0; j < classArr.length; j++) {
            if (classArr[j] === 'is-active') {
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
      });
    },
    created() {
    }
  }
</script>

<style>
  .systemSettingsMonitoring-box {
    height: 100%;
  }

  .systemSettingsMonitoring-routerView {
    width: auto;
    position: absolute;
    top: 0;
    left: 174px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .systemSettingsMonitoring-navBar {
    width: 174px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  #systemSettingsMonitoring-inSet {
    position: fixed;
    top: 50%;
    left: 210px;
  }

  #systemSettingsMonitoring-outSet {
    position: fixed;
    top: 50%;
    left: 60px;
    display: none;
    z-index: 1001;
  }
</style>
