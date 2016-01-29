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
    <slot></slot>
  </div>
</template>

<script>

  export default {
    props: ["onChange"],
    methods: {
      turnOffOthers: function (child) {
        var buttons = this.$children;
        for (var i in buttons) {
          if (!buttons.hasOwnProperty(i)) continue;
          if (buttons[i] !== child) {
            buttons[i].selected = false
          } else {
            if (window[this.onChange]) window[this.onChange](buttons[i].key);
          }
        }
      }
    },
    ready: function () {
      this.$children[0].selected = true
    }
  }

</script>
