<style>
  @import "vue/image-button.css";
</style>

<template>
    <div class="image-button" :class="{selected: model.selected}" :title="model.tip" @click="onClick">
        <img :src="model.icon">
    </div>
</template>

<script>

  export default {
    props: ['model'],
    methods: {
      onClick: function () {
        this.$dispatch("childClick", this);
      }
    }
  }

</script>
