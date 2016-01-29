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
            <slot></slot>
        </div>
    </div>
</template>

<script>

  export default {
    methods: {
      turnOffOthers: function (child) {
        var tab = this.$children
        for (var i in tab) {
          if (!tab.hasOwnProperty(i)) continue
          if (tab[i] !== child) {
            tab[i].selected = false
          }
        }
      }
    },
    ready: function () {
      this.$children[0].selected = true
    }
  }

</script>
