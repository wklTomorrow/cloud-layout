<template>
  <div v-html="readme" class="md-div"></div>
</template>
<script>
import readmecontent from "@/assets/readMe.md";
export default {
  data() {
    return {
      readme: this.md2html(readmecontent)
    };
  }
};
</script>
<style scoped>
.md-div {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
