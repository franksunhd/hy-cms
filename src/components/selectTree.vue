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

  <el-popover
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
  </el-popover>
</template>

<script>
  export default {
    name: 'Pagination',
    data() {
      return {
        isShowPopover: false,
        defaultProps: {
          label: 'nodeName',
          children: 'children'
        }
      };
    },
    props: {
      options: {
        type: Array
      },
      modelValue: {
        type: String
      }
    },
    methods: {
      // 点击节点
      clickNode(val) {
        this.modelValue = val.nodeName;
        this.$emit('selectedId', val.nodeId);
        this.isShowPopover = false;
      }
    },
    created() {

    }
  }
</script>

<style>

</style>
