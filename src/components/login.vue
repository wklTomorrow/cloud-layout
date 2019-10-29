<template>
  <div class="login-div">
    <div class="login-header">
      <span class="header-span">
        <img src="../assets/company-logo.png" alt="company-logo" />
      </span>
    </div>
    <div class="login-middle">
      <div class="login-font">
        <p class="logo1-font">深入融合数字技术与能源技术</p>
        <p class="logo2-font">
          <b>泛能网智慧能源解决方案</b>
        </p>
      </div>
      <div class="login-area">
        <form ref="loginForm">
          <p>
            <b>用户登录</b>
          </p>
          <br />
          <el-input
            type="text"
            class="user-input"
            placeholder="登录名"
            v-model="form.username"
            prefix-icon="el-icon-user"
          />
          <br />
          <br />
          <el-input
            placeholder="密码"
            type="password"
            class="password-input"
            v-model="form.password"
            show-password
            prefix-icon="el-icon-lock"
          />
          <br />
          <br />
          <div class="auth-code">
            <div class="code-input">
              <el-input placeholder="验证码" class="yzm-input" prefix-icon="iconfont iconsafety-certificate" v-model="form.YZM" />
            </div>
            <div class="yzm-div" @click="refreshyzm">
              <yzm :Code="code"></yzm>
            </div>
          </div>
          <br />
          <br />
          <input type="button" @click="login('form')" value="登录" class="button-input" />
        </form>
      </div>
    </div>
    <div class="login-footer">
      <span>
        <br />
        <p>了解我们&nbsp;&nbsp;&nbsp;&nbsp; 招贤纳士&nbsp;&nbsp;&nbsp;&nbsp;法律声明及隐私设置&nbsp;&nbsp;&nbsp;&nbsp;服务规则</p>
        <p style="font-size:12px">
          <b>&#169;2017-2018 新奥数能科技有限公司 版权所有 | 京ICP备18041593号-1</b>
        </p>
      </span>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from "element-ui";
import { constants } from "fs";
import yzm from "@/components/yzm";
export default {
  data() {
    return {
      form: {
        username: "wangkunlun",
        password: "wkl020934",
        YZM: ""
      },
      code: "",
      codes: "1234567890abcdefghijklmnopqrstuvwxyz"
    };
  },
  components: {
    yzm
  },
  methods: {
    login() {
      var Base64 = require("js-base64").Base64;
      var a = this.form.YZM.toLowerCase();
      if (a !== this.code) {
        this.axios
          .post(
            "http://cim-statistical-fnw-release.topaas.enncloud.cn/index/login",
            {
              username: this.form.username,
              password: Base64.encode(this.form.password)
            }
          )
          .then(res => {
            if (res.data.success) {
              sessionStorage.setItem("type", res.data.obj.group);
              sessionStorage.setItem("name", res.data.obj.name);
              this.$router.push({ path: "/home" });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
                offset: 240
              });
              this.form.username = "";
              this.form.password = "";
            }
          });
      } else if (this.form.username == "" || this.form.password == "") {
        this.$message({
          message: "用户名或密码为空",
          offset: 240
        });
        this.form.username = "";
        this.form.password = "";
      } else {
        this.$message({
          message: "验证码错误",
          type: "error",
          offset: 240
        });
        this.form.YZM = "";
      }
    },
    randonNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshyzm() {
      this.code = "";
      this.makecode(this.codes, 4);
    },
    makecode(o, l) {
      for (let i = 0; i < l; i++) {
        this.code += this.codes[this.randonNum(0, this.codes.length)];
      }
    }
  },
  created() {
    let that = this;
    document.onkeydown = function(e) {
      e = window.event || e;
      if (
        (that.$route.path == "/login" || that.$route.path == "/") &&
        (e.code == "Enter" || e.code == "enter")
      ) {
        that.login();
      }
    };
  },
  mounted() {
    this.code = "";
    this.makecode(this.codes, 4);
  }
};
</script>
<style scoped>
.login-div {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
.login-header {
  height: 10%;
  width: 100%;
  position: relative;
  margin: 0;
  padding: 0;
}
.header-span {
  height: 10%;
  width: 100%;
  position: relative;
  top: 10%;
}
img {
  position: relative;
  height: 40px;
  width: 108px;
  left: 10%;
  top: 10%;
}
.login-middle {
  background-color: #0780edff;
  background-image: url("../assets/middle.png");
  background-repeat: no-repeat;
  background-position: center;
  height: 78%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.login-font {
  height: 50%;
  width: 30%;
  position: fixed;
  left: 20%;
  top: 20%;
  color: #ffffff;
}
.login-area {
  background-color: #ffffffff;
  height: 50%;
  width: 20%;
  position: absolute;
  left: 72%;
  top: 24%;
}
.logo1-font {
  position: absolute;
  top: 30%;
  left: 2%;
}
.logo2-font {
  font-size: 27px;
  position: absolute;
  top: 42%;
  left: 2%;
}
p {
  height: 30px;
  text-align: center;
}
form {
  margin: 15px;
}
.user-input {
  /* 使用原声 */
  /* height: 38px;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: null; */
  width: 100%;
  /* background: url("../assets/denglu.png") no-repeat 0 center;
  padding-left: 27px; */
  background-position-x: 5px;
}
.password-input {
  width: 100%;
  /* border-radius: 3px; */
  /* 使用原生方法 */
  /* background: url("../assets/icon-mima.png") no-repeat 0 center; */
  /* padding-left: 27px; */
  /* height: 38px; */
  /* border: 1px solid #ccc; */
  background-position-x: 5px;
}

.button-input {
  height: 38px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 100%;
  text-align: center;
  background-color: #0780edff;
  color: #ffffffff;
}
.login-footer {
  height: 12%;
  width: 100%;
}
.auth-code {
  display: flex;
}
.code-input {
  flex: 0 0 45%;
}
.yzm-input {
  /* height: 38px;
  border: 1px solid #ccc;
  border-radius: 3px; */
  width: 100%;
  /* background: url("../assets/yanzhengma.png") no-repeat 0 center;
  padding-left: 27px; */
  background-position-x: 5px;
}
.yzm-div {
  flex: 1;
  padding-left: 5px;
  height: 38px;
  border-radius: 3px;
}
</style>
<style >
.el-input__icon {
  font-size: 23px;
}
.el-input .el-input__clear {
  font-size: 18px;
}
</style>
