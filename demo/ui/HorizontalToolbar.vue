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
    <slot></slot>
  </div>
</template>

<script>

  export default {
    methods: {
      turnOffOthers: function (child) {
        var buttons = this.$children
        for (var i in buttons) {
          if (!buttons.hasOwnProperty(i)) {
            continue
          }
          if (buttons[i] !== child) {
            buttons[i].selected = false
          }
        }
      }
    },
    ready: function () {
      this.$children[0].selected = true
    }
  }

</script>
