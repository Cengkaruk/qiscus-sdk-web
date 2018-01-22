<template>
  <div class="qcw-custom-template" v-html="finalTemplate">
  </div>
</template>

<script>
export default {
  name: 'CommentCustom',
  props: ['template', 'data'],
  data() {
    return {
      finalTemplate: '',
    };
  },
  mounted() {
    // ambil semua value dari data
    let temp = this.template;
    Object.keys(this.data).forEach(key => {
      temp = temp.replace(`{${key}}`, this.data[key]);
    });
    this.finalTemplate = temp;
  }
}
</script>