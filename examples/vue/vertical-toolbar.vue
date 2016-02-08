<style>
  @import "vue/vertical-toolbar.css";
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
