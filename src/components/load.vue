<template>
  <div>
    <div id="onload">
      <div id="img-container">
        <div class="img" @click="select">
          <span class="icon">+</span>
        </div>
        <input type="file" id="input" multiple />
      </div>
    </div>
    <button class="submit" @click="submit">submit</button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    submit() {},
    select() {
        document.querySelector("#input").value = null;
        document.querySelector('#input').click();
        document.querySelector("#input").addEventListener('change',handleFileSelect(value), false)
    },
    handleFileSelect(){
        
    },
  }
};
</script>
<style lang="scss" scoped>
#onload {
  position: relative;
  width: 300px;
  height: 300px;
  #img-container {
    height: 100%;
    width: 100%;
    background-color: rebeccapurple;
    .img {
      height: 100%;
      width: 100%;
      background-color: aliceblue;
      .icon{
          width: 300px;
          height: 300px;
          position: relative;
          left: 80px;
          top: 50px;
          font-size: 200px;
          text-align: center;
          align-items: center;
      }
    }
    #input {
      display: none;
    }
  }
}
</style>