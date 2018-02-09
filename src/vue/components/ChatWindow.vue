<template>
  <div class="qcw-container"
    :class="{
      'qcw-container--open': windowStatus,
      'qcw-container--not-init': !init
    }">
    <svg-icon></svg-icon>
    <!-- <picker set="emojione" :exclude="excludedEmoji" title="" 
      @click="addEmoji" class="qcw-emoji-picker" 
      :class="{'qcw-emoji-picker--active': toggleEmoji}" v-if="showEmojiPicker" /> -->
    <div class="comment-loading-container" v-if="isLoading">
      <loader width="150px" height="150px"></loader>
    </div>
    <div v-if="!selected && !init && !dev_mode">
      <div class="qcw-header">
        Widget not yet initialized
        <i @click.stop="toggleChatWindow"><icon name="ic-chevron-down" class="icon--light"></icon></i>
      </div>
      <h3 style="text-align: center">Please login first</h3>
    </div>
    <div v-if="init && !selected">
      <div class="qcw-header">
        Welcome, <strong>{{ userdata.username }}</strong>
        <i @click.stop="toggleChatWindow"><icon name="ic-chevron-down" class="icon--light"></icon></i>
      </div>
      <h3 style="padding: 20px; text-align: center;">No Active Chat, please select participant to chat to</h3>
    </div>
    <div v-if="init && selected" class="widget-chat-wrapper">
      <div class="qcw-header">
        <div class="qcw-header__main" @click="onHeaderClicked">
          <img class="qcw-room-avatar" :src="selected.avatar || 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'" alt="Room Avatar" />
          <div v-if="!selected.custom_title">{{ selected.name }}</div>
          <div v-if="selected.custom_title">{{ selected.custom_title }}</div>
          <div v-if="mqttData.typing != ''" class="isTypingText">{{ mqttData.typing }} is typing ...</div>
          <div v-if="!mqttData.typing && chatmateStatus && selected.room_type != 'group'" class="isTypingText">{{ chatmateStatus }}</div>
          <div v-if="selected.custom_subtitle && !mqttData.typing" class="isTypingText">{{ selected.custom_subtitle }}</div>
        </div>
        <i @click.stop="toggleChatWindow"><icon name="ic-chevron-down" class="icon--light"></icon></i>
      </div>
      <div class="qcw-goto-bottom" @click="scrollToBottom" v-if="!scrollable && !showActions && replied_comment == null">
        <i><icon name="ic-chevron-down" fill="#CCC"></icon></i>
      </div>
      <ul id="messages__comments" @scroll="handleScroll">
        <load-more v-if="haveMoreComments" :isLoadingComments="isLoadingComments" :clickHandler="loadMoreComments"></load-more>
        <li v-if="selected.comments.length > 0" v-for="(comment, index) in selected.comments" :key="comment.id">
          <comment :comment="comment"
            :onupdate="scrollToBottom"
            :on-click-image="openImageModal"
            :replyHandler="setReply"
            :comment-before="(index-1 < 0) ? null : selected.comments[index-1]"
            :comment-after="(index+1 <= selected.comments.length-1) ? selected.comments[index+1] : null"
            :userdata="userdata">
          </comment>
        </li>
        <li v-if="uploads.length > 0" v-for="upload in uploads">
          <div class="qcw-upload-info">Uploading {{ upload }} ...</div>
        </li>
      </ul>
      <!-- actions untuk attachment -->
      <ul class="qcw-attachment__actions" :class="{'qcw-attachment__actions--active': showActions}">
        <li>
          <span class="qcw-attachment__label">Image</span>
          <icon name="ic-image"></icon>
          <input class="uploader__input" name="file" type="file" accept="image/*" @change="uploadFile">
        </li>
        <li>
          <span class="qcw-attachment__label">File</span>
          <icon name="ic-docs-upload"></icon>
          <input class="uploader__input" name="file" type="file" @change="uploadFile">
        </li>
      </ul>
      <!-- untuk preview klo reply -->
      <reply-preview
        :replied_comment="replied_comment"
        v-if="replied_comment !== null"
        :onDismiss="cancelReply">
      </reply-preview>
      <!-- end of reply -->
      <!-- form untuk postcomment -->
      <div class="qcw-comment-form">
        <textarea placeholder="type your comment here ..."
          row="2"
          @focus="commentFormHandler"
          @keyup="commentFormHandler"
          @keydown.enter="trySubmitComment($event)"
          v-model="commentInput">
        </textarea>
        <ul class="qcw-form-actions">
          <!-- <li v-if="emojione" @click="toggleEmoji">
            <icon name="ic-smiley"></icon>
          </li>end of picker -->
          <li @click="toggleActions">
            <icon name="ic-attachment" v-if="!showActions"></icon>
            <icon name="ic-close" v-if="showActions"></icon>
          </li>
          <li @click="trySubmitComment($event)"><icon name="ic-send"></icon></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
