<template>
  <svg class="icon"><use :xlink:href="xlink" /></svg>
</template>

<script>
export default {
  name: 'Icon',
  props: ['name'],
  computed: {
    xlink: function() { return `#${this.name}` },
  },
}
</script>

<style>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: #444;
}
.icon--light {
  fill: #FFF;
}
</style>

