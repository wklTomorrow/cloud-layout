<template>
  <div class="user-div">
    <div class="cx">
      <div class="left-cx">
        <div class="font">服务名称</div>
        <div class="mc-input" style="width:80%">
          <el-input v-model="MC" placeholder="服务名称" style="width:100%;float:right"></el-input>
        </div>
      </div>
      <div class="right-cx">
        <el-button @click="selectUsing" type="primary">搜索</el-button>
        <el-button @click="addnew" type="primary" style="float:right">新增</el-button>
      </div>
    </div>
    <div class="data">
      <el-table
        :data="filterdata"
        style="width:100%;text-align:center;overflow: auto"
        height="100%"
        :ref="filterdata"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        stripe
        border
        reserve-selection="selection"
        slot="empty"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
      >
        <el-table-column type="selection" :reserve-selection="true" width="50"></el-table-column>
        <el-table-column prop="apiName" label="服务名称" min-width="130" width="auto"></el-table-column>
        <!-- <el-table-column prop="parentTrId" label="父权限" width="100"></el-table-column> -->
        <el-table-column prop="path" label="服务地址" min-width="170" width="auto"></el-table-column>
        <el-table-column prop="retryable" label="是否重试" min-width="140" width="auto"></el-table-column>
        <el-table-column prop="serviceId" label="映射服务ID" min-width="170" width="auto"></el-table-column>
        <el-table-column prop="url" label="服务别称" min-width="200" width="auto"></el-table-column>
        <el-table-column prop="opration" label="操作" min-width="160" width="auto">
          <template slot-scope="scope" style="color:blue">
            <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="check(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="foot">
      <el-pagination
        layout=" total,sizes,prev, pager, next,jumper"
        :total="total"
        @size-change="handleSizeChange"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        style="position:relative;text-align:center"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="40%"
      title="信息"
      :before-close="handleGateWay"
    >
      <div class="urlDiv">
        <div class="FormDiv">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="服务名称" :label-width="formLabelWidth" prop="apiName" require>
              <el-input v-model="form.apiName" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <!-- <el-form-item label="父权限" :label-width="formLabelWidth" prop="parentTrId" require>
              <el-input v-model="form.parentTrId" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item> -->
            <el-form-item label="服务地址" :label-width="formLabelWidth" prop="path" require>
              <el-input v-model="form.path" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="是否重试" :label-width="formLabelWidth" prop="retryable" require>
              <el-select v-model="form.retryable" placeholder="是否重试" style="width:100%">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务别称" :label-width="formLabelWidth" prop="url" require>
              <el-input v-model="form.url" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="ButtonDiv">
          <el-button
            v-if="resetUsingForm"
            type="primary"
            @click="resetUsing('resetform')"
            style="position:relative;float:right;margin-left:10px;margin-right:10px"
          >重 置</el-button>
          <el-button
            type="primary"
            @click="makeSure('resetform')"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancel" style="color:#909399,position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { constants, watch } from "fs";
