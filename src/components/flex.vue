<template>
  <div class="div">
    <div class="div1"></div>
    <div class="flex1">
      <div class="flex2"></div>
      <div class="flex3"></div>
      <div class="flex4">
        <div class="flex-w1"></div>
        <div class="flex-w2"></div>
        <div class="flex-w3"></div>
        <div class="flex-w4">
          <div class="f1"></div>
          <div class="f2"></div>
          <div class="f3">
            <div class="t1"></div>
            <div class="t2"></div>
            <div class="t3"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex5"></div>
    <div class="div2"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.div {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid red;
  .div1 {
    height: 100px;
    width: 100%;
    border: 1px solid red;
  }
  .flex1 {
    display: flex;
    flex: 1;
    border: 1px solid red;
    flex-direction: column;
    .flex2 {
      flex: 0 0 10%;
      padding: 1px;
      border: 1px solid red;
      background-color: red;
    }
    .flex3 {
      flex: 0 20%;
      border: 1px solid blue;
      background-color: blue;
    }
    .flex4 {
      flex: 1;
      border: 1px solid green;
      background-color: pink;
      display: flex;
      // flex-shrink: 1;
      flex-wrap: wrap;
      // justify-content: space-between;
      .flex-w1 {
        width: 30%;
        flex: 0 0 10%;
        border: 1px solid black;
      }
      .flex-w2 {
        width: 30%;
        flex: 0 1 10%;
        border: 1px solid black;
      }
      .flex-w3 {
        width: 30%;
        flex: 1;
        border: 1px solid black;
        padding: 10px;
      }
      .flex-w4 {
        width: 100%;
        padding: 1px;
        border: 10px solid black;
        display: flex;
        .f1 {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 0;
          border: 1px solid red;
        }
        .f2 {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 0;
          border: 1px solid red;
        }
        .f3 {
          flex: 1;
          flex-grow: 2;
          flex-shrink: 1;
          border: 1px solid red;
          display: flex;
          .t1 {
            flex: 1;
            align-items: flex-end;
            background-color: yellow;
          }
          .t2 {
            flex: 1;
            background-color: green
          }
          .t3 {
            flex: 1;
            align-self: stretch;
            background-color: blue;
          }
        }
      }
    }
  }
  .div2 {
    height: 100px;
    width: 100%;
    border: 1px solid red;
  }
  .flex5 {
    flex: 0 10%;
    display: flex;
    border: 1px solid black;
  }
}
</style>


