<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.systemManagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.interfaceTest')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="padding20">
      <el-form label-width="200px">
        <el-form-item :label="$t('interfaceTest.interfaceMode') + '：'">
          <el-radio-group v-model="interfaceWay" @change="changeInterfaceWay">
            <el-radio label="post">POST</el-radio>
            <el-radio label="get">GET</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('interfaceTest.apiAddress') + '：'">
          <el-input class="width800" />
        </el-form-item>
        <el-form-item :label="$t('interfaceTest.accessParameters') + '：'">
          <el-input class="width800" type="textarea" :autosize="{ minRows: 5 }" />
        </el-form-item>
        <el-form-item>
          <el-button class="alertBtn" type="primary" @click="request">{{$t('public.request')}}</el-button>
          <el-button class="alertBtn">{{$t('public.reset')}}</el-button>
        </el-form-item>
      </el-form>
      <!--接口响应区域-->
      <div id="writePlace" class="width800" v-loading="false"></div>
    </div>
  </Box>
</template>

<script>
  import Box from '../../../../components/common/Box';
  export default {
    name: "interface-test",
    components:{Box},
    data(){
      return {
        interfaceWay:'',
        originalJson:[]
      }
    },
    methods:{
      // 改变单选按钮的值
      changeInterfaceWay(){},
      // 请求按钮
      request(){
        var resultJson = this.formatJson(this.originalJson);
        document.getElementById("writePlace").innerHTML = '<pre>' + resultJson + '<pre/>';
      },
      formatJson(json, options) {
        var reg = null,
          formatted = '',
          pad = 0,
          PADDING = '    ';
        options = options || {};
        options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
        options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
        if(typeof json !== 'string') {
          json = JSON.stringify(json);
        } else {
          json = JSON.parse(json);
          json = JSON.stringify(json);
        }
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');
        if(!options.newlineAfterColonIfBeforeBraceOrBracket) {
          reg = /\:\r\n\{/g;
          json = json.replace(reg, ':{');
          reg = /\:\r\n\[/g;
          json = json.replace(reg, ':[');
        }
        if(options.spaceAfterColon) {
          reg = /\:/g;
          json = json.replace(reg, ':');
        }
        (json.split('\r\n')).forEach(function(node, index) {
          var i = 0,
            indent = 0,
            padding = '';

          if(node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
          } else if(node.match(/\}/) || node.match(/\]/)) {
            if(pad !== 0) {
              pad -= 1;
            }
          } else {
            indent = 0;
          }

          for(i = 0; i < pad; i++) {
            padding += PADDING;
          }

          formatted += padding + node + '\r\n';
          pad += indent;
        });
        return formatted;
      },
    },
    created(){

    }
  }
</script>

<style scoped>
  #writePlace {
    min-height: 200px;
    margin-left: 200px;
    margin-bottom: 50px;
    padding-top: 20px;
    padding-left: 10px;
  }
</style>
