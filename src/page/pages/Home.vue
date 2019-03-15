<template>
  <Box>
    <div style="padding: 20px 0 0 20px;">
      <el-button @click="cms">前往系统设置</el-button>
    </div>
  </Box>

</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "home",
    components:{Box},
    data(){
      return {

      }
    },
    methods:{
      cms(){
        this.$router.push({name:'systemSettings'});
      }
    }
  }
</script>

<style scoped>

</style>
