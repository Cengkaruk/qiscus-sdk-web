<template>
  <div v-html="rendered_text" class="qcw-comment__content"></div>
</template>

<script>
export default {
  name: 'CommentRender',
  props: ['text'],
  data() {
    return {
      rendered_text: (typeof emojione != 'undefined') ? emojione.toImage(this.text) : this.text
    };
  },
}
</script>

