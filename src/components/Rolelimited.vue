<template>
  <div class="RoleGetWay">
    <div class="RoleGetWayButton">
      <div class="left">
        <div class="font">角色id</div>
        <div class="mc-input" style="width:80%">
          <el-input v-model="RoleId" placeholder="角色id" style="width:100%;float:right"></el-input>
        </div>
      </div>
      <div class="left">
        <div class="font">网关id</div>
        <div class="mc-input" style="width:80%">
          <el-input v-model="GateWayId" placeholder="网关id" style="width:100%;float:right"></el-input>
        </div>
      </div>
      <div class="right">
        <el-button @click="selectRolelimited" type="primary">搜索</el-button>
      </div>
    </div>
    <div class="RoleGetWayTable">
      <el-table
        :data="RoleGetWaydata"
        style="width:100%;text-align:center;overflow: auto"
        height="100%"
        :ref="RoleGetWaydata"
        :row-key="getRowKeys"
        stripe
        border
        reserve-selection="selection"
        slot="empty"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
      >
        <el-table-column type="index" width="40" :index="indexMethod"></el-table-column>
        <el-table-column prop="roleId" label="角色id" min-width="240" width="auto"></el-table-column>
        <el-table-column prop="gatewayId" label="网关id" min-width="240" width="auto"></el-table-column>
        <el-table-column prop="paramType" label="接口方法" min-width="50" width="auto"></el-table-column>
        <el-table-column prop="paramKey" label="key" min-width="130" width="auto"></el-table-column>
        <el-table-column prop="paramValue" label="value" min-width="100" width="auto"></el-table-column>
        <el-table-column prop="paramValueType" label="ValueType" min-width="130" width="auto"></el-table-column>
        <el-table-column prop="opration" label="操作" min-width="90" width="auto">
          <template slot-scope="scope" style="color:blue">
            <el-button @click="editRoleGateWay(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteRowRoleGateWay(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="RoleGetWayPage">
      <el-pagination
        layout=" total,sizes,prev, pager, next,jumper"
        :total="totalRoleGate"
        @size-change="handleSizeChangeRoleGate"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="5"
        @current-change="handleCurrentChangeRoleGate"
        :current-page="currentPage"
        style="position:relative;text-align:center"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisibleRoleGate"
      width="40%"
      title="修改信息"
      :before-close="handleRoleGate"
    >
      <div class="RoleGateDiv" v-if="dialogFormVisibleRoleGate">
        <div class="FormRoleGate">
          <el-form :model="RoleGateform" ref="form">
            <el-form-item label="接口方法" prop="paramType" label-width="100px">
              <el-select v-model="RoleGateform.paramType" placeholder="接口方式" style="width:100%">
                <el-option label="post" value="post"></el-option>
                <el-option label="get" value="get"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="key" prop="paramKey" label-width="100px">
              <el-input v-model="RoleGateform.paramKey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="value" prop="paramValue" label-width="100px">
              <el-input v-model="RoleGateform.paramValue" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="typevalue" prop="paramValueType" label-width="100px">
              <el-input v-model="RoleGateform.paramValueType" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="ButtonRoleGate">
          <el-button
            type="primary"
            @click="makeSureRoleGate"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancelRoleGate" style="color:#909399,position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>>
