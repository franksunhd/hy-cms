<template>
  <Box>
    <!--面包屑区域-->
    <div class="Breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>{{$t('breadcrumb.systemSetting')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.deviceAcquisitionSettings')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('breadcrumb.acquisitionNodeManagement')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <el-form inline>
      <el-form-item :label="$t('acquisitionNodeManagement.nodeName') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('acquisitionNodeManagement.nodeIp') + '：'">
        <el-input />
      </el-form-item>
      <el-form-item :label="$t('acquisitionNodeManagement.nodePort') + '：'">
        <el-input />
      </el-form-item>
      <br>
      <el-form-item :label="$t('acquisitionNodeManagement.groupName') + '：'">
        <el-select>
          <el-option></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acquisitionNodeManagement.nodeType') + '：'">
        <el-select>
          <el-option></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('acquisitionNodeManagement.status') + '：'">
        <el-select>
          <el-option></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">{{$t('public.query')}}</el-button>
      </el-form-item>
    </el-form>
    <!--全局操作-->
    <div class="marBottom20">
      <el-button @click="dialogVisible = true">{{$t('public.add')}}</el-button>
      <el-button @click="enableData">{{$t('public.enable')}}</el-button>
      <el-button @click="disableData">{{$t('public.disable')}}</el-button>
      <el-button @click="deleteData">{{$t('public.delete')}}</el-button>

      <el-button @click="runMonitoring">{{$t('acquisitionNodeManagement.runMonitoring')}}</el-button>
      <el-button @click="stopMonitoring">{{$t('acquisitionNodeManagement.stopMonitoring')}}</el-button>
      <el-button @click="assignedTasks">{{$t('acquisitionNodeManagement.equipmentMonitoring')}}</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="selection" fixed />
      <el-table-column :label="$t('public.index')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.nodeName')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.ip')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.port')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.nodeGroup')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.nodeType')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.equipmentNumber')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.description')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.status')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.createName')" header-align="center" align="center" />
      <el-table-column :label="$t('acquisitionNodeManagement.createTime')" header-align="center" align="center" />
      <el-table-column :label="$t('public.operation')" width="120" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogVisible = true">{{$t('public.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pages
      :total='options.total'
      :currentPage='options.currentPage'
      :pageSize='options.pageSize'
      :firstPage='options.firstPage'
      :lastPage='options.lastPage'
      @handleCurrentChangeSub="handleCurrentChange" />
    <!--新增编辑-->
    <el-dialog
      :title="$t('acquisitionNodeManagement.createUpdateNode')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeName') + '：'">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeIp') + '：'">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeGroup') + '：'">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodePort') + '：'">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeType') + '：'">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.statusAlert') + '：'">
              <el-radio-group v-model="status">
                <el-radio :label="0">{{$t('public.enable')}}</el-radio>
                <el-radio :label="1">{{$t('public.disable')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('acquisitionNodeManagement.ruleDes') + '：'">
              <el-input type="textarea" :autosize="{minRows:3}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <p>{{$t('acquisitionNodeManagement.monitoringTask') + '：'}}</p>
          <p>穿梭框插件</p>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--分配设备监测任务-->
    <el-dialog
      :title="$t('acquisitionNodeManagement.createUpdateNode')"
      :visible.sync="dialogVisibleAlert"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeGroup') + '：'">
              温州机房
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeName') + '：'">
              A01
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodeIp') + '：'">
              192.168.0.1
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('acquisitionNodeManagement.nodePort') + '：'">
              8080
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <p>{{$t('acquisitionNodeManagement.monitoringTask') + '：'}}</p>
          <p>穿梭框插件</p>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisibleAlert = false">{{$t('public.confirm')}}</el-button>
        <el-button @click="dialogVisibleAlert = false">{{$t('public.cancel')}}</el-button>
      </span>
    </el-dialog>
  </Box>
</template>

<script>
  import Box from '../../components/Box';
  export default {
    name: "acquisitionNodeManagement",
    components:{Box},
    data() {
      return {
        tableData:[
          {},{}
        ],
        options:{
          total:1000, // 总条数
          currentPage:1, // 当前页码
          pageSize:10, // 每页显示条数
          firstPage:1, // 首页
          lastPage:100 // 末页
        },
        dialogVisible:false,
        dialogVisibleAlert:false
      }
    },
    methods: {
      // 改变当前页码
      handleCurrentChange(val){
        console.log(val)
      },
      // 启用
      enableData() {
        this.$confirm('请问是否确认启用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 禁用
      disableData(){
        this.$confirm('请问是否确认禁用当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 删除
      deleteData(){
        this.$confirm('请问是否确认删除当前的记录?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 执行监测
      runMonitoring(){
        this.$confirm('请问是否确认立即开始执行监测?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning',
        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 停止监测
      stopMonitoring(){
        this.$confirm('请问是否确认要停止正在执行的监测?',this.$t('public.confirmTip'),{
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.close'),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning',

        }).then(()=>{

        }).catch(()=>{
          return;
        });
      },
      // 分配设备监测任务
      assignedTasks(){
        this.dialogVisibleAlert = true;
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
