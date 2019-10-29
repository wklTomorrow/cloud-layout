<template>
  <div class="home-div">
    <div class="header">
      <span class="logo-span">
        <div class="user-div">
          <label>{{Str}}:{{msg}}欢迎你!</label>
          <el-button icon="el-icon-switch-button" type="text" circle @click="cancle">注销</el-button>
        </div>
      </span>
    </div>
    <div class="content">
      <div class="left">
        <NavMenu />
      </div>
      <div class="right">
        <router-view />
      </div>
    </div>
    <div class="footer">
      <p style="font-size:12px">
        <b>&#169;2017-2018 新奥数能科技有限公司 版权所有 | 京ICP备18041593号-1</b>
      </p>
    </div>
  </div>
</template>

<script>
import NavMenu from "@/components/NavMenu";
export default {
  name: "App",
  data() {
    return {
      msg: "",
      Str: ""
    };
  },
  components: {
    NavMenu
  },
  methods: {
    cancle() {
      this.$router.push({ path: "/login" });
      sessionStorage.removeItem("name");
    }
  },
  mounted() {
    this.Str = sessionStorage.getItem("type");
    this.msg = sessionStorage.getItem("name");
  }
};
</script>

<style lang="scss" scoped>
.home-div {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  .header {
    width: 100%;
    height: 60px;
    background: rgba(7, 128, 237, 1);
    .logo-span {
      background: url("../assets/logo2.png") no-repeat 0 center;
      width: 100px;
      height: 100%;
      display: block;
      .user-div {
        margin-top: 10px;
        margin-right: 20px;
        text-align: right;
        height: 60px;
        position: absolute;
        right: 0;
        width: 300px;
        color: white;
      }
      .user-div /deep/ .el-button {
        color: white;
      }
    }
  }
  .content {
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    .left {
      flex: 0 0 13%;
      border: 1px solid white;
    }
    .right {
      box-sizing: border-box;
      height: 100%;
      flex: 1;
      padding: 20px;
      border: 1px solid white;
      background: rgba(255, 255, 255, 1);
      display: flex;
      max-width: 87%;
    }
  }
  .footer {
    width: 100%;
    height: 8%;
    background: rgba(244, 245, 249, 1);
    text-align: center;
  }
}
</style>





