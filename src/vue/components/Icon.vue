<template>
  <svg class="qc-icon" :style="{ fill: fill }"><use :xlink:href="xlink" /></svg>
</template>

<script>
export default {
  name: 'Icon',
  props: ['name', 'fill'],
  computed: {
    xlink: function() { return `#${this.name}` },
  },
}
</script>

<style>
.qc-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: #444;
}
.qc-icon--light {
  fill: #FFF;
}
</style>

