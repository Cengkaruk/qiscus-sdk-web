<template>
  <div class="qcw-modal-overlay" :class="{'qcw-modal-overlay--on': imageModalOn }" @click="closeHandler">
    <div class="qcw-image-modal">
      <img :src="imageModalLink" :alt="imageModalLink">
      <i @click="closeHandler" class="icon--close"><icon name="ic-close"></icon></i>
      <i @click="openInNewTab" class="icon--link-out"><icon name="ic-link-out"></icon></i>
    </div>
  </div>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'ImageModal',
  components: {Icon},
  props: ['imageModalLink', 'imageModalOn', 'closeHandler'],
  methods: {
    openInNewTab() {
      window.open(this.imageModalLink)
    }
  }
}
</script>

<style lang="scss">
  .qcw-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: none;
    z-index: 9999;
    background: rgba(0,0,0,.7);
  }
  .qcw-modal-overlay--on {
    display: block;
  }
  .qcw-image-modal {
    max-width: 80%;
    max-height: 80vh;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 0 17px rgba(0,0,0,.5);
    img {
      max-width: 100%;
      display: block;
    }
    i {
      position: absolute;
      top: -30px;
      color: #FFF;
      text-shadow: 0 0 15px rgba(0,0,0,.3);
      font-size: 20px;
      cursor: pointer;
    }
    i .qc-icon {
      fill: #FFF;
    }
    i.icon--close {
      right: 0px;
    }
    i.icon--link-out {
      right: 30px;
    }
  }
</style>