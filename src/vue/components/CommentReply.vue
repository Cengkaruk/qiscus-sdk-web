<template>
  <div>
    <div class="reply-wrapper" :class="{'reply-wrapper--me': isMe }" @click="clickHandler">
      <div class="reply-sender">{{ repliedCommentSender }}</div>
      <image-loader v-if="comment.isAttachment(comment.payload.replied_comment_message)"
        :comment="comment"
        :message="comment.payload.replied_comment_message"
        :on-click-image="onClickImage"
        :callback="callback">
      </image-loader>
      <!-- <div v-if="!comment.isAttachment(comment.payload.replied_comment_message)" 
        v-html="repliedCommentMessage">
      </div> -->
      <comment-render v-if="!comment.isAttachment(comment.payload.replied_comment_message)" 
        :text="comment.payload.replied_comment_message">
      </comment-render>
    </div>
    <image-loader v-if="comment.isAttachment(comment.payload.text)"
      :comment="comment"
      :message="comment.payload.text"
      :on-click-image="onClickImage"
      :callback="callback">
    </image-loader>
    <!-- <div class="qcw-comment__content"
      v-html="repliedCommentText"
    >
    </div> -->
    <comment-render 
      v-if="!comment.isAttachment(comment.payload.text)"
      :text="comment.payload.text">
    </comment-render>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
import CommentRender from './CommentRender.vue';
export default {
  name: 'CommentReply',
  components: {ImageLoader, CommentRender},
  props: ['comment', 'isMe', 'clickHandler', 'repliedCommentSender', 'onClickImage', 'callback', 'repliedCommentMessage', 'repliedCommentText'],
}
</script>

