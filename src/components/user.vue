<template>
  <div class="user-div">
    <div class="cx">
      <div class="left-cx">
        <div class="font">登录名称</div>
        <div class="mc-input">
          <el-input v-model="MC" placeholder="登录名称"></el-input>
        </div>
      </div>
      <div class="left-cx">
        <div class="font">用户名称</div>
        <div class="yh-input">
          <el-input v-model="yh" placeholder="用户名称"></el-input>
        </div>
      </div>
      <div class="right-cx">
        <el-button @click="select" type="primary">搜索</el-button>
        <el-button @click="addnew" type="primary" style="float:right">新增</el-button>
      </div>
    </div>
    <div class="data">
      <el-table
        :data="filterdata"
        style="text-align:center;overflow: auto;width:100%"
        :ref="filterdata"
        @selection-change="handleSelectionChange"
        stripe
        border
        :default-sort="{prop: 'createTime', order: 'descending'}"
        slot="empty"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
        height="100%"
      >
        <!-- <el-table-column type="index" width="40" :index="indexMethod"></el-table-column> -->
        <el-table-column prop="loginName" label="登陆名称" width="auto" min-width="100"></el-table-column>
        <el-table-column prop="username" label="用户名称" width="auto" min-width="90"></el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="auto" min-width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="auto" min-width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="auto" sortable min-width="160"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="auto" min-width="160"></el-table-column>
        <el-table-column prop="inUse" label="是否启用" width="50"></el-table-column>
        <el-table-column prop="opration" label="操作" width="auto" min-width="160">
          <template slot-scope="scope" style="color:blue">
            <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="check(scope.$index, scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="user(scope.$index, scope.row)">角色</el-button>
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
        :page-size="5"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        style="position:relative;text-align:center"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="55%"
      title="信息"
      :before-close="handleMesssage"
    >
      <div class="messageDiv">
        <div class="divForm">
          <el-form :model="form" ref="form" :rules="rules" :inline="true">
            <el-form-item label="员工号" :label-width="formLabelWidth" prop="employeeId" required>
              <el-input v-model="form.employeeId" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password" require>
              <el-input
                v-model="form.password"
                type="password"
                show-password
                autocomplete="off"
                :disabled="disable"
                style="width:93%"
              ></el-input>
            </el-form-item>
            <el-form-item label="登录名称" :label-width="formLabelWidth" prop="loginName" require>
              <el-input v-model="form.loginName" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username" require>
              <el-input v-model="form.username" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile" require>
              <el-input v-model="form.mobile" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email" require>
              <el-input v-model="form.email" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="创建人" :label-width="formLabelWidth" prop="creator" require>
              <el-input v-model="form.creator" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth" prop="inUse" required>
              <el-select v-model="form.inUse" placeholder="是否启用" style="width:93%">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="divButton">
          <el-button
            v-if="resetShow"
            type="primary"
            size="small"
            @click="reset('resetform')"
            style="position:relative;float:right;margin-left:10px;margin-right:60px"
          >重 置</el-button>
          <el-button
            type="primary"
            size="small"
            @click="makeSure('resetform')"
            style="position:relative;float:right;margin-left:10px;"
          >确 定</el-button>
          <el-button
            @click="cancel"
            type="primary"
            size="small"
            style="color:#909399;position:relative;float:right;background-color:white"
          >取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFormVisible1"
      destroy-on-close
      width="30%"
      title="角色绑定"
      :before-close="handleRole"
    >
      <div class="div-tree" v-if="dialogFormVisible1">
        <div class="treeDiv">
          <el-input v-model="userId" style="display:none"></el-input>
          <el-tree
            :data="navs"
            node-key="id"
            ref="tree"
            show-checkbox
            highlight-current
            :props="defaultProps"
            accordion
            :default-checked-keys="checked"
            :default-expanded-keys="checked"
          ></el-tree>
        </div>
        <div class="buttonDiv">
          <el-button
            type="primary"
            size="small"
            @click="Sure"
            style="position:relative;float:right;margin-left:10px;margin-top:5px"
          >确 定</el-button>
          <el-button
            @click="Cancel"
            size="small"
            style="color:#909399;position:relative;float:right;margin-top:5px"
          >取 消</el-button>
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
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const checkemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!value) {
        return callback(new Error("请输入邮箱"));
      }
      setTimeout(() => {
        if (checkemail.test(value)) {
          callback();
        } else {
          callback(new Error("邮箱格式不正确"));
        }
      }, 1000);
    };
    var checkMobile = (rule, value, callback) => {
      const checkphone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!value) {
        return callback(new Error("请输入手机号"));
      }
      setTimeout(() => {
        if (checkphone.test(value)) {
          callback();
        } else {
          callback(new Error("手机号格式不对"));
        }
      }, 200);
    };
    var checkId = (rule, value, callback) => {
      let checkinuse = /[0-9]/;
      if (!value) {
        return callback(new Error("请输入员工编号"));
      }
      setTimeout(() => {
        if (checkinuse.test(value)) {
          callback();
        } else {
          callback(new Error("只能是数字"));
        }
      }, 200);
    };
    return {
      navs: [],
      defaultProps: {
        children: "children",
        label: "roleName"
      },
      tabledata: [],
      filterdata: [],
      multipleSelection: [],
      filterInfo: [],
      roleId: [],
      MC: "",
      yh: "",
      dialogFormVisible: false,
      dialogFormVisible1: false,
      olddata: [],
      form: {
        loginName: "",
        username: "",
        mobile: "",
        email: "",
        creator: "",
        password: "",
        employeeId: "",
        inUse: "",
        id: ""
      },
      disable: false,
      formLabelWidth: "100px",
      total: 0,
      currentPage: 1,
      pageSize: 5,
      pageSizeTotle: 100,
      show: false,
      userId: "",
      roleId: "",
      checked: [],
      rules: {
        email: [{ required: true, trigger: "blur", validator: checkEmail }],
        mobile: [{ required: true, trigger: "blur", validator: checkMobile }],
        loginName: [{ required: true, trigger: "blur", message: "登录名必填" }],
        username: [
          { required: true, trigger: "blur", message: "用户名必填" },
          { min: 2, max: 4, message: "2到4个字符", trigger: blur }
        ],
        creator: [{ required: true, trigger: "blur", message: "必填" }],
        password: [{ required: true, trigger: "blur", message: "密码必填" }],
        employeeId: [{ required: true, trigger: "blur", validator: checkId }],
        inUse: [{ required: true }]
        // [
        //   { required: true, trigger: "change", message: '必填' },
        //   { type: "number", message: '只能是数字' ,trigger: "blur"}
        // ]
      },
      resetShow: false
    };
  },
  methods: {
    // indexMethod(index) {
    //   return index + (this.currentPage - 1) * this.pageSize + 1;
    // },
    sortByDate() {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getUserList();
    },
    getUserList() {
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info/list",
          {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        )
        .then(res => {
          if (res.data.success) {
            this.total = res.data.obj.total;
            this.tabledata = res.data.obj.ennUsers;
            this.tabledata.forEach(ele => {
              ele.createTime = ele.createTime.replace(/T|Z/gi, " ");
              if (ele.updateTime) {
                ele.updateTime = ele.updateTime.replace(/T|Z/gi, " ");
              }
              if (ele.inUse) {
                ele.inUse = "是";
              } else {
                ele.inUse = "否";
              }
            });
          }
          this.filterdata = this.tabledata.slice(0);
        });
    },
    getdata() {
      return this.axios
        .get("http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/tree")
        .then(res => {
          if (res.status == 200) {
            this.navs = res.data.obj;
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(p) {
      this.currentPage = p;
      this.getUserList();
    },
    handleClick() {},
    select() {
      let _this = this;
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info/list",
          {
            page: this.currentPage,
            pageSize: this.pageSizeTotle,
            loginName: this.MC,
            username: this.yh
          }
        )
        .then(res => {
          if (res.data.success) {
            this.total = res.data.obj.total;
            this.tabledata = res.data.obj.ennUsers;
            this.tabledata.forEach(ele => {
              ele.createTime = ele.createTime.replace(/T|Z/gi, " ");
              if (ele.updateTime) {
                ele.updateTime = ele.updateTime.replace(/T|Z/gi, " ");
              }
            });
            // this.tempdata = this.tabledata.slice(0);
            // var test = this.tempdata.filter(function(item) {
            //   let a1, a2;
            //   if (typeof item.loginName == "string") {
            //     a1 = item.loginName.indexOf(_this.MC) > -1;
            //   }
            //   if (typeof item.username == "string") {
            //     a2 = item.username.indexOf(_this.yh) > -1;
            //   }
            //   return a1 && a2;
            // });
            this.filterdata = this.tabledata.slice(
              (_this.currentPage - 1) * _this.pageSize,
              _this.currentPage * _this.pageSize
            );
          }
        });
      // item.loginName.indexOf(this.MC) > -1
      //   item =>
      //     (item.loginName.indexOf(this.MC) > -1 &&
      //     item.username.indexOf(this.TYPE) > -1)
      // );
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
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info/" +
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
      this.show = true; //判断是否查看
      this.dialogFormVisible = true;
      this.form.loginName = row.loginName;
      this.form.username = row.username;
      this.form.mobile = row.mobile;
      this.form.email = row.email;
      this.form.creator = row.creator;
      this.form.password = row.password;
      this.form.employeeId = row.employeeId;
      this.form.inUse = row.inUse;
      this.required = false;
      this.form.id = row.id;
      this.disable = true;
      this.resetShow = false;
    },
    edit(index, row) {
      this.dialogFormVisible = true;
      this.form.loginName = row.loginName;
      this.form.username = row.username;
      this.form.mobile = row.mobile;
      this.form.email = row.email;
      this.form.creator = row.creator;
      this.form.password = row.password;
      this.form.employeeId = row.employeeId;
      this.form.inUse = row.inUse;
      this.form.id = row.id;
      this.disable = false;
      this.show = false;
      this.resetShow = false;
    },
    async cancel() {
      await this.$refs.form.clearValidate();
      this.show = false;
      this.dialogFormVisible = false;
      this.form.loginName = "";
      this.form.username = "";
      this.form.mobile = "";
      this.form.email = "";
      this.form.creator = "";
      this.form.password = "";
      this.form.employeeId = "";
      this.form.inUse = "";
      this.form.id = "";
      this.resetShow = false;
    },
    handleMesssage() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$refs.form.clearValidate();
          this.show = false;
          this.dialogFormVisible = false;
          this.form.loginName = "";
          this.form.username = "";
          this.form.mobile = "";
          this.form.email = "";
          this.form.creator = "";
          this.form.password = "";
          this.form.employeeId = "";
          this.form.inUse = "";
          this.form.id = "";
          this.resetShow = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addnew() {
      this.dialogFormVisible = true;
      this.show = false;
      this.disable = false;
      this.resetShow = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    makeSure() {
      this.$refs.form.clearValidate();
      let _this = this;
      if (this.form.id) {
        this.dialogFormVisible = false;
        this.resetShow = false;
        if (this.show) {
          this.show = false;
          this.form.loginName = "";
          this.form.username = "";
          this.form.mobile = "";
          this.form.email = "";
          this.form.creator = "";
          this.form.password = "";
          this.form.inUse = "";
          this.form.employeeId = "";
          this.form.id = "";
        } else {
          this.$confirm("是否修改", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.axios
              .put(
                "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info/" +
                  this.form.id,
                this.form,
                { headers: { "Content-Type": "application/json" } }
              )
              .then(res => {
                if (res.data.success) {
                  _this.getUserList();
                  _this.form.loginName = "";
                  _this.form.username = "";
                  _this.form.mobile = "";
                  _this.form.email = "";
                  _this.form.creator = "";
                  _this.form.password = "";
                  _this.form.inUse = "";
                  _this.form.employeeId = "";
                  _this.form.id = "";
                  _this.$message({
                    message: "修改成功",
                    offset: 240,
                    type: "success"
                  });
                }
              });
          });
        }
      } else if (!this.form.id) {
        // if(this.form.inUse == "是"){
        //   this.form.inUse = 1;
        // }else{
        //   this.form.inUse = 0;
        // }
        this.$refs.form.validate(valid => {
          if (valid) {
            this.axios
              .post(
                "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info",
                this.form,
                { headers: { "Content-Type": "application/json" } }
              )
              .then(function(res) {
                _this.dialogFormVisible = false;
                _this.getUserList();
                _this.form.loginName = "";
                _this.form.username = "";
                _this.form.mobile = "";
                _this.form.email = "";
                _this.form.inUse = "";
                _this.form.creator = "";
                _this.form.password = "";
                _this.form.employeeId = "";
                _this.form.id = "";
                _this.resetShow = false;
                if (res.data.success) {
                  _this.$message({
                    message: "添加成功",
                    offset: 240,
                    type: "success"
                  });
                } else {
                  _this.$message({
                    message: res.data.obj,
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
    },
    async user(index, row) {
      let that = this;
      this.userId = row.id;
      await this.getdata();
      this.checked = [];
      this.axios
        .get(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/userId/" +
            this.userId
        )
        .then(res => {
          if (res.data.success) {
            that.dialogFormVisible1 = true;
            let Select = res.data.obj;
            Select.forEach(ele => {
              that.checked.push(ele.id);
            });
          }
        });
    },
    Sure() {
      this.dialogFormVisible1 = false;
      this.roleId = this.$refs.tree.getCheckedKeys();
      let Data = {
        userId: this.userId,
        roleIds: this.roleId
      };
      /*
      *author: wang
      */ 
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/role/batch",
          Data
        )
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              message: "关联成功",
              offset: 240,
              type: "success"
            });
          }
        });
    },
    Cancel() {
      this.dialogFormVisible1 = false;
      this.checked = [];
    },
    handleRole() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisible1 = false;
          this.checked = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset() {
      this.$refs.form.resetFields();
    }
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
  & /deep/ .el-dialog.el-dialog--center {
    margin-top: 0;
  }
  .cx {
    flex: 0 0 15%;
    display: flex;
    // align-items: center;
    color: #909399;
    .left-cx {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .right-cx {
      flex: 0 0 20%;
      display: flex;
      align-items: center;
    }
  }
  .data {
    flex: 77%;
    margin: 5px 5px 0px 5px;
    color: #909399;
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
  & /deep/ .el-dialog__header {
    background-color: #0780ed;
    color: white !important;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  & /deep/ .el-dialog__title {
    color: white;
  }
  & /deep/ .el-dialog__body {
    background-color: #fff;
  }
  .dialog-footer {
    height: 40px;
    width: 100%;
  }
  .div-tree {
    height: 350px;
    width: 350px;
    position: relative;
    left: 10px;
    display: flex;
    flex-direction: column;
    .treeDiv {
      flex: 0 90%;
    }
    .buttonDiv {
      flex: 1;
    }
  }
  .messageDiv {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .divForm {
      flex: 90%;
      margin-left: 32px;
    }
    .divButton {
      flex: 1;
    }
  }
}
</style>

<style>
.el-dialog {
  border-radius: 5px;
  background: none !important;
}
.el-table {
  /* border: 1px solid white; */
}
.el-table::before {
  /* left: 0;
  bottom: 0;
  width: 100%;
  height: 0px; */
}
</style>