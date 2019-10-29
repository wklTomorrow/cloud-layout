<template>
  <div class="pdf-div">
    <pdf v-for="i in numPages" :key="i" :src="src" :page="i" style="display: inline-block; width:100%"></pdf>
  </div>
</template>
<script>
import pdf from "vue-pdf";

export default {
  data() {
    return {
      src: "",
      numPages: 0
    };
  },
  components: {
    pdf
  },
  created() {
    this.src = pdf.createLoadingTask("../../static/测试.pdf");
    this.src.then(res => {
      this.numPages = res._pdfInfo.numPages;
    });
  }
};
</script>
<style scoped>
.pdf-div {
  width: 100%;
  height: 100%;
  overflow: auto;
}
pdf {
  height: 100%;
  width: 100%;
}
</style>
