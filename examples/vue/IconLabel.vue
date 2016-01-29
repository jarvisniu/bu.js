<style>

    .icon-label {
      display: inline-block;
      font-family: "Microsoft YaHei", Arial, sans-serif;
      font-size: 13px;
      cursor: default;
      padding: 0 6px 0 2px;
      height: 100%;
      /*border: solid 1px gray;*/
      /*border-radius: 3px;*/
    }

    /* children */
    .icon-label img {
      margin: 4px;
      width: 16px;
      height: 16px;
    }

    .icon-label span {
      line-height: 24px;
    }

    /* default */
    .icon-label:hover {
      background-color: #ddd;
    }

    .icon-label:active {
      background-color: #aaa;
    }

    .icon-label.selected {
      background-color: #ccc;
    }

    .icon-label.selected:hover {
      background-color: #bbb;
    }

    .icon-label.selected:active {
      background-color: #aaa;
    }

    /* theme: dark */
    .theme-dark .icon-label {
      background-color: #444;
    }

    .theme-dark .icon-label:hover {
      background-color: #777;
    }

    .theme-dark .icon-label:active {
      background-color: #333;
    }

    .theme-dark .icon-label.selected {
      background-color: #222;
    }

    .theme-dark .icon-label.selected:hover {
      background-color: #666;
    }

    .theme-dark .icon-label.selected:active {
      background-color: #333;
    }

</style>

<template>
  <div class="icon-label" :class="{selected: selected}" @click="onClick">
    <img :src="iconUrl">
  </div>
</template>

<script>

  export default {
    props: ['text', 'icon', 'label'],
    data: function () {
      return {
        selected: false
      }
    },
    computed: {
      iconUrl: function () {
        return './vue/icons/' + this.icon + '.png'
      }
    },
    methods: {
      onClick: function (ev) {
        if (!this.selected) {
          this.selected = true
          this.$parent.turnOffOthers(this)
        }
      }
    },
    compiled: function () {
      var span = this.$el
      var text = this._props['label'].raw
      var idxL = text.indexOf('(')
      var idxR = text.indexOf(')')
      if (idxL > -1 && idxR > 1 && idxR > idxL) {
        if (idxL > 0) { span.innerHTML += '<span>' + text.substring(0, idxL) + '</span>' }
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
