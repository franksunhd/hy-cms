<template>
  <div class="systemSettingsMonitoring-box">
    <div v-show="isShow" class="systemSettingsMonitoring-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="systemSettingsMonitoring-inSet">
        <span class="iconfont" style="font-size: 14px;">&#xe68b;</span>
      </a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="systemSettingsMonitoring-outSet">
      <span class="iconfont">&#xe69d;</span>
    </a>
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
        document.getElementById('systemSettingsMonitoring-routerView').style.left = '0';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('systemSettingsMonitoring-outSet').style.display = 'none';
        document.getElementById('systemSettingsMonitoring-routerView').style.left = '174px';
      },
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

  #systemSettingsMonitoring-inSet,
  #systemSettingsMonitoring-outSet {
    height: 40px;
    width: 14px;
    top: 50%;
    text-align: center;
    line-height: 40px;
    position: fixed;
  }

  #systemSettingsMonitoring-inSet {
    left: 216px;
    border-radius: 15px 0 0 15px;
  }

  #systemSettingsMonitoring-outSet {
    left: 56px;
    display: none;
    z-index: 1001;
    border-radius: 0 15px 15px 0;
  }
</style>
