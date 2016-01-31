<style>
  .vertical-toolbar {
    border: solid 1px gray;
    /*margin: 8px;*/
    box-sizing: border-box;
    width: 32px;
    border-radius: 4px;
  }

  .theme-light .vertical-toolbar {
    background-color: #eee;
  }
</style>

<template>
  <div class="vertical-toolbar">
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
