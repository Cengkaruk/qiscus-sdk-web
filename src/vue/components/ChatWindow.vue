<template>
  <div class="qcw-container"
    :class="{
      'qcw-container--open': windowStatus,
      'qcw-container--not-init': !init
    }">
    <div class="comment-loading-container" v-if="isLoading">
      <loader width="150px" height="150px"></loader>
    </div>
    <init-config v-if="!selected && !init && dev_mode"></init-config>
    <div v-if="!selected && !init && !dev_mode">
      <div class="qcw-header">
        Widget not yet initialized
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <h3 style="text-align: center">Please login first</h3>
    </div>
    <div v-if="init && !selected">
      <div class="qcw-header">
        Welcome, <strong>{{ userdata.username }}</strong>
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <h3 style="padding: 20px; text-align: center;">No Active Chat, please select participant to chat to</h3>
    </div>
    <div v-if="init && selected" class="widget-chat-wrapper">
      <div class="qcw-header" @click="onHeaderClicked">
        <img class="qcw-room-avatar" :src="selected.avatar || 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'" alt="Room Avatar" />
        <div v-if="!selected.custom_title">{{ selected.name }}</div>
        <div v-if="selected.custom_title">{{ selected.custom_title }}</div>
        <div v-if="mqttData.typing != ''" class="isTypingText">{{ mqttData.typing }} is typing ...</div>
        <div v-if="selected.custom_subtitle && !mqttData.typing" class="isTypingText">{{ selected.custom_subtitle }}</div>
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <div class="qcw-goto-bottom" @click="scrollToBottom" v-if="!scrollable && !showActions"><i class="fa fa-angle-double-down"></i></div>
      <ul id="messages__comments" @scroll="handleScroll">
        <load-more v-if="haveMoreComments" :isLoadingComments="isLoadingComments" :clickHandler="loadMoreComments"></load-more>
        <li v-if="selected.comments.length > 0" v-for="(comment, index) in selected.comments" :key="comment.id">
          <comment :comment="comment"
            :onupdate="scrollToBottom"
            :on-click-image="openImageModal"
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
          <i class="fa fa-image"></i>
          <input class="uploader__input" name="file" type="file" accept="image/*" @change="uploadFile" v-if="commentInput.length <= 0">
        </li>
        <li>
          <span class="qcw-attachment__label">File</span>
          <i class="fa fa-file-text"></i>
          <input class="uploader__input" name="file" type="file" @change="uploadFile" v-if="commentInput.length <= 0">
        </li>
      </ul>
      <!-- form untuk postcomment -->
      <div class="qcw-comment-form">
        <textarea placeholder="type your comment here ..."
          row="2"
          @focus="publishTyping"
          @keyup="publishTyping"
          @keydown.enter="trySubmitComment($event)"
          v-model="commentInput">
        </textarea>
        <ul class="qcw-form-actions">
          <li @click="toggleActions">
            <i class="fa fa-paperclip" v-if="!showActions"></i>
            <i class="fa fa-times" v-if="showActions"></i>
          </li>
          <li><i class="fa fa-paper-plane" @click="trySubmitComment($event)"></i></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
.qcw-room-avatar {
  max-width: 25px;
  max-height: 25px;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}
</style>

<script>
import Loader from './Loader.vue'
import Comment from './Comment.vue'
// import {chatTarget,toggleChatWindow, backToHome, submitComment, loadComments} from '../vuex/actions'
import ChatParticipants from './ChatParticipants.vue'
import InitConfig from './InitConfig.vue'
import LoadMore from './LoadMore.vue'

export default {
  components: {ChatParticipants, Comment, InitConfig, LoadMore, Loader},
  computed: {
    windowStatus: function(){ return this.$store.state.windowStatus },
    selected: function() { return this.$store.state.qiscus.selected || false},
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
  },
  data() {
    return {
      commentInput: '',
      uploads: [],
      showActions: false,
      scrollable: false
    }
  },
  created() {
    let self = this;
    // setInterval(function(){
    //   if(qiscus.selected) qiscus.sync()
    // }, 5000);
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
  methods: {
    toggleActions() {
      this.showActions = !this.showActions
    },
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
        let message = this.commentInput.trim()
        if(typeof emojione != "undefined") message = emojione.shortnameToUnicode(message)
        if(this.commentInput.trim().length < 1) return;
        this.submitComment(this.selected.last_comment_topic_id, message);
        this.commentInput = ''
        this.mqtt.publish(`r/${this.selected.id}/${this.selected.last_comment_topic_id}/fikri@qiscus.com/t`, 0);
        this.showActions = false;
      }
    },
    submitComment(topic_id, comment) {
      this.$store.dispatch('submitComment', {topic_id, comment})
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
      if(qiscus) qiscus.emit('header-clicked', 'hohohoho');
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
  }
}
</script>
