<template>
	<div class="box">
		<div class="box-right" v-show="show">
			<div class="box-close" @click="ClickClose"><i class="el-icon-close"></i></div>
			<div class="fnlist"  v-for="(value,index) in selectArr" :key="index" >
				<span class="fnspan">{{value.name}}</span>
				<ul>
					<li v-for="(item,index) in value.arrList" :item="item" :key="index">{{ item.name }}
					<span><i :class="activeClass.indexOf(item.name)!=-1?'el-icon-star-on':'el-icon-star-off'" @click="getItem(index,item.name)"></i></span>
					</li>
				</ul>
			</div>
			</div>
		<div class="box-left">
		     <ul class="box-left-ful">
		     	<li ><i class="el-icon-menu" @mouseover="MouseOverFul"></i></li>
		     	<li v-show="show">功能清单列表 </li>
		     	<li v-show="show">&gt;</li>
		     </ul>
		     <ul class="box-left-two" v-for='x,y in activeClass' @mouseover="MouseOverTwo" @mouseout="MouseOutTwo">
		     	<li><i class="el-icon-picture"></i></li>
		        <li v-show="show">{{x}}</li>
		        <li v-show="mouse"><i class="el-icon-close" @click="delItem(y,x)"></i></li>
		        <li v-show="mouse"><i class="el-icon-rank"></i></li>
		     </ul>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'app-side',
		data() {
			return {
				mouse:false,
				show:false,
				activeClass:[],
				Income:[],
				selectArr: [{
					    id:'1',
						name: '系统管理',
						arrList: [{
							preId:'1',
								name: '系统设置'
							},
							{preId:'2',
								name: '系统监测'
							}
						]
					},
					{
						id:'2',
						name: '设备发现',
						arrList: [{
						preId:'3',
								name: '设备类型管理'
							},
							{
							preId:'4',
								name: '设备信息设置'
							},
							{
							preId:'5',
								name: '设备发现设置'
							},
							{
							preId:'6',
								name: '设备自动发现'
							}
						]
					},
					{
						id:'3',
						name: '资产管理',
						arrList: [{
						preId:'7',
								name: '资产统计'
							},
							{
							preId:'8',
								name: '资产设置'
							},
							{
							preId:'9',
								name: '保修管理'
							},
							{
							preId:'10',
								name: '变更记录'
							}
						]
					},
					{
						id:'4',
						name: '监测管理',
						arrList: [{
						preId:'11',
								name: '资源视图'
							},
							{
							preId:'12',
								name: '业务视图'
							},
							{
							preId:'13',
								name: '机房视图'
							}
						]
					},
					{
						id:'5',
						name: '告警管理',
						arrList: [{
							preId:'14',
								name: '当前告警'
							},
							{
							preId:'15',
								name: '历史告警'
							},
							{
							preId:'16',
								name: '告警设置'
							},
							{
							preId:'17',
								name: '外部告警集成'
							},
							{
							preId:'18',
								name: '状态搜索'
							}
						]
					}
				]

			}
		},
		methods: {
			 getItem(index,val) {
			 	console.log(val)
               // 把当前点击元素的index，赋值给activeClass
             if(this.activeClass.indexOf(val)==-1){
                   this.activeClass.unshift(val);
             }else{
                   this.activeClass.splice(this.activeClass.indexOf(val),1);
             }
    },
    delItem(y,val){
    	this.activeClass.splice(this.activeClass.indexOf(val),1);
    },
    MouseOverFul(){
    	this.show=true;
    },
    MouseOverTwo(){
    	this.mouse=true;
    },
    MouseOutTwo(){
    	this.mouse=false;
    },
    ClickClose(){
    	this.show=false;
    },
		},
	}
</script>

<style scoped>
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.box{
		width: 800px;
		position: relative;
	}
	.box-close{
		position: absolute;
		top:10px;
		right:10px;

	}
	.box-right{
		overflow: hidden;
		position: absolute;
		padding: 0 10px;
		left:200px;
		top:0;
    background-color: #fff;
    z-index: 1001;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
	}
	.fnlist {
		overflow: hidden;
		padding-top: 20px;
	}

	.fnspan {
		font-size: 18px;
		font-weight: 500;
		line-height: 30px;
	}

	.fnlist ul li {
		display: inline-block;
		width: 120px;
		line-height: 25px;
		padding-left: 15px;
		margin-left: 20px;
		position: relative;
	}
	.fnlist ul li:first-child{
		margin-left: 0;
	}
	.fnlist ul li:nth-child(5){
		margin-left: 0;
	}
.fnlist ul li span{
	position: absolute;
	top:0;
	right:5px;
}
	.fnlist ul li:hover {
		width: 120px;
		height: 25px;
		cursor: pointer;
		background-color: #ccc;
	}

	.el-icon-star-off {
		color: #f22;
		background-color: #ccc;
	}

	.el-icon-star-on {
		color: #f22;
		background-color: #fff;
	}
	.selectActive {
		color: #f22;
		background-color: #fff;
	}
	.box-left{
		position: absolute;
		top: 0;
		left:0;
		background-color: #ccc;
    z-index: 1001;
	}
	.box-left-ful{
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		border-bottom: 1px solid #fff;
		position: relative;
	}
	.box-left-ful li:first-child{
		float: left;
		width: 30px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		padding-left:3px;

	}
	.box-left-ful li:nth-child(2){
		float: left;
		width: 140px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
	}
	.box-left-ful li:nth-child(3){
		float: left;
		width: 28px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
			}
	.box-left-two{
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		position: relative;
	}
	.box-left-two>li:first-child{
		float: left;
		width: 30px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		padding-left:3px;
	}
	.box-left-two>li:nth-child(2){
		float: left;
		width: 120px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
	}
	.box-left-two>li:nth-child(3){
		float: left;
		width: 25px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
			}
	.box-left-two>li:nth-child(4){
		float: left;
		width: 25px;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
			}
</style>
