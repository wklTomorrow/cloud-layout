<template>
  <div class="i-box">
    <iframe :src="src" frameborder="0"></iframe>
  </div>
</template>
<script>
import { watch } from "fs";
export default {
  data() {
    return {
      src: ""
    };
  },
  created() {
    this.src = this.$route.query.url;
  },
  watch: {
    $route() {
      this.src = this.$route.query.url;
    }
  }
};
</script>
<style scoped>
.i-box {
    height: 100%;
    width: 100%;
}
iframe {
    height: 100%;
    width: 100%;
}
</style>
