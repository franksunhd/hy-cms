<template>
	<!--<div class="bigBox">
        <div class="bigBox_top">
            <el-carousel :interval="4000" type="card" height="50px" width="200px">
                <el-carousel-item v-for="(item,index) in roomList" :key="index">
                    <h3 class="medium">{{item.room_name}}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="bigBox_bottom">
            <div class="bigBox_bottom_left"></div>
            <div class="bigBox_bottom_right"></div>
        </div>
    </div>-->
	<div class="bigBox">
		<div class="bigBox_top">
			<div class="bigBox_top_left"></div>
			<div class="bigBox_top_bigWidth">
				<ul class="bigBox_top_ul" id="bigBox">
					<li v-for="(item,index) in roomlist" :key="index">{{item.room_name}}</li>
				</ul>
			</div>
			<div class="bigBox_top_right"></div>
			<div class="bigBox_top_left_lt" >
				<img @click="ltClick" src="/static/img/top-nab-previous.png" alt="">
			</div>
			<div class="bigBox_top_right_gt" >
				<img @click="gtClick" src="/static/img/top-nab-next.png" alt="">
			</div>
		</div>
		<div class="bigBox_bottom">
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="bigBox_bottom_left">
						<div class="bigBox_bottom_left_top"></div>
						<div class="bigBox_bottom_bigWidth">
							<ul id="maxRow_ul">
								<li v-for="(item,index) in currentRoomMapRow" :key="index">{{item}}</li>
							</ul>
						</div>
						<div class="bigBox_bottom_left_bottom"></div>
						<div class="bigBox_bottom_left_TopImg"><img src="" alt=""></div>
						<div class="bigBox_bottom_left_BottomImg"><img src="" alt=""></div>
					</div>
				</el-col>
				<el-col :span="20">
					<div class="bigBox_bottom_right"></div>
				</el-col>
			</el-row>


		</div>
	</div>

</template>
<script>
	export default {
		name: 'selectTree',
		data() {
			return {
				//机房数据集合
				roomlist:[],
				//机房ID
				roomId:'',
				//最大行
				maxRow:'',
				num:0,
				currentRoomMap:{},
				currentRoomMapRow:0,
			}
		},
		created(){
			var _t=this;
			_t.getRoom();
		},
		mounted(){
			var _t=this;
		},
		methods:{
			getRoom(){
				var _t=this;
				_t.$api.get('monitor/giantScreen/serverRoom/all',{},function(res){
					switch (res.status){
						case 200:
							var roomList = res.data.list === null ? [] : res.data.list;
							_t.roomlist = roomList;
							var ul = document.querySelector('.bigBox_top_ul');
							ul.style.width=150*(_t.roomlist.length)+'px';
							// 默认选中第一个节点
							if (_t.roomlist.length !== 0 ) {
								// 记住当前的 当前的机房map
								_t.currentRoomMap = _t.roomlist[0];
								// 根据map值 是不是有 渲染行数
								_t.$nextTick(function () {
									document.querySelector('#bigBox li:nth-child('+ 3 +')').className = 'is-active';
								});





								// 渲染行
								if (_t.currentRoomMap.max_row && _t.currentRoomMap.max_row !== 0) {
									_t.currentRoomMapRow = _t.currentRoomMap.max_row;
									//默认给第一行选中状态
									_t.$nextTick(function () {
										console.log(document.querySelector('#maxRow_ul li:nth-child('+ 1 +')'))
										document.querySelector('#maxRow_ul li:nth-child('+ 1 +')').className = 'is-active';
									});
									// 调取机柜数据
									// room :  _t.currentRoomMapRow.room_id  row : 1;

								} else {
									_t.currentRoomMapRow = 0
								}
							} else {
								// 没有机房
							}
							break;
						default:
							break;
					}
				})
			},
			//点击左箭头
			ltClick(){
				var _t = this;
				_t.num++;
				if(_t.num > _t.roomList.length){
					//重新拿数据
					_t.getRoom();
					_t.num=0;
				}else{
					//
				}
				var obj = document.querySelector('.bigBox_top ul');
				obj.style.transform = 'translateX('+(-150)*(_t.num)+'px)';
				_t.$nextTick(function () {
					document.querySelector('#bigBox li:nth-child('+3+')').className = 'is-active';
					console.log(document.querySelector('#bigBox li:nth-child'+(_t.num)));
				});

			},
			//点击右箭头
			gtClick(){
				var _t = this;
				_t.num--;
				if(_t.num<0){
					_t.num=_t.roomlist.length-1;
				}
				var obj = document.querySelector('.bigBox_top ul');
				obj.style.transform = 'translateX('+(-150)*(_t.num)+'px)';

			}
		}
	}
</script>

<style scoped>
	.isactive{
		font-size: 18px;
		color: #ff9900;
	}
	.bigBox{
		overflow: hidden;
		height: 100%;
		background: url("/static/img/bg.jpg") ;
	}
	.bigBox_top{
		width: 1000px;
		margin: 0 auto;
		/*background-color: #f22;*/
		position: relative;
		overflow: hidden;
	}
	.bigBox_top_bigWidth{
		width: 900px;
		float: left;
		overflow: hidden;
		border-bottom: #0000cc solid 2px;
	}
	.bigBox_top ul{
		overflow: hidden;
	}
	.bigBox_top ul li{
		float: left;
		width: 150px;
		height: 44px;
		font-size: 14px;
		line-height: 44px;
		text-align: center;
		color: #a7f3ff;
		cursor: pointer;
	}

	.bigBox_top ul {
		/*transform: translateX(-200px);*/
	}
	.bigBox_top_left{
		float: left;
		width: 50px;
		height: 44px;
		background: url("/static/img/top-line-left.png") no-repeat;
	}
	.bigBox_top_right{
		float: right;
		width: 50px;
		height: 44px;
		background:url("/static/img/top-line-right.png") no-repeat;
	}
	.bigBox_top_left_lt{
		position: absolute;
		top:12px;
		left:50px;
		cursor: pointer;
	}
	.bigBox_top_right_gt{
		position: absolute;
		top:12px;
		right:50px;
		cursor: pointer;
	}
	.bigBox_bottom{
		width: 100%;
		height: 100%;
		background-color: #ff9900;
	}
	.bigBox_bottom_left{
		width: 100%;
		height: 100%;
		background-color: #f22;

	}
	.bigBox_bottom_bigWidth ul{

	}
	.bigBox_bottom_bigWidth ul li {
		width: 100px;
		height: 50px;
		border:1px solid #2D64B3;
	}
	.bigBox_bottom_right{
		width: 100%;
		height: 100%;
		background-color: #4c97f0;
	}
</style>
<style>
	#maxRow_ul li.is-active {
		font-size: 22px;
		color: orange;
	}

	#bigBox li.is-active {
		color: orangered;
		font-size: 30px;
	}
</style>
