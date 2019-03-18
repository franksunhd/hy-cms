<template>
  <div class="paging">
    <el-pagination
      class="first-pager"
      @current-change="handleCurrentChange"
      :current-page="currentPageNum"
      :page-size="pageSize"
      layout="slot,prev"
      :total="total"
      :prev-text="$t('public.prevText')"
      :firstPage='firstPage'
      :lastPage='lastPage'>
      <el-button type="text" @click="toFirstPage">{{$t('public.homePage')}}</el-button>
    </el-pagination>
    <el-pagination
      class="last-pager"
      @current-change="handleCurrentChange"
      :current-page="currentPageNum"
      :page-size="pageSize"
      layout="pager,next,slot"
      :total="total"
      :next-text="$t('public.nextText')"
      :firstPage='firstPage'
      :lastPage='lastPage'>
      <el-button type="text" @click="toLastPage">{{$t('public.lastPage')}}</el-button>
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "pages",
    data(){
      return {
        currentPageNum:this.currentPage
      }
    },
    props: {
      // 当前页
      currentPage: {
        type: Number,
        default: 1
      },
      // 每页数据条数
      pageSize: {
        type: Number,
        default: 10
      },
      // 总数据条数
      total: {
        type: Number,
        default: 0
      },
      // 首页页码
      firstPage: {
        type: Number
      },
      // 末页页码
      lastPage: {
        type: Number
      }
    },
    methods:{
      // 改变当前页码
      handleCurrentChange(val) {
        this.currentPageNum = val;
        this.$emit("handleCurrentChangeSub", val);
      },
      // 去首页
      toFirstPage(val) {
        this.currentPageNum = this.firstPage;
        this.handleCurrentChange(this.firstPage);
      },
      // 去末页
      toLastPage(val) {
        this.currentPageNum = this.lastPage;
        this.handleCurrentChange(this.lastPage);
      }
    }
  }
</script>

<style scoped>
  .paging {
    text-align: center;
    margin-top: 30px;
  }

  .first-pager,
  .last-pager {
    display: inline-block;
  }
</style>
