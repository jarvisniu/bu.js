<style>
    .horizontal-toolbar {
      display: inline-flex;
      border: solid 1px gray;
      margin: 8px;
      padding: 0 1px;
      box-sizing: border-box;
      height: 32px;
    }

    .horizontal-toolbar .image-button {
      margin: 2px 1px;
    }
</style>

<template>
  <div class="horizontal-toolbar">
    <image-button v-for="item in items" :model="item"></image-button>
  </div>
</template>

<script>

  export default {
    data: function () {
      return {
        items: []
      }
    },
    events: {
      "childClick": function(child) {
        var buttons = this.$children;
        for (var i in buttons) {
          if (!buttons.hasOwnProperty(i)) continue;
          if (buttons[i] !== child) {
            buttons[i].model.selected = false
          } else {
            buttons[i].model.selected = true;
            this.$dispatch("toolChanged", buttons[i].model.key);
          }
        }
      }
    }
  }

</script>
