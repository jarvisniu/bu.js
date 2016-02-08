<style>
  @import "vue/horizontal-togglebar.css";
</style>
<template>
  <div class="horizontal-togglebar">
    <icon-label v-for="item in items" :model="item"></icon-label>
  </div>
</template>

<script>

  export default {
    data: function () {
      return {
        items: [
//          {
//            icon: './vue/icons/polyline.png',
//            tip: "Polyline",
//            key: 'polyline',
//            selected: false
//          }
        ]
      }
    },
    props: ['theme'],
    events: {
      "childClick": function(child) {
        var buttons = this.$children;
        for (var i in buttons) {
          if (!buttons.hasOwnProperty(i)) continue;
          if (buttons[i] !== child) {
            buttons[i].model.selected = false
          } else {
            buttons[i].model.selected = true;
            this.$dispatch("toggleChanged", buttons[i].model.key);
          }
        }
        this.theme = 'theme-' + child.model.key
      }
    }
  }

</script>
