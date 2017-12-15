<template>
  <div>
    <div v-html="rendered_text" class="qcw-comment__content"></div>
  </div>
</template>

<script>
import QiscusTextParser from '../../sdk/textparser';

export default {
  name: 'CommentRender',
  props: ['text'],
  data() {
    return {
      rendered_text: this.text
    };
  },
  created() {
    this.rendered_text = QiscusTextParser.parse(this.text);
    this.rendered_text = (typeof emojione != 'undefined') ? emojione.toImage(this.rendered_text) : this.rendered_text;
  }
}
</script>

