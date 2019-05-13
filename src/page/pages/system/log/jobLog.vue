<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.logManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.jobLog')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--  富文本编辑器 quill -->

<!--    <div class="padding20 borderBottom" >-->
<!--      <el-button type="primary" class="width50 marBottom10" @click="saveHtml">保存</el-button>-->
<!--      <quill-editor-->
<!--        v-model="content"-->
<!--        :options="editorOptions"-->
<!--        ref="myQuillEditor"></quill-editor>-->
<!--    </div>-->
    <div class="padding20">
      <!--    富文本编辑器 ueditor -->
      <div class="components-container">
        <el-button class="marBottom10" type="primary" @click="getUEContent()">获取内容</el-button>
        <div class="editor-container">
          <uEditor :defaultMsg="defaultMsg" :config="config" ref="ue"></uEditor>
        </div>
      </div>
    </div>

  </Box>
</template>

<script>
  import Box from '../../../../components/Box';
  import uEditor from '../../../../components/uEditor';

  export default {
    name: "jobLog",
    components: {Box, uEditor},
    data() {
      return {
        defaultMsg: '这里是UE测试',
        config: {
          initialFrameWidth: null, // 初始化宽度
          initialFrameHeight: 100, // 初始化高度
          // 工具栏设置
          toolbars: [
            // 工具栏按钮
            [
              'undo', //撤销
              'redo', //重做
              'bold', //加粗
              'italic', //斜体
              'underline', //下划线
              'removeformat', //清除格式
              'fontfamily', //字体
              'fontsize', //字号
              'paragraph', //段落格式
              'link', //超链接
              'emotion', //表情
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'forecolor', //字体颜色
              'backcolor', //背景色
              'insertorderedlist', //有序列表
              'insertunorderedlist', //无序列表
              'attachment', //附件
            ]
          ]
        },


        // quill
        content:'1234',
        editorOptions:{
          modules:{
            toolbar: [
              ['bold', 'italic','underline','strike'],
              [{'color':[]},{'background':[]}],
              [{'header':[1,2,3,4,5,6,false]}],
              [{'size': ['12px', '14px', '16px' ,'18px', '20px', '22px', '24px']}],
            ]
          },
          theme:'snow'
        }
      }
    },
    computed:{
      editor(){
        return this.$refs.myQuillEditor.quill;
      }
    },
    methods: {
      // ue
      getUEContent() {
        let content = this.$refs.ue.getUEContent();
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        });
        console.log(content)
      },
      saveHtml(){
        console.log(this.content);
      }
    },
    created() {
    }
  }
</script>

<style scoped>
  .info {
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>
