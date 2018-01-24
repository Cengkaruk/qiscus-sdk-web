<template>
  <div class="qcw-custom-template" v-html="finalTemplate">
  </div>
</template>

<script>
export default {
  name: 'CommentCustom',
  props: ['data'],
  data() {
    return {
      finalTemplate: '',
    };
  },
  mounted() {
    // ambil dulu templatenya
    let temp = QiscusSDK.core.customTemplates[this.data.payload.type];
    if(!temp) return this.finalTemplate = '<div>No template provided</div>';
    let rgx = /{(.*?)}/g;
    temp.match(rgx).forEach(r => {
      // ambil array datanya
      let val = this.data.payload;
      r.substring(1, r.length-1)
        .split('.')
        .forEach(k => {
          val = val[k];
        });
      temp = temp.replace(r, val);
    });
    this.finalTemplate = temp;
  }
}
</script>