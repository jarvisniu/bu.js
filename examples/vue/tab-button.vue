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
    props: ['model'],
    methods: {
      onMouseDown: function (ev) {
        // move
        this.isMouseDown = true;
        this.mouseDownAtScreenX = ev.screenX - this.lastLeft;

        this.$dispatch("tabClick", this);
      },
      onMouseMove: function (ev) {
        if (this.isMouseDown) {
          this.lastLeft = ev.screenX - this.mouseDownAtScreenX;
          this.$el.style.left = this.lastLeft + 'px'
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
      var span = this.$el.querySelector('span');
      var text = this.model.label;
      var idxL = text.indexOf('(');
      var idxR = text.indexOf(')');
      if (idxL > -1 && idxR > 1 && idxR > idxL) {
        if (idxL > 0) {
          span.innerHTML += '<span>' + text.substring(0, idxL) + '</span>'
        }
        span.innerHTML += '<span style="text-decoration: underline">' +
            text.substring(idxL + 1, idxR) +
            '</span><span>' +
            text.substring(idxR + 1) +
            '</span>'
      } else {
        span.innerHTML += '<span>' + text + '</span>'
      }
    }
  }

</script>
