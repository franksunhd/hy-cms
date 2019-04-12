<!-- 树状选择器 -->
<template>
	<!--<el-popover-->
	<!--ref="popover"-->
	<!--placement="bottom-start"-->
	<!--trigger="click"-->
	<!--class="select-tree scrollbar"-->
	<!--@show="onShowPopover"-->
	<!--@hide="onHidePopover">-->
	<!--<el-tree-->
	<!--ref="tree"-->
	<!--highlight-current-->
	<!--:data="data"-->
	<!--:props="props"-->
	<!--:expand-on-click-node="false"-->
	<!--:filter-node-method="filterNode"-->
	<!--:default-expand-all="false"-->
	<!--@node-click="onClickNode">-->
	<!--</el-tree>-->
	<!--<el-input-->
	<!--slot="reference"-->
	<!--ref="input"-->
	<!--v-model="labelModel"-->
	<!--clearable-->
	<!--:style="`width: ${width}px`"-->
	<!--:class="{ 'rotate': showStatus }"-->
	<!--suffix-icon="el-icon-arrow-down"-->
	<!--:readonly="true"-->
	<!--:placeholder="$t('public.select')">-->
	<!--</el-input>-->
	<!--</el-popover>-->

	<!--  <el-popover
    trigger="click"
    placement="bottom-start"
    v-model="isShowPopover"
    ref="popover">
    <el-tree
      :data="options"
      highlight-current
      :expand-on-click-node="false"
      @node-click="clickNode"
      :props="defaultProps"/>
    <el-input
      v-model="modelValue"
      style="width: 200px;"
      suffix-icon="el-icon-arrow-down"
      readonly
      slot="reference"/>
  </el-popover>-->

	<Box>
		<div>
			<div>
				<div>
					<span>待分配</span>
				</div>
				<div>
					<div>
						<el-select v-model="value" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div>
						<input type="text" placeholder="请输入设备名称/ip" v-model="searchVal">
						<ul>
							<li v-for="(item,index) in NewItems" :key="index" :value="item.value" v-text="item.label"></li>
						</ul>
					</div>
				</div>
				<div></div>
			</div>
			<div></div>
		</div>
	</Box>

</template>

<script>
	import Box from './Box';
	export default {
		name: 'selectTree',
		components: {
			Box
		},
		data() {
			return {
				isShowPopover: false,
				defaultProps: {
					label: 'nodeName',
					children: 'children'
				},
				options: [{
					value: '1',
					label: '黄金糕'
				}, {
					value: '2',
					label: '双皮奶'
				}, {
					value: '3',
					label: '蚵仔煎'
				}, {
					value: '4',
					label: '龙须面'
				}, {
					value: '5',
					label: '北京烤鸭'
				}],
				value: '',
				searchVal: "",
			};
		},
		/* props: {
		   options: {
		     type: Array
		   },
		   modelValue: {
		     type: String
		   }
		 },*/
		methods: {
			/* // 点击节点
			 clickNode(val) {
			   this.modelValue = val.nodeName;
			   this.$emit('selectedId', val.nodeId);
			   this.isShowPopover = false;
			 }*/
		},
		computed: {
  NewItems() {
   var _t = this;
   var NewItems = [];
   _t.options.map(function(item) {
    if (item.label.search(_t.searchVal) != -1) {
     NewItems.push(item);
    }
   });
   return NewItems;
  }
 },
		created() {

		}
	}
</script>

<style>

</style>