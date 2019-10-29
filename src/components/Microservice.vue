<template>
  <div class="pdf-div">
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      style="display: inline-block; width: 100%"
    ></pdf>
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
  mounted() {
    this.src = pdf.createLoadingTask("../../static/微服务架构.pdf");
    this.src.then(pdf => {
      this.numPages = pdf.numPages;
    });
  },
  // watch: {
  //     src() {
  //       //   this.src = pdf.createLoadingTask("../../static/微服务架构.pdf")
  //     }
  // }
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
