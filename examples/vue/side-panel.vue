<style>
  .side-panel {
    display: inline-block;
    border: solid 1px gray;
    padding: 4px;
    box-sizing: border-box;
    width: 42px;
    height: 100%;
    background-image: -webkit-linear-gradient(left, #555, #444);
  }
</style>

<template>
  <div class="side-panel">
    <slot></slot>
  </div>
</template>

<script>

  export default {
  }

</script>
