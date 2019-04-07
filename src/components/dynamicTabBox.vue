<template>
  <el-scrollbar>
    <router-link
      v-for="(tag,index) in visitedViews"
      :to="tag.path"
      :key="index">
      {{tag.title}}
      <span class="el-icon-close" @click.prevent.stop="delSelectTag(tag)"/>
    </router-link>
  </el-scrollbar>
</template>

<script>
  export default {
    name: "dynamic-tab-box",
    data() {
      return {
      }
    },
    // watch:{
    //   $route(){
    //     console.log(1)
    //     this.visitedViews = this.$store.state.tagsview.visitedviews;
    //   }
    // },
    computed: {
      visitedViews(){//store中取值
        return this.$store.state.tagsview.visitedviews
      }
    },
    methods: {
      isActive(route) {
        return route.path === this.$route.path
      },
      delSelectTag(route){
        this.$store.dispatch('delVisitedViews',route).then((views)=>{
          if(this.isActive(route)){//只有在关闭当前打开的标签页才会有影响
            let lastView = views.visitedviews.slice(-1)[0];//选取路由数组中的最后一位
            if(lastView){
              this.$router.push(lastView);
            }else{
              this.$router.push('/');
            }
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
