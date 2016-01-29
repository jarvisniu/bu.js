<style>
    .horizontal-togglebar {
      display: inline-flex;
      -webkit-user-select: none;
      box-sizing: border-box;
      border: solid 1px gray;
      height: 26px;
      margin: 8px;
      /*transform: rotateZ(-90deg)translateX(-100px)translateY(50px);*/
    }
</style>

<template>
  <div class="horizontal-togglebar">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    props: ['themec'],
    methods: {
      turnOffOthers: function (child) {
        var buttons = this.$children
        this.themec = 'theme-' + child._props['text'].raw.toLowerCase()
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