import { stringify } from "querystring";
import { error } from "util";
import { setTimeout } from "timers";
import { type } from "os";
import { connect } from "net";
export default {
  data() {
    return {
      tabledata: [],
      filterdata: [],
      multipleSelection: [],
      filterInfo: [],
      MC: "",
      yh: "",
      dialogFormVisible: false,
      olddata: [],
      selection: false,
      form: {
        apiName: "",
        parentTrId: "",
        path: "",
        retryable: "",
        url: "",
        flag: 1,
        stripPrefix: 0,
        enabled: 0,
        serviceId: "",
        token: "1",
      },
      disable: false,
      formLabelWidth: "100px",
      total: 0,
      currentPage: 1,
      pageSize: 5,
      pageSizeTotle: 100,
      show: false,
      ids: [],
      rules: {
        retryable: [{ required: true, trigger: "blur", message: "必填" }],
        path: [{ required: true, trigger: "blur", message: "必填" }],
        apiName: [{ required: true, trigger: "blur", message: "必填" }],
        parentTrId: [{ required: true, trigger: "blur", message: "必填" }],
        url: [{ required: true, trigger: "blur", message: "必填" }]
      },
      resetUsingForm: false
    };
  },
  methods: {
    sortByDate() {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getUserList();
    },
    getUserList() {
      this.axios
        .post("http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/list", {
          page: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.data.success) {
            this.total = res.data.obj.total;
            this.tabledata = res.data.obj.EnnGateways;
          }
          this.filterdata = this.tabledata.slice(0);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKeys(row) {
      return row.id;
    },
    handleCurrentChange(p) {
      this.currentPage = p;
      this.getUserList();
    },
    handleClick() {},
    selectUsing() {
      let that = this;
      this.axios
        .post("http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/list", {
          page: this.currentPage,
          pageSize: this.pageSizeTotle,
          apiName: this.MC
        })
        .then(res => {
          if (res.data.success) {
            this.total = res.data.obj.total;
            this.tabledata = res.data.obj.EnnGateways;
            this.filterdata = this.tabledata.slice(
              (this.currentPage - 1) * this.pageSize,
              this.currentPage * this.pageSize
            );
          }
        });
      // 前端在当前页面过滤
      // let tempdata = this.tabledata.slice(0);
      // let _this = this;
      // this.filterdata = tempdata.filter(function(item) {
      //   let b1, b2;
      //   if ("string" == typeof item.apiName) {
      //     b1 = item.apiName.indexOf(_this.MC) > -1;
      //   }
      //   if ("string" == typeof item.parentTrId) {
      //     b2 = item.parentTrId.indexOf(_this.yh) > -1;
      //   }
      //   return b1 && b2;
      // });
    },
    deleteRow(index, row) {
      let _this = this;
      this.$confirm("是否删除本条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.axios
          .delete(
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/info/" +
              row.id
          )
          .then(res => {
            if (res.data.success) {
              _this.$message({
                message: "删除成功",
                offset: 240,
                type: "success"
              });
              _this.getUserList();
            }
          });
      });
    },
    check(index, row) {
      this.show = true;
      this.dialogFormVisible = true;
      this.form.apiName = row.apiName;
      this.form.parentTrId = row.parentTrId;
      this.form.path = row.path;
      this.form.retryable = row.retryable;
      this.form.url = row.url;
      this.required = false;
      this.form.id = row.id;
      this.disable = true;
      this.resetUsingForm = false;
      this.$refs.form.clearValidate();
    },
    edit(index, row) {
      this.dialogFormVisible = true;
      this.form.apiName = row.apiName;
      this.form.parentTrId = row.parentTrId;
      this.form.path = row.path;
      this.form.retryable = row.retryable;
      this.form.url = row.url;
      this.form.id = row.id;
      this.disable = false;
      this.show = false;
      this.$refs.form.clearValidate();
      this.resetUsingForm = false;
    },
    cancel() {
      this.show = false;
      this.dialogFormVisible = false;
      this.form.apiName = "";
      this.form.parentTrId = "";
      this.form.path = "";
      this.form.retryable = "";
      this.form.url = "";
      this.form.id = "";
      this.resetUsingForm = false;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    handleGateWay() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.show = false;
          this.dialogFormVisible = false;
          this.form.apiName = "";
          this.form.parentTrId = "";
          this.form.path = "";
          this.form.retryable = "";
          this.form.url = "";
          this.form.id = "";
          this.resetUsingForm = false;
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addnew() {
      this.dialogFormVisible = true;
      // this.$refs.form.clearValidate();
      this.show = false;
      this.disable = false;
      this.resetUsingForm = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    makeSure() {
      this.$refs.form.clearValidate();
      let _this = this;
      if (this.form.id) {
        this.dialogFormVisible = false;
        this.resetUsingForm = false;
        if (!this.show) {
          this.$confirm("是否修改", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.axios
              .put(
                "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/info",
                this.form,
                { headers: { "Content-Type": "application/json" } }
              )
              .then(res => {
                if (res.data.success) {
                  _this.getUserList();
                  _this.form.apiName = "";
                  _this.form.parentTrId = "";
                  _this.form.path = "";
                  _this.form.retryable = "";
                  _this.form.url = "";
                  _this.form.id = "";
                  _this.$message({
                    message: "修改成功",
                    offset: 240,
                    type: "success"
                  });
                }
              });
          });
        } else {
          this.show = false;
          this.form.apiName = "";
          this.form.parentTrId = "";
          this.form.path = "";
          this.form.retryable = "";
          this.form.url = "";
          this.form.id = "";
        }
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.axios
              .post(
                "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/info",
                _this.form,
                { headers: { "Content-Type": "application/json" } }
              )
              .then(res => {
                console.log(res)
                _this.dialogFormVisible = false;
                _this.getUserList();
                _this.form.apiName = "";
                _this.form.parentTrId = "";
                _this.form.path = "";
                _this.form.retryable = "";
                _this.form.url = "";
                _this.form.id = "";
                this.resetUsingForm = false;
                if (res.data.success) {
                  _this.$message({
                    message: "添加成功",
                    offset: 240,
                    type: "success"
                  });
                } else {
                  _this.$message({
                    message: "添加不成功",
                    offset: 240,
                    type: "error"
                  });
                }
              });
          } else {
            return false;
          }
        });
      }
    }
    // }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.user-div {
  position: relative;
  height: 100%;
  width: 90%;
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  .urlDiv {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .FormDiv {
      flex: 0 85;
      margin-right: 10px;
    }
    .ButtonDiv {
      flex: 1;
    }
  }
  & /deep/ .el-dialog {
    background-color: none;
  }
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
  .cx {
    flex: 0 0 15%;
    display: flex;
    align-items: center;
    color: #909399;
    .left-cx {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .right-cx {
      flex: 0 0 30%;
      display: flex;
      align-items: center;
    }
  }
  .data {
    flex: 77%;
    margin: 5px;
    & /deep/ .el-button--text {
      color: #409eff !important;
    }
    &
      /deep/
      .el-table.el-table--fit.el-table--striped.el-table--scrollable-x.el-table--enable-row-transition {
      height: 100% !important;
      width: 100%;
    }
    // & /deep/ .el-checkbox__inner::after {
    //   display: none;
    // }
  }
  .foot {
    flex: 8%;
    & /deep/ .el-pager li.active {
      background-color: #409eff !important;
      border-radius: 50%;
      color: #ffffff;
      min-width: 28px;
    }
  }
  .el-button {
    float: left;
  }
}
</style>


