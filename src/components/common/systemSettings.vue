<template>
  <div class="systemSettings-box">
    <div id="systemSettings_left" v-show="isShow" class="systemSettings-navBar">
      <systemSettingsNavBar/>
      <a href="javascript:;" @click="clickInset" id="systemSettings-navBar-inSet">
        <span class="iconfont" style="font-size: 14px;">&#xe68b;</span>
      </a>
    </div>
    <a href="javascript:;" @click="clickOutset" id="systemSettings-navBar-outSet">
      <span class="iconfont">&#xe69d;</span>
    </a>
		<div id="resize-navBar" v-show="isShow"></div>
    <div id="systemSettings-routerView" class="systemSettings-routerView">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import systemSettingsNavBar from './systemSettingsNavbar';

  export default {
    name: "system-settings",
    components: {systemSettingsNavBar},
    data() {
      return {
        isShow: true,
        levelList: null,
				//右侧内容区默认的left值
				leftOfRightView: 172,
      }
    },
		mounted(){
    	var _t=this;
    	_t.reSizeWin();
		},
    methods: {
      // 收缩
      clickInset() {
        this.isShow = false;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'inline-block';
        document.getElementById('systemSettings-routerView').style.left = '0';
      },
      // 展开
      clickOutset() {
        this.isShow = true;
        document.getElementById('systemSettings-navBar-outSet').style.display = 'none';
        document.getElementById('systemSettings-routerView').style.left = this.leftOfRightView + "px";
      },
//左右拖拽调整左侧的树的大小
			reSizeWin(){
				var _t = this;

				var inSet = document.getElementById("systemSettings-navBar-inSet");
				var left = document.getElementById("systemSettings_left");
				var resize = document.getElementById("resize-navBar");
				var right = document.getElementById("systemSettings-routerView");
				//var box = document.getElementById("box-all");

				/*//设置左侧导航折叠面板打开后面板内容的最大高度
				var collapseItems = document.querySelectorAll(".left_collapseItem_content");
				collapseItems.forEach((item) => {
					// 目前有两个折叠项，每个高度 49，内容区底部有个margin-bottom 25
					item.style.maxHeight = (left.clientHeight - (50*2) -28) + "px";
				});*/

				resize.onmousedown = function(e){
					var startX = e.clientX;
					resize.left = resize.offsetLeft;
					document.onmousemove = function(e){
						var endX = e.clientX;

						var moveLen = resize.left + (endX - startX);
						//var maxT = box.clientWidth - resize.offsetWidth;
						//设置左侧导航最小宽度
						if(moveLen<172) moveLen = 172;
						//设置左侧导航最大宽度
						//if(moveLen>maxT-200) moveLen = maxT-200;
						if(moveLen>370) moveLen = 370;

						//左侧菜单导航宽度56px,小图标自身宽度16
						inSet.style.left = (moveLen + 56 -14) + "px";
						//左侧内容区宽度
						left.style.width = moveLen + "px";
						resize.style.left = moveLen + "px";
						//设置右侧内容区的left值
						_t.leftOfRightView = moveLen + 2;
						right.style.left = _t.leftOfRightView + "px";
					};
					document.onmouseup = function(evt){
						document.onmousemove = null;
						document.onmouseup = null;
						resize.releaseCapture && resize.releaseCapture();
					};
					resize.setCapture && resize.setCapture();
					return false;
				}
			},
    },
  }
</script>

<style>
  .systemSettings-box {
    height: 100%;
  }

  .systemSettings-routerView {
    width: auto;
    position: absolute;
    top: 0;
    left: 174px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .systemSettings-navBar {
    width: 174px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  #systemSettings-navBar-inSet,
  #systemSettings-navBar-outSet {
    height: 40px;
    width: 14px;
    top: 50%;
    text-align: center;
    line-height: 40px;
    position: fixed;
  }

  #systemSettings-navBar-inSet {
    left: 216px;
    border-radius: 15px 0 0 15px;
  }

  #systemSettings-navBar-outSet {
    left: 56px;
    display: none;
    z-index: 1001;
    border-radius: 0 15px 15px 0;
  }
	#resize-navBar {
		width: 2px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 172px;
		border-right: 2px solid #eaedf1;
		cursor: col-resize;
	}
</style>
