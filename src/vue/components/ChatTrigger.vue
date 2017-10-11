<template>
  <div>
    <button class="qcw-trigger-btn" @click="toggleChatWindow">
      <Loader v-if="loading"></Loader>
      <icon name="ic-chat-buble" v-if="!loading" class="icon--light"></icon>
      {{ label || 'Chat' }}
    </button>
  </div>
</template>

<script>
import Icon from './Icon.vue'
import Loader from './Loader.vue'

export default {
  props: ['label', 'loading'],
  name: 'QiscusWidgetTrigger',
  components: { Loader, Icon },
  computed: {
    init: function() { return this.$store.state.qiscus.isInit; }
  },
  methods: { 
    toggleChatWindow() {
      if(this.init && this.loading) return false;
      this.$store.dispatch('toggleChatWindow');
    } 
  }
}
</script>