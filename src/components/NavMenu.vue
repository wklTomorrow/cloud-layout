<template>
  <div class="xunhuan">
    <el-tree
      ref="tree"
      :data="navs"
      :props="defaultProps"
      accordion
      :highlight-current="highlight_current"
      node-key="count"
      icon-class=" el-icon-arrow-right"
      @node-click="handleNodeClick"
      :render-content="renderContent"
    ></el-tree>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navs: [],
      highlight_current: true,
      defaultProps: {
        children: "children",
        label: function(data) {
          return data.meta.title;
        }
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      if (!data.children) {
        // this.highlight_current.push(data.count)
        // this.highlight_current = true;
        if (data.path && data.path.indexOf("http:") > -1) {
          this.$router.push({
            path: "/home/NavIframe",
            query: { url: data.path }
          });
        } else {
          this.$router.push({ path: "/home/" + data.path });
        }
      } else {
        // //每次点击父节点，子节点的亮度保持不变
        let Fpath = this.$route.fullPath.split("/");
        data.children.forEach(ele => {
          if (Fpath[2].indexOf("=") > -1) {
            let UrlPath = Fpath[2].substr(14, Fpath[2].length - 14);
            let myPath = UrlPath.replace(/%3A/g, ":");
            let PATH = myPath.replace(/%2F/g, "/");
            if (ele.path == PATH) {
              this.$refs.tree.setCurrentKey(ele.count);
            }
          } else {
            if (ele.path == Fpath[2]) {
              this.$refs.tree.setCurrentKey(ele.count);
            }
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      if (data.children) {
        return (
          <span>
            <span style="padding-left:12px;padding-right:12px">
              <i class={data.class}></i>
            </span>
            <span>{node.label}</span>
          </span>
        );
      } else {
        return <span class="el-tree-node__label">{node.label}</span>;
      }
    }
  },
  created() {
    this.axios.get("../../static/menu.json").then(res => {
      if ((res.staus = 200)) {
        this.navs = res.data;
        let paths = this.$route.fullPath.split("/");
        this.$nextTick(function() {
          let ckNode = null;
          for (let node of this.navs) {
            if (node.children && node.children.length) {
              for (let cnode of node.children) {
                if (paths.length < 3) {
                  if (cnode.selected) {
                    ckNode = cnode;
                    this.$refs.tree.store.nodesMap[node.count].expanded = true;
                    this.$refs.tree.setCurrentKey(ckNode.count);
                    this.handleNodeClick(ckNode);
                  }
                } else {
                  if (paths[2].indexOf("=") > -1) {
                    let UrlPath1 = paths[2].substr(14, paths[2].length - 14);
                    let myPath1 = UrlPath1.replace(/%3A/g, ":");
                    let PATH1 = myPath1.replace(/%2F/g, "/");
                    if (cnode.path == PATH1) {
                      ckNode = cnode;
                      this.$refs.tree.store.nodesMap[
                        node.count
                      ].expanded = true;
                      this.$refs.tree.setCurrentKey(ckNode.count);
                      this.handleNodeClick(ckNode);
                    }
                  } else {
                    if (cnode.path == paths[2]) {
                      ckNode = cnode;
                      this.$refs.tree.store.nodesMap[
                        node.count
                      ].expanded = true;
                      this.$refs.tree.setCurrentKey(ckNode.count);
                      this.handleNodeClick(ckNode);
                    }
                  }
                }
              }
            }
          }
        });
      }
    });
  },
  watch: {
    //后退整个页面动态变化
    $route(to, from) {
      let nodes = null;
      let toPATH1 = "";
      let that = this;
      let toNode = to.fullPath.split("/");
      if (toNode[2].indexOf("=") > -1) {
        let toUrlPath1 = toNode[2].substr(14);
        let tomyPath1 = toUrlPath1.replace(/%3A/g, ":");
        toPATH1 = tomyPath1.replace(/%2F/g, "/");
      } else {
        toPATH1 = toNode[2];
      }
      let fromNode = from.fullPath.split("/");
      this.navs.forEach(ele => {
        if (ele.children && ele.children.length) {
          ele.children.forEach(l => {
            if (fromNode.length == 3) {
              that.$refs.tree.store.nodesMap[ele.count].expanded = false; //父节点全部关闭
              if (toPATH1 == l.path) {
                that.handleNodeClick(l);
                that.$nextTick(() => {
                  that.$refs.tree.store.nodesMap[ele.count].expanded = true; //父节点展开
                });
                that.$refs.tree.setCurrentKey(l.count);
              }
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.xunhuan /deep/ .el-tree-node__content {
  height: 48px;
  color: rgba(51, 51, 51, 1);
  padding-left: 0px !important;
  font-size: 14px;
}
.xunhuan /deep/ .el-tree-node__content .el-tree-node__label {
  padding-left: 38px;
  color: rgba(102, 102, 102, 1);
}
.xunhuan /deep/ .el-tree-node__content:hover {
  color: rgb(64, 158, 255);
}
.xunhuan /deep/ .el-tree-node__content .el-tree-node__label:hover {
  color: rgb(64, 158, 255);
}
.el-tree--highlight-current
  /deep/
  .el-tree-node.is-current
  > .el-tree-node__content:before {
  content: "";
  background-color: rgb(64, 158, 255);
  width: 4px;
  height: 80%;
  float: left;
  position: absolute;
}
</style>
<style>
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
.el-tree-node__content > .el-tree-node__expand-icon {
  position: absolute;
  right: 0px;
  padding: 6px;
}
</style>

