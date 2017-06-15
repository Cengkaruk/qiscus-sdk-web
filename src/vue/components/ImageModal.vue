<template>
  <div class="qcw-modal-overlay" :class="{'qcw-modal-overlay--on': imageModalOn }" @click="closeHandler">
    <div class="qcw-image-modal">
      <img :src="imageModalLink" :alt="imageModalLink">
      <i class="fa fa-times" @click="closeHandler"></i>
      <i class="fa fa-external-link" @click="openInNewTab"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImageModal',
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
    i.fa {
      position: absolute;
      top: -30px;
      color: #FFF;
      text-shadow: 0 0 15px rgba(0,0,0,.3);
      font-size: 20px;
      cursor: pointer;
    }
    i.fa.fa-times {
      right: 0px;
    }
    i.fa.fa-external-link {
      right: 30px;
    }
  }
</style>