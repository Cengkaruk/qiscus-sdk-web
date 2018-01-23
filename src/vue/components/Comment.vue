<template>
  <div class="qcw-comment-container" :id="comment.id" :class="commentClass">
    <!-- comment data -->
    <div class="qcw-comment-date" v-if="showDate">
      - {{ dateToday }} -
    </div>
    <!-- CommentType: "system_event" -->
    <div v-if="comment.type == 'system_event'" class="qcw-comment--system-event">
      {{ comment.message }}
    </div>
    <!-- for text type comment -->
    <div class="qcw-comment"
      v-if="comment.type != 'system_event'"
      :class="{
        'comment--me': comment.username_real == myemail,
        'comment--parent': isParent,
        'comment--mid': isMid,
        'comment--last': isLast
      }">
      <avatar :src="comment.avatar" v-if="options.avatar && !isMe" :class="{'qcw-avatar--hide': !isParent}"></avatar>
      <div class="qcw-comment__message">
        <!-- Comment Time -->
        <div class="qcw-comment__info" v-if="isParent">
          <span class="qcw-comment__username">{{comment.username_as}}</span>
          <span class="qcw-comment__time" v-if="isParent">{{comment.time}}</span>
        </div>
        <i @click="replyHandler(comment)" class="reply-btn" :class="{'reply-btn--me': isMe}"><icon name="ic-reply"></icon></i>
        <!-- CommentType: "contact_person" -->
        <div v-if="comment.type == 'contact_person'" class="qcw-comment--contact">
          <i><icon name="ic-user"></icon></i> <strong>{{ comment.payload.name }}</strong><br>
          <i><icon :name="(comment.payload.type=='phone') ? 'ic-phone' : 'ic-envelope'"></icon></i> <span>{{ comment.payload.value }}</span>
        </div>
        <!-- CommentType: "location" -->
        <static-map :lat="comment.payload.latitude"
          :lng="comment.payload.longitude"
          :name="comment.payload.name"
          :message="comment.message"
          :mapurl="comment.payload.map_url"
          v-if="comment.type == 'location'"></static-map>

        <!-- CommentType: "file_attachment" -->
        <file-attachment v-if="comment.type == 'file_attachment'"
          :comment="comment"
          :on-click-image="onClickImage">
        </file-attachment>
        <!-- CommentType: "TEXT" -->
        <div v-if="comment.type == 'text' || comment.type == 'reply'">
          <image-loader v-if="comment.isAttachment(comment.message) && comment.type != 'reply'"
            :comment="comment"
            :message="comment.message"
            :on-click-image="onClickImage"
            :callback="onupdate">
          </image-loader>
          <comment-reply v-if="comment.type =='reply'"
            :comment="comment"
            :isMe="isMe"
            :clickHandler="gotoComment"
            :repliedCommentSender="replied_comment_sender"
            :repliedCommentMessage="replied_comment_message"
            :repliedCommentText="replied_comment_text"
            :onClickImage="onClickImage"
            :callback="onupdate"
          ></comment-reply>
          <comment-render
            :text="comment.message" v-if="!comment.isAttachment(comment.message) && comment.type=='text'" >
          </comment-render>
          <span class="qcw-comment__time qcw-comment__time--children"
            v-if="!isParent"
            :class="{'qcw-comment__time--attachment': comment.isAttachment(comment.message)}">
            {{comment.time}}
          </span>
          <div v-if="isMe">
            <i class="qcw-comment__state"><icon name="ic-clock" class="icon--clock" v-if="comment.isPending"></icon></i>
            <i class="qcw-comment__state"><icon name="ic-check" v-if="comment.isSent && !comment.isDelivered"></icon></i>
            <i @click="resend(comment)" class="qcw-comment__state"><icon name="ic-resend" class="icon--resend" v-if="comment.isFailed"></icon></i>
            <div class="qcw-comment__state qcw-comment__state--delivered" v-if="comment.isDelivered && !comment.isRead">
              <icon name="ic-doublecheck"></icon>
            </div>
            <div class="qcw-comment__state qcw-comment__state--read" v-if="comment.isRead">
              <icon name="ic-doublecheck"></icon>
            </div>
          </div> <!-- end of comment icons -->
        </div>
        <!-- CommentType: "CARD" -->
        <comment-card :data="comment.payload"
          v-if="comment.type==='card'"></comment-card>
        <!-- CommentType: "CAROUSEL" -->
        <comment-carousel v-if="comment.type ==='carousel'" :cards="comment.payload.cards"></comment-carousel>
        <!-- CommentType: "CUSTOM" -->
        <div v-if="comment.type === 'custom'">
          <!-- <comment-carousel v-if="comment.subtype==='carousel'" :cards="comment.payload.content"></comment-carousel> -->
          <!-- render custom template and data -->
          <comment-custom :data="comment" />
        </div>
        <!-- CommentType: "ACCOUNT_LINKING" -->
        <div v-if="comment.type == 'account_linking'">
          <comment-render :text="comment.payload.text || message"></comment-render>
          <div class="action_buttons">
            <button @click="openAccountBox">{{ comment.payload.params.button_text }} &rang;</button>
          </div>
        </div>
        <!-- CommentType: "BUTTON" -->
        <div v-if="comment.type == 'buttons'">
          <div class="qcw-comment__content" v-html="comment.payload.text || message"></div>
          <comment-buttons :buttons="comment.payload.buttons" :postbackHandler="postbackSubmit"></comment-buttons>
        </div>
      </div>
      <avatar :src="comment.avatar" v-if="options.avatar && isMe" :class="{'qcw-avatar--hide': !isParent}"></avatar>
    </div>
  </div>
