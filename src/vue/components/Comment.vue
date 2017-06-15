<template>
  <div class="qcw-comment-container" :id="comment.id">
    <div class="qcw-comment-date" v-if="showDate">
      - {{ dateToday }} - 
    </div>
    <div class="qcw-comment" :class="{
      'comment--me': comment.username_real == myemail,
      'comment--parent': isParent,
      'comment--mid': isMid,
      'comment--last': isLast
    }">
      <!-- <avatar :src="comment.avatar"></avatar> -->
      <div class="qcw-comment__message">
        <div class="qcw-comment__info" v-if="isParent">
          <span class="qcw-comment__username">{{comment.username_as}}</span>
          <span class="qcw-comment__time" v-if="isParent">{{comment.time}}</span>
        </div>
        <!-- CommentType: "TEXT" -->
        <div v-if="comment.type == 'text' || comment.type == 'reply'">
          <image-loader v-if="comment.isAttachment()"
            :comment="comment"
            :on-click-image="onClickImage"
            :callback="onupdate">
          </image-loader>
          <div v-if="comment.type == 'reply'">
            <div class="reply-wrapper" :class="{'reply-wrapper--me': isMe }">
              <div v-html="replied_comment_sender" class="reply-sender"></div>
              <div v-html="replied_comment_message"></div>
            </div>
            <div v-html="replied_comment_text" class="qcw-comment__content"></div>
          </div>
          <div v-html="message" v-if="!comment.isAttachment() && comment.type=='text'" class="qcw-comment__content"></div>
          <span class="qcw-comment__time qcw-comment__time--children" 
            v-if="!isParent"
            :class="{'qcw-comment__time--attachment': comment.isAttachment()}">
            {{comment.time}}
          </span>
          <div v-if="isMe">
            <i class="qcw-comment__state fa fa-clock-o" v-if="comment.isPending"></i>
            <i class="qcw-comment__state fa fa-check" v-if="comment.isSent && !comment.isDelivered"></i>
            <i class="qcw-comment__state fa fa-times-circle" v-if="comment.isFailed" @click="resend(comment)"></i>
            <div class="qcw-comment__state qcw-comment__state--delivered" v-if="comment.isDelivered && !comment.isRead">
              <i class="fa fa-check"></i><i class="fa fa-check"></i>
            </div>
            <div class="qcw-comment__state qcw-comment__state--read" v-if="comment.isRead">
              <i class="fa fa-check"></i><i class="fa fa-check"></i>
            </div>
          </div> <!-- end of comment icons -->
        </div>
        <!-- CommentType: "ACCOUNT_LINKING" -->
        <div v-if="comment.type == 'account_linking'">
          <div class="qcw-comment__content" v-html="message"></div>
          <div class="action_buttons">
            <button @click="openAccountBox">{{ comment.payload.params.button_text }} &rang;</button>
          </div>
        </div>
        <!-- CommentType: "BUTTON" -->
        <div v-if="comment.type == 'buttons'">
          <div class="qcw-comment__content" v-html="comment.payload.text || message"></div>
          <div class="action_buttons" v-for="button in comment.payload.buttons">
            <button @click="postbackSubmit(button)" v-if="button.type == 'postback'">
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmbedJS from 'embed-js';
// import marked from 'marked';
import ImageLoader from './ImageLoader.vue';
// import highlight from 'highlight.js';
// import Avatar from './Avatar';

export default {
  // components: { Avatar },
  props: ['comment','onupdate', 'onClickImage', 'commentBefore', 'commentAfter'],
  components: { ImageLoader },
  updated(){
    // this.onupdate();
  },
  computed: {
    myemail() { return qiscus.email },
    isParent() { return this.commentBefore == null || this.commentBefore.username_real != this.comment.username_real; },
    isMid() { return this.commentAfter != null && !this.isParent && this.commentAfter.username_real == this.comment.username_real; },
    isLast() { return this.commentAfter == null || this.commentAfter.username_real != this.comment.username_real; },
    isMe () { return this.comment.username_real == this.myemail },
    showDate() { return this.commentBefore === null || (this.commentBefore.date != this.comment.date) },
    renderedComment() { return (typeof emojione != "undefined") ? emojione.toShort(this.comment.message) : this.comment.message }
  },
  created() {
    if(!this.comment.isAttachment()) {
      this.message = this.comment.message
      this.x.text((data) => {
        this.message = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      });
    }
    if(this.comment.type == 'reply') {
      this.y.text((data) => {
        this.replied_comment_message = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      })
      new EmbedJS({
        input: this.comment.payload.text,
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: { target: '_blank' }
      }).text( data => {
        this.replied_comment_text = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      })
    }
  },
  methods: {
    openAccountBox() {
      window.open(this.comment.payload.url, 'AccountLinkingPopup', 'width=500,height=400,location=no,menubar=no,resizable=1,status=no,toolbar=no')
    },
    postbackSubmit(button) {
      const topicId = qiscus.selected.id
      qiscus.submitComment(topicId, button.label, null, 'button_postback_response', JSON.stringify(button.payload))
    },
    resend(comment){
      this.$store.dispatch('resendComment', comment)
    },
  },
  data () {
    return {
      message: '',
      replied_comment_message: '',
      replied_comment_text: '',
      replied_comment_sender: (this.comment.type=='reply') ? this.comment.payload.replied_comment_sender_username : '',
      dateToday: new Date(this.comment.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      me: qiscus.email,
      x: new EmbedJS({
        input: this.comment.message,
        googleAuthKey: 'AIzaSyAO1Oui55SvTwdk4XCMzmAgr145urfQ9No',
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: {
          target: '_blank'
        },
      }),
      y: new EmbedJS({
        input: (this.comment.type == 'reply') ? this.comment.payload.replied_comment_message : '.',
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: { target: '_blank' }
      })
    }
  }
}
</script>