<style>

    .tab-button {
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      font-family: "Microsoft YaHei", Arial, sans-serif;
      font-size: 13px;
      cursor: default;
      height: 24px;
      padding-left: 2px;
      border: solid gray;
      border-width: 0 1px 0 0;
    }

    /* children */
    .tab-button img {
      margin: 4px;
      width: 16px;
      height: 16px;
    }

    .tab-button-label {
      line-height: 24px;
    }

    .tab-button-close {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin: 5px;
      box-sizing: border-box;
      background-size: contain;
      background-image: url(vue/icons/close-default.png);
    }
    .tab-button-close:hover {
      background-image: url(vue/icons/close-hover.png);
    }
    .tab-button-close:active {
      background-image: url(vue/icons/close-down.png);
    }

    /* default */

    .tab-button {
      background-color: #ddd;
    }

    .tab-button:hover {
      background-color: #eee;
    }

    .tab-button:active {
      background-color: #eee;
    }

    .tab-button.selected {
      z-index: 1;
      background-color: #f8f8f8;
      height: 25px;
    }

    .tab-button.selected:hover {
      background-color: #f8f8f8;
    }

    .tab-button.selected:active {
      background-color: #f8f8f8;
    }

    /* theme: light */

    .theme-dark .tab-button.selected {
      border-bottom: solid 1px #f8f8f8;
    }

    /* theme: dark */
    .theme-dark .tab-button {
      background-color: #555;
    }

    .theme-dark .tab-button:hover {
      background-color: #666;
    }

    .theme-dark .tab-button:active {
      /*background-color: #333;*/
    }

    .theme-dark .tab-button.selected {
      color: white;
      background-color: #888;
      border-bottom: solid 1px #888;
    }

    .theme-dark .tab-button.selected:hover {
      background-color: #888;
    }

    .theme-dark .tab-button.selected:active {
      /*background-color: #333;*/
    }

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
