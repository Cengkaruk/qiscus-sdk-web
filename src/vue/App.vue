<template>
  <div id="qcw-app"
    :class="{
      'qcw-app--not-init': !init,
      'qcw-app--wide-mode': mode === 'wide'
    }">
    <image-modal :imageModalLink="imageModalLink"
      :imageModalOn="imageModalOn"
      :closeHandler="closeImageModal">
    </image-modal>
    <chat-trigger :label="triggerLabel" :loading="loading"></chat-trigger>
    <chat-window></chat-window>
  </div>
</template>

<script>
/**
 * This component rely on ChatWindow and ChatTrigger Component
 * This component sets Vuex Store, so that all the children
 * able to access Vuex Store
 */
import store from './vuex/store'
import { changeRoom } from './vuex/actions'
import { getSelected, getRooms } from './vuex/getters'
import ChatWindow from './components/ChatWindow.vue'
import ChatTrigger from './components/ChatTrigger.vue'
import ImageModal from './components/ImageModal.vue'
import './assets/scss/base.scss'

export default {
  components: {
    ChatWindow, ChatTrigger, ImageModal
  },
  name: 'QiscusWidget',
  computed: {
    init: function() { return this.$store.state.qiscus.isInit },
    mode: function() { return qiscus.mode },
    triggerLabel() {
      return this.$store.getters.triggerLabel;
    },
    loading() {
      if(!this.$store.state.qiscus.isLogin || this.$store.state.qiscus.isLoading) return true;
      return false;
    },
    imageModalOn() {
      return this.$store.state.imageModalOn
    },
    imageModalLink() {
      return this.$store.state.imageModalLink
    }
  },
  store,
  methods: {
    closeImageModal() {
      this.$store.dispatch('closeImageModal');
    }
  }
}
</script>