<style>
  @import "vue/tab-button.css";
</style>

<template>
    <div class="tab-button" :class="{selected: model.selected}"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp">
        <img :src="model.icon">
        <span class="tab-button-label"></span>
        <span class="tab-button-close" @click="onCloseDown"></span>
    </div>
</template>

<script>

  export default {
    props: [
      'model'
    ],
    data: function() {
      return {
        pixelRatio: window.devicePixelRatio || 1,
        isMouseDown: false,
        lastLeft: 0,
      }
    },
    methods: {
      onMouseDown: function (ev) {
        // move
        this.isMouseDown = true;
        this.mouseDownAtScreenX = ev.screenX / this.pixelRatio - this.lastLeft;

        this.$dispatch("tabClick", this);
      },
      onMouseMove: function (ev) {
        if (this.isMouseDown) {
          this.lastLeft = ev.screenX / this.pixelRatio - this.mouseDownAtScreenX;
          this.$el.style.left = this.lastLeft + 'px';
        }
      },
      onMouseUp: function (ev) {
        this.isMouseDown = false;
        this.lastLeft = 0;
        this.$el.style.left = this.lastLeft + 'px'
      },
      onCloseDown: function (ev) {
        return false
      }
    },
    ready: function () {
      this.$el.querySelector('span').innerText = this.model.label;
      this.$dispatch("childChanged");
    }
  }

</script>
