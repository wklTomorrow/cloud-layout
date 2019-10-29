<template>
  <div class="building">
    <div class="menu">
      <div class="menu-header">
        <span>&nbsp;&nbsp;&nbsp;建筑</span>
      </div>
      <div class="menu-body">
        <el-menu>
          <el-menu-item>
            <span slot="title">航站楼</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="detail">
      <div class="detail-header">
        <div class="detail-header-left">
          <h3>&nbsp;&nbsp;&nbsp;航站楼</h3>
          <p>&nbsp;&nbsp;&nbsp;用途:</p>
          <p style="color:rgb(64, 158, 255);">&nbsp;&nbsp;&nbsp;更多信息></p>
        </div>
        <div class="detail-header-right">
          <div class="right-button">
            <el-button>修改信息</el-button>
            <el-button>删除建筑</el-button>
          </div>
          <div class="right-content">
            <div class="hot-load">
              <p>设计热电荷</p>
              <h3>---KW</h3>
            </div>
            <div class="divid1"></div>
            <!-- <el-divider direction="vertical"></el-divider> -->
            <div class="cold-load">
              <p>设计冷电荷</p>
              <h3>---KW</h3>
            </div>
            <!-- <el-divider direction="vertical"></el-divider> -->
            <div class="divid2"></div>
            <div class="building-area">
              <p>建筑面积</p>
              <h3>---m</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-opera">
        <p>&nbsp;&nbsp;&nbsp;楼层信息</p>
        <el-button type="text" icon="el-icon-plus" style="position:absolute;right:10px">新增楼层</el-button>
      </div>
      <div class="detail-body">
        <div style="height:20%;display:flex;">
          <div style="flex:1">
            <h3>f1</h3>
            <p>房间个数:</p>
          </div>
          <div style="flex:1">
            <p>楼层高度:</p>
          </div>
          <div style="flex:1">
            <p>建筑面积:</p>
          </div>
          <div style="flex:1">
            <p>空调面积:</p>
          </div>
          <div style="flex:1">
            <p>是否为设备层:</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.building {
  height: 100%;
  width: 100%;
  display: flex;
  .menu {
    flex: 0 15%;
    border: 1px solid blueviolet;
    .menu-header {
      height: 10%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid lightblue;
    }
    .menu-body {
      height: 90%;
      overflow: auto;
    }
  }
  .detail {
    flex: 1;
    margin: 20px;
    border: 1px solid brown;
    .detail-header {
      height: 20%;
      display: flex;
      background-color: lightgrey;
      .detail-header-left {
        flex: 1;
      }
      .detail-header-right {
        flex: 1;
        height: 100%;
        .right-button {
          height: 40%;
          display: flex;
          align-items: center;
          float: right;
        }
        .right-content {
          height: 60%;
          width: 100%;
          display: flex;
          float: right;
          flex-direction: row-reverse;
          position: relative;
          .hot-load,
          .cold-load,
          .building-area {
            width: 20%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .divid1 {
            position: absolute;
            height: 80%;
            width: 1px;
            right: 20%;
            background-color: red;
          }
          .divid2 {
            position: absolute;
            height: 80%;
            width: 1px;
            right: 40%;
            background-color: red;
          }
          //   & /deep/ .el-divider {
          //     height: 80%;
          //     background-color: red;
          //     margin: 0;
          //     width: 1px !important;
          //   }
        }
      }
    }
    .detail-opera {
      height: 10%;
      display: flex;
      position: relative;
      align-items: center;
      border-bottom: 1px solid;
    }
    .detail-body {
      min-height: 70%;
    }
  }
}
</style>