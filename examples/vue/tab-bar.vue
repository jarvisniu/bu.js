<style>
  @import "vue/tab-bar.css";
</style>

<template>
    <div class="tab-bar">
        <div class="tab-bar-container">
          <tab-button v-for="tab in tabs" :model="tab"></tab-button>
        </div>
    </div>
</template>

<script>

  export default {
    data: function() {
      return {
        tabs: [
//        {
//          icon: 'js',
//          label: "three.js",
//          selected: false
//        }
        ]
      }
    },
    events: {
      "tabClick": function(child) {
        var tabs = this.$children;
        for (var i in tabs) {
          if (!tabs.hasOwnProperty(i)) continue;
          if (tabs[i] !== child) {
            tabs[i].model.selected = false
          } else {
            tabs[i].model.selected = true;
            this.$dispatch("tabChanged", tabs[i].model.key);
          }
        }
      }
    }
  }

</script>
