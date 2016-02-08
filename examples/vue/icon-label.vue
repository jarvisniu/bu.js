<style>
  @import url("vue/icon-label.css");
</style>

<template>
  <div class="icon-label" :class="{selected: model.selected}" @click="onClick">
    <img :src="model.icon">
  </div>
</template>

<script>

  export default {
    props: ["model"],
    methods: {
      onClick: function (ev) {
        this.$dispatch("childClick", this)
      }
    },
    ready: function () {
      var span = this.$el
      var text = this.model.label
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
