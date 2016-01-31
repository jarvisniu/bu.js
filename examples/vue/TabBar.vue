<style>

    .tab-bar {
      -webkit-user-select: none;
      box-sizing: border-box;
      border: solid 1px gray;
      height: 30px;
      width: 500px;
      margin: 8px;
    }
    .tab-bar-container {
      display: inline-flex;
      height: 24px;
      width: 100%;
      border-bottom: solid 1px gray;
    }

    /* theme */
    .theme-light .tab-bar {
      background-color: #f8f8f8;
    }

    .theme-dark .tab-bar {
      background-color: #888;
    }

    .theme-dark .tab-bar-container {
      background-color: #444;
    }
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