<script>
export default {
  data() {
    return {
      RoleId: "",
      GateWayId: "",
      RoleGetWaydata: [],
      currentPage: 1,
      pageSize: 5,
      totalRoleGate: 0,
      dialogFormVisibleRoleGate: false,
      RoleGateform: {}
    };
  },
  methods: {
    GetRoleGateWayData() {
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/query",
          {}
        )
        .then(res => {
          if (res.data.msg == "ok") {
            let RoleGateList = res.data.data;
            this.RoleGetWaydata = RoleGateList.slice(
              (this.currentPage - 1) * this.pageSize,
              this.currentPage * this.pageSize
            );
            this.totalRoleGate = RoleGateList.length;
          }
        });
    },
    getRowKeys(row) {
      return row.id;
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    },
    handleSizeChangeRoleGate(val) {
      this.pageSize = val;
      this.GetRoleGateWayData();
    },
    handleCurrentChangeRoleGate(ele) {
      this.currentPage = ele;
      this.GetRoleGateWayData();
    },
    selectRolelimited() {
      if (!this.RoleId) {
        this.RoleId = "";
      }
      if (!this.GateWayId) {
        this.GateWayId = "";
      }
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/query",
          {
            roleId: this.RoleId,
            gatewayId: this.GateWayId
          }
        )
        .then(res => {
          if (res.data.msg == "ok") {
            let RoleGate_List = res.data.data;
            this.RoleGetWaydata = RoleGate_List.slice(
              (this.currentPage - 1) * this.pageSize,
              this.currentPage * this.pageSize
            );
            this.totalRoleGate = RoleGate_List.length;
          }
        });
    },
    deleteRowRoleGateWay(index, row) {
      let ArrId = [];
      ArrId.push(row.id);
      let that = this;
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/delete",
          {
            ids: ArrId
          }
        )
        .then(res => {
          if (res.data.msg == "ok") {
            that.$message({
              message: "删除成功",
              type: "success",
              offset: 240
            });
            that.GetRoleGateWayData();
          }
        });
    },
    editRoleGateWay(index, row) {
      this.dialogFormVisibleRoleGate = true;
      this.RoleGateform = row;
    },
    makeSureRoleGate() {
      this.dialogFormVisibleRoleGate = false;
      delete this.RoleGateform.createTime;
      delete this.RoleGateform.updateTime;
      let that = this;
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/update_one",
          this.RoleGateform
        )
        .then(res => {
          if (res.data.msg == "ok") {
            that.$message({
              message: "修改成功",
              offset: 240,
              type: "success"
            });
            that.GetRoleGateWayData();
          }
        });
    },
    cancelRoleGate() {
      this.dialogFormVisibleRoleGate = false;
      this.GetRoleGateWayData();
    },
    handleRoleGate() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisibleRoleGate = false;
          this.GetRoleGateWayData();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.GetRoleGateWayData();
  }
};
</script>

<style lang="scss" scoped>
.RoleGetWay {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  & /deep/ .el-dialog__header {
    background-color: #0780ed;
    color: white !important;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  & /deep/ .el-dialog__title {
    color: white;
  }
  & /deep/ .el-dialog__footer {
    height: 50px;
  }
  & /deep/ .el-dialog.el-dialog--center {
    margin-top: 0;
  }
  & /deep/ .el-dialog__body {
    background-color: #fff;
  }
  .RoleGateDiv {
    height: 360px;
    width: 100%;
    display: flex;
    flex-direction: column;
    .FormRoleGate {
      flex: 0 85%;
      margin-right: 10px;
    }
    .ButtonRoleGate {
      flex: 1;
    }
  }
  .RoleGetWayButton {
    flex: 0 0 15%;
    display: flex;
    .right {
      flex: 0 0 20%;
      display: flex;
      align-items: center;
      position: relative;
      left: 10px;
    }
    .left {
      flex: 1;
      display: flex;
      color: #909399;
      .font {
        flex: 0 15%;
        float: right;
        display: flex;
        align-items: center;
        position: relative;
        left: 10px;
      }
      .mc-input {
        margin-left: 10px;
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
  }
  .RoleGetWayTable {
    flex: 0 0 77%;
  }
  .RoleGetWayPage {
    flex: 1;
    & /deep/ .el-pager li.active {
      background-color: #409eff !important;
      border-radius: 50%;
      color: #ffffff;
      min-width: 28px;
    }
  }
}
</style>
<style>
.el-dialog {
  border-radius: 5px;
  background: none !important;
}
</style>