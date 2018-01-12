<template>
  <div class="comment__card--container">
    <div class="comment__card--image" :style="{'background-image': 'url('+data.image+')'}"></div>
    <strong class="comment__card--title">{{ data.title }}</strong>
    <div class="comment__card--description">{{ data.description }}</div>
    <comment-buttons :buttons="data.buttons" :postbackHandler="postbackSubmit"></comment-buttons>
  </div>
</template>

<script>
import CommentButtons from './CommentButtons';

export default {
  name: 'QiscusCardComment',
  components: { CommentButtons },
  props: ['data'],
  methods: {
    postbackSubmit(button) {
      const topicId = qiscus.selected.id
      // qiscus.submitComment(topicId, button.label, null, 'button_postback_response', JSON.stringify(button.payload))
      const labelToSend = button.postback_text ? button.postback_text : button.label;
      qiscus.submitComment(topicId, labelToSend, null, 'button_postback_response', JSON.stringify(button.payload))
    },
  }
}
</script>