.qcw-room-avatar {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  border-radius: 50%;
}
.emoji-mart.qcw-emoji-picker {
  position: absolute;
  bottom: 50px;
  z-index: 998;
}
.qcw-container .emoji-mart-scroll {
  height: 150px !important;
}
.qcw-comment__content .emojione {
  max-width: 15px;
  display: inline-block;
  vertical-align: middle;
}
</style>

<script>
// import { Picker } from 'emoji-mart-vue'
import Loader from './Loader.vue'
import Comment from './Comment.vue'
import SvgIcon from './SVGIcon.vue'
import Icon from './Icon.vue'
// import {chatTarget,toggleChatWindow, backToHome, submitComment, loadComments} from '../vuex/actions'
import ChatParticipants from './ChatParticipants.vue'
import LoadMore from './LoadMore.vue'
import ReplyPreview from './ReplyPreview.vue'

export default {
  components: {ChatParticipants, Comment, LoadMore, Loader, ReplyPreview, SvgIcon, Icon},
  computed: {
    windowStatus: function(){ return this.$store.state.windowStatus },
    selected: function() { return this.$store.state.qiscus.selected || false},
    chatmateStatus: function(){ return this.$store.state.qiscus.chatmateStatus },
    userdata: function() { return this.$store.state.qiscus.userData },
    mqtt: function() { return this.$store.state.mqtt },
    mqttData: function() { return this.$store.state.mqttData },
    init: function() { return this.$store.state.qiscus.isInit },
    dev_mode: function() { return this.$store.state.dev_mode || false },
    haveMoreComments: function() { return this.selected.comments.length > 0 && this.selected.comments[0].before_id > 0 },
    isLoadingComments: function() { return this.$store.state.isLoadingComments },
    isLoading() {
      if(this.$store.state.qiscus.isLoading) return true;
      return false;
    },
    newCommentText: function() { return this.$store.state.newCommentText },
  },
  data() {
    return {
      commentInput: '',
      uploads: [],
      showActions: false,
      scrollable: false,
      replied_comment: null,
      emojione: (typeof emojione != 'undefined') ? true : false,
      // showEmojiPicker: false,
      // excludedEmoji: ['flags', 'objects', 'recent'],
      // emojiSize: 16,
      // sheetSize: 16,
    }
  },
  created() {
    let self = this;
  },
  updated () {
    // this is basically UI business but we need to put default behaviour
    // ---- autoscroll if the screen height is not exceeding 30% of the scrollTop -----
    let commentContainer = document.getElementById('messages__comments')
    if (!commentContainer) return
    let commentContainerHeight = commentContainer.scrollHeight - commentContainer.clientHeight
    let scrollTop = commentContainer.scrollTop
    // let scrollTreshold = commentContainerHeight * 90 / 100
    let scrollTreshold = commentContainerHeight - 170
    this.scrollable = (scrollTop >= scrollTreshold) || false

    if(this.scrollable) {
      window.setTimeout(function(){
        commentContainer.scrollTop = commentContainerHeight
      }, 0)
    }
  },
  // watch: {
  //   // whenever question changes, this function will run
  //   newCommentText: function (newInput) {
  //     this.commentInput = newInput
  //   }
  // },
  methods: {
    // toggleEmoji() {
    //   this.showEmojiPicker = !this.showEmojiPicker;
    // },
    toggleActions() {
      this.showActions = !this.showActions
    },
    // addEmoji(emoji) {
    //   this.commentInput = this.commentInput + emoji.native;
    // },
    publishTyping() {
      const self = this;
      if(self.commentInput.length > 0){
        self.mqtt.publish(`r/${self.selected.id}/${self.selected.last_comment_topic_id}/${self.userdata.email}/t`, 1);
      } else {
        self.mqtt.publish(`r/${self.selected.id}/${self.selected.last_comment_topic_id}/${self.userdata.email}/t`, 0);
      }
    },
    openImageModal(link) {
      this.$store.dispatch('openImageModal', link)
    },
    backToHome() {
      this.$store.dispatch('backToHome')
    },
    subscribeTopic(room_id, topic_id) {
      this.mqtt.subscribe(`r/${room_id}/${topic_id}/t`)
      this.mqtt.subscribe(`${qiscus.userData.token}/c`)
    },
    unsubscribeTopic(room_id, topic_id) {
      this.mqtt.unsubscribe(`r/${room_id}/${topic_id}/t`)
      this.mqtt.unsubscribe(`/${qiscus.userData.token}/c`)
    },
    trySubmitComment(e) {
      if(!e.shiftKey){
        e.preventDefault();
        e.stopPropagation();
        // this code is needed for emoji implementation, dirty, but works, need to refine later
        const selector = '#qcw-app > div.qcw-container > div > div.qcw-comment-form > textarea';
        const element = document.querySelector(selector);
        this.commentInput = element.value;
        let message = this.commentInput.trim()
        if(typeof emojione != "undefined") message = emojione.shortnameToUnicode(message)
        if(this.commentInput.trim().length < 1) return;
        // this.$store.dispatch('setNewCommentText', '');
        this.commentInput = '';
        this.submitComment(this.selected.last_comment_topic_id, message);
        this.commentFormHandler();
        this.mqtt.publish(`r/${this.selected.id}/${this.selected.last_comment_topic_id}/${this.selected.email}/t`, 0);
        this.showActions = false;
      }
    },
    submitComment(topic_id, comment) {
      if(this.replied_comment == null) {
        this.$store.dispatch('submitComment', {topic_id, comment})
      } else {
        let payload = {
          text: comment,
          replied_comment_id: this.replied_comment.id,
          replied_comment_message:this.replied_comment.message,
          replied_comment_payload:null,
          replied_comment_sender_email:this.replied_comment.username,
          replied_comment_sender_username:this.replied_comment.username,
          replied_comment_type:comment.text,
        }
        this.$store.dispatch('submitCommentWithPayload', {topic_id, comment, payload_type: 'reply', payload})
        this.replied_comment = null
      }
    },
    toggleChatWindow() {
      this.$store.dispatch('toggleChatWindow')
    },
    sync(){
      if(this.selected) this.loadComments(this.selected.last_comment_topic_id);
    },
    loadMoreComments() {
      const payload = {
        topic_id: this.selected.last_comment_topic_id,
        last_comment_id: this.selected.comments[0].id
      }
      this.$store.dispatch('loadComments', payload);
    },
    chatTarget(id) {
      this.$store.dispatch('chatTarget', { email: id })
    },
    scrollToBottom: function() {
      // var element = document.getElementById('messages__comments');
      // element.scrollTop = (element.scrollHeight - element.clientHeight) + 7000;
      // get id of latest comment from selected room
      const latestCommentId = qiscus.selected.comments[qiscus.selected.comments.length-1].id
      const element = document.getElementById(latestCommentId)
      if(element) {
        element.scrollIntoView({block: 'end', behaviour: 'smooth'})
      }
    },
    onHeaderClicked() {
      if(qiscus) qiscus.emit('header-clicked');
    },
    setReply(comment) {
      this.replied_comment = {
        id: comment.id,
        username: comment.username_as,
        type: comment.type,
        message: (comment.type == 'reply') ? comment.payload.text : comment.message
      }
      document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
    },
    cancelReply() {
      this.replied_comment = null
    },
    handleScroll(e) {
      let commentContainer = document.getElementById('messages__comments')
      if (!commentContainer) return
      let commentContainerHeight = commentContainer.scrollHeight - commentContainer.clientHeight
      let scrollTop = commentContainer.scrollTop
      let scrollTreshold = commentContainerHeight - 170
      this.scrollable = (scrollTop >= scrollTreshold) || false
    },
    uploadFile(e) {
      var vm       = this;
      var files    = e.target.files || e.dataTransfer.files;
      var formData = new FormData();
      var reader   = new FileReader();
      vm.uploads.push(files[0].name);
      formData.append('file', files[0]);
      formData.append('token', qiscus.userData.token);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${qiscus.baseURL}/api/v2/sdk/upload`, true);
      xhr.onload = function() {
        if(xhr.status === 200) {
          // file(s) uploaded), let's post to comment
          var url = JSON.parse(xhr.response).results.file.url
          vm.uploads.splice(vm.uploads.indexOf(files[0].name),1)
          vm.submitComment(vm.selected.last_comment_topic_id, `[file] ${url} [/file]`);
        } else {
          vm.$toasted.error('File uploading failed')
          vm.uploads.splice(vm.uploads.indexOf(files[0].name), 1)
        }
      }
      xhr.send(formData);

      // reader.onload = (e) => { vm.uploadedFiles.push(e.target.result) };
      // reader.readAsDataURL(files[0]);
    },
    commentFormHandler() {
      // this.$store.dispatch('setNewCommentText', this.commentInput);
      this.publishTyping();
    },
  }
}
</script>
