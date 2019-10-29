<template>
  <div class="equip">
    <div class="equip-header">
      <div class="equip-search">
        <el-input placeholder="search..." v-model="search" style="width:60%;margin-left:10px"></el-input>
        <el-button type="primary" style="dispaly:inline-block;margin-left:10px">查询</el-button>
      </div>
      <div class="equip-button">
        <el-button style="position:absolute;right:0 ;width:10%" type="primary" icon="el-icon-plus">新增</el-button>
        <el-button
          style="position:absolute;right:10% ;width:10%; margin-right:10px"
          type="primary"
        >导入</el-button>
        <el-button style="position:absolute;right:20% ;width:10%;margin-right:20px">导出</el-button>
      </div>
    </div>
    <div class="equip-table">
      <el-table
        :data="tableData"
        style="width:100%"
        height="250"
        stripe
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{background:'rgba(238,244,252,1)','text-align':'center'}"
      >
        <el-table-column prop="name" label="设备名称" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="coding" label="第三方编码" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="type" label="设备类型" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="space" label="所在空间" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="template" label="测点模板" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="status" label="物联状态" min-width="180" width="auto"></el-table-column>
        <el-table-column prop="operation" label="操作" min-width="180" width="auto">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="equip-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        style="position:relative;text-align:right"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      tableData: [
        {
          name: "1",
          coding: `1`,
          type: `1`,
          space: `q1`,
          template: `1`,
          status: `1`
        }
      ]
    };
  },
  methods: {
    edit(ele) {
      console.log(ele);
    },
    deleteRow(val) {
      console.log(val);
    },
    handleSizeChange(e) {
      console.log(e);
    },
    handleCurrentChange(e) {
      console.log(e);
    }
  }
};
</script>
<style lang="scss" scoped>
.equip {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .equip-header {
    height: 10%;
    width: 100%;
    display: flex;
    .equip-search {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .equip-button {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
  .equip-table {
    flex: 1;
  }
  .equip-page {
    height: 10%;
    width: 100%;
    & /deep/ .el-pager li.active {
      background-color: #409eff !important;
      border-radius: 50%;
      color: #ffffff;
      min-width: 28px;
    }
  }
}
</style>