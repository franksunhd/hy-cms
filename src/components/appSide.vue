<template>
  <div id="menuBox" class="box clearfix">
    <div class="box-left fl">
      <ul class="box-left-ful" @mouseover="MouseOverFul" >
        <li ><i class="el-icon-menu"></i></li>
        <li v-show="show">功能清单列表</li>
        <li v-show="show">&gt;</li>
      </ul>
      <!--便捷菜单列表-->
      <ul class="box-left-two" v-for='data in activeClass' :key="data.id"
          v-dragging="{ item: data, list: activeClass, group: 'data' }"
          @mouseover="MouseOverTwo"
          @mouseout="MouseOutTwo">
        <li><i class="el-icon-picture"></i></li>
        <li v-show="show" :title="data.menuName">
          <router-link
          	
            class="bg-white"
            @click.native="hiddenAlert(data.menuId)"
            :to="{path:data.menuHref,query:{id:data.menuId}}">{{data.menuName}}
          </router-link>
        </li>
        <li v-show="mouse"><i title="刪除" class="el-icon-close" @click="delItem(data)"></i></li>
        <li v-show="mouse"><i title="拖拽排序" class="el-icon-rank"></i></li>
      </ul>
    </div>
    <div class="box-right" v-show="rshow" @mouseleave="mouseOutRight" v-loading="selectArr.length === 0">
      <div class="box-right-abs">
        <div class="box-close" @click="ClickClose"><i class="el-icon-close"></i></div>
      </div>
      <div class="fnlist" v-for="(value,index) in selectArr" :key="index">
        <span class="fnspan">{{value.menuName}}</span>
        <ul class="app-side-ul">
          <li v-for="(item,index) in value.systemMenuAndLanguageRelationChildList" :item="item" :key="index">
            <router-link @click.native="hiddenAlert(item.id)" :to="{path:item.menuHref,query:{id:item.id}}">
              {{ item.menuName }}
            </router-link>
            <i></i>
            <i v-if="item.status == 1" class="el-icon-star-on" @click="delItem(item)"></i>
            <i v-if="item.status == 0" class="el-icon-star-off" @click="getItem(item)"></i>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  import {returnObjectById} from "../assets/js/recursive";
  export default {
    name: 'app-side',
    data() {
      return {
        rshow: false,
        mouse: false,
        show: false,
        activeClass: [],
        selectArr: [],
        search: '',
        dragListEnd: []
      }
    },
    methods: {
      // 拖拽导航
      dragList() {
        var _t = this;
        _t.$dragging.$on('dragend', (val) => {
          if (val.group === 'data') {
            var dragListEnd = _t.activeClass;
            var listEndIds = new Array();
            var listEndNames = new Array();
            dragListEnd.forEach(function (item) {
              listEndIds.push(item.id);
              listEndNames.push(item.menuName);
            });
            _t.updateMenuData(listEndIds.join(','));
          }
        });
      },
      // 锚点链接
      resultTip(data) {
        document.querySelector('#' + data).scrollIntoView(true);
      },
      // 路由跳转隐藏弹出层
      hiddenAlert(val) {
        this.show = false;
        this.rshow = false;
        localStorage.setItem('hy-menu-id', val);
      },
      // 鼠标移入功能导航菜单
      MouseOverFul() {
        this.show = true;
        this.rshow = true;
      },
     /* //鼠标移除功能导航菜单
      MouseOutFul(){
      	
        this.rshow = false;
      },*/
      // 鼠标移入便捷菜单
      MouseOverTwo() {
      	this.rshow=false;
      	 this.mouse = true;
          this.show = true;
       /* if (this.rshow == true) {
          this.mouse = true;
          this.show = true;
        } else {
          this.mouse = true;
          this.show = true;
        }*/
      },
      // 鼠标移出便捷菜单
      MouseOutTwo() {
      	  this.mouse = false;
          this.show = false;
       /* if (this.rshow == true) {
          this.mouse = false;
          this.show = true;
        } else {
          this.mouse = false;
          this.show = false;
        }*/
      },
      //移出右侧菜单栏
      mouseOutRight(){
      	this.rshow=false;
      	this.show=false;
      },
      // 点击关闭弹出层
      ClickClose() {
        this.show = false;
        this.rshow = false;
      },
      // 请求菜单数据
      getData() {
        var _t = this;
        _t.$api.get('system/menu/', {
          jsonString: JSON.stringify({
            menuLevel: '1_2_3_4',
            languageMark: localStorage.getItem('hy-language')
          })
        }, function (res) {
          switch (res.status) {
            case 200: // 查询成功
              var navBarArr = res.data.rootMenu;
              if (navBarArr) {
                navBarArr.forEach(function (item) {
                  // 子菜单为空的判断
                  if (item.systemMenuAndLanguageRelationChildList.length === 0) {
                    item.systemMenuAndLanguageRelationChildList = null;
                  }
                });
                // 判断是否加入便捷菜单
                _t.activeClass.forEach(function (item) {
                  // 菜单id锁对应的集合
                  var menuIdStatus = returnObjectById(navBarArr,item.menuId);
                  if (menuIdStatus !== undefined) {
                    menuIdStatus.status = 1;
                    menuIdStatus.menuNum = item.id;
                  }
                });
                _t.selectArr = navBarArr;
              }
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.selectArr = [];
              break;
          }
        });
      },
      // 获取便捷菜单列表
      getMenuData() {
        var _t = this;
        _t.$api.get('system/userShortcutMenu/getListByUserId', {
          jsonString: JSON.stringify({
            languageMark: localStorage.getItem('hy-language'),
            userId: localStorage.getItem('hy-user-id')
          })
        }, function (res) {
          switch (res.status) {
            case 200:
              res.data.forEach(function (item) {
                item.menuNum = item.id;
              });
              _t.activeClass = res.data;
              _t.getData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              _t.activeClass = [];
              break;
          }
        });
      },
      // 加入便捷菜单
      getItem(val) {
        var _t = this;
        _t.$api.post('system/userShortcutMenu/', {
          userId: localStorage.getItem('hy-user-id'),
          menuId: val.id
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.getMenuData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            case 2005: // 已加入便捷菜单
              _t.$alert(res.message, _t.$t('public.resultTip'), {
                confirmButtonText: _t.$t('public.confirm'),
                confirmButtonClass: 'alertBtn'
              }).then(() => {});
              break;
            default:
              break;
          }
        });
      },
      // 删除便捷菜单
      delItem(data) {
        var _t = this;
        _t.$api.delete('system/userShortcutMenu/' + data.menuNum, {}, function (res) {
          switch (res.status) {
            case 200:
              _t.getMenuData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            case 2007:
              _t.$alert(res.message);
            default:
              break;
          }
        })
      },
      // 便捷菜单排序后发送请求
      updateMenuData(val) {
        var _t = this;
        _t.$api.put('system/userShortcutMenu/', {
          idStr: val,
          userId: localStorage.getItem('hy-user-id')
        }, function (res) {
          switch (res.status) {
            case 200:
              _t.getMenuData();
              break;
            case 1003: // 无操作权限
            case 1004: // 登录过期
            case 1005: // token过期
            case 1006: // token不通过
              _t.exclude(_t, res.message);
              break;
            default:
              break;
          }
        });
      }
    },
    mounted() {
      this.dragList();
    },
    created() {
      var _t = this;
      if (localStorage.getItem('hy-language') == null || localStorage.getItem('hy-user-id') == null) {
        setTimeout(function () {
          _t.getMenuData();
        }, 1000);
      } else {
        _t.getMenuData();
      }
      // 菜单权限更改后 实现局部的接口刷新, 避免整个页面的刷新
      _t.$bus.on('getMenu',(val)=>{
        if (val) {
          _t.getMenuData();
        }
      });
    }
  }