</template>

<script>
// import EmbedJS from 'embed-js';
// import marked from 'marked';
import ImageLoader from './ImageLoader.vue';
// import highlight from 'highlight.js';
import Avatar from './Avatar';
import CommentReply from './CommentReply';
import CommentCard from './CommentCard';
import CommentCarousel from './CommentCarousel';
import StaticMap from './StaticMap';
import FileAttachment from './FileAttachment';
import CommentRender from './CommentRender';
import CommentButtons from './CommentButtons';
import CommentCustom from './CommentCustom';
import Icon from './Icon.vue'

function searchAndReplace(str, find, replace) {
  return str.split(find).join(replace);
};
function escapeHTML(text) {
  let comment;
  comment = searchAndReplace(text, '<', '&lt;');
  comment = searchAndReplace(comment, '>', '&gt;');
  return comment;
};
export default {
  props: ['comment','onupdate', 'onClickImage', 'commentBefore', 'commentAfter', 'replyHandler'],
  components: { 
    Avatar, ImageLoader, CommentReply, CommentCard, CommentCarousel, CommentCustom,
    StaticMap, FileAttachment, CommentRender, CommentButtons, Icon 
  },
  updated(){
    // this.onupdate();
  },
  computed: {
    options() { return QiscusSDK.core.options },
    myemail() { return QiscusSDK.core.email },
    isParent() { return this.commentBefore == null || this.commentBefore.username_real != this.comment.username_real; },
    isMid() { return this.commentAfter != null && !this.isParent && this.commentAfter.username_real == this.comment.username_real; },
    isLast() { return this.commentAfter == null || this.commentAfter.username_real != this.comment.username_real; },
    isMe () { return this.comment.username_real == this.myemail },
    showDate() { return this.commentBefore === null || (this.commentBefore.date != this.comment.date) },
    renderedComment() { return (typeof emojione != "undefined") ? emojione.toShort(this.comment.message) : this.comment.message }
  },
  created() {
    // const self = this;
    // if(!self.comment.isAttachment(self.comment.message)) {
    //   self.message = self.comment.message
    //   self.x.text((data) => {
    //     self.message = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
    //   });
    // }
    // if(self.comment.type == 'reply') {
    //   self.y.text((data) => {
    //     self.replied_comment_message = (typeof emojione != 'undefined') ? emojione.toImage(data) : self.data;
    //   })
    //   new EmbedJS({
    //     input: self.comment.payload.text,
    //     excludeEmbed: ['github','youtube'],
    //     emoji: false,
    //     inlineText: false,
    //     linkOptions: { target: '_blank' }
    //   }).text( data => {
    //     self.replied_comment_text = (typeof emojione != 'undefined') ? emojione.toImage(data) : self.data;
    //   })
    // }
  },
  methods: {
    gotoComment() {
      let element = document.getElementById(this.comment.payload.replied_comment_id)
      if(!element) return
      element.scrollIntoView({block: 'end',  behaviour: 'smooth'})
    },
    openAccountBox() {
      window.open(this.comment.payload.url, 'AccountLinkingPopup', 'width=500,height=400,location=no,menubar=no,resizable=1,status=no,toolbar=no')
    },
    postbackSubmit(button) {
      const topicId = qiscus.selected.id
      const labelToSend = button.postback_text ? button.postback_text : button.label;
      qiscus.submitComment(topicId, labelToSend, null, 'button_postback_response', JSON.stringify(button.payload))
    },
    resend(comment){
      this.$store.dispatch('resendComment', comment)
    },
    isTypeOfEvent() {
      const event_type = ['create_room', 'add_member', 'join_room', 'remove_member', 'left_room', 'change_room_name', 'change_room_avatar'];
      return this.comment.type.indexOf(event_type) > -1;
    },
    searchAndReplace(str, find, replace) {
      return str.split(find).join(replace);
    },
    escapeHTML(text) {
      let comment;
      comment = this.searchAndReplace(text, '<', '&lt;');
      comment = this.searchAndReplace(comment, '>', '&gt;');
      return comment;
    },
  },
  data () {
    return {
      message: '',
      commentClass: `qcw-comment--${this.comment.type}`,
      replied_comment_message: '',
      replied_comment_text: '',
      replied_comment_sender: (this.comment.type=='reply') ? this.comment.payload.replied_comment_sender_username : '',
      dateToday: new Date(this.comment.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      me: qiscus.email,
      // x: new EmbedJS({
      //   input: this.comment.message,
      //   excludeEmbed: ['github','youtube'],
      //   locationEmbed: false,
      //   emoji: false,
      //   inlineText: false,
      //   linkOptions: {
      //     target: '_blank'
      //   },
      // }),
      // y: new EmbedJS({
      //   input: (this.comment.type == 'reply') ? this.comment.payload.replied_comment_message : '.',
      //   excludeEmbed: ['github','youtube'],
      //   locationEmbed: false,
      //   emoji: false,
      //   inlineText: false,
      //   linkOptions: { target: '_blank' }
      // }),
    }
  }
}
</script>
