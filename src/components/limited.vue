<template>
  <div class="div">
    <div class="div-tree">
      <div class="div-tree-button">
        <el-button type="primary" icon="el-icon-plus" @click="add" size="small" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" @click="edit" size="small" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" @click="Delete" size="small" circle></el-button>
      </div>
      <div class="div-tree-tree">
        <el-tree
          :data="navs"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          accordion
          :default-expanded-keys="checking"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="show">
      <el-tabs
        v-model="activeName"
        stretch
        style="height:100%"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="角色信息" name="message">
          <div class="form">
            <el-form :model="forms" ref="forms" label-width="100px">
              <el-form-item label="角色名称">
                <el-input v-model="forms.roleName"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-input v-model="forms.createTime"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="forms.description" type="textarea" :rows="2"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户" name="user">
          <div class="userdiv">
            <div class="userdiv-button">
              <el-button
                type="primary"
                size="small"
                @click="addUser"
                style="float:right;margin-bottom:2px;margin-top:1px;margin-right:1px"
              >用户绑定</el-button>
            </div>
            <div class="userdiv-1">
              <el-table
                :data="tabledata"
                style="text-align:center;overflow: auto;width:100%"
                height="100%"
                :ref="tabledata"
                @selection-change="handleSelectionChange"
                stripe
                border
                :default-sort="{prop: 'createTime', order: 'descending'}"
                slot="empty"
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
              >
                <el-table-column type="index" width="50" :index="indexMethod"></el-table-column>
                <el-table-column prop="loginName" label="登陆名称" width="100"></el-table-column>
                <el-table-column prop="username" label="用户名称" width="100"></el-table-column>
                <el-table-column prop="mobile" label="联系方式" width="140"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160" sortable></el-table-column>
                <el-table-column prop="opration" label="操作">
                  <template slot-scope="scope" style="color:blue">
                    <el-button
                      style="align-items:center;margin-left: 0px;
                    position: relative;left: 0;"
                      type="text"
                      size="small"
                      @click="deleteRow(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="userdiv-2">
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
          </div>
        </el-tab-pane>
        <el-tab-pane label="应用" name="using">
          <div class="button-using">
            <el-button
              type="primary"
              size="small"
              @click="limit"
              style="float:right;margin-bottom:2px;margin-top:1px;margin-right:1px"
            >应用绑定</el-button>
          </div>
          <div class="using1">
            <el-table
              :data="usingdata"
              style="width:100%;text-align:center;overflow: auto"
              height="100%"
              :ref="usingdata"
              @selection-change="handleSelectionChangeusing"
              :row-key="getRowKeys"
              stripe
              border
              reserve-selection="selection"
              :cell-style="{'text-align':'center'}"
              :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
            >
              <el-table-column type="selection" :reserve-selection="true" width="50"></el-table-column>
              <el-table-column prop="apiName" label="路径名称" width="90"></el-table-column>
              <el-table-column prop="path" label="映射地址" width="140"></el-table-column>
              <el-table-column prop="serviceId" label="映射服务ID" width="170"></el-table-column>
              <el-table-column prop="url" label="被映射地址" width="170"></el-table-column>
              <el-table-column prop="opration" label="操作">
                <template slot-scope="scope" style="color:blue">
                  <el-button
                    style="align-items:center;margin-left: 0px;
                    position: relative;left: 0;"
                    type="text"
                    size="small"
                    @click="deleteUsingRow(scope.$index, scope.row)"
                  >删除</el-button>
                  <el-button
                    style="align-items:center;margin-left: 0px;
                    position: relative;left: 0;"
                    type="text"
                    size="small"
                    @click="limiteUsingRow(scope.$index, scope.row)"
                  >权限</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="using2">
            <el-pagination
              layout=" total,sizes,prev, pager, next,jumper"
              :total="totalUsing"
              @size-change="handleSizeChangeUsing"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSizeUing"
              @current-change="handleCurrentChangeUsing"
              :current-page="currentPageUsing"
              style="position:relative;text-align:center"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="角色信息"
      width="40%"
      :before-close="handleMessageClose"
    >
      <div class="message" v-if="dialogFormVisible">
        <div class="messageForm">
          <el-form :model="form" ref="form" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="roleName" require>
              <el-input v-model="form.roleName" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" require>
              <el-input v-model="form.createTime" autocomplete="off" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description" require>
              <el-input
                v-model="form.description"
                autocomplete="off"
                :autosize="{ minRows: 2, maxRows: 4}"
                :disabled="disable"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="messageButton">
          <el-button
            type="primary"
            @click="makeSure"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancel" style="color:#909399;position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFormVisibleAdd"
      title="角色信息"
      width="40%"
      :before-close="handleUsingClick"
    >
      <div class="message" v-if="dialogFormVisibleAdd">
        <div class="messageForm">
          <el-form :model="formAdd" ref="form" :rules="Addrules" label-width="100px">
            <el-form-item label="角色名称" prop="roleNameAdd" require>
              <el-input v-model="formAdd.roleNameAdd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="添加节点" prop="inUseAdd" required>
              <el-select v-model="formAdd.inUseAdd" placeholder="添加根节点子节点" style="width:100%">
                <el-option label="根节点" value="1" selected></el-option>
                <el-option label="当前结点子节点" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="descriptionAdd" require>
              <el-input
                v-model="formAdd.descriptionAdd"
                autocomplete="off"
                :autosize="{ minRows: 2, maxRows: 4}"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="messageButton">
          <el-button
            type="primary"
            @click="makeSureAdd"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancelAdd" style="color:#909399;position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFormVisible2"
      width="32%"
      title="用户绑定"
      :before-close="handleRoleUser"
    >
      <div v-if="dialogFormVisible2" class="roleUser">
        <div class="search">
          <div class="MC">
            <div class="font" style="width: 30%;color:#909399">登录名称 :</div>
            <div class="mc-input">
              <el-input v-model="MC" placeholder="登录名称" style="width:90%"></el-input>
            </div>
          </div>
          <div class="searchButton">
            <el-button @click="search" size="small" type="primary" style="float:right">搜索</el-button>
          </div>
        </div>
        <div class="userTree">
          <el-table
            :data="user"
            border
            height="100%"
            ref="user"
            :row-key="getRowKeysUser"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
            <el-table-column width="100" prop="username" label="用户名"></el-table-column>
            <el-table-column width="100" prop="loginName" label="登录名"></el-table-column>
            <el-table-column width="auto" prop="mobile" label="联系方式"></el-table-column>
          </el-table>
        </div>
        <div class="userDH">
          <el-pagination
            layout=" total,prev, pager, next"
            :total="totaluserDH"
            :page-size="pageSizeUingDH"
            @current-change="handleCurrentChangeuserDH"
            :current-page="currentPageuserDH"
            style="position:relative;text-align:center"
          ></el-pagination>
        </div>
        <div class="userButton">
          <el-button
            type="primary"
            size="small"
            @click="addUserButton"
            style="position:relative;float:right;margin-left:10px;margin-top: 4px"
          >确 定</el-button>
          <el-button
            @click="cancelUser"
            size="small"
            style="color:#909399,position:relative;float:right;margin-top: 4px"
          >取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFormVisible1"
      width="40%"
      title="应用绑定"
      :before-close="handleRoleUsing"
    >
      <div v-if="dialogFormVisible1" class="roleUsing">
        <div class="usingTree">
          <el-table
            :data="msg"
            ref="msg"
            border
            height="100%"
            style="width: 100%"
            @selection-change="handleSelectionChangetable"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column width="100" prop="apiName" label="名称"></el-table-column>
            <el-table-column width="auto" prop="path" label="地址"></el-table-column>
            <el-table-column width="auto" prop="url" label="链接"></el-table-column>
          </el-table>
        </div>
        <div class="usingPage">
          <el-pagination
            layout=" total,prev, pager, next"
            :total="totaluserUsing"
            :page-size="pageSizeUingUsing"
            @current-change="handleCurrentChangeuserUsing"
            :current-page="currentPageRoleUsing"
            style="position:relative;text-align:center"
          ></el-pagination>
        </div>
        <div class="usingButton">
          <el-button
            type="primary"
            @click="makeSure1"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancel1" style="color:#909399,position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFormVisibleGatewWay"
      width="50%"
      title="网关权限绑定"
      :before-close="handleGateWay"
    >
      <div v-if="dialogFormVisibleGatewWay" class="GatewWay">
        <div class="GatewWayForm">
          <div class="GatewWayType">
            <el-form :model="GatewWayForm" ref="GatewWayForm" :rules="GatewWayRules">
              <el-form-item label="请求类型" prop="type" label-width="90px" required>
                <el-select v-model="GatewWayForm.type" placeholder="请求类型" style="width:93%">
                  <el-option label="post" value="post"></el-option>
                  <el-option label="get" value="get"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="GatewWayLimit">
            <div class="GatewWayLimitFont">
              <div class="GatewWayLimitFontArea">
                <span style="font-size:18px;align-items: center;position:relative;left:10px">数据限制：</span>
              </div>
              <div class="GatewWayLimitFontButton">
                <el-button size="small" type="primary" @click="AddParam">新增参数</el-button>
              </div>
            </div>
            <div class="GatewWayLimitForm">
              <el-form :model="GatewWayLimitForm" ref="GatewWayLimitForm">
                <el-row>
                  <el-col :span="7">
                    <el-form-item
                      label-width="70px"
                      v-for="(domain, index) in GatewWayLimitForm.keyVals"
                      :label="'key'+index+':'"
                      :key="domain.key"
                      required
                      :prop="'keyVals.'+index+'.paramKey'"
                      :rules="{required: true,message: '必填', trigger: 'change'}"
                    >
                      <el-input v-model="domain.paramKey"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label-width="80px"
                      v-for="(domain, index) in GatewWayLimitForm.keyVals"
                      :label="'Value'+index+':'"
                      :key="domain.key"
                      required
                      :prop="'keyVals.'+index+'.paramValue'"
                      :rules="{required: true,message: '必填', trigger: 'change'}"
                    >
                      <el-input v-model="domain.paramValue"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      label-width="70px"
                      v-for="(domain, index) in GatewWayLimitForm.keyVals"
                      :label="'Type'+index+':'"
                      :key="domain.key"
                      required
                      :prop="'keyVals.'+index+'.paramValueType'"
                      :rules="{required: true,message: '必填', trigger: 'change'}"
                    >
                      <el-input v-model="domain.paramValueType" style="width: 60%"></el-input>
                      <el-button size="small" @click="removeClick(domain)">删除</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
        <div class="GatewWayButton">
          <el-button
            type="primary"
            @click="GatewWaySure"
            style="position:relative;float:right;margin-left:10px"
          >确 定</el-button>
          <el-button @click="cancelGatewWay" style="color:#909399,position:relative;float:right">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { constants, lstat } from "fs";
