<template>
  <Editor id="tinymce" v-model="tinymceHtml" :init="editorInit"></Editor>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'
  import Editor from '@tinymce/tinymce-vue'
  export default {
    name: "tinymce-vue",
    components:{Editor},
    data(){
      return{
        tinymceHtml:'',
        editorInit: {
          // language_url: '/static/tinymce/zh_CN.js',
          // language: 'zh_CN',
          skin_url: '',
          height: 300
        }
      }
    },
    mounted() {
      tinymce.init({});
    }
  }
</script>

<style scoped>

</style>
