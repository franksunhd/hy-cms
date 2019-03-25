<template>
  <div class="box">
    <div class="box-left">
      <ul class="box-left-ful">
        <li @mouseover="MouseOverFul"><i class="el-icon-menu"></i></li>
        <li v-show="show">功能清单列表</li>
        <li v-show="show">&gt;</li>
      </ul>
      <ul class="box-left-two" v-for='x,y in activeClass' :key="x"
          v-dragging="{ item: x, list: activeClass, group: 'x' }" @mouseover="MouseOverTwo" @mouseout="MouseOutTwo">
        <li><i class="el-icon-picture"></i></li>
        <li v-show="show">{{x}}</li>
        <li v-show="mouse"><i class="el-icon-close" @click="delItem(y,x)"></i></li>
        <li v-show="mouse"><i class="el-icon-rank"></i></li>
      </ul>
    </div>
    <div class="box-right" v-show="rshow">
      <div class="box-right-abs">
        <div class="box-close" @click="ClickClose"><i class="el-icon-close"></i></div>
        <div class="box-batchEditor">
          <span><i class="el-icon-setting"></i></span><span>批量编辑</span>
        </div>
      </div>
      <div class="fnlist" v-for="(value,index) in selectArr" :key="index">
        <span class="fnspan">{{value.name}}</span>
        <ul>
          <li v-for="(item,index) in value.arrList" :item="item" :key="index">
            <router-link @click.native="hiddenAlert" :to="{path:item.url,query:{id:item.preId}}">
              {{ item.name }}
            </router-link>
            <i :class="activeClass.indexOf(item.name)!=-1?'el-icon-star-on':'el-icon-star-off'"
               @click="getItem(index,item.name)"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'app-side',
    data() {
      return {
        rshow: false,
        mouse: false,
        show: false,
        activeClass: [],
        Income: [],
        selectArr: [{
          id: '1',
          name: '系统管理',
          arrList: [
            {
              preId: '1',
              name: '系统设置',
              url:'/YUser/systemSettings'
            },
            {
              preId: '2',
              name: '系统监测',
              url:'/YUser/systemSettingsMonitoring'
            }
          ]
        },
          {
            id: '2',
            name: '设备发现',
            arrList: [
              {
              preId: '3',
              name: '设备手动发现',
              url:'/YUser/DeviceManualDetection'
              },
              {
                preId: '4',
                name: '设备信息设置',
                url:''
              }
            ]
          },
          {
            id: '3',
            name: '资产管理',
            arrList: [{
              preId: '7',
              name: '资产统计',
              url:''
            },
              {
                preId: '8',
                name: '资产设置',
                url:''
              },
              {
                preId: '9',
                name: '保修管理',
                url:''
              },
              {
                preId: '10',
                name: '变更记录',
                url:''
              }
            ]
          },
          {
            id: '4',
            name: '监测管理',
            arrList: [{
              preId: '11',
              name: '资源视图',
              url:''
            },
              {
                preId: '12',
                name: '业务视图',
                url:''
              },
              {
                preId: '13',
                name: '机房视图',
                url:''
              }
            ]
          },
          {
            id: '5',
            name: '告警管理',
            arrList: [{
              preId: '14',
              name: '当前告警',
              url:''
            },
              {
                preId: '15',
                name: '历史告警',
                url:''
              },
              {
                preId: '16',
                name: '告警设置',
                url:''
              },
              {
                preId: '17',
                name: '外部告警集成',
                url:''
              },
              {
                preId: '18',
                name: '状态搜索',
                url:''
              }
            ]
          }
        ]

      }
    },
    mounted() {
      this.$dragging.$on('dragged', ({
                                       value
                                     }) => {
        console.log(value.item)
        console.log(value.list)
        console.log(value.otherData)
      })
      this.$dragging.$on('dragend', () => {

      })
    },
    methods: {
      // 路由跳转隐藏弹出层
      hiddenAlert(){
        this.show = false;
        this.rshow = false;
      },
      getItem(index, val) {
        //console.log(val)
        // 把当前点击元素的index，赋值给activeClass
        if (this.activeClass.indexOf(val) == -1) {
          this.activeClass.unshift(val);
        } else {
          this.activeClass.splice(this.activeClass.indexOf(val), 1);
        }

        // var _t = this;
        // var params = new URLSearchParams();
        // params.append('menuId','menu_01_01');
        // _t.$api.post('system/userShortcutMenu/insertSystemUserShortcutMenuFromMenuAndLanguage',params,function (res) {
        //   console.log(res.data)
        // });

      },
      delItem(y, val) {
        this.activeClass.splice(this.activeClass.indexOf(val), 1);
      },
      MouseOverFul() {
        this.show = true;
        this.rshow = true;
      },
      MouseOverTwo() {
        if (this.rshow == true) {
          this.mouse = true;
          this.show = true;
          this.rshow = true;
        } else if (this.rshow == false) {
          this.mouse = true;
          this.show = true;
          this.rshow = false;
        }

      },
      MouseOutTwo() {
        if (this.rshow == true) {
          this.mouse = false;
          this.show = true;
          this.rshow = true;
        } else if (this.rshow == false) {
          this.mouse = false;
          this.show = false;
          this.rshow = false;
        }

      },
      ClickClose() {
        this.show = false;
        this.rshow = false;
      },
    },
  }
</script>

<style scoped>
  .box {
    overflow: hidden;
    z-index: 1001;
    height: 100%;
    position: fixed;
    top: 55px;
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
    width: 120px;
    line-height: 35px;
    margin-right: 10px;
    overflow: hidden;
  }

  .fnlist ul li:first-child {
    margin-left: 0;
  }

  .fnlist ul li:hover {
    width: 120px;
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
