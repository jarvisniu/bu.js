<style>

    .image-button {
      display: flex;
      border: solid 1px transparent;
      border-radius: 2px;
      box-sizing: border-box;
      background-color: transparent;
      width: 26px;
      height: 26px;
      margin: 2px;
    }

    /* children */
    .image-button img {
      margin: 2px;
      width: 20px;
      height: 20px;
    }

    /*mouse on & down*/
    .image-button:hover {
      border-color: #aaa;
      background-color: #ccc;
    }

    .image-button:active {
      background-color: #bbb;
    }

    .image-button.selected {
      border-color: gray;
      background-color: #ccc;
    }

    .image-button.selected:hover {
      background-color: #ddd;
    }

    .image-button.selected:active {
      background-color: #bbb;
    }

    /* theme: dark */
    .theme-dark .image-button {
      background-color: #444;
    }

    .theme-dark .image-button:hover {
      background-color: #777;
    }

    .theme-dark .image-button:active {
      background-color: #333;
    }

    .theme-dark .image-button.selected {
      background-color: #222;
    }

    .theme-dark .image-button.selected:hover {
      background-color: #666;
    }

    .theme-dark .image-button.selected:active {
      background-color: #333;
    }
</style>

<template>
    <div class="image-button" :class="{selected: selected}" :title="tip" @click="onClick">
        <img :src="iconUrl">
    </div>
</template>

<script>

  export default {
    props: ['key', 'icon', 'tip'],
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
    }
  }

</script>