import { type } from "os";
import { connect } from "net";
export default {
  data() {
    return {
      navs: [],
      msg: [],
      tabledata: [],
      usingdata: [],
      user: [],
      UserList: [],
      forms: {
        roleName: "",
        createTime: "",
        description: "",
        parentId: ""
      },
      defaultProps: {
        children: "children",
        label: "roleName"
      },
      defaultProps1: {
        children: "children",
        label: "path"
      },
      defaultProps2: {
        children: "children",
        label: "loginName"
      },
      form: {
        parentId: "",
        roleName: "",
        createTime: "",
        description: ""
      },
      formAdd: {
        parentIdAdd: "",
        roleNameAdd: "",
        createTime: "",
        descriptionAdd: "",
        inUseAdd: "根节点"
      },
      GatewWayForm: {
        type: ""
      },
      GatewWayLimitForm: {
        keyVals: [
          {
            paramKey: "",
            paramValue: "",
            paramValueType: ""
          }
        ]
      },
      dialogFormVisible1: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleGatewWay: false,
      disable: false,
      show: false,
      rules: {
        roleName: [{ required: true, trigger: "blur" }],
        createTime: [{ required: true, trigger: "blur" }],
        description: [{ required: true, trigger: "blur" }]
      },
      Addrules: {
        roleNameAdd: [{ required: true, trigger: "blur" }],
        descriptionAdd: [{ required: true, trigger: "blur" }]
      },
      GatewWayRules: {
        type: [{ required: true, trigger: "change", message: "请求类型必填" }]
      },
      activeName: "message",
      checked: [],
      page: 1,
      resId: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      currentPageUsing: 1,
      pageSizeUing: 5,
      totalUsing: 0,
      pageSizeResdata: 100,
      pageResdata: 1,
      totaluserDH: 0,
      pageSizeUingDH: 5,
      pageSizeUingDHTotal: 100,
      currentPageuserDH: 1,
      totaluserUsing: 0,
      pageSizeUingUsing: 5,
      pageSizeUingUsingTotal: 100,
      currentPageRoleUsing: 1,
      checking: [],
      checkedUser: [],
      multiSelection: [],
      multiSelectiontable: [],
      Select: [],
      MC: "",
      user_list: [],
      list: [],
      cancelShow: false,
      IDS: "" //网关id
    };
  },
  methods: {
    getdata() {
      let that = this;
      this.axios
        .get("http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/tree")
        .then(res => {
          if (res.status == 200) {
            this.navs = res.data.obj;
            if (!this.cancelShow) {
              if (this.navs[0].children) {
                that.checking.push(this.navs[0].children[0].id);
                that.handleNodeClick(this.navs[0].children[0]);
                that.$nextTick(() => {
                  that.$refs.tree.setCurrentKey(this.navs[0].children[0].id);
                });
              } else {
                that.checking.push(this.navs[0].id);
                that.handleNodeClick(this.navs[0]);
                that.$nextTick(() => {
                  that.$refs.tree.setCurrentKey(this.navs[0].children[0].id);
                });
              }
            } else {
              this.navs.forEach(ele => {
                if (ele.id == that.forms.id) {
                  that.$nextTick(() => {
                    that.$refs.tree.setCurrentKey(ele.id);
                    that.handleNodeClick(ele);
                  });
                }
                if (ele.children) {
                  ele.children.forEach(l => {
                    if (l.id == that.forms.id) {
                      that.$nextTick(() => {
                        that.$refs.tree.setCurrentKey(l.id);
                        that.handleNodeClick(l);
                      });
                    }
                  });
                }
              });
            }
          }
        });
    },
    getRowKeysUser(row) {
      return row.id;
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    },
    handleCurrentChange(p) {
      this.currentPage = p;
      this.getarrform();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getarrform();
    },
    handleSizeChangeUsing(L) {
      this.pageSizeUing = L;
      this.getusingform();
    },
    handleCurrentChangeUsing(ele) {
      this.currentPageUsing = ele;
      this.getusingform();
    },
    async handleCurrentChangeuserDH(ele) {
      this.currentPageuserDH = ele;
      this.pageSizeUingDH = 5;
      await this.getUserdata();
      this.$nextTick(() => {
        this.UserList.forEach(ele => {
          this.user.forEach(L => {
            if (ele.id == L.id) {
              this.$refs.user.toggleRowSelection(L, true);
            }
          });
        });
      });
    },
    async handleCurrentChangeuserUsing(ele) {
      this.currentPageRoleUsing = ele;
      this.pageSizeUingUsing = 5;
      await this.getresdata();
      this.$nextTick(() => {
        this.Select.forEach(ele => {
          this.msg.forEach(L => {
            if (ele.id == L.id) {
              this.$refs.user.toggleRowSelection(L, true);
            }
          });
        });
      });
    },
    getRowKeys(row) {
      return row.id;
    },
    getresdata() {
      return this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/app/list",
          {
            page: this.currentPageUsing,
            pageSize: this.pageSizeUingUsing
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(res => {
          if (res.data.success) {
            let using_list = [];
            using_list = res.data.obj.EnnGateways;
            if (using_list.length > 4) {
              this.msg = using_list.slice(
                (this.currentPageUsing - 1) * this.pageSizeUing,
                this.currentPageUsing * this.pageSizeUing
              );
            } else {
              this.msg = using_list;
            }
            this.totaluserUsing = res.data.obj.total;
          }
        });
    },
    getUserdata() {
      return this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/info/list",
          {
            page: this.currentPageuserDH,
            pageSize: this.pageSizeUingDH
          }
        )
        .then(res => {
          if (res.data.success) {
            this.user_list = res.data.obj.ennUsers;
            if (this.user_list.length > 4) {
              this.user = this.user_list.slice(
                (this.currentPageuserDH - 1) * this.pageSizeUingDH,
                this.currentPageuserDH * this.pageSizeUingDH
              );
            } else {
              this.user = this.user_list;
            }
            this.totaluserDH = res.data.obj.total;
          }
        });
    },
    handleNodeClick(data) {
      data.createTime = data.createTime.replace(/T|Z/g, " ");
      this.forms = data;
      this.currentPage = 1;
      this.pageSize = 5;
      this.currentPageUsing = 1;
      this.pageSizeUing = 5;
      this.getarrform();
      this.getusingform();
    },
    Delete() {
      let _this = this;
      if (this.forms.id) {
        _this.getarrform();
        _this.getusingform();
        if (_this.total < 1 && _this.totalUsing < 1) {
          this.$confirm("是否删除?(必须保证没有关联)", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.axios
                .delete(
                  "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/" +
                    this.forms.id
                )
                .then(res => {
                  if (res.data.success) {
                    _this.$message({
                      message: "删除成功",
                      type: "success",
                      offset: 240
                    });
                    _this.getdata();
                    _this.forms.id = "";
                    _this.forms.createTime = "";
                    _this.forms.description = "";
                    _this.forms.id = "";
                    _this.forms.parentId = "";
                    _this.forms.roleName = "";
                  }
                });
            })
            .catch(err => {});
        } else {
          _this.$message({
            message: "先取消所有关联",
            type: "warning",
            offset: 240
          });
        }
      } else {
        _this.$message({
          message: "请先选择需要删除的项",
          offset: 240,
          type: "info"
        });
      }
    },
    edit() {
      if (!this.forms.id) {
        this.$message({
          message: "请选择需要修改的项",
          offset: 240,
          type: "info"
        });
      } else {
        this.dialogFormVisible = true;
        this.list = this.forms;
        delete this.list.children; //删除一个孩子
        this.$nextTick(() => {
          this.form = this.list;
        });
      }
    },
    add() {
      this.dialogFormVisibleAdd = true;
      // this.show = true;
      // if (this.show) {
      //   this.form.parentId = this.forms.id;
      // }
    },
    cancel() {
      this.dialogFormVisible = false;
      this.cancelShow = true;
      this.getdata();
    },
    handleMessageClose() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisible = false;
          this.cancelShow = true;
          this.getdata();
        })
        .catch(err => {
          console.log(err);
        });
    },
    makeSure() {
      this.$refs.form.clearValidate();
      this.dialogFormVisible = false;
      let formsdata = this.form;
      let _this = this;
      delete formsdata.createTime;
      if (formsdata.id) {
        this.axios
          .put(
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/" +
              formsdata.id,
            JSON.stringify(formsdata, 0, 4),
            { headers: { "Content-Type": "application/json" } }
          )
          .then(res => {
            if (res.data.success) {
              _this.$message({
                message: "修改成功",
                type: "success",
                offset: 240
              });
              _this.getdata();
              _this.form.id = "";
              _this.form.createTime = "";
              _this.form.description = "";
              _this.form.id = "";
              _this.form.parentId = "";
              _this.form.roleName = "";
            }
          });
      }
    },
    makeSureAdd() {
      this.$refs.form.clearValidate();
      this.dialogFormVisibleAdd = false;
      let formsAdd = this.formAdd;
      delete formsAdd.createTime;
      if (formsAdd.inUseAdd == 1) {
        formsAdd.parentIdAdd = 0;
      } else if (formsAdd.inUseAdd == 0) {
        formsAdd.parentIdAdd = this.forms.id;
      }
      let _this = this;
      this.axios
        .post("http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role", {
          description: formsAdd.descriptionAdd,
          parentId: formsAdd.parentIdAdd,
          roleName: formsAdd.roleNameAdd
        })
        .then(res => {
          if (res.data.success) {
            _this.$message({
              message: "添加成功",
              offset: 240,
              type: "success"
            });
            _this.getdata();
            _this.formAdd.descriptionAdd = "";
            _this.formAdd.parentIdAdd = "";
            _this.formAdd.roleNameAdd = "";
          }
        });
    },
    cancelAdd() {
      this.dialogFormVisibleAdd = false;
      // this.$refs.formsAdd.resetField();
      this.formAdd.parentIdAdd = "";
      this.formAdd.roleNameAdd = "";
      this.formAdd.descriptionAdd = "";
    },
    handleUsingClick() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisibleAdd = false;
          // this.$refs.formsAdd.resetField();
          this.formAdd.parentIdAdd = "";
          this.formAdd.roleNameAdd = "";
          this.formAdd.descriptionAdd = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    async addUser() {
      let that = this;
      if (!this.forms.id) {
        this.$message({
          message: "请选择一个角色",
          type: "error",
          offset: 240
        });
      } else {
        await that.getUserdata();
        this.axios
          .get(
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/roleId/" +
              this.forms.id
          )
          .then(res => {
            if (res.data.success) {
              that.dialogFormVisible2 = true;
              that.UserList = res.data.obj;
              that.$nextTick(() => {
                that.UserList.forEach(ele => {
                  that.user.forEach(L => {
                    if (ele.id == L.id) {
                      that.$refs.user.toggleRowSelection(L, true);
                    }
                  });
                });
              });
            }
          });
      }
    },
    addUserButton() {
      this.currentPageuserDH = 1;
      this.pageSizeUingDH = 5;
      this.dialogFormVisible2 = false;
      let UserSelected = [];
      this.multiSelection.forEach(ele => {
        UserSelected.push(ele.id);
      });
      let _this = this;
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/user/batch",
          {
            roleId: this.forms.id,
            userIds: UserSelected
          }
        )
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "关联成功",
              offset: 240,
              type: "success"
            });
            _this.getarrform();
          }
        });
    },
    cancelUser() {
      this.dialogFormVisible2 = false;
      // this.checkedUser = [];
      this.currentPageuserDH = 1;
      this.pageSizeUingDH = 5;
    },
    handleRoleUser() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisible2 = false;
          // this.checkedUser = [];
          this.currentPageuserDH = 1;
          this.pageSizeUingDH = 5;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async limit() {
      let that = this;
      if (!this.forms.id) {
        this.$message({
          message: "请选择一个角色",
          type: "error",
          offset: 240
        });
      } else {
        await this.getresdata();
        // that.checked = [];
        this.axios
          .get(
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/permission/roleId/" +
              this.forms.id
          )
          .then(res => {
            if (res.data.success) {
              that.dialogFormVisible1 = true;
              that.Select = res.data.obj;
              that.$nextTick(() => {
                that.Select.forEach(ele => {
                  that.msg.forEach(m => {
                    if (ele.id == m.id) {
                      that.$refs.msg.toggleRowSelection(m, true);
                    }
                  });
                  // that.$refs.msg.toggleAllSelection();
                });
              });
            }
          });
      }
    },
    cancel1() {
      this.dialogFormVisible1 = false;
      this.checked = [];
    },
    handleRoleUsing() {
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
    makeSure1() {
      let _this = this;
      this.dialogFormVisible1 = false;
      // this.resId = this.$refs.msg.getCheckedKeys();
      this.multiSelectiontable.forEach(ele => {
        this.resId.push(ele.id);
      });
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/permission/batch",
          {
            roleId: this.forms.id,
            resIds: this.resId
          }
        )
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "关联成功",
              type: "success",
              offset: 240
            });
            _this.getusingform();
          }
        });
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    handleClick(tab) {
      let that = this;
      if (!this.forms.id) {
        this.$message({
          message: "请选择一条记录",
          offset: 240,
          type: "warning"
        });
      } else if (tab.name == "user") {
        that.getarrform();
        that.currentPage = 1;
        that.pageSize = 5;
      } else if (tab.name == "using") {
        that.getusingform();
        that.currentPageUsing = 1;
        that.pageSizeUing = 5;
      }
    },
    getarrform() {
      let arrlist = [];
      if (this.forms.id) {
        this.axios
          .get(
            "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/roleId/" +
              this.forms.id
          )
          .then(res => {
            if (res.data.success) {
              arrlist = res.data.obj;
              arrlist.forEach(ele => {
                if (ele.createTime) {
                  ele.createTime = ele.createTime.replace(/T|Z/g, " ");
                }
                if(ele.id == null){
                  // console.log(ele)
                }
              });
              this.tabledata = arrlist.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
              );
              this.total = arrlist.length;
            }
          });
      }
    },
    handleSelectionChangeusing() {},
    handleSelectionChange(val) {
      this.multiSelection = val;
    },
    handleSelectionChangetable(ele) {
      this.multiSelectiontable = ele;
    },
    getusingform() {
      let usingList = [];
      this.axios
        .get(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/permission/roleId/" +
            this.forms.id
        )
        .then(res => {
          if (res.data.success) {
            usingList = res.data.obj;
            this.usingdata = usingList.slice(
              (this.currentPageUsing - 1) * this.pageSizeUing,
              this.currentPageUsing * this.pageSizeUing
            );
            this.totalUsing = usingList.length;
          }
        });
    },
    deleteUsingRow(index, row) {
      let that = this;
      this.axios
        .delete(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/role/permission/roleId/" +
            this.forms.id +
            "/resId/" +
            row.id,
          {
            roleId: this.forms.id,
            resId: row.id
          }
        )
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "删除成功",
              offset: 240,
              type: "success"
            });
            that.getusingform();
          }
        });
    },
    limiteUsingRow(index, row) {
      this.dialogFormVisibleGatewWay = true;
      let that = this;
      this.IDS = row.id;
      this.axios
        .post(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/query",
          {
            roleId: this.forms.id,
            gatewayId: this.IDS
          }
        )
        .then(res => {
          if (res.data.msg == "ok") {
            let GatewWayTest = res.data.data;
            GatewWayTest.forEach(ele => {
              delete ele.id;
              delete ele.createTime;
              delete ele.updateTime;
              delete ele.roleId;
              delete ele.gatewayId;
              that.GatewWayForm.type = ele.paramType;
            });
            that.GatewWayLimitForm.keyVals = GatewWayTest;
          }
        });
    },
    GatewWaySure() {
      let that = this;
      this.GatewWayLimitForm.keyVals.forEach(ele => {
        delete ele.paramType;
      });
      this.$refs.GatewWayForm.validate(valid => {
        if (valid) {
          if (that.GatewWayLimitForm.keyVals == 0) {
            this.$message({
              message: "必须添加一条数据",
              offset: 240,
              type: "info"
            });
          } else {
            that.$refs.GatewWayLimitForm.validate(ele => {
              if (ele) {
                that.dialogFormVisibleGatewWay = false;
                this.axios
                  .post(
                    "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/gateway_data_permission/update_batch",
                    {
                      gatewayId: this.IDS,
                      roleId: this.forms.id,
                      paramType: this.GatewWayForm.type,
                      keyVals: this.GatewWayLimitForm.keyVals
                    }
                  )
                  .then(res => {
                    if (res.data.msg == "ok") {
                      this.$message({
                        type: "success",
                        message: "保存成功",
                        offset: 240
                      });
                    }
                  });
              } else {
                return false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancelGatewWay() {
      this.dialogFormVisibleGatewWay = false;
      this.GatewWayForm.type = "";
      this.GatewWayLimitForm.keyVals = "";
    },
    handleGateWay() {
      this.$confirm("是否关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.dialogFormVisibleGatewWay = false;
          this.GatewWayForm.type = "";
          this.GatewWayLimitForm.keyVals = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    removeClick(key) {
      let value = this.GatewWayLimitForm.keyVals.indexOf(key);
      if (value > -1) {
        this.GatewWayLimitForm.keyVals.splice(value, 1);
      }
    },
    deleteRow(index, row) {
      let that = this;
      this.axios
        .delete(
          "http://oauth2-resource-fnw-dev.topaas.enncloud.cn/user/role/roleId/" +
            this.forms.id +
            "/userId/" +
            row.id,
          {
            roleId: this.forms.id,
            userId: row.id
          }
        )
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "删除成功",
              offset: 240,
              type: "success"
            });
            that.getarrform();
          }else{
            this.$message({
              message: res.data.obj,
              offset: 240,
              type: 'error'
            })
          }
        });
    },
    search() {
      let that = this;
      this.user = this.user_list.filter(item => {
        return item.loginName.indexOf(that.MC) > -1;
      });
    },
    AddParam() {
      if (this.GatewWayLimitForm.keyVals.length < 100) {
        this.GatewWayLimitForm.keyVals.push({
          paramKey: "",
          paramValue: "",
          paramValueType: ""
        });
      }
    }
  },
  created() {
    this.getdata();
  }
};
</script>
<style lang="scss" scoped>
.div {
  width: 100%;
  height: 100%;
  display: flex;
  .roleUser {
    width: 100%;
    height: 360px;
    display: flex;
    flex-direction: column;
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      margin-bottom: 2px;
      .searchButton {
        flex: 1;
      }
      .MC {
        flex: 2;
        align-items: center;
        display: flex;
      }
    }
    .userTree {
      flex: 0 75%;
      min-height: 75%;
    }
    .userDH {
      flex: 0 8%;
      margin-top: 1px;
    }
    .userButton {
      flex: 1;
    }
  }
  .roleUsing {
    width: 100%;
    height: 360px;
    display: flex;
    flex-direction: column;
    .usingTree {
      flex: 0 80%;
      min-height: 80%;
    }
    .usingButton {
      flex: 1;
    }
    .usingPage {
      flex: 10%;
      margin-top: 10px;
    }
  }
  .GatewWay {
    width: 100%;
    height: 360px;
    display: flex;
    flex-direction: column;
    .GatewWayForm {
      flex: 0 85%;
      display: flex;
      flex-direction: column;
      .GatewWayType {
        flex: 0 15%;
      }
      .GatewWayLimit {
        flex: 1;
        display: flex;
        flex-direction: column;
        .GatewWayLimitFont {
          flex: 0 20%;
          display: flex;
          align-items: center;
          .GatewWayLimitFontArea {
            flex: 0 70%;
            display: flex;
            align-items: center;
          }
          .GatewWayLimitFontButton {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }
        .GatewWayLimitForm {
          flex: 1;
          overflow: auto;
          margin: 4px;
          & /deep/ .el-row {
            max-height: 100%;
            width: 100%;
          }
        }
      }
    }
    .GatewWayButton {
      flex: 1;
    }
  }
  .message {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .messageForm {
      flex: 0 85%;
    }
    .messageButton {
      flex: 1;
    }
  }
  .div-tree {
    flex: 0 0 15%;
    display: flex;
    flex-direction: column;
    .div-tree-button {
      flex: 0 0 10%;
    }
    & /deep/ .el-tree.el-tree--highlight-current {
      position: relative;
      left: 10px;
    }
    & /deep/ .el-tree-node__content:hover {
      color: rgb(64, 158, 255);
    }
    & /deep/ .el-tree-node__content .el-tree-node__label:hover {
      color: rgb(64, 158, 255);
    }
  }
  .dialog-footer {
    height: 40px;
    width: 100%;
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
  .el-dialog {
    background-color: none !important;
  }
  .show {
    flex: 1;
    margin-left: 20px;
    & /deep/ .el-tabs--border-card > .el-tabs__content {
      padding: 1px;
    }
    & /deep/ button.el-button.el-button--default {
      left: 0 !important;
    }
    & /deep/ .el-tabs__content {
      height: 92%;
      width: 100%;
      div#pane-message {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        .form {
          flex: 0 85%;
        }
        .button {
          flex: 1;
        }
      }
      div#pane-user {
        height: 100%;
        width: 100%;
        .userdiv {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          .userdiv-button {
            flex: 0 7%;
          }
          .userdiv-1 {
            flex: 0 83%;
            max-height: 83%;
          }
          .userdiv-2 {
            flex: 1;
            & /deep/ .el-pager li.active {
              cursor: default;
              background-color: #409eff;
              color: white;
            }
            & /deep/.el-pager li {
              border-radius: 50%;
              min-width: 28px;
            }
          }
        }
      }
      div#pane-using {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        .button-using {
          flex: 0 7%;
        }
        .using1 {
          flex: 0 83%;
          max-height: 83%;
        }
        .using2 {
          flex: 1;
          & /deep/ .el-pager li.active {
            cursor: default;
            background-color: #409eff;
            color: white;
          }
          & /deep/.el-pager li {
            border-radius: 50%;
            min-width: 28px;
          }
        }
      }
    }
  }
}
</style>
<style >
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active::after {
  content: "";
  position: absolute;
  float: left;
  left: 0;
  top: 0;
  width: 100%;
  height: 3px;
  background-color: rgb(64, 158, 255);
  z-index: 1;
}
.el-dialog {
  background: none !important;
}
.el-pager li.active {
  background-color: #409eff !important;
  border-radius: 50%;
  color: #ffffff;
  min-width: 28px;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}
.el-tree--highlight-current
  /deep/
  .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  background: rgba(244, 245, 249, 1);
  color: rgb(64, 158, 255);
}
.el-tree--highlight-current
  /deep/
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: rgb(255, 255, 255);
  color: rgb(64, 158, 255);
  position: relative;
}
</style>