</script>
<style scoped>
  .box {
    overflow: hidden;
    z-index: 1031;
    position: fixed;
    top: 52px;
    left: 0;
    bottom: 0;
  }

  .box-right-box {
    width: 840px;
    height: 100%;
    padding: 24px 0 20px 30px;
    position: relative;
  }

  .box-right-searchBox {
    position: relative;
    margin-bottom: 20px;
  }

  .box-right-search {
    width: 624px;
  }

  .box-right-search-no {
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    position: absolute;
    top: -4px;
    right: 20px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }

  .box-search-result-null {
    margin-top: 20px;
    line-height: 30px;
    height: 30px;
  }

  .box-search-result-null > span {
    font-size: 20px;
  }

  .box-right {
    width: 590px;
    height: 100%;
    padding-left: 14px;
    padding-right: 14px;
    float: left;
    overflow-y: scroll;
    position: relative;
  }

  .fnlist {
    overflow: hidden;
    padding-top: 20px;
    width: 556px;
  }

  .fnspan {
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
  }

  .fnlist ul li {
    display: inline-block;
    width: 125px;
    line-height: 35px;
    margin-right: 10px;
    overflow: hidden;
  }

  .fnlist ul li:first-child {
    margin-left: 0;
  }

  .fnlist ul li:hover {
    width: 125px;
    cursor: pointer;
  }

  .box-left {
    float: left;
    background-color: #252a2f;
    z-index: 1001;
    height: 100%;
    overflow: hidden;
  }

  .box-left-ful {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #3b4046;
    background-color: #3b4046;
  }

  .box-left-ful:hover {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }

  .box-left-ful li:first-child {
    float: left;
    width: 56px;
    height: 50px;
    line-height: 50px;
    font-size: 26px;
    text-align: center;
  }

  .box-left-ful li:nth-child(2) {
    float: left;
    width: 150px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .box-left-ful li:nth-child(3) {
    float: left;
    width: 24px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
  }

  .box-left-two {
    height: 44px;
    line-height: 44px;
    font-size: 12px;
  }

  .box-left-two:hover {
    cursor: pointer;
  }

  .box-left-two > li:first-child {
    float: left;
    width: 56px;
    font-size: 26px;
    text-align: center;
    
  }

  .box-left-two > li:nth-child(2) {
    float: left;
    width: 120px;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden; 
    text-overflow: ellipsis;
     /* ！autoprefixer: off */
    -webkit-box-orient: vertical;
     /*autoprefixer: on*/ 
  }

  .box-left-two > li:nth-child(3) {
    float: left;
    width: 27px;
    font-size: 12px;
    text-align: left;
  }

  .box-left-two > li:nth-child(4) {
    float: left;
    width: 27px;
    font-size: 12px;
  }

  .box-right-abs {
    overflow: hidden;
    width: 200px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .box-batchEditor {
    float: right;
    height: 26px;
    margin-right: 30px;
    margin-top: 20px;
    cursor: pointer;
  }

  .box-batchEditor span:first-child {
    font-size: 26px;
    display: inline-block;
    vertical-align: middle;
  }

  .box-batchEditor span:nth-child(2) {
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }

  .box-close {
    float: right;
    margin-right: 10px;
    margin-top: 20px;
    font-size: 25px;
    cursor: pointer;
  }

  .app-side-ul {
    min-height: 20px;
  }
</style>
