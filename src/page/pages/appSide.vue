<template>
  <div id="menuBox" class="box clearfix">
    <div class="box-left fl">
      <ul class="box-left-ful">
        <li @mouseover="MouseOverFul"><i class="el-icon-menu"></i></li>
        <li v-show="show">功能清单列表</li>
        <li v-show="show">&gt;</li>
      </ul>
      <!--便捷菜单列表-->
      <ul class="box-left-two" v-for='data in activeClass' :key="data.id"
          v-dragging="{ item: data, list: activeClass, group: 'data' }"
          @mouseover="MouseOverTwo"
          @mouseout="MouseOutTwo">
        <li><i class="el-icon-picture"></i></li>
        <li v-show="show">{{data.menuName}}</li>
        <li v-show="mouse"><i class="el-icon-close" @click="delItem(data)"></i></li>
        <li v-show="mouse"><i class="el-icon-rank"></i></li>
      </ul>
    </div>
    <!--<div v-show="rshow" class="box-right-box fl">-->
    <!--<div class="box-right-searchBox">-->
    <!--<el-input v-model="search" class="box-right-search" prefix-icon="el-icon-search" placeholder="请输入关键词"/>-->
    <!--<i class="el-icon-close box-right-search-no" @click="ClickClose"></i>-->
    <!--</div>-->
    <!--<ul style="overflow-y: scroll;position: absolute;top: 84px;left: 30px;bottom: 0;padding-bottom: 50px;" v-if="selectArr.length !== 0">-->
    <!--<li :id="item.id" v-for="(item,index) in selectArr"-->
    <!--:key="index">-->
    <!--&lt;!&ndash;一级&ndash;&gt;-->
    <!--<span style="-->
    <!--font-size: 20px;-->
    <!--color: red;-->
    <!--background-color: green;-->
    <!--">{{item.menuName}}</span><div v-for="(val,i) in item.systemMenuAndLanguageRelationChildList"-->
    <!--v-if="item.systemMenuAndLanguageRelationChildList.length !== 0"-->
    <!--:key="i">-->
    <!--&lt;!&ndash;二级&ndash;&gt;-->
    <!--<router-link-->
    <!--:to="{path:item.menuHref,query:{id:val.id}}"-->
    <!--@click.native="hiddenAlert(val.id)"-->
    <!--style="font-size: 16px;color: blue;background-color: red;">{{val.menuName}}</router-link>-->
    <!--<ul style="width: 640px;display: flex;flex-wrap: wrap;">-->
    <!--&lt;!&ndash;三级&ndash;&gt;-->
    <!--<li v-for="(data,j) in val.systemMenuAndLanguageRelationChildList"-->
    <!--:key="j"-->
    <!--style="width: 156px;">-->
    <!--<router-link-->
    <!--:to="{path:data.menuHref,query: {id:val.id}}"-->
    <!--@click.native="hiddenAlert(val.id)"-->
    <!--style="font-size: 14px;color: green;background-color: orange;">{{data.menuName}}</router-link>-->
    <!--<div v-for="(menu,k) in data.systemMenuAndLanguageRelationChildList" :key="k">-->
    <!--<router-link-->
    <!--:to="{path:menu.menuHref,query: {id:val.id}}"-->
    <!--@click.native="hiddenAlert(val.id)"-->
    <!--style="font-size: 12px;height: 30px;line-height: 30px;color: orange;">{{menu.menuName}}</router-link>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--<p v-else class="box-search-result-null">-->
    <!--未找到与 "<span> {{ search }} </span>" 有关的内容-->
    <!--</p>-->
    <!--<ul style="position: absolute; top: 84px; right: 75px;">-->
    <!--<li v-for="(item,index) in selectArr" :key="index">-->
    <!--<a href="javascript:;" @click="resultTip(item.id)">{{item.menuName}}</a>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->

    <div class="box-right" v-show="rshow" v-loading="selectArr.length === 0">
      <div class="box-right-abs">
        <div class="box-close" @click="ClickClose"><i class="el-icon-close"></i></div>
        <div class="box-batchEditor">
          <span><i class="el-icon-setting"></i></span><span>批量编辑</span>
        </div>
      </div>
      <div class="fnlist" v-for="(value,index) in selectArr" :key="index">
        <span class="fnspan">{{value.menuName}}</span>
        <ul>
          <li v-for="(item,index) in value.systemMenuAndLanguageRelationChildList" :item="item" :key="index">
            <router-link @click.native="hiddenAlert(item.id)" :to="{path:item.menuHref,query:{id:item.id}}">
              {{ item.menuName }}
            </router-link>
            <i :class="activeClass.indexOf(item.menuName)!=-1?'el-icon-star-on':'el-icon-star-off'"
               @click="getItem(item)"></i>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  import menuData from '../../assets/js/menuData';
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
    mounted() {
      console.log(1)
      this.dragList();
    },
    methods: {
      // 拖拽导航
      dragList() {
        var _t = this;
        var dragListEnd = new Array();
        _t.$dragging.$on('dragged', ({value}) => {
          dragListEnd = value.list;
        });
        _t.$dragging.$on('dragend', (val) => {
          if (val.group === 'data') {
            var listEndIds = new Array();
            var listEndNames = new Array();
            dragListEnd.forEach(function (item) {
              listEndIds.push(item.id);
              listEndNames.push(item.menuName);
            });
            // console.log(listEndNames.join(','));
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
      // 鼠标移入便捷菜单
      MouseOverTwo() {
        if (this.rshow == true) {
          this.mouse = true;
          this.show = true;
        } else {
          this.mouse = true;
          this.show = true;
        }
      },
      // 鼠标移出便捷菜单
      MouseOutTwo() {
        if (this.rshow == true) {
          this.mouse = false;
          this.show = true;
        } else {
          this.mouse = false;
          this.show = false;
        }
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
                  if (item.systemMenuAndLanguageRelationChildList.length === 0) {
                    item.systemMenuAndLanguageRelationChildList = null;
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
              _t.activeClass = res.data;
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
        // 把当前点击元素的index，赋值给activeClass
        // if (this.activeClass.indexOf(val) == -1) {
        //   this.activeClass.unshift(val);
        // } else {
        //   this.activeClass.splice(this.activeClass.indexOf(val), 1);
        // }
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
            default:
              break;
          }
        });
      },
      // 删除便捷菜单
      delItem(data) {
        var _t = this;
        _t.$api.delete('system/userShortcutMenu/' + data.id, {}, function (res) {
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
    created() {
      this.getData();
      this.getMenuData();
    }
  }
</script>
<style scoped>
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
</style>

<style scoped>
  .box {
    overflow: hidden;
    z-index: 1031;
    height: 100%;
    position: fixed;
    top: 52px;
    left: 0;
    bottom: 0;
  }

  .box-right {
    width: 584px;
    padding-left: 14px;
    padding-right: 14px;
    float: left;
    overflow: hidden;
    background-color: #fff;
    position: relative;
    height: 444px;
  }

  .fnlist {
    overflow: hidden;
    padding-top: 20px;
    width: 556px;
    border-bottom: 1px solid #ccc;
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
    color: #3f81d0;
  }

  .el-icon-star-off {
    color: #f22;
  }

  .el-icon-star-on {
    color: #f22;
    background-color: #fff;
  }

  .selectActive {
    color: #f22;
    background-color: #fff;
  }

  .box-left {
    float: left;
    background-color: #252a2f;
    z-index: 1001;
    height: 100%;
    overflow: hidden;
    color: #e3e5ee;
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
    background-color: #3f81d0;
    color: #fff;
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
    color: #3f81d0;
    background-color: #fff;
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
</style>
