<template>
  <div class="div">
    <div v-html="SpringCloud" class="md-div"></div>
  </div>
</template>
<script>
import SpringCloudcontent from "@/assets/SpringCloud.md";
export default {
  data() {
    return {
      SpringCloud: this.md2html(SpringCloudcontent)
    };
  },
  mounted() {
  }
};
</script>
<style scoped>
.div {
  height: 100%;
  width: 100%;
}
.md-div {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>


